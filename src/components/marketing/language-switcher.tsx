"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { LOCALES } from "@/lib/constants";
import {
  applyGoogleTranslateSelection,
  clearGoogleTranslateCookies,
  clearStoredDisplayLanguage,
  getLanguageOptionByCode,
  getLanguageOptionForLocale,
  isGoogleTranslateOnlyLanguage,
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

function useLanguageSwitcherController() {
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
    const currentPath = typeof window !== "undefined" ? window.location.pathname : pathname || "/";
    const normalizedPath = localePattern.test(currentPath)
      ? currentPath.replace(localePattern, `/${nextLocale}`)
      : `/${nextLocale}${currentPath === "/" ? "" : currentPath}`;
    const query =
      typeof window !== "undefined"
        ? window.location.search
        : searchParams.toString()
          ? `?${searchParams.toString()}`
          : "";
    return `${normalizedPath}${query}`;
  };

  const handleRouteLanguageChange = (option: SwitcherLanguageOption) => {
    const storedLanguage = readStoredDisplayLanguage();
    const shouldHardResetTranslatedDom = isGoogleTranslateOnlyLanguage(storedLanguage);
    const nextLocale = option.locale ?? locale;
    const nextPath = buildLocalizedPath(nextLocale);
    const currentLocation =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : buildLocalizedPath(locale);
    clearStoredDisplayLanguage();
    clearGoogleTranslateCookies();
    setSelectedLanguage(option);
    dispatchLanguageChangeEvent();

    if (option.locale && nextPath !== currentLocation) {
      window.location.assign(nextPath);
      return;
    }

    if (shouldHardResetTranslatedDom) {
      window.location.assign(nextPath);
      return;
    }

    router.refresh();
  };

  const handleGoogleLanguageChange = (option: SwitcherLanguageOption) => {
    storeDisplayLanguage(option.code);
    setGoogleTranslateCookies(option.code);
    setSelectedLanguage(option);
    dispatchLanguageChangeEvent();
    applyGoogleTranslateSelection(option.code);
    window.setTimeout(() => {
      window.location.reload();
    }, 120);
  };

  const selectOption = (option: SwitcherLanguageOption) => {
    if (option.locale) {
      handleRouteLanguageChange(option);
      return;
    }

    handleGoogleLanguageChange(option);
  };

  return {
    selectedLanguage,
    selectOption,
  };
}

export function LanguageSwitcher({
  triggerClassName,
  contentClassName,
  align = "end",
}: {
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
} = {}) {
  const { selectedLanguage, selectOption } = useLanguageSwitcherController();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-body/85 outline-none transition hover:border-cyan/40 hover:text-cyan",
          triggerClassName,
        )}
      >
        <Globe className="h-4 w-4" />
        <span>{toFlagEmoji(selectedLanguage.flag)}</span>
        <span className="truncate">{selectedLanguage.nativeLabel}</span>
        <ChevronDown className="h-4 w-4 shrink-0" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          collisionPadding={16}
          sideOffset={10}
          className={cn(
            "z-[80] max-h-[min(60vh,26rem)] min-w-60 overflow-y-auto rounded-3xl border border-white/10 bg-[#08111e]/95 p-2 shadow-2xl backdrop-blur-xl",
            contentClassName,
          )}
        >
          {SWITCHER_LANGUAGE_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.code}
              onSelect={(event) => {
                event.preventDefault();
                selectOption(option);
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

export function MobileLanguageSwitcher({ className }: { className?: string } = {}) {
  const { selectedLanguage, selectOption } = useLanguageSwitcherController();

  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-body/85",
        className,
      )}
    >
      <Globe className="h-4 w-4 shrink-0" />
      <span className="shrink-0">{toFlagEmoji(selectedLanguage.flag)}</span>
      <div className="relative min-w-0 flex-1">
        <select
          name="display-language"
          value={selectedLanguage.code}
          onChange={(event) => {
            const option = getLanguageOptionByCode(event.target.value);
            if (option) {
              selectOption(option);
            }
          }}
          className="h-6 w-full appearance-none bg-transparent pr-6 text-left text-sm text-ink outline-none"
        >
          {SWITCHER_LANGUAGE_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.nativeLabel} - {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1 h-4 w-4 text-body/55" />
      </div>
    </label>
  );
}
