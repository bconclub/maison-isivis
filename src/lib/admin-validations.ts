import { z } from "zod";

// ─── Product Schema ───────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().min(0).optional().nullable(),
  compareAtPrice: z.number().min(0).optional().nullable(),
  inStock: z.boolean(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0),
  allowBackorder: z.boolean(),
  videoUrl: z.string().url().optional().nullable().or(z.literal("")),
  categoryIds: z.array(z.string()),
  hasVariants: z.boolean(),
  fabric: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  featured: z.boolean(),
  newArrival: z.boolean(),
  bestseller: z.boolean(),
  badge: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(), // comma-separated, parsed later
  displayOrder: z.number().int().min(0),
  published: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ─── Category Schema ──────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  parentId: z.string().optional().nullable(),
  showInMenu: z.boolean(),
  displayOrder: z.number().int().min(0),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ─── Collection Schema ────────────────────────────────────

export const collectionSchema = z.object({
  title: z.string().min(2, "Collection title is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional().nullable(),
  heroImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  heroVideoUrl: z.string().url().optional().nullable().or(z.literal("")),
  collectionType: z
    .enum(["featured", "style", "seasonal", "curated"])
    .optional()
    .nullable(),
  featured: z.boolean(),
  displayOrder: z.number().int().min(0),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;

// ─── Order Status Update Schema ───────────────────────────

export const orderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  trackingNumber: z.string().optional().nullable(),
});

export type OrderStatusFormData = z.infer<typeof orderStatusSchema>;
