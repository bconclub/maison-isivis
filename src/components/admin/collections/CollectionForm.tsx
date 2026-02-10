"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionSchema, type CollectionFormData } from "@/lib/admin-validations";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { slugify } from "@/lib/utils";
import { ProductPicker } from "./ProductPicker";
import type { Collection } from "@/types/product";

interface CollectionFormProps {
  collection?: Collection;
  mode: "create" | "edit";
}

export function CollectionForm({ collection, mode }: CollectionFormProps) {
  const router = useRouter();
  const addCollection = useAdminStore((s) => s.addCollection);
  const updateCollection = useAdminStore((s) => s.updateCollection);
  const collectionProducts = useAdminStore((s) => s.collectionProducts);
  const setCollectionProducts = useAdminStore((s) => s.setCollectionProducts);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    collection ? (collectionProducts[collection.id] ?? []) : []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: collection
      ? {
          title: collection.title,
          slug: collection.slug,
          description: collection.description,
          heroImageUrl: collection.heroImageUrl,
          heroVideoUrl: collection.heroVideoUrl,
          collectionType: collection.collectionType,
          featured: collection.featured,
          displayOrder: collection.displayOrder,
          metaTitle: collection.metaTitle,
          metaDescription: collection.metaDescription,
        }
      : {
          featured: false,
          displayOrder: 0,
        },
  });

  const titleValue = watch("title");
  useEffect(() => {
    if (mode === "create" && titleValue) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, mode, setValue]);

  async function onSubmit(data: CollectionFormData) {
    const now = new Date().toISOString();

    if (mode === "create") {
      const newId = `col-${Date.now()}`;
      const newCollection: Collection = {
        id: newId,
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        heroImageUrl: data.heroImageUrl || null,
        heroVideoUrl: data.heroVideoUrl || null,
        collectionType: data.collectionType ?? null,
        featured: data.featured,
        displayOrder: data.displayOrder,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        createdAt: now,
        updatedAt: now,
      };
      addCollection(newCollection);
      setCollectionProducts(newId, selectedProductIds);
      toast("Collection created!", "success");
    } else if (collection) {
      updateCollection(collection.id, {
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        heroImageUrl: data.heroImageUrl || null,
        heroVideoUrl: data.heroVideoUrl || null,
        collectionType: data.collectionType ?? null,
        featured: data.featured,
        displayOrder: data.displayOrder,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
      });
      setCollectionProducts(collection.id, selectedProductIds);
      toast("Collection updated!", "success");
    }

    router.push("/admin/collections");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Collection Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Title"
            placeholder="e.g. Old Money"
            error={errors.title?.message}
            {...register("title")}
          />
          <Input
            label="Slug"
            placeholder="auto-generated"
            error={errors.slug?.message}
            {...register("slug")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Collection Type
            </label>
            <select
              {...register("collectionType")}
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            >
              <option value="">None</option>
              <option value="featured">Featured</option>
              <option value="style">Style</option>
              <option value="seasonal">Seasonal</option>
              <option value="curated">Curated</option>
            </select>
          </div>
          <Input
            label="Display Order"
            type="number"
            min="0"
            error={errors.displayOrder?.message}
            {...register("displayOrder", { valueAsNumber: true })}
          />
          <Input
            label="Hero Image URL"
            placeholder="https://..."
            {...register("heroImageUrl")}
          />
          <Input
            label="Hero Video URL"
            placeholder="https://..."
            {...register("heroVideoUrl")}
          />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Collection description"
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            {...register("description")}
          />
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("featured")} className="rounded border-neutral-300" />
            Featured Collection
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <ProductPicker
          selectedIds={selectedProductIds}
          onChange={setSelectedProductIds}
        />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">SEO</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Meta Title" placeholder="Page title" {...register("metaTitle")} />
          <Input label="Meta Description" placeholder="Search description" {...register("metaDescription")} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" isLoading={isSubmitting} size="md">
          {mode === "create" ? "Create Collection" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/admin/collections")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
