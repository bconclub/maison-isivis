"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const DESKTOP_SLIDES = [
  {
    src: "/images/Isivis HEader.webp",
    alt: "Maison ISIVIS — Luxury fashion, handcrafted elegance from our London atelier",
  },
];

const MOBILE_SLIDES = [
  {
    src: "/images/hero/mobile/cover image 001.webp",
    alt: "Maison ISIVIS — Luxury fashion collection",
  },
  {
    src: "/images/hero/mobile/ISivis Mobile header.jpeg",
    alt: "Maison ISIVIS — Handcrafted elegance",
  },
];

const INTERVAL = 5000; // 5 seconds per slide

export function HeroSlideshow() {
  const [activeDesktop, setActiveDesktop] = useState(0);
  const [activeMobile, setActiveMobile] = useState(0);

  const nextDesktop = useCallback(() => {
    setActiveDesktop((i) => (i + 1) % DESKTOP_SLIDES.length);
  }, []);

  const nextMobile = useCallback(() => {
    setActiveMobile((i) => (i + 1) % MOBILE_SLIDES.length);
  }, []);

  useEffect(() => {
    const desktopTimer = setInterval(nextDesktop, INTERVAL);
    const mobileTimer = setInterval(nextMobile, INTERVAL);
    return () => {
      clearInterval(desktopTimer);
      clearInterval(mobileTimer);
    };
  }, [nextDesktop, nextMobile]);

  return (
    <section className="relative flex h-[85vh] items-end justify-center overflow-hidden bg-black sm:h-screen">
      {/* Hero Images — mobile (crossfade slider) */}
      {MOBILE_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out sm:hidden ${
            i === activeMobile ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Hero Images — desktop (crossfade, width-fitted from top) */}
      {DESKTOP_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute left-0 top-0 hidden w-full transition-opacity duration-1000 ease-in-out sm:block ${
            i === activeDesktop ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

      {/* Slide indicators — mobile */}
      {MOBILE_SLIDES.length > 1 && (
        <div className="absolute bottom-44 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:hidden">
          {MOBILE_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveMobile(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeMobile
                  ? "w-8 bg-white"
                  : "w-4 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide indicators — desktop */}
      {DESKTOP_SLIDES.length > 1 && (
        <div className="absolute bottom-44 left-1/2 z-10 hidden -translate-x-1/2 gap-2 sm:flex">
          {DESKTOP_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveDesktop(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeDesktop
                  ? "w-8 bg-white"
                  : "w-4 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

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
