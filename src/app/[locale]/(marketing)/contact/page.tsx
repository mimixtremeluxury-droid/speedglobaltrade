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
  const whatsappUrl = "https://wa.me/13432556574";

  const cards = [
    { icon: Mail, title: t("emailDeskTitle"), copy: "speedglobaltrade@gmail.com", href: "mailto:speedglobaltrade@gmail.com" },
    { icon: PhoneCall, title: t("phoneLineTitle"), copy: "+1 (343) 255-6574", href: whatsappUrl, badge: "WhatsApp" },
    { icon: Headphones, title: t("clientSupportTitle"), copy: t("clientSupportBody"), href: whatsappUrl, badge: "Fast reply" },
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
              <div className="flex items-start justify-between gap-4">
                <item.icon className="h-5 w-5 text-cyan" />
                {item.badge ? (
                  <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-4 font-heading text-xl text-ink">{item.title}</h2>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-2 block text-sm leading-7 text-body/74 transition hover:text-ink"
                >
                  {item.copy}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-7 text-body/74">{item.copy}</p>
              )}
            </article>
          ))}
        </div>
        <ContactForm />
      </section>
    </PageShell>
  );
}
