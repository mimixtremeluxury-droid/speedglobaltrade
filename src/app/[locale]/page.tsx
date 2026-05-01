import NextLink from "next/link";
import { ArrowRight, BadgeCheck, ChartNoAxesCombined, LockKeyhole, ShieldCheck, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EXPERT_TRADERS, INVESTMENT_PLANS, TRUST_BADGES } from "@/lib/constants";
import { PageShell } from "@/components/ui/page-shell";
import { HeroParticles } from "@/components/marketing/hero-particles";
import { HeroEmailForm } from "@/components/marketing/hero-email-form";
import { SponsorsMarquee } from "@/components/marketing/sponsors-marquee";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils";

export default async function MarketingHomePage() {
  const tHero = await getTranslations("hero");
  const tHome = await getTranslations("home");

  const stats = [
    { label: tHero("statsOne"), value: "$142M+" },
    { label: tHero("statsTwo"), value: "29,400" },
    { label: tHero("statsThree"), value: "12.8%" },
  ];

  return (
    <PageShell className="space-y-24 pb-24 pt-8 md:space-y-28">
      <section className="surface hero-grid noise-mask relative overflow-hidden px-6 py-10 sm:px-8 md:px-10 md:py-12">
        <HeroParticles />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="section-kicker">{tHero("eyebrow")}</p>
            <h1 className="max-w-3xl font-heading text-4xl leading-[1.02] tracking-[-0.05em] text-ink sm:text-5xl lg:text-7xl">
              {tHero("title")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-body/82">{tHero("description")}</p>
            <HeroEmailForm placeholder={tHero("emailPlaceholder")} cta={tHero("emailButton")} />
            <div className="flex flex-wrap gap-3">
              <NextLink href="/signup" className="gold-button">
                {tHero("ctaPrimary")}
              </NextLink>
              <Link href="/plans" className="ghost-button">
                {tHero("ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="surface-soft rounded-[32px] p-5">
              <div className="grid gap-4 md:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="metric-label">{item.label}</p>
                    <p className="metric-value mt-3 text-gold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-soft rounded-[32px] p-6">
              <div className="mb-6 flex items-center gap-2 text-sm text-cyan">
                <BadgeCheck className="h-4 w-4" />
                Private-client signals, upgraded
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Security-first onboarding",
                    body: "High-trust flows with premium visual clarity and strong contrast.",
                  },
                  {
                    icon: ChartNoAxesCombined,
                    title: "Actionable performance views",
                    body: "Decision-ready dashboards that keep the signal and remove the clutter.",
                  },
                  {
                    icon: Users,
                    title: "Copy-trading credibility",
                    body: "Elegant expert cards, clear stats, and frictionless portfolio mirroring.",
                  },
                ].map((item) => (
                  <article key={item.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <item.icon className="h-5 w-5 text-gold" />
                    <h2 className="mt-4 font-heading text-xl text-ink">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-body/72">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          <p className="section-kicker">{tHome("topInvestors")}</p>
          <h2 className="section-title">Expert-led allocations with cleaner copy-trading UX</h2>
          <p className="body-copy">
            Compare conviction, follower confidence, and style fit at a glance. Every card is designed to feel calm,
            polished, and ready for a premium investor.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {EXPERT_TRADERS.map((trader) => (
            <article key={trader.id} className="surface overflow-hidden p-5">
              <div className={`rounded-[24px] bg-gradient-to-br ${trader.theme} p-4`}>
                <p className="text-xs uppercase tracking-[0.24em] text-body/70">{trader.specialty}</p>
                <h3 className="mt-3 font-heading text-2xl text-ink">{trader.name}</h3>
                <p className="mt-3 text-sm leading-7 text-body/75">{trader.bio}</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="metric-label">Win Rate</p>
                  <p className="mt-2 font-heading text-lg text-ink">{trader.winRate}%</p>
                </div>
                <div>
                  <p className="metric-label">ROI</p>
                  <p className="mt-2 font-heading text-lg text-gold">+{trader.roi}%</p>
                </div>
                <div>
                  <p className="metric-label">Followers</p>
                  <p className="mt-2 font-heading text-lg text-ink">{trader.followers}</p>
                </div>
              </div>
              <NextLink href="/login" className="gold-button mt-5 w-full">
                {tHome("copyButton")}
              </NextLink>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6">
          <p className="section-kicker">{tHome("trustTitle")}</p>
          <h2 className="mt-3 section-title">{tHome("trustDescription")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                <LockKeyhole className="h-5 w-5 text-cyan" />
                <h3 className="mt-4 font-heading text-lg text-ink">{badge.title}</h3>
                <p className="mt-2 text-sm leading-7 text-body/72">{badge.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="surface p-6">
          <p className="section-kicker">{tHome("plansTitle")}</p>
          <h2 className="mt-3 section-title">{tHome("plansDescription")}</h2>
          <div className="mt-6 space-y-4">
            {INVESTMENT_PLANS.slice(0, 3).map((plan) => (
              <article key={plan.id} className={`rounded-[28px] bg-gradient-to-br ${plan.accent} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-body/65">{plan.term}</p>
                    <h3 className="mt-2 font-heading text-2xl text-ink">{plan.name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-body/78">{plan.summary}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-ink">
                    From {plan.roiFrom}%
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-sm text-body/70">Minimum {formatCurrency(plan.minInvestment)}</p>
                  <Link href="/plans" className="ghost-button">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">{tHome("sponsorsTitle")}</p>
            <h2 className="section-title">Signals of trust, styled like a premium market brand</h2>
          </div>
        </div>
        <SponsorsMarquee />
      </section>
    </PageShell>
  );
}
