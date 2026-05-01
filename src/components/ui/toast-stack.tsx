"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";

const icons = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Sparkles,
};

export function ToastStack() {
  const toasts = useAppStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(24rem,calc(100%-2rem))] flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.tone];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="pointer-events-auto rounded-3xl border border-white/10 bg-[#091221]/90 p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full border border-white/10 bg-white/5 p-2 text-gold">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-ink">{toast.title}</p>
                  <p className="text-sm leading-6 text-body/80">{toast.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
