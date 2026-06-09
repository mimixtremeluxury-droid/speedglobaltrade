"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { ArrowUpRight, Landmark, Sparkles, Wallet, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { hasCompletedDeposit } from "@/lib/account";
import { DashboardOnboardingCard } from "@/components/dashboard/dashboard-onboarding-card";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const user = useAppStore((state) => state.user);
  if (!user) return null;

  if (!hasCompletedDeposit(user)) {
    return <DashboardOnboardingCard />;
  }

  // Calculate additional metrics
  const referralBonus = 0; // This would come from user data
  const referrals = 0; // This would come from user data
  const totalDeposited = user.summary.cashBalance + (user.summary.totalPortfolioValue - user.summary.cashBalance);
  const profit = user.summary.totalEarnings;
  const withdrawn = 0; // This would come from user data

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-ink">Welcome, real analysis!</h1>
        <p className="text-lg text-body/72">Here's your account overview</p>
      </div>

      {/* Info Banner */}
      <div className="surface border border-cyan/20 bg-gradient-to-r from-cyan/5 to-transparent p-4 flex items-start gap-3 rounded-lg">
        <AlertCircle className="h-5 w-5 text-cyan flex-shrink-0 mt-0.5" />
        <p className="text-sm text-body">Welcome to Remedy script</p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-2 uppercase tracking-wide">Total Balance</p>
              <p className="text-5xl font-bold font-heading">{formatCurrency(user.summary.totalPortfolioValue)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-400/20 border border-green-400/30 px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-medium text-green-100">Active</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <Link href="/en/dashboard/deposit" className="flex-1 bg-blue-500/40 hover:bg-blue-500/60 border border-blue-300/40 text-white py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2">
              <span>+ Deposit</span>
            </Link>
            <Link href="/en/dashboard/withdraw" className="flex-1 bg-blue-500/40 hover:bg-blue-500/60 border border-blue-300/40 text-white py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2">
              <span>⬆ Withdraw</span>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-xs font-semibold text-blue-100 mb-2 uppercase tracking-wide">Profit</p>
              <p className="text-2xl font-bold text-green-300 font-heading">{profit >= 0 ? '+' : ''}{formatCurrency(profit)}</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-xs font-semibold text-blue-100 mb-2 uppercase tracking-wide">Bonus</p>
              <p className="text-2xl font-bold text-white font-heading">{formatCurrency(0)}</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-xs font-semibold text-blue-100 mb-2 uppercase tracking-wide">Deposits</p>
              <p className="text-2xl font-bold text-white font-heading">{formatCurrency(totalDeposited)}</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-xs font-semibold text-blue-100 mb-2 uppercase tracking-wide">Withdrawn</p>
              <p className="text-2xl font-bold text-white font-heading">{formatCurrency(withdrawn)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Bonus Section */}
      <div className="surface border border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink font-heading">{formatCurrency(referralBonus)}</p>
              <p className="text-sm text-body/72">Referral Bonus</p>
            </div>
          </div>
          <Link href="/en/dashboard/referrals" className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-2 transition">
            View
            <span>→</span>
          </Link>
        </div>
        <p className="text-sm text-body/60 mt-3">{referrals} referrals</p>
      </div>

      {/* Additional Stats Cards */}
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
            <h2 className="mt-2 font-heading text-2xl text-ink">Your account is now live and tracking performance</h2>
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
                Your balance is active. Choose an investment plan to create your first live allocation.
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
