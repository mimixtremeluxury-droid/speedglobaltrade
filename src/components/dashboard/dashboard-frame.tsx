"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAppStore } from "@/lib/store";

export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const t = useTranslations("dashboard.frame");
  const hydrated = useAppStore((state) => state.hydrated);
  const user = useAppStore((state) => state.user);

  return (
    <div className="mx-auto flex max-w-[96rem] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:px-8">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">
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
