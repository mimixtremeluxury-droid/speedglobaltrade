import { DEFAULT_LOCALE, EXPERT_TRADERS, INVESTMENT_PLANS } from "@/lib/constants";
import {
  AppLocale,
  CopiedTraderPosition,
  InvestmentPosition,
  PortfolioPoint,
  TransactionRecord,
  UserProfile,
  UserRecord,
  UserSummary,
} from "@/lib/types";
import { clamp } from "@/lib/utils";
import { execute, getDb, queryAll, queryFirst } from "@/lib/server/db";

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  country: string;
  currency?: string;
  locale: AppLocale;
  tier: UserProfile["tier"];
  two_factor_enabled: number;
  email_verified_at: string | null;
  cash_balance: number;
  created_at: string;
  updated_at: string;
};

type TransactionRow = {
  id: string;
  user_id: string;
  kind: TransactionRecord["kind"];
  label: string;
  amount: number;
  status: TransactionRecord["status"];
  note: string;
  method: string | null;
  created_at: string;
  proof_submitted_at?: string | null;
  proof_file_name?: string | null;
};

type DepositProofInput = {
  fileName: string;
  fileType: string;
  fileSize: number;
  proofData: string;
};

type InvestmentRow = {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  principal: number;
  roi_from: number;
  term: string;
  status: InvestmentPosition["status"];
  accent: string;
  started_at: string;
};

type CopiedTraderRow = {
  id: string;
  user_id: string;
  trader_id: string;
  trader_name: string;
  allocation: number;
  roi_snapshot: number;
  copied_at: string;
};

type SnapshotRow = {
  id: string;
  user_id: string;
  label: string;
  value: number;
  recorded_at: string;
};

function buildSnapshotSeries(seed: number) {
  return Array.from({ length: 7 }, (_, index) => {
    const recordedAt = new Date();
    recordedAt.setUTCDate(recordedAt.getUTCDate() - (6 - index));
    const value = Math.round(seed * (0.985 + index * 0.003));
    return {
      id: crypto.randomUUID(),
      label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(recordedAt),
      value,
      recordedAt: recordedAt.toISOString(),
    };
  });
}

function mapTransaction(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    kind: row.kind,
    label: row.label,
    amount: Number(row.amount),
    status: row.status,
    createdAt: row.created_at,
    note: row.note,
    method: row.method ?? undefined,
    proofSubmittedAt: row.proof_submitted_at ?? undefined,
    proofFileName: row.proof_file_name ?? undefined,
  };
}

function mapInvestment(row: InvestmentRow): InvestmentPosition {
  return {
    id: row.id,
    planId: row.plan_id,
    planName: row.plan_name,
    principal: Number(row.principal),
    roiFrom: Number(row.roi_from),
    startedAt: row.started_at,
    term: row.term,
    status: row.status,
    accent: row.accent,
  };
}

function mapCopiedTrader(row: CopiedTraderRow): CopiedTraderPosition {
  return {
    traderId: row.trader_id,
    traderName: row.trader_name,
    allocation: Number(row.allocation),
    copiedAt: row.copied_at,
    roiSnapshot: Number(row.roi_snapshot),
  };
}

function mapSnapshot(row: SnapshotRow): PortfolioPoint {
  return {
    label: row.label,
    value: Number(row.value),
  };
}

function mapProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    country: row.country,
    currency: normalizeCurrencyCode(row.currency),
    joinedAt: row.created_at,
    locale: row.locale ?? DEFAULT_LOCALE,
    tier: row.tier,
    twoFactorEnabled: Boolean(row.two_factor_enabled),
    emailVerifiedAt: row.email_verified_at,
  };
}

