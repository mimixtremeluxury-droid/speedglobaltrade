import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { INVESTMENT_PLANS } from "@/lib/constants";
import { PageShell } from "@/components/ui/page-shell";
import { formatCurrency } from "@/lib/utils";

export default async function PublicPlansPage() {
  const t = await getTranslations("plans");

  return (
    <PageShell className="space-y-12 pb-24 pt-12">
      <section className="surface px-6 py-10 md:px-10">
        <p className="section-kicker">Investment Plans</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl tracking-[-0.04em] text-ink md:text-6xl">{t("title")}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-body/78">{t("description")}</p>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {INVESTMENT_PLANS.map((plan) => (
          <article key={plan.id} className="surface overflow-hidden p-6">
            <div className={`rounded-[32px] bg-gradient-to-br ${plan.accent} p-6`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-body/65">{plan.term}</p>
                  <h2 className="mt-2 font-heading text-3xl text-ink">{plan.name}</h2>
                </div>
                <div className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
                  From {plan.roiFrom}%
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-body/78">{plan.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {plan.markets.map((market) => (
                  <span key={market} className="rounded-full border border-white/10 px-3 py-1 text-xs text-body/78">
                    {market}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="metric-label">Minimum investment</p>
                <p className="font-heading text-2xl text-ink">{formatCurrency(plan.minInvestment)}</p>
              </div>
              <div className="flex gap-3">
                <Link href="/signup" className="ghost-button">
                  Learn More
                </Link>
                <Link href="/signup" className="gold-button">
                  Start Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
