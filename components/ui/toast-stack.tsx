"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useApp } from "@/app/providers";

export function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="fixed right-4 top-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-deepNavy/90 px-4 py-3 text-sm text-white shadow-xl backdrop-blur-xl"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
