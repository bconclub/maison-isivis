"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Category, Collection } from "@/types/product";
import type { Order, OrderStatus } from "@/types/order";
import type { Review } from "@/types/user";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_COLLECTIONS,
  MOCK_ORDERS,
  MOCK_REVIEWS,
} from "@/lib/mock-data";

// ─── Collection-Product mapping ────────────────────────────
export interface CollectionProductMap {
  [collectionId: string]: string[]; // array of product IDs
}

// ─── Admin State ───────────────────────────────────────────
interface AdminState {
  // Data
  products: Product[];
  categories: Category[];
  collections: Collection[];
  orders: Order[];
  reviews: Review[];
  collectionProducts: CollectionProductMap;
  initialized: boolean;

  // Init — loads from Supabase (mock fallback)
  initialize: () => void | Promise<void>;

  // Product CRUD — syncs with Supabase in background
  addProduct: (product: Product) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Category CRUD
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Collection CRUD
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  setCollectionProducts: (collectionId: string, productIds: string[]) => void;

  // Order actions
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Review actions
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  toggleFeaturedReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;

  // Helpers
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getCollectionById: (id: string) => Collection | undefined;
  getOrderById: (id: string) => Order | undefined;
}

// Default collection-product mappings from mock data
const DEFAULT_COLLECTION_PRODUCTS: CollectionProductMap = {
  "col-1": ["prod-1", "prod-2", "prod-5", "prod-9", "prod-13", "prod-18", "prod-22"],
  "col-2": ["prod-1", "prod-9", "prod-12", "prod-14", "prod-17", "prod-18", "prod-22"],
  "col-3": ["prod-2", "prod-5", "prod-8", "prod-13", "prod-20", "prod-21"],
  "col-4": ["prod-3", "prod-6", "prod-10", "prod-15", "prod-16", "prod-19", "prod-23"],
};

// ─── Hydration tracking ────────────────────────────────────
let _hydrated = false;
const _hydrationListeners = new Set<() => void>();

export function onAdminStoreHydrate(fn: () => void) {
  if (_hydrated) {
    fn();
    return () => {};
  }
  _hydrationListeners.add(fn);
  return () => _hydrationListeners.delete(fn);
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      collections: [],
      orders: [],
      reviews: [],
      collectionProducts: {},
      initialized: false,

      initialize: async () => {
        // Seed mock data on very first load (before any Supabase data exists)
        if (!get().initialized) {
          set({
            products: [...MOCK_PRODUCTS],
            categories: [...MOCK_CATEGORIES],
            collections: [...MOCK_COLLECTIONS],
            orders: [...MOCK_ORDERS],
            reviews: [...MOCK_REVIEWS],
            collectionProducts: { ...DEFAULT_COLLECTION_PRODUCTS },
            initialized: true,
          });
        }

        // ALWAYS fetch from Supabase to ensure real UUIDs for categories/products
        try {
          const [prodRes, catRes] = await Promise.all([
            fetch("/api/admin/products"),
            fetch("/api/admin/categories"),
          ]);
          if (catRes.ok) {
            const { categories } = await catRes.json();
            // Always replace — even if empty — so mock IDs don't leak
            if (categories) set({ categories });
          }
          if (prodRes.ok) {
            const { products } = await prodRes.json();
            if (products) set({ products });
          }
        } catch {
          // Supabase unavailable, keep persisted/mock data
        }
      },

      // ── Product CRUD (Supabase-first) ──
      addProduct: async (product) => {
        // Save to Supabase FIRST — don't add to local state until confirmed
        try {
          const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });
          const data = await res.json();
          if (!res.ok) {
            console.error("[Supabase] addProduct failed:", data.error);
            throw new Error(data.error || "Failed to save product");
          }
          // Add the Supabase-confirmed product (with real UUID) to local state
          const saved = data.product as Product;
          set((s) => ({ products: [saved, ...s.products] }));
          return saved;
        } catch (err) {
          console.error("[Supabase] addProduct error:", err);
          throw err; // Let the form handle the error
        }
      },

      updateProduct: async (id, updates) => {
        // Optimistic local update
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));

        // Sync to Supabase
        try {
          const res = await fetch(`/api/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error("[Supabase] updateProduct failed:", data.error);
            // Revert optimistic update on failure
            const revertRes = await fetch(`/api/admin/products`);
            if (revertRes.ok) {
              const { products } = await revertRes.json();
              if (products?.length) set({ products });
            }
          }
        } catch (err) {
          console.warn("[Supabase] updateProduct error:", err);
        }
      },

      deleteProduct: async (id) => {
        // Save current state for revert
        const prevProducts = get().products;

        // Optimistic local delete
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          collectionProducts: Object.fromEntries(
            Object.entries(s.collectionProducts).map(([colId, pIds]) => [
              colId,
              pIds.filter((pid) => pid !== id),
            ])
          ),
        }));

        // Sync to Supabase
        try {
          const res = await fetch(`/api/admin/products/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error("[Supabase] deleteProduct failed:", data.error);
            set({ products: prevProducts }); // Revert on failure
          }
        } catch (err) {
          console.warn("[Supabase] deleteProduct error:", err);
          set({ products: prevProducts }); // Revert on failure
        }
      },

      // ── Category CRUD ──
      addCategory: (category) => {
        set((s) => ({ categories: [...s.categories, category] }));
      },

      updateCategory: (id, updates) => {
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          products: s.products.map((p) =>
            p.categoryId === id ? { ...p, categoryId: null } : p
          ),
        }));
      },

      // ── Collection CRUD ──
      addCollection: (collection) => {
        set((s) => ({ collections: [...s.collections, collection] }));
      },

      updateCollection: (id, updates) => {
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteCollection: (id) => {
        set((s) => {
          const { [id]: _, ...restMappings } = s.collectionProducts;
          return {
            collections: s.collections.filter((c) => c.id !== id),
            collectionProducts: restMappings,
          };
        });
      },

      setCollectionProducts: (collectionId, productIds) => {
        set((s) => ({
          collectionProducts: {
            ...s.collectionProducts,
            [collectionId]: productIds,
          },
        }));
      },

      // ── Order actions ──
      updateOrderStatus: (orderId, status, trackingNumber) => {
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  ...(trackingNumber !== undefined ? { trackingNumber } : {}),
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      },

      // ── Review actions ──
      approveReview: (reviewId) => {
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === reviewId ? { ...r, approved: true, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      rejectReview: (reviewId) => {
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === reviewId ? { ...r, approved: false, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      toggleFeaturedReview: (reviewId) => {
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === reviewId ? { ...r, featured: !r.featured, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      deleteReview: (reviewId) => {
        set((s) => ({
          reviews: s.reviews.filter((r) => r.id !== reviewId),
        }));
      },

      // ── Helpers ──
      getProductById: (id) => get().products.find((p) => p.id === id),
      getCategoryById: (id) => get().categories.find((c) => c.id === id),
      getCollectionById: (id) => get().collections.find((c) => c.id === id),
      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: "maison-isivis-admin",
      version: 3,
      migrate: () => ({
        products: [],
        categories: [],
        collections: [],
        orders: [],
        reviews: [],
        collectionProducts: {},
        initialized: false,
      }),
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        collections: state.collections,
        orders: state.orders,
        reviews: state.reviews,
        collectionProducts: state.collectionProducts,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => {
        return () => {
          _hydrated = true;
          _hydrationListeners.forEach((fn) => fn());
          _hydrationListeners.clear();
        };
      },
    }
  )
);
