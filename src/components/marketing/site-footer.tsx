"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-white/5 bg-[#040914]/90">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div className="space-y-3">
          <p className="section-kicker">Speed Global Trade</p>
          <h2 className="font-heading text-3xl text-ink">{t("headline")}</h2>
          <p className="max-w-2xl text-sm leading-7 text-body/72">{t("subtext")}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-body/68">
          <Link href="/" className="transition hover:text-ink">
            {nav("home")}
          </Link>
          <Link href="/about" className="transition hover:text-ink">
            {nav("about")}
          </Link>
          <Link href="/plans" className="transition hover:text-ink">
            {nav("plans")}
          </Link>
          <Link href="/contact" className="transition hover:text-ink">
            {nav("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
