"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, ProductFilters, PaginatedProducts, Category, Collection } from "@/types/product";
import { COLLECTION_PRODUCT_MAP } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { ActiveFilters } from "@/components/product/ActiveFilters";
import { Pagination } from "@/components/product/Pagination";
import { MobileFilterDrawer } from "@/components/product/MobileFilterDrawer";

interface CollectionClientProps {
  /** If it's a category page */
  category?: Category;
  /** If it's a style collection page */
  collection?: Collection;
  slug: string;
  allProducts: Product[];
}

/** Client-side filter/sort/paginate */
function filterProducts(
  allProducts: Product[],
  filters: ProductFilters
): PaginatedProducts {
  let products = [...allProducts];

  // Category filter — match by categoryId on the joined category object
  if (filters.categorySlug) {
    products = products.filter((p) => p.category?.slug === filters.categorySlug);
  }

  // Collection filter
  if (filters.collectionSlug) {
    const ids = COLLECTION_PRODUCT_MAP[filters.collectionSlug];
    if (ids) products = products.filter((p) => ids.includes(p.id));
  }

  // Price range
  if (filters.minPrice != null)
    products = products.filter((p) => (p.salePrice ?? p.price) >= filters.minPrice!);
  if (filters.maxPrice != null)
    products = products.filter((p) => (p.salePrice ?? p.price) <= filters.maxPrice!);

  // Size filter
  if (filters.sizes?.length)
    products = products.filter((p) =>
      p.variants.some((v) => v.size && filters.sizes!.includes(v.size) && v.stock > 0)
    );

  // Color filter
  if (filters.colors?.length)
    products = products.filter((p) =>
      p.variants.some((v) => v.color && filters.colors!.includes(v.color) && v.stock > 0)
    );

  if (filters.inStockOnly) products = products.filter((p) => p.inStock && p.stockQuantity > 0);
  if (filters.onSale) products = products.filter((p) => p.salePrice != null);

  // Sorting
  const sortBy = filters.sortBy ?? "featured";
  switch (sortBy) {
    case "featured":
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.displayOrder - b.displayOrder);
      break;
    case "newest":
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "price-asc":
      products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case "price-desc":
      products.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      break;
    case "bestseller":
      products.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
      break;
    case "name-asc":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  // Pagination
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  return { products: paginated, total, page, limit, totalPages };
}

export function CollectionClient({
  category,
  collection,
  slug,
  allProducts,
}: CollectionClientProps) {
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {};

    if (category) {
      f.categorySlug = slug;
    } else if (collection) {
      f.collectionSlug = slug;
    }

    const sort = searchParams.get("sort");
    if (sort) f.sortBy = sort as ProductFilters["sortBy"];

    const page = searchParams.get("page");
    f.page = page ? parseInt(page, 10) : 1;

    const minPrice = searchParams.get("minPrice");
    if (minPrice) f.minPrice = parseFloat(minPrice);

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) f.maxPrice = parseFloat(maxPrice);

    const sizes = searchParams.getAll("size");
    if (sizes.length > 0) f.sizes = sizes;

    const colors = searchParams.getAll("color");
    if (colors.length > 0) f.colors = colors;

    const inStock = searchParams.get("inStock");
    if (inStock === "true") f.inStockOnly = true;

    const onSale = searchParams.get("onSale");
    if (onSale === "true") f.onSale = true;

    f.limit = 12;

    return f;
  }, [searchParams, slug, category, collection]);

  const result = filterProducts(allProducts, filters);

  const title = category?.name ?? collection?.title ?? "Collection";

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-h2 font-semibold text-neutral-900 sm:text-h1">
            {title}
          </h1>
          <p className="mt-1 text-body-sm text-neutral-400">
            {result.total} {result.total === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex h-10 items-center gap-2 rounded-luxury-md border border-neutral-200 px-4 text-body-sm font-medium text-neutral-700 transition-colors hover:border-brand-purple"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            Filters
          </button>

          <SortSelect />
        </div>
      </div>

      <ActiveFilters className="mb-6" />

      {/* Product grid — full width, focus on imagery */}
      {result.products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {result.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            className="mt-12"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-300"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h2 className="mb-2 font-heading text-h4 text-neutral-900">
            No products found
          </h2>
          <p className="text-body-sm text-neutral-500">
            Try adjusting your filters.
          </p>
        </div>
      )}

      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        hideCategory={!!category}
      />
    </>
  );
}
