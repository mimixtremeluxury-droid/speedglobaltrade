import { Headphones, Landmark, Mail, PhoneCall } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/marketing/contact-form";
import { PageShell } from "@/components/ui/page-shell";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const cards = [
    { icon: Mail, title: t("emailDeskTitle"), copy: "support@speedglobaltrade.com" },
    { icon: PhoneCall, title: t("phoneLineTitle"), copy: "+1 (800) 555-0199" },
    { icon: Headphones, title: t("clientSupportTitle"), copy: t("clientSupportBody") },
    { icon: Landmark, title: t("officeTitle"), copy: t("officeBody") },
  ];

  return (
    <PageShell className="space-y-12 pb-24 pt-12">
      <section className="surface px-6 py-10 md:px-10">
        <p className="section-kicker">{t("eyebrow")}</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl tracking-[-0.04em] text-ink md:text-6xl">{t("title")}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-body/78">{t("description")}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-4">
          {cards.map((item) => (
            <article key={item.title} className="surface p-5">
              <item.icon className="h-5 w-5 text-cyan" />
              <h2 className="mt-4 font-heading text-xl text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-body/74">{item.copy}</p>
            </article>
          ))}
        </div>
        <ContactForm />
      </section>
    </PageShell>
  );
}
