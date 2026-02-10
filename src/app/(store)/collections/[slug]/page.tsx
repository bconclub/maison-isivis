import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCollectionBySlug,
  getAllProducts,
} from "@/lib/data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CollectionClient } from "./CollectionClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Hero image map for categories and collections
const HERO_IMAGES: Record<string, string> = {
  "old-money": "/images/collections/Old MOney.webp",
};

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const collection = !category ? await getCollectionBySlug(slug) : null;

  const title = category?.name ?? collection?.title ?? "Collection";
  const desc =
    category?.metaDescription ??
    collection?.metaDescription ??
    `Shop ${title} at Maison ISIVIS. Handcrafted luxury fashion from our London atelier.`;

  return {
    title: `${title} | Maison ISIVIS`,
    description: desc,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const collection = !category ? await getCollectionBySlug(slug) : null;

  if (!category && !collection) {
    notFound();
  }

  // Fetch all products from Supabase for client-side filtering
  const allProducts = await getAllProducts();

  const title = category?.name ?? collection?.title ?? "Collection";
  const heroImage = HERO_IMAGES[slug] ?? collection?.heroImageUrl ?? category?.imageUrl;

  return (
    <>
      {/* Hero Banner */}
      {heroImage && (
        <div className="relative h-48 overflow-hidden sm:h-64 lg:h-80">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/70 via-brand-purple/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-luxury pb-8">
              <h1 className="font-heading text-h1 font-bold text-white sm:text-display-sm">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="container-luxury py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Collections", href: "/collections" },
            { label: title },
          ]}
          className="mb-6"
        />

        <Suspense fallback={<CollectionLoadingSkeleton />}>
          <CollectionClient
            category={category ?? undefined}
            collection={collection ?? undefined}
            slug={slug}
            allProducts={allProducts}
          />
        </Suspense>
      </div>
    </>
  );
}

function CollectionLoadingSkeleton() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="flex gap-10">
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-6 animate-pulse rounded bg-neutral-200" />
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] animate-pulse rounded-luxury-md bg-neutral-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
