"use client";

import { useRef, useState, useCallback } from "react";
import type { ProductImage } from "@/types/product";
import { toast } from "@/components/ui/Toast";

interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

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

// ── Validate a file before upload ──
function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}" is not a supported image format`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `"${file.name}" exceeds 10 MB limit`;
  }
  return null;
}

export function ImageManager({ images, onChange }: ImageManagerProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [coverDragOver, setCoverDragOver] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);
  const [editingAlt, setEditingAlt] = useState<number | null>(null);
  const [uploading, setUploading] = useState<"cover" | "gallery" | null>(null);

  // Cover = images[0], Gallery = images[1..]
  const coverImage = images.length > 0 ? images[0] : null;
  const galleryImages = images.length > 1 ? images.slice(1) : [];

  // ── Upload single cover image ──
  const uploadCover = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files)[0];
      if (!file) return;

      const error = validateFile(file);
      if (error) {
        toast(error, "error");
        return;
      }

      setUploading("cover");
      try {
        const publicUrl = await uploadToStorage(file);
        const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const newCover: ProductImage = { url: publicUrl, alt: altText };
        // Replace cover (index 0), keep gallery
        onChange([newCover, ...galleryImages]);
        toast("Cover image uploaded", "success");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast(`Failed to upload cover: ${msg}`, "error");
      }
      setUploading(null);
    },
    [galleryImages, onChange]
  );

  // ── Upload gallery images ──
  const uploadGallery = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newImages: ProductImage[] = [];

      setUploading("gallery");

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          toast(error, "error");
          continue;
        }

        try {
          const publicUrl = await uploadToStorage(file);
          const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          newImages.push({ url: publicUrl, alt: altText });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Upload failed";
          toast(`Failed to upload "${file.name}": ${msg}`, "error");
        }
      }

      setUploading(null);

      if (newImages.length > 0) {
        const base = coverImage ? [coverImage] : [];
        onChange([...base, ...galleryImages, ...newImages]);
        toast(`${newImages.length} image${newImages.length > 1 ? "s" : ""} added to gallery`, "success");
      }
    },
    [coverImage, galleryImages, onChange]
  );

  // ── Remove cover image ──
  function removeCover() {
    // Gallery images become the only images
    onChange([...galleryImages]);
    toast("Cover image removed", "success");
  }

  // ── Remove gallery image ──
  function removeGalleryImage(galleryIndex: number) {
    const newGallery = galleryImages.filter((_, i) => i !== galleryIndex);
    const base = coverImage ? [coverImage] : [];
    onChange([...base, ...newGallery]);
  }

  // ── Promote gallery image to cover ──
  function promoteToCover(galleryIndex: number) {
    const promoted = galleryImages[galleryIndex]!;
    const newGallery = galleryImages.filter((_, i) => i !== galleryIndex);
    // Old cover goes to start of gallery
    const base = coverImage ? [promoted, coverImage, ...newGallery] : [promoted, ...newGallery];
    onChange(base);
    toast("Set as cover image", "success");
  }

  // ── Reorder gallery images ──
  function moveGalleryImage(galleryIndex: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? galleryIndex - 1 : galleryIndex + 1;
    if (newIndex < 0 || newIndex >= galleryImages.length) return;
    const reordered = [...galleryImages];
    const temp = reordered[galleryIndex]!;
    reordered[galleryIndex] = reordered[newIndex]!;
    reordered[newIndex] = temp;
    const base = coverImage ? [coverImage] : [];
    onChange([...base, ...reordered]);
  }

  // ── Update alt text (uses absolute index in images array) ──
  function updateAlt(absoluteIndex: number, alt: string) {
    const updated = images.map((img, i) =>
      i === absoluteIndex ? { ...img, alt } : img
    );
    onChange(updated);
  }

  // ── Spinner component ──
  const Spinner = () => (
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10">
      <svg className="h-6 w-6 animate-spin text-brand-purple" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  // ── Upload icon ──
  const UploadIcon = () => (
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
  );

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════
          COVER IMAGE
         ═══════════════════════════════════════════════ */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-700">Cover Image</label>
          <span className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-purple">
            Required
          </span>
        </div>
        <p className="mb-3 text-xs text-neutral-400">
          The main product image shown on cards and as the hero. Recommended: 1200x1600px (3:4 ratio).
        </p>

        {/* Hidden cover file input */}
        <input
          ref={coverInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => {
            if (e.target.files?.length) {
              uploadCover(e.target.files);
              e.target.value = "";
            }
          }}
          className="hidden"
        />

        {coverImage ? (
          // ── Cover preview ──
          <div className="relative inline-block">
            <div className="relative h-64 w-48 overflow-hidden rounded-xl border-2 border-brand-purple/30 bg-neutral-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage.url}
                alt={coverImage.alt || "Cover image"}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded-full bg-brand-purple px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Cover
              </span>
            </div>

            {/* Cover actions */}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-brand-purple hover:text-brand-purple"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Replace
              </button>
              <button
                type="button"
                onClick={removeCover}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-red-300 hover:text-red-600"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Remove
              </button>
            </div>

            {/* Alt text for cover */}
            <div className="mt-2 w-48">
              {editingAlt === 0 ? (
                <input
                  type="text"
                  value={coverImage.alt}
                  onChange={(e) => updateAlt(0, e.target.value)}
                  onBlur={() => setEditingAlt(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingAlt(null)}
                  autoFocus
                  placeholder="Alt text"
                  className="w-full rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-700 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingAlt(0)}
                  className="w-full truncate text-left text-xs text-neutral-500 hover:text-neutral-700"
                  title={coverImage.alt || "Click to add alt text"}
                >
                  {coverImage.alt || (
                    <span className="italic text-neutral-400">Add alt text...</span>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          // ── Cover upload zone ──
          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setCoverDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setCoverDragOver(false); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCoverDragOver(false);
              if (e.dataTransfer.files?.length) uploadCover(e.dataTransfer.files);
            }}
            onClick={() => coverInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              uploading === "cover"
                ? "pointer-events-none border-brand-purple/40 bg-brand-purple/5"
                : coverDragOver
                  ? "border-brand-purple bg-brand-purple/5"
                  : "border-neutral-300 bg-neutral-50 hover:border-brand-purple/50 hover:bg-neutral-100"
            }`}
          >
            {uploading === "cover" ? (
              <>
                <Spinner />
                <p className="text-sm font-medium text-brand-purple">Uploading cover image...</p>
              </>
            ) : (
              <>
                <UploadIcon />
                <p className="text-sm font-medium text-neutral-700">
                  {coverDragOver ? "Drop cover image here" : "Click to upload or drag & drop"}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  JPG, PNG, WebP, AVIF or GIF. Max 10 MB. Uploaded to cloud.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          GALLERY IMAGES
         ═══════════════════════════════════════════════ */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Gallery Images
            {galleryImages.length > 0 && (
              <span className="ml-1.5 text-neutral-400">({galleryImages.length})</span>
            )}
          </label>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
            Optional
          </span>
        </div>
        <p className="mb-3 text-xs text-neutral-400">
          Additional product images. Customers can browse through these on the product page.
        </p>

        {/* Hidden gallery file input */}
        <input
          ref={galleryInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={(e) => {
            if (e.target.files?.length) {
              uploadGallery(e.target.files);
              e.target.value = "";
            }
          }}
          className="hidden"
        />

        {/* Gallery upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setGalleryDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setGalleryDragOver(false); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setGalleryDragOver(false);
            if (e.dataTransfer.files?.length) uploadGallery(e.dataTransfer.files);
          }}
          onClick={() => galleryInputRef.current?.click()}
          className={`mb-4 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            uploading === "gallery"
              ? "pointer-events-none border-brand-purple/40 bg-brand-purple/5"
              : galleryDragOver
                ? "border-brand-purple bg-brand-purple/5"
                : "border-neutral-300 bg-neutral-50 hover:border-brand-purple/50 hover:bg-neutral-100"
          }`}
        >
          {uploading === "gallery" ? (
            <>
              <Spinner />
              <p className="text-sm font-medium text-brand-purple">Uploading to gallery...</p>
            </>
          ) : (
            <>
              <UploadIcon />
              <p className="text-sm font-medium text-neutral-700">
                {galleryDragOver ? "Drop images here" : "Click to add gallery images or drag & drop"}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Multiple files allowed. JPG, PNG, WebP, AVIF or GIF. Max 10 MB each.
              </p>
            </>
          )}
        </div>

        {/* Gallery grid */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((img, galleryIdx) => {
              const absoluteIdx = galleryIdx + 1; // +1 because cover is index 0
              return (
                <div
                  key={galleryIdx}
                  className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
                >
                  {/* Image preview */}
                  <div className="relative aspect-square bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt || "Gallery image"}
                      className="h-full w-full object-cover"
                    />

                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      {/* Promote to cover */}
                      <button
                        type="button"
                        onClick={() => promoteToCover(galleryIdx)}
                        title="Set as cover image"
                        className="rounded-lg bg-white/90 p-2 text-neutral-700 transition-colors hover:bg-white hover:text-brand-purple"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>

                      {/* Move left */}
                      {galleryIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(galleryIdx, "up")}
                          title="Move left"
                          className="rounded-lg bg-white/90 p-2 text-neutral-700 transition-colors hover:bg-white hover:text-brand-purple"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>
                      )}

                      {/* Move right */}
                      {galleryIdx < galleryImages.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(galleryIdx, "down")}
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
                        onClick={() => removeGalleryImage(galleryIdx)}
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
                    {editingAlt === absoluteIdx ? (
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => updateAlt(absoluteIdx, e.target.value)}
                        onBlur={() => setEditingAlt(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingAlt(null)}
                        autoFocus
                        placeholder="Alt text"
                        className="w-full rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-700 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingAlt(absoluteIdx)}
                        className="w-full truncate text-left text-xs text-neutral-500 hover:text-neutral-700"
                        title={img.alt || "Click to add alt text"}
                      >
                        {img.alt || (
                          <span className="italic text-neutral-400">Add alt text...</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
