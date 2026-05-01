"use client";

import { DEFAULT_LOCALE, DEMO_CREDENTIALS, EXPERT_TRADERS, INVESTMENT_PLANS, MOCK_DB_KEY } from "@/lib/constants";
import { hasCompletedDeposit } from "@/lib/account";
import {
  CopiedTraderPosition,
  ExpertTrader,
  InvestmentPlan,
  InvestmentPosition,
  MockDatabase,
  TransactionRecord,
  UserProfile,
  UserRecord,
  UserSummary,
} from "@/lib/types";
import { clamp, uid } from "@/lib/utils";

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
  country: string;
  locale: UserProfile["locale"];
};

type SettingsPatch = Partial<Pick<UserProfile, "fullName" | "country" | "locale" | "twoFactorEnabled">>;

const isBrowser = () => typeof window !== "undefined";

function buildPerformanceSeries(seed = 18240) {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const deltas = [0, 320, 180, 610, 540, 920, 1120, 910, 1380, 1640, 1980, 2260];
  return labels.map((label, index) => ({ label, value: seed + deltas[index] }));
}

function buildActivationPerformanceSeries(seed: number) {
  const labels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  });

  return labels.map((label, index) => ({
    label,
    value: Math.round(seed * (0.985 + index * 0.003)),
  }));
}

function calculateSummary(record: UserRecord): UserSummary {
  const planExposure = record.investments.reduce((sum, item) => sum + item.principal * (1 + item.roiFrom / 100), 0);
  const copiedExposure = record.copiedTraders.reduce((sum, item) => sum + item.allocation * (1 + item.roiSnapshot / 100), 0);
  const activeCapital =
    record.investments.reduce((sum, item) => sum + item.principal, 0) +
    record.copiedTraders.reduce((sum, item) => sum + item.allocation, 0);
  const totalPortfolioValue = record.summary.cashBalance + planExposure + copiedExposure;
  const baseCapital = record.summary.cashBalance + activeCapital;
  const totalReturnsPct = baseCapital === 0 ? 0 : ((totalPortfolioValue - baseCapital) / baseCapital) * 100;
  const previousValue = record.performance.at(-2)?.value ?? totalPortfolioValue;
  const dailyChange = previousValue === 0 ? 0 : ((totalPortfolioValue - previousValue) / previousValue) * 100;
  return {
    cashBalance: record.summary.cashBalance,
    activeCapital,
    totalPortfolioValue,
    totalReturnsPct,
    dailyChange,
    totalEarnings: totalPortfolioValue - baseCapital,
  };
}

function withUpdatedSummary(record: UserRecord) {
  const summary = calculateSummary(record);
  return { ...record, summary };
}

function syncPerformance(record: UserRecord) {
  const withSummary = withUpdatedSummary(record);
  if (!hasCompletedDeposit(withSummary) || withSummary.summary.totalPortfolioValue <= 0) {
    return {
      ...withSummary,
      performance: [],
    };
  }

  if (withSummary.performance.length === 0) {
    return {
      ...withSummary,
      performance: buildActivationPerformanceSeries(withSummary.summary.totalPortfolioValue),
    };
  }

  const trimmed = withSummary.performance.slice(-11);
  const label = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date());
  return {
    ...withSummary,
    performance: [...trimmed, { label, value: withSummary.summary.totalPortfolioValue }],
  };
}

