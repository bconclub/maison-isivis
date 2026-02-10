"use client";

import type { ProductVariant } from "@/types/product";

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  function addVariant() {
    const newVariant: ProductVariant = {
      variantId: `var-${Date.now()}`,
      size: "",
      color: "",
      stock: 0,
      price: 0,
    };
    onChange([...variants, newVariant]);
  }

  function removeVariant(index: number) {
    onChange(variants.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: keyof ProductVariant, value: string | number) {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    onChange(updated);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">
          Variants ({variants.length})
        </label>
        <button
          type="button"
          onClick={addVariant}
          className="text-sm font-medium text-brand-purple hover:underline"
        >
          + Add Variant
        </button>
      </div>

      {variants.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
          No variants. Click &ldquo;Add Variant&rdquo; to create size/color combinations.
        </p>
      )}

      {variants.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 text-left">
                <th className="px-3 py-2.5 font-medium text-neutral-500">Size</th>
                <th className="px-3 py-2.5 font-medium text-neutral-500">Color</th>
                <th className="px-3 py-2.5 font-medium text-neutral-500">Stock</th>
                <th className="px-3 py-2.5 font-medium text-neutral-500">Price (£)</th>
                <th className="w-10 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, index) => (
                <tr key={v.variantId} className="border-b border-neutral-50 last:border-0">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={v.size ?? ""}
                      onChange={(e) => updateVariant(index, "size", e.target.value)}
                      placeholder="e.g. S"
                      className="w-full rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={v.color ?? ""}
                      onChange={(e) => updateVariant(index, "color", e.target.value)}
                      placeholder="e.g. Black"
                      className="w-full rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-20 rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-24 rounded border border-neutral-200 px-2 py-1.5 text-sm focus:border-brand-purple focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="rounded p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
