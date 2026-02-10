"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const DESKTOP_SLIDES = [
  {
    src: "/images/hero/desktop/003-desktop.webp",
    alt: "Maison ISIVIS — Luxury fashion, handcrafted elegance from our London atelier",
  },
  {
    src: "/images/hero/desktop/002-desktop.webp",
    alt: "Maison ISIVIS — Luxury fashion, handcrafted elegance from our London atelier",
  },
];

const MOBILE_SLIDE = {
  src: "/images/hero/mobile/mobile-hero-black.png",
  alt: "Maison ISIVIS — Luxury fashion, handcrafted elegance",
};

const INTERVAL = 5000; // 5 seconds per slide

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % DESKTOP_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative flex h-screen items-end justify-center overflow-hidden bg-black">
      {/* Hero Image — mobile (single, cover from top) */}
      <img
        src={MOBILE_SLIDE.src}
        alt={MOBILE_SLIDE.alt}
        className="absolute inset-0 h-full w-full object-cover object-top sm:hidden"
      />

      {/* Hero Images — desktop (crossfade, width-fitted from top) */}
      {DESKTOP_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute left-0 top-0 hidden w-full transition-opacity duration-1000 ease-in-out sm:block ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

      {/* Slide indicators — desktop */}
      <div className="absolute bottom-44 left-1/2 z-10 hidden -translate-x-1/2 gap-2 sm:flex">
        {DESKTOP_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-8 bg-white"
                : "w-4 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

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
