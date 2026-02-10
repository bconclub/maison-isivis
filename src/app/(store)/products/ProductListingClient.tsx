"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getFilteredProducts } from "@/lib/mock-data";
import type { ProductFilters } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { ActiveFilters } from "@/components/product/ActiveFilters";
import { Pagination } from "@/components/product/Pagination";
import { MobileFilterDrawer } from "@/components/product/MobileFilterDrawer";

export function ProductListingClient() {
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse search params into filters
  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {};

    const category = searchParams.get("category");
    if (category) f.categorySlug = category;

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

    const search = searchParams.get("q");
    if (search) f.search = search;

    const filter = searchParams.get("filter");
    if (filter === "new-arrivals") f.newArrivals = true;

    f.limit = 12;

    return f;
  }, [searchParams]);

  const result = getFilteredProducts(filters);

  // Determine page title
  let pageTitle = "All Products";
  const filterParam = searchParams.get("filter");
  if (filterParam === "new-arrivals") pageTitle = "New Arrivals";
  if (filterParam === "trending") pageTitle = "Trending Now";
  if (filterParam === "back-in-stock") pageTitle = "Back In Stock";
  const searchQuery = searchParams.get("q");
  if (searchQuery) pageTitle = `Results for "${searchQuery}"`;

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-h2 font-semibold text-neutral-900 sm:text-h1">
            {pageTitle}
          </h1>
          <p className="mt-1 text-body-sm text-neutral-500">
            {result.total} {result.total === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter toggle */}
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

      {/* Active Filters */}
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
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Filter drawer */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </>
  );
}
