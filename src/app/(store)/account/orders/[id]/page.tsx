import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import type { OrderStatus } from "@/types/order";

interface Props {
  params: Promise<{ id: string }>;
}

const ORDER_TIMELINE: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

interface ShippingAddress {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single() as { data: any | null };

  if (!rawOrder) {
    notFound();
  }

  const shippingAddress = (rawOrder.shipping_address ?? {}) as ShippingAddress;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = {
    id: rawOrder.id as string,
    orderNumber: rawOrder.order_number as string,
    status: rawOrder.status as OrderStatus,
    subtotal: parseFloat(String(rawOrder.subtotal)),
    shippingCost: parseFloat(String(rawOrder.shipping_cost)),
    tax: parseFloat(String(rawOrder.tax)),
    discount: parseFloat(String(rawOrder.discount)),
    total: parseFloat(String(rawOrder.total)),
    createdAt: rawOrder.created_at as string,
    shippingAddress,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: (Array.isArray(rawOrder.order_items) ? rawOrder.order_items : []).map((item: any) => ({
      id: item.id,
      productName: item.product_name,
      productSlug: item.product_slug,
      variantName: item.variant_name,
      quantity: item.quantity,
      price: parseFloat(String(item.price)),
      imageUrl: item.image_url,
    })),
  };

  const currentStepIndex = ORDER_TIMELINE.indexOf(order.status);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-body-sm text-neutral-500 transition-colors hover:text-brand-purple"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Order #{order.orderNumber}
          </h2>
          <p className="mt-1 text-body-sm text-neutral-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Status Timeline */}
      {!["cancelled", "refunded"].includes(order.status) && (
        <div className="mb-10 rounded-luxury-md border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            {ORDER_TIMELINE.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-caption font-medium ${
                      i <= currentStepIndex
                        ? "bg-brand-purple text-white"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {i < currentStepIndex ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="mt-2 text-center text-caption capitalize text-neutral-500">
                    {step}
                  </span>
                </div>
                {i < ORDER_TIMELINE.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      i < currentStepIndex ? "bg-brand-purple" : "bg-neutral-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-8">
        <h3 className="mb-4 text-body-sm font-medium uppercase tracking-luxury text-neutral-700">
          Items
        </h3>
        <div className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-luxury-md border border-neutral-100 p-4"
            >
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-neutral-100">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200" />
                )}
              </div>
              <div className="flex-1">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="text-body-sm font-medium text-neutral-900 hover:text-brand-purple"
                >
                  {item.productName}
                </Link>
                {item.variantName && (
                  <p className="mt-0.5 text-caption text-neutral-500">
                    {item.variantName}
                  </p>
                )}
                <p className="mt-1 text-caption text-neutral-500">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <span className="text-body-sm font-medium text-neutral-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary + Shipping Address */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Summary */}
        <div className="rounded-luxury-md border border-neutral-100 p-5">
          <h3 className="mb-4 text-body-sm font-medium uppercase tracking-luxury text-neutral-700">
            Summary
          </h3>
          <div className="space-y-2 text-body-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>
                {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>VAT</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="border-t border-neutral-100 pt-2">
              <div className="flex justify-between font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-luxury-md border border-neutral-100 p-5">
          <h3 className="mb-4 text-body-sm font-medium uppercase tracking-luxury text-neutral-700">
            Shipping Address
          </h3>
          <div className="text-body-sm text-neutral-600">
            <p className="font-medium text-neutral-900">
              {shippingAddress.fullName ?? "—"}
            </p>
            <p>{shippingAddress.addressLine1 ?? ""}</p>
            {shippingAddress.addressLine2 && (
              <p>{shippingAddress.addressLine2}</p>
            )}
            <p>
              {shippingAddress.city ?? ""}{shippingAddress.state ? `, ${shippingAddress.state}` : ""}{" "}
              {shippingAddress.pinCode ?? ""}
            </p>
            <p>{shippingAddress.country ?? ""}</p>
            {shippingAddress.phone && (
              <p className="mt-2">{shippingAddress.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
