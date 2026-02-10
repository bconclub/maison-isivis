"use client";

import { useEffect, useState, useCallback } from "react";

interface TableCount {
  table: string;
  count: number;
}

interface StatusData {
  status: "healthy" | "degraded";
  timestamp: string;
  responseTimeMs: number;
  build: {
    number: number;
    version: string;
    lastCommit: string;
    lastBuildDate: string;
  };
  runtime: {
    framework: string;
    react: string;
    node: string;
    platform: string;
  };
  database: {
    status: "connected" | "error";
    provider: string;
    latencyMs: number;
    error: string | null;
    tables: TableCount[];
  };
  environment: {
    NEXT_PUBLIC_SUPABASE_URL: boolean;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: boolean;
    SUPABASE_SERVICE_ROLE_KEY: boolean;
    ANTHROPIC_API_KEY: boolean;
    NEXT_PUBLIC_SITE_URL: string | null;
    NODE_ENV: string;
  };
}

/* ── Feature catalog ── */
const FEATURES = {
  ready: [
    { module: "Storefront", feature: "Homepage with hero slideshow", route: "/" },
    { module: "Storefront", feature: "Featured products carousel", route: "/" },
    { module: "Storefront", feature: "Find Your Fantasy collections grid", route: "/" },
    { module: "Storefront", feature: "Product listing with filters, sort & pagination", route: "/products" },
    { module: "Storefront", feature: "Product detail page (gallery, variants, accordion)", route: "/products/[slug]" },
    { module: "Storefront", feature: "Collection & category pages", route: "/collections/[slug]" },
    { module: "Storefront", feature: "Shopping cart (add, remove, quantity, promo code UI)", route: "/cart" },
    { module: "Storefront", feature: "Wishlist (add/remove, persist to localStorage)", route: "/wishlist" },
    { module: "Storefront", feature: "Cart drawer (mini cart side panel)", route: "Global" },
    { module: "Storefront", feature: "Announcement bar carousel", route: "Global" },
    { module: "Storefront", feature: "Responsive header with mega menus", route: "Global" },
    { module: "Storefront", feature: "Mobile navigation drawer", route: "Global" },
    { module: "Storefront", feature: "Footer with links & social", route: "Global" },
    { module: "Storefront", feature: "Breadcrumb navigation", route: "Global" },
    { module: "Storefront", feature: "Loading states & skeleton screens", route: "Global" },
    { module: "Storefront", feature: "Toast notifications", route: "Global" },
    { module: "Admin", feature: "Dashboard with KPI metrics", route: "/admin" },
    { module: "Admin", feature: "Products CRUD (create, edit, delete)", route: "/admin/products" },
    { module: "Admin", feature: "Product image upload to Supabase Storage", route: "/admin/products/new" },
    { module: "Admin", feature: "Product variant manager (size, color, price, stock)", route: "/admin/products/new" },
    { module: "Admin", feature: "Product measurements editor", route: "/admin/products/new" },
    { module: "Admin", feature: "AI product copy generation (Claude)", route: "/admin/products/new" },
    { module: "Admin", feature: "Categories CRUD", route: "/admin/categories" },
    { module: "Admin", feature: "Collections CRUD with product picker", route: "/admin/collections" },
    { module: "Admin", feature: "Orders table with status filters", route: "/admin/orders" },
    { module: "Admin", feature: "Order detail & status/tracking updates", route: "/admin/orders/[id]" },
    { module: "Admin", feature: "Reviews moderation (approve, feature, delete)", route: "/admin/reviews" },
    { module: "Admin", feature: "Database seeding endpoint", route: "/api/admin/seed" },
    { module: "Admin", feature: "Build status page", route: "/admin/status" },
    { module: "Database", feature: "Full PostgreSQL schema (13 tables, RLS, triggers)", route: "Supabase" },
    { module: "Database", feature: "Row Level Security policies", route: "Supabase" },
    { module: "Database", feature: "Auto-generated TypeScript types", route: "src/types" },
    { module: "Database", feature: "Mock data fallback when DB unavailable", route: "src/lib" },
    { module: "Integrations", feature: "Supabase (DB + Auth + Storage)", route: ".env" },
    { module: "Integrations", feature: "Anthropic Claude API (AI generation)", route: ".env" },
  ],
  pending: [
    { module: "Auth", feature: "User login (Supabase Auth)", route: "/login", priority: "High" },
    { module: "Auth", feature: "User registration", route: "/register", priority: "High" },
    { module: "Auth", feature: "Protected admin routes (auth guard)", route: "/admin/*", priority: "High" },
    { module: "Auth", feature: "Password reset flow", route: "/forgot-password", priority: "Medium" },
    { module: "Checkout", feature: "Checkout page & flow", route: "/checkout", priority: "High" },
    { module: "Checkout", feature: "Stripe payment integration", route: "/checkout", priority: "High" },
    { module: "Checkout", feature: "Razorpay payment integration", route: "/checkout", priority: "Medium" },
    { module: "Checkout", feature: "Cash on Delivery option", route: "/checkout", priority: "Low" },
    { module: "Checkout", feature: "Order confirmation page & email", route: "/order/[id]", priority: "High" },
    { module: "Checkout", feature: "Promo code validation (backend)", route: "/api", priority: "Medium" },
    { module: "Account", feature: "User profile management", route: "/account", priority: "Medium" },
    { module: "Account", feature: "Address book (CRUD)", route: "/account/addresses", priority: "Medium" },
    { module: "Account", feature: "Order history", route: "/account/orders", priority: "Medium" },
    { module: "Account", feature: "Wishlist sync to database", route: "/wishlist", priority: "Low" },
    { module: "Reviews", feature: "Customer review submission form", route: "/products/[slug]", priority: "Medium" },
    { module: "Search", feature: "Full-text product search", route: "/search", priority: "Medium" },
    { module: "Email", feature: "Transactional emails (order, shipping)", route: "Backend", priority: "High" },
    { module: "Email", feature: "Newsletter subscription (backend)", route: "/api", priority: "Low" },
    { module: "Email", feature: "Contact form submission", route: "/contact", priority: "Medium" },
    { module: "Content", feature: "About page (real images)", route: "/about", priority: "Low" },
    { module: "Content", feature: "Blog system", route: "/blogs", priority: "Low" },
    { module: "Content", feature: "FAQ content", route: "/faq", priority: "Low" },
    { module: "Content", feature: "Shipping / Returns / Privacy / Terms policies", route: "Various", priority: "Low" },
    { module: "Analytics", feature: "Analytics integration (GA / Mixpanel)", route: "Global", priority: "Low" },
    { module: "Integrations", feature: "Instagram feed embed", route: "/", priority: "Low" },
    { module: "Integrations", feature: "Cloudinary image optimization pipeline", route: "Backend", priority: "Medium" },
  ],
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
};

