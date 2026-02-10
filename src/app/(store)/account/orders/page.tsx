import Link from "next/link";
import type { Metadata } from "next";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";

export const metadata: Metadata = {
  title: "Order History | Maison ISIVIS",
};

export default function OrdersPage() {
  const orders = MOCK_ORDERS;

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 flex justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-300"
          >
            <path d="m7.5 4.27 9 5.15" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mb-2 font-heading text-h4 text-neutral-900">
          No orders yet
        </h2>
        <p className="mb-6 text-body-sm text-neutral-500">
          Start shopping to see your order history here.
        </p>
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-luxury-md bg-brand-purple px-6 text-body-sm font-medium uppercase tracking-luxury text-white transition-all hover:bg-brand-purple-light"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-heading text-h3 font-semibold text-neutral-900">
        Order History
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block rounded-luxury-md border border-neutral-100 p-5 transition-all hover:border-brand-purple/20 hover:shadow-luxury"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-body-sm font-medium text-neutral-900">
                  Order #{order.orderNumber}
                </p>
                <p className="mt-1 text-caption text-neutral-500">
                  {formatDate(order.createdAt)} · {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="text-body-sm font-semibold text-neutral-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
