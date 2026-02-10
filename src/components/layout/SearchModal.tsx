"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { modalOverlay } from "@/lib/animations";
import { useUIStore } from "@/lib/stores/ui-store";
import { getFilteredProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

export function SearchModal() {
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Live search results
  const results =
    query.length >= 2
      ? getFilteredProducts({ search: query, limit: 5 })
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleProductClick() {
    closeSearch();
  }

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeSearch]);

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
            onClick={closeSearch}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-50 bg-white shadow-luxury-lg"
          >
            <div className="container-luxury py-6">
              {/* Search Input */}
              <form onSubmit={handleSubmit} className="relative">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, collections..."
                  className="w-full rounded-luxury-md border border-neutral-200 bg-neutral-50 py-4 pl-12 pr-12 font-body text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-purple focus:bg-white focus:ring-2 focus:ring-brand-purple/10"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700"
                  aria-label="Close search"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </form>

              {/* Results */}
              {results && (
                <div className="mt-6">
                  {results.products.length > 0 ? (
                    <>
                      <p className="mb-3 text-caption font-medium uppercase tracking-luxury text-neutral-500">
                        {results.total} result{results.total !== 1 ? "s" : ""} found
                      </p>
                      <div className="space-y-2">
                        {results.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={handleProductClick}
                            className="flex items-center gap-4 rounded-luxury-md p-3 transition-colors hover:bg-neutral-50"
                          >
                            <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded bg-neutral-100">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.images[0].alt ?? product.name}
                                  fill
                                  className="object-cover"
                                  sizes="44px"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-neutral-200" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-body-sm font-medium text-neutral-900">
                                {product.name}
                              </p>
                              <p className="text-caption text-neutral-500">
                                {product.category?.name}
                              </p>
                            </div>
                            <span className="text-body-sm font-medium text-brand-purple">
                              {formatPrice(product.salePrice ?? product.price)}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* View all */}
                      {results.total > 5 && (
                        <button
                          onClick={handleSubmit as () => void}
                          className="mt-4 w-full rounded-luxury-md border border-neutral-200 py-3 text-center text-body-sm font-medium text-neutral-700 transition-colors hover:border-brand-purple hover:text-brand-purple"
                        >
                          View all {results.total} results
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-body-sm text-neutral-500">
                        No products found for &ldquo;{query}&rdquo;
                      </p>
                      <p className="mt-1 text-caption text-neutral-400">
                        Try a different search term
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Links (when no query) */}
              {!results && (
                <div className="mt-6">
                  <p className="mb-3 text-caption font-medium uppercase tracking-luxury text-neutral-500">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Dresses", "Silk", "Corset", "New Arrivals", "Co-ords", "Accessories"].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-neutral-200 px-4 py-2 text-body-sm text-neutral-600 transition-colors hover:border-brand-purple hover:text-brand-purple"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
