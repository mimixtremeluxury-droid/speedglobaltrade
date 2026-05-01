"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { hasCompletedDeposit } from "@/lib/account";
import { DashboardOnboardingCard } from "@/components/dashboard/dashboard-onboarding-card";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

const filters = ["all", "deposit", "withdrawal", "earning", "investment", "copy_trade"] as const;

export default function TransactionsPage() {
  const user = useAppStore((state) => state.user);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const rows = useMemo(() => {
    if (!user) return [];
    return user.transactions.filter((transaction) => {
      const matchesFilter = filter === "all" || transaction.kind === filter;
      const query = deferredSearch.trim().toLowerCase();
      const matchesSearch =
        !query ||
        transaction.label.toLowerCase().includes(query) ||
        transaction.note.toLowerCase().includes(query) ||
        transaction.kind.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [deferredSearch, filter, user]);

  if (!user) return null;
  if (!hasCompletedDeposit(user)) return <DashboardOnboardingCard />;

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Transaction Ledger</p>
            <h1 className="mt-2 font-heading text-3xl text-ink">Clean, filterable capital activity</h1>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search transactions..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60 md:max-w-xs"
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                filter === item
                  ? "bg-gold text-midnight"
                  : "border border-white/10 bg-white/[0.03] text-body/75 hover:border-cyan/40 hover:text-cyan"
              }`}
            >
              {item === "all" ? "All" : item.replace("_", " ")}
            </button>
          ))}
        </div>
      </section>

      <section className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/8 bg-white/[0.03] text-body/55">
              <tr>
                <th className="px-5 py-4 font-medium">Type</th>
                <th className="px-5 py-4 font-medium">Label</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/6 text-body/74">
                    <td className="px-5 py-4 capitalize">{transaction.kind.replace("_", " ")}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{transaction.label}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-body/45">{transaction.note}</p>
                    </td>
                    <td className="px-5 py-4 font-heading text-ink">{formatCurrency(transaction.amount)}</td>
                    <td className="px-5 py-4">{formatDate(transaction.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em]">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-body/60">
                    No transactions match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
