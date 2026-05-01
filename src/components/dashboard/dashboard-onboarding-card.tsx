"use client";

import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function DashboardOnboardingCard() {
  const t = useTranslations("dashboard.empty");

  return (
    <section className="surface flex min-h-[24rem] items-center justify-center p-6 sm:p-8">
      <div className="max-w-2xl text-center">
        <div className="mx-auto inline-flex rounded-full border border-gold/20 bg-gold/10 p-4 text-gold">
          <Wallet className="h-6 w-6" />
        </div>
        <p className="section-kicker mt-6">{t("eyebrow")}</p>
        <h1 className="mt-3 font-heading text-3xl text-ink sm:text-4xl">{t("title")}</h1>
        <p className="mt-4 text-sm leading-7 text-body/74 sm:text-base">{t("description")}</p>
        <Link href="/dashboard/deposit" className="gold-button mt-8 inline-flex">
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
