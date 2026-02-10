"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/admin-validations";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { slugify } from "@/lib/utils";
import { ImageManager } from "./ImageManager";
import { VariantManager } from "./VariantManager";
import { MeasurementsEditor } from "./MeasurementsEditor";
import { AIGenerateModal, type AIApplyPayload } from "./AIGenerateModal";
import type { Product, ProductImage, ProductVariant } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

// Category → 2-letter SKU code mapping
const CATEGORY_SKU_CODES: Record<string, string> = {
  Corsets: "CR",
  Dresses: "DR",
  Tops: "TP",
  Bottoms: "BT",
  Jumpsuits: "JP",
  "Co-ords": "CO",
  Outerwear: "OW",
  "Lounge and Intimates": "LI",
  Swimwear: "SW",
  "Active Wear": "AW",
  Accessories: "AC",
  "Gift Cards": "GC",
};

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const addProduct = useAdminStore((s) => s.addProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);
  const categories = useAdminStore((s) => s.categories);
  const products = useAdminStore((s) => s.products);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Image, variant, and measurement state (managed outside react-hook-form)
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? []);
  const [measurements, setMeasurements] = useState<Record<string, string> | null>(
    product?.measurements ?? null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          shortDescription: product.shortDescription,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          compareAtPrice: product.compareAtPrice,
          inStock: product.inStock,
          stockQuantity: product.stockQuantity,
          lowStockThreshold: product.lowStockThreshold,
          allowBackorder: product.allowBackorder,
          videoUrl: product.videoUrl,
          categoryId: product.categoryId,
          hasVariants: product.hasVariants,
          fabric: product.fabric,
          careInstructions: product.careInstructions,
          featured: product.featured,
          newArrival: product.newArrival,
          bestseller: product.bestseller,
          badge: product.badge,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          keywords: product.keywords?.join(", ") ?? "",
          displayOrder: product.displayOrder,
          published: product.published,
        }
      : {
          inStock: true,
          stockQuantity: 0,
          lowStockThreshold: 5,
          allowBackorder: false,
          hasVariants: false,
          featured: false,
          newArrival: false,
          bestseller: false,
          displayOrder: 0,
          published: true,
        },
  });

  // Auto-generate slug from name
  const nameValue = watch("name");
  useEffect(() => {
    if (mode === "create" && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, mode, setValue]);

  async function onSubmit(data: ProductFormData) {
    const now = new Date().toISOString();
    const keywordsArray = data.keywords
      ? data.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : null;

    if (mode === "create") {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        shortDescription: data.shortDescription ?? null,
        description: data.description ?? null,
        price: data.price,
        salePrice: data.salePrice ?? null,
        compareAtPrice: data.compareAtPrice ?? null,
        inStock: data.inStock,
        stockQuantity: data.stockQuantity,
        lowStockThreshold: data.lowStockThreshold,
        allowBackorder: data.allowBackorder,
        images,
        videoUrl: data.videoUrl || null,
        categoryId: data.categoryId || null,
        hasVariants: data.hasVariants,
        variants,
        fabric: data.fabric ?? null,
        careInstructions: data.careInstructions ?? null,
        measurements,
        featured: data.featured,
        newArrival: data.newArrival,
        bestseller: data.bestseller,
        badge: data.badge ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        keywords: keywordsArray,
        displayOrder: data.displayOrder,
        published: data.published,
        createdAt: now,
        updatedAt: now,
      };
      await addProduct(newProduct);
      toast("Product created successfully!", "success");
    } else if (product) {
      await updateProduct(product.id, {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        shortDescription: data.shortDescription ?? null,
        description: data.description ?? null,
        price: data.price,
        salePrice: data.salePrice ?? null,
        compareAtPrice: data.compareAtPrice ?? null,
        inStock: data.inStock,
        stockQuantity: data.stockQuantity,
        lowStockThreshold: data.lowStockThreshold,
        allowBackorder: data.allowBackorder,
        images,
        videoUrl: data.videoUrl || null,
        categoryId: data.categoryId || null,
        hasVariants: data.hasVariants,
        variants,
        fabric: data.fabric ?? null,
        careInstructions: data.careInstructions ?? null,
        measurements,
        featured: data.featured,
        newArrival: data.newArrival,
        bestseller: data.bestseller,
        badge: data.badge ?? null,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        keywords: keywordsArray,
        displayOrder: data.displayOrder,
        published: data.published,
      });
      toast("Product updated successfully!", "success");
    }

    router.push("/admin/products");
  }

  // Get category name for AI modal defaults
  const selectedCategoryId = watch("categoryId");
  const selectedCategoryName = categories.find((c) => c.id === selectedCategoryId)?.name;

  function generateSKU(categoryId: string | null): string {
    // Resolve category code from the category name
    const cat = categories.find((c) => c.id === categoryId);
    const code = (cat ? CATEGORY_SKU_CODES[cat.name] : null) ?? "GN"; // GN = General

    // Count existing SKUs with same prefix to auto-increment
    const prefix = `ISV-${code}-`;
    const existing = products.filter((p) => p.sku.startsWith(prefix));
    const maxNum = existing.reduce((max, p) => {
      const num = parseInt(p.sku.replace(prefix, ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);

    return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
  }

  function handleAIApply(content: AIApplyPayload) {
    // ── Product name & slug ──
    if (content.productName) {
      setValue("name", content.productName);
      setValue("slug", slugify(content.productName));
    }

    // ── Category ──
    if (content.categoryId) {
      setValue("categoryId", content.categoryId);
    }

    // ── SKU (auto-generated from category) ──
    const skuCategoryId = content.categoryId ?? watch("categoryId") ?? null;
    setValue("sku", generateSKU(skuCategoryId));

    // ── Price ──
    if (content.suggestedPrice != null) {
      setValue("price", content.suggestedPrice);
    }

    // ── AI-generated content fields ──
    setValue("shortDescription", content.shortDescription);
    setValue("description", content.description);
    setValue("fabric", content.fabric);
    setValue("careInstructions", content.careInstructions);
    setValue("metaTitle", content.metaTitle);
    setValue("metaDescription", content.metaDescription);
    setValue("keywords", content.keywords);
    if (content.badge) setValue("badge", content.badge);

    // ── Auto-generate variants from colors × sizes ──
    const colorsList = content.colors
      ? content.colors.split(",").map((c) => c.trim()).filter(Boolean)
      : [];
    const sizesList = content.sizes
      ? content.sizes.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (colorsList.length > 0 || sizesList.length > 0) {
      const basePrice = content.suggestedPrice ?? watch("price") ?? 0;
      const newVariants: ProductVariant[] = [];

      if (colorsList.length > 0 && sizesList.length > 0) {
        // Cross-product: every color × every size
        for (const color of colorsList) {
          for (const size of sizesList) {
            newVariants.push({
              variantId: `var-${Date.now()}-${newVariants.length}`,
              color,
              size,
              stock: 10,
              price: basePrice,
            });
          }
        }
      } else if (colorsList.length > 0) {
        for (const color of colorsList) {
          newVariants.push({
            variantId: `var-${Date.now()}-${newVariants.length}`,
            color,
            stock: 10,
            price: basePrice,
          });
        }
      } else {
        for (const size of sizesList) {
          newVariants.push({
            variantId: `var-${Date.now()}-${newVariants.length}`,
            size,
            stock: 10,
            price: basePrice,
          });
        }
      }

      setVariants(newVariants);
      setValue("hasVariants", true);
    }

    // ── Mark as new arrival by default ──
    setValue("newArrival", true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* AI Generate Banner */}
      <div className="flex items-center justify-between rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-4">
        <div>
          <h3 className="text-sm font-semibold text-brand-purple">AI Content Generator</h3>
          <p className="text-xs text-neutral-600">
            Let Claude generate descriptions, SEO metadata, fabric &amp; care info from minimal input.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setAiModalOpen(true)}
        >
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v3m6.36-.64-2.12 2.12M21 12h-3m.64 6.36-2.12-2.12M12 21v-3m-6.36.64 2.12-2.12M3 12h3m-.64-6.36 2.12 2.12" />
            </svg>
            Generate with AI
          </span>
        </Button>
      </div>

      <AIGenerateModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={handleAIApply}
        defaults={{
          productName: watch("name") || undefined,
          category: selectedCategoryName || undefined,
          fabric: watch("fabric") || undefined,
          price: watch("price") || undefined,
          colors: [...new Set(variants.map((v) => v.color).filter(Boolean))].join(", ") || undefined,
          sizes: [...new Set(variants.map((v) => v.size).filter(Boolean))].join(", ") || undefined,
        }}
      />

      {/* Basic Info */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Basic Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Product Name"
            placeholder="e.g. Selene Silk Midi Dress"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Slug"
            placeholder="auto-generated from name"
            error={errors.slug?.message}
            {...register("slug")}
          />
          <Input
            label="SKU"
            placeholder="e.g. ISV-DR-001"
            error={errors.sku?.message}
            {...register("sku")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief product summary"
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              {...register("shortDescription")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Full Description
            </label>
            <textarea
              rows={4}
              placeholder="Detailed product description"
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              {...register("description")}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Pricing & Inventory
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Price (£)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
          <Input
            label="Sale Price (£)"
            type="number"
            step="0.01"
            min="0"
            placeholder="Optional"
            error={errors.salePrice?.message}
            {...register("salePrice", { valueAsNumber: true })}
          />
          <Input
            label="Compare At Price (£)"
            type="number"
            step="0.01"
            min="0"
            placeholder="Original price"
            error={errors.compareAtPrice?.message}
            {...register("compareAtPrice", { valueAsNumber: true })}
          />
          <Input
            label="Stock Quantity"
            type="number"
            min="0"
            error={errors.stockQuantity?.message}
            {...register("stockQuantity", { valueAsNumber: true })}
          />
          <Input
            label="Low Stock Threshold"
            type="number"
            min="0"
            error={errors.lowStockThreshold?.message}
            {...register("lowStockThreshold", { valueAsNumber: true })}
          />
          <Input
            label="Display Order"
            type="number"
            min="0"
            error={errors.displayOrder?.message}
            {...register("displayOrder", { valueAsNumber: true })}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("inStock")} className="rounded border-neutral-300" />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("allowBackorder")} className="rounded border-neutral-300" />
            Allow Backorder
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <ImageManager images={images} onChange={setImages} />
      </div>

      {/* Variants */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <label className="mb-4 flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" {...register("hasVariants")} className="rounded border-neutral-300" />
          <span className="font-medium">This product has variants (size/color)</span>
        </label>
        {watch("hasVariants") && (
          <VariantManager variants={variants} onChange={setVariants} />
        )}
      </div>

      {/* Fabric & Care */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Fabric & Care
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Fabric"
            placeholder="e.g. 100% Mulberry Silk"
            {...register("fabric")}
          />
          <Input
            label="Badge"
            placeholder="e.g. Best Seller, New, Sale"
            {...register("badge")}
          />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Care Instructions
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Dry clean only. Store on padded hanger."
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            {...register("careInstructions")}
          />
        </div>
        <div className="mt-4">
          <MeasurementsEditor measurements={measurements} onChange={setMeasurements} />
        </div>
      </div>

      {/* Flags */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Visibility & Flags
        </h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("published")} className="rounded border-neutral-300" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("featured")} className="rounded border-neutral-300" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("newArrival")} className="rounded border-neutral-300" />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("bestseller")} className="rounded border-neutral-300" />
            Best Seller
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          SEO & Metadata
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Meta Title"
            placeholder="Page title for search engines"
            {...register("metaTitle")}
          />
          <Input
            label="Keywords"
            placeholder="Comma-separated keywords"
            {...register("keywords")}
          />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Meta Description
          </label>
          <textarea
            rows={2}
            placeholder="Description for search engines"
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            {...register("metaDescription")}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Video URL"
            placeholder="https://..."
            {...register("videoUrl")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" isLoading={isSubmitting} size="md">
          {mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
