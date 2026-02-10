import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  salePrice?: number | null;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-h4 font-semibold",
};

export function PriceDisplay({
  price,
  salePrice,
  compareAtPrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const effectiveCompare = compareAtPrice ?? (salePrice ? price : null);

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn(sizeClasses[size], "font-normal text-brand-purple")}>
        {formatPrice(salePrice ?? price)}
      </span>
      {effectiveCompare && (
        <span
          className={cn(
            size === "lg" ? "text-base" : "text-body-sm",
            "text-neutral-400 line-through"
          )}
        >
          {formatPrice(effectiveCompare)}
        </span>
      )}
    </div>
  );
}
