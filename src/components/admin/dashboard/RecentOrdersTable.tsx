"use client";

import Link from "next/link";
import { useAdminStore } from "@/lib/stores/admin-store";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-indigo-50 text-indigo-700",
  shipped: "bg-cyan-50 text-cyan-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-neutral-100 text-neutral-600",
};

export function RecentOrdersTable() {
  const orders = useAdminStore((s) => s.orders);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (recentOrders.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <p className="text-sm text-neutral-400">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Recent Orders
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-left">
              <th className="px-5 py-3 font-medium text-neutral-500">Order</th>
              <th className="px-5 py-3 font-medium text-neutral-500">
                Customer
              </th>
              <th className="px-5 py-3 font-medium text-neutral-500">Date</th>
              <th className="px-5 py-3 font-medium text-neutral-500">
                Status
              </th>
              <th className="px-5 py-3 text-right font-medium text-neutral-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-neutral-50 last:border-0"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-brand-purple hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-neutral-600">
                  {order.shippingAddress.fullName}
                </td>
                <td className="px-5 py-3 text-neutral-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      STATUS_COLORS[order.status] ?? "bg-neutral-100 text-neutral-600"
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-medium text-neutral-900">
                  {formatPrice(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
