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
            <div className="rounded-luxury-lg border border-white/15 bg-brand-purple/40 p-8 text-center shadow-luxury-lg backdrop-blur-sm sm:p-10 lg:text-left xl:p-8 2xl:p-10">
              {/* Sized against the narrower three-track column: text-hero is
                  72px, where "Turning Fantasy" measures 476px in Italiana. */}
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

          {/* Film — right, cut to a baroque mirror silhouette. Generated
              parametrically from a half-width profile smoothed with Catmull-Rom,
              so the shoulders, waist and hips undulate evenly and both axes
              mirror exactly. A clip path, not a
              border-radius: points and scallops are beyond what radii express.
              Held at the master's 464x848 ratio so it is never upscaled. */}
          <div className="order-1 xl:order-2">
            <div className="relative mx-auto aspect-[464/848] w-full max-w-[300px] sm:max-w-[360px] xl:max-w-none">
              {/* objectBoundingBox units so one path serves every width. The
                  container's fixed aspect keeps the curve from skewing. */}
              <svg width="0" height="0" className="absolute" aria-hidden>
                <defs>
                  <clipPath id="hero-arch" clipPathUnits="objectBoundingBox">
                    <path d="M0.5,0C0.51167,0.00167 0.535,0.00417 0.57,0.01C0.605,0.01583 0.645,0.02167 0.71,0.035C0.775,0.04833 0.92833,0.05917 0.96,0.09C0.99167,0.12083 0.89333,0.15167 0.9,0.22C0.90667,0.28833 1,0.40667 1,0.5C1,0.59333 0.90667,0.71167 0.9,0.78C0.89333,0.84833 0.99167,0.87917 0.96,0.91C0.92833,0.94083 0.775,0.95167 0.71,0.965C0.645,0.97833 0.605,0.98417 0.57,0.99C0.535,0.99583 0.51167,0.99833 0.5,1C0.48833,0.99833 0.465,0.99583 0.43,0.99C0.395,0.98417 0.355,0.97833 0.29,0.965C0.225,0.95167 0.07167,0.94083 0.04,0.91C0.00833,0.87917 0.10667,0.84833 0.1,0.78C0.09333,0.71167 0,0.59333 0,0.5C0,0.40667 0.09333,0.28833 0.1,0.22C0.10667,0.15167 0.00833,0.12083 0.04,0.09C0.07167,0.05917 0.225,0.04833 0.29,0.035C0.355,0.02167 0.395,0.01583 0.43,0.01C0.465,0.00417 0.48833,0.00167 0.5,0Z" />
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
                  d="M50,0C51.17,0.3 53.5,0.76 57,1.83C60.5,2.9 64.5,3.97 71,6.41C77.5,8.85 92.83,10.83 96,16.47C99.17,22.11 89.33,27.75 90,40.26C90.67,52.77 100,74.42 100,91.5C100,108.58 90.67,130.24 90,142.74C89.33,155.25 99.17,160.89 96,166.53C92.83,172.17 77.5,174.16 71,176.59C64.5,179.03 60.5,180.1 57,181.17C53.5,182.24 51.17,182.69 50,183C48.83,182.69 46.5,182.24 43,181.17C39.5,180.1 35.5,179.03 29,176.59C22.5,174.16 7.17,172.17 4,166.53C0.83,160.89 10.67,155.25 10,142.74C9.33,130.24 0,108.58 0,91.5C0,74.42 9.33,52.77 10,40.26C10.67,27.75 0.83,22.11 4,16.47C7.17,10.83 22.5,8.85 29,6.41C35.5,3.97 39.5,2.9 43,1.83C46.5,0.76 48.83,0.3 50,0Z"
                  fill="none"
                  stroke="rgb(214 205 245)"
                  strokeOpacity="0.5"
                  strokeWidth="0.7"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Small mute toggle, right-hand side. The cartouche tapers to a
                  point below 91% of its height, so a bottom-corner button
                  would sit outside the shape — it is held at 19% from the
                  bottom, inside the straight scalloped run. */}
              <button
                type="button"
                onClick={toggleSound}
                className="absolute bottom-[11%] right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple/70 text-white backdrop-blur-sm transition-colors hover:bg-brand-purple/90"
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
