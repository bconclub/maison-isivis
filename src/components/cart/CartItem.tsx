"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem as CartItemType } from "@/types/cart";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item, compact }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const price = item.product.salePrice ?? item.product.price;
  const lineTotal = price * item.quantity;
  const imageUrl = item.product.images[0]?.url;

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className="relative h-20 w-16 shrink-0 overflow-hidden rounded-luxury-md bg-neutral-100 sm:h-28 sm:w-24"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-200 to-neutral-300" />
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.product.slug}`}
            className="text-body-sm font-medium text-neutral-900 transition-colors hover:text-brand-purple"
          >
            {item.product.name}
          </Link>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-caption text-neutral-500">
            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
            {item.selectedColor && <span>Colour: {item.selectedColor}</span>}
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between">
          {/* Quantity controls */}
          <div className="inline-flex items-center rounded-luxury-md border border-neutral-200">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-neutral-500 transition-colors hover:text-brand-purple disabled:text-neutral-300"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
            <span className="flex h-7 w-8 items-center justify-center border-x border-neutral-200 text-caption font-medium text-neutral-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center text-neutral-500 transition-colors hover:text-brand-purple"
              aria-label="Increase quantity"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-body-sm font-medium text-neutral-900">
              {formatPrice(lineTotal)}
            </span>
            {!compact && (
              <button
                onClick={() => removeItem(item.id)}
                className="text-neutral-400 transition-colors hover:text-red-500"
                aria-label={`Remove ${item.product.name}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
