import type { Metadata } from "next";
import Image from "next/image";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { getFeaturedProducts, getBestsellerProducts, getProductsByCategorySlug, getProductBySlug, getProductsBySlugs } from "@/lib/data";
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

const FANTASY_SLUGS = ["victoria", "celestia-pearl-dress", "aria-embellished-set", "selene"];

// Hand-curated restock line-up, shown in carousel order
const BACK_IN_STOCK_SLUGS = [
  "scarlet-lace",
  "mary-sequinned-mini-skirt",
  "lumire-bandande-dress",
  "luna-strapless-diamente-bandage-dress",
  "noir-mini-dress",
  "elowen-white-embellished-dress",
  "eulalie",
];

// The one piece surfaced inside the hero. `featured` alone can't drive this —
// six products carry that flag — so the hero pick is named explicitly.
const HERO_FEATURE_SLUG = "isolde-navy-maxi-dress";

export default async function HomePage() {
  const [featuredProducts, bestsellerProducts, backInStockProducts, heroFeature, jewelleryProducts, swimwearProducts, ...fantasyProducts] =
    await Promise.all([
      getFeaturedProducts(),
      getBestsellerProducts(8),
      getProductsBySlugs(BACK_IN_STOCK_SLUGS),
      getProductBySlug(HERO_FEATURE_SLUG),
      getProductsByCategorySlug("jewellery", 12),
      getProductsByCategorySlug("swimwear", 12),
      ...FANTASY_SLUGS.map((slug) => getProductBySlug(slug)),
    ]);

  const fantasyGrid = fantasyProducts.filter(Boolean);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <HeroSlideshow featured={heroFeature} />

      {/* ===== FEATURED PRODUCTS CAROUSEL ===== */}
      <FeaturedCarousel products={featuredProducts} />

      {/* ===== FIND YOUR FANTASY ===== */}
      <section className="bg-neutral-50 section-spacing">
        <div className="container-luxury">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-h1 font-light uppercase tracking-luxury text-brand-purple/80">
              Find Your Fantasy
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {fantasyGrid.map((product) => (
              <ProductCard key={product!.id} product={product!} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== BACK IN STOCK ===== */}
      <CategoryCarousel
        products={backInStockProducts}
        eyebrow="Restocked by popular demand"
        title="Back In Stock"
        ctaLabel="Shop All"
        ctaHref="/products"
      />

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

      {/* ===== ATELIER IMAGE ===== */}
      {/* Was the hero still; moved down here once the hero became the brand
          film. Sits directly above Join The Queendom. */}
      <section className="relative bg-black">
        <Image
          src="/images/ISIVIS Hero.webp"
          alt="Maison ISIVIS — luxury fashion, handcrafted in our London atelier"
          width={1920}
          height={1080}
          sizes="100vw"
          className="h-auto w-full"
        />
      </section>

      {/* ===== ISIVIS COMMUNITY ===== */}
      <CommunityCarousel />

    </>
  );
}
