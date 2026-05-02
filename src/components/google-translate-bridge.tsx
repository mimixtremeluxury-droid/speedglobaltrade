"use client";

import GoogleTranslate from "next-google-translate-widget";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  applyGoogleTranslateSelection,
  readStoredDisplayLanguage,
  setGoogleTranslateCookies,
  SWITCHER_LANGUAGE_OPTIONS,
} from "@/lib/display-language";

export function GoogleTranslateBridge({ pageLanguage }: { pageLanguage: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const preferredLanguage = readStoredDisplayLanguage();
    if (!preferredLanguage || preferredLanguage === pageLanguage) {
      return;
    }

    setGoogleTranslateCookies(preferredLanguage);
    applyGoogleTranslateSelection(preferredLanguage);
  }, [pageLanguage, pathname]);

  return (
    <div className="hidden" aria-hidden="true">
      <GoogleTranslate
        pageLanguage={pageLanguage}
        languages={SWITCHER_LANGUAGE_OPTIONS.map(({ code, label, flag }) => ({
          value: code,
          label,
          flag: flag.toLowerCase(),
        }))}
      />
    </div>
  );
}
