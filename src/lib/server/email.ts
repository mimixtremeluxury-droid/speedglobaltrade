import { APP_NAME } from "@/lib/constants";
import { getVerificationEmailCopy, renderAuthVerificationEmail } from "@/components/emails/auth-verification-email";
import { AppLocale, VerificationIntent } from "@/lib/types";
import { readCloudflareEnv } from "@/lib/server/cloudflare";

const DEFAULT_APP_BASE_URL = "https://speedglobaltrade.mimixtremeluxury.workers.dev";
const DEFAULT_RESEND_FROM_EMAIL = "Speed Global Trade <onboarding@resend.dev>";

function toEmailTagValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "speed-global-trade";
}

function getRequiredEnv(name: "RESEND_API_KEY") {
  const value = readCloudflareEnv(name) || process.env[name];
  if (!value) {
    throw new Error(`${name} is required for the verification email flow.`);
  }
  return value;
}

function resolveAppBaseUrl(appBaseUrl?: string | null) {
  return (appBaseUrl || readCloudflareEnv("APP_BASE_URL") || process.env.APP_BASE_URL || DEFAULT_APP_BASE_URL).replace(
    /\/+$/,
    "",
  );
}

function resolveFromEmail() {
  return readCloudflareEnv("RESEND_FROM_EMAIL") || process.env.RESEND_FROM_EMAIL || DEFAULT_RESEND_FROM_EMAIL;
}

export function buildVerificationUrl(token: string, locale: AppLocale, appBaseUrl?: string | null) {
  const baseUrl = resolveAppBaseUrl(appBaseUrl);
  const url = new URL("/api/auth/verify", baseUrl);
  url.searchParams.set("token", token);
  url.searchParams.set("locale", locale);
  return url.toString();
}

export async function sendVerificationEmail({
  recipientEmail,
  recipientName,
  token,
  locale,
  intent,
  appBaseUrl,
}: {
  recipientEmail: string;
  recipientName: string;
  token: string;
  locale: AppLocale;
  intent: VerificationIntent;
  appBaseUrl?: string | null;
}) {
  const resendApiKey = getRequiredEnv("RESEND_API_KEY");
  const resendFromEmail = resolveFromEmail();
  const verifyUrl = buildVerificationUrl(token, locale, appBaseUrl);
  const copy = getVerificationEmailCopy(locale, intent);
  const html = renderAuthVerificationEmail({
    locale,
    intent,
    verifyUrl,
    recipientName,
  });
  const text = `${copy.heading}\n\n${copy.body}\n\n${copy.fallback}\n${verifyUrl}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [recipientEmail],
      subject: copy.subject,
      html,
      text,
      tags: [
        { name: "app", value: toEmailTagValue(APP_NAME) },
        { name: "intent", value: intent },
      ],
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Unable to send verification email. ${payload}`);
  }

  const payload = (await response.json()) as { id?: string };
  if (payload.id) {
    console.info("[verification-email:queued]", {
      app: APP_NAME,
      intent,
      deliveryId: payload.id,
    });
  }

  return payload;
}
