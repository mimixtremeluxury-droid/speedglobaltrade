"use client";

import { Clock3, FileCheck2, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getPendingDeposit } from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export function DashboardOnboardingCard() {
  const t = useTranslations("dashboard.empty");
  const user = useAppStore((state) => state.user);
  const pendingDeposit = getPendingDeposit(user);

  if (user && pendingDeposit) {
    return (
      <section className="surface flex min-h-[24rem] items-center justify-center p-6 sm:p-8">
        <div className="max-w-2xl text-center">
          <div className="mx-auto inline-flex rounded-full border border-cyan/20 bg-cyan/10 p-4 text-cyan">
            <Clock3 className="h-6 w-6" />
          </div>
          <p className="section-kicker mt-6">Funding Review</p>
          <h1 className="mt-3 font-heading text-3xl text-ink sm:text-4xl">Your deposit request is pending approval</h1>
          <p className="mt-4 text-sm leading-7 text-body/74 sm:text-base">
            {formatCurrency(pendingDeposit.amount, user.profile.currency)} via {pendingDeposit.method ?? "Funding Desk"} is
            recorded, but your balance stays at 0.00 until operations verifies the payment.
          </p>
          <div className="mx-auto mt-6 max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left">
            {pendingDeposit.proofSubmittedAt ? (
              <div className="flex items-start gap-3 text-sm leading-6 text-emerald-100">
                <FileCheck2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
                <p>
                  Payment proof received
                  {pendingDeposit.proofFileName ? `: ${pendingDeposit.proofFileName}` : ""} on{" "}
                  {formatDate(pendingDeposit.proofSubmittedAt)}. Approval is now pending.
                </p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-body/72">
                Upload your payment slip to move this request into operations review. No funds are credited before
                approval.
              </p>
            )}
          </div>
          <Link href="/dashboard/deposit" className="gold-button mt-8 inline-flex">
            {pendingDeposit.proofSubmittedAt ? "View Deposit Status" : "Upload Payment Slip"}
          </Link>
        </div>
      </section>
    );
  }

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
