"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawerSlideLeft, modalOverlay } from "@/lib/animations";
import { FilterSidebar } from "./FilterSidebar";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hideCategory?: boolean;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  hideCategory,
}: MobileFilterDrawerProps) {
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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerSlideLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-luxury-lg lg:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="font-heading text-h4 font-semibold text-neutral-900">
                Filters
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-luxury-md text-neutral-400 transition-colors hover:text-neutral-700"
                aria-label="Close filters"
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

            {/* Filter content */}
            <div className="flex-1 overflow-y-auto px-5">
              <FilterSidebar hideCategory={hideCategory} />
            </div>

            {/* Footer with apply */}
            <div className="border-t border-neutral-100 p-5">
              <button
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-luxury-md bg-brand-purple px-6 py-3 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury"
              >
                View Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
