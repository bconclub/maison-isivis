"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { drawerSlide, modalOverlay } from "@/lib/animations";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartItem } from "./CartItem";
import { CartSummaryDisplay } from "./CartSummaryDisplay";
import { EmptyCartState } from "./EmptyCartState";

const emptySubscribe = () => () => {};

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-luxury-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-heading text-h4 font-light text-neutral-800">
                Your Bag
                {items.length > 0 && (
                  <span className="ml-2 text-body-sm font-normal text-neutral-400">
                    ({items.length})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-luxury-md text-neutral-400 transition-colors hover:text-neutral-700"
                aria-label="Close cart"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-5">
                <EmptyCartState />
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="space-y-5">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} compact />
                    ))}
                  </div>
                </div>

                {/* Footer summary */}
                <div className="border-t border-neutral-100 px-5 py-5">
                  <CartSummaryDisplay compact />

                  <div className="mt-4 space-y-2.5">
                    <button
                      onClick={closeCart}
                      className="flex w-full items-center justify-center rounded-luxury-md bg-brand-purple px-6 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury"
                    >
                      Checkout
                    </button>
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="flex w-full items-center justify-center rounded-luxury-md border border-neutral-200 px-6 py-3 text-body-sm font-medium text-neutral-700 transition-colors hover:border-brand-purple hover:text-brand-purple"
                    >
                      View Full Bag
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
