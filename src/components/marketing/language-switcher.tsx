"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LOCALES } from "@/lib/constants";
import {
  applyGoogleTranslateSelection,
  clearGoogleTranslateCookies,
  clearStoredDisplayLanguage,
  getLanguageOptionByCode,
  getLanguageOptionForLocale,
  readStoredDisplayLanguage,
  setGoogleTranslateCookies,
  storeDisplayLanguage,
  SWITCHER_LANGUAGE_OPTIONS,
  SwitcherLanguageOption,
} from "@/lib/display-language";
import { AppLocale } from "@/lib/types";

const localePattern = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);

const toFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const dispatchLanguageChangeEvent = () => {
  window.dispatchEvent(new Event("sgt-language-change"));
};

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<SwitcherLanguageOption>(() => getLanguageOptionForLocale(locale));

  useEffect(() => {
    const syncSelection = () => {
      const storedLanguage = readStoredDisplayLanguage();
      const preferredOption = getLanguageOptionByCode(storedLanguage);
      setSelectedLanguage(preferredOption ?? getLanguageOptionForLocale(locale));
    };

    syncSelection();
    window.addEventListener("storage", syncSelection);
    window.addEventListener("sgt-language-change", syncSelection);

    return () => {
      window.removeEventListener("storage", syncSelection);
      window.removeEventListener("sgt-language-change", syncSelection);
    };
  }, [locale]);

  const buildLocalizedPath = (nextLocale: AppLocale) => {
    const currentPath = pathname || "/";
    const normalizedPath = localePattern.test(currentPath)
      ? currentPath.replace(localePattern, `/${nextLocale}`)
      : `/${nextLocale}${currentPath === "/" ? "" : currentPath}`;
    const query = searchParams.toString();
    return query ? `${normalizedPath}?${query}` : normalizedPath;
  };

  const handleRouteLanguageChange = (option: SwitcherLanguageOption) => {
    clearStoredDisplayLanguage();
    clearGoogleTranslateCookies();
    setSelectedLanguage(option);
    dispatchLanguageChangeEvent();

    if (option.locale && option.locale !== locale) {
      const nextLocale = option.locale;
      startTransition(() => {
        router.replace(buildLocalizedPath(nextLocale));
      });
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  };

  const handleGoogleLanguageChange = (option: SwitcherLanguageOption) => {
    storeDisplayLanguage(option.code);
    setGoogleTranslateCookies(option.code);
    setSelectedLanguage(option);
    dispatchLanguageChangeEvent();
    applyGoogleTranslateSelection(option.code);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-body/85 outline-none transition hover:border-cyan/40 hover:text-cyan">
        <Globe className="h-4 w-4" />
        <span>{toFlagEmoji(selectedLanguage.flag)}</span>
        <span>{selectedLanguage.nativeLabel}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="z-[80] min-w-60 rounded-3xl border border-white/10 bg-[#08111e]/95 p-2 shadow-2xl backdrop-blur-xl"
        >
          {SWITCHER_LANGUAGE_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.code}
              onSelect={(event) => {
                event.preventDefault();
                if (option.locale) {
                  handleRouteLanguageChange(option);
                  return;
                }

                handleGoogleLanguageChange(option);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm text-body/80 outline-none transition hover:bg-white/5 hover:text-ink"
            >
              <span>{toFlagEmoji(option.flag)}</span>
              <div>
                <p className={selectedLanguage.code === option.code ? "text-gold" : ""}>{option.nativeLabel}</p>
                <p className="text-xs text-body/55">{option.label}</p>
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
