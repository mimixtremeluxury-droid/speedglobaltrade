"use client";

import { MessageCircleMore } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppLocale } from "@/lib/types";

const DEFAULT_SMARTSUPP_KEY = "bf325982577c378cebb163441ac5dea0dbe70a88";
const WHATSAPP_URL = "https://wa.me/13432556574";

const SMARTSUPP_LANGUAGE_MAP: Record<AppLocale, string> = {
  en: "en",
  zh: "zh",
  es: "es",
  ar: "ar",
  hi: "hi",
};

const CHAT_COPY: Record<
  AppLocale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
  }
> = {
  en: {
    eyebrow: "Support desk",
    title: "Open live chat",
    subtitle: "Real-time chat with the team",
  },
  zh: {
    eyebrow: "\u652f\u6301\u4e2d\u5fc3",
    title: "\u6253\u5f00\u5b9e\u65f6\u804a\u5929",
    subtitle: "\u4e0e\u56e2\u961f\u5b9e\u65f6\u5bf9\u8bdd",
  },
  es: {
    eyebrow: "Mesa de soporte",
    title: "Abrir chat en vivo",
    subtitle: "Habla con el equipo en tiempo real",
  },
  ar: {
    eyebrow: "\u0645\u0643\u062a\u0628 \u0627\u0644\u062f\u0639\u0645",
    title: "\u0627\u0641\u062a\u062d \u0627\u0644\u062f\u0631\u062f\u0634\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629",
    subtitle: "\u062a\u062d\u062f\u062b \u0645\u0639 \u0627\u0644\u0641\u0631\u064a\u0642 \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a",
  },
  hi: {
    eyebrow: "\u0938\u092a\u094b\u0930\u094d\u091f \u0921\u0947\u0938\u094d\u0915",
    title: "\u0932\u093e\u0907\u0935 \u091a\u0948\u091f \u0916\u094b\u0932\u0947\u0902",
    subtitle: "\u091f\u0940\u092e \u0938\u0947 \u0930\u093f\u092f\u0932-\u091f\u093e\u0907\u092e \u091a\u0948\u091f",
  },
};

type SmartsuppCallback = (...args: unknown[]) => void;
type SmartsuppArgument = string | SmartsuppCallback;
type SmartsuppInvocation = [string, ...SmartsuppArgument[]];

type SmartsuppCallable = ((...args: SmartsuppInvocation) => void) & {
  _: SmartsuppInvocation[];
};

type SmartsuppConfig = {
  key?: string;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  orientation?: "left" | "right";
};

declare global {
  interface Window {
    _smartsupp?: SmartsuppConfig;
    smartsupp?: SmartsuppCallable;
    __sgtSmartsuppCloseBound?: boolean;
  }
}

function ensureSmartsuppStub() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!window.smartsupp) {
    const queue = ((...args: SmartsuppInvocation) => {
      queue._.push(args);
    }) as SmartsuppCallable;
    queue._ = [];
    window.smartsupp = queue;
  }

  return window.smartsupp;
}

function setWidgetContainerInteractivity(interactive: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  const container = document.getElementById("smartsupp-widget-container");
  if (!container) {
    return;
  }

  container.style.pointerEvents = interactive ? "auto" : "none";
}

export function SmartsuppChat({ locale }: { locale: AppLocale }) {
  const [isReady, setIsReady] = useState(false);
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY || DEFAULT_SMARTSUPP_KEY;
  const copy = useMemo(() => CHAT_COPY[locale] ?? CHAT_COPY.en, [locale]);

  useEffect(() => {
    if (!smartsuppKey || typeof window === "undefined") {
      return;
    }

    window._smartsupp = {
      ...(window._smartsupp ?? {}),
      key: smartsuppKey,
      color: "#F5A623",
      offsetX: 20,
      offsetY: 104,
      orientation: "right",
    };

    const smartsupp = ensureSmartsuppStub();
    if (!smartsupp) {
      return;
    }

    smartsupp("language", SMARTSUPP_LANGUAGE_MAP[locale] ?? "en");
    if (!window.__sgtSmartsuppCloseBound) {
      smartsupp("on", "messenger_close", () => {
        setWidgetContainerInteractivity(false);
      });
      window.__sgtSmartsuppCloseBound = true;
    }

    const existingScript = document.getElementById("smartsupp-loader") as HTMLScriptElement | null;
    if (existingScript) {
      setIsReady(true);
      smartsupp("chat:hide");
      setWidgetContainerInteractivity(false);
      return;
    }

    const script = document.createElement("script");
    script.id = "smartsupp-loader";
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.src = "https://www.smartsuppchat.com/loader.js?";
    script.onload = () => {
      setIsReady(true);
      window.smartsupp?.("language", SMARTSUPP_LANGUAGE_MAP[locale] ?? "en");
      window.smartsupp?.("chat:hide");
      setWidgetContainerInteractivity(false);
    };
    document.head.appendChild(script);
  }, [locale, smartsuppKey]);

  function openChat() {
    const smartsupp = ensureSmartsuppStub();
    if (smartsupp) {
      setWidgetContainerInteractivity(true);
      smartsupp("chat:show");
      smartsupp("chat:open");
      return;
    }

    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  }

  if (!smartsuppKey) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openChat}
      title={copy.title}
      className="group fixed bottom-5 right-4 z-[75] inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-[#07111d]/92 text-gold shadow-[0_18px_45px_rgba(0,0,0,0.38)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      aria-label={copy.title}
    >
      <span className="absolute inset-0 rounded-full border border-cyan/15 opacity-70 transition group-hover:opacity-100" />
      <span className="absolute inset-[5px] rounded-full bg-gold-gradient opacity-95" />
      <MessageCircleMore className="relative z-10 h-4 w-4 text-midnight sm:h-5 sm:w-5" />
      <span className="sr-only">{isReady ? copy.subtitle : "Loading support channel..."}</span>
    </button>
  );
}
