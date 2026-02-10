import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Maison ISIVIS",
  description:
    "Established in 2021, Maison ISIVIS has emerged as a beacon of luxury fashion. Handcrafted prêt-à-couture from our London atelier.",
};

export default function AboutPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden sm:min-h-[60vh]">
        <div className="absolute inset-0 bg-brand-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
        <div className="container-luxury relative z-10 text-center">
          <p className="font-script text-lg text-white/70">Our Story</p>
          <Image
            src="/images/logo/Maison-ISIVIS.png"
            alt="Maison ISIVIS"
            width={240}
            height={80}
            className="mx-auto mt-4 h-16 w-auto sm:h-20"
            priority
          />
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-body-lg">
            Where Golden Age glamour meets modern sensuality
          </p>
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
              {/* Image placeholder */}
              <div className="w-full shrink-0 lg:w-2/5">
                <div className="aspect-[3/4] overflow-hidden rounded-luxury-md bg-neutral-200">
                  <div className="flex h-full items-center justify-center">
                    <p className="text-body-sm text-neutral-400">
                      Founder Image
                    </p>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div>
                <p className="font-script text-lg text-brand-blue">
                  Founded in 2021
                </p>
                <h2 className="mt-2 font-heading text-h2 text-brand-purple">
                  The Beginning
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-600">
                  <p>
                    Established in 2021, Maison ISIVIS has emerged as a beacon
                    of luxury fashion. Under founder Ishita Gupta&apos;s vision,
                    each piece is handcrafted in our London atelier using premium
                    natural materials&mdash;silk, cashmere, organic cotton,
                    luxurious vegan fur.
                  </p>
                  <p>
                    We celebrate femininity, strength, and individuality. Our
                    pr&ecirc;t-&agrave;-couture designs are for the woman who
                    demands quality, embraces confidence, and turns heads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE ATELIER ===== */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-script text-lg text-brand-blue">
              Handcrafted in London
            </p>
            <h2 className="mt-2 font-heading text-h2 text-brand-purple">
              The Atelier
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600">
              Every piece bearing the ISIVIS name is meticulously crafted in our
              London atelier. From initial sketch to final stitch, our artisans
              bring decades of couture expertise to each garment, ensuring
              uncompromising quality and attention to detail.
            </p>
          </div>

          {/* Image grid placeholder */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
            {["Sketching", "Cutting", "Stitching"].map((step) => (
              <div
                key={step}
                className="aspect-square overflow-hidden rounded-luxury-md bg-neutral-200"
              >
                <div className="flex h-full items-center justify-center">
                  <p className="text-body-sm text-neutral-400">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MATERIALS & SUSTAINABILITY ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            {/* Content */}
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <p className="font-script text-lg text-brand-blue">
                Premium natural materials
              </p>
              <h2 className="mt-2 font-heading text-h2 text-brand-purple">
                Sustainability
              </h2>
              <div className="mx-auto mt-6 max-w-md space-y-4 text-base leading-relaxed text-neutral-600 lg:mx-0">
                <p>
                  We source only the finest natural materials&mdash;silk,
                  cashmere, organic cotton, and luxurious vegan fur. Each fabric
                  is carefully selected for its quality, feel, and
                  sustainability.
                </p>
                <p>
                  Our commitment to responsible fashion means choosing materials
                  that are kind to the planet without compromising on the luxury
                  our clients expect.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-[4/3] overflow-hidden rounded-luxury-md bg-neutral-200">
                <div className="flex h-full items-center justify-center">
                  <p className="text-body-sm text-neutral-400">
                    Materials Image
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMPOWERMENT — REHVAMP FOUNDATION ===== */}
      <section
        id="rehvamp"
        className="relative overflow-hidden"
      >
        <div className="bg-brand-hero">
          <div className="container-luxury flex flex-col items-center gap-8 py-20 text-center sm:py-28 lg:flex-row lg:gap-16 lg:text-left">
            {/* Text */}
            <div className="lg:w-1/2">
              <p className="font-script text-lg text-white/70">
                Every purchase empowers women
              </p>
              <h2 className="mt-2 font-heading text-h1 font-light text-white">
                RehVamp Foundation
              </h2>
              <div className="mx-auto mt-4 max-w-md space-y-4 text-base leading-relaxed text-white/70 lg:mx-0">
                <p>
                  A portion of every sale supports RehVamp Foundation&mdash;our
                  UK charity dedicated to women&apos;s empowerment, education,
                  and sustainable development.
                </p>
                <p>
                  We believe fashion can be a force for good. Through RehVamp, we
                  fund programmes that give women the skills, resources, and
                  confidence to build their own futures.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-8 lg:justify-start">
                <div className="text-center">
                  <p className="font-heading text-h3 font-light text-white">
                    Women&apos;s
                  </p>
                  <p className="mt-1 text-caption uppercase tracking-luxury text-white/50">
                    Empowerment
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-h3 font-light text-white">
                    Education
                  </p>
                  <p className="mt-1 text-caption uppercase tracking-luxury text-white/50">
                    Access
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-h3 font-light text-white">
                    Sustainable
                  </p>
                  <p className="mt-1 text-caption uppercase tracking-luxury text-white/50">
                    Development
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="lg:w-1/2">
              <div className="mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-luxury-md bg-white/10 lg:max-w-none">
                <div className="flex h-full items-center justify-center">
                  <p className="text-body-sm text-white/40">
                    Foundation Image
                  </p>
                </div>
              </div>
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

      {/* ===== VALUES ===== */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-script text-lg text-brand-blue">Our Promise</p>
            <h2 className="mt-2 font-heading text-h2 text-brand-purple">
              What We Stand For
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: "Luxury",
                description:
                  "Premium materials, handcrafted details, signature packaging. Every touchpoint reflects our commitment to excellence.",
              },
              {
                title: "Empowerment",
                description:
                  "We celebrate femininity, strength, and individuality. Fashion that makes you feel powerful.",
              },
              {
                title: "Purpose",
                description:
                  "Every purchase supports women's empowerment through the RehVamp Foundation. Fashion with meaning.",
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <h3 className="font-heading text-h4 font-light text-brand-purple/80">
                  {value.title}
                </h3>
                <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury text-center">
          <p className="font-script text-lg text-brand-blue">
            Pr&ecirc;t-&agrave;-couture
          </p>
          <h2 className="mt-2 font-heading text-h2 text-brand-purple">
            Discover Our Collections
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-neutral-600">
            Explore our handcrafted pieces, each designed to celebrate the
            extraordinary woman you are.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-luxury bg-brand-gradient px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white shadow-luxury-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
            >
              Shop Now
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
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-luxury border-[1.5px] border-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all duration-300 hover:bg-brand-purple hover:text-white"
            >
              View Collections
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