function createTransaction(partial: Omit<TransactionRecord, "id" | "createdAt">): TransactionRecord {
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

function buildDemoRecord(): UserRecord {
  const investments: InvestmentPosition[] = [
    {
      id: uid(),
      planId: INVESTMENT_PLANS[2].id,
      planName: INVESTMENT_PLANS[2].name,
      principal: 3500,
      roiFrom: INVESTMENT_PLANS[2].roiFrom,
      startedAt: new Date().toISOString(),
      term: INVESTMENT_PLANS[2].term,
      status: "active",
      accent: INVESTMENT_PLANS[2].accent,
    },
  ];

  const copiedTraders: CopiedTraderPosition[] = [
    {
      traderId: EXPERT_TRADERS[0].id,
      traderName: EXPERT_TRADERS[0].name,
      allocation: 1800,
      copiedAt: new Date().toISOString(),
      roiSnapshot: EXPERT_TRADERS[0].roi,
    },
  ];

  const demo: UserRecord = {
    profile: {
      id: uid(),
      fullName: "Demo Investor",
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      country: "United Kingdom",
      joinedAt: new Date().toISOString(),
      locale: DEFAULT_LOCALE,
      tier: "Premier",
      twoFactorEnabled: true,
    },
    summary: {
      cashBalance: 12400,
      totalPortfolioValue: 0,
      activeCapital: 0,
      totalReturnsPct: 0,
      dailyChange: 0,
      totalEarnings: 0,
    },
    performance: buildPerformanceSeries(),
    investments,
    copiedTraders,
    transactions: [
      createTransaction({
        kind: "earning",
        label: "Quarterly Payout",
        amount: 1420,
        status: "completed",
        note: "Auric Alpha cycle distribution",
      }),
      createTransaction({
        kind: "deposit",
        label: "Bank Funding",
        amount: 6000,
        status: "completed",
        note: "Verified via concierge desk",
        method: "Wire Transfer",
      }),
    ],
  };

  return withUpdatedSummary(demo);
}

function createEmptyDatabase(): MockDatabase {
  return {
    users: {
      [DEMO_CREDENTIALS.email]: buildDemoRecord(),
    },
  };
}

function readDatabase(): MockDatabase {
  if (!isBrowser()) return createEmptyDatabase();
  const raw = localStorage.getItem(MOCK_DB_KEY);
  if (!raw) {
    const initial = createEmptyDatabase();
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw) as MockDatabase;
}

function writeDatabase(database: MockDatabase) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(database));
}

function mutateUser(email: string, updater: (user: UserRecord) => UserRecord) {
  const database = readDatabase();
  const target = database.users[email];
  if (!target) throw new Error("Unable to locate this investor profile.");
  const updated = syncPerformance(updater(target));
  database.users[email] = updated;
  writeDatabase(database);
  return updated;
}

export function seedMockDb() {
  if (!isBrowser()) return;
  const database = readDatabase();
  if (!database.users[DEMO_CREDENTIALS.email]) {
    database.users[DEMO_CREDENTIALS.email] = buildDemoRecord();
    writeDatabase(database);
  }
}

export function getUserRecord(email: string) {
  if (!isBrowser()) return null;
  seedMockDb();
  return readDatabase().users[email] ?? null;
}

export function createMockAccount(input: SignupInput) {
  const database = readDatabase();
  const email = input.email.trim().toLowerCase();
  if (database.users[email]) throw new Error("An account already exists for this email.");
  const record: UserRecord = withUpdatedSummary({
    profile: {
      id: uid(),
      fullName: input.fullName,
      email,
      password: input.password,
      country: input.country,
      joinedAt: new Date().toISOString(),
      locale: input.locale,
      tier: "Signature",
      twoFactorEnabled: false,
    },
    summary: {
      cashBalance: 0,
      totalPortfolioValue: 0,
      activeCapital: 0,
      totalReturnsPct: 0,
      dailyChange: 0,
      totalEarnings: 0,
    },
    performance: [],
    investments: [],
    copiedTraders: [],
    transactions: [],
  });
  database.users[email] = record;
  writeDatabase(database);
  return record;
}

export function validateCredentials(email: string, password: string) {
  const record = getUserRecord(email.trim().toLowerCase());
  if (!record || record.profile.password !== password) {
    throw new Error("Invalid email or password.");
  }
  return record;
}

export function getDemoRecord() {
  seedMockDb();
  return getUserRecord(DEMO_CREDENTIALS.email);
}

export function updateUserSettings(email: string, patch: SettingsPatch) {
  return mutateUser(email, (record) => ({
    ...record,
    profile: {
      ...record.profile,
      ...patch,
    },
  }));
}

