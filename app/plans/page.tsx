"use client";

import { useMemo, useState } from "react";
import { INVESTMENT_PLANS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { PageShell } from "@/components/ui/page-shell";

export default function PlansPage() {
  const [amount, setAmount] = useState(1000);
  const projections = useMemo(
    () =>
      INVESTMENT_PLANS.map((plan) => {
        const roi = plan.weeklyRoi + (plan.bonusRoi ?? 0);
        return { plan: plan.name, projected: amount + amount * roi };
      }),
    [amount],
  );

  return (
    <PageShell className="space-y-8">
      <h1 className="section-title">Investment Plans</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {INVESTMENT_PLANS.map((plan) => (
          <article key={plan.id} className="glass p-5">
            <h2 className="font-heading text-2xl text-gold">{plan.name}</h2>
            <ul className="mt-4 space-y-2 text-sm text-mutedText">
              <li>Min Deposit: {formatCurrency(plan.minDeposit)}</li>
              <li>ROI: {(plan.weeklyRoi * 100).toFixed(0)}% weekly + {((plan.bonusRoi ?? 0) * 100).toFixed(0)}% bonus</li>
              <li>Lock Period: {plan.lockDays} days</li>
              <li>Risk Level: {plan.risk}</li>
            </ul>
          </article>
        ))}
      </div>
      <section className="glass space-y-4 p-6">
        <h2 className="font-heading text-2xl">Projection Calculator</h2>
        <input
          aria-label="Investment amount"
          type="number"
          min={100}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {projections.map((projection) => (
            <div key={projection.plan} className="rounded-xl bg-white/5 p-3 text-sm">
              <span className="text-mutedText">{projection.plan}</span>
              <p className="text-lg text-gold">{formatCurrency(projection.projected)}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
