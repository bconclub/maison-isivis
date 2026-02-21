import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STYLE_COLLECTIONS } from "@/lib/constants";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { getFeaturedProducts } from "@/lib/data";

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

const BESTSELLERS = [
  { name: "Selene", price: 198.99, badge: "Best Seller" },
  { name: "Victoria", price: 100, badge: null },
  { name: "Aurora", price: 166.95, badge: "New" },
  { name: "Celestial", price: 648.89, badge: "Best Seller" },
  { name: "Aria", price: 120, badge: null },
  { name: "Mia", price: 189, badge: "New" },
  { name: "Irena", price: 126, badge: null },
  { name: "Ivy", price: 120, badge: "Best Seller" },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

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
                href={collection.href}
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
            {BESTSELLERS.map((product) => (
              <Link
                key={product.name}
                href={`/products/${product.name.toLowerCase()}`}
                className="group"
              >
                <div className="relative aspect-product overflow-hidden rounded-luxury-md bg-neutral-200 transition-shadow duration-300 group-hover:shadow-luxury-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-300/30 to-neutral-400/40 transition-transform duration-500 group-hover:scale-105" />
                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-luxury bg-brand-purple px-2.5 py-1 text-[11px] font-medium uppercase tracking-luxury text-white">
                      {product.badge}
                    </span>
                  )}
                  <div
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-neutral-500 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                </div>

                <div className="mt-3 px-0.5">
                  <h3 className="font-heading text-base font-medium text-neutral-900 sm:text-lg">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 text-body-sm font-medium text-brand-purple">
                    &pound;{product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
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

      {/* ===== AS SEEN IN ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury text-center">
          <p className="text-caption font-medium uppercase tracking-luxury-wide text-neutral-400">
            Featured in leading fashion publications
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-12">
            {["Glamour", "Grazia"].map((pub) => (
              <span
                key={pub}
                className="font-heading text-h3 font-light tracking-wide text-neutral-300"
              >
                {pub}
              </span>
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
            Tag us @isivislondon and flaunt away turning everyone&apos;s fantasy
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

      {/* ===== NEWSLETTER ===== */}
      <section className="relative overflow-hidden bg-brand-purple-10">
        <div className="container-luxury section-spacing text-center">
          <p className="font-script text-lg text-brand-blue">
            Exclusive access to new arrivals, VIP sales, and styling tips
          </p>
          <h2 className="mt-2 font-heading text-h2 text-brand-purple">
            Join The ISIVIS Family
          </h2>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-luxury-md border border-neutral-200 bg-white px-4 py-3.5 text-base placeholder:text-neutral-400 focus:border-brand-blue focus:outline-none focus:ring-[3px] focus:ring-brand-blue/10"
              required
            />
            <button
              type="submit"
              className="rounded-luxury bg-brand-gradient px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white shadow-luxury-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-caption text-neutral-400">
            By subscribing, you agree to receive marketing emails. Unsubscribe
            anytime.
          </p>
        </div>
      </section>
    </>
  );
}
