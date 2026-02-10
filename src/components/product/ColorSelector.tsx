"use client";

import { cn } from "@/lib/utils";

const COLOR_HEX_MAP: Record<string, string> = {
  // Neutrals
  White: "#FFFFFF",
  Ivory: "#FFFFF0",
  Cream: "#FFFDD0",
  Beige: "#E8D5B7",
  Tan: "#D2B48C",
  Camel: "#C19A6B",
  Nude: "#E3BC9A",
  Sand: "#C2B280",
  Oatmeal: "#D4C9A8",
  Taupe: "#B4A68F",
  Grey: "#9CA3AF",
  Gray: "#9CA3AF",
  Charcoal: "#4B5563",
  "Light Grey": "#D1D5DB",
  Silver: "#C0C0C0",
  Black: "#111827",
  Diamond: "#E8E8E8",
  Bone: "#E3DAC9",

  // Pinks & Roses
  Pink: "#EC4899",
  "Blush Pink": "#F9C6D3",
  Blush: "#F9C6D3",
  Rose: "#E8909C",
  "Dusty Rose": "#DCAE96",
  "Dusty Pink": "#D4A0A0",
  Mauve: "#C08E8E",
  Coral: "#F08080",
  Salmon: "#FA8072",
  Peach: "#FFDAB9",
  Fuchsia: "#C850C0",
  Magenta: "#C850C0",
  "Hot Pink": "#FF69B4",
  Berry: "#8E3A59",
  Raspberry: "#B5305A",
  Rosewood: "#65000B",

  // Reds & Burgundy
  Red: "#B91C1C",
  "Cherry Red": "#9B111E",
  Crimson: "#DC143C",
  Scarlet: "#FF2400",
  Burgundy: "#800020",
  Maroon: "#800000",
  Wine: "#722F37",
  Oxblood: "#4A0000",
  Claret: "#7F1734",
  Rust: "#B7410E",
  Terracotta: "#CC5C3C",
  Brick: "#CB4154",

  // Oranges & Yellows
  Orange: "#F97316",
  "Burnt Orange": "#CC5500",
  Amber: "#FFBF00",
  Gold: "#D4AF37",
  Mustard: "#E1AD01",
  Yellow: "#FBBF24",
  Lemon: "#FDE68A",
  Saffron: "#F4C430",
  Champagne: "#F7E7CE",

  // Greens
  Green: "#16A34A",
  "Forest Green": "#228B22",
  Emerald: "#046307",
  Sage: "#B2AC88",
  Olive: "#808000",
  Khaki: "#BDB76B",
  Mint: "#98FF98",
  Jade: "#00A86B",
  Teal: "#008080",
  "Hunter Green": "#355E3B",
  Moss: "#8A9A5B",
  Pistachio: "#93C572",
  Lime: "#84CC16",
  Sea: "#2E8B57",

  // Blues
  Blue: "#2563EB",
  Navy: "#1B1F3B",
  "Navy Blue": "#1B1F3B",
  "Royal Blue": "#1E40AF",
  "Sky Blue": "#87CEEB",
  "Baby Blue": "#89CFF0",
  "Powder Blue": "#B0E0E6",
  "Light Blue": "#ADD8E6",
  Cobalt: "#0047AB",
  Cornflower: "#6495ED",
  Denim: "#1560BD",
  Indigo: "#3730A3",
  "Steel Blue": "#4682B4",
  Periwinkle: "#CCCCFF",
  Slate: "#6B7280",
  "Ice Blue": "#D6ECEF",
  Turquoise: "#40E0D0",
  Aqua: "#00CED1",
  Cerulean: "#2A52BE",
  Midnight: "#191970",

  // Purples & Lavenders
  Purple: "#7C3AED",
  Lavender: "#E6E6FA",
  Lilac: "#C8A2C8",
  Plum: "#673147",
  Violet: "#8B5CF6",
  Amethyst: "#9966CC",
  Aubergine: "#3B0A30",
  Eggplant: "#483248",
  Orchid: "#DA70D6",
  Wisteria: "#C9A0DC",

  // Browns
  Brown: "#92400E",
  "Dark Brown": "#654321",
  Chocolate: "#7B3F00",
  Coffee: "#6F4E37",
  Espresso: "#3C1414",
  Mocha: "#967969",
  Cognac: "#9A463D",
  Sienna: "#A0522D",
  Cinnamon: "#D2691E",
  Walnut: "#5D432C",
  Chestnut: "#954535",
};

/** Try to find a hex for any color name (case-insensitive, with common aliases). */
function resolveColorHex(color: string): string {
  // Direct match (case-sensitive)
  if (COLOR_HEX_MAP[color]) return COLOR_HEX_MAP[color];
  // Case-insensitive match
  const lower = color.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (key.toLowerCase() === lower) return hex;
  }
  // Try matching just the last word (e.g., "Dusty Rose" → "Rose")
  const words = color.split(" ");
  if (words.length > 1) {
    const lastWord = words[words.length - 1] ?? "";
    for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
      if (key.toLowerCase() === lastWord.toLowerCase()) return hex;
    }
  }
  // Fallback to grey
  return "#9CA3AF";
}

/** Check if a hex color is light enough to need a visible border. */
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Perceived luminance formula
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}

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
          const hex = resolveColorHex(color);
          const isSelected = selectedColor === color;
          // Determine if the color is light (needs a visible border)
          const isLight = isLightColor(hex);

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
