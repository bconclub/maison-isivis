"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-product w-full rounded-luxury-md bg-neutral-100">
        <div className="flex h-full items-center justify-center text-neutral-300">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-luxury-md border-2 transition-all sm:h-20 sm:w-20",
                i === activeIndex
                  ? "border-brand-purple"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${productName} - Image ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image — reduced: ~80% on mobile, ~50% max on desktop */}
      <div className="group relative mx-auto flex-1 overflow-hidden rounded-luxury-md bg-neutral-100 max-w-[80%] sm:mx-0 sm:max-w-full lg:max-w-[85%]">
        <div className="relative aspect-product w-full overflow-hidden">
          <Image
            src={activeImage?.url ?? ""}
            alt={activeImage?.alt ?? productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 80vw, 40vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
