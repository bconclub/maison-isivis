import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STYLE_COLLECTIONS } from "@/lib/constants";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

export const metadata: Metadata = {
  title: "Maison ISIVIS | Turning Fantasy Into Reality",
  description:
    "Handcrafted luxury fashion from our London atelier. Prêt-à-couture for the modern woman. Discover signature pieces, curated collections, and timeless elegance.",
};

// Placeholder data — will be replaced with real DB queries
const CATEGORY_CARDS = [
  {
    title: "Dresses",
    subtitle: "Elegance in Every Stitch",
    href: "/collections/dresses",
  },
  {
    title: "Co-ords",
    subtitle: "Matching Sets To Slay",
    href: "/collections/co-ords",
  },
  {
    title: "Tops",
    subtitle: "Statement Pieces",
    href: "/collections/tops",
  },
];

const COLLECTION_DESCRIPTIONS: Record<string, string> = {
  "best-sellers":
    "Our most loved pieces, chosen by women who know what they want.",
  "old-money": "Timeless elegance reimagined",
  fierce: "Bold statements for fearless women",
  contemporary: "Modern luxury meets classic sophistication",
};

// Collection cover images
const COLLECTION_IMAGES: Record<string, string> = {
  "old-money": "/images/collections/Old Money.webp",
  "fierce": "/images/collections/Feirce.webp",
  "ethereal": "/images/collections/Ethereal.webp",
  "contemporary": "/images/collections/Contemporary.webp",
};

const SHOWCASE_SECTIONS = [
  {
    title: "Embellished",
    scriptText: "Elegance",
    description:
      "Hand-beaded corsets, pearl-adorned gowns. Each piece is a work of art, meticulously crafted in our London atelier.",
    href: "/collections/old-money",
    cta: "Explore Collection",
    imagePosition: "left" as const,
  },
  {
    title: "Luxe",
    scriptText: "Crystals",
    description:
      "Rhinestone embellishments, show-stopping sparkle. For the woman who demands to be noticed.",
    href: "/collections/fierce",
    cta: "Shop Crystals",
    imagePosition: "right" as const,
  },
  {
    title: "Dreamy",
    scriptText: "Drapery",
    description:
      "Flowing silks, romantic ruffles, vintage-inspired cuts. Our draped pieces offer effortless sophistication for the modern muse.",
    href: "/collections/contemporary",
    cta: "Discover More",
    imagePosition: "left" as const,
  },
];

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

