"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { PriceDisplay } from "./PriceDisplay";
import { SizeSelector } from "./SizeSelector";
import { ColorSelector } from "./ColorSelector";
import { QuantitySelector } from "./QuantitySelector";
import { WishlistButton } from "./WishlistButton";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";
import { isLowStock, cn } from "@/lib/utils";
import { SIZES } from "@/lib/constants";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Only show sizes and colors if the product has variants with them
  const availableSizes = product.hasVariants
    ? [...new Set(product.variants.map((v) => v.size).filter(Boolean) as string[])]
    : [];
  const unavailableSizes = product.hasVariants
    ? SIZES.filter(
        (s) =>
          !product.variants.some((v) => v.size === s && v.stock > 0)
      )
    : [];

  const availableColors = product.hasVariants
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean) as string[])]
    : [];

  const lowStock = isLowStock(product.stockQuantity, product.lowStockThreshold);

  function handleAddToCart() {
    if (availableSizes.length > 0 && !selectedSize) {
      toast("Please select a size", "error");
      return;
    }

    addItem(product, quantity, {
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
    });

    toast("Added to bag", "success");
    openCart();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Badge */}
      {product.badge && (
        <div>
          <Badge
            variant={
              product.badge === "Sale"
                ? "sale"
                : product.badge === "New"
                  ? "new"
                  : "primary"
            }
          >
            {product.badge}
          </Badge>
        </div>
      )}

      {/* Name */}
      <h1 className="font-heading text-h2 font-light text-neutral-800 sm:text-h1">
        {product.name}
      </h1>

      {/* Price */}
      <PriceDisplay
        price={product.price}
        salePrice={product.salePrice}
        compareAtPrice={product.compareAtPrice}
        size="lg"
      />

      {/* Accent divider */}
      <div className="h-px w-12 bg-gradient-to-r from-brand-purple to-brand-blue" />

      {/* Short description */}
      {product.shortDescription && (
        <p className="text-body-sm leading-relaxed text-neutral-600">
          {product.shortDescription}
        </p>
      )}

      {/* Low stock warning */}
      {lowStock && product.inStock && (
        <p className="text-body-sm font-medium text-amber-600">
          Only {product.stockQuantity} left in stock
        </p>
      )}

      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <SizeSelector
          sizes={[...SIZES]}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
          availableSizes={availableSizes}
        />
      )}

      {/* Color Selector */}
      {availableColors.length > 0 && (
        <ColorSelector
          colors={availableColors}
          selectedColor={selectedColor}
          onSelect={setSelectedColor}
        />
      )}

      {/* Quantity */}
      <QuantitySelector
        quantity={quantity}
        onChange={setQuantity}
      />

      {/* Add to Cart + Wishlist */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            "flex h-14 flex-1 items-center justify-center rounded-luxury-md text-body-sm font-medium uppercase tracking-luxury transition-all duration-300",
            product.inStock
              ? "bg-gradient-to-r from-brand-purple via-brand-purple-80 to-brand-blue text-white shadow-md hover:shadow-luxury hover:brightness-110"
              : "cursor-not-allowed bg-neutral-200 text-neutral-400"
          )}
        >
          {product.inStock ? "Add to Bag" : "Out of Stock"}
        </button>

        <div className="flex h-14 w-14 items-center justify-center rounded-luxury-md border border-neutral-200 transition-colors duration-200 hover:border-brand-purple/40">
          <WishlistButton productId={product.id} size="lg" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-100" />

      {/* SKU */}
      <p className="text-caption text-neutral-400">
        SKU: {product.sku}
      </p>
    </div>
  );
}
