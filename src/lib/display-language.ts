import { AppLocale } from "@/lib/types";

export type SwitcherLanguageOption = {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
  locale?: AppLocale;
};

export const PREFERRED_LANGUAGE_STORAGE_KEY = "preferredLanguage";
export const GOOGLE_TRANSLATE_STORAGE_KEY = "ngt_lang";

export const ROUTE_LOCALE_LANGUAGE_CODES: Record<AppLocale, string> = {
  en: "en",
  zh: "zh-CN",
  es: "es",
  ar: "ar",
  hi: "hi",
};

export const SWITCHER_LANGUAGE_OPTIONS: SwitcherLanguageOption[] = [
  { code: "en", locale: "en", label: "English", nativeLabel: "English", flag: "GB" },
  { code: "es", locale: "es", label: "Spanish", nativeLabel: "Espa\u00f1ol", flag: "ES" },
  { code: "fr", label: "French", nativeLabel: "Fran\u00e7ais", flag: "FR" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "DE" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "IT" },
  { code: "pt", label: "Portuguese", nativeLabel: "Portugu\u00eas", flag: "PT" },
  { code: "ru", label: "Russian", nativeLabel: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", flag: "RU" },
  { code: "ja", label: "Japanese", nativeLabel: "\u65e5\u672c\u8a9e", flag: "JP" },
  { code: "ko", label: "Korean", nativeLabel: "\ud55c\uad6d\uc5b4", flag: "KR" },
  { code: "zh-CN", locale: "zh", label: "Chinese", nativeLabel: "\u7b80\u4f53\u4e2d\u6587", flag: "CN" },
  { code: "ar", locale: "ar", label: "Arabic", nativeLabel: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "SA" },
  { code: "hi", locale: "hi", label: "Hindi", nativeLabel: "\u0939\u093f\u0928\u094d\u0926\u0940", flag: "IN" },
];

export function getLanguageOptionByCode(code: string | null | undefined) {
  if (!code) return null;
  return SWITCHER_LANGUAGE_OPTIONS.find((option) => option.code === code) ?? null;
}

export function getLanguageOptionForLocale(locale: AppLocale) {
  const match = SWITCHER_LANGUAGE_OPTIONS.find((option) => option.locale === locale);
  return match ?? SWITCHER_LANGUAGE_OPTIONS[0];
}

export function getLanguageCodeForLocale(locale: AppLocale) {
  return ROUTE_LOCALE_LANGUAGE_CODES[locale];
}

export function getLanguageDir(code: string) {
  return code === "ar" ? "rtl" : "ltr";
}

export function readStoredDisplayLanguage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(PREFERRED_LANGUAGE_STORAGE_KEY);
}

export function storeDisplayLanguage(code: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PREFERRED_LANGUAGE_STORAGE_KEY, code);
  window.localStorage.setItem(GOOGLE_TRANSLATE_STORAGE_KEY, code);
}

export function clearStoredDisplayLanguage() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PREFERRED_LANGUAGE_STORAGE_KEY);
  window.localStorage.removeItem(GOOGLE_TRANSLATE_STORAGE_KEY);
}

export function setGoogleTranslateCookies(code: string) {
  if (typeof document === "undefined") {
    return;
  }

  const value = `/auto/${code}`;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/;domain=${window.location.hostname}`;
}

export function clearGoogleTranslateCookies() {
  if (typeof document === "undefined") {
    return;
  }

  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=;expires=${expires};path=/`;
  document.cookie = `googtrans=;expires=${expires};path=/;domain=${window.location.hostname}`;
}

export function applyGoogleTranslateSelection(code: string, attempt = 0) {
  if (typeof document === "undefined") {
    return;
  }

  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (!select) {
    if (attempt < 16) {
      window.setTimeout(() => applyGoogleTranslateSelection(code, attempt + 1), 250);
    }
    return;
  }

  if (select.value !== code) {
    select.value = code;
  }

  select.dispatchEvent(new Event("change"));
}
