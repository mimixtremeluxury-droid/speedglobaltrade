"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { SessionUser } from "@/lib/types";
import { useAppStore } from "@/lib/store";

export function AppProviders({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: SessionUser | null;
}) {
  const hydrate = useAppStore((state) => state.hydrate);

  useEffect(() => {
    hydrate(initialSession);
  }, [hydrate, initialSession]);

  return <MotionConfig transition={{ duration: 0.3, ease: "easeOut" }}>{children}</MotionConfig>;
}
