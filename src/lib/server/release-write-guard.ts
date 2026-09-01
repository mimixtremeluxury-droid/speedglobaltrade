import { readCloudflareEnv } from "@/lib/server/cloudflare";

export class ReleaseWritePausedError extends Error {
  readonly status = 503;
  readonly code = "release_maintenance";

  constructor() {
    super("This operation is temporarily unavailable during a protected production release.");
    this.name = "ReleaseWritePausedError";
  }
}

export function isReleaseWritePaused(
  value: string | undefined = readCloudflareEnv("SGT_RELEASE_WRITE_PAUSE") ?? process.env.SGT_RELEASE_WRITE_PAUSE,
  runtime: string | undefined = process.env.NODE_ENV,
) {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "false") return false;
  if (normalized === "true") return true;
  if (normalized) return true;
  return runtime === "production";
}

export function requireReleaseWritesEnabled(value?: string, runtime?: string) {
  if (isReleaseWritePaused(value, runtime)) throw new ReleaseWritePausedError();
}
