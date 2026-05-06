"use client";

import { Menu, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/marketing/language-switcher";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/plans", key: "plans" },
  { href: "/contact", key: "contact" },
] as const;

const MobileNav = dynamic(() => import("@/components/marketing/mobile-nav").then((mod) => mod.MobileNav), {
  ssr: false,
  loading: () => (
    <button
      type="button"
      disabled
      aria-label="Open navigation"
      className="inline-flex rounded-full border border-white/10 p-3 text-body/45"
    >
      <Menu className="h-5 w-5" />
    </button>
  ),
});

function isActivePath(pathname: string, href: (typeof links)[number]["href"]) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();

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

        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
