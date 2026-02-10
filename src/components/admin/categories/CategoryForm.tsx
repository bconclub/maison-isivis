"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/lib/admin-validations";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types/product";

interface CategoryFormProps {
  category?: Category;
  mode: "create" | "edit";
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter();
  const addCategory = useAdminStore((s) => s.addCategory);
  const updateCategory = useAdminStore((s) => s.updateCategory);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description,
          imageUrl: category.imageUrl,
          parentId: category.parentId,
          showInMenu: category.showInMenu,
          displayOrder: category.displayOrder,
          metaTitle: category.metaTitle,
          metaDescription: category.metaDescription,
        }
      : {
          showInMenu: true,
          displayOrder: 0,
        },
  });

  const nameValue = watch("name");
  useEffect(() => {
    if (mode === "create" && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, mode, setValue]);

  async function onSubmit(data: CategoryFormData) {
    const now = new Date().toISOString();

    if (mode === "create") {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        imageUrl: data.imageUrl || null,
        parentId: data.parentId || null,
        showInMenu: data.showInMenu,
        displayOrder: data.displayOrder,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        createdAt: now,
        updatedAt: now,
      };
      addCategory(newCategory);
      toast("Category created!", "success");
    } else if (category) {
      updateCategory(category.id, {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        imageUrl: data.imageUrl || null,
        parentId: data.parentId || null,
        showInMenu: data.showInMenu,
        displayOrder: data.displayOrder,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
      });
      toast("Category updated!", "success");
    }

    router.push("/admin/categories");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">
          Category Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Category Name"
            placeholder="e.g. Dresses"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Slug"
            placeholder="auto-generated"
            error={errors.slug?.message}
            {...register("slug")}
          />
          <Input
            label="Display Order"
            type="number"
            min="0"
            error={errors.displayOrder?.message}
            {...register("displayOrder", { valueAsNumber: true })}
          />
          <Input
            label="Image URL"
            placeholder="https://..."
            {...register("imageUrl")}
          />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Category description"
            className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
            {...register("description")}
          />
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" {...register("showInMenu")} className="rounded border-neutral-300" />
            Show in Navigation Menu
          </label>
        </div>
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
          {mode === "create" ? "Create Category" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
