"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Wallet, ArrowDownToLine, Landmark, ReceiptText, UserCog, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { useApp } from "@/app/providers";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/deposit", label: "Deposit", icon: Wallet },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowDownToLine },
  { href: "/dashboard/investments", label: "My Investments", icon: Landmark },
  { href: "/dashboard/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/dashboard/settings", label: "Settings", icon: UserCog },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useApp();
  const router = useRouter();
  return (
    <aside className="glass h-fit w-full p-4 lg:sticky lg:top-20 lg:w-64">
      <p className="px-2 pb-4 font-heading text-lg text-gold">Dashboard</p>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-mutedText hover:bg-white/10 hover:text-white",
              pathname === link.href && "bg-white/10 text-gold",
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 hover:bg-red-400/15"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </nav>
    </aside>
  );
}
