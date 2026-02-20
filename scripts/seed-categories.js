const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://kgxxtmausmxlbvkitnls.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtneHh0bWF1c214bGJ2a2l0bmxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYzNDEzNSwiZXhwIjoyMDg2MjEwMTM1fQ.IglGZj8_k_d_yBsLnyzGXppRe6RTRQY3ji4H_w4ajC0",
  { auth: { persistSession: false } }
);

async function seed() {
  // First check what exists
  const { data: existing, error: checkErr } = await supabase
    .from("categories")
    .select("slug, id");

  if (checkErr) {
    console.error("Check error:", checkErr);
    return;
  }

  console.log("Existing categories:", existing?.length ?? 0);
  if (existing) existing.forEach((c) => console.log("  -", c.slug, c.id));

  const existingSlugs = new Set((existing ?? []).map((c) => c.slug));

  const categories = [
    { name: "Corsets", slug: "corsets", description: "Sculpted silhouettes that empower. Handcrafted corsets with boning, busk closures, and luxurious fabrics.", show_in_menu: true, display_order: 1, meta_title: "Luxury Corsets | Maison ISIVIS", meta_description: "Handcrafted luxury corsets from our London atelier." },
    { name: "Dresses", slug: "dresses", description: "Elegance in every stitch. From midi to maxi, discover handcrafted dresses that turn heads.", show_in_menu: true, display_order: 2, meta_title: "Luxury Dresses | Maison ISIVIS", meta_description: "Handcrafted luxury dresses from our London atelier." },
    { name: "Tops", slug: "tops", description: "Statement pieces crafted from the finest fabrics. Blouses, bodysuits, and beyond.", show_in_menu: true, display_order: 3, meta_title: "Luxury Tops | Maison ISIVIS", meta_description: "Premium tops and blouses handcrafted in London." },
    { name: "Bottoms", slug: "bottoms", description: "Tailored trousers, flowing skirts, and everything in between.", show_in_menu: true, display_order: 4, meta_title: "Luxury Bottoms | Maison ISIVIS", meta_description: "Premium skirts and trousers from Maison ISIVIS." },
    { name: "Jumpsuits", slug: "jumpsuits", description: "One-piece wonders. Effortlessly chic jumpsuits and playsuits for every occasion.", show_in_menu: true, display_order: 5, meta_title: "Luxury Jumpsuits | Maison ISIVIS", meta_description: "Designer jumpsuits handcrafted in our London atelier." },
    { name: "Co-ords", slug: "co-ords", description: "Matching sets to slay. Perfectly paired luxury co-ord sets.", show_in_menu: true, display_order: 6, meta_title: "Luxury Co-ords | Maison ISIVIS", meta_description: "Luxury matching sets from Maison ISIVIS." },
    { name: "Outerwear", slug: "outerwear", description: "Capes, blazers, and coats that command attention.", show_in_menu: true, display_order: 7, meta_title: "Luxury Outerwear | Maison ISIVIS", meta_description: "Premium outerwear handcrafted in our London atelier." },
    { name: "Lounge and Intimates", slug: "lounge-and-intimates", description: "Luxurious loungewear and intimates for your most indulgent moments.", show_in_menu: true, display_order: 8, meta_title: "Luxury Loungewear & Intimates | Maison ISIVIS", meta_description: "Premium loungewear and intimates from Maison ISIVIS." },
    { name: "Swimwear", slug: "swimwear", description: "Resort-ready luxury. Swimsuits and cover-ups for the discerning woman.", show_in_menu: true, display_order: 9, meta_title: "Luxury Swimwear | Maison ISIVIS", meta_description: "Designer swimwear from Maison ISIVIS." },
    { name: "Active Wear", slug: "active-wear", description: "Performance meets luxury. Activewear that moves with you in style.", show_in_menu: true, display_order: 10, meta_title: "Luxury Active Wear | Maison ISIVIS", meta_description: "Premium activewear from Maison ISIVIS." },
    { name: "Accessories", slug: "accessories", description: "The finishing touches. Belts, scarves, and statement pieces.", show_in_menu: true, display_order: 11, meta_title: "Luxury Accessories | Maison ISIVIS", meta_description: "Luxury accessories from Maison ISIVIS." },
    { name: "Gift Cards", slug: "gift-cards", description: "The perfect gift. Let them choose their own luxury from Maison ISIVIS.", show_in_menu: true, display_order: 12, meta_title: "Gift Cards | Maison ISIVIS", meta_description: "Maison ISIVIS gift cards. The perfect luxury gift." },
  ];

  const toInsert = categories.filter((c) => !existingSlugs.has(c.slug));
  console.log("\nTo insert:", toInsert.length, "categories");

  if (toInsert.length > 0) {
    const { data, error } = await supabase.from("categories").insert(toInsert).select();
    if (error) {
      console.error("Insert error:", error);
      return;
    }
    console.log("Inserted", data.length, "categories:");
    data.forEach((c) => console.log("  -", c.name, c.id));
  } else {
    console.log("All parent categories already exist.");
  }

  // Now add Jewellery sub-category under Accessories
  if (!existingSlugs.has("jewellery")) {
    const { data: acc } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "accessories")
      .single();

    if (acc) {
      const { data: jewel, error: jErr } = await supabase
        .from("categories")
        .insert({
          name: "Jewellery",
          slug: "jewellery",
          description: "Handcrafted luxury jewellery to complement your look.",
          parent_id: acc.id,
          show_in_menu: true,
          display_order: 1,
          meta_title: "Luxury Jewellery | Maison ISIVIS",
          meta_description: "Handcrafted luxury jewellery from Maison ISIVIS.",
        })
        .select()
        .single();

      if (jErr) {
        console.error("Jewellery error:", jErr);
      } else {
        console.log("  - Jewellery (sub-category of Accessories)", jewel.id);
      }
    }
  }

  // Final check
  const { data: all } = await supabase
    .from("categories")
    .select("name, id, slug, parent_id, display_order")
    .order("display_order");

  console.log("\n=== All categories in Supabase ===");
  all.forEach((c) =>
    console.log(c.parent_id ? "  └─" : "─", c.name, `(${c.id})`)
  );
  console.log("\nTotal:", all.length, "categories");
}

seed().catch(console.error);
