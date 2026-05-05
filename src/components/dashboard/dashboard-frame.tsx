"use client";

import { BellRing, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { hasCompletedDeposit } from "@/lib/account";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const t = useTranslations("dashboard.frame");
  const hydrated = useAppStore((state) => state.hydrated);
  const user = useAppStore((state) => state.user);
  const activated = hasCompletedDeposit(user);

  return (
    <div className="mx-auto flex max-w-[96rem] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:px-8">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">
        <div className="surface mb-6 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">{t("eyebrow")}</p>
            <h1 className="mt-2 font-heading text-3xl text-ink">
              {hydrated && user ? t("welcome", { name: user.profile.fullName.split(" ")[0] }) : t("loading")}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-body/72">
              {hydrated && user && activated
                ? t("portfolio", { amount: formatCurrency(user.summary.totalPortfolioValue) })
                : t("waiting")}
            </div>
            <div className="rounded-full border border-cyan/20 bg-cyan/10 px-4 py-3 text-sm text-cyan">
              {hydrated && user && activated ? formatPercent(user.summary.dailyChange) : t("pending")}
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-3 text-body/72">
              <BellRing className="h-4 w-4" />
            </div>
          </div>
        </div>

        {!hydrated || !user ? (
          <div className="surface flex min-h-[18rem] items-center justify-center p-10 text-body/68">
            <Sparkles className="mr-3 h-5 w-5 text-gold" />
            {t("preparing")}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
