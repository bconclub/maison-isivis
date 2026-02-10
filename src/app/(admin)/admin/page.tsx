"use client";

import { useAdminStore } from "@/lib/stores/admin-store";
import { formatPrice } from "@/lib/utils";
import { MetricCard, RecentOrdersTable, QuickActions } from "@/components/admin/dashboard";

export default function AdminDashboardPage() {
  const products = useAdminStore((s) => s.products);
  const orders = useAdminStore((s) => s.orders);
  const reviews = useAdminStore((s) => s.reviews);
  const categories = useAdminStore((s) => s.categories);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const publishedProducts = products.filter((p) => p.published).length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;

  return (
    <div>
      <h1 className="font-heading text-2xl font-light text-brand-purple/80">Dashboard</h1>
      <p className="mt-2 text-sm text-brand-purple/50">
        Welcome to the Maison ISIVIS admin panel. Here&apos;s an overview of your store.
      </p>

      {/* Metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Products"
          value={String(products.length)}
          change={`${publishedProducts} published`}
          changeType="neutral"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          }
          iconColor="bg-purple-50 text-purple-700"
        />
        <MetricCard
          label="Total Orders"
          value={String(orders.length)}
          change={`${orders.filter((o) => o.status === "processing").length} processing`}
          changeType="neutral"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10H3" />
              <path d="M11 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
              <path d="M16 16h6" />
              <path d="M19 13v6" />
            </svg>
          }
          iconColor="bg-blue-50 text-blue-700"
        />
        <MetricCard
          label="Revenue"
          value={formatPrice(totalRevenue)}
          change={`${orders.filter((o) => o.paymentStatus === "paid").length} paid orders`}
          changeType="positive"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          iconColor="bg-green-50 text-green-700"
        />
        <MetricCard
          label="Reviews"
          value={String(reviews.length)}
          change={pendingReviews > 0 ? `${pendingReviews} pending approval` : "All approved"}
          changeType={pendingReviews > 0 ? "negative" : "positive"}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
          iconColor="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Main content grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div className="space-y-6">
          <QuickActions />

          {/* Summary */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-5 py-4">
              <h3 className="text-sm font-semibold text-neutral-900">
                Store Overview
              </h3>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Categories</span>
                <span className="font-medium text-neutral-900">{categories.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Products on Sale</span>
                <span className="font-medium text-neutral-900">
                  {products.filter((p) => p.salePrice != null).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Low Stock Items</span>
                <span className="font-medium text-red-600">
                  {products.filter((p) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Out of Stock</span>
                <span className="font-medium text-red-600">
                  {products.filter((p) => p.stockQuantity === 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Featured Reviews</span>
                <span className="font-medium text-neutral-900">
                  {reviews.filter((r) => r.featured).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
