import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STYLE_COLLECTIONS } from "@/lib/constants";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { getFeaturedProducts, getBestsellerProducts, getProductsByCategorySlug, getProductsByCollectionSlug } from "@/lib/data";
import { CommunityCarousel } from "@/components/home/CommunityCarousel";
import { BestsellerCarousel } from "@/components/home/BestsellerCarousel";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { ProductCard } from "@/components/product/ProductCard";

// Always fetch fresh data so newly featured products appear immediately
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maison ISIVIS | Turning Fantasy Into Reality",
  description:
    "Handcrafted luxury fashion from our London atelier. Prêt-à-couture for the modern woman. Discover signature pieces, curated collections, and timeless elegance.",
};

export default async function HomePage() {
  const [
    featuredProducts,
    bestsellerProducts,
    jewelleryProducts,
    swimwearProducts,
    ...collectionProducts
  ] = await Promise.all([
    getFeaturedProducts(),
    getBestsellerProducts(8),
    getProductsByCategorySlug("jewellery", 12),
    getProductsByCategorySlug("swimwear", 12),
    ...STYLE_COLLECTIONS.map((c) => getProductsByCollectionSlug(c.slug, 4)),
  ]);

  // Map collection products by slug
  const collectionProductMap: Record<string, typeof featuredProducts> = {};
  STYLE_COLLECTIONS.forEach((c, i) => {
    collectionProductMap[c.slug] = collectionProducts[i] ?? [];
  });

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <HeroSlideshow />

      {/* ===== FEATURED PRODUCTS CAROUSEL ===== */}
      <FeaturedCarousel products={featuredProducts} />

      {/* ===== FIND YOUR FANTASY — STYLE COLLECTIONS ===== */}
      <section className="bg-neutral-50 section-spacing">
        <div className="container-luxury">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-h1 font-light uppercase tracking-luxury text-brand-purple/80">
              Find Your Fantasy
            </h2>
          </div>

          <div className="space-y-16">
            {STYLE_COLLECTIONS.map((collection) => {
              const products = collectionProductMap[collection.slug] ?? [];
              if (products.length === 0) return null;

              return (
                <div key={collection.slug}>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-heading text-h3 font-light text-neutral-800">
                      {collection.label}
                    </h3>
                    <Link
                      href={collection.href}
                      className="text-body-sm font-medium text-brand-purple transition-colors hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CUSTOMER FAVOURITES (BEST SELLERS) ===== */}
      <BestsellerCarousel products={bestsellerProducts} />

      {/* ===== JEWELLERY COLLECTION ===== */}
      <CategoryCarousel
        products={jewelleryProducts}
        eyebrow="Born of ISYA"
        title="The Isivis Icons"
        ctaLabel="See Collection"
        ctaHref="/collections/jewellery"
        bg="bg-neutral-50"
      />

      {/* ===== SUN-KISSED COLLECTION (SWIMWEAR) ===== */}
      <CategoryCarousel
        products={swimwearProducts}
        eyebrow="Resort-ready luxury"
        title="Golden Hour Goddess"
        ctaLabel="See Collection"
        ctaHref="/collections/swimwear"
      />

      {/* ===== AS SEEN IN ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury text-center">
          <p className="text-caption font-medium uppercase tracking-luxury-wide text-neutral-400">
            Featured in leading fashion publications
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-16">
            {[
              { name: "Glamour", src: "/images/press/Glamour-1.svg" },
              { name: "Grazia", src: "/images/press/Grazia-Logo.svg" },
            ].map((pub) => (
              <Image
                key={pub.name}
                src={pub.src}
                alt={`Featured in ${pub.name}`}
                width={140}
                height={40}
                className="h-8 w-auto opacity-40 grayscale transition-opacity duration-300 hover:opacity-70 sm:h-10"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ISIVIS COMMUNITY ===== */}
      <CommunityCarousel />

    </>
  );
}
