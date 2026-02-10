"use client";

import { useRef, useState, useCallback } from "react";
import type { ProductImage } from "@/types/product";
import { toast } from "@/components/ui/Toast";

interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (matches API limit)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export function ImageManager({ images, onChange }: ImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingAlt, setEditingAlt] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // ── Upload file to Supabase Storage via API ──
  async function uploadToStorage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;
  }

  // ── Process uploaded files ──
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newImages: ProductImage[] = [];

      setUploading(true);

      for (const file of fileArray) {
        // Validate type
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast(`"${file.name}" is not a supported image format`, "error");
          continue;
        }
        // Validate size
        if (file.size > MAX_FILE_SIZE) {
          toast(`"${file.name}" exceeds 10 MB limit`, "error");
          continue;
        }

        try {
          // Upload to Supabase Storage and get public URL
          const publicUrl = await uploadToStorage(file);
          // Use filename (without extension) as default alt text
          const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          newImages.push({ url: publicUrl, alt: altText });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          toast(`Failed to upload "${file.name}": ${msg}`, "error");
        }
      }

      setUploading(false);

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
        toast(`${newImages.length} image${newImages.length > 1 ? "s" : ""} uploaded`, "success");
      }
    },
    [images, onChange]
  );

  // ── Drag & drop handlers ──
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  }

  // ── File input change ──
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  }

  // ── Click to open file picker ──
  function handleClickUpload() {
    fileInputRef.current?.click();
  }

  // ── Remove image ──
  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  // ── Update alt text ──
  function updateAlt(index: number, alt: string) {
    const updated = images.map((img, i) =>
      i === index ? { ...img, alt } : img
    );
    onChange(updated);
  }

  // ── Reorder: move image up/down ──
  function moveImage(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const reordered = [...images];
    const temp = reordered[index]!;
    reordered[index] = reordered[newIndex]!;
    reordered[newIndex] = temp;
    onChange(reordered);
  }

  // ── Set as primary (move to index 0) ──
  function setAsPrimary(index: number) {
    if (index === 0) return;
    const reordered = [...images];
    const img = reordered.splice(index, 1)[0]!;
    reordered.unshift(img);
    onChange(reordered);
    toast("Set as primary image", "success");
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">
          Product Images
          {images.length > 0 && (
            <span className="ml-1.5 text-neutral-400">({images.length})</span>
          )}
        </label>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        className={`mb-4 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          uploading
            ? "pointer-events-none border-brand-purple/40 bg-brand-purple/5"
            : dragOver
              ? "border-brand-purple bg-brand-purple/5"
              : "border-neutral-300 bg-neutral-50 hover:border-brand-purple/50 hover:bg-neutral-100"
        }`}
      >
        {uploading ? (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10">
              <svg className="h-6 w-6 animate-spin text-brand-purple" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-brand-purple">Uploading to cloud storage…</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-purple"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-700">
              {dragOver ? "Drop images here" : "Click to upload or drag & drop"}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              JPG, PNG, WebP, AVIF or GIF · Max 10 MB each · Uploaded to cloud
            </p>
          </>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              {/* Image preview */}
              <div className="relative aspect-square bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || "Product image"}
                  className="h-full w-full object-cover"
                />

                {/* Primary badge */}
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-brand-purple px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Primary
                  </span>
                )}

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {/* Set as primary */}
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => setAsPrimary(index)}
                      title="Set as primary"
                      className="rounded-lg bg-white/90 p-2 text-neutral-700 transition-colors hover:bg-white hover:text-brand-purple"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  )}

                  {/* Move up */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      title="Move left"
                      className="rounded-lg bg-white/90 p-2 text-neutral-700 transition-colors hover:bg-white hover:text-brand-purple"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                  )}

                  {/* Move down */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      title="Move right"
                      className="rounded-lg bg-white/90 p-2 text-neutral-700 transition-colors hover:bg-white hover:text-brand-purple"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                    className="rounded-lg bg-white/90 p-2 text-neutral-700 transition-colors hover:bg-white hover:text-red-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Alt text */}
              <div className="border-t border-neutral-100 p-2">
                {editingAlt === index ? (
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => updateAlt(index, e.target.value)}
                    onBlur={() => setEditingAlt(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingAlt(null)}
                    autoFocus
                    placeholder="Alt text"
                    className="w-full rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-700 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingAlt(index)}
                    className="w-full truncate text-left text-xs text-neutral-500 hover:text-neutral-700"
                    title={img.alt || "Click to add alt text"}
                  >
                    {img.alt || (
                      <span className="italic text-neutral-400">Add alt text…</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
