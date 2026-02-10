"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActiveFiltersProps {
  className?: string;
}

export function ActiveFilters({ className }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Gather all active filter params
  const pills: { label: string; paramKey: string; paramValue?: string }[] = [];

  const sizes = searchParams.getAll("size");
  sizes.forEach((s) => pills.push({ label: `Size: ${s}`, paramKey: "size", paramValue: s }));

  const colors = searchParams.getAll("color");
  colors.forEach((c) => pills.push({ label: c, paramKey: "color", paramValue: c }));

  const minPrice = searchParams.get("minPrice");
  if (minPrice) pills.push({ label: `From £${minPrice}`, paramKey: "minPrice" });

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) pills.push({ label: `Up to £${maxPrice}`, paramKey: "maxPrice" });

  const inStock = searchParams.get("inStock");
  if (inStock === "true") pills.push({ label: "In Stock", paramKey: "inStock" });

  const onSale = searchParams.get("onSale");
  if (onSale === "true") pills.push({ label: "On Sale", paramKey: "onSale" });

  if (pills.length === 0) return null;

  function removePill(paramKey: string, paramValue?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (paramValue) {
      // Remove only this specific value from multi-value param
      const values = params.getAll(paramKey).filter((v) => v !== paramValue);
      params.delete(paramKey);
      values.forEach((v) => params.append(paramKey, v));
    } else {
      params.delete(paramKey);
    }
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {pills.map((pill, i) => (
        <button
          key={`${pill.paramKey}-${pill.paramValue ?? i}`}
          onClick={() => removePill(pill.paramKey, pill.paramValue)}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-caption font-medium text-neutral-700 transition-colors hover:border-brand-purple hover:text-brand-purple"
        >
          {pill.label}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        onClick={clearAll}
        className="text-caption font-medium text-neutral-400 underline underline-offset-2 transition-colors hover:text-brand-purple"
      >
        Clear All
      </button>
    </div>
  );
}
