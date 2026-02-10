import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, ProductImage, ProductVariant } from "@/types/product";

// ─── Helpers: convert between camelCase (app) and snake_case (DB) ───

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function productToDb(p: Partial<Product>): Record<string, any> {
  const row: Record<string, unknown> = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.sku !== undefined) row.sku = p.sku;
  if (p.shortDescription !== undefined) row.short_description = p.shortDescription;
  if (p.description !== undefined) row.description = p.description;
  if (p.price !== undefined) row.price = p.price;
  if (p.salePrice !== undefined) row.sale_price = p.salePrice;
  if (p.compareAtPrice !== undefined) row.compare_at_price = p.compareAtPrice;
  if (p.inStock !== undefined) row.in_stock = p.inStock;
  if (p.stockQuantity !== undefined) row.stock_quantity = p.stockQuantity;
  if (p.lowStockThreshold !== undefined) row.low_stock_threshold = p.lowStockThreshold;
  if (p.allowBackorder !== undefined) row.allow_backorder = p.allowBackorder;
  if (p.images !== undefined) row.images = JSON.stringify(p.images);
  if (p.videoUrl !== undefined) row.video_url = p.videoUrl;
  if (p.categoryId !== undefined) row.category_id = p.categoryId;
  if (p.hasVariants !== undefined) row.has_variants = p.hasVariants;
  if (p.variants !== undefined) row.variants = JSON.stringify(p.variants);
  if (p.fabric !== undefined) row.fabric = p.fabric;
  if (p.careInstructions !== undefined) row.care_instructions = p.careInstructions;
  if (p.measurements !== undefined) row.measurements = p.measurements ? JSON.stringify(p.measurements) : null;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.newArrival !== undefined) row.new_arrival = p.newArrival;
  if (p.bestseller !== undefined) row.bestseller = p.bestseller;
  if (p.badge !== undefined) row.badge = p.badge;
  if (p.metaTitle !== undefined) row.meta_title = p.metaTitle;
  if (p.metaDescription !== undefined) row.meta_description = p.metaDescription;
  if (p.keywords !== undefined) row.keywords = p.keywords;
  if (p.displayOrder !== undefined) row.display_order = p.displayOrder;
  if (p.published !== undefined) row.published = p.published;
  return row;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    shortDescription: row.short_description,
    description: row.description,
    price: parseFloat(row.price),
    salePrice: row.sale_price ? parseFloat(row.sale_price) : null,
    compareAtPrice: row.compare_at_price ? parseFloat(row.compare_at_price) : null,
    inStock: row.in_stock,
    stockQuantity: row.stock_quantity,
    lowStockThreshold: row.low_stock_threshold,
    allowBackorder: row.allow_backorder,
    images: (typeof row.images === "string" ? JSON.parse(row.images) : row.images ?? []) as ProductImage[],
    videoUrl: row.video_url,
    categoryId: row.category_id,
    hasVariants: row.has_variants,
    variants: (typeof row.variants === "string" ? JSON.parse(row.variants) : row.variants ?? []) as ProductVariant[],
    fabric: row.fabric,
    careInstructions: row.care_instructions,
    measurements: row.measurements ? (typeof row.measurements === "string" ? JSON.parse(row.measurements) : row.measurements) : null,
    featured: row.featured,
    newArrival: row.new_arrival,
    bestseller: row.bestseller,
    badge: row.badge,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: row.keywords,
    displayOrder: row.display_order,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── GET: Fetch all products ────────────────────────────────
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const products = (data ?? []).map(dbToProduct);
    return NextResponse.json({ products });
  } catch (err) {
    console.error("[Admin Products GET]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ─── POST: Create a new product ─────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const dbData = productToDb(body);

    const { data, error } = await supabase
      .from("products")
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error("[Admin Products POST]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: dbToProduct(data) }, { status: 201 });
  } catch (err) {
    console.error("[Admin Products POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
