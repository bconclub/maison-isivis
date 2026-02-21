"use client";

import { use } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductAccordion } from "@/components/product/ProductAccordion";

/**
 * Client-side fallback for products that exist in the admin store
 * but not in the static mock data (e.g. newly created products).
 */
export function ProductDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);

  const product = products.find((p) => p.slug === slug && p.published);

  if (!product) {
    return (
      <div className="container-luxury py-24 text-center">
        <h1 className="font-heading text-4xl text-neutral-900">404</h1>
        <p className="mt-4 text-lg text-neutral-500">
          The product you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex rounded-lg bg-brand-purple px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-purple/90"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // Join categories
  const productCategories = categories.filter((c) =>
    (product.categoryIds ?? []).includes(c.id) || c.id === product.categoryId
  );
  const primaryCategory = productCategories[0];
  const productWithCategory = primaryCategory
    ? { ...product, category: primaryCategory, categories: productCategories }
    : product;

  // Breadcrumbs — use primary (first) category
  const breadcrumbItems = [];
  if (primaryCategory) {
    breadcrumbItems.push({
      label: primaryCategory.name,
      href: `/collections/${primaryCategory.slug}`,
    });
  }
  breadcrumbItems.push({ label: productWithCategory.name });

  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          ...breadcrumbItems,
        ]}
        className="mb-8"
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={productWithCategory.images}
          productName={productWithCategory.name}
        />
        <ProductInfo product={productWithCategory} />
      </div>

      <div className="mt-12 max-w-3xl">
        <ProductAccordion product={productWithCategory} />
      </div>
    </div>
  );
}
