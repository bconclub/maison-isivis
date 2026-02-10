import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import buildInfo from "../../../../../build.json";

interface TableCount {
  table: string;
  count: number;
}

export async function GET() {
  const start = Date.now();

  // ── Database connection check ──
  let dbStatus: "connected" | "error" = "error";
  let dbLatencyMs = 0;
  let dbError: string | null = null;
  let tableCounts: TableCount[] = [];

  try {
    const supabase = createAdminClient();
    const dbStart = Date.now();

    // Quick connectivity check
    const { error: pingError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    dbLatencyMs = Date.now() - dbStart;

    if (pingError) {
      dbError = pingError.message;
    } else {
      dbStatus = "connected";
    }

    // Count rows in key tables
    if (dbStatus === "connected") {
      const tables = [
        "products",
        "categories",
        "collections",
        "orders",
        "order_items",
        "reviews",
        "profiles",
        "addresses",
        "wishlist_items",
        "promo_codes",
        "newsletter_subscribers",
        "site_settings",
      ];

      const counts = await Promise.all(
        tables.map(async (table) => {
          const { count } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true });
          return { table, count: count ?? 0 };
        })
      );
      tableCounts = counts;
    }
  } catch (err) {
    dbError =
      err instanceof Error ? err.message : "Unknown database error";
  }

  // ── Environment info ──
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    NODE_ENV: process.env.NODE_ENV ?? "unknown",
  };

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - start,

    build: {
      number: buildInfo.buildNumber,
      version: buildInfo.version,
      lastCommit: buildInfo.lastCommit,
      lastBuildDate: buildInfo.lastBuildDate,
    },

    runtime: {
      framework: "Next.js 16.1.6",
      react: "19.2.3",
      node: process.version,
      platform: process.platform,
    },

    database: {
      status: dbStatus,
      provider: "Supabase (PostgreSQL)",
      latencyMs: dbLatencyMs,
      error: dbError,
      tables: tableCounts,
    },

    environment: envVars,
  });
}
