"use client";

import { Instagram, Linkedin, MoveUpRight, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const columns = [
    {
      title: t("company"),
      links: [
        { href: "/about", label: t("links.about") },
        { href: "/careers", label: t("links.careers") },
        { href: "/blog", label: t("links.blog") },
      ],
    },
    {
      title: t("resources"),
      links: [
        { href: "/help-center", label: t("links.helpCenter") },
        { href: "/security", label: t("links.security") },
        { href: "/contact", label: t("links.contact") },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/privacy-policy", label: t("links.privacyPolicy") },
        { href: "/terms-of-service", label: t("links.termsOfService") },
        { href: "/risk-disclosure", label: t("links.riskDisclosure") },
      ],
    },
  ] as const;

  const socials = [
    { href: "https://www.linkedin.com/", label: "LinkedIn", icon: Linkedin },
    { href: "https://x.com/", label: "X", icon: Twitter },
    { href: "https://www.instagram.com/", label: "Instagram", icon: Instagram },
    { href: "https://www.youtube.com/", label: "YouTube", icon: Youtube },
  ] as const;

  return (
    <footer className="border-t border-white/5 bg-[#040914]/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="section-kicker">{t("eyebrow")}</p>
          <h2 className="font-heading text-3xl text-ink">{t("headline")}</h2>
          <p className="max-w-2xl text-sm leading-7 text-body/72">{t("subtext")}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ghost-button"
          >
            {t("backToTop")}
            <MoveUpRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-heading text-lg text-ink">{column.title}</p>
              <div className="mt-4 space-y-3 text-sm text-body/68">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="block transition hover:text-ink">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="font-heading text-lg text-ink">{t("social")}</p>
            <div className="mt-4 space-y-3 text-sm text-body/68">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition hover:text-ink"
                >
                  <social.icon className="h-4 w-4" />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center text-xs uppercase tracking-[0.18em] text-body/45 sm:px-6 lg:px-8">
        {t("copyright", { year })}
      </div>
    </footer>
  );
}
