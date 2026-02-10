import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_COLLECTIONS, MOCK_REVIEWS, MOCK_ORDERS, COLLECTION_PRODUCT_MAP } from "@/lib/mock-data";

/**
 * POST /api/admin/seed
 * Seeds the Supabase database with mock data.
 * Only runs if the categories table is empty (idempotent).
 */
export async function POST() {
  try {
    const supabase = createAdminClient();

    // Check if already seeded
    const { data: existingCats } = await supabase.from("categories").select("id").limit(1);
    if (existingCats && existingCats.length > 0) {
      return NextResponse.json({ message: "Database already seeded.", skipped: true });
    }

    // ── 1. Seed Categories ──
    const catRows = MOCK_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.imageUrl,
      parent_id: c.parentId,
      show_in_menu: c.showInMenu,
      display_order: c.displayOrder,
      meta_title: c.metaTitle,
      meta_description: c.metaDescription,
    }));

    const { error: catError } = await supabase.from("categories").insert(catRows);
    if (catError) {
      console.error("[Seed] Categories error:", catError);
      return NextResponse.json({ error: `Categories: ${catError.message}` }, { status: 500 });
    }

    // ── 2. Seed Collections ──
    const colRows = MOCK_COLLECTIONS.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      hero_image_url: c.heroImageUrl,
      hero_video_url: c.heroVideoUrl,
      collection_type: c.collectionType,
      featured: c.featured,
      display_order: c.displayOrder,
      meta_title: c.metaTitle,
      meta_description: c.metaDescription,
    }));

    const { error: colError } = await supabase.from("collections").insert(colRows);
    if (colError) {
      console.error("[Seed] Collections error:", colError);
      return NextResponse.json({ error: `Collections: ${colError.message}` }, { status: 500 });
    }

    // ── 3. Seed Products ──
    const prodRows = MOCK_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      short_description: p.shortDescription,
      description: p.description,
      price: p.price,
      sale_price: p.salePrice,
      compare_at_price: p.compareAtPrice,
      in_stock: p.inStock,
      stock_quantity: p.stockQuantity,
      low_stock_threshold: p.lowStockThreshold,
      allow_backorder: p.allowBackorder,
      images: JSON.stringify(p.images),
      video_url: p.videoUrl,
      category_id: p.categoryId,
      has_variants: p.hasVariants,
      variants: JSON.stringify(p.variants),
      fabric: p.fabric,
      care_instructions: p.careInstructions,
      measurements: p.measurements ? JSON.stringify(p.measurements) : null,
      featured: p.featured,
      new_arrival: p.newArrival,
      bestseller: p.bestseller,
      badge: p.badge,
      meta_title: p.metaTitle,
      meta_description: p.metaDescription,
      keywords: p.keywords,
      display_order: p.displayOrder,
      published: p.published,
    }));

    const { error: prodError } = await supabase.from("products").insert(prodRows);
    if (prodError) {
      console.error("[Seed] Products error:", prodError);
      return NextResponse.json({ error: `Products: ${prodError.message}` }, { status: 500 });
    }

    // ── 4. Seed Product-Collection relationships ──
    const pcRows: { product_id: string; collection_id: string }[] = [];
    for (const [collectionSlug, productIds] of Object.entries(COLLECTION_PRODUCT_MAP)) {
      const collection = MOCK_COLLECTIONS.find((c) => c.slug === collectionSlug);
      if (!collection) continue;
      for (const productId of productIds) {
        pcRows.push({ product_id: productId, collection_id: collection.id });
      }
    }

    if (pcRows.length > 0) {
      const { error: pcError } = await supabase.from("product_collections").insert(pcRows);
      if (pcError) {
        console.error("[Seed] Product-Collections error:", pcError);
        // Non-fatal — continue
      }
    }

    // ── 5. Seed Reviews ──
    const reviewRows = MOCK_REVIEWS.map((r) => ({
      id: r.id,
      user_id: r.userId,
      product_id: r.productId,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      verified: r.verified,
      featured: r.featured,
      approved: r.approved,
    }));

    // Reviews need user_id which references auth.users — skip for now
    // We'll seed reviews later when auth is set up
    void reviewRows;

    return NextResponse.json({
      message: "Database seeded successfully!",
      counts: {
        categories: catRows.length,
        collections: colRows.length,
        products: prodRows.length,
        productCollections: pcRows.length,
      },
    });
  } catch (err) {
    console.error("[Seed]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed failed" },
      { status: 500 }
    );
  }
}
