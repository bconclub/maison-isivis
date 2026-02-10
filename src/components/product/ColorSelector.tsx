"use client";

import { cn } from "@/lib/utils";

const COLOR_HEX_MAP: Record<string, string> = {
  White: "#FFFFFF",
  Ivory: "#FFFFF0",
  Beige: "#E8D5B7",
  Red: "#B91C1C",
  Black: "#111827",
  Diamond: "#E8E8E8",
};

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string | null;
  onSelect: (color: string) => void;
  className?: string;
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelect,
  className,
}: ColorSelectorProps) {
  return (
    <div className={className}>
      <p className="mb-3 text-body-sm font-medium uppercase tracking-luxury text-neutral-700">
        Colour{selectedColor ? `: ${selectedColor}` : ""}
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const hex = COLOR_HEX_MAP[color] ?? "#9CA3AF";
          const isSelected = selectedColor === color;
          const isLight = ["White", "Ivory", "Diamond"].includes(color);

          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={cn(
                "relative h-8 w-8 rounded-full transition-all duration-200",
                isSelected
                  ? "ring-2 ring-brand-purple ring-offset-2"
                  : "ring-1 ring-neutral-200 hover:ring-brand-purple/50",
                isLight && !isSelected && "ring-neutral-300"
              )}
              style={{ backgroundColor: hex }}
              aria-label={color}
              title={color}
            />
          );
        })}
      </div>
    </div>
  );
}
