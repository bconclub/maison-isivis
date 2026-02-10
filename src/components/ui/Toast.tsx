"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { create } from "zustand";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// === Toast Types ===
type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

// === Toast Store ===
interface ToastStore {
  toasts: ToastItem[];
  addToast: (
    message: string,
    variant?: ToastVariant,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (message, variant = "info", duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant, duration }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// === Helper function ===
export function toast(
  message: string,
  variant: ToastVariant = "info",
  duration = 4000
) {
  useToastStore.getState().addToast(message, variant, duration);
}

// === Toast Item Component ===
const variantStyles = {
  success: "border-success bg-success/5 text-success",
  error: "border-error bg-error/5 text-error",
  warning: "border-warning bg-warning/5 text-warning",
  info: "border-info bg-info/5 text-info",
} as const;

const variantIcons: Record<ToastVariant, string> = {
  success: "\u2713",
  error: "\u2717",
  warning: "!",
  info: "i",
};

function ToastItemComponent({ item }: { item: ToastItem }) {
  const removeToast = useToastStore((s) => s.removeToast);

  const handleDismiss = useCallback(() => {
    removeToast(item.id);
  }, [item.id, removeToast]);

  useEffect(() => {
    const timer = setTimeout(handleDismiss, item.duration);
    return () => clearTimeout(timer);
  }, [item.duration, handleDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex items-center gap-3 rounded-luxury-md border bg-white px-4 py-3 shadow-luxury",
        variantStyles[item.variant]
      )}
      role="alert"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
        {variantIcons[item.variant]}
      </span>
      <p className="flex-1 text-body-sm font-medium text-neutral-800">
        {item.message}
      </p>
      <button
        onClick={handleDismiss}
        className="text-neutral-400 transition-colors hover:text-neutral-600"
        aria-label="Dismiss"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

// === Toast Provider ===
export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);
  const mounted = useMounted();

  if (!mounted) return null;

  return createPortal(
    <div className="fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <ToastItemComponent key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