function calculateSummary({
  cashBalance,
  investments,
  copiedTraders,
  performance,
}: {
  cashBalance: number;
  investments: InvestmentPosition[];
  copiedTraders: CopiedTraderPosition[];
  performance: PortfolioPoint[];
}) {
  const planExposure = investments.reduce((sum, item) => sum + item.principal * (1 + item.roiFrom / 100), 0);
  const copiedExposure = copiedTraders.reduce((sum, item) => sum + item.allocation * (1 + item.roiSnapshot / 100), 0);
  const activeCapital = investments.reduce((sum, item) => sum + item.principal, 0) + copiedTraders.reduce((sum, item) => sum + item.allocation, 0);
  const totalPortfolioValue = cashBalance + planExposure + copiedExposure;
  const baseCapital = cashBalance + activeCapital;
  const totalReturnsPct = baseCapital === 0 ? 0 : ((totalPortfolioValue - baseCapital) / baseCapital) * 100;
  const previousValue = performance.at(-2)?.value ?? totalPortfolioValue;
  const dailyChange = previousValue === 0 ? 0 : ((totalPortfolioValue - previousValue) / previousValue) * 100;

  const summary: UserSummary = {
    cashBalance,
    activeCapital,
    totalPortfolioValue,
    totalReturnsPct,
    dailyChange,
    totalEarnings: totalPortfolioValue - baseCapital,
  };

  return summary;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const depositMethodNotes: Record<string, string> = {
  "Wire Transfer": "Wire funding request opened. Contact support for verified banking instructions, then upload your payment slip for review.",
  "USDT Transfer": "USDT TRON (TRC20) funding request opened. Transfer to the displayed wallet and upload your payment proof for operations review.",
  "Bank Card": "Bank card funding request opened. Contact support for secure card processing instructions, then upload your payment receipt for review.",
};

function normalizeDepositMethod(method: string) {
  const normalized = method.trim();
  if (!depositMethodNotes[normalized]) {
    throw new Error("Choose a supported deposit method.");
  }
  return normalized;
}

function normalizeCurrencyCode(currency?: string | null) {
  const nextCurrency = currency?.trim().toUpperCase();
  return nextCurrency && /^[A-Z]{3}$/.test(nextCurrency) ? nextCurrency : "USD";
}

function isMissingCurrencyColumnError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /no such column:\s*currency|has no column named currency/i.test(message);
}

export async function ensureUsersCurrencyColumn() {
  try {
    await execute("ALTER TABLE users ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD'");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/duplicate column name:\s*currency/i.test(message)) {
      throw error;
    }
  }
}

async function ensureDepositProofsTable() {
  await execute(
    `CREATE TABLE IF NOT EXISTS deposit_proofs (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      proof_data TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
  );
  await execute("CREATE INDEX IF NOT EXISTS idx_deposit_proofs_transaction_id ON deposit_proofs(transaction_id)");
  await execute("CREATE INDEX IF NOT EXISTS idx_deposit_proofs_user_id ON deposit_proofs(user_id)");
}

async function requireUserRecord(userId: string) {
  const user = await getUserRecordById(userId);
  if (!user) {
    throw new Error("Unable to locate this investor profile.");
  }
  return user;
}

function getPlanById(planId: string) {
  const plan = INVESTMENT_PLANS.find((item) => item.id === planId);
  if (!plan) {
    throw new Error("Unable to locate the selected investment plan.");
  }
  return plan;
}

function getTraderById(traderId: string) {
  const trader = EXPERT_TRADERS.find((item) => item.id === traderId);
  if (!trader) {
    throw new Error("Unable to locate the selected expert trader.");
  }
  return trader;
}

async function listTransactions(userId: string) {
  await ensureDepositProofsTable();
  const rows = await queryAll<TransactionRow>(
    `SELECT transactions.id,
            transactions.user_id,
            transactions.kind,
            transactions.label,
            transactions.amount,
            transactions.status,
            transactions.note,
            transactions.method,
            transactions.created_at,
            deposit_proofs.submitted_at AS proof_submitted_at,
            deposit_proofs.file_name AS proof_file_name
     FROM transactions
     LEFT JOIN deposit_proofs ON deposit_proofs.transaction_id = transactions.id
     WHERE transactions.user_id = ?
     ORDER BY datetime(transactions.created_at) DESC`,
    [userId],
  );
  return rows.map(mapTransaction);
}

async function listInvestments(userId: string) {
  const rows = await queryAll<InvestmentRow>(
    `SELECT id, user_id, plan_id, plan_name, principal, roi_from, term, status, accent, started_at
     FROM investment_positions
     WHERE user_id = ?
     ORDER BY datetime(started_at) DESC`,
    [userId],
  );
  return rows.map(mapInvestment);
}

async function listCopiedTraders(userId: string) {
  const rows = await queryAll<CopiedTraderRow>(
    `SELECT id, user_id, trader_id, trader_name, allocation, roi_snapshot, copied_at
     FROM copied_trader_positions
     WHERE user_id = ?
     ORDER BY datetime(copied_at) DESC`,
    [userId],
  );
  return rows.map(mapCopiedTrader);
}

async function listSnapshots(userId: string) {
  const rows = await queryAll<SnapshotRow>(
    `SELECT id, user_id, label, value, recorded_at
     FROM portfolio_snapshots
     WHERE user_id = ?
     ORDER BY datetime(recorded_at) ASC`,
    [userId],
  );
  return rows.map(mapSnapshot);
}

async function hasCompletedDeposit(userId: string) {
  const row = await queryFirst<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM transactions
     WHERE user_id = ? AND kind = 'deposit' AND status = 'completed'`,
    [userId],
  );
  return Number(row?.count ?? 0) > 0;
}

