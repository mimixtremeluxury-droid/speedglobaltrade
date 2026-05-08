"use client";

import dynamic from "next/dynamic";
import { AppLocale } from "@/lib/types";

const SmartsuppChat = dynamic(() => import("@/components/SmartsuppChat").then((mod) => mod.SmartsuppChat), {
  ssr: false,
});

export function SmartsuppChatLoader({ locale }: { locale: AppLocale }) {
  return <SmartsuppChat locale={locale} />;
}
