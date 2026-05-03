"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { SessionUser, UserRecord } from "@/lib/types";
import { useAppStore } from "@/lib/store";

export function AppProviders({
  children,
  initialSession,
  initialUser,
}: {
  children: React.ReactNode;
  initialSession: SessionUser | null;
  initialUser: UserRecord | null;
}) {
  const hydrate = useAppStore((state) => state.hydrate);

  useEffect(() => {
    hydrate(initialSession, initialUser);
  }, [hydrate, initialSession, initialUser]);

  return <MotionConfig transition={{ duration: 0.3, ease: "easeOut" }}>{children}</MotionConfig>;
}
