"use client";

import { GoogleTranslateRoot } from "@/components/GoogleTranslate";
import { LocaleDocumentSync } from "@/components/locale-document-sync";
import { getLanguageCodeForLocale } from "@/lib/display-language";
import { AppLocale } from "@/lib/types";

export function LocaleEnhancers({ locale, dir }: { locale: string; dir: "ltr" | "rtl" }) {
  return (
    <>
      <LocaleDocumentSync locale={locale} dir={dir} />
      <GoogleTranslateRoot pageLanguage={getLanguageCodeForLocale(locale as AppLocale)} />
    </>
  );
}
