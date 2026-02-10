"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { Badge } from "@/components/ui/Badge";

interface FeaturedCarouselProps {
  products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth ?? 300;
    const amount = cardWidth + 24; // card width + gap
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-script text-lg text-brand-blue">
              Curated for you
            </p>
            <h2 className="mt-2 font-heading text-h2 text-brand-purple">
              Featured Pieces
            </h2>
          </div>

          {/* Nav arrows — desktop only */}
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-all duration-200 hover:border-brand-purple hover:text-brand-purple disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:text-neutral-500"
              aria-label="Scroll left"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-all duration-200 hover:border-brand-purple hover:text-brand-purple disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:text-neutral-500"
              aria-label="Scroll right"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel track — edge-to-edge on mobile */}
        <div className="relative -mx-4 sm:mx-0">
          {/* Fade edges — desktop only */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-white to-transparent sm:block" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-white to-transparent sm:block" />
          )}

          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-3 overflow-x-auto px-4 sm:gap-6 sm:px-0"
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group w-[75%] flex-shrink-0 sm:w-[31%] lg:w-[23%]"
              >
                <div className="relative aspect-product overflow-hidden rounded-lg bg-neutral-200 sm:rounded-luxury-md">
                  {/* Product Image */}
                  {product.images.length > 0 && product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt ?? product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 31vw, 23vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-300/30 to-neutral-400/50" />
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-brand-purple/0 transition-colors duration-300 group-hover:bg-brand-purple/10" />

                  {/* Badge — bottom-left, small & subtle */}
                  {product.badge && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-800 backdrop-blur-sm">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Wishlist icon on hover */}
                  <div
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-500 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>

                  {/* Out of stock */}
                  {!product.inStock && (
                    <div className="absolute inset-x-0 bottom-0 bg-neutral-900/70 px-3 py-2 text-center">
                      <span className="text-caption font-medium uppercase tracking-luxury text-white">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="mt-3 px-0.5">
                  <h3 className="font-heading text-base font-medium text-neutral-900 transition-colors group-hover:text-brand-purple sm:text-lg">
                    {product.name}
                  </h3>
                  <PriceDisplay
                    price={product.price}
                    salePrice={product.salePrice}
                    compareAtPrice={product.compareAtPrice}
                    size="sm"
                    className="mt-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All link */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-luxury border-[1.5px] border-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all duration-300 hover:bg-brand-purple hover:text-white"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
