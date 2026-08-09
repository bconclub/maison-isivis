"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface HeroSlideshowProps {
  /** The single piece surfaced in the hero. Omitted, the hero just drops it. */
  featured?: Product;
}

export function HeroSlideshow({ featured }: HeroSlideshowProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  // Browsers only allow autoplay while muted, so the film starts silent and
  // the viewer opts into the voiceover.
  const [muted, setMuted] = useState(true);
  const [slide, setSlide] = useState(0);

  const featuredImages = featured?.images ?? [];
  const slideCount = featuredImages.length;

  // Advance the Founder's Pick every 2s. Depends on the count, not the array,
  // so a new object identity each render doesn't restart the timer mid-cycle.
  useEffect(() => {
    if (slideCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setSlide((s) => (s + 1) % slideCount),
      2000,
    );
    return () => window.clearInterval(id);
  }, [slideCount]);

  // Parallax. Shifts background-position rather than transforming the layer:
  // the motif repeats, so panning it can never expose an edge, and it needs
  // no oversized element. Written straight to the DOM inside rAF so scrolling
  // doesn't re-render the hero on every frame.
  useEffect(() => {
    const el = patternRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.backgroundPositionY = `${window.scrollY * 0.35}px`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    // Set the DOM property inside the click handler so the browser still sees
    // a user gesture; React re-applies the same value from `muted={muted}`.
    v.muted = next;
    setMuted(next);
    // A paused video (iOS low-power mode) needs a nudge, and this tap is the
    // gesture that permits it.
    if (!next && v.paused) v.play().catch(() => {});
  }

  return (
    <section className="relative overflow-hidden bg-brand-purple">
      {/* Brand motif, tiled. Drawn from 011.png: the artwork repeats every
          284x377px, so that block was cut out, high-passed to drop its radial
          gradient, and reduced to an alpha mask. It tiles cleanly (seam error
          6.9 horizontal / 9.0 vertical) which the full artwork could not.
          Scrolls slower than the page for parallax. */}
      <div
        ref={patternRef}
        aria-hidden
        className="absolute inset-0 bg-[url('/images/brand/motif-tile.png')] bg-[length:150px_199px] bg-repeat sm:bg-[length:200px_266px]"
      />
      {/* Light scrim only, to seat the pattern against the brand purple. */}
      <div aria-hidden className="absolute inset-0 bg-brand-purple/15" />

      <div className="container-luxury relative">
        <div className="grid min-h-[85vh] items-center gap-10 py-16 sm:min-h-screen lg:grid-cols-2 lg:gap-16">
          {/* Copy — left. min-w-0 so the column can shrink; grid children
              default to min-width:auto and overflow instead. */}
          <div className="order-2 min-w-0 lg:order-1">
            {/* Frosted panel. The tint is dark, not white: the copy is white,
                so a light frost would lift the backdrop and cost contrast.
                Thinned to 40% with a light blur so the motif reads through the
                glass. Measured against the tiled motif's brightest stroke —
                rgb(214,205,245), brighter than the raw artwork — the heading
                sits at 5.00:1 and the sub-line at 4.71:1. The sub-line carries
                the extra weight instead of the panel, which is what lets the
                frost come down. */}
            <div className="rounded-luxury-lg border border-white/15 bg-brand-purple/40 p-8 text-center shadow-luxury-lg backdrop-blur-sm sm:p-10 lg:text-left">
              {/* Steps up only at 2xl. text-hero is 72px, where "Turning
                  Fantasy" measures 476px in Italiana; the panel's padding
                  takes 80px off the column, leaving only 496px at xl. */}
              <h1 className="font-heading text-h1 font-light leading-none text-white 2xl:text-hero">
                Turning Fantasy
                <br />
                Into Reality
              </h1>
              <p className="mx-auto mt-6 max-w-md font-body text-body-lg text-white/95 lg:mx-0">
                Prêt-à-couture from our London atelier.
              </p>
              <div className="mt-10">
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

            {/* Founder's Pick — its own piece, sitting apart from the copy
                panel rather than nested inside it. Carries its own glass so it
                still reads against the motif. Hidden entirely if the slug ever
                stops resolving. */}
            {featured && (
              <div className="mt-6 rounded-luxury-lg border border-white/15 bg-brand-purple/40 p-6 shadow-luxury-lg backdrop-blur-sm sm:p-7">
                <p className="text-caption font-medium uppercase tracking-luxury-wide text-white/70">
                  Founder&apos;s Pick
                </p>

                <Link
                  href={`/products/${featured.slug}`}
                  className="group mt-4 flex items-center gap-4 text-left"
                >
                  {/* Image slider. All frames stack and cross-fade, so the
                        box never reflows and nothing shifts as it advances. */}
                  <span className="relative block h-[112px] w-[84px] flex-shrink-0 overflow-hidden rounded-luxury-md bg-brand-purple-80">
                    {featuredImages.map((img, i) => (
                      <Image
                        key={img.url}
                        src={img.url}
                        alt={img.alt || featured.name}
                        fill
                        sizes="84px"
                        className={`object-cover object-top transition-opacity duration-700 ${
                          i === slide ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </span>

                  <span className="min-w-0">
                    {/* Wraps rather than truncates: at 375px this column is
                          ~159px wide, which would cut the name mid-word. */}
                    <span className="block font-heading text-lg font-light leading-snug text-white sm:text-xl">
                      {featured.name}
                    </span>
                    <span className="mt-1 block font-body text-sm text-white/95">
                      {formatPrice(featured.price)}
                    </span>

                    {/* Indicators, in brand colours rather than plain white */}
                    {featuredImages.length > 1 && (
                      <span className="mt-3 flex gap-1.5">
                        {featuredImages.map((img, i) => (
                          <span
                            key={img.url}
                            className={`block h-1 rounded-full transition-all duration-500 ${
                              i === slide
                                ? "w-6 bg-brand-blue-40"
                                : "w-2 bg-brand-purple-20/60"
                            }`}
                          />
                        ))}
                      </span>
                    )}
                  </span>

                  <svg
                    className="ml-auto h-5 w-5 flex-shrink-0 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
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
            )}
          </div>

          {/* Film — right. Held at its native 464x848 portrait ratio and
              capped in width so it is never upscaled. */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[464/848] w-full max-w-[300px] overflow-hidden rounded-luxury-lg bg-black/30 shadow-luxury-lg sm:max-w-[360px] lg:max-w-[420px]">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster="/video/isivis-hero-poster.webp"
                autoPlay
                muted={muted}
                loop
                playsInline
                preload="metadata"
                aria-label="Maison ISIVIS brand film"
              >
                {/* h264 only — a VP9/webm encode came out larger than the mp4,
                    so it earned no place. 2.9 MB master → 1.8 MB. */}
                <source src="/video/isivis-hero.mp4" type="video/mp4" />
              </video>

              <button
                type="button"
                onClick={toggleSound}
                className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label={muted ? "Unmute video" : "Mute video"}
                aria-pressed={!muted}
              >
                {muted ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="m23 9-6 6" />
                    <path d="m17 9 6 6" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M19 5a9 9 0 0 1 0 14" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
