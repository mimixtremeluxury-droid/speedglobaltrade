"use client";

import NextLink from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/marketing/language-switcher";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/plans", key: "plans" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-midnight/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-lg text-ink">Speed Global Trade</p>
            <p className="text-xs uppercase tracking-[0.22em] text-body/50">Premium Capital Desk</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <Link key={item.key} href={item.href} className="text-sm text-body/72 transition hover:text-ink">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <NextLink href="/login" className="ghost-button">
            {t("login")}
          </NextLink>
          <NextLink href="/signup" className="gold-button">
            {t("signup")}
          </NextLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-site-nav"
          className="inline-flex rounded-full border border-white/10 p-3 text-body/80 transition hover:border-cyan/40 hover:text-cyan lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-site-nav"
        className={cn(
          "overflow-hidden border-t border-white/5 px-4 transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="space-y-3 py-4">
          {links.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl border border-white/5 px-4 py-3 text-sm text-body/78 transition hover:border-cyan/30 hover:bg-white/5 hover:text-ink"
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <LanguageSwitcher />
            <NextLink href="/login" onClick={() => setOpen(false)} className="ghost-button w-full">
              {t("login")}
            </NextLink>
            <NextLink href="/signup" onClick={() => setOpen(false)} className="gold-button w-full">
              {t("signup")}
            </NextLink>
          </div>
        </div>
      </div>
    </header>
  );
}
