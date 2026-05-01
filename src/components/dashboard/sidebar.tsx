"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { cn } from "@/lib/cn";
import { useAppStore } from "@/lib/store";

const links = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/investments", label: "Investment Plans", icon: Landmark },
  { href: "/dashboard/copy-trading", label: "Copy Trading", icon: Copy },
  { href: "/dashboard/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/dashboard/deposit", label: "Deposit", icon: Wallet },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowDownToLine },
  { href: "/dashboard/settings", label: "Settings", icon: Settings2 },
];

export function DashboardSidebar() {
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
      title: "Signed out",
      description: "Your secure session has been cleared.",
      tone: "info",
    });
    router.push("/en");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="surface fixed left-4 top-20 z-40 inline-flex p-3 lg:hidden"
      >
        <PanelLeftOpen className="h-4 w-4 text-ink" />
      </button>

      <aside
        className={cn(
          "surface fixed inset-y-4 left-4 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col p-4 transition duration-300 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]",
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)] lg:translate-x-0",
          collapsed && "lg:w-[6.25rem]",
        )}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className={cn("overflow-hidden transition", collapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100")}>
            <p className="font-heading text-lg text-ink">Investor Desk</p>
            <p className="text-xs uppercase tracking-[0.22em] text-body/45">Private workspace</p>
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
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm transition",
                pathname === item.href
                  ? "border-gold/30 bg-gold/10 text-gold"
                  : "text-body/72 hover:border-white/10 hover:bg-white/[0.03] hover:text-ink",
                collapsed && "lg:justify-center",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "mt-auto flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3 text-sm text-body/72 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200",
            collapsed && "lg:justify-center",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "lg:hidden")}>Logout</span>
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
