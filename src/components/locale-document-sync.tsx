"use client";

import { useEffect } from "react";
import {
  getLanguageDir,
  getLanguageOptionByCode,
  getLanguageOptionForLocale,
  readStoredDisplayLanguage,
} from "@/lib/display-language";
import { AppLocale } from "@/lib/types";

export function LocaleDocumentSync({ locale, dir }: { locale: string; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    const syncDocumentLanguage = () => {
      const storedLanguage = readStoredDisplayLanguage();
      const activeLanguage =
        getLanguageOptionByCode(storedLanguage) ?? getLanguageOptionForLocale(locale as AppLocale);

      document.documentElement.lang = activeLanguage.code;
      document.documentElement.dir = activeLanguage.locale ? dir : getLanguageDir(activeLanguage.code);
    };

    syncDocumentLanguage();
    window.addEventListener("storage", syncDocumentLanguage);
    window.addEventListener("sgt-language-change", syncDocumentLanguage);

    return () => {
      window.removeEventListener("storage", syncDocumentLanguage);
      window.removeEventListener("sgt-language-change", syncDocumentLanguage);
    };
  }, [dir, locale]);

  return null;
}
