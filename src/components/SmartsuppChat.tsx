"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { AppLocale } from "@/lib/types";

type SmartsuppQueue = ((...args: unknown[]) => void) & {
  _: unknown[][];
};

declare global {
  interface Window {
    smartsupp?: SmartsuppQueue;
    _smartsupp?: {
      key?: string;
    };
  }
}

const DEFAULT_SMARTSUPP_KEY = "bf325982577c378cebb163441ac5dea0dbe70a88";
const SMARTSUPP_SCRIPT_ID = "sgt-smartsupp-loader";
const SMARTSUPP_STYLE_ID = "sgt-smartsupp-theme";

function ensureSmartsuppQueue() {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.smartsupp) {
    const queue = ((...args: unknown[]) => {
      queue._.push(args);
    }) as SmartsuppQueue;
    queue._ = [];
    window.smartsupp = queue;
  }
}

export function SmartsuppChat({ locale }: { locale?: AppLocale }) {
  const session = useAppStore((state) => state.session);
  const user = useAppStore((state) => state.user);
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY || DEFAULT_SMARTSUPP_KEY;

  useEffect(() => {
    if (typeof window === "undefined" || !smartsuppKey) {
      return;
    }

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = smartsuppKey;
    ensureSmartsuppQueue();

    if (locale) {
      const chatLocale = locale === "zh" ? "zh-CN" : locale;
      window.smartsupp?.("language", chatLocale);
    }

    if (document.getElementById(SMARTSUPP_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = SMARTSUPP_SCRIPT_ID;
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://www.smartsuppchat.com/loader.js?";
    script.onload = () => {
      console.log("Smartsupp loaded");
    };
    script.onerror = () => {
      console.error("Smartsupp failed to load");
    };
    document.body.appendChild(script);
  }, [locale, smartsuppKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const email = session?.email ?? user?.profile.email;
    const fullName = session?.fullName ?? user?.profile.fullName;

    if (email) {
      window.smartsupp?.("email", email);
    }

    if (fullName) {
      window.smartsupp?.("name", fullName);
    }
  }, [session, user]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (document.getElementById(SMARTSUPP_STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = SMARTSUPP_STYLE_ID;
    style.textContent = `
      #smartsupp-widget-container {
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
        z-index: 999999 !important;
      }

      #smartsupp-widget-container .smartsupp-widget-launcher {
        background: linear-gradient(135deg, #f5a623 0%, #d48a1a 100%) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
        width: 56px !important;
        height: 56px !important;
        border-radius: 999px !important;
        bottom: 24px !important;
        right: 24px !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      #smartsupp-widget-container .smartsupp-widget-launcher:hover {
        transform: scale(1.08) !important;
        box-shadow: 0 6px 24px rgba(245, 166, 35, 0.4) !important;
      }

      #smartsupp-widget-container .smartsupp-widget-launcher .smartsupp-widget-launcher-text,
      #smartsupp-widget-container .smartsupp-widget-launcher-text {
        display: none !important;
      }

      #smartsupp-widget-container .smartsupp-widget-frame {
        border-radius: 20px !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
        bottom: 90px !important;
        right: 24px !important;
      }

      @media (max-width: 768px) {
        #smartsupp-widget-container .smartsupp-widget-launcher {
          width: 48px !important;
          height: 48px !important;
          bottom: 16px !important;
          right: 16px !important;
        }

        #smartsupp-widget-container .smartsupp-widget-frame {
          bottom: 76px !important;
          right: 16px !important;
          width: calc(100vw - 32px) !important;
          max-width: 380px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  return null;
}
