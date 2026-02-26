import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL, SITE_NAME, CURRENCY } from "@/lib/constants";

/**
 * Google Merchant Center Product Feed (RSS 2.0 / Google Shopping XML)
 *
 * URL: /api/feed/google-merchant
 * Add this URL in Google Merchant Center → Products → Feeds → Add feed
 */

// Revalidate every 6 hours
export const revalidate = 21600;

interface ProductImage {
  url: string;
  alt?: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} ${CURRENCY}`;
}

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all published products with category info
    const { data: products, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, sku, short_description, description, price, sale_price, in_stock, images, category_id, fabric, published, hidden_from_listings"
      )
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Feed] DB error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Fetch categories for mapping
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name");

    const categoryMap = new Map(
      (categories ?? []).map((c: { id: string; name: string }) => [c.id, c.name])
    );

    // Build XML items
    const itemsXml = (products ?? [])
      .filter((p) => !p.hidden_from_listings)
      .map((p) => {
        const images: ProductImage[] =
          typeof p.images === "string"
            ? JSON.parse(p.images)
            : p.images ?? [];

        const mainImage = images[0]?.url
          ? resolveImageUrl(images[0].url)
          : "";
        const additionalImages = images
          .slice(1, 10) // Google allows up to 10 additional images
          .filter((img) => img.url)
          .map(
            (img) =>
              `      <g:additional_image_link>${escapeXml(resolveImageUrl(img.url))}</g:additional_image_link>`
          )
          .join("\n");

        const salePrice = p.sale_price ? parseFloat(p.sale_price) : null;
        const price = parseFloat(p.price);
        const categoryName = p.category_id
          ? categoryMap.get(p.category_id) ?? ""
          : "";

        const description = p.short_description || p.description || p.name;
        // Strip HTML tags from description
        const cleanDescription = description.replace(/<[^>]*>/g, "").slice(0, 5000);

        return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(cleanDescription)}</g:description>
      <g:link>${SITE_URL}/products/${escapeXml(p.slug)}</g:link>
${mainImage ? `      <g:image_link>${escapeXml(mainImage)}</g:image_link>` : ""}
${additionalImages}
      <g:availability>${p.in_stock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${formatPrice(salePrice ?? price)}</g:price>
${salePrice && salePrice < price ? `      <g:sale_price>${formatPrice(salePrice)}</g:sale_price>` : ""}
      <g:brand>${escapeXml(SITE_NAME)}</g:brand>
      <g:condition>new</g:condition>
${p.sku ? `      <g:mpn>${escapeXml(p.sku)}</g:mpn>` : ""}
${categoryName ? `      <g:product_type>${escapeXml(categoryName)}</g:product_type>` : ""}
${p.fabric ? `      <g:material>${escapeXml(p.fabric)}</g:material>` : ""}
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} - Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Product feed for Google Merchant Center</description>
${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=21600, s-maxage=21600",
      },
    });
  } catch (err) {
    console.error("[Feed] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate feed" },
      { status: 500 }
    );
  }
}
