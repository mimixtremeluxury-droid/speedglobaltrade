"use client";

import { useCallback, useEffect } from "react";
import {
  applyGoogleTranslateSelection,
  readStoredDisplayLanguage,
  setGoogleTranslateCookies,
  storeDisplayLanguage,
  SWITCHER_LANGUAGE_OPTIONS,
} from "@/lib/display-language";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              autoDisplay: boolean;
              layout: unknown;
            },
            elementId: string,
          ): unknown;
          InlineLayout: {
            SIMPLE: unknown;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const GOOGLE_TRANSLATE_ELEMENT_ID = "google_translate_element";
const GOOGLE_TRANSLATE_SCRIPT_ID = "sgt-google-translate";

function initializeTranslateElement(pageLanguage: string) {
  if (!window.google?.translate?.TranslateElement) {
    return false;
  }

  const container = document.getElementById(GOOGLE_TRANSLATE_ELEMENT_ID);
  if (!container) {
    return false;
  }

  container.innerHTML = "";

  new window.google.translate.TranslateElement(
    {
      pageLanguage,
      includedLanguages: SWITCHER_LANGUAGE_OPTIONS.map((language) => language.code).join(","),
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    GOOGLE_TRANSLATE_ELEMENT_ID,
  );

  window.dispatchEvent(new Event("sgt-google-translate-ready"));
  return true;
}

export function GoogleTranslateRoot({ pageLanguage }: { pageLanguage: string }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const applyPreferredLanguage = () => {
      const preferredLanguage = readStoredDisplayLanguage();
      if (!preferredLanguage || preferredLanguage === pageLanguage) {
        return;
      }

      setGoogleTranslateCookies(preferredLanguage);
      window.setTimeout(() => {
        applyGoogleTranslateSelection(preferredLanguage);
      }, 250);
    };

    const bootTranslator = () => {
      if (initializeTranslateElement(pageLanguage)) {
        applyPreferredLanguage();
      }
    };

    window.googleTranslateElementInit = bootTranslator;

    if (window.google?.translate?.TranslateElement) {
      bootTranslator();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, [pageLanguage]);

  return <div id={GOOGLE_TRANSLATE_ELEMENT_ID} className="hidden" aria-hidden="true" />;
}

export default function useGoogleTranslate() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedLanguage = readStoredDisplayLanguage();
    if (!savedLanguage) {
      return;
    }

    const checkInterval = window.setInterval(() => {
      const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (!selectElement) {
        return;
      }

      window.clearInterval(checkInterval);
      setGoogleTranslateCookies(savedLanguage);
      if (selectElement.value !== savedLanguage) {
        selectElement.value = savedLanguage;
      }
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
    }, 500);

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(checkInterval);
    }, 5000);

    return () => {
      window.clearInterval(checkInterval);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const setLanguage = useCallback((langCode: string) => {
    storeDisplayLanguage(langCode);
    setGoogleTranslateCookies(langCode);
    const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;

    if (selectElement) {
      if (selectElement.value !== langCode) {
        selectElement.value = langCode;
      }
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      window.setTimeout(() => {
        window.location.reload();
      }, 300);
      return true;
    }

    const applied = applyGoogleTranslateSelection(langCode);
    window.setTimeout(() => {
      window.location.reload();
    }, applied ? 300 : 0);
    return applied;
  }, []);

  return {
    setLanguage,
    languages: SWITCHER_LANGUAGE_OPTIONS,
  };
}
