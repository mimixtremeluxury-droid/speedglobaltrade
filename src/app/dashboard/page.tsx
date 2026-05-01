"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { ArrowUpRight, Landmark, Sparkles, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const user = useAppStore((state) => state.user);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total portfolio value", value: formatCurrency(user.summary.totalPortfolioValue), accent: "text-gold", icon: Sparkles },
          { label: "Total returns", value: formatPercent(user.summary.totalReturnsPct), accent: "text-cyan", icon: ArrowUpRight },
          { label: "Available cash", value: formatCurrency(user.summary.cashBalance), accent: "text-ink", icon: Wallet },
        ].map((card) => (
          <article key={card.label} className="surface p-5">
            <card.icon className="h-5 w-5 text-body/60" />
            <p className="metric-label mt-5">{card.label}</p>
            <p className={`metric-value mt-3 ${card.accent}`}>{card.value}</p>
          </article>
        ))}
      </div>

      <section className="surface p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Portfolio Performance</p>
            <h2 className="mt-2 font-heading text-2xl text-ink">Minimal, high-signal performance tracking</h2>
          </div>
          <div className="rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-sm text-cyan">
            Daily move {formatPercent(user.summary.dailyChange)}
          </div>
        </div>
        <div className="mt-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={user.performance}>
              <defs>
                <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5A623" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#F5A623" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" tick={{ fill: "#7e8a99", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#091221",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  color: "#fff",
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Area
                dataKey="value"
                type="monotone"
                stroke="#F5A623"
                strokeWidth={2.5}
                fill="url(#portfolioFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="surface p-5">
          <p className="section-kicker">Capital Breakdown</p>
          <div className="mt-5 space-y-4">
            {[
              { label: "Active capital", value: formatCurrency(user.summary.activeCapital) },
              { label: "Earnings accrued", value: formatCurrency(user.summary.totalEarnings) },
              { label: "Copied traders", value: `${user.copiedTraders.length} active sleeves` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <span className="text-sm text-body/72">{item.label}</span>
                <span className="font-heading text-lg text-ink">{item.value}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="surface p-5">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-gold" />
            <div>
              <p className="section-kicker">Recent transactions</p>
              <h2 className="mt-2 font-heading text-2xl text-ink">Clean activity snapshot</h2>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {user.transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div>
                  <p className="font-medium text-ink">{transaction.label}</p>
                  <p className="text-sm text-body/65">{transaction.note}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-lg text-ink">{formatCurrency(transaction.amount)}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-body/45">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
