import type { Review } from "@/types/user";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews: Review[];
  className?: string;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const starSize = size === "lg" ? 20 : 14;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i < rating ? "text-amber-400" : "text-neutral-200"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews, className }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return (
      <section className={cn("py-12", className)}>
        <h2 className="mb-6 font-heading text-h3 font-semibold text-neutral-900">
          Customer Reviews
        </h2>
        <div className="rounded-luxury-md border border-neutral-100 px-6 py-12 text-center">
          <p className="text-body-sm text-neutral-500">
            No reviews yet. Be the first to share your thoughts.
          </p>
        </div>
      </section>
    );
  }

  // Calculate average
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className={cn("py-12", className)}>
      <h2 className="mb-8 font-heading text-h3 font-semibold text-neutral-900">
        Customer Reviews
      </h2>

      {/* Summary */}
      <div className="mb-10 flex flex-col items-center gap-4 rounded-luxury-md border border-neutral-100 p-6 sm:flex-row sm:gap-8">
        <div className="text-center sm:text-left">
          <p className="font-heading text-display-sm font-bold text-neutral-900">
            {avgRating.toFixed(1)}
          </p>
          <StarRating rating={Math.round(avgRating)} size="lg" />
          <p className="mt-1 text-body-sm text-neutral-500">
            Based on {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating distribution */}
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = (count / reviews.length) * 100;
            return (
              <div key={star} className="flex items-center gap-2.5">
                <span className="w-3 text-right text-caption text-neutral-500">
                  {star}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0 text-amber-400"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-caption text-neutral-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-luxury-md border border-neutral-100 p-5 sm:p-6"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-body-sm font-medium text-neutral-900">
                  {review.user?.fullName ?? "Anonymous"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  {review.verified && (
                    <span className="text-caption font-medium text-green-600">
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
              <time className="shrink-0 text-caption text-neutral-400">
                {formatDate(review.createdAt)}
              </time>
            </div>

            {review.title && (
              <p className="mb-2 text-body-sm font-medium text-neutral-800">
                {review.title}
              </p>
            )}
            {review.comment && (
              <p className="text-body-sm leading-relaxed text-neutral-600">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
