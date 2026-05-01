"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RECENT_ACTIVITY } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export function ActivityFeed() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % RECENT_ACTIVITY.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  const item = RECENT_ACTIVITY[index];

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden w-80 lg:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="surface pointer-events-auto p-4"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-full border border-gold/20 bg-gold/10 p-2 text-gold">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-ink">
                {item.investor} from {item.region}
              </p>
              <p className="text-sm text-body/75">
                just {item.action} {formatCurrency(item.amount)}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-body/45">{item.createdAt}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
