"use client";

import { MAX_CART_QUANTITY } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (qty: number) => void;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onChange,
  max = MAX_CART_QUANTITY,
  className,
}: QuantitySelectorProps) {
  return (
    <div className={className}>
      <p className="mb-3 text-body-sm font-medium uppercase tracking-luxury text-neutral-700">
        Quantity
      </p>
      <div className="inline-flex items-center rounded-luxury-md border border-neutral-200">
        <button
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className={cn(
            "flex h-10 w-10 items-center justify-center text-neutral-600 transition-colors",
            quantity <= 1
              ? "cursor-not-allowed text-neutral-300"
              : "hover:text-brand-purple"
          )}
          aria-label="Decrease quantity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" strokeLinecap="round" />
          </svg>
        </button>

        <span className="flex h-10 w-12 items-center justify-center border-x border-neutral-200 text-body-sm font-medium text-neutral-900">
          {quantity}
        </span>

        <button
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className={cn(
            "flex h-10 w-10 items-center justify-center text-neutral-600 transition-colors",
            quantity >= max
              ? "cursor-not-allowed text-neutral-300"
              : "hover:text-brand-purple"
          )}
          aria-label="Increase quantity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
