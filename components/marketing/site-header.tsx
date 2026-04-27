"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/plans", label: "Investment Plans" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-deepNavy/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold text-white">
          <div className="rounded-lg bg-gold/20 p-2 text-gold">
            <BarChart3 className="h-4 w-4" />
          </div>
          Speed Global Trade
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm text-mutedText transition hover:text-white",
                pathname === link.href && "text-gold",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-[2px] bg-gold transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0",
                )}
              />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:-translate-y-0.5 hover:border-gold">
            Login
          </Link>
          <Link href="/signup" className="rounded-full bg-gold-gradient px-4 py-2 text-sm font-semibold text-deepNavy transition hover:-translate-y-0.5 hover:shadow-glow">
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Start
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
