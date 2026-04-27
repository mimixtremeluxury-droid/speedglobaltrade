"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useApp } from "@/app/providers";
import { formatCurrency } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const daily = user
    ? user.investments
        .filter((item) => item.status === "active")
        .reduce((sum, item) => sum + item.estimatedReturn / 7, 0)
    : 0;
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-8 lg:grid-cols-[260px_1fr] lg:px-6">
      <DashboardSidebar />
      <div className="space-y-4">
        <div className="glass flex items-center justify-between px-4 py-3 text-sm">
          <span className="text-mutedText">Daily Returns Estimate</span>
          <span className="font-semibold text-gold">{formatCurrency(daily)}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
