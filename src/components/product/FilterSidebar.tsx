"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SIZES, COLORS, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  className?: string;
  /** Hide category filter (e.g., when already on a category page) */
  hideCategory?: boolean;
}

/* ── Collapsible Section ──────────────────────────────────────── */
function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100 py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-body-sm font-medium uppercase tracking-luxury text-neutral-800"
      >
        {title}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={cn("transition-transform duration-200", open && "rotate-180")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

/* ── Main Sidebar ─────────────────────────────────────────────── */
export function FilterSidebar({ className, hideCategory }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string, isMulti = false) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // reset pagination on filter change

      if (isMulti) {
        const existing = params.getAll(key);
        if (existing.includes(value)) {
          // Remove this value
          params.delete(key);
          existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      } else {
        if (params.get(key) === value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const selectedSizes = searchParams.getAll("size");
  const selectedColors = searchParams.getAll("color");
  const inStockOnly = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";
  const selectedCategory = searchParams.get("category");

  return (
    <aside className={cn("w-full", className)}>
      <h2 className="mb-2 font-heading text-h4 font-light text-neutral-800">
        Filters
      </h2>

      {/* Category */}
      {!hideCategory && (
        <FilterSection title="Category">
          <div className="space-y-2.5">
            {CATEGORIES.map((cat) => (
              <label key={cat.slug} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.slug}
                  onChange={() => updateParams("category", cat.slug)}
                  className="h-4 w-4 border-neutral-300 text-brand-purple accent-brand-purple"
                />
                <span className="text-body-sm text-neutral-700">{cat.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price">
        <div className="space-y-2.5">
          {[
            { label: "Under £50", min: "", max: "50" },
            { label: "£50 – £100", min: "50", max: "100" },
            { label: "£100 – £200", min: "100", max: "200" },
            { label: "£200 – £500", min: "200", max: "500" },
            { label: "Over £500", min: "500", max: "" },
          ].map((range) => {
            const isActive =
              searchParams.get("minPrice") === (range.min || null) &&
              searchParams.get("maxPrice") === (range.max || null);
            return (
              <label key={range.label} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name="price-range"
                  checked={isActive}
                  onChange={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("page");
                    if (range.min) params.set("minPrice", range.min);
                    else params.delete("minPrice");
                    if (range.max) params.set("maxPrice", range.max);
                    else params.delete("maxPrice");
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className="h-4 w-4 border-neutral-300 text-brand-purple accent-brand-purple"
                />
                <span className="text-body-sm text-neutral-700">{range.label}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => updateParams("size", size, true)}
                className={cn(
                  "flex h-9 min-w-[2.25rem] items-center justify-center rounded-luxury-md border px-2.5 text-caption font-medium transition-all",
                  isSelected
                    ? "border-brand-purple bg-brand-purple text-white"
                    : "border-neutral-200 text-neutral-700 hover:border-brand-purple"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colour">
        <div className="space-y-2.5">
          {COLORS.map((color) => {
            const isSelected = selectedColors.includes(color);
            return (
              <label key={color} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => updateParams("color", color, true)}
                  className="h-4 w-4 rounded border-neutral-300 text-brand-purple accent-brand-purple"
                />
                <span className="text-body-sm text-neutral-700">{color}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={() => updateParams("inStock", "true")}
              className="h-4 w-4 rounded border-neutral-300 text-brand-purple accent-brand-purple"
            />
            <span className="text-body-sm text-neutral-700">In Stock Only</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={onSale}
              onChange={() => updateParams("onSale", "true")}
              className="h-4 w-4 rounded border-neutral-300 text-brand-purple accent-brand-purple"
            />
            <span className="text-body-sm text-neutral-700">On Sale</span>
          </label>
        </div>
      </FilterSection>
    </aside>
  );
}
