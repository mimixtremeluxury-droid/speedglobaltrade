"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef } from "react";
import { useAppStore } from "@/lib/store";
import type { TawkMessengerHandle, TawkMessengerReactProps } from "@tawk.to/tawk-messenger-react";

const TawkMessengerReact = dynamic<TawkMessengerReactProps>(() => import("@tawk.to/tawk-messenger-react"), {
  ssr: false,
});

const TAWK_PROPERTY_ID_PLACEHOLDER = "PROPERTY_ID_PLACEHOLDER";
const TAWK_WIDGET_ID_PLACEHOLDER = "WIDGET_ID_PLACEHOLDER";

export default function TawkChatWidget() {
  const tawkMessengerRef = useRef<TawkMessengerHandle | null>(null);
  const session = useAppStore((state) => state.session);
  const user = useAppStore((state) => state.user);
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || TAWK_PROPERTY_ID_PLACEHOLDER;
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || TAWK_WIDGET_ID_PLACEHOLDER;
  const visitor = useMemo(
    () => ({
      email: session?.email ?? user?.profile.email,
      name: session?.fullName ?? user?.profile.fullName,
    }),
    [session, user],
  );

  const onLoad = useCallback(() => {
    console.info("Tawk.to widget loaded");

    if (!visitor.email && !visitor.name) {
      return;
    }

    tawkMessengerRef.current?.setAttributes?.(
      {
        ...(visitor.name ? { name: visitor.name } : {}),
        ...(visitor.email ? { email: visitor.email } : {}),
      },
      (error?: unknown) => {
        if (error) {
          console.warn("Unable to set Tawk.to visitor attributes.", error);
        }
      },
    );
  }, [visitor]);

  if (propertyId === TAWK_PROPERTY_ID_PLACEHOLDER || widgetId === TAWK_WIDGET_ID_PLACEHOLDER) {
    console.warn("Tawk.to widget is disabled until NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID are set.");
    return null;
  }

  return <TawkMessengerReact propertyId={propertyId} widgetId={widgetId} useRef={tawkMessengerRef} onLoad={onLoad} />;
}
