"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher, MobileLanguageSwitcher } from "@/components/marketing/language-switcher";
import { cn } from "@/lib/cn";
import { AppLocale } from "@/lib/types";

const links = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/plans", key: "plans" },
  { href: "/contact", key: "contact" },
] as const;

const mobileLanguageLabel: Record<AppLocale, string> = {
  en: "Display language",
  es: "Idioma de visualizacion",
  zh: "显示语言",
  ar: "لغة العرض",
  hi: "डिस्प्ले भाषा",
};

function isActivePath(pathname: string, href: (typeof links)[number]["href"]) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const locale = useLocale() as AppLocale;
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
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "text-sm transition",
                isActivePath(pathname, item.href) ? "text-ink" : "text-body/72 hover:text-ink",
              )}
            >
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
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-midnight/80 lg:hidden"
          />

          <aside
            id="mobile-site-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-x-0 bottom-0 top-0 z-[100] flex flex-col overflow-hidden bg-[#040a14] lg:hidden"
          >
            <div className="border-b border-white/8 bg-[#040a14]/98 px-4 py-4 shadow-[0_12px_35px_rgba(0,0,0,0.32)] backdrop-blur sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <Link href="/" onClick={() => setOpen(false)} className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-lg text-ink">{tBrand("name")}</p>
                    <p className="truncate text-xs uppercase tracking-[0.22em] text-body/45">{tBrand("tagline")}</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-full border border-white/10 p-3 text-body/80 transition hover:border-cyan/40 hover:text-cyan"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-5 sm:px-6">
              <div className="rounded-[1.9rem] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">{tBrand("tagline")}</p>
                <p className="mt-3 text-sm leading-6 text-body/68">{t("signup")}</p>
              </div>

              <nav className="mt-5 space-y-3">
                {links.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-[1.5rem] border px-4 py-4 text-base transition",
                      isActivePath(pathname, item.href)
                        ? "border-gold/25 bg-gold/10 text-ink"
                        : "border-white/8 bg-white/[0.02] text-body/82 hover:border-cyan/30 hover:bg-white/5 hover:text-ink",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>

              <div className="mt-5 rounded-[1.7rem] border border-white/8 bg-white/[0.02] p-4">
                <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-body/42">
                  {mobileLanguageLabel[locale] ?? mobileLanguageLabel.en}
                </p>
                <MobileLanguageSwitcher className="border-white/8 bg-midnight/20" />
              </div>

              <div className="mt-5 grid gap-3">
                <Link href="/login" onClick={() => setOpen(false)} className="ghost-button w-full">
                  {t("login")}
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="gold-button w-full">
                  {t("signup")}
                </Link>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </header>
  );
}
