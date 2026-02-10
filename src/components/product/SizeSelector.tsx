"use client";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  availableSizes?: string[];
  className?: string;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  availableSizes,
  className,
}: SizeSelectorProps) {
  return (
    <div className={className}>
      <p className="mb-3 text-body-sm font-medium uppercase tracking-luxury text-neutral-700">
        Size{selectedSize ? `: ${selectedSize}` : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isAvailable = !availableSizes || availableSizes.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              onClick={() => isAvailable && onSelect(size)}
              disabled={!isAvailable}
              className={cn(
                "flex h-10 min-w-[44px] items-center justify-center rounded-luxury-md border px-3 text-body-sm font-medium transition-all duration-200",
                isSelected
                  ? "border-brand-purple bg-brand-purple text-white"
                  : isAvailable
                    ? "border-neutral-200 bg-white text-neutral-700 hover:border-brand-purple hover:text-brand-purple"
                    : "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300 line-through"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
