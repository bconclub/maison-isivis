"use client";

import { use } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { ProductForm } from "@/components/admin/products";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = useAdminStore((s) => s.getProductById(id));

  if (!product) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-neutral-900">Product not found</p>
        <p className="mt-2 text-sm text-neutral-500">
          The product you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link
          href="/admin/products"
          className="mt-4 inline-flex text-sm font-medium text-brand-purple hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Products
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-purple">
              Edit: {product.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Update product details, pricing, images, and more.
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-brand-purple"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View on Store
          </Link>
        </div>
      </div>
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
