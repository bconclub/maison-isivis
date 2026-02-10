"use client";

import { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useAdminStore } from "@/lib/stores/admin-store";

interface GeneratedContent {
  shortDescription: string;
  description: string;
  fabric: string;
  careInstructions: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  badge: string;
}

export interface AIApplyPayload extends GeneratedContent {
  /** Also pass the modal inputs so the form can fill basic fields */
  productName: string;
  categoryId: string | null;
  price: number | null;
}

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (content: AIApplyPayload) => void;
  /** Pre-fill from form fields already entered */
  defaults?: {
    productName?: string;
    category?: string;
    fabric?: string;
    price?: number;
    colors?: string;
    sizes?: string;
  };
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export function AIGenerateModal({
  isOpen,
  onClose,
  onApply,
  defaults,
}: AIGenerateModalProps) {
  const categories = useAdminStore((s) => s.categories);
  const [productName, setProductName] = useState(defaults?.productName ?? "");
  const [category, setCategory] = useState(defaults?.category ?? "");
  const [fabric, setFabric] = useState(defaults?.fabric ?? "");
  const [price, setPrice] = useState(defaults?.price?.toString() ?? "");
  const [colors, setColors] = useState(defaults?.colors ?? "");
  const [sizes, setSizes] = useState(defaults?.sizes ?? "");
  const [context, setContext] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<GeneratedContent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync defaults when modal opens with new data
  useState(() => {
    if (defaults?.productName) setProductName(defaults.productName);
    if (defaults?.category) setCategory(defaults.category);
    if (defaults?.fabric) setFabric(defaults.fabric);
    if (defaults?.price) setPrice(defaults.price.toString());
    if (defaults?.colors) setColors(defaults.colors);
    if (defaults?.sizes) setSizes(defaults.sizes);
  });

  function handleImageSelect(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast("Please upload a JPEG, PNG, WebP, or GIF image.", "error");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast("Image is too large. Maximum 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setImageFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  function handleImageDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }

  function removeImage() {
    setImageData(null);
    setImageFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleGenerate() {
    // If image is uploaded, product name is optional (will be extracted)
    if (!productName.trim() && !imageData) {
      toast("Enter a product name or upload a screenshot", "error");
      return;
    }

    setLoading(true);
    setPreview(null);

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName.trim() || "Extract from image",
          category: category.trim() || undefined,
          fabric: fabric.trim() || undefined,
          price: price ? parseFloat(price) : undefined,
          colors: colors.trim() || undefined,
          sizes: sizes.trim() || undefined,
          context: context.trim() || undefined,
          image: imageData || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Failed to generate content", "error");
        return;
      }

      setPreview(data.content);
      toast("Content generated! Review below and apply.", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Network error",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!preview) return;
    // Find category ID from name
    const matchedCat = categories.find((c) => c.name === category);
    onApply({
      ...preview,
      productName: productName.trim(),
      categoryId: matchedCat?.id ?? null,
      price: price ? parseFloat(price) : null,
    });
    onClose();
    toast("AI content applied to form", "success");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Content Generator" maxWidth="lg">
      <div className="space-y-5">
        {/* Input section */}
        <div className="space-y-3">
          <p className="text-sm text-neutral-500">
            Upload a screenshot or enter details manually. Claude will extract info and generate descriptions, SEO metadata, and more.
          </p>

          {/* Image Upload Zone */}
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Product Screenshot
              <span className="ml-1 font-normal text-neutral-400">(optional — Claude will extract details)</span>
            </label>
            {imageData ? (
              <div className="relative flex items-center gap-3 rounded-lg border border-brand-purple/30 bg-brand-purple/5 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageData}
                  alt="Uploaded screenshot"
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900">{imageFileName}</p>
                  <p className="text-xs text-brand-purple">Image ready — Claude will analyse this</p>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="shrink-0 rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Remove image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-brand-purple/40 hover:bg-brand-purple/5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm text-neutral-500">
                  Click or drag a screenshot here
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs font-medium text-neutral-400">OR ENTER DETAILS</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Product Name {!imageData && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Selene Silk Midi Dress"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Fabric / Material
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Mulberry Silk"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Price (&pound;)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 285"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Available Colours
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="e.g. Black, Ivory, Dusty Rose"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Available Sizes
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="e.g. XS, S, M, L, XL"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Additional Context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
              placeholder="Style, occasion, unique selling points, target customer..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            />
          </div>

          <Button
            type="button"
            onClick={handleGenerate}
            isLoading={loading}
            size="md"
            className="w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3m6.36-.64-2.12 2.12M21 12h-3m.64 6.36-2.12-2.12M12 21v-3m-6.36.64 2.12-2.12M3 12h3m-.64-6.36 2.12 2.12" />
              </svg>
              {loading
                ? imageData
                  ? "Analysing image & generating..."
                  : "Generating with Claude..."
                : imageData
                  ? "Extract & Generate Content"
                  : "Generate Content"}
            </span>
          </Button>
        </div>

        {/* Preview section */}
        {preview && (
          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <h3 className="text-sm font-semibold text-neutral-900">
              Generated Content Preview
            </h3>

            <PreviewField label="Short Description" value={preview.shortDescription} />
            <PreviewField label="Full Description" value={preview.description} multiline />
            <PreviewField label="Fabric" value={preview.fabric} />
            <PreviewField label="Care Instructions" value={preview.careInstructions} />
            <PreviewField label="Meta Title" value={preview.metaTitle} />
            <PreviewField label="Meta Description" value={preview.metaDescription} />
            <PreviewField label="Keywords" value={preview.keywords} />
            {preview.badge && <PreviewField label="Badge" value={preview.badge} />}

            <div className="flex gap-3 pt-2">
              <Button type="button" onClick={handleApply} size="md">
                Apply to Form
              </Button>
              <Button type="button" variant="secondary" onClick={handleGenerate} isLoading={loading} size="md">
                Regenerate
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} size="md">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Preview field component ─────────────────────────────────
function PreviewField({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      {multiline ? (
        <p className="mt-0.5 whitespace-pre-line rounded-lg bg-neutral-50 p-3 text-sm text-neutral-800">
          {value}
        </p>
      ) : (
        <p className="mt-0.5 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
          {value}
        </p>
      )}
    </div>
  );
}
