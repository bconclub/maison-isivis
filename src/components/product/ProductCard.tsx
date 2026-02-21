"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "./PriceDisplay";
import { WishlistButton } from "./WishlistButton";
import { getDiscountPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discountPct =
    product.salePrice && product.compareAtPrice
      ? getDiscountPercentage(product.compareAtPrice, product.salePrice)
      : 0;

  return (
    <div className={cn("group", className)}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-product overflow-hidden rounded-luxury-md bg-neutral-200 transition-shadow duration-300 group-hover:shadow-luxury-xl">
          {/* Product Image */}
          {product.images.length > 0 && product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt ?? product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-300/30 to-neutral-400/50" />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-brand-purple/0 transition-colors duration-300 group-hover:bg-brand-purple/10" />

          {/* Badges — bottom left, subtle */}
          <div className="absolute bottom-2.5 left-2.5 flex flex-col gap-1.5">
            {product.badge && (
              <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-800 backdrop-blur-sm">
                {product.badge}
              </span>
            )}
            {discountPct > 0 && !product.badge?.includes("Sale") && (
              <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Wishlist — top right */}
          <div className="absolute right-2.5 top-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <WishlistButton productId={product.id} />
          </div>

          {/* Quick info on hover — bottom */}
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
          <h3 className="font-heading text-lg font-medium text-neutral-900 transition-colors group-hover:text-brand-purple sm:text-xl">
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
    </div>
  );
}
