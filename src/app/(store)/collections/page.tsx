import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, STYLE_COLLECTIONS } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Collections | Maison ISIVIS",
  description:
    "Browse our luxury fashion collections. Shop by category or explore our curated style edits from the Maison ISIVIS atelier.",
};

const COLLECTION_IMAGES: Record<string, string> = {
  "old-money": "/images/collections/Old MOney.webp",
};

export default function CollectionsPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Collections" }]} className="mb-6" />

      <h1 className="font-heading text-h1 font-bold text-neutral-900">
        Collections
      </h1>
      <p className="mt-3 max-w-2xl text-body-sm leading-relaxed text-neutral-500">
        Explore our handcrafted luxury fashion. Browse by category or discover
        our curated style edits — each piece designed in our London atelier.
      </p>

      {/* Shop By Category */}
      <section className="mt-12">
        <h2 className="mb-6 font-heading text-h3 font-semibold text-neutral-900">
          Shop By Category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-luxury-md bg-neutral-100"
            >
              {/* Placeholder gradient — will be replaced with real images */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/20 via-brand-purple/40 to-brand-purple/80 transition-all duration-500 group-hover:from-brand-purple/30 group-hover:via-brand-purple/50 group-hover:to-brand-purple/90" />
              <div className="absolute inset-0 flex items-end p-5">
                <div>
                  <h3 className="font-heading text-h4 font-semibold text-white sm:text-h3">
                    {cat.label}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-caption font-medium uppercase tracking-luxury text-white/70 transition-colors group-hover:text-white">
                    Shop Now
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Style Collections */}
      <section className="mt-16">
        <h2 className="mb-6 font-heading text-h3 font-semibold text-neutral-900">
          Style Edits
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {STYLE_COLLECTIONS.map((col) => {
            const heroImage = COLLECTION_IMAGES[col.slug];

            return (
              <Link
                key={col.slug}
                href={col.href}
                className="group relative aspect-[16/9] overflow-hidden rounded-luxury-md bg-neutral-100 sm:aspect-[2/1]"
              >
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={col.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/30 via-brand-blue/20 to-brand-purple/50 transition-all duration-500 group-hover:from-brand-purple/40 group-hover:via-brand-blue/30 group-hover:to-brand-purple/60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <h3 className="font-heading text-h3 font-semibold text-white sm:text-h2">
                      {col.label}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-body-sm text-white/70 transition-colors group-hover:text-white">
                      Explore Collection
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
