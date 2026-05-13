"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { AppLocale } from "@/lib/types";

type SmartsuppQueue = ((...args: unknown[]) => void) & {
  _: unknown[][];
};

type SmartsuppStatus = "idle" | "loading" | "retrying" | "ready" | "failed";

type SmartsuppContext = {
  chatLocale?: string;
  email?: string;
  fullName?: string;
};

declare global {
  interface Window {
    smartsupp?: SmartsuppQueue;
    _smartsupp?: {
      key?: string;
      [key: string]: unknown;
    };
    SGT_SMARTSUPP_FALLBACK?: boolean;
    SGT_SMARTSUPP_LAST_ERROR?: string;
    SGT_RELOAD_SMARTSUPP?: () => void;
    SGT_SMARTSUPP_DIAGNOSTICS?: () => Record<string, unknown>;
  }
}

const DEFAULT_SMARTSUPP_KEY = "bf325982577c378cebb163441ac5dea0dbe70a88";
const SMARTSUPP_SCRIPT_ID = "sgt-smartsupp-loader";
const SMARTSUPP_STYLE_ID = "sgt-smartsupp-theme";
const SMARTSUPP_CONTAINER_ID = "smartsupp-widget-container";
const SMARTSUPP_LOADER_SRC = "https://www.smartsuppchat.com/loader.js";
const SMARTSUPP_SCRIPT_TIMEOUT_MS = 10000;
const SMARTSUPP_MOUNT_TIMEOUT_MS = 8000;
const SMARTSUPP_RETRY_DELAYS_MS = [0, 2000, 5000, 10000];

function createSmartsuppQueue() {
  const queue = ((...args: unknown[]) => {
    queue._.push(args);
  }) as SmartsuppQueue;
  queue._ = [];
  return queue;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getSmartsuppScripts() {
  return Array.from(
    document.querySelectorAll<HTMLScriptElement>(
      `#${SMARTSUPP_SCRIPT_ID}, script[src^="${SMARTSUPP_LOADER_SRC}"]`,
    ),
  );
}

function resetSmartsuppDom() {
  getSmartsuppScripts().forEach((script) => script.remove());
  document.getElementById(SMARTSUPP_CONTAINER_ID)?.remove();
  delete window.smartsupp;
}

function prepareSmartsuppGlobals(smartsuppKey: string) {
  window._smartsupp = {
    ...(window._smartsupp ?? {}),
    key: smartsuppKey,
  };
  window.smartsupp = createSmartsuppQueue();
}

function syncSmartsuppContext({ chatLocale, email, fullName }: SmartsuppContext) {
  if (!window.smartsupp) {
    return false;
  }

  if (chatLocale) {
    window.smartsupp("language", chatLocale);
  }

  if (email) {
    window.smartsupp("email", email);
  }

  if (fullName) {
    window.smartsupp("name", fullName);
  }

  return true;
}

function hasMountedSmartsuppWidget() {
  const container = document.getElementById(SMARTSUPP_CONTAINER_ID);

  if (container?.querySelector("iframe, .smartsupp-widget-launcher, [class*='launcher']")) {
    return true;
  }

  return Boolean(
    document.querySelector(
      `iframe[src*="smartsupp" i], iframe[title*="smartsupp" i], [class*="smartsupp-widget-launcher"]`,
    ),
  );
}

function setImportantStyle(element: HTMLElement, property: string, value: string) {
  element.style.setProperty(property, value, "important");
}

function forceSmartsuppVisible() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(
      `#${SMARTSUPP_CONTAINER_ID}, #${SMARTSUPP_CONTAINER_ID} .smartsupp-widget-launcher, #${SMARTSUPP_CONTAINER_ID} [class*="launcher"], #${SMARTSUPP_CONTAINER_ID} .smartsupp-widget-frame, iframe[src*="smartsupp" i], iframe[title*="smartsupp" i]`,
    ),
  );

  elements.forEach((element) => {
    setImportantStyle(element, "visibility", "visible");
    setImportantStyle(element, "opacity", "1");
    setImportantStyle(element, "z-index", "2147483647");

    if (element.id === SMARTSUPP_CONTAINER_ID) {
      setImportantStyle(element, "pointer-events", "none");
    } else {
      setImportantStyle(element, "pointer-events", "auto");
    }

    if (element.hidden) {
      element.hidden = false;
    }

    if (element.style.display === "none") {
      setImportantStyle(element, "display", "block");
    }
  });

  const container = document.getElementById(SMARTSUPP_CONTAINER_ID);

  if (container) {
    setImportantStyle(container, "position", "fixed");
  }

  return elements.length > 0;
}

