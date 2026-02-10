"use client";

import { use } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { CollectionForm } from "@/components/admin/collections";

export default function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const collection = useAdminStore((s) => s.getCollectionById(id));

  if (!collection) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-neutral-900">Collection not found</p>
        <Link
          href="/admin/collections"
          className="mt-4 inline-flex text-sm font-medium text-brand-purple hover:underline"
        >
          ← Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/collections"
          className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Collections
        </Link>
        <h1 className="font-heading text-2xl font-bold text-brand-purple">
          Edit: {collection.title}
        </h1>
      </div>
      <CollectionForm mode="edit" collection={collection} />
    </div>
  );
}
