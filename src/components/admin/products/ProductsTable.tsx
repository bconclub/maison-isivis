"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type Tab = "all" | "featured" | "bestsellers";

export function ProductsTable() {
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "date">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // ── Filtered products for "All" tab ──
  const filteredAll = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.shortDescription ?? "").toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => (p.categoryIds ?? []).includes(categoryFilter) || p.categoryId === categoryFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
          break;
        case "stock":
          cmp = a.stockQuantity - b.stockQuantity;
          break;
        case "date":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [products, search, categoryFilter, sortBy, sortDir]);

  // ── Featured products sorted by displayOrder ──
  const featuredProducts = useMemo(
    () =>
      [...products]
        .filter((p) => p.featured)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [products]
  );

  // ── Bestseller products sorted by displayOrder ──
  const bestsellerProducts = useMemo(
    () =>
      [...products]
        .filter((p) => p.bestseller)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [products]
  );

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  function getCategoryNames(product: { categoryIds?: string[]; categoryId?: string | null }) {
    const ids = product.categoryIds?.length ? product.categoryIds : (product.categoryId ? [product.categoryId] : []);
    if (ids.length === 0) return "—";
    return ids.map((id) => categories.find((c) => c.id === id)?.name).filter(Boolean).join(", ") || "—";
  }

  // ── Move position (swap displayOrder with adjacent item) ──
  function movePosition(
    productId: string,
    direction: "up" | "down",
    list: typeof products
  ) {
    const idx = list.findIndex((p) => p.id === productId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;

    const current = list[idx]!;
    const swap = list[swapIdx]!;
    const currentOrder = current.displayOrder;
    const swapOrder = swap.displayOrder;

    // If both have the same displayOrder, assign sequential values
    const newCurrentOrder = currentOrder === swapOrder
      ? (direction === "up" ? swapOrder - 1 : swapOrder + 1)
      : swapOrder;
    const newSwapOrder = currentOrder === swapOrder
      ? currentOrder
      : currentOrder;

    updateProduct(current.id, { displayOrder: newCurrentOrder });
    updateProduct(swap.id, { displayOrder: newSwapOrder });
  }

  // Counts for tab badges
  const featuredCount = products.filter((p) => p.featured).length;
  const bestsellerCount = products.filter((p) => p.bestseller).length;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: "All Products" },
    { key: "featured", label: "Featured", count: featuredCount },
    { key: "bestsellers", label: "Best Sellers", count: bestsellerCount },
  ];

  const currentList =
    activeTab === "featured"
      ? featuredProducts
      : activeTab === "bestsellers"
      ? bestsellerProducts
      : filteredAll;

  return (
    <>
      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "text-brand-purple"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.count != null && (
                <span
                  className={cn(
                    "inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium",
                    activeTab === tab.key
                      ? "bg-brand-purple/10 text-brand-purple"
                      : "bg-neutral-100 text-neutral-500"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {activeTab === tab.key && (
              <div className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-purple" />
            )}
          </button>
        ))}
      </div>

      {/* Toolbar — only show search/filter on All tab */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {activeTab === "all" ? (
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-brand-purple focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            {activeTab === "featured"
              ? "Drag to reorder how featured products appear on the homepage carousel."
              : "Drag to reorder how best sellers appear on the homepage."}
          </p>
        )}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-purple/90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left">
              {/* Position column for featured/bestseller tabs */}
              {activeTab !== "all" && (
                <th className="px-4 py-3 text-center font-medium text-neutral-500 w-20">
                  Position
                </th>
              )}
              <th className="px-5 py-3 font-medium text-neutral-500">Image</th>
              <th
                className={cn(
                  "px-5 py-3 font-medium text-neutral-500",
                  activeTab === "all" && "cursor-pointer hover:text-neutral-900"
                )}
                onClick={activeTab === "all" ? () => toggleSort("name") : undefined}
              >
                Name {activeTab === "all" && sortBy === "name" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-5 py-3 font-medium text-neutral-500">SKU</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Category</th>
              <th
                className={cn(
                  "px-5 py-3 font-medium text-neutral-500",
                  activeTab === "all" && "cursor-pointer hover:text-neutral-900"
                )}
                onClick={activeTab === "all" ? () => toggleSort("price") : undefined}
              >
                Price {activeTab === "all" && sortBy === "price" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-5 py-3 font-medium text-neutral-500">Status</th>
              {activeTab === "all" && (
                <th className="px-5 py-3 text-center font-medium text-neutral-500">Featured</th>
              )}
              {activeTab !== "all" && (
                <th className="px-5 py-3 text-center font-medium text-neutral-500">
                  {activeTab === "featured" ? "Remove" : "Remove"}
                </th>
              )}
              <th className="px-5 py-3 font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentList.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "all" ? 9 : 9} className="px-5 py-12 text-center text-neutral-400">
                  {activeTab === "featured"
                    ? "No featured products yet. Mark products as featured to show them here."
                    : activeTab === "bestsellers"
                    ? "No best sellers yet. Mark products as best sellers to show them here."
                    : "No products found."}
                </td>
              </tr>
            ) : (
              currentList.map((product, idx) => (
                <tr
                  key={product.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                >
                  {/* Position controls */}
                  {activeTab !== "all" && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          onClick={() => movePosition(product.id, "up", currentList)}
                          disabled={idx === 0}
                          className={cn(
                            "rounded p-1 transition-colors",
                            idx === 0
                              ? "cursor-not-allowed text-neutral-200"
                              : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          )}
                          title="Move up"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        </button>
                        <span className="min-w-[24px] text-center text-xs font-medium text-neutral-500">
                          {idx + 1}
                        </span>
                        <button
                          onClick={() => movePosition(product.id, "down", currentList)}
                          disabled={idx === currentList.length - 1}
                          className={cn(
                            "rounded p-1 transition-colors",
                            idx === currentList.length - 1
                              ? "cursor-not-allowed text-neutral-200"
                              : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          )}
                          title="Move down"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded bg-neutral-100">
                      {product.images.length > 0 && product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt ?? product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-300">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-900">{product.name}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{product.sku}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {getCategoryNames(product)}
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <span className="font-medium text-neutral-900">
                        {formatPrice(product.salePrice ?? product.price)}
                      </span>
                      {product.salePrice && (
                        <span className="ml-1.5 text-xs text-neutral-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() =>
                        updateProduct(product.id, {
                          published: !product.published,
                        })
                      }
                      className="group flex items-center gap-2"
                      title={product.published ? "Switch to Draft" : "Publish product"}
                    >
                      <div
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors duration-200",
                          product.published ? "bg-green-500" : "bg-neutral-300"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                            product.published ? "translate-x-4" : "translate-x-0.5"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          product.published ? "text-green-700" : "text-neutral-400"
                        )}
                      >
                        {product.published ? "Live" : "Off"}
                      </span>
                    </button>
                  </td>

                  {/* Featured star toggle (All tab) */}
                  {activeTab === "all" && (
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() =>
                          updateProduct(product.id, {
                            featured: !product.featured,
                          })
                        }
                        className={cn(
                          "inline-flex items-center justify-center rounded-full p-1 transition-colors",
                          product.featured
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-neutral-300 hover:text-amber-400"
                        )}
                        title={product.featured ? "Remove from featured" : "Add to featured"}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={product.featured ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    </td>
                  )}

                  {/* Remove button (Featured/Bestsellers tabs) */}
                  {activeTab !== "all" && (
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() =>
                          updateProduct(product.id, {
                            ...(activeTab === "featured"
                              ? { featured: false }
                              : { bestseller: false }),
                          })
                        }
                        className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title={
                          activeTab === "featured"
                            ? "Remove from featured"
                            : "Remove from best sellers"
                        }
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  )}

                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="View on store"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                        className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-neutral-400">
        {activeTab === "all"
          ? `Showing ${filteredAll.length} of ${products.length} products`
          : activeTab === "featured"
          ? `${featuredProducts.length} featured products`
          : `${bestsellerProducts.length} best sellers`}
      </p>

      {/* Delete modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteProduct(deleteTarget.id)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </>
  );
}
