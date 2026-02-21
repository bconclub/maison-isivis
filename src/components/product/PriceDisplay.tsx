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
  size = "md",
  className,
}: PriceDisplayProps) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn(sizeClasses[size], "font-normal text-brand-purple")}>
        {formatPrice(salePrice ?? price)}
      </span>
    </div>
  );
}
