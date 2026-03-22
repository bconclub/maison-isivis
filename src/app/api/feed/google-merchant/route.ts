import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SITE_URL,
  SITE_NAME,
  CURRENCY,
  STANDARD_SHIPPING_COST,
  INTERNATIONAL_SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";

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

interface ProductVariant {
  variantId: string;
  size?: string;
  color?: string;
  stock: number;
  price: number;
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

// All countries from the shipping policy + major Google Merchant target countries
const SHIPPING_COUNTRIES = [
  "GB", "US", "DE", "CA", "AU", "IE", "FR", "IT", "ES", "NL",
  "RO", "AE", "HK", "TW",
];

function buildShippingEntries(productPrice: number): string {
  const freeShipping = productPrice >= FREE_SHIPPING_THRESHOLD;

  return SHIPPING_COUNTRIES.map((country) => {
    const isUK = country === "GB";
    const service = isUK ? "Standard Shipping" : "International Shipping";
    const cost = isUK ? STANDARD_SHIPPING_COST : INTERNATIONAL_SHIPPING_COST;
    const price = freeShipping ? 0 : cost;

    return `      <g:shipping>
        <g:country>${country}</g:country>
        <g:service>${service}</g:service>
        <g:price>${formatPrice(price)}</g:price>
      </g:shipping>`;
  }).join("\n");
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all published products with variant data
    const { data: products, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, sku, short_description, description, price, sale_price, in_stock, images, category_id, fabric, published, hidden_from_listings, has_variants, variants"
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

    // Build XML items — expand variants into separate items
    const items: string[] = [];

    for (const p of (products ?? []).filter((p) => !p.hidden_from_listings)) {
      const images: ProductImage[] =
        typeof p.images === "string" ? JSON.parse(p.images) : p.images ?? [];

      const mainImage = images[0]?.url ? resolveImageUrl(images[0].url) : "";
      const additionalImages = images
        .slice(1, 10)
        .filter((img) => img.url)
        .map(
          (img) =>
            `      <g:additional_image_link>${escapeXml(resolveImageUrl(img.url))}</g:additional_image_link>`
        )
        .join("\n");

      const regularPrice = parseFloat(p.price);
      const salePrice = p.sale_price ? parseFloat(p.sale_price) : null;
      const categoryName = p.category_id
        ? categoryMap.get(p.category_id as string) ?? ""
        : "";

      const description = p.short_description || p.description || p.name;
      const cleanDescription = description
        .replace(/<[^>]*>/g, "")
        .slice(0, 5000);

      // Shared fields for this product (used by both variant and non-variant items)
      const sharedFields = `      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(cleanDescription)}</g:description>
      <g:link>${SITE_URL}/products/${escapeXml(p.slug)}</g:link>
${mainImage ? `      <g:image_link>${escapeXml(mainImage)}</g:image_link>` : ""}
${additionalImages}
      <g:price>${formatPrice(regularPrice)}</g:price>
${salePrice && salePrice < regularPrice ? `      <g:sale_price>${formatPrice(salePrice)}</g:sale_price>` : ""}
      <g:brand>${escapeXml(SITE_NAME)}</g:brand>
      <g:condition>new</g:condition>
${p.sku ? `      <g:mpn>${escapeXml(p.sku)}</g:mpn>` : ""}
${categoryName ? `      <g:product_type>${escapeXml(categoryName)}</g:product_type>` : ""}
${p.fabric ? `      <g:material>${escapeXml(p.fabric)}</g:material>` : ""}
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing</g:google_product_category>
      <g:gender>female</g:gender>
      <g:age_group>adult</g:age_group>
      <g:adult>no</g:adult>
${buildShippingEntries(regularPrice)}`;

      // Parse variants
      const variants: ProductVariant[] = p.has_variants
        ? typeof p.variants === "string"
          ? JSON.parse(p.variants)
          : p.variants ?? []
        : [];

      if (variants.length > 0) {
        // Expand each variant into its own feed item
        for (const v of variants) {
          const variantAvailability =
            v.stock > 0 ? "in_stock" : "out_of_stock";

          items.push(`    <item>
      <g:id>${escapeXml(p.slug)}_${escapeXml(v.size || v.variantId).substring(0, 20)}</g:id>
      <g:item_group_id>${escapeXml(p.slug)}</g:item_group_id>
${sharedFields}
      <g:availability>${variantAvailability}</g:availability>
      <g:size>${escapeXml(v.size || "One Size")}</g:size>
      <g:color>${escapeXml(v.color || "Multicolor")}</g:color>
    </item>`);
        }
      } else {
        // Non-variant product — single item
        items.push(`    <item>
      <g:id>${escapeXml(p.slug)}</g:id>
${sharedFields}
      <g:availability>${p.in_stock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:size>One Size</g:size>
      <g:color>Multicolor</g:color>
    </item>`);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} - Product Feed</title>
    <link>${SITE_URL}</link>
    <description>Product feed for Google Merchant Center</description>
${items.join("\n")}
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
