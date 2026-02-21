import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateProductInSheet, deleteProductFromSheet } from "@/lib/google-sheets";
import type { Product, ProductImage, ProductVariant } from "@/types/product";

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
    categoryIds: [],
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
    categories: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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

// UUID v4 regex for validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── PUT: Update a product ──────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const body = await request.json();

    // Extract categoryIds from body, sanitize
    const categoryIds: string[] = (body.categoryIds ?? []).filter(
      (cid: string) => UUID_RE.test(cid)
    );
    body.categoryId = categoryIds[0] ?? null;
    delete body.categoryIds;

    const dbData = productToDb(body);

    const { data, error } = await supabase
      .from("products")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[Admin Products PUT]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Replace junction table rows (delete old, insert new)
    await supabase.from("product_categories").delete().eq("product_id", id);
    if (categoryIds.length > 0) {
      await supabase.from("product_categories").insert(
        categoryIds.map((catId) => ({
          product_id: id,
          category_id: catId,
        }))
      );
    }

    const product = dbToProduct(data);
    product.categoryIds = categoryIds;

    // Look up category names for sheet sync
    let categoryName = "";
    if (categoryIds.length > 0) {
      const { data: cats } = await supabase
        .from("categories")
        .select("name")
        .in("id", categoryIds);
      categoryName = (cats ?? []).map((c) => c.name).join(", ");
    }

    // Sync to Google Sheets in background
    const siteUrl = "https://isivis.vercel.app";
    const variants = product.variants ?? [];
    const images = product.images ?? [];
    updateProductInSheet(product.name, {
      name: product.name,
      link: `${siteUrl}/products/${product.slug}`,
      sku: product.sku,
      variations: [...new Set(variants.map((v) => v.size).filter(Boolean))].join(", "),
      colours: [...new Set(variants.map((v) => v.color).filter(Boolean))].join(", "),
      photos: images[0]?.url ?? "",
      live: product.published,
      category: categoryName,
    }).catch(() => {});

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[Admin Products PUT]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Delete a product ───────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch product name before deleting (for sheet sync)
    const { data: existing } = await supabase
      .from("products")
      .select("name")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Admin Products DELETE]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Sync delete to Google Sheets in background
    if (existing?.name) {
      deleteProductFromSheet(existing.name).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Products DELETE]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
