import { Building2, Globe2, ShieldCheck, Sparkles, Target } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/components/ui/page-shell";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const values = [
    { icon: Target, title: t("missionTitle"), copy: t("mission") },
    { icon: Globe2, title: t("visionTitle"), copy: t("vision") },
    { icon: Sparkles, title: t("styleTitle"), copy: t("styleBody") },
  ];

  return (
    <PageShell className="space-y-16 pb-24 pt-12">
      <section className="surface px-6 py-10 md:px-10">
        <p className="section-kicker">{t("eyebrow")}</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl tracking-[-0.04em] text-ink md:text-6xl">{t("title")}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-body/78">{t("intro")}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {values.map((item) => (
          <article key={item.title} className="surface p-6">
            <item.icon className="h-5 w-5 text-gold" />
            <h2 className="mt-4 font-heading text-2xl text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-body/74">{item.copy}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="surface p-6">
          <p className="section-kicker">{t("philosophyKicker")}</p>
          <h2 className="mt-3 section-title">{t("philosophyTitle")}</h2>
          <p className="mt-4 body-copy">{t("philosophyBody")}</p>
        </article>
        <article className="surface p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: t("featureOne") },
              { icon: Building2, title: t("featureTwo") },
              { icon: Globe2, title: t("featureThree") },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                <item.icon className="h-5 w-5 text-cyan" />
                <p className="mt-4 font-heading text-lg text-ink">{item.title}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </PageShell>
  );
}
