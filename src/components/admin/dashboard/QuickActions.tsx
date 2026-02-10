"use client";

import Link from "next/link";

const ACTIONS = [
  {
    label: "Add Product",
    href: "/admin/products/new",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    ),
    color: "bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20",
  },
  {
    label: "View Orders",
    href: "/admin/orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10H3" />
        <path d="M21 6H3" />
        <path d="M21 14H3" />
        <path d="M21 18H3" />
      </svg>
    ),
    color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    label: "View Store",
    href: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" x2="3" y1="12" y2="12" />
      </svg>
    ),
    color: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Quick Actions
        </h3>
      </div>
      <div className="grid gap-3 p-5">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${action.color}`}
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
