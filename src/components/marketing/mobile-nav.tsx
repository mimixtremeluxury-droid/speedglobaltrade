"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { MobileLanguageSwitcher } from "@/components/marketing/language-switcher";
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

export function MobileNav() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Toggle navigation"
          className="inline-flex rounded-full border border-white/10 p-3 text-body/80 transition hover:border-cyan/40 hover:text-cyan"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-midnight/80 backdrop-blur-md duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />

        <Dialog.Content
          id="mobile-site-nav"
          className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-sm flex-col overflow-hidden border-l border-white/10 bg-[linear-gradient(180deg,#07101c_0%,#040a14_100%)] shadow-[0_28px_90px_rgba(0,0,0,0.48)] duration-200 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 focus:outline-none"
        >
          <div className="border-b border-white/8 bg-[#040a14]/94 px-4 py-4 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur sm:px-6">
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

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close navigation"
                  className="inline-flex rounded-full border border-white/10 p-3 text-body/80 transition hover:border-cyan/40 hover:text-cyan"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-5 sm:px-6">
            <Dialog.Title className="sr-only">{tBrand("name")} navigation</Dialog.Title>
            <Dialog.Description className="sr-only">
              Browse the main pages, change the display language, or continue to login and signup.
            </Dialog.Description>

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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