function StatusBadge({ status }: { status: string }) {
  const isGood = status === "connected" || status === "healthy";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isGood ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${isGood ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function EnvBadge({ configured }: { configured: boolean }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${
        configured ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {configured ? "Set" : "Missing"}
    </span>
  );
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const readyCount = FEATURES.ready.length;
  const pendingCount = FEATURES.pending.length;
  const totalCount = readyCount + pendingCount;
  const completionPct = Math.round((readyCount / totalCount) * 100);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-light text-brand-purple/80">
            Build Status
          </h1>
          <p className="mt-1 text-sm text-brand-purple/50">
            System health, build info, database connection, and feature readiness.
          </p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loading ? "animate-spin" : ""}
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="mt-12 flex items-center justify-center gap-3 text-brand-purple/40">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Loading status...
        </div>
      )}

      {data && (
        <div className="mt-8 space-y-8">
          {/* ── Top KPI cards ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Overall Status */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                System Status
              </p>
              <div className="mt-3">
                <StatusBadge status={data.status} />
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Response: {data.responseTimeMs}ms
              </p>
            </div>

            {/* Build */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Build
              </p>
              <p className="mt-3 font-heading text-2xl font-light text-brand-purple/80">
                #{data.build.number}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                v{data.build.version} &middot; {data.build.lastCommit}
              </p>
            </div>

            {/* Database */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Database
              </p>
              <div className="mt-3">
                <StatusBadge status={data.database.status} />
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Latency: {data.database.latencyMs}ms
              </p>
            </div>

            {/* Feature Progress */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Features
              </p>
              <p className="mt-3 font-heading text-2xl font-light text-brand-purple/80">
                {completionPct}%
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {readyCount} ready / {pendingCount} pending
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Build & Runtime Info ── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Build info */}
            <div className="rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-neutral-800">
                  Build Information
                </h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {[
                  ["Build Number", `#${data.build.number}`],
                  ["Version", `v${data.build.version}`],
                  ["Last Commit", data.build.lastCommit],
                  [
                    "Build Date",
                    new Date(data.build.lastBuildDate).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    ),
                  ],
                  ["Framework", data.runtime.framework],
                  ["React", data.runtime.react],
                  ["Node.js", data.runtime.node],
                  ["Platform", data.runtime.platform],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-5 py-3 text-sm"
                  >
                    <span className="text-neutral-500">{label}</span>
                    <span className="font-mono text-neutral-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment variables */}
            <div className="rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-neutral-800">
                  Environment Variables
                </h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {[
                  ["NEXT_PUBLIC_SUPABASE_URL", data.environment.NEXT_PUBLIC_SUPABASE_URL],
                  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", data.environment.NEXT_PUBLIC_SUPABASE_ANON_KEY],
                  ["SUPABASE_SERVICE_ROLE_KEY", data.environment.SUPABASE_SERVICE_ROLE_KEY],
                  ["ANTHROPIC_API_KEY", data.environment.ANTHROPIC_API_KEY],
                ].map(([label, configured]) => (
                  <div
                    key={label as string}
                    className="flex items-center justify-between px-5 py-3 text-sm"
                  >
                    <span className="font-mono text-xs text-neutral-500">
                      {label as string}
                    </span>
                    <EnvBadge configured={configured as boolean} />
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="font-mono text-xs text-neutral-500">
                    NODE_ENV
                  </span>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {data.environment.NODE_ENV}
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="font-mono text-xs text-neutral-500">
                    SITE_URL
                  </span>
                  <span className="font-mono text-xs text-neutral-700">
                    {data.environment.NEXT_PUBLIC_SITE_URL ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Database Tables ── */}
          {data.database.tables.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-neutral-800">
                  Database Tables
                </h2>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {data.database.provider} &middot; {data.database.latencyMs}ms
                  latency
                </p>
              </div>
              <div className="grid gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-3">
                {data.database.tables.map((t) => (
                  <div
                    key={t.table}
                    className="flex items-center justify-between bg-white px-5 py-3"
                  >
                    <span className="font-mono text-xs text-neutral-600">
                      {t.table}
                    </span>
                    <span className="font-mono text-sm font-medium text-neutral-800">
                      {t.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.database.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <strong>Database Error:</strong> {data.database.error}
            </div>
          )}

          {/* ── Features Ready ── */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-neutral-800">
                Features Ready ({readyCount})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Module</th>
                    <th className="px-5 py-3">Feature</th>
                    <th className="px-5 py-3">Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {FEATURES.ready.map((f, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50">
                      <td className="px-5 py-2.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      </td>
                      <td className="px-5 py-2.5">
                        <span className="rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                          {f.module}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-neutral-700">
                        {f.feature}
                      </td>
                      <td className="px-5 py-2.5 font-mono text-xs text-neutral-400">
                        {f.route}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Features Pending ── */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-neutral-800">
                Features Pending ({pendingCount})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 text-xs font-medium uppercase tracking-wider text-neutral-400">
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Module</th>
                    <th className="px-5 py-3">Feature</th>
                    <th className="px-5 py-3">Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {FEATURES.pending.map((f, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50">
                      <td className="px-5 py-2.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        </span>
                      </td>
                      <td className="px-5 py-2.5">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[f.priority] ?? ""}`}
                        >
                          {f.priority}
                        </span>
                      </td>
                      <td className="px-5 py-2.5">
                        <span className="rounded bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                          {f.module}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-neutral-700">
                        {f.feature}
                      </td>
                      <td className="px-5 py-2.5 font-mono text-xs text-neutral-400">
                        {f.route}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Tech Stack ── */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-neutral-800">
                Tech Stack
              </h2>
            </div>
            <div className="grid gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Next.js", version: "16.1.6", category: "Framework" },
                { label: "React", version: "19.2.3", category: "UI" },
                { label: "TypeScript", version: "5.x", category: "Language" },
                { label: "Tailwind CSS", version: "3.4.19", category: "Styling" },
                { label: "Supabase", version: "2.95.3", category: "Database" },
                { label: "Zustand", version: "5.0.11", category: "State" },
                { label: "Framer Motion", version: "12.33.0", category: "Animations" },
                { label: "React Hook Form", version: "7.71.1", category: "Forms" },
                { label: "Zod", version: "4.3.6", category: "Validation" },
                { label: "Anthropic SDK", version: "0.74.0", category: "AI" },
                { label: "PostgreSQL", version: "15+", category: "Database" },
                { label: "Supabase Storage", version: "—", category: "Media" },
              ].map((pkg) => (
                <div
                  key={pkg.label}
                  className="flex items-center justify-between bg-white px-5 py-3"
                >
                  <div>
                    <span className="text-sm font-medium text-neutral-700">
                      {pkg.label}
                    </span>
                    <span className="ml-2 text-xs text-neutral-400">
                      {pkg.category}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-neutral-500">
                    {pkg.version}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timestamp */}
          <p className="text-center text-xs text-neutral-400">
            Last checked:{" "}
            {new Date(data.timestamp).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "medium",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
