"use client";

import Link from "next/link";
import { CategoryForm } from "@/components/admin/categories";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Categories
        </Link>
        <h1 className="font-heading text-2xl font-light text-brand-purple/80">
          Create New Category
        </h1>
      </div>
      <CategoryForm mode="create" />
    </div>
  );
}
