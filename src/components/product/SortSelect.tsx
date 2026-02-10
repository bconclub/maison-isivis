"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Sellers", value: "bestseller" },
  { label: "Name: A-Z", value: "name-asc" },
] as const;

interface SortSelectProps {
  className?: string;
}

export function SortSelect({ className }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "featured";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page"); // reset pagination on sort change
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor="sort-select"
        className="whitespace-nowrap text-body-sm text-neutral-500"
      >
        Sort by
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="h-10 rounded-luxury-md border border-neutral-200 bg-white px-3 pr-8 text-body-sm text-neutral-800 outline-none transition-colors focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
