"use client";

import { GoogleTranslateBridge } from "@/components/google-translate-bridge";
import { LocaleDocumentSync } from "@/components/locale-document-sync";
import { getLanguageCodeForLocale } from "@/lib/display-language";
import { AppLocale } from "@/lib/types";

export function LocaleEnhancers({ locale, dir }: { locale: string; dir: "ltr" | "rtl" }) {
  return (
    <>
      <LocaleDocumentSync locale={locale} dir={dir} />
      <GoogleTranslateBridge pageLanguage={getLanguageCodeForLocale(locale as AppLocale)} />
    </>
  );
}
