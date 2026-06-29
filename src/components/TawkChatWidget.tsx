"use client";

import Script from "next/script";
import { useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";

declare global {
  interface Window {
    Tawk_API?: {
      visitor?: {
        name?: string;
        email?: string;
      };
      setAttributes?: (
        attributes: { name?: string; email?: string },
        callback?: (error?: unknown) => void,
      ) => void;
    };
    Tawk_LoadStart?: Date;
  }
}

const DEFAULT_TAWK_PROPERTY_ID = "6a41072f43e9051d4585b513";
const DEFAULT_TAWK_WIDGET_ID = "1js7084u2";

function resolveTawkId(value: string | undefined, fallback: string) {
  if (!value || /placeholder|property_id_from_tawk|widget_id_from_tawk/i.test(value)) {
    return fallback;
  }

  return value;
}

export default function TawkChatWidget() {
  const session = useAppStore((state) => state.session);
  const user = useAppStore((state) => state.user);
  const propertyId = resolveTawkId(process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID, DEFAULT_TAWK_PROPERTY_ID);
  const widgetId = resolveTawkId(process.env.NEXT_PUBLIC_TAWK_WIDGET_ID, DEFAULT_TAWK_WIDGET_ID);
  const scriptSrc = `https://embed.tawk.to/${propertyId}/${widgetId}`;
  const visitor = useMemo(
    () => ({
      email: session?.email ?? user?.profile.email,
      name: session?.fullName ?? user?.profile.fullName,
    }),
    [session, user],
  );

  useEffect(() => {
    if (!visitor.email && !visitor.name) {
      return;
    }

    const attributes = {
      ...(visitor.name ? { name: visitor.name } : {}),
      ...(visitor.email ? { email: visitor.email } : {}),
    };

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.visitor = attributes;
    window.Tawk_API.setAttributes?.(attributes, (error?: unknown) => {
      if (error) {
        console.warn("Unable to set Tawk.to visitor attributes.", error);
      }
    });
  }, [visitor]);

  return (
    <Script
      id="tawk-to-chat-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = window.Tawk_API || {};
          var Tawk_LoadStart = new Date();
          window.Tawk_API = Tawk_API;
          window.Tawk_LoadStart = Tawk_LoadStart;
          (function(){
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "${scriptSrc}";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
}
