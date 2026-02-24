"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

const COMMUNITY_PHOTOS = [
  { src: "/images/community/Commnity-1.webp", alt: "ISIVIS community look 1" },
  { src: "/images/community/Commnity-2.webp", alt: "ISIVIS community look 2" },
  { src: "/images/community/Commnity-3.webp", alt: "ISIVIS community look 3" },
  { src: "/images/community/Commnity-4.webp", alt: "ISIVIS community look 4" },
  { src: "/images/community/Commnity-5.webp", alt: "ISIVIS community look 5" },
  { src: "/images/community/Commnity-6.webp", alt: "ISIVIS community look 6" },
];

export function CommunityCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollSpeed = 0.5; // pixels per frame

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const [grabbing, setGrabbing] = useState(false);

  // Pause state: paused when hovering OR dragging
  const isPaused = useRef(false);
  // Resume auto-scroll after drag ends (with a small delay)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Duplicate photos for seamless infinite loop
  const photos = [...COMMUNITY_PHOTOS, ...COMMUNITY_PHOTOS];

  // --- Auto-scroll ---
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (el && !isPaused.current) {
      el.scrollLeft += scrollSpeed;

      // When we've scrolled past the first set, jump back seamlessly
      const halfWidth = el.scrollWidth / 2;
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [scrollSpeed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [animate]);

  // --- Hover pause ---
  function handleMouseEnter() {
    if (!isDragging.current) isPaused.current = true;
  }
  function handleMouseLeave() {
    if (!isDragging.current) isPaused.current = false;
    // If mouse leaves while dragging, end the drag
    if (isDragging.current) endDrag();
  }

  // --- Drag-to-scroll ---
  function startDrag(clientX: number) {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    isPaused.current = true;
    setGrabbing(true);
    dragStartX.current = clientX;
    dragScrollLeft.current = el.scrollLeft;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }

  function moveDrag(clientX: number) {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = clientX - dragStartX.current;
    el.scrollLeft = dragScrollLeft.current - dx;

    // Seamless loop during drag
    const halfWidth = el.scrollWidth / 2;
    if (el.scrollLeft >= halfWidth) {
      el.scrollLeft -= halfWidth;
      dragScrollLeft.current -= halfWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += halfWidth;
      dragScrollLeft.current += halfWidth;
    }
  }

  function endDrag() {
    if (!isDragging.current) return;
    isDragging.current = false;
    setGrabbing(false);
    // Resume auto-scroll after a short delay
    resumeTimer.current = setTimeout(() => {
      isPaused.current = false;
    }, 2000);
  }

  // Mouse events
  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    startDrag(e.clientX);
  }
  function onMouseMove(e: React.MouseEvent) {
    moveDrag(e.clientX);
  }
  function onMouseUp() {
    endDrag();
  }

  // Touch events
  function onTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (touch) startDrag(touch.clientX);
  }
  function onTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (touch) moveDrag(touch.clientX);
  }
  function onTouchEnd() {
    endDrag();
  }

  return (
    <section className="section-spacing bg-brand-blue-20">
      <div className="text-center">
        {/* Header — constrained */}
        <div className="container-luxury">
          <h2 className="font-heading text-h1 font-light uppercase tracking-luxury text-brand-purple">
            Join The Queendom
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-neutral-600">
            Tag us @maisonisivis and flaunt away turning everyone&apos;s fantasy
            into your reality
          </p>
          <p className="mt-4 font-heading text-xl font-medium tracking-wide text-brand-purple">
            #maisonisivis
          </p>
        </div>

        {/* Carousel — full bleed, draggable + auto-scroll */}
        <div
          className="relative mt-10 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={scrollRef}
            className={`scrollbar-hide flex gap-3 overflow-x-hidden select-none sm:gap-4 ${
              grabbing ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {photos.map((photo, i) => (
              <div
                key={`${photo.src}-${i}`}
                className="group relative aspect-[3/4] w-[45%] flex-shrink-0 overflow-hidden rounded-luxury-md bg-neutral-200 sm:w-[30%] lg:w-[22%] xl:w-[18%]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  draggable={false}
                  className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                />
                {/* Hover overlay with Instagram icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-brand-purple/0 transition-all duration-300 group-hover:bg-brand-purple/20">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 transition-all duration-300 drop-shadow-lg group-hover:opacity-100"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
