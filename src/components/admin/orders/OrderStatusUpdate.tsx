"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/stores/admin-store";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export function OrderStatusUpdate({ order }: { order: Order }) {
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");

  function handleUpdate() {
    updateOrderStatus(
      order.id,
      status,
      trackingNumber || undefined
    );
    toast(`Order status updated to "${status}"`, "success");
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-neutral-900">
        Update Status
      </h3>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Order Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm capitalize text-neutral-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {(status === "shipped" || status === "delivered") && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. RM1234567890GB"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            />
          </div>
        )}

        <button
          onClick={handleUpdate}
          disabled={status === order.status && trackingNumber === (order.trackingNumber ?? "")}
          className={cn(
            "w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors",
            status === order.status && trackingNumber === (order.trackingNumber ?? "")
              ? "cursor-not-allowed bg-neutral-300"
              : "bg-brand-purple hover:bg-brand-purple/90"
          )}
        >
          Update Order
        </button>
      </div>
    </div>
  );
}
