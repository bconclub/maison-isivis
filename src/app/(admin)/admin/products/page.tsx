"use client";

import { ProductsTable } from "@/components/admin/products";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-light text-brand-purple/80">Products</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your product catalogue. Add, edit, or remove products.
        </p>
      </div>
      <ProductsTable />
    </div>
  );
}
