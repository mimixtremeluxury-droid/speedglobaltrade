"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { AlertCircle, ArrowUpRight, Landmark, Sparkles, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { hasCompletedDeposit } from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const user = useAppStore((state) => state.user);
  if (!user) return null;

  const dashboardActive = hasCompletedDeposit(user);
  const referralBonus = 0;
  const referrals = 0;
  const totalDeposited = user.summary.cashBalance + (user.summary.totalPortfolioValue - user.summary.cashBalance);
  const profit = user.summary.totalEarnings;
  const withdrawn = 0;

  return (
    <div className="space-y-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold text-ink">Welcome, {user.profile.fullName}</h1>
        <p className="text-lg text-body/72">Here&apos;s your account overview</p>
      </div>

      <div className="surface flex items-start gap-3 rounded-lg border border-cyan/20 bg-gradient-to-r from-cyan/5 to-transparent p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan" />
        <p className="text-sm text-body">
          {dashboardActive
            ? "Your dashboard is active and tracking approved capital."
            : "Your dashboard is ready at 0.00. Use Deposit when you are ready to fund the account."}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#08111f] via-[#0a1525] to-[#050b14] p-8 text-white shadow-glow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,166,35,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(0,240,255,0.12),transparent_32%)]" />

        <div className="relative z-10">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-body/75">Total Balance</p>
              <p className="font-heading text-5xl font-bold">{formatCurrency(user.summary.totalPortfolioValue, user.profile.currency)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2">
              <div className={`h-2 w-2 rounded-full ${dashboardActive ? "bg-emerald-400" : "bg-gold"} animate-pulse`} />
              <span className="text-sm font-medium text-ink">{dashboardActive ? "Active" : "0.00 Start"}</span>
            </div>
          </div>

          <div className="mb-8 flex gap-3">
            <Link
              href="/en/dashboard/deposit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold/25 bg-gold/10 px-4 py-3 font-semibold text-white transition hover:border-gold/50 hover:bg-gold/20"
            >
              <span>+ Deposit</span>
            </Link>
            <Link
              href="/en/dashboard/withdraw"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white transition hover:border-cyan/40 hover:bg-cyan/10"
            >
              <span>Withdraw</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/65">Profit</p>
              <p className="font-heading text-2xl font-bold text-green-300">
                {profit >= 0 ? "+" : ""}
                {formatCurrency(profit, user.profile.currency)}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/65">Bonus</p>
              <p className="font-heading text-2xl font-bold text-white">{formatCurrency(0, user.profile.currency)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/65">Deposits</p>
              <p className="font-heading text-2xl font-bold text-white">{formatCurrency(totalDeposited, user.profile.currency)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/65">Withdrawn</p>
              <p className="font-heading text-2xl font-bold text-white">{formatCurrency(withdrawn, user.profile.currency)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="surface rounded-xl border border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-ink">{formatCurrency(referralBonus, user.profile.currency)}</p>
              <p className="text-sm text-body/72">Referral Bonus</p>
            </div>
          </div>
          <Link href="/en/dashboard/referrals" className="flex items-center gap-2 font-semibold text-green-400 transition hover:text-green-300">
            View
            <span>-&gt;</span>
          </Link>
        </div>
        <p className="mt-3 text-sm text-body/60">{referrals} referrals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total portfolio value", value: formatCurrency(user.summary.totalPortfolioValue, user.profile.currency), accent: "text-gold", icon: Sparkles },
          { label: "Total returns", value: formatPercent(user.summary.totalReturnsPct), accent: "text-cyan", icon: ArrowUpRight },
          { label: "Available cash", value: formatCurrency(user.summary.cashBalance, user.profile.currency), accent: "text-ink", icon: Wallet },
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
            <h2 className="mt-2 font-heading text-2xl text-ink">
              {dashboardActive ? "Your account is now live and tracking performance" : "Performance tracking begins after your first approved deposit"}
            </h2>
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
                formatter={(value: number) => formatCurrency(value, user.profile.currency)}
              />
              <Area dataKey="value" type="monotone" stroke="#F5A623" strokeWidth={2.5} fill="url(#portfolioFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="surface p-5">
          <p className="section-kicker">Active Investments</p>
          <div className="mt-5 space-y-4">
            {user.investments.length ? (
              user.investments.map((investment) => (
                <div key={investment.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-heading text-xl text-ink">{investment.planName}</p>
                      <p className="text-sm text-body/65">{investment.term} mandate</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg text-gold">{investment.roiFrom}%</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-body/45">{investment.status}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-body/68">
                {dashboardActive
                  ? "Your balance is active. Choose an investment plan to create your first live allocation."
                  : "Investment allocations unlock after your first deposit is approved."}
              </div>
            )}
          </div>
        </article>
        <article className="surface p-5">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-gold" />
            <div>
              <p className="section-kicker">Transaction History</p>
              <h2 className="mt-2 font-heading text-2xl text-ink">Recent completed and pending activity</h2>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {user.transactions.length ? (
              user.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div>
                    <p className="font-medium text-ink">{transaction.label}</p>
                    <p className="text-sm text-body/65">{transaction.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-lg text-ink">{formatCurrency(transaction.amount, user.profile.currency)}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-body/45">{transaction.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-body/68">
                No funding activity yet. Your first deposit request will appear here.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
