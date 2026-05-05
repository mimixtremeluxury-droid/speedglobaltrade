"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher, MobileLanguageSwitcher } from "@/components/marketing/language-switcher";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/plans", key: "plans" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-midnight/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-lg text-ink">{tBrand("name")}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-body/50">{tBrand("tagline")}</p>
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
          <Link href="/login" className="ghost-button">
            {t("login")}
          </Link>
          <Link href="/signup" className="gold-button">
            {t("signup")}
          </Link>
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

      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-[4.75rem] z-[80] bg-midnight/72 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <div
        id="mobile-site-nav"
        className={cn(
          "fixed inset-x-4 bottom-4 top-[5.35rem] z-[90] rounded-[2rem] border border-white/10 bg-[#07111d]/97 p-4 shadow-2xl backdrop-blur-xl transition duration-300 lg:hidden",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-heading text-lg text-ink">{tBrand("name")}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-body/45">{tBrand("tagline")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex rounded-full border border-white/10 p-3 text-body/80 transition hover:border-cyan/40 hover:text-cyan"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {links.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-[1.35rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-sm text-body/82 transition hover:border-cyan/30 hover:bg-white/5 hover:text-ink"
              >
                {t(item.key)}
              </Link>
            ))}

            <div className="pt-1">
              <MobileLanguageSwitcher />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-white/8 pt-4">
            <Link href="/login" onClick={() => setOpen(false)} className="ghost-button w-full">
              {t("login")}
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="gold-button w-full">
              {t("signup")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
