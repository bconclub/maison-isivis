"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummaryDisplay } from "@/components/cart/CartSummaryDisplay";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const emptySubscribe = () => () => {};

export function CartPageClient() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="container-luxury py-8 sm:py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
      </div>
    );
  }

  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Your Bag" }]} className="mb-6" />

      <div className="mb-8 flex items-end justify-between">
        <h1 className="font-heading text-h2 font-semibold text-neutral-900 sm:text-h1">
          Your Bag
        </h1>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-body-sm text-neutral-400 underline underline-offset-2 transition-colors hover:text-red-500"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCartState variant="page" />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* Items */}
          <div>
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-luxury-md border border-neutral-100 p-4 sm:p-5"
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 text-body-sm text-neutral-500 transition-colors hover:text-brand-purple"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-28 rounded-luxury-md border border-neutral-100 p-6">
              <h2 className="mb-5 font-heading text-h4 font-semibold text-neutral-900">
                Order Summary
              </h2>

              <CartSummaryDisplay />

              <div className="mt-6">
                <PromoCodeInput />
              </div>

              <button className="mt-6 flex w-full items-center justify-center rounded-luxury-md bg-brand-purple px-6 py-4 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury">
                Proceed to Checkout
              </button>

              <p className="mt-4 text-center text-caption text-neutral-400">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
