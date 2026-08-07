"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export function HeroSlideshow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Browsers only allow autoplay while muted, so the film starts silent and
  // the viewer opts into the voiceover.
  const [muted, setMuted] = useState(true);

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
      {/* Brand pattern (011.png) as the hero field. On a tall narrow phone
          `cover` blows the motif up and crops it hard, which reads as noise
          behind the copy — so it is held back to 40% there and shown in full
          from sm up. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/images/brand/hero-pattern.webp')] bg-cover bg-center opacity-40 sm:opacity-100"
      />
      {/* Scrim. Unaided, white text over the brightest ornament strokes is
          1.77:1. With this it measures 6.65:1 on desktop and ~13:1 on mobile,
          where the pattern is also dimmed. */}
      <div aria-hidden className="absolute inset-0 bg-brand-purple/55" />

      <div className="container-luxury relative">
        <div className="grid min-h-[85vh] items-center gap-10 py-16 sm:min-h-screen lg:grid-cols-2 lg:gap-16">
          {/* Copy — left */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <h1 className="font-heading text-hero font-light leading-none text-white">
              Turning Fantasy
              <br />
              Into Reality
            </h1>
            <p className="mx-auto mt-6 max-w-md font-body text-body-lg text-white/80 lg:mx-0">
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

          {/* Film — right. Held at its native 464x848 portrait ratio and
              capped in width so it is never upscaled. */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[464/848] w-full max-w-[300px] overflow-hidden rounded-luxury bg-black/30 shadow-luxury-lg sm:max-w-[360px] lg:max-w-[420px]">
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="m23 9-6 6" />
                    <path d="m17 9 6 6" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
