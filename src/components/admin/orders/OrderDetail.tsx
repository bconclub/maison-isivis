"use client";

import Link from "next/link";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-indigo-50 text-indigo-700",
  shipped: "bg-cyan-50 text-cyan-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-neutral-100 text-neutral-600",
};

export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            {order.orderNumber}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize",
              STATUS_COLORS[order.status]
            )}
          >
            {order.status}
          </span>
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize",
              order.paymentStatus === "paid"
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            )}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h3 className="text-sm font-semibold text-neutral-900">
                Order Items ({order.items.length})
              </h3>
            </div>
            <div className="divide-y divide-neutral-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-neutral-100">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="text-sm font-medium text-neutral-900 hover:text-brand-purple"
                    >
                      {item.productName}
                    </Link>
                    {item.variantName && (
                      <p className="text-xs text-neutral-500">{item.variantName}</p>
                    )}
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-neutral-200 px-5 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-900">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="text-neutral-900">
                    {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tax (VAT)</span>
                  <span className="text-neutral-900">{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">
                      Discount {order.promoCode && `(${order.promoCode})`}
                    </span>
                    <span className="text-green-600">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-neutral-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Shipping Address */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">
              Shipping Address
            </h3>
            <div className="text-sm text-neutral-600">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pinCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">
              Payment
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Method</span>
                <span className="capitalize text-neutral-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status</span>
                <span className="capitalize text-neutral-900">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                Tracking
              </h3>
              <p className="text-sm font-medium text-brand-purple">
                {order.trackingNumber}
              </p>
              {order.estimatedDeliveryDate && (
                <p className="mt-1 text-xs text-neutral-500">
                  Est. delivery: {formatDate(order.estimatedDeliveryDate)}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                Notes
              </h3>
              <p className="text-sm text-neutral-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
