"use client";

import { CategoriesTable } from "@/components/admin/categories";

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-brand-purple">Categories</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage product categories. Products are grouped by category.
        </p>
      </div>
      <CategoriesTable />
    </div>
  );
}
