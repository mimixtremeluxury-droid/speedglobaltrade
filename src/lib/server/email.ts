import { APP_NAME } from "@/lib/constants";
import { getVerificationEmailCopy, renderAuthVerificationEmail } from "@/components/emails/auth-verification-email";
import { AppLocale, VerificationIntent } from "@/lib/types";

function getRequiredEnv(name: "APP_BASE_URL" | "RESEND_API_KEY" | "RESEND_FROM_EMAIL") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for the verification email flow.`);
  }
  return value;
}

export function buildVerificationUrl(token: string, locale: AppLocale) {
  const appBaseUrl = getRequiredEnv("APP_BASE_URL").replace(/\/+$/, "");
  const url = new URL("/api/auth/verify", appBaseUrl);
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
}: {
  recipientEmail: string;
  recipientName: string;
  token: string;
  locale: AppLocale;
  intent: VerificationIntent;
}) {
  const resendApiKey = getRequiredEnv("RESEND_API_KEY");
  const resendFromEmail = getRequiredEnv("RESEND_FROM_EMAIL");
  const verifyUrl = buildVerificationUrl(token, locale);
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
        { name: "app", value: APP_NAME },
        { name: "intent", value: intent },
      ],
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Unable to send verification email. ${payload}`);
  }
}
