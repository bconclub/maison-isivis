"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

export function ProductsTable() {
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "date">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.shortDescription ?? "").toLowerCase().includes(q)
      );
    }

    // Category
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    // Sort
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

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return "—";
    return categories.find((c) => c.id === categoryId)?.name ?? "—";
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              <th className="px-5 py-3 font-medium text-neutral-500">Image</th>
              <th
                className="cursor-pointer px-5 py-3 font-medium text-neutral-500 hover:text-neutral-900"
                onClick={() => toggleSort("name")}
              >
                Name {sortBy === "name" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-5 py-3 font-medium text-neutral-500">SKU</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Category</th>
              <th
                className="cursor-pointer px-5 py-3 font-medium text-neutral-500 hover:text-neutral-900"
                onClick={() => toggleSort("price")}
              >
                Price {sortBy === "price" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer px-5 py-3 font-medium text-neutral-500 hover:text-neutral-900"
                onClick={() => toggleSort("stock")}
              >
                Stock {sortBy === "stock" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-5 py-3 font-medium text-neutral-500">Status</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-neutral-400">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                >
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
                    {getCategoryName(product.categoryId)}
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
                    <span
                      className={cn(
                        "text-sm font-medium",
                        product.stockQuantity === 0
                          ? "text-red-600"
                          : product.stockQuantity <= product.lowStockThreshold
                          ? "text-amber-600"
                          : "text-green-600"
                      )}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        product.published
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      )}
                    >
                      {product.published ? "Published" : "Draft"}
                    </span>
                  </td>
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
        Showing {filtered.length} of {products.length} products
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
