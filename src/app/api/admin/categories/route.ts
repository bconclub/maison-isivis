import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Category } from "@/types/product";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_url,
    parentId: row.parent_id,
    showInMenu: row.show_in_menu,
    displayOrder: row.display_order,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const categories = (data ?? []).map(dbToCategory);
    return NextResponse.json({ categories });
  } catch (err) {
    console.error("[Admin Categories GET]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