function insertSmartsuppScript(smartsuppKey: string, attempt: number) {
  return new Promise<void>((resolve, reject) => {
    prepareSmartsuppGlobals(smartsuppKey);
    let isSettled = false;

    const script = document.createElement("script");
    script.id = SMARTSUPP_SCRIPT_ID;
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.src = `${SMARTSUPP_LOADER_SRC}?sgtAttempt=${attempt + 1}&sgtTs=${Date.now()}`;
    script.onload = () => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      window.clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      window.clearTimeout(timeout);
      reject(new Error("The Smartsupp loader script was blocked or failed to download."));
    };

    const timeout = window.setTimeout(() => {
      if (isSettled) {
        return;
      }

      isSettled = true;
      script.remove();
      reject(new Error("The Smartsupp loader script request timed out."));
    }, SMARTSUPP_SCRIPT_TIMEOUT_MS);

    document.head.appendChild(script);
  });
}

function waitForSmartsuppWidget(timeoutMs: number) {
  if (hasMountedSmartsuppWidget()) {
    forceSmartsuppVisible();
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      resolve(hasMountedSmartsuppWidget());
    }, timeoutMs);

    const interval = window.setInterval(() => {
      if (hasMountedSmartsuppWidget()) {
        cleanup();
        forceSmartsuppVisible();
        resolve(true);
      }
    }, 250);

    const observer = new MutationObserver(() => {
      if (hasMountedSmartsuppWidget()) {
        cleanup();
        forceSmartsuppVisible();
        resolve(true);
      }
    });

    const cleanup = () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
      observer.disconnect();
    };

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "hidden", "aria-hidden"],
      childList: true,
      subtree: true,
    });
  });
}

function injectSmartsuppStyles() {
  if (document.getElementById(SMARTSUPP_STYLE_ID)) {
    return null;
  }

  const style = document.createElement("style");
  style.id = SMARTSUPP_STYLE_ID;
  style.textContent = `
    #smartsupp-widget-container,
    #smartsupp-widget-container .smartsupp-widget-launcher,
    #smartsupp-widget-container [class*="launcher"],
    #smartsupp-widget-container .smartsupp-widget-frame,
    iframe[src*="smartsupp" i],
    iframe[title*="smartsupp" i] {
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      z-index: 2147483647 !important;
    }

    #smartsupp-widget-container {
      display: block !important;
      position: fixed !important;
      pointer-events: none !important;
    }

    #smartsupp-widget-container .smartsupp-widget-launcher,
    #smartsupp-widget-container [class*="launcher"] {
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
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      z-index: 2147483647 !important;
    }

    #smartsupp-widget-container .smartsupp-widget-launcher:hover,
    #smartsupp-widget-container [class*="launcher"]:hover {
      transform: scale(1.08) !important;
      box-shadow: 0 6px 24px rgba(245, 166, 35, 0.4) !important;
    }

    #smartsupp-widget-container .smartsupp-widget-launcher .smartsupp-widget-launcher-text,
    #smartsupp-widget-container .smartsupp-widget-launcher-text {
      display: none !important;
    }

    #smartsupp-widget-container .smartsupp-widget-frame,
    iframe[src*="smartsupp" i],
    iframe[title*="smartsupp" i] {
      border-radius: 20px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
      pointer-events: auto !important;
      z-index: 2147483647 !important;
    }

    @media (max-width: 768px) {
      #smartsupp-widget-container .smartsupp-widget-launcher,
      #smartsupp-widget-container [class*="launcher"] {
        width: 48px !important;
        height: 48px !important;
        bottom: 16px !important;
        right: 16px !important;
      }

      #smartsupp-widget-container .smartsupp-widget-frame {
        max-width: calc(100vw - 16px) !important;
        max-height: calc(100dvh - 96px) !important;
      }
    }
  `;
  document.head.appendChild(style);

  return style;
}

