import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validations";
import {
  SITE_URL,
  TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  CURRENCY,
} from "@/lib/constants";

interface CartItemPayload {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shipping, items } = body as {
      shipping: Record<string, string>;
      items: CartItemPayload[];
    };

    // Validate shipping info
    const parsed = checkoutSchema.safeParse(shipping);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid shipping information", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Re-fetch product prices from DB (never trust client prices)
    const supabase = createAdminClient();
    const productIds = items.map((i) => i.productId);

    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("id, name, slug, price, sale_price, images, in_stock, shipping_enabled, vat_enabled")
      .in("id", productIds);

    if (dbError || !products) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 }
      );
    }

    // Build a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Verify all products exist and are in stock
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (!product.in_stock) {
        return NextResponse.json(
          { error: `${product.name} is out of stock` },
          { status: 400 }
        );
      }
    }

    // Calculate prices server-side
    const lineItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.sale_price
        ? parseFloat(product.sale_price)
        : parseFloat(product.price);
      const images = typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images ?? [];
      const imageUrl = images[0]?.url ? images[0].url : undefined;

      // Build variant description
      const variantParts: string[] = [];
      if (item.selectedSize) variantParts.push(`Size: ${item.selectedSize}`);
      if (item.selectedColor) variantParts.push(`Colour: ${item.selectedColor}`);
      const description = variantParts.length > 0 ? variantParts.join(" | ") : undefined;

      return {
        price_data: {
          currency: CURRENCY.toLowerCase(),
          product_data: {
            name: product.name,
            ...(description && { description }),
            ...(imageUrl && { images: [imageUrl] }),
          },
          unit_amount: Math.round(unitPrice * 100), // Stripe uses pence
        },
        quantity: item.quantity,
      };
    });

    // Calculate subtotal and per-product shipping/VAT eligibility
    const subtotal = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.sale_price
        ? parseFloat(product.sale_price)
        : parseFloat(product.price);
      return sum + unitPrice * item.quantity;
    }, 0);

    // Only charge VAT on items that have VAT enabled
    const vatSubtotal = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      if (product.vat_enabled === false) return sum;
      const unitPrice = product.sale_price
        ? parseFloat(product.sale_price)
        : parseFloat(product.price);
      return sum + unitPrice * item.quantity;
    }, 0);

    // Check if any item in the cart requires shipping
    const hasShippableItems = items.some((item) => {
      const product = productMap.get(item.productId)!;
      return product.shipping_enabled !== false;
    });

    const shippingCost =
      !hasShippableItems ? 0 :
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

    // Check if user is logged in (optional — guest checkout still works)
    let userId = "";
    try {
      const supabaseAuth = await createClient();
      const { data: { user } } = await supabaseAuth.auth.getUser();
      userId = user?.id ?? "";
    } catch {
      // Guest checkout — no user
    }

    // Prepare metadata (Stripe limits: 500 chars per value, 50 keys)
    const shippingData = parsed.data;
    const orderMeta = {
      userId,
      email: shippingData.email,
      fullName: shippingData.fullName,
      phone: shippingData.phone,
      addressLine1: shippingData.addressLine1,
      addressLine2: shippingData.addressLine2 ?? "",
      city: shippingData.city,
      state: shippingData.state,
      pinCode: shippingData.pinCode,
      country: shippingData.country,
      items: JSON.stringify(
        items.map((i) => ({
          pid: i.productId,
          qty: i.quantity,
          sz: i.selectedSize ?? "",
          cl: i.selectedColor ?? "",
        }))
      ),
    };

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: shippingData.email,
      line_items: lineItems,
      // Tax as automatic via Stripe Tax, or add manually
      ...(TAX_RATE > 0 && {
        line_items: [
          ...lineItems,
          {
            price_data: {
              currency: CURRENCY.toLowerCase(),
              product_data: { name: "VAT (20%)" },
              unit_amount: Math.round(vatSubtotal * TAX_RATE * 100),
            },
            quantity: 1,
          },
        ],
      }),
      // Add shipping as a line item if applicable
      ...(shippingCost > 0 && {
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount" as const,
              fixed_amount: {
                amount: Math.round(shippingCost * 100),
                currency: CURRENCY.toLowerCase(),
              },
              display_name: "Standard Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day" as const, value: 3 },
                maximum: { unit: "business_day" as const, value: 7 },
              },
            },
          },
        ],
      }),
      ...(shippingCost === 0 && {
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount" as const,
              fixed_amount: {
                amount: 0,
                currency: CURRENCY.toLowerCase(),
              },
              display_name: "Free Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day" as const, value: 3 },
                maximum: { unit: "business_day" as const, value: 7 },
              },
            },
          },
        ],
      }),
      metadata: orderMeta,
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