async function syncPortfolioSnapshots(userId: string) {
  const user = await getUserRowById(userId);
  if (!user) {
    throw new Error("Unable to locate this investor profile.");
  }

  const completedDeposit = await hasCompletedDeposit(userId);
  if (!completedDeposit) {
    return;
  }

  const investments = await listInvestments(userId);
  const copiedTraders = await listCopiedTraders(userId);
  const existingSnapshots = await listSnapshots(userId);
  const summary = calculateSummary({
    cashBalance: Number(user.cash_balance),
    investments,
    copiedTraders,
    performance: existingSnapshots,
  });

  if (!existingSnapshots.length) {
    const seedSeries = buildSnapshotSeries(summary.totalPortfolioValue);
    await getDb().batch(
      seedSeries.map((point) =>
        getDb()
          .prepare(
            `INSERT INTO portfolio_snapshots (id, user_id, label, value, recorded_at)
             VALUES (?, ?, ?, ?, ?)`,
          )
          .bind(point.id, userId, point.label, point.value, point.recordedAt),
      ),
    );
    return;
  }

  const latestSnapshot = existingSnapshots.at(-1);
  if (!latestSnapshot) {
    return;
  }

  const todayLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(),
  );
  const latestRow = await queryFirst<SnapshotRow>(
    `SELECT id, user_id, label, value, recorded_at
     FROM portfolio_snapshots
     WHERE user_id = ?
     ORDER BY datetime(recorded_at) DESC
     LIMIT 1`,
    [userId],
  );

  if (!latestRow) {
    return;
  }

  const latestDate = latestRow.recorded_at.slice(0, 10);
  const todayDate = new Date().toISOString().slice(0, 10);
  if (latestDate === todayDate) {
    await execute(
      `UPDATE portfolio_snapshots
       SET label = ?, value = ?, recorded_at = ?
       WHERE id = ?`,
      [todayLabel, summary.totalPortfolioValue, new Date().toISOString(), latestRow.id],
    );
    return;
  }

  await execute(
    `INSERT INTO portfolio_snapshots (id, user_id, label, value, recorded_at)
     VALUES (?, ?, ?, ?, ?)`,
    [crypto.randomUUID(), userId, todayLabel, summary.totalPortfolioValue, new Date().toISOString()],
  );
}

export async function getUserRowById(userId: string) {
  try {
    return await queryFirst<UserRow>(
      `SELECT id, email, password_hash, full_name, country, currency, locale, tier, two_factor_enabled, email_verified_at, cash_balance, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [userId],
    );
  } catch (error) {
    if (!isMissingCurrencyColumnError(error)) {
      throw error;
    }

    const row = await queryFirst<Omit<UserRow, "currency">>(
      `SELECT id, email, password_hash, full_name, country, locale, tier, two_factor_enabled, email_verified_at, cash_balance, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [userId],
    );
    return row ? { ...row, currency: "USD" } : null;
  }
}

