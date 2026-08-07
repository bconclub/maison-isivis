"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export function HeroSlideshow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Browsers only allow autoplay while muted, so the video starts silent and
  // the viewer opts into the voiceover.
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    // Set the DOM property inside the click handler so the browser still sees
    // a user gesture; React re-applies the same value from `muted={muted}` on
    // the next render, which is what keeps the two in sync.
    v.muted = next;
    setMuted(next);
    // A paused video (iOS low-power mode) needs a nudge, and this tap is the
    // gesture that permits it.
    if (!next && v.paused) v.play().catch(() => {});
  }

  return (
    <section className="relative flex h-[85vh] items-end justify-center overflow-hidden bg-black sm:h-screen">
      {/* Hero video — mobile. The master is 464x848, which fits a phone
          viewport natively but would upscale badly on desktop, so desktop
          keeps the still until a landscape master exists. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-top sm:hidden"
        poster="/video/isivis-hero-poster.webp"
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label="Maison ISIVIS brand film"
      >
        {/* h264 only — a VP9/webm encode came out larger than the mp4 here,
            so it earned no place. 2.9 MB master → 1.8 MB. */}
        <source src="/video/isivis-hero.mp4" type="video/mp4" />
      </video>

      {/* Hero Image — desktop */}
      <img
        src="/images/ISIVIS Hero.webp"
        alt="Maison ISIVIS — Luxury fashion, handcrafted elegance from our London atelier"
        className="absolute left-0 top-0 hidden w-full sm:block"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

      {/* Sound toggle — mobile only, where the video plays */}
      <button
        type="button"
        onClick={toggleSound}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 sm:hidden"
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
