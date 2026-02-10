"use client";

import { ReviewsTable } from "@/components/admin/reviews";

export default function AdminReviewsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-light text-brand-purple/80">Reviews</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Moderate and manage product reviews. Approve, feature, or remove reviews.
        </p>
      </div>
      <ReviewsTable />
    </div>
  );
}
