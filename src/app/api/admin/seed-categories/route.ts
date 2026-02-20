import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/seed-categories
 * Seeds the Supabase categories table with the 12 product categories + 1 sub-category.
 * Skips any category whose slug already exists (idempotent).
 */
export async function POST() {
  try {
    const supabase = createAdminClient();

    // Check if categories already exist
    const { data: existing } = await supabase
      .from("categories")
      .select("slug");

    const existingSlugs = new Set((existing ?? []).map((c) => c.slug));

    // ── Parent categories ──
    const parentCategories = [
      {
        name: "Corsets",
        slug: "corsets",
        description: "Sculpted silhouettes that empower. Handcrafted corsets with boning, busk closures, and luxurious fabrics.",
        show_in_menu: true,
        display_order: 1,
        meta_title: "Luxury Corsets | Maison ISIVIS",
        meta_description: "Handcrafted luxury corsets from our London atelier. Sculpted silhouettes for the modern woman.",
      },
      {
        name: "Dresses",
        slug: "dresses",
        description: "Elegance in every stitch. From midi to maxi, discover handcrafted dresses that turn heads.",
        show_in_menu: true,
        display_order: 2,
        meta_title: "Luxury Dresses | Maison ISIVIS",
        meta_description: "Handcrafted luxury dresses from our London atelier.",
      },
      {
        name: "Tops",
        slug: "tops",
        description: "Statement pieces crafted from the finest fabrics. Blouses, bodysuits, and beyond.",
        show_in_menu: true,
        display_order: 3,
        meta_title: "Luxury Tops | Maison ISIVIS",
        meta_description: "Premium tops and blouses handcrafted in London.",
      },
      {
        name: "Bottoms",
        slug: "bottoms",
        description: "Tailored trousers, flowing skirts, and everything in between.",
        show_in_menu: true,
        display_order: 4,
        meta_title: "Luxury Bottoms | Maison ISIVIS",
        meta_description: "Premium skirts and trousers from Maison ISIVIS.",
      },
      {
        name: "Jumpsuits",
        slug: "jumpsuits",
        description: "One-piece wonders. Effortlessly chic jumpsuits and playsuits for every occasion.",
        show_in_menu: true,
        display_order: 5,
        meta_title: "Luxury Jumpsuits | Maison ISIVIS",
        meta_description: "Designer jumpsuits handcrafted in our London atelier.",
      },
      {
        name: "Co-ords",
        slug: "co-ords",
        description: "Matching sets to slay. Perfectly paired luxury co-ord sets.",
        show_in_menu: true,
        display_order: 6,
        meta_title: "Luxury Co-ords | Maison ISIVIS",
        meta_description: "Luxury matching sets from Maison ISIVIS.",
      },
      {
        name: "Outerwear",
        slug: "outerwear",
        description: "Capes, blazers, and coats that command attention.",
        show_in_menu: true,
        display_order: 7,
        meta_title: "Luxury Outerwear | Maison ISIVIS",
        meta_description: "Premium outerwear handcrafted in our London atelier.",
      },
      {
        name: "Lounge and Intimates",
        slug: "lounge-and-intimates",
        description: "Luxurious loungewear and intimates for your most indulgent moments.",
        show_in_menu: true,
        display_order: 8,
        meta_title: "Luxury Loungewear & Intimates | Maison ISIVIS",
        meta_description: "Premium loungewear and intimates from Maison ISIVIS.",
      },
      {
        name: "Swimwear",
        slug: "swimwear",
        description: "Resort-ready luxury. Swimsuits and cover-ups for the discerning woman.",
        show_in_menu: true,
        display_order: 9,
        meta_title: "Luxury Swimwear | Maison ISIVIS",
        meta_description: "Designer swimwear from Maison ISIVIS.",
      },
      {
        name: "Active Wear",
        slug: "active-wear",
        description: "Performance meets luxury. Activewear that moves with you in style.",
        show_in_menu: true,
        display_order: 10,
        meta_title: "Luxury Active Wear | Maison ISIVIS",
        meta_description: "Premium activewear from Maison ISIVIS.",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "The finishing touches. Belts, scarves, and statement pieces.",
        show_in_menu: true,
        display_order: 11,
        meta_title: "Luxury Accessories | Maison ISIVIS",
        meta_description: "Luxury accessories from Maison ISIVIS.",
      },
      {
        name: "Gift Cards",
        slug: "gift-cards",
        description: "The perfect gift. Let them choose their own luxury from Maison ISIVIS.",
        show_in_menu: true,
        display_order: 12,
        meta_title: "Gift Cards | Maison ISIVIS",
        meta_description: "Maison ISIVIS gift cards. The perfect luxury gift.",
      },
    ];

    // Filter out categories that already exist
    const toInsert = parentCategories.filter((c) => !existingSlugs.has(c.slug));

    let insertedCount = 0;

    if (toInsert.length > 0) {
      const { error } = await supabase.from("categories").insert(toInsert);
      if (error) {
        console.error("[Seed Categories]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      insertedCount = toInsert.length;
    }

    // ── Now insert "Jewellery" sub-category under Accessories ──
    if (!existingSlugs.has("jewellery")) {
      // Get the real UUID for Accessories
      const { data: accessoriesCat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", "accessories")
        .single();

      if (accessoriesCat) {
        const { error: subError } = await supabase.from("categories").insert({
          name: "Jewellery",
          slug: "jewellery",
          description: "Handcrafted luxury jewellery to complement your look.",
          parent_id: accessoriesCat.id,
          show_in_menu: true,
          display_order: 1,
          meta_title: "Luxury Jewellery | Maison ISIVIS",
          meta_description: "Handcrafted luxury jewellery from Maison ISIVIS.",
        });

        if (subError) {
          console.error("[Seed Categories] Jewellery sub-category error:", subError);
        } else {
          insertedCount += 1;
        }
      }
    }

    // Fetch all categories to return
    const { data: allCats } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    return NextResponse.json({
      message: insertedCount > 0
        ? `Seeded ${insertedCount} categories successfully!`
        : "All categories already exist.",
      inserted: insertedCount,
      skipped: parentCategories.length + 1 - insertedCount,
      categories: allCats ?? [],
    });
  } catch (err) {
    console.error("[Seed Categories]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed failed" },
      { status: 500 }
    );
  }
}