export default function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <HeroSlideshow />

      {/* ===== CATEGORY CARDS ROW ===== */}
      <section className="py-16 sm:py-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {CATEGORY_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative aspect-[4/5] overflow-hidden rounded-luxury-md bg-neutral-200"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-300/50 to-neutral-400/50 transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-brand-purple/0 transition-colors duration-300 group-hover:bg-brand-purple/20" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-heading text-xl font-light text-white sm:text-h4">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-body-sm text-white/80">
                    {card.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {/* ===== SIGNATURE PIECES — ALTERNATING SHOWCASES ===== */}
      <section className="bg-white">
        <div className="container-luxury py-16 text-center sm:py-20">
          <p className="font-script text-lg text-brand-blue">
            Handcrafted in London
          </p>
          <h2 className="mt-2 font-heading text-h2 text-brand-purple">
            Signature Pieces
          </h2>
        </div>
      </section>
      {SHOWCASE_SECTIONS.map((section, index) => (
        <section
          key={section.title}
          className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
        >
          <div className="container-luxury">
            <div
              className={`flex flex-col items-center gap-8 pb-16 sm:pb-24 lg:flex-row lg:gap-16 ${
                section.imagePosition === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full lg:w-[55%]">
                <div className="group relative aspect-[4/5] overflow-hidden rounded-luxury-md bg-neutral-200 lg:aspect-[3/4]">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-300/40 to-neutral-400/60 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-luxury-md bg-white/20 px-6 py-3 backdrop-blur-sm">
                      <p className="text-body-sm font-medium text-white/60">
                        Collection Image
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full text-center lg:w-[45%] lg:text-left">
                <h2 className="font-heading text-h2 text-brand-purple">
                  {section.title}{" "}
                  <span className="font-script text-brand-blue">
                    {section.scriptText}
                  </span>
                </h2>
                <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-neutral-600 lg:mx-0">
                  {section.description}
                </p>
                <Link
                  href={section.href}
                  className="group mt-8 inline-flex items-center gap-2 rounded-luxury bg-brand-gradient px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white shadow-luxury-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
                >
                  {section.cta}
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 12h14m-7-7 7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

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

      {/* ===== BRAND STORY — MAISON ISIVIS ===== */}
      <section className="relative overflow-hidden">
        <div className="bg-brand-hero">
          <div className="container-luxury flex flex-col items-center gap-8 py-20 text-center sm:py-28 lg:flex-row lg:gap-16 lg:text-left">
            {/* Text Side */}
            <div className="lg:w-1/2">
              <Image
                src="/images/logo/Maison-ISIVIS.png"
                alt="Maison ISIVIS"
                width={200}
                height={67}
                className="mx-auto mb-6 h-14 w-auto lg:mx-0"
              />
              <p className="font-script text-lg text-white/70">
                Where Golden Age glamour meets modern sensuality
              </p>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70 lg:mx-0">
                Established in 2021, Maison ISIVIS has emerged as a beacon of
                luxury fashion. Under founder Ishita Gupta&apos;s vision, each
                piece is handcrafted in our London atelier using premium natural
                materials&mdash;silk, cashmere, organic cotton, luxurious vegan
                fur.
              </p>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70 lg:mx-0">
                We celebrate femininity, strength, and individuality. Our
                pr&ecirc;t-&agrave;-couture designs are for the woman who
                demands quality, embraces confidence, and turns heads.
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 rounded-luxury bg-white px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
              >
                Our Story
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 12h14m-7-7 7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Image Side */}
            <div className="lg:w-1/2">
              <div className="mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-luxury-md bg-white/10 lg:max-w-none">
                <div className="flex h-full items-center justify-center">
                  <p className="text-body-sm text-white/40">Atelier Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMPOWERMENT — REHVAMP FOUNDATION ===== */}
      <section className="bg-brand-purple-10 section-spacing">
        <div className="container-luxury">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/3] overflow-hidden rounded-luxury-md bg-neutral-200">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-3 text-body-sm text-neutral-400">
                      Empowerment Image
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <p className="font-script text-lg text-brand-blue">
                Every purchase empowers women
              </p>
              <h2 className="mt-2 font-heading text-h2 text-brand-purple">
                More Than Fashion
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-neutral-600 lg:mx-0">
                A portion of every sale supports RehVamp Foundation&mdash;our UK
                charity dedicated to women&apos;s empowerment, education, and
                sustainable development. Fashion with purpose.
              </p>
              <Link
                href="/about#rehvamp"
                className="group mt-8 inline-flex items-center gap-2 rounded-luxury border-[1.5px] border-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all duration-300 hover:bg-brand-purple hover:text-white"
              >
                Learn About RehVamp
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 12h14m-7-7 7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
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

      {/* ===== SIGNATURE PACKAGING ===== */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-luxury">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/3] overflow-hidden rounded-luxury-md bg-neutral-200">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-3 text-body-sm text-neutral-400">
                      Signature Packaging
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <p className="font-script text-lg text-brand-blue">
                Maison ISIVIS
              </p>
              <h2 className="mt-2 font-heading text-h2 text-brand-purple">
                Signature Packaging
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-neutral-600 lg:mx-0">
                Every piece arrives in our luxurious signature packaging, making
                each delivery feel like unwrapping a gift. Because you deserve
                nothing less than extraordinary.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-8 lg:justify-start">
                <div className="text-center">
                  <p className="font-heading text-h3 font-light text-brand-purple/80">
                    130+
                  </p>
                  <p className="mt-1 text-caption uppercase tracking-luxury text-neutral-500">
                    Products
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-h3 font-light text-brand-purple/80">
                    50K+
                  </p>
                  <p className="mt-1 text-caption uppercase tracking-luxury text-neutral-500">
                    Community
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-h3 font-light text-brand-purple/80">
                    London
                  </p>
                  <p className="mt-1 text-caption uppercase tracking-luxury text-neutral-500">
                    Handcrafted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY / INSTAGRAM ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury text-center">
          <p className="font-script text-lg text-brand-blue">
            Join 50,000+ women worldwide who wear confidence
          </p>
          <h2 className="mt-2 font-heading text-h2 text-brand-purple">
            The ISIVIS Community
          </h2>
          <p className="mt-2 text-body-sm uppercase tracking-luxury text-neutral-400">
            #IsivisLondon
          </p>

          {/* Instagram Grid Placeholder */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-luxury-md bg-neutral-200"
              >
                <div className="flex h-full items-center justify-center">
                  <p className="text-caption text-neutral-400">@isivislondon</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="https://instagram.com/isivislondon"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-2 rounded-luxury border-[1.5px] border-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all duration-300 hover:bg-brand-purple hover:text-white"
          >
            Follow Our Journey @isivislondon
          </Link>
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
