"use client";

import { use } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { OrderDetail, OrderStatusUpdate } from "@/components/admin/orders";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = useAdminStore((s) => s.getOrderById(id));

  if (!order) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-neutral-900">Order not found</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-flex text-sm font-medium text-brand-purple hover:underline"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <OrderDetail order={order} />
        </div>
        <div>
          <OrderStatusUpdate order={order} />
        </div>
      </div>
    </div>
  );
}
