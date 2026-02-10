"use client";

import { CollectionsTable } from "@/components/admin/collections";

export default function AdminCollectionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-light text-brand-purple/80">Collections</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage style collections and curated product groupings.
        </p>
      </div>
      <CollectionsTable />
    </div>
  );
}
