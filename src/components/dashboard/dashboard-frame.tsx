"use client";

import { BellRing, Sparkles } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const hydrated = useAppStore((state) => state.hydrated);
  const user = useAppStore((state) => state.user);

  return (
    <div className="mx-auto flex max-w-[96rem] gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 lg:pl-[calc(18rem+1rem)]">
        <div className="surface mb-6 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Dashboard Overview</p>
            <h1 className="mt-2 font-heading text-3xl text-ink">
              {hydrated && user ? `Welcome back, ${user.profile.fullName.split(" ")[0]}` : "Loading your workspace"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-body/72">
              {hydrated && user ? `${formatCurrency(user.summary.totalPortfolioValue)} portfolio` : "Syncing account"}
            </div>
            <div className="rounded-full border border-cyan/20 bg-cyan/10 px-4 py-3 text-sm text-cyan">
              {hydrated && user ? formatPercent(user.summary.dailyChange) : "Live"}
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-3 text-body/72">
              <BellRing className="h-4 w-4" />
            </div>
          </div>
        </div>

        {!hydrated || !user ? (
          <div className="surface flex min-h-[18rem] items-center justify-center p-10 text-body/68">
            <Sparkles className="mr-3 h-5 w-5 text-gold" />
            Preparing your premium dashboard experience...
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
