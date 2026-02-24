import { Resend } from "resend";
import { SITE_NAME } from "@/lib/constants";
import { buildOrderConfirmationHtml } from "@/lib/email-templates/order-confirmation";

// ─── Resend client singleton (mirrors src/lib/stripe.ts pattern) ───

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Missing RESEND_API_KEY env var");
    resendInstance = new Resend(key);
  }
  return resendInstance;
}

// ─── Types ─────────────────────────────────────────────────────────

export interface OrderEmailItem {
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  imageUrl: string | null;
}

export interface OrderEmailData {
  to: string;
  customerName: string;
  orderNumber: string;
  items: OrderEmailItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
}

// ─── Public API ────────────────────────────────────────────────────

const FROM_ADDRESS = `${SITE_NAME} <orders@maisonisivis.com>`;

/**
 * Send an order confirmation email. Fire-and-forget safe:
 * catches all errors internally — never throws, never blocks.
 */
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<void> {
  try {
    const resend = getResend();
    const html = buildOrderConfirmationHtml(data);

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: data.to,
      subject: `Order Confirmed — ${data.orderNumber}`,
      html,
    });

    if (error) {
      console.error("[email] Resend API error:", error);
    } else {
      console.log(
        `[email] Confirmation sent for ${data.orderNumber} → ${data.to}`
      );
    }
  } catch (err) {
    // Log but never throw — email must not break the webhook
    console.error("[email] Failed to send order confirmation:", err);
  }
}
