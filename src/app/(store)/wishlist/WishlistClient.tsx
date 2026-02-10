"use client";

import { useSyncExternalStore } from "react";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { getProductById } from "@/lib/mock-data";
import { toast } from "@/components/ui/Toast";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyWishlistState } from "@/components/product/EmptyWishlistState";

const emptySubscribe = () => () => {};

export function WishlistClient() {
  const productIds = useWishlistStore((s) => s.productIds);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] animate-pulse rounded-luxury-md bg-neutral-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    );
  }

  // Look up products from mock data
  const products = productIds
    .map((id) => getProductById(id))
    .filter((p) => p != null);

  if (products.length === 0) {
    return <EmptyWishlistState />;
  }

  function handleAddToBag(productId: string) {
    const product = getProductById(productId);
    if (!product) return;
    addItem(product, 1);
    toast("Added to bag", "success");
    openCart();
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <ProductCard product={product} />
            {/* Action buttons below the card */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleAddToBag(product.id)}
                disabled={!product.inStock}
                className="flex h-9 flex-1 items-center justify-center rounded-luxury-md bg-brand-purple text-caption font-medium uppercase tracking-luxury text-white transition-all hover:bg-brand-purple-light disabled:bg-neutral-200 disabled:text-neutral-400"
              >
                {product.inStock ? "Add to Bag" : "Out of Stock"}
              </button>
              <button
                onClick={() => {
                  removeFromWishlist(product.id);
                  toast("Removed from wishlist", "info");
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-luxury-md border border-neutral-200 text-neutral-400 transition-colors hover:border-red-300 hover:text-red-500"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
