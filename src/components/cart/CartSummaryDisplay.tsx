"use client";

import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

interface CartSummaryDisplayProps {
  compact?: boolean;
}

export function CartSummaryDisplay({ compact }: CartSummaryDisplayProps) {
  const getSummary = useCartStore((s) => s.getSummary);
  const summary = getSummary();

  if (compact) {
    return (
      <div className="space-y-2 text-body-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span className="font-medium text-neutral-900">
            {formatPrice(summary.subtotal)}
          </span>
        </div>
        {summary.shipping > 0 && (
          <p className="text-caption text-neutral-400">
            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-body-sm">
      <div className="flex justify-between text-neutral-600">
        <span>Subtotal ({summary.itemCount} items)</span>
        <span className="font-medium text-neutral-900">
          {formatPrice(summary.subtotal)}
        </span>
      </div>

      <div className="flex justify-between text-neutral-600">
        <span>Shipping</span>
        <span className="font-medium text-neutral-900">
          {summary.shipping === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            formatPrice(summary.shipping)
          )}
        </span>
      </div>

      <div className="flex justify-between text-neutral-600">
        <span>VAT (20%)</span>
        <span className="font-medium text-neutral-900">
          {formatPrice(summary.tax)}
        </span>
      </div>

      {summary.discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span className="font-medium">
            −{formatPrice(summary.discount)}
          </span>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-3">
        <div className="flex justify-between">
          <span className="text-base font-semibold text-neutral-900">Total</span>
          <span className="text-base font-semibold text-brand-purple">
            {formatPrice(summary.total)}
          </span>
        </div>
      </div>

      {summary.shipping > 0 && (
        <p className="text-caption text-neutral-400">
          Add {formatPrice(FREE_SHIPPING_THRESHOLD - summary.subtotal)} more
          for free shipping
        </p>
      )}
    </div>
  );
}
