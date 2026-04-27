"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/app/providers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function TransactionsPage() {
  const { user } = useApp();
  const [type, setType] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const rows = useMemo(() => {
    if (!user) return [];
    return user.transactions.filter((item) => {
      const typeMatch = type === "all" || item.type === type;
      const dateMatch = !dateFilter || item.createdAt.slice(0, 10) === dateFilter;
      return typeMatch && dateMatch;
    });
  }, [user, type, dateFilter]);

  return (
    <section className="glass p-5">
      <h1 className="font-heading text-2xl">Transaction History</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2">
          <option value="all">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="earning">Earnings</option>
          <option value="investment">Investment</option>
        </select>
        <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2" />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-mutedText">
            <tr><th>Type</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((txn) => (
              <tr key={txn.id} className="border-t border-white/10">
                <td className="py-2 capitalize">{txn.type}</td>
                <td>{txn.description}</td>
                <td>{formatCurrency(txn.amount)}</td>
                <td>{formatDate(txn.createdAt)}</td>
                <td className="capitalize">{txn.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
