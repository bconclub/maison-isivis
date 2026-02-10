"use client";

import { OrdersTable } from "@/components/admin/orders";

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="mt-1 text-sm text-neutral-500">
          View and manage customer orders. Update status and tracking.
        </p>
      </div>
      <OrdersTable />
    </div>
  );
}
