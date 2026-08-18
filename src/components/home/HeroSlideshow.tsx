"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function HeroSlideshow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  // Browsers only allow autoplay while muted, so the film starts silent and
  // the viewer opts into the voiceover.
  const [muted, setMuted] = useState(true);

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
        {/* Three tracks from xl, with the outer two equal (1fr each) so the
            film sits dead centre in the viewport. A fixed right track made the
            left column wider and pushed the film off-centre.
            Film track is 320px at xl and 380px at 2xl: at 1280 that leaves the
            copy column 416px — 352px inside p-8 — against a 317px heading. A
            wider film track there would clip it. */}
        <div className="grid items-center gap-8 py-16 sm:py-20 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)] xl:gap-12 2xl:gap-16">
          {/* Copy — left. min-w-0 so the column can shrink; grid children
              default to min-width:auto and overflow instead. */}
          <div className="order-2 min-w-0 xl:order-1">
            {/* Frosted panel. The tint is dark, not white: the copy is white,
                so a light frost would lift the backdrop and cost contrast.
                Thinned to 40% with a light blur so the motif reads through the
                glass. Measured against the tiled motif's brightest stroke —
                rgb(214,205,245), brighter than the raw artwork — the heading
                sits at 5.00:1 and the sub-line at 4.71:1. */}
            <div className="mx-auto max-w-xl rounded-luxury-lg border border-white/15 bg-brand-purple/40 p-8 text-center shadow-luxury-lg backdrop-blur-sm sm:p-10 lg:text-left xl:mx-0 xl:p-8 2xl:p-10">
              {/* max-w-xl on the panel keeps the copy from stretching across
                  the full 1fr column on a wide monitor. */}
              <h1 className="font-heading text-h1 font-light leading-none text-white">
                Turning Fantasy
                <br />
                Into Reality
              </h1>
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

          {/* Film — right, in a cusped frame: straight edges with corners
              that scoop inward to a point. Each corner is one cubic whose end
              tangents run perpendicular to the edges it joins, which is what
              produces the cusp. Straight edges matter — the earlier tapered
              silhouette cropped the footage badly. Held at the master's
              464x848 ratio so it is never upscaled. */}
          <div className="order-1 xl:order-2">
            <div className="relative mx-auto aspect-[464/848] w-full max-w-[300px] sm:max-w-[360px] xl:max-w-none">
              {/* objectBoundingBox units so one path serves every width. The
                  container's fixed aspect keeps the curve from skewing. */}
              <svg width="0" height="0" className="absolute" aria-hidden>
                <defs>
                  <clipPath id="hero-arch" clipPathUnits="objectBoundingBox">
                    <path d="M0.26,0L0.74,0C0.74,0.06885 0.766,0.0765 1,0.0765L1,0.9235C0.766,0.9235 0.74,0.93115 0.74,1L0.26,1C0.26,0.93115 0.234,0.9235 0,0.9235L0,0.0765C0.234,0.0765 0.26,0.06885 0.26,0Z" />
                  </clipPath>
                </defs>
              </svg>

              <div
                className="relative h-full w-full bg-black/30"
                style={{ clipPath: "url(#hero-arch)" }}
              >
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
                  {/* h264 only — a VP9/webm encode came out larger than the
                      mp4, so it earned no place. 2.9 MB master → 1.8 MB. */}
                  <source src="/video/isivis-hero.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Outline tracing the same path. Drawn as a sibling rather than
                  a border, since a clipped element cuts its own border off.
                  preserveAspectRatio="none" so it stretches with the box. */}
              <svg
                viewBox="0 0 100 183"
                preserveAspectRatio="none"
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <path
                  d="M27.2,1.2L72.8,1.2C72.8,13.8 75.4,15.2 98.8,15.2L98.8,167.8C75.4,167.8 72.8,169.2 72.8,181.8L27.2,181.8C27.2,169.2 24.6,167.8 1.2,167.8L1.2,15.2C24.6,15.2 27.2,13.8 27.2,1.2Z"
                  fill="none"
                  stroke="rgb(214 205 245)"
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M27.5,4.5L72.5,4.5C72.5,15.75 74.8,17 95.5,17L95.5,166C74.8,166 72.5,167.25 72.5,178.5L27.5,178.5C27.5,167.25 25.2,166 4.5,166L4.5,17C25.2,17 27.5,15.75 27.5,4.5Z"
                  fill="none"
                  stroke="rgb(214 205 245)"
                  strokeOpacity="0.3"
                  strokeWidth="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Small mute toggle, right-hand side. The cartouche tapers to a
                  corners scoop inward, so a button in the corner itself would
                  fall outside the shape. Held clear of the bottom cusp. */}
              <button
                type="button"
                onClick={toggleSound}
                className="absolute bottom-[13%] right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple/70 text-white backdrop-blur-sm transition-colors hover:bg-brand-purple/90"
                aria-label={muted ? "Unmute film" : "Mute film"}
                aria-pressed={!muted}
              >
                {muted ? (
                  <svg
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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
        </div>
      </div>
    </section>
  );
}
