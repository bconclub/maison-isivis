"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartSummary } from "@/types/cart";
import type { Product } from "@/types/product";
import { toast } from "@/components/ui/Toast";
import {
  TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  MAX_CART_QUANTITY,
} from "@/lib/constants";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (
    product: Product,
    quantity?: number,
    options?: { size?: string; color?: string }
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed
  getSummary: () => CartSummary;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, options) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === options?.size &&
              item.selectedColor === options?.color
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const existing = updatedItems[existingIndex]!;
            updatedItems[existingIndex] = {
              ...existing,
              quantity: Math.min(
                existing.quantity + quantity,
                MAX_CART_QUANTITY
              ),
            };
            setTimeout(() => toast(`Added another ${product.name || "item"} to your bag`, "success"), 0);
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            id: `${product.id}-${options?.size ?? "default"}-${options?.color ?? "default"}`,
            product,
            quantity: Math.min(quantity, MAX_CART_QUANTITY),
            selectedSize: options?.size,
            selectedColor: options?.color,
          };

          setTimeout(() => toast(`Added ${product.name || "item"} to your bag`, "success"), 0);
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (item) {
            setTimeout(() => toast(`Removed ${item.product.name || "item"} from your bag`, "info"), 0);
          }
          return {
            items: state.items.filter((i) => i.id !== itemId),
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, MAX_CART_QUANTITY) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSummary: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (sum, item) =>
            sum + (item.product.salePrice ?? item.product.price) * item.quantity,
          0
        );
        // Only charge VAT on items with vatEnabled
        const vatSubtotal = items.reduce(
          (sum, item) => {
            if (item.product.vatEnabled === false) return sum;
            return sum + (item.product.salePrice ?? item.product.price) * item.quantity;
          },
          0
        );
        const tax = vatSubtotal * TAX_RATE;
        // Only charge shipping if any item requires shipping
        const hasShippableItems = items.some((item) => item.product.shippingEnabled !== false);
        const shipping =
          !hasShippableItems ? 0 :
            subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
        const discount = 0;
        const total = subtotal + tax + shipping - discount;
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return { subtotal, tax, shipping, discount, total, itemCount };
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "maison-isivis-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
