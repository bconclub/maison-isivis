import { SITE_NAME, SITE_URL, CURRENCY_SYMBOL } from "@/lib/constants";
import type { OrderEmailData } from "@/lib/email";

function fmtPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
}

export function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const {
    customerName,
    orderNumber,
    items,
    subtotal,
    shipping,
    tax,
    total,
    shippingAddress: addr,
  } = data;

  const addressLines = [
    addr.fullName,
    addr.addressLine1,
    addr.addressLine2,
    `${addr.city}, ${addr.state} ${addr.pinCode}`,
    addr.country,
  ]
    .filter(Boolean)
    .join("<br>");

  const itemRowsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #E5E7EB;vertical-align:top;">
          ${
            item.imageUrl
              ? `<img src="${item.imageUrl}" alt="${item.productName}" width="64" height="80" style="display:block;border-radius:2px;object-fit:cover;" />`
              : `<div style="width:64px;height:80px;background:#F3F4F6;border-radius:2px;"></div>`
          }
        </td>
        <td style="padding:16px 0 16px 16px;border-bottom:1px solid #E5E7EB;vertical-align:top;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1F2937;">
            ${item.productName}
          </p>
          ${
            item.variantName
              ? `<p style="margin:4px 0 0;font-size:13px;color:#6B7280;">${item.variantName}</p>`
              : ""
          }
          <p style="margin:4px 0 0;font-size:13px;color:#6B7280;">Qty: ${item.quantity}</p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #E5E7EB;vertical-align:top;text-align:right;font-size:15px;color:#1F2937;">
          ${fmtPrice(item.unitPrice * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation - ${orderNumber}</title>
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Email Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0D0033 0%,#0033CC 50%,#0D0033 100%);padding:40px 32px;text-align:center;">
              <img src="${SITE_URL}/images/logo/Maison-ISIVIS.png" alt="${SITE_NAME}" width="160" style="display:inline-block;max-width:160px;height:auto;" />
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 32px 24px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;color:#0D0033;letter-spacing:-0.01em;">
                Thank You for Your Order
              </h1>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#4B5563;">
                Dear ${customerName},<br />
                Your order has been confirmed and is being prepared with care at our London atelier.
              </p>
            </td>
          </tr>

          <!-- Order number badge -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#F9FAFB;border-radius:4px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#6B7280;">
                      Order Number
                    </p>
                    <p style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#0D0033;letter-spacing:0.5px;">
                      ${orderNumber}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #E5E7EB;margin:0;" />
            </td>
          </tr>

          <!-- Items heading -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:normal;text-transform:uppercase;letter-spacing:2px;color:#0D0033;">
                Your Items
              </h2>
            </td>
          </tr>

          <!-- Items table -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${itemRowsHtml}
              </table>
            </td>
          </tr>

          <!-- Order summary -->
          <tr>
            <td style="padding:24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#4B5563;">
                <tr>
                  <td style="padding:6px 0;">Subtotal</td>
                  <td style="padding:6px 0;text-align:right;">${fmtPrice(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">VAT (20%)</td>
                  <td style="padding:6px 0;text-align:right;">${fmtPrice(tax)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">Shipping</td>
                  <td style="padding:6px 0;text-align:right;">${shipping === 0 ? "Free" : fmtPrice(shipping)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:8px 0 0;">
                    <hr style="border:none;border-top:1px solid #E5E7EB;margin:0;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#0D0033;">
                    Total
                  </td>
                  <td style="padding:12px 0 0;text-align:right;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#0D0033;">
                    ${fmtPrice(total)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #E5E7EB;margin:0;" />
            </td>
          </tr>

          <!-- Shipping address -->
          <tr>
            <td style="padding:24px 32px 32px;">
              <h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:normal;text-transform:uppercase;letter-spacing:2px;color:#0D0033;">
                Delivery Address
              </h2>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#4B5563;">
                ${addressLines}
              </p>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td style="padding:0 32px 40px;text-align:center;">
              <a href="${SITE_URL}/products" style="display:inline-block;background:linear-gradient(135deg,#0D0033 0%,#0033CC 50%,#0D0033 100%);color:#ffffff;text-decoration:none;font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:2px;padding:14px 32px;border-radius:4px;">
                Continue Shopping
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F9FAFB;padding:24px 32px;text-align:center;border-top:1px solid #E5E7EB;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                Need help? Contact us at
                <a href="mailto:connect@maisonisivis.com" style="color:#0033CC;text-decoration:none;">connect@maisonisivis.com</a>
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#9CA3AF;">
                &copy; ${new Date().getFullYear()} ${SITE_NAME}. Handcrafted in London.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
