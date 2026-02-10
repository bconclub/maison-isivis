"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/stores/admin-store";
import { cn } from "@/lib/utils";

interface ProductPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function ProductPicker({ selectedIds, onChange }: ProductPickerProps) {
  const products = useAdminStore((s) => s.products);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  function toggleProduct(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((pid) => pid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">
          Products in Collection ({selectedIds.length})
        </label>
      </div>

      <div className="relative mb-3">
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

      <div className="max-h-64 overflow-y-auto rounded-lg border border-neutral-200">
        {filtered.map((product) => {
          const isSelected = selectedIds.includes(product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => toggleProduct(product.id)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-neutral-50 px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-neutral-50",
                isSelected && "bg-brand-purple/5"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                  isSelected
                    ? "border-brand-purple bg-brand-purple text-white"
                    : "border-neutral-300"
                )}
              >
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-neutral-100">
                {product.images.length > 0 && product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-200" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {product.name}
                </p>
                <p className="text-xs text-neutral-500">{product.sku}</p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="p-4 text-center text-sm text-neutral-400">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
