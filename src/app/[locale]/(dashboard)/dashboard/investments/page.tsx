"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { hasCompletedDeposit } from "@/lib/account";
import { DashboardOnboardingCard } from "@/components/dashboard/dashboard-onboarding-card";
import { appSelectors, useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function InvestmentsPage() {
  const user = useAppStore((state) => state.user);
  const invest = useAppStore((state) => state.invest);
  const pushToast = useAppStore((state) => state.pushToast);
  const plans = appSelectors.plans();
  const [drafts, setDrafts] = useState<Record<string, number>>(() =>
    Object.fromEntries(plans.map((plan) => [plan.id, plan.minInvestment])),
  );

  if (!user) return null;
  if (!hasCompletedDeposit(user)) return <DashboardOnboardingCard />;

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <p className="section-kicker">Apex Plan Grid</p>
        <h1 className="mt-2 font-heading text-3xl text-ink">Premium investment plans without the clutter</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-body/72">
          Compare core mandates, adjust your ticket size, and activate a strategy with one clean action.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.id} className="surface overflow-hidden p-5">
            <div className={`rounded-[32px] bg-gradient-to-br ${plan.accent} p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-body/65">{plan.term}</p>
                  <h2 className="mt-2 font-heading text-3xl text-ink">{plan.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-body/78">{plan.summary}</p>
                </div>
                <div className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">From {plan.roiFrom}%</div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {plan.markets.map((market) => (
                  <span key={market} className="rounded-full border border-white/10 px-3 py-1 text-xs text-body/78">
                    {market}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label className="mb-2 block text-sm text-body/72">Allocation amount</label>
                <input
                  type="number"
                  min={plan.minInvestment}
                  value={drafts[plan.id]}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [plan.id]: Number(event.target.value),
                    }))
                  }
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-ink outline-none transition focus:border-cyan/60"
                />
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-body/45">
                  Minimum {formatCurrency(plan.minInvestment)}
                </p>
              </div>
              <button type="button" className="ghost-button">Learn More</button>
              <button
                type="button"
                onClick={() => {
                  try {
                    invest(plan, drafts[plan.id]);
                    pushToast({
                      title: "Plan activated",
                      description: `${plan.name} has been added to your live allocations.`,
                      tone: "success",
                    });
                  } catch (error) {
                    pushToast({
                      title: "Allocation failed",
                      description: (error as Error).message,
                      tone: "error",
                    });
                  }
                }}
                className="gold-button"
              >
                Activate Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="surface p-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-cyan" />
          <div>
            <p className="section-kicker">Active Mandates</p>
            <h2 className="mt-2 font-heading text-2xl text-ink">Your current strategy stack</h2>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {user.investments.length ? (
            user.investments.map((investment) => (
              <div key={investment.id} className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-heading text-xl text-ink">{investment.planName}</p>
                  <p className="text-sm text-body/65">
                    {investment.term} • status {investment.status}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <p className="metric-label">Principal</p>
                    <p className="mt-2 font-heading text-lg text-ink">{formatCurrency(investment.principal)}</p>
                  </div>
                  <div>
                    <p className="metric-label">ROI from</p>
                    <p className="mt-2 font-heading text-lg text-gold">{investment.roiFrom}%</p>
                  </div>
                  <div>
                    <p className="metric-label">Term</p>
                    <p className="mt-2 font-heading text-lg text-ink">{investment.term}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-body/68">
              Your first completed deposit is active. Start a plan above to populate this list.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
