"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart-store";

export function SuccessPageClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);
  const hasCleared = useRef(false);

  // Clear the cart once on mount
  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="container-luxury py-16 sm:py-24">
      <div className="mx-auto max-w-lg text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <svg
            className="h-10 w-10 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Order Confirmed
        </h1>

        <p className="mt-4 text-body text-neutral-600">
          Thank you for shopping with Maison ISIVIS. Your order has been placed
          successfully and you will receive a confirmation email shortly.
        </p>

        {sessionId && (
          <p className="mt-3 text-caption text-neutral-400">
            Reference: {sessionId.slice(0, 20)}...
          </p>
        )}

        <div className="mt-4 rounded-luxury-md bg-neutral-50 p-5">
          <h2 className="text-body-sm font-semibold text-neutral-700">
            What happens next?
          </h2>
          <ul className="mt-3 space-y-2 text-body-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-purple">1.</span>
              You&apos;ll receive an order confirmation email
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-purple">2.</span>
              Our team will carefully prepare your order
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-purple">3.</span>
              You&apos;ll receive tracking details once shipped
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-luxury-md bg-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white shadow-luxury transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-purple/90 hover:shadow-luxury-lg"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-luxury-md border border-neutral-200 px-8 py-3.5 text-body-sm font-medium text-neutral-700 transition-colors hover:border-brand-purple hover:text-brand-purple"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-caption text-neutral-400">
          Need help?{" "}
          <Link
            href="/contact"
            className="text-brand-purple underline underline-offset-2 hover:text-brand-purple/80"
          >
            Contact us
          </Link>{" "}
          at connect@maisonisivis.com
        </p>
      </div>
    </div>
  );
}
