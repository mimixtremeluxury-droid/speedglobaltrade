"use client";

import { useEffect } from "react";

export function LocaleDocumentSync({ locale, dir }: { locale: string; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  return null;
}
