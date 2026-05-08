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
  { code: "en", locale: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "es", locale: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "zh-CN", locale: "zh", label: "Chinese", nativeLabel: "中文 (简体)", flag: "🇨🇳" },
  { code: "zh-TW", label: "Traditional Chinese", nativeLabel: "中文 (繁體)", flag: "🇹🇼" },
  { code: "ar", locale: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
  { code: "hi", locale: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇧🇩" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", flag: "🇵🇰" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം", flag: "🇮🇳" },
  { code: "or", label: "Odia", nativeLabel: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "ne", label: "Nepali", nativeLabel: "नेपाली", flag: "🇳🇵" },
  { code: "si", label: "Sinhala", nativeLabel: "සිංහල", flag: "🇱🇰" },
  { code: "th", label: "Thai", nativeLabel: "ไทย", flag: "🇹🇭" },
  { code: "lo", label: "Lao", nativeLabel: "ລາວ", flag: "🇱🇦" },
  { code: "my", label: "Burmese", nativeLabel: "မြန်မာ", flag: "🇲🇲" },
  { code: "km", label: "Khmer", nativeLabel: "ខ្មែរ", flag: "🇰🇭" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "fil", label: "Filipino", nativeLabel: "Filipino", flag: "🇵🇭" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog", flag: "🇵🇭" },
  { code: "pl", label: "Polish", nativeLabel: "Polski", flag: "🇵🇱" },
  { code: "cs", label: "Czech", nativeLabel: "Čeština", flag: "🇨🇿" },
  { code: "sk", label: "Slovak", nativeLabel: "Slovenčina", flag: "🇸🇰" },
  { code: "hu", label: "Hungarian", nativeLabel: "Magyar", flag: "🇭🇺" },
  { code: "ro", label: "Romanian", nativeLabel: "Română", flag: "🇷🇴" },
  { code: "bg", label: "Bulgarian", nativeLabel: "Български", flag: "🇧🇬" },
  { code: "sr", label: "Serbian", nativeLabel: "Српски", flag: "🇷🇸" },
  { code: "hr", label: "Croatian", nativeLabel: "Hrvatski", flag: "🇭🇷" },
  { code: "sl", label: "Slovenian", nativeLabel: "Slovenščina", flag: "🇸🇮" },
  { code: "lt", label: "Lithuanian", nativeLabel: "Lietuvių", flag: "🇱🇹" },
  { code: "lv", label: "Latvian", nativeLabel: "Latviešu", flag: "🇱🇻" },
  { code: "et", label: "Estonian", nativeLabel: "Eesti", flag: "🇪🇪" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi", flag: "🇫🇮" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska", flag: "🇸🇪" },
  { code: "da", label: "Danish", nativeLabel: "Dansk", flag: "🇩🇰" },
  { code: "no", label: "Norwegian", nativeLabel: "Norsk", flag: "🇳🇴" },
  { code: "is", label: "Icelandic", nativeLabel: "Íslenska", flag: "🇮🇸" },
  { code: "el", label: "Greek", nativeLabel: "Ελληνικά", flag: "🇬🇷" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷" },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", flag: "🇮🇱" },
  { code: "fa", label: "Persian", nativeLabel: "فارسی", flag: "🇮🇷" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", flag: "🇹🇿" },
  { code: "am", label: "Amharic", nativeLabel: "አማርኛ", flag: "🇪🇹" },
  { code: "ha", label: "Hausa", nativeLabel: "Hausa", flag: "🇳🇬" },
  { code: "ig", label: "Igbo", nativeLabel: "Igbo", flag: "🇳🇬" },
  { code: "yo", label: "Yoruba", nativeLabel: "Yorùbá", flag: "🇳🇬" },
  { code: "zu", label: "Zulu", nativeLabel: "IsiZulu", flag: "🇿🇦" },
  { code: "xh", label: "Xhosa", nativeLabel: "IsiXhosa", flag: "🇿🇦" },
  { code: "st", label: "Sesotho", nativeLabel: "Sesotho", flag: "🇿🇦" },
  { code: "tn", label: "Setswana", nativeLabel: "Setswana", flag: "🇿🇦" },
  { code: "af", label: "Afrikaans", nativeLabel: "Afrikaans", flag: "🇿🇦" },
];

export function getLanguageOptionByCode(code: string | null | undefined) {
  if (!code) return null;
  return SWITCHER_LANGUAGE_OPTIONS.find((option) => option.code === code) ?? null;
}

export function isGoogleTranslateOnlyLanguage(code: string | null | undefined) {
  const option = getLanguageOptionByCode(code);
  return Boolean(option && !option.locale);
}

export function getLanguageOptionForLocale(locale: AppLocale) {
  const match = SWITCHER_LANGUAGE_OPTIONS.find((option) => option.locale === locale);
  return match ?? SWITCHER_LANGUAGE_OPTIONS[0];
}

export function getLanguageCodeForLocale(locale: AppLocale) {
  return ROUTE_LOCALE_LANGUAGE_CODES[locale];
}

export function getLanguageDir(code: string) {
  return ["ar", "fa", "he", "ur"].includes(code) ? "rtl" : "ltr";
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
    return false;
  }

  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (!select) {
    if (attempt < 16) {
      window.setTimeout(() => applyGoogleTranslateSelection(code, attempt + 1), 250);
    }
    return false;
  }

  if (select.value !== code) {
    select.value = code;
  }

  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}
