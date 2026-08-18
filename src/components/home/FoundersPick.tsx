"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface FoundersPickProps {
  product: Product;
}

/**
 * One piece, called out on its own band directly below the hero. Lifted out of
 * the hero so the hero stays copy + film only.
 */
export function FoundersPick({ product }: FoundersPickProps) {
  const [slide, setSlide] = useState(0);
  const images = product.images ?? [];
  const slideCount = images.length;

  // Advance every 2s. Depends on the count, not the array, so a new object
  // identity each render doesn't restart the timer mid-cycle.
  useEffect(() => {
    if (slideCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setSlide((s) => (s + 1) % slideCount),
      2000,
    );
    return () => window.clearInterval(id);
  }, [slideCount]);

  return (
    <section className="bg-neutral-50 py-16 sm:py-20">
      <div className="container-luxury">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          {/* Image slider. Frames stack and cross-fade, so the box never
              reflows and nothing shifts as it advances. */}
          <Link
            href={`/products/${product.slug}`}
            className="relative block aspect-[4/5] w-full overflow-hidden rounded-luxury-lg bg-neutral-200"
          >
            {images.map((img, i) => (
              <Image
                key={img.url}
                src={img.url}
                alt={img.alt || product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className={`object-cover object-top transition-opacity duration-700 ${
                  i === slide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Indicators, in brand colours rather than plain white */}
            {slideCount > 1 && (
              <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((img, i) => (
                  <span
                    key={img.url}
                    className={`block h-1 rounded-full transition-all duration-500 ${
                      i === slide
                        ? "w-6 bg-brand-blue"
                        : "w-2 bg-white/70"
                    }`}
                  />
                ))}
              </span>
            )}
          </Link>

          <div className="text-center lg:text-left">
            <p className="font-script text-xl text-brand-blue sm:text-lg">
              Founder&apos;s Pick
            </p>
            <h2 className="mt-2 font-heading text-2xl text-brand-purple sm:text-h2">
              {product.name}
            </h2>
            <p className="mt-3 font-body text-body-lg text-neutral-600">
              {formatPrice(product.price)}
            </p>

            {product.shortDescription && (
              <p className="mx-auto mt-6 max-w-md font-body text-neutral-600 lg:mx-0">
                {product.shortDescription}
              </p>
            )}

            <Link
              href={`/products/${product.slug}`}
              className="group mt-8 inline-flex items-center gap-2 border-b border-brand-purple/30 pb-1 text-caption font-medium uppercase tracking-luxury-wide text-brand-purple transition-colors hover:border-brand-purple"
            >
              View details
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14m-7-7 7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
