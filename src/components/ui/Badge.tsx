"use client";

import { cn } from "@/lib/utils";

const variantClasses = {
  default: "bg-neutral-100 text-neutral-700",
  primary: "bg-brand-purple text-white",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  sale: "bg-error text-white",
  new: "bg-brand-blue text-white",
} as const;

interface BadgeProps {
  variant?: keyof typeof variantClasses;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-luxury px-2.5 py-0.5 text-caption font-medium uppercase tracking-luxury",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