export async function getUserRowByEmail(email: string) {
  try {
    return await queryFirst<UserRow>(
      `SELECT id, email, password_hash, full_name, country, currency, locale, tier, two_factor_enabled, email_verified_at, cash_balance, created_at, updated_at
       FROM users
       WHERE email = ?`,
      [normalizeEmail(email)],
    );
  } catch (error) {
    if (!isMissingCurrencyColumnError(error)) {
      throw error;
    }

    const row = await queryFirst<Omit<UserRow, "currency">>(
      `SELECT id, email, password_hash, full_name, country, locale, tier, two_factor_enabled, email_verified_at, cash_balance, created_at, updated_at
       FROM users
       WHERE email = ?`,
      [normalizeEmail(email)],
    );
    return row ? { ...row, currency: "USD" } : null;
  }
}

export async function getUserRecordById(userId: string): Promise<UserRecord | null> {
  const user = await getUserRowById(userId);
  if (!user) {
    return null;
  }

  const [transactions, investments, copiedTraders] = await Promise.all([
    listTransactions(userId),
    listInvestments(userId),
    listCopiedTraders(userId),
  ]);
  const completedDeposit = transactions.some((transaction) => transaction.kind === "deposit" && transaction.status === "completed");

  if (completedDeposit) {
    await syncPortfolioSnapshots(userId);
  }

  const performance = completedDeposit ? await listSnapshots(userId) : [];
  const summary = calculateSummary({
    cashBalance: Number(user.cash_balance),
    investments,
    copiedTraders,
    performance,
  });

  return {
    profile: mapProfile(user),
    summary,
    performance,
    investments,
    copiedTraders,
    transactions,
  };
}

export async function updateUserSettings(
  userId: string,
  patch: Partial<Pick<UserProfile, "fullName" | "country" | "locale" | "twoFactorEnabled">>,
) {
  const user = await getUserRowById(userId);
  if (!user) {
    throw new Error("Unable to locate this investor profile.");
  }

  const nextFullName = patch.fullName?.trim() || user.full_name;
  const nextCountry = patch.country?.trim() || user.country;
  const nextLocale = patch.locale || user.locale;
  const nextTwoFactor = patch.twoFactorEnabled === undefined ? user.two_factor_enabled : Number(patch.twoFactorEnabled);

  await execute(
    `UPDATE users
     SET full_name = ?, country = ?, locale = ?, two_factor_enabled = ?, updated_at = ?
     WHERE id = ?`,
    [nextFullName, nextCountry, nextLocale, nextTwoFactor, new Date().toISOString(), userId],
  );

  return requireUserRecord(userId);
}

export async function requestDeposit(userId: string, amount: number, method: string) {
  if (amount <= 0) {
    throw new Error("Deposit amount must be greater than zero.");
  }
  const normalizedMethod = normalizeDepositMethod(method);

  const pending = await queryFirst<{ id: string }>(
    `SELECT id FROM transactions
     WHERE user_id = ? AND kind = 'deposit' AND status = 'pending'
     LIMIT 1`,
    [userId],
  );
  if (pending) {
    throw new Error("Complete or clear the pending deposit request before creating another one.");
  }

  await execute(
    `INSERT INTO transactions (id, user_id, kind, label, amount, status, note, method, created_at)
     VALUES (?, ?, 'deposit', 'Deposit request', ?, 'pending', ?, ?, ?)`,
    [crypto.randomUUID(), userId, amount, depositMethodNotes[normalizedMethod], normalizedMethod, new Date().toISOString()],
  );

  return requireUserRecord(userId);
}

