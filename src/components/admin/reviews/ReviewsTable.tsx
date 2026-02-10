"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/stores/admin-store";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "../products/DeleteConfirmModal";

type FilterType = "all" | "pending" | "approved" | "featured";

export function ReviewsTable() {
  const reviews = useAdminStore((s) => s.reviews);
  const products = useAdminStore((s) => s.products);
  const approveReview = useAdminStore((s) => s.approveReview);
  const rejectReview = useAdminStore((s) => s.rejectReview);
  const toggleFeaturedReview = useAdminStore((s) => s.toggleFeaturedReview);
  const deleteReview = useAdminStore((s) => s.deleteReview);

  const [filter, setFilter] = useState<FilterType>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function getProductName(productId: string) {
    return products.find((p) => p.id === productId)?.name ?? "Unknown Product";
  }

  const filtered = useMemo(() => {
    let result = [...reviews];

    switch (filter) {
      case "pending":
        result = result.filter((r) => !r.approved);
        break;
      case "approved":
        result = result.filter((r) => r.approved);
        break;
      case "featured":
        result = result.filter((r) => r.featured);
        break;
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return result;
  }, [reviews, filter]);

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={star <= rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={star <= rating ? "text-amber-400" : "text-neutral-300"}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "pending", "approved", "featured"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === tab
                ? "bg-brand-purple text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            {tab}
            {tab === "pending" && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                {reviews.filter((r) => !r.approved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left">
              <th className="px-5 py-3 font-medium text-neutral-500">Product</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Customer</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Rating</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Review</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Date</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Status</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-neutral-400">
                  No reviews found.
                </td>
              </tr>
            ) : (
              filtered.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                >
                  <td className="max-w-[150px] truncate px-5 py-3 text-neutral-900">
                    {getProductName(review.productId)}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    {review.user?.fullName ?? "Anonymous"}
                  </td>
                  <td className="px-5 py-3">{renderStars(review.rating)}</td>
                  <td className="max-w-[250px] px-5 py-3">
                    {review.title && (
                      <p className="truncate font-medium text-neutral-900">
                        {review.title}
                      </p>
                    )}
                    {review.comment && (
                      <p className="truncate text-neutral-500">{review.comment}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          review.approved
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </span>
                      {review.featured && (
                        <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {!review.approved && (
                        <button
                          onClick={() => approveReview(review.id)}
                          className="rounded p-1.5 text-green-500 transition-colors hover:bg-green-50"
                          title="Approve"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </button>
                      )}
                      {review.approved && (
                        <button
                          onClick={() => rejectReview(review.id)}
                          className="rounded p-1.5 text-amber-500 transition-colors hover:bg-amber-50"
                          title="Unapprove"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => toggleFeaturedReview(review.id)}
                        className={cn(
                          "rounded p-1.5 transition-colors",
                          review.featured
                            ? "text-purple-500 hover:bg-purple-50"
                            : "text-neutral-400 hover:bg-neutral-50 hover:text-purple-500"
                        )}
                        title={review.featured ? "Unfeature" : "Feature"}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={review.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(review.id)}
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
        Showing {filtered.length} of {reviews.length} reviews
      </p>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteReview(deleteTarget)}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
      />
    </>
  );
}
