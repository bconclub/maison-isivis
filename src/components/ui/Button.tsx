"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const variantClasses = {
  primary:
    "bg-brand-gradient text-white uppercase tracking-luxury shadow-luxury-sm hover:-translate-y-0.5 hover:shadow-luxury-lg active:translate-y-0",
  secondary:
    "bg-white text-brand-purple border-[1.5px] border-brand-purple uppercase tracking-luxury hover:bg-brand-purple hover:text-white",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100",
  link: "bg-transparent text-brand-blue underline-offset-4 hover:underline p-0",
} as const;

const sizeClasses = {
  sm: "px-4 py-2 text-body-sm",
  md: "px-8 py-3.5 text-base",
  lg: "px-10 py-4 text-body-lg",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-luxury font-medium transition-all duration-300 luxury-focus disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          variant !== "link" && sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