export async function submitDepositProof(userId: string, transactionId: string, proof: DepositProofInput) {
  await ensureDepositProofsTable();

  const pendingDeposit = await queryFirst<TransactionRow>(
    `SELECT id, user_id, kind, label, amount, status, note, method, created_at
     FROM transactions
     WHERE id = ? AND user_id = ? AND kind = 'deposit' AND status = 'pending'`,
    [transactionId, userId],
  );
  if (!pendingDeposit) {
    throw new Error("We couldn't find a pending deposit request for this proof.");
  }

  const now = new Date().toISOString();
  await getDb().batch([
    getDb()
      .prepare(
        `INSERT INTO deposit_proofs (id, transaction_id, user_id, file_name, file_type, file_size, proof_data, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(transaction_id) DO UPDATE SET
          file_name = excluded.file_name,
          file_type = excluded.file_type,
          file_size = excluded.file_size,
          proof_data = excluded.proof_data,
          submitted_at = excluded.submitted_at`,
      )
      .bind(
        crypto.randomUUID(),
        transactionId,
        userId,
        proof.fileName,
        proof.fileType,
        proof.fileSize,
        proof.proofData,
        now,
      ),
    getDb()
      .prepare(
        `UPDATE transactions
         SET note = ?
         WHERE id = ? AND user_id = ?`,
      )
      .bind(
        `Payment proof uploaded (${proof.fileName}). Operations review is pending; your balance will remain unchanged until approval.`,
        transactionId,
        userId,
      ),
  ]);

  return requireUserRecord(userId);
}

