"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Languages } from "lucide-react";
import { startTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LANGUAGE_OPTIONS, LOCALES } from "@/lib/constants";

const toFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const localePattern = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = LANGUAGE_OPTIONS.find((item) => item.locale === locale) ?? LANGUAGE_OPTIONS[0];

  const buildLocalizedPath = (nextLocale: (typeof LANGUAGE_OPTIONS)[number]["locale"]) => {
    const currentPath = pathname || "/";
    const normalizedPath = localePattern.test(currentPath)
      ? currentPath.replace(localePattern, `/${nextLocale}`)
      : `/${nextLocale}${currentPath === "/" ? "" : currentPath}`;
    const query = searchParams.toString();
    return query ? `${normalizedPath}?${query}` : normalizedPath;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-body/85 outline-none transition hover:border-cyan/40 hover:text-cyan">
        <Languages className="h-4 w-4" />
        <span>{toFlagEmoji(current.flag)}</span>
        <span>{current.nativeLabel}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="z-[80] min-w-56 rounded-3xl border border-white/10 bg-[#08111e]/95 p-2 shadow-2xl backdrop-blur-xl"
        >
          {LANGUAGE_OPTIONS.map((item) => (
            <DropdownMenu.Item
              key={item.locale}
              onSelect={(event) => {
                event.preventDefault();
                startTransition(() => {
                  router.replace(buildLocalizedPath(item.locale));
                });
              }}
              className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm text-body/80 outline-none transition hover:bg-white/5 hover:text-ink"
            >
              <span>{toFlagEmoji(item.flag)}</span>
              <div>
                <p>{item.nativeLabel}</p>
                <p className="text-xs text-body/55">{item.label}</p>
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
