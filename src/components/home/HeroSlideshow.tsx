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
        {/* Three tracks, but only from xl. At lg the fixed film and pick
            tracks would leave the copy column 176px, and the panel's padding
            alone takes 80 of that — the heading is 317px. Below xl everything
            stacks instead. At 1280 the copy column lands at 476px, 396px
            inside the padding, which clears the heading with room to spare. */}
        <div className="grid min-h-[85vh] items-center gap-8 py-16 sm:min-h-screen xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)_minmax(0,280px)] xl:gap-10">
          {/* Copy — left. min-w-0 so the column can shrink; grid children
              default to min-width:auto and overflow instead. */}
          <div className="order-2 min-w-0 xl:order-1">
            {/* Frosted panel. The tint is dark, not white: the copy is white,
                so a light frost would lift the backdrop and cost contrast.
                Thinned to 40% with a light blur so the motif reads through the
                glass. Measured against the tiled motif's brightest stroke —
                rgb(214,205,245), brighter than the raw artwork — the heading
                sits at 5.00:1 and the sub-line at 4.71:1. */}
            <div className="rounded-luxury-lg border border-white/15 bg-brand-purple/40 p-8 text-center shadow-luxury-lg backdrop-blur-sm sm:p-10 lg:text-left">
              {/* Sized against the narrower three-track column: text-hero is
                  72px, where "Turning Fantasy" measures 476px in Italiana. */}
              <h1 className="font-heading text-h1 font-light leading-none text-white">
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
          </div>

          {/* Film — centre. Held at its native 464x848 portrait ratio and
              capped in width so it is never upscaled. */}
          <div className="order-1 xl:order-2">
            <div className="relative mx-auto aspect-[464/848] w-full max-w-[300px] overflow-hidden rounded-luxury-lg border border-white/15 bg-black/30 shadow-luxury-lg sm:max-w-[360px] xl:max-w-none">
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

          {/* Founder's Pick — right. Its own card, stacked: image above, then
              label, name, price and the link. Hidden entirely if the slug ever
              stops resolving. */}
          {featured && (
            <div className="order-3 mx-auto w-full max-w-[360px] xl:max-w-none">
              <div className="overflow-hidden rounded-luxury-lg border border-white/15 bg-brand-purple/40 shadow-luxury-lg backdrop-blur-sm">
                {/* Image slider. All frames stack and cross-fade, so the box
                    never reflows and nothing shifts as it advances. */}
                <Link
                  href={`/products/${featured.slug}`}
                  className="relative block aspect-[4/5] w-full overflow-hidden bg-brand-purple-80"
                >
                  {featuredImages.map((img, i) => (
                    <Image
                      key={img.url}
                      src={img.url}
                      alt={img.alt || featured.name}
                      fill
                      sizes="(max-width: 1024px) 360px, 300px"
                      className={`object-cover object-top transition-opacity duration-700 ${
                        i === slide ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Indicators, in brand colours rather than plain white */}
                  {slideCount > 1 && (
                    <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
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
                </Link>

                <div className="p-6">
                  <p className="text-caption font-medium uppercase tracking-luxury-wide text-white/70">
                    Founder&apos;s Pick
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-light leading-snug text-white">
                    {featured.name}
                  </h2>
                  <p className="mt-1 font-body text-body-lg text-white/95">
                    {formatPrice(featured.price)}
                  </p>

                  <Link
                    href={`/products/${featured.slug}`}
                    className="group mt-6 inline-flex items-center gap-2 text-caption font-medium uppercase tracking-luxury-wide text-white transition-colors hover:text-brand-blue-40"
                  >
                    View details
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
