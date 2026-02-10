"use client";

import { useSyncExternalStore } from "react";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WishlistButton({ productId, size = "md", className }: WishlistButtonProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const active = mounted && isInWishlist(productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    toast(
      active ? "Removed from wishlist" : "Added to wishlist",
      active ? "info" : "success"
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-neutral-500 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-brand-purple",
        active && "text-brand-purple",
        className
      )}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        width={size === "lg" ? 22 : size === "sm" ? 14 : 18}
        height={size === "lg" ? 22 : size === "sm" ? 14 : 18}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
