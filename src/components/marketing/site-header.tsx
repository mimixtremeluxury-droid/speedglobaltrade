"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          className="fixed inset-0 z-[70] bg-midnight/78 backdrop-blur-md lg:hidden"
        />
      ) : null}

      <div
        id="mobile-site-nav"
        className={cn(
          "fixed inset-x-0 bottom-0 top-[5.1rem] z-[80] overflow-hidden border-t border-white/10 bg-[#040a14]/96 shadow-[0_-28px_80px_rgba(0,0,0,0.46)] backdrop-blur-2xl transition duration-300 overscroll-contain lg:hidden",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div className="flex h-full min-h-0 flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 sm:px-6">
          <div className="rounded-[1.9rem] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
            <div>
              <p className="font-heading text-lg text-ink">{tBrand("name")}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-body/45">{tBrand("tagline")}</p>
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            <nav className="space-y-3">
              {links.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[1.5rem] border border-white/8 bg-white/[0.02] px-4 py-4 text-base text-body/82 transition hover:border-cyan/30 hover:bg-white/5 hover:text-ink"
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <div className="mt-5 rounded-[1.7rem] border border-white/8 bg-white/[0.02] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-body/42">Display language</p>
              <MobileLanguageSwitcher className="border-white/8 bg-midnight/20" />
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