export async function completePendingDeposit(userId: string, transactionId: string) {
  await ensureDepositProofsTable();

  const pendingDeposit = await queryFirst<TransactionRow>(
    `SELECT id, user_id, kind, label, amount, status, note, method, created_at
     FROM transactions
     WHERE id = ? AND user_id = ? AND kind = 'deposit' AND status = 'pending'`,
    [transactionId, userId],
  );
  if (!pendingDeposit) {
    throw new Error("We couldn't find a pending deposit to complete.");
  }

  const proof = await queryFirst<{ id: string }>(
    `SELECT id
     FROM deposit_proofs
     WHERE transaction_id = ? AND user_id = ?
     LIMIT 1`,
    [transactionId, userId],
  );
  if (!proof) {
    throw new Error("Payment proof must be uploaded before this deposit can be approved.");
  }

  const now = new Date().toISOString();
  await getDb().batch([
    getDb()
      .prepare(
        `UPDATE transactions
         SET status = 'completed', note = ?, created_at = created_at
         WHERE id = ?`,
      )
      .bind(`${pendingDeposit.method ?? "Deposit"} confirmed and settled`, transactionId),
    getDb()
      .prepare(
        `UPDATE users
         SET cash_balance = cash_balance + ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(Number(pendingDeposit.amount), now, userId),
  ]);

  await syncPortfolioSnapshots(userId);
  return requireUserRecord(userId);
}

export async function withdrawFromAccount(
  userId: string,
  amount: number,
  method: string,
  details?: {
    usdtAddress?: string;
    paypalEmail?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankRoutingNumber?: string;
    cashAppTag?: string;
  },
) {
  if (amount <= 0) {
    throw new Error("Withdrawal amount must be greater than zero.");
  }

  const user = await getUserRowById(userId);
  if (!user) {
    throw new Error("Unable to locate this investor profile.");
  }
  if (amount > Number(user.cash_balance)) {
    throw new Error("Insufficient available balance.");
  }

  const transactionId = crypto.randomUUID();
  const withdrawalCode = generateWithdrawalCode();

  const detailParts: string[] = [];
  if (details?.usdtAddress) detailParts.push(`USDT Address: ${details.usdtAddress}`);
  if (details?.paypalEmail) detailParts.push(`PayPal: ${details.paypalEmail}`);
  if (details?.bankName) detailParts.push(`Bank: ${details.bankName}`);
  if (details?.bankAccountNumber) detailParts.push(`Account: ****${details.bankAccountNumber.slice(-4)}`);
  if (details?.bankRoutingNumber) detailParts.push(`Routing: ${details.bankRoutingNumber}`);
  if (details?.cashAppTag) detailParts.push(`Cash App: ${details.cashAppTag}`);

  const note = detailParts.length > 0
    ? `Awaiting ${method} release confirmation. ${detailParts.join(", ")}`
    : `Awaiting ${method} release confirmation`;

  await getDb().batch([
    getDb()
      .prepare(
        `UPDATE users
         SET cash_balance = cash_balance - ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(amount, new Date().toISOString(), userId),
    getDb()
      .prepare(
        `INSERT INTO transactions (id, user_id, kind, label, amount, status, note, method, withdrawal_code, created_at)
         VALUES (?, ?, 'withdrawal', 'Withdrawal Request', ?, 'pending', ?, ?, ?, ?)`,
      )
      .bind(
        transactionId,
        userId,
        amount,
        note,
        method,
        withdrawalCode,
        new Date().toISOString(),
      ),
  ]);

  await syncPortfolioSnapshots(userId);
  const updatedUser = await requireUserRecord(userId);
  return { user: updatedUser, withdrawalCode };
}

function generateWithdrawalCode(): string {
  const prefix = "SGT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  const random = Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
    .slice(0, 8);
  return `${prefix}-${timestamp}-${random}`;
}

export async function investInPlan(userId: string, planId: string, amount: number) {
  const plan = getPlanById(planId);
  const user = await getUserRowById(userId);
  if (!user) {
    throw new Error("Unable to locate this investor profile.");
  }
  if (amount < plan.minInvestment) {
    throw new Error(`Minimum ticket for ${plan.name} is ${plan.minInvestment}.`);
  }
  if (amount > Number(user.cash_balance)) {
    throw new Error("Insufficient available balance.");
  }

  await getDb().batch([
    getDb()
      .prepare(
        `UPDATE users
         SET cash_balance = cash_balance - ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(amount, new Date().toISOString(), userId),
    getDb()
      .prepare(
        `INSERT INTO investment_positions (id, user_id, plan_id, plan_name, principal, roi_from, term, status, accent, started_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        userId,
        plan.id,
        plan.name,
        amount,
        plan.roiFrom,
        plan.term,
        plan.premium ? "scaling" : "active",
        plan.accent,
        new Date().toISOString(),
      ),
    getDb()
      .prepare(
        `INSERT INTO transactions (id, user_id, kind, label, amount, status, note, method, created_at)
         VALUES (?, ?, 'investment', ?, ?, 'completed', ?, NULL, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        userId,
        `Allocated to ${plan.name}`,
        amount,
        `${plan.term} mandate activated`,
        new Date().toISOString(),
      ),
  ]);

  await syncPortfolioSnapshots(userId);
  return requireUserRecord(userId);
}

export async function copyTraderAllocation(userId: string, traderId: string) {
  const trader = getTraderById(traderId);
  const user = await getUserRowById(userId);
  if (!user) {
    throw new Error("Unable to locate this investor profile.");
  }

  const existing = await queryFirst<{ id: string }>(
    `SELECT id FROM copied_trader_positions
     WHERE user_id = ? AND trader_id = ?
     LIMIT 1`,
    [userId, trader.id],
  );
  if (existing) {
    throw new Error("This expert is already in your copied allocation.");
  }

  const cashBalance = Number(user.cash_balance);
  const allocation = clamp(trader.allocation, 500, cashBalance);
  if (allocation > cashBalance) {
    throw new Error("Top up your cash balance before copying this trader.");
  }

  await getDb().batch([
    getDb()
      .prepare(
        `UPDATE users
         SET cash_balance = cash_balance - ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(allocation, new Date().toISOString(), userId),
    getDb()
      .prepare(
        `INSERT INTO copied_trader_positions (id, user_id, trader_id, trader_name, allocation, roi_snapshot, copied_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(crypto.randomUUID(), userId, trader.id, trader.name, allocation, trader.roi, new Date().toISOString()),
    getDb()
      .prepare(
        `INSERT INTO transactions (id, user_id, kind, label, amount, status, note, method, created_at)
         VALUES (?, ?, 'copy_trade', ?, ?, 'completed', ?, NULL, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        userId,
        `Copied ${trader.name}`,
        allocation,
        `${trader.specialty} sleeve activated`,
        new Date().toISOString(),
      ),
  ]);

  await syncPortfolioSnapshots(userId);
  return requireUserRecord(userId);
}
