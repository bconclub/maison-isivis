"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/stores/ui-store";
import { MOBILE_NAV_CATEGORIES, MOBILE_NAV_COLLECTIONS } from "@/lib/constants";
import { drawerSlideLeft, modalOverlay } from "@/lib/animations";

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeMobileNav}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.nav
            variants={drawerSlideLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-luxury-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between bg-brand-purple px-6">
              <span className="font-heading text-lg font-light uppercase tracking-luxury-wide text-white">
                Menu
              </span>
              <button
                onClick={closeMobileNav}
                className="flex h-10 w-10 items-center justify-center rounded-luxury-md text-white/80 transition-colors hover:text-white"
                aria-label="Close menu"
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
              {/* New Arrivals */}
              <div className="mb-4">
                <Link
                  href="/products?filter=new-arrivals"
                  onClick={closeMobileNav}
                  className="block rounded-luxury-md px-3 py-2.5 text-base font-semibold text-brand-purple transition-colors hover:bg-neutral-50"
                >
                  New Arrivals
                </Link>
              </div>

              {/* Shop Categories */}
              <div className="mb-8">
                <p className="mb-3 text-caption font-medium uppercase tracking-luxury-wide text-neutral-400">
                  Shop by Category
                </p>
                <ul className="space-y-1">
                  {MOBILE_NAV_CATEGORIES.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMobileNav}
                        className="block rounded-luxury-md px-3 py-2.5 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-brand-purple"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Style Collections */}
              <div className="mb-8">
                <p className="mb-3 text-caption font-medium uppercase tracking-luxury-wide text-neutral-400">
                  Collections
                </p>
                <ul className="space-y-1">
                  {MOBILE_NAV_COLLECTIONS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMobileNav}
                        className="block rounded-luxury-md px-3 py-2.5 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-brand-purple"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account Links */}
              <div className="border-t border-neutral-200 pt-6">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/login"
                      onClick={closeMobileNav}
                      className="flex items-center gap-3 rounded-luxury-md px-3 py-2.5 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-brand-purple"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      onClick={closeMobileNav}
                      className="flex items-center gap-3 rounded-luxury-md px-3 py-2.5 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-brand-purple"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      Wishlist
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