function getSmartsuppDiagnostics() {
  const container = document.getElementById(SMARTSUPP_CONTAINER_ID);
  const loaderScript = document.querySelector<HTMLScriptElement>(`script[src^="${SMARTSUPP_LOADER_SRC}"]`);

  return {
    fallbackActive: Boolean(window.SGT_SMARTSUPP_FALLBACK),
    hasConfigKey: Boolean(window._smartsupp?.key),
    hasContainer: Boolean(container),
    hasSmartsuppFunction: typeof window.smartsupp === "function",
    hasWidget: hasMountedSmartsuppWidget(),
    iframeCount: document.querySelectorAll(`iframe[src*="smartsupp" i], iframe[title*="smartsupp" i]`).length,
    lastError: window.SGT_SMARTSUPP_LAST_ERROR ?? null,
    launcherCount: document.querySelectorAll(
      `#${SMARTSUPP_CONTAINER_ID} .smartsupp-widget-launcher, #${SMARTSUPP_CONTAINER_ID} [class*="launcher"]`,
    ).length,
    loaderScriptSrc: loaderScript?.src ?? null,
    viewport: {
      height: window.innerHeight,
      width: window.innerWidth,
    },
  };
}

export default function SmartsuppChat({ locale }: { locale?: AppLocale }) {
  const session = useAppStore((state) => state.session);
  const user = useAppStore((state) => state.user);
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY || DEFAULT_SMARTSUPP_KEY;
  const [status, setStatus] = useState<SmartsuppStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const email = session?.email ?? user?.profile.email;
  const fullName = session?.fullName ?? user?.profile.fullName;
  const chatLocale = useMemo(() => (locale === "zh" ? "zh-CN" : locale), [locale]);
  const contextRef = useRef<SmartsuppContext>({ chatLocale, email, fullName });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const style = injectSmartsuppStyles();

    return () => {
      style?.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    let isCancelled = false;

    window.SGT_RELOAD_SMARTSUPP = () => {
      setRetryNonce((value) => value + 1);
    };

    window.SGT_SMARTSUPP_DIAGNOSTICS = getSmartsuppDiagnostics;

    const loadSmartsupp = async () => {
      let finalError = "";
      window.SGT_SMARTSUPP_FALLBACK = false;
      delete window.SGT_SMARTSUPP_LAST_ERROR;

      if (hasMountedSmartsuppWidget()) {
        forceSmartsuppVisible();
        setStatus("ready");
        setLastError(null);
        return;
      }

      for (let attempt = 0; attempt < SMARTSUPP_RETRY_DELAYS_MS.length; attempt += 1) {
        const retryDelay = SMARTSUPP_RETRY_DELAYS_MS[attempt];

        if (retryDelay > 0) {
          await wait(retryDelay);
        }

        if (isCancelled) {
          return;
        }

        setStatus(attempt === 0 ? "loading" : "retrying");

        try {
          resetSmartsuppDom();
          await insertSmartsuppScript(smartsuppKey, attempt);
          syncSmartsuppContext(contextRef.current);

          const mounted = await waitForSmartsuppWidget(SMARTSUPP_MOUNT_TIMEOUT_MS);

          if (isCancelled) {
            return;
          }

          if (mounted) {
            forceSmartsuppVisible();
            window.SGT_SMARTSUPP_FALLBACK = false;
            setStatus("ready");
            setLastError(null);
            return;
          }

          throw new Error("The Smartsupp loader downloaded, but no chat launcher or iframe mounted.");
        } catch (error) {
          finalError = getErrorMessage(error);
          window.SGT_SMARTSUPP_LAST_ERROR = finalError;
          console.warn(`[Smartsupp] ${finalError}`);
        }
      }

      if (!isCancelled) {
        const message =
          finalError || "Smartsupp did not mount after multiple attempts. Check dashboard visibility and live-domain settings.";
        window.SGT_SMARTSUPP_FALLBACK = true;
        window.SGT_SMARTSUPP_LAST_ERROR = message;
        setStatus("failed");
        setLastError(message);
      }
    };

    loadSmartsupp();

    return () => {
      isCancelled = true;
      delete window.SGT_RELOAD_SMARTSUPP;
      delete window.SGT_SMARTSUPP_DIAGNOSTICS;
    };
  }, [retryNonce, smartsuppKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    contextRef.current = { chatLocale, email, fullName };

    let attempts = 0;
    const maxAttempts = 24;

    if (syncSmartsuppContext(contextRef.current)) {
      return;
    }

    const interval = window.setInterval(() => {
      attempts += 1;
      if (syncSmartsuppContext(contextRef.current) || attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [chatLocale, email, fullName]);

  if (status !== "failed") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setRetryNonce((value) => value + 1)}
      className="fixed bottom-5 right-5 z-[2147483647] rounded-full bg-gold-gradient px-5 py-3 text-left text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
      title={lastError ?? "Retry Smartsupp live chat"}
    >
      <span className="block">Live chat</span>
      <span className="block text-[10px] font-medium opacity-75">Retry connection</span>
    </button>
  );
}
