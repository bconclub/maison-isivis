import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = "nodejs";

function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ISV-${date}-${rand}`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET env var");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const meta = session.metadata ?? {};

  // Parse items from metadata
  let items: Array<{
    pid: string;
    qty: number;
    sz: string;
    cl: string;
  }> = [];

  try {
    items = JSON.parse(meta.items || "[]");
  } catch {
    console.error("Failed to parse items metadata:", meta.items);
    return;
  }

  // Fetch product details for the order items
  const productIds = items.map((i) => i.pid);
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, sale_price, images")
    .in("id", productIds);

  const productMap = new Map((products ?? []).map((p) => [p.id, p]));

  // Calculate amounts
  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.pid);
    if (!product) return sum;
    const unitPrice = product.sale_price
      ? parseFloat(product.sale_price)
      : parseFloat(product.price);
    return sum + unitPrice * item.qty;
  }, 0);

  const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
  const shippingAmount = session.total_details?.amount_shipping
    ? session.total_details.amount_shipping / 100
    : 0;
  const tax = subtotal * 0.2; // 20% VAT
  const total = amountTotal;

  const orderNumber = generateOrderNumber();

  // Create order in Supabase
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: null, // Guest checkout
      shipping_address: {
        fullName: meta.fullName,
        phone: meta.phone,
        addressLine1: meta.addressLine1,
        addressLine2: meta.addressLine2 || null,
        city: meta.city,
        state: meta.state,
        pinCode: meta.pinCode,
        country: meta.country,
      },
      email: meta.email,
      subtotal,
      shipping_cost: shippingAmount,
      tax,
      discount: 0,
      total,
      promo_code: null,
      status: "confirmed",
      payment_status: "paid",
      payment_method: "stripe",
      stripe_payment_intent_id: session.payment_intent as string,
      tracking_number: null,
      estimated_delivery_date: null,
      notes: null,
    })
    .select("id")
    .single();

  if (orderError) {
    console.error("Failed to create order:", orderError);
    return;
  }

  // Create order items
  const orderItems = items.map((item) => {
    const product = productMap.get(item.pid);
    const unitPrice = product?.sale_price
      ? parseFloat(product.sale_price)
      : parseFloat(product?.price ?? "0");
    const images =
      typeof product?.images === "string"
        ? JSON.parse(product.images)
        : product?.images ?? [];

    return {
      order_id: order.id,
      product_id: item.pid,
      product_name: product?.name ?? "Unknown Product",
      product_slug: product?.slug ?? "",
      variant_id: null,
      variant_name:
        [item.sz && `Size: ${item.sz}`, item.cl && `Colour: ${item.cl}`]
          .filter(Boolean)
          .join(" | ") || null,
      quantity: item.qty,
      price: unitPrice,
      image_url: images[0]?.url ?? null,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Failed to create order items:", itemsError);
  }

  console.log(
    `Order ${orderNumber} created for ${meta.email} — £${total.toFixed(2)}`
  );
}
