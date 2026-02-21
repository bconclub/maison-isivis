import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STYLE_COLLECTIONS } from "@/lib/constants";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { getFeaturedProducts, getBestsellerProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

// Always fetch fresh data so newly featured products appear immediately
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maison ISIVIS | Turning Fantasy Into Reality",
  description:
    "Handcrafted luxury fashion from our London atelier. Prêt-à-couture for the modern woman. Discover signature pieces, curated collections, and timeless elegance.",
};

// Collection cover images
const COLLECTION_IMAGES: Record<string, string> = {
  "old-money": "/images/collections/Old Money.webp",
  "fierce": "/images/collections/Feirce.webp",
  "ethereal": "/images/collections/Ethereal.webp",
  "contemporary": "/images/collections/Contemporary.webp",
};

// Override default collection links (slug → custom href)
const COLLECTION_LINK_OVERRIDES: Record<string, string> = {
  contemporary: "/products/aria-embellished-set",
};

export default async function HomePage() {
  const [featuredProducts, bestsellerProducts] = await Promise.all([
    getFeaturedProducts(),
    getBestsellerProducts(8),
  ]);

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
            <p className="font-script text-lg text-brand-blue">Explore</p>
            <h2 className="mt-2 font-heading text-h1 font-light uppercase tracking-luxury text-brand-purple/80">
              Find Your Fantasy
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {STYLE_COLLECTIONS.map((collection) => (
              <Link
                key={collection.slug}
                href={COLLECTION_LINK_OVERRIDES[collection.slug] ?? collection.href}
                className="group"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-luxury-md bg-neutral-200 transition-shadow duration-300 group-hover:shadow-luxury-xl">
                  {COLLECTION_IMAGES[collection.slug] ? (
                    <Image
                      src={COLLECTION_IMAGES[collection.slug]!}
                      alt={collection.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-300/30 to-neutral-400/50 transition-transform duration-500 group-hover:scale-105" />
                  )}
                  <div className="absolute inset-0 bg-brand-purple/0 transition-colors duration-300 group-hover:bg-brand-purple/15" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-12">
                    <h3 className="font-heading text-lg font-light text-white sm:text-xl">
                      {collection.label}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CUSTOMER FAVOURITES (BEST SELLERS) ===== */}
      {bestsellerProducts.length > 0 && (
        <section className="section-spacing bg-white">
          <div className="container-luxury">
            <div className="mb-12 text-center">
              <p className="font-script text-lg text-brand-blue">
                The pieces you love most
              </p>
              <h2 className="mt-2 font-heading text-h2 text-brand-purple">
                Customer Favourites
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {bestsellerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/collections/best-sellers"
                className="inline-flex items-center gap-2 rounded-luxury border-[1.5px] border-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all duration-300 hover:bg-brand-purple hover:text-white"
              >
                View All Best Sellers
              </Link>
            </div>
          </div>
        </section>
      )}

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
      <section className="section-spacing bg-brand-purple-10">
        <div className="container-luxury text-center">
          <h2 className="font-heading text-h1 font-light uppercase tracking-luxury text-brand-purple">
            ISIVIS Community
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-neutral-600">
            Tag us @maisonisivis and flaunt away turning everyone&apos;s fantasy
            into your reality
          </p>
          <p className="mt-4 font-heading text-xl font-medium tracking-wide text-brand-purple">
            #maisonisivis
          </p>

          {/* Community Photos */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { src: "/images/community/Commnity-1.webp", alt: "ISIVIS community look 1" },
              { src: "/images/community/Commnity-2.webp", alt: "ISIVIS community look 2" },
              { src: "/images/community/Commnity-3.webp", alt: "ISIVIS community look 3" },
              { src: "/images/community/Commnity-4.webp", alt: "ISIVIS community look 4" },
              { src: "/images/community/Commnity-5.webp", alt: "ISIVIS community look 5" },
              { src: "/images/community/Commnity-6.webp", alt: "ISIVIS community look 6" },
            ].map((photo) => (
              <div
                key={photo.src}
                className="group relative aspect-[3/4] overflow-hidden rounded-luxury-md bg-neutral-200"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
