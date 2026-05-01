"use client";

import dynamic from "next/dynamic";
import { LocaleDocumentSync } from "@/components/locale-document-sync";

const CrispChat = dynamic(() => import("@/components/CrispChat").then((module) => module.CrispChat), {
  ssr: false,
});

export function LocaleEnhancers({ locale, dir }: { locale: string; dir: "ltr" | "rtl" }) {
  return (
    <>
      <LocaleDocumentSync locale={locale} dir={dir} />
      <CrispChat />
    </>
  );
}
