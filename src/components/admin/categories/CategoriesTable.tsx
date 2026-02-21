"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "../products/DeleteConfirmModal";

export function CategoriesTable() {
  const categories = useAdminStore((s) => s.categories);
  const products = useAdminStore((s) => s.products);
  const deleteCategory = useAdminStore((s) => s.deleteCategory);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  function getProductCount(categoryId: string) {
    return products.filter((p) => (p.categoryIds ?? []).includes(categoryId) || p.categoryId === categoryId).length;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-purple/90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add Category
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left">
              <th className="px-5 py-3 font-medium text-neutral-500">Name</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Slug</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Products</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Order</th>
              <th className="px-5 py-3 font-medium text-neutral-500">In Menu</th>
              <th className="px-5 py-3 font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-neutral-400">
                  No categories yet. Create your first category.
                </td>
              </tr>
            ) : (
              categories
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                  >
                    <td className="px-5 py-3 font-medium text-neutral-900">
                      {cat.name}
                    </td>
                    <td className="px-5 py-3 text-neutral-500">{cat.slug}</td>
                    <td className="px-5 py-3 text-neutral-500">
                      {getProductCount(cat.id)}
                    </td>
                    <td className="px-5 py-3 text-neutral-500">
                      {cat.displayOrder}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          cat.showInMenu
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-500"
                        )}
                      >
                        {cat.showInMenu ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
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

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteCategory(deleteTarget.id)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? Products in this category will become uncategorized.`}
      />
    </>
  );
}
