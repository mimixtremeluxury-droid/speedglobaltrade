import { UserRecord } from "@/lib/types";

export function hasCompletedDeposit(user: UserRecord | null | undefined) {
  if (!user) return false;
  return user.transactions.some((transaction) => transaction.kind === "deposit" && transaction.status === "completed");
}

export function getPendingDeposit(user: UserRecord | null | undefined) {
  if (!user) return null;
  return user.transactions.find((transaction) => transaction.kind === "deposit" && transaction.status === "pending") ?? null;
}
