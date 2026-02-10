"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    router.push(`?${params.toString()}`, { scroll: true });
  }

  // Build page numbers to show
  const pages: (number | "ellipsis")[] = [];
  const delta = 1; // show 1 page on each side of current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav
      className={cn("flex items-center justify-center gap-1.5", className)}
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-luxury-md border border-neutral-200 text-neutral-600 transition-colors",
          currentPage <= 1
            ? "cursor-not-allowed text-neutral-300"
            : "hover:border-brand-purple hover:text-brand-purple"
        )}
        aria-label="Previous page"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 w-10 items-center justify-center text-body-sm text-neutral-400"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-luxury-md text-body-sm font-medium transition-colors",
              page === currentPage
                ? "bg-brand-purple text-white"
                : "border border-neutral-200 text-neutral-700 hover:border-brand-purple hover:text-brand-purple"
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-luxury-md border border-neutral-200 text-neutral-600 transition-colors",
          currentPage >= totalPages
            ? "cursor-not-allowed text-neutral-300"
            : "hover:border-brand-purple hover:text-brand-purple"
        )}
        aria-label="Next page"
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}
