import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderItem, ShippingAddress } from "@/types/order";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToOrder(row: any): Order {
  const shipping =
    typeof row.shipping_address === "string"
      ? JSON.parse(row.shipping_address)
      : row.shipping_address ?? {};

  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    shippingAddress: {
      fullName: shipping.fullName ?? "",
      phone: shipping.phone ?? "",
      addressLine1: shipping.addressLine1 ?? "",
      addressLine2: shipping.addressLine2 ?? undefined,
      city: shipping.city ?? "",
      state: shipping.state ?? "",
      pinCode: shipping.pinCode ?? "",
      country: shipping.country ?? "GB",
    } as ShippingAddress,
    subtotal: parseFloat(row.subtotal),
    shippingCost: parseFloat(row.shipping_cost ?? "0"),
    tax: parseFloat(row.tax ?? "0"),
    discount: parseFloat(row.discount ?? "0"),
    total: parseFloat(row.total),
    promoCode: row.promo_code,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    trackingNumber: row.tracking_number,
    estimatedDeliveryDate: row.estimated_delivery_date,
    notes: row.notes,
    items: (row.order_items ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any): OrderItem => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        productName: item.product_name,
        productSlug: item.product_slug,
        variantId: item.variant_id,
        variantName: item.variant_name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        imageUrl: item.image_url,
      })
    ),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── GET: Fetch all orders with items ─────────────────────
export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin Orders GET]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const orders = (data ?? []).map(dbToOrder);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[Admin Orders GET]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
