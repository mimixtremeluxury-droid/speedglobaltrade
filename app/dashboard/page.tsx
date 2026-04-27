"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useApp } from "@/app/providers";
import { formatCurrency, formatDate } from "@/lib/utils";

const COLORS = ["#F5B042", "#2A4B9C", "#34D399"];

export default function DashboardOverviewPage() {
  const { user, loading } = useApp();
  if (loading || !user) return <div className="glass h-64 animate-pulse" />;

  const active = user.investments.filter((item) => item.status === "active");
  const chartData = active.map((item) => ({ name: item.planName, value: item.amount }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Balance", value: user.balance },
          { label: "Total Invested", value: user.totalInvested },
          { label: "Total Returns", value: user.totalReturns },
        ].map((card) => (
          <article key={card.label} className="glass p-5">
            <p className="text-sm text-mutedText">{card.label}</p>
            <p className="mt-2 font-heading text-2xl text-gold">{formatCurrency(card.value)}</p>
          </article>
        ))}
      </div>
      <section className="glass p-5">
        <h2 className="font-heading text-xl">Active Investments</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="glass p-5">
        <h2 className="font-heading text-xl">Recent Transactions</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-mutedText">
              <tr>
                <th className="pb-2">Type</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {user.transactions.slice(0, 5).map((txn) => (
                <tr key={txn.id} className="border-t border-white/10">
                  <td className="py-2 capitalize">{txn.type}</td>
                  <td className="py-2">{formatCurrency(txn.amount)}</td>
                  <td className="py-2">{formatDate(txn.createdAt)}</td>
                  <td className="py-2 capitalize">{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
