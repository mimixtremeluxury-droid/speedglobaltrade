import { readCloudflareEnv } from "@/lib/server/cloudflare";

export type CashLedgerMode = "off" | "enforced";

export function cashLedgerMode(): CashLedgerMode {
  return (readCloudflareEnv("SGT_CASH_LEDGER_MODE") || process.env.SGT_CASH_LEDGER_MODE) === "enforced" ? "enforced" : "off";
}

export function isCashLedgerEnforced() { return cashLedgerMode() === "enforced"; }