export function requestDeposit(email: string, amount: number, method: string) {
  if (amount <= 0) throw new Error("Deposit amount must be greater than zero.");
  return mutateUser(email, (record) => {
    const pendingDeposit = record.transactions.find(
      (transaction) => transaction.kind === "deposit" && transaction.status === "pending",
    );
    if (pendingDeposit) {
      throw new Error("Complete or clear the pending deposit request before creating another one.");
    }

    return {
      ...record,
      transactions: [
        createTransaction({
          kind: "deposit",
          label: "Deposit request",
          amount,
          status: "pending",
          note: `Awaiting ${method} confirmation`,
          method,
        }),
        ...record.transactions,
      ],
    };
  });
}

export function completePendingDeposit(email: string, transactionId: string) {
  return mutateUser(email, (record) => {
    const target = record.transactions.find(
      (transaction) => transaction.id === transactionId && transaction.kind === "deposit" && transaction.status === "pending",
    );

    if (!target) {
      throw new Error("We couldn't find a pending deposit to complete.");
    }

    return {
      ...record,
      summary: {
        ...record.summary,
        cashBalance: record.summary.cashBalance + target.amount,
      },
      transactions: record.transactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              status: "completed",
              note: `${transaction.method ?? "Deposit"} confirmed and settled`,
            }
          : transaction,
      ),
    };
  });
}

export function withdrawFromAccount(email: string, amount: number, method: string) {
  return mutateUser(email, (record) => {
    if (amount <= 0) throw new Error("Withdrawal amount must be greater than zero.");
    if (amount > record.summary.cashBalance) throw new Error("Insufficient available balance.");
    return {
      ...record,
      summary: {
        ...record.summary,
        cashBalance: record.summary.cashBalance - amount,
      },
      transactions: [
        createTransaction({
          kind: "withdrawal",
          label: "Withdrawal Request",
          amount,
          status: "pending",
          note: `Awaiting ${method} release confirmation`,
          method,
        }),
        ...record.transactions,
      ],
    };
  });
}

export function investInPlan(email: string, plan: InvestmentPlan, amount: number) {
  return mutateUser(email, (record) => {
    if (amount < plan.minInvestment) throw new Error(`Minimum ticket for ${plan.name} is ${plan.minInvestment}.`);
    if (amount > record.summary.cashBalance) throw new Error("Insufficient available balance.");
    return {
      ...record,
      summary: {
        ...record.summary,
        cashBalance: record.summary.cashBalance - amount,
      },
      investments: [
        {
          id: uid(),
          planId: plan.id,
          planName: plan.name,
          principal: amount,
          roiFrom: plan.roiFrom,
          startedAt: new Date().toISOString(),
          term: plan.term,
          status: plan.premium ? "scaling" : "active",
          accent: plan.accent,
        },
        ...record.investments,
      ],
      transactions: [
        createTransaction({
          kind: "investment",
          label: `Allocated to ${plan.name}`,
          amount,
          status: "completed",
          note: `${plan.term} mandate activated`,
        }),
        ...record.transactions,
      ],
    };
  });
}

export function copyTraderAllocation(email: string, trader: ExpertTrader) {
  return mutateUser(email, (record) => {
    if (record.copiedTraders.some((item) => item.traderId === trader.id)) {
      throw new Error("This expert is already in your copied allocation.");
    }
    const allocation = clamp(trader.allocation, 500, record.summary.cashBalance);
    if (allocation > record.summary.cashBalance) throw new Error("Top up your cash balance before copying this trader.");
    return {
      ...record,
      summary: {
        ...record.summary,
        cashBalance: record.summary.cashBalance - allocation,
      },
      copiedTraders: [
        {
          traderId: trader.id,
          traderName: trader.name,
          allocation,
          copiedAt: new Date().toISOString(),
          roiSnapshot: trader.roi,
        },
        ...record.copiedTraders,
      ],
      transactions: [
        createTransaction({
          kind: "copy_trade",
          label: `Copied ${trader.name}`,
          amount: allocation,
          status: "completed",
          note: `${trader.specialty} sleeve activated`,
        }),
        ...record.transactions,
      ],
    };
  });
}
