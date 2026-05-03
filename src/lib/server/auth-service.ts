import { DEFAULT_LOCALE, VERIFICATION_RESEND_COOLDOWN_MS, VERIFICATION_TOKEN_TTL_MS } from "@/lib/constants";
import { AppLocale, SessionUser, VerificationIntent } from "@/lib/types";
import { createSessionToken } from "@/lib/session";
import { wait } from "@/lib/utils";
import { execute, getDb, queryFirst } from "@/lib/server/db";
import { buildVerificationUrl, sendVerificationEmail } from "@/lib/server/email";
import { getUserRowByEmail, getUserRowById } from "@/lib/server/account-service";
import { createOpaqueToken, hashPassword, hashVerificationToken, verifyPassword } from "@/lib/server/security";

type VerificationRow = {
  id: string;
  user_id: string;
  email: string;
  intent: VerificationIntent;
  token_hash: string;
  locale: AppLocale;
  redirect_path: string;
  expires_at: string;
  consumed_at: string | null;
  created_at: string;
};

type VerificationJoinRow = VerificationRow & {
  full_name: string;
  email_verified_at: string | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeLocale(locale?: string | null) {
  if (locale === "zh" || locale === "es" || locale === "ar" || locale === "hi") {
    return locale;
  }
  return DEFAULT_LOCALE;
}

async function createVerificationToken({
  userId,
  email,
  locale,
  intent,
}: {
  userId: string;
  email: string;
  locale: AppLocale;
  intent: VerificationIntent;
}) {
  const active = await queryFirst<VerificationRow>(
    `SELECT id, user_id, email, intent, token_hash, locale, redirect_path, expires_at, consumed_at, created_at
     FROM verification_tokens
     WHERE email = ? AND intent = ? AND consumed_at IS NULL
     ORDER BY datetime(created_at) DESC
     LIMIT 1`,
    [email, intent],
  );

  if (active) {
    const createdAt = new Date(active.created_at).getTime();
    if (Date.now() - createdAt < VERIFICATION_RESEND_COOLDOWN_MS) {
      throw new Error("Please wait a moment before requesting another verification email.");
    }
  }

  const token = createOpaqueToken();
  const tokenHash = await hashVerificationToken(token);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS).toISOString();

  await getDb().batch([
    getDb()
      .prepare(
        `UPDATE verification_tokens
         SET consumed_at = ?
         WHERE email = ? AND intent = ? AND consumed_at IS NULL`,
      )
      .bind(now, email, intent),
    getDb()
      .prepare(
        `INSERT INTO verification_tokens (id, user_id, email, intent, token_hash, locale, redirect_path, expires_at, consumed_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
      )
      .bind(crypto.randomUUID(), userId, email, intent, tokenHash, locale, `/${locale}/dashboard`, expiresAt, now),
  ]);

  return { token, expiresAt };
}

export async function requestSignupVerification({
  fullName,
  email,
  password,
  country,
  locale,
  appBaseUrl,
}: {
  fullName: string;
  email: string;
  password: string;
  country: string;
  locale?: string | null;
  appBaseUrl?: string | null;
}) {
  const nextEmail = normalizeEmail(email);
  const existingUser = await getUserRowByEmail(nextEmail);
  if (existingUser?.email_verified_at) {
    throw new Error("An account already exists for this email. Use login to continue.");
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const nextLocale = normalizeLocale(locale);
  const normalizedName = fullName.trim();
  const normalizedCountry = country.trim();

  const userId = existingUser?.id ?? crypto.randomUUID();

  if (existingUser) {
    await execute(
      `UPDATE users
       SET password_hash = ?, full_name = ?, country = ?, locale = ?, updated_at = ?
       WHERE id = ?`,
      [passwordHash, normalizedName, normalizedCountry, nextLocale, now, existingUser.id],
    );
  } else {
    await execute(
      `INSERT INTO users (id, email, password_hash, full_name, country, locale, tier, two_factor_enabled, email_verified_at, cash_balance, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Signature', 0, NULL, 0, ?, ?)`,
      [userId, nextEmail, passwordHash, normalizedName, normalizedCountry, nextLocale, now, now],
    );
  }

  const { token } = await createVerificationToken({
    userId,
    email: nextEmail,
    locale: nextLocale,
    intent: "signup",
  });
  await sendVerificationEmail({
    recipientEmail: nextEmail,
    recipientName: normalizedName,
    token,
    locale: nextLocale,
    intent: "signup",
    appBaseUrl,
  });

  return {
    email: nextEmail,
    verifyUrl: buildVerificationUrl(token, nextLocale, appBaseUrl),
  };
}

export async function requestLoginVerification({
  email,
  password,
  locale,
  appBaseUrl,
}: {
  email: string;
  password: string;
  locale?: string | null;
  appBaseUrl?: string | null;
}) {
  const nextEmail = normalizeEmail(email);
  const nextLocale = normalizeLocale(locale);
  const user = await getUserRowByEmail(nextEmail);
  const passwordMatches = user ? await verifyPassword(password, user.password_hash) : false;

  await wait(220);

  if (!user || !passwordMatches) {
    return { email: nextEmail };
  }

  const { token } = await createVerificationToken({
    userId: user.id,
    email: user.email,
    locale: nextLocale,
    intent: "login",
  });

  await sendVerificationEmail({
    recipientEmail: user.email,
    recipientName: user.full_name,
    token,
    locale: nextLocale,
    intent: "login",
    appBaseUrl,
  });

  return {
    email: user.email,
    verifyUrl: buildVerificationUrl(token, nextLocale, appBaseUrl),
  };
}

export async function verifyAuthToken(token: string, fallbackLocale?: string | null) {
  const tokenHash = await hashVerificationToken(token);
  const record = await queryFirst<VerificationJoinRow>(
    `SELECT vt.id, vt.user_id, vt.email, vt.intent, vt.token_hash, vt.locale, vt.redirect_path, vt.expires_at, vt.consumed_at, vt.created_at,
            u.full_name, u.email_verified_at
     FROM verification_tokens vt
     INNER JOIN users u ON u.id = vt.user_id
     WHERE vt.token_hash = ?`,
    [tokenHash],
  );
  const locale = normalizeLocale(record?.locale ?? fallbackLocale);

  if (!record) {
    return {
      ok: false as const,
      redirectPath: `/${locale}/login?notice=verification-invalid`,
    };
  }

  if (record.consumed_at) {
    return {
      ok: false as const,
      redirectPath: `/${locale}/${record.intent === "signup" ? "signup" : "login"}?notice=verification-invalid`,
    };
  }

  if (new Date(record.expires_at).getTime() < Date.now()) {
    return {
      ok: false as const,
      redirectPath: `/${locale}/${record.intent === "signup" ? "signup" : "login"}?notice=verification-expired`,
    };
  }

  const now = new Date().toISOString();
  await getDb().batch([
    getDb()
      .prepare(
        `UPDATE verification_tokens
         SET consumed_at = ?
         WHERE id = ?`,
      )
      .bind(now, record.id),
    getDb()
      .prepare(
        `UPDATE users
         SET email_verified_at = COALESCE(email_verified_at, ?), updated_at = ?
         WHERE id = ?`,
      )
      .bind(now, now, record.user_id),
  ]);

  const freshUser = await getUserRowById(record.user_id);
  if (!freshUser) {
    return {
      ok: false as const,
      redirectPath: `/${locale}/login?notice=verification-invalid`,
    };
  }

  const sessionUser: SessionUser = {
    userId: freshUser.id,
    email: freshUser.email,
    fullName: freshUser.full_name,
  };

  return {
    ok: true as const,
    redirectPath: record.redirect_path || `/${locale}/dashboard`,
    sessionToken: await createSessionToken(sessionUser),
    locale,
  };
}
