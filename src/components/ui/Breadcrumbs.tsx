import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-body-sm", className)}
    >
      <Link
        href="/"
        className="text-neutral-400 transition-colors hover:text-brand-purple"
      >
        Home
      </Link>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-neutral-300"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          {item.href ? (
            <Link
              href={item.href}
              className="text-neutral-400 transition-colors hover:text-brand-purple"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-neutral-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
