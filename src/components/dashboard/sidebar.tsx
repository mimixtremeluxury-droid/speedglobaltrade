"use client";

import {
  ArrowDownToLine,
  BarChart3,
  Copy,
  Landmark,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Settings2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/lib/store";

const links = [
  { href: "/dashboard", label: "overview", icon: BarChart3 },
  { href: "/dashboard/investments", label: "investments", icon: Landmark },
  { href: "/dashboard/copy-trading", label: "copyTrading", icon: Copy },
  { href: "/dashboard/transactions", label: "transactions", icon: ReceiptText },
  { href: "/dashboard/deposit", label: "deposit", icon: Wallet },
  { href: "/dashboard/withdraw", label: "withdraw", icon: ArrowDownToLine },
  { href: "/dashboard/settings", label: "settings", icon: Settings2 },
] as const;

export function DashboardSidebar() {
  const t = useTranslations("dashboard.nav");
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const setCollapsed = useAppStore((state) => state.setSidebarCollapsed);
  const signOut = useAppStore((state) => state.signOut);
  const pushToast = useAppStore((state) => state.pushToast);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    signOut();
    pushToast({
      title: t("signedOutTitle"),
      description: t("signedOutDescription"),
      tone: "info",
    });
    router.push("/");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="surface fixed left-4 top-20 z-40 inline-flex p-3 lg:hidden"
        aria-label="Open navigation"
      >
        <PanelLeftOpen className="h-4 w-4 text-ink" />
      </button>

      <aside
        className={cn(
          "surface fixed inset-y-4 left-4 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col p-4 transition duration-300 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:flex-none",
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)] lg:translate-x-0",
          collapsed ? "lg:w-[5.75rem]" : "lg:w-[18rem]",
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className={cn("overflow-hidden transition", collapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100")}>
            <p className="font-heading text-lg text-ink">{t("title")}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-body/45">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden rounded-full border border-white/10 p-2 text-body/70 transition hover:border-cyan/40 hover:text-cyan lg:inline-flex"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-white/10 p-2 text-body/70 transition hover:border-cyan/40 hover:text-cyan lg:hidden"
              aria-label="Close navigation"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <nav className="space-y-2 overflow-y-auto pr-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm transition",
                  pathname === item.href
                    ? "border-gold/30 bg-gold/10 text-gold"
                    : "text-body/72 hover:border-white/10 hover:bg-white/[0.03] hover:text-ink",
                  collapsed && "lg:justify-center",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className={cn("truncate", collapsed && "lg:hidden")}>{t(item.label)}</span>
              </Link>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "mt-auto flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3 text-sm text-body/72 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200",
            collapsed && "lg:justify-center",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "lg:hidden")}>{t("logout")}</span>
        </button>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-midnight/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
    </>
  );
}
