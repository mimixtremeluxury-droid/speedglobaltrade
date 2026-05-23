import { readCloudflareEnv } from "@/lib/server/cloudflare";

export const AUTH_UNAVAILABLE_MESSAGE = "Authentication is temporarily unavailable. Please try again shortly.";

const DEFAULT_APP_BASE_URL = "https://speedglobal.trade";
const DEFAULT_RESEND_FROM_EMAIL = "Speed Global Trade <no-reply@speedglobal.trade>";

type AuthRuntimeEnvName =
  | "APP_BASE_URL"
  | "RESEND_API_KEY"
  | "RESEND_FROM_EMAIL"
  | "SGT_PASSWORD_PEPPER"
  | "SGT_SESSION_SECRET";

export class AuthConfigurationError extends Error {
  constructor(readonly envName: AuthRuntimeEnvName) {
    super(`${envName} is required for this authentication flow.`);
    this.name = "AuthConfigurationError";
  }
}

export function isAuthConfigurationError(error: unknown): error is AuthConfigurationError {
  return error instanceof AuthConfigurationError;
}

export function readRuntimeEnv(name: AuthRuntimeEnvName) {
  return readCloudflareEnv(name) || process.env[name] || null;
}

export function getRequiredRuntimeEnv(name: AuthRuntimeEnvName) {
  const value = readRuntimeEnv(name);
  if (!value) {
    throw new AuthConfigurationError(name);
  }
  return value;
}

export function readSessionSecret() {
  return readRuntimeEnv("SGT_SESSION_SECRET");
}

export function getSessionSecret() {
  return getRequiredRuntimeEnv("SGT_SESSION_SECRET");
}

export function getPasswordPepper() {
  return getRequiredRuntimeEnv("SGT_PASSWORD_PEPPER");
}

export function getResendApiKey() {
  return getRequiredRuntimeEnv("RESEND_API_KEY");
}

export function getResendFromEmail() {
  return readRuntimeEnv("RESEND_FROM_EMAIL") || DEFAULT_RESEND_FROM_EMAIL;
}

export function resolveAuthAppBaseUrl(appBaseUrl?: string | null) {
  return (appBaseUrl || readRuntimeEnv("APP_BASE_URL") || DEFAULT_APP_BASE_URL).replace(/\/+$/, "");
}

export function toPublicAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (isAuthConfigurationError(error)) {
    return AUTH_UNAVAILABLE_MESSAGE;
  }

  return error instanceof Error ? error.message : fallbackMessage;
}
