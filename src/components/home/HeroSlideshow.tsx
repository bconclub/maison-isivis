"use client";

import Link from "next/link";

export function HeroSlideshow() {
  return (
    <section className="relative flex h-[85vh] items-end justify-center overflow-hidden bg-black sm:h-screen">
      {/* Hero Image — mobile */}
      <img
        src="/images/hero/mobile/Mobile Hero.webp"
        alt="Maison ISIVIS — Luxury fashion, handcrafted elegance"
        className="absolute inset-0 h-full w-full object-cover object-top sm:hidden"
      />

      {/* Hero Image — desktop */}
      <img
        src="/images/ISIVIS Hero.webp"
        alt="Maison ISIVIS — Luxury fashion, handcrafted elegance from our London atelier"
        className="absolute left-0 top-0 hidden w-full sm:block"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

      {/* Text + CTA — bottom center */}
      <div className="relative z-10 pb-24 text-center sm:pb-28">
        <h1 className="font-heading text-hero font-light leading-none text-white">
          Turning Fantasy
          <br />
          Into Reality
        </h1>
        <div className="mt-8">
          <Link
            href="/products"
            className="group inline-flex items-center justify-center gap-2 rounded-luxury bg-white/90 px-10 py-4 text-base font-medium uppercase tracking-luxury text-brand-purple shadow-luxury backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-luxury-lg"
          >
            Explore
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
    </section>
  );
}
