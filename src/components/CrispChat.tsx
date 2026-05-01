"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? "YOUR_CRISP_WEBSITE_ID";

export function CrispChat() {
  useEffect(() => {
    if (!websiteId || websiteId === "YOUR_CRISP_WEBSITE_ID") {
      return;
    }

    Crisp.configure(websiteId);
  }, []);

  return null;
}
