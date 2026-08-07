"use client";

import { useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { useUIStore } from "@/lib/stores/ui-store";
import { useAuth } from "@/hooks/useAuth";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useScrolled(threshold = 50) {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("scroll", callback, { passive: true });
    return () => window.removeEventListener("scroll", callback);
  }, []);
  const getSnapshot = () => window.scrollY > threshold;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function Header() {
  const isScrolled = useScrolled();
  const mounted = useMounted();
  const toggleMobileNav = useUIStore((s) => s.toggleMobileNav);
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const openCart = useCartStore((s) => s.openCart);
  const { user } = useAuth();
  const getItemCount = useCartStore((s) => s.getItemCount);
  const cartCount = mounted ? getItemCount() : 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-brand-gradient shadow-luxury-lg"
          : "bg-brand-gradient"
      )}
    >
      <div className="container-luxury">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Left on mobile: Hamburger + Search */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={toggleMobileNav}
              className="flex h-10 w-10 items-center justify-center rounded-luxury-md text-white/80 transition-colors hover:text-white"
              aria-label="Open menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
              </svg>
            </button>
            <button
              onClick={toggleSearch}
              className="flex h-10 w-10 items-center justify-center rounded-luxury-md text-white/80 transition-colors hover:text-white"
              aria-label="Search"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>

          {/* Logo — stacked on mobile (centered), landscape on desktop (left) */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            {/* Mobile: icon logo */}
            <Image
              src="/images/logo/ISIVIS-Icon.png"
              alt="Maison ISIVIS"
              width={40}
              height={40}
              className="h-10 w-auto lg:hidden"
              priority
            />
            {/* Desktop: landscape logo */}
            <Image
              src="/images/logo/Logo-Landscape.png"
              alt="Maison ISIVIS"
              width={240}
              height={48}
              className="hidden h-12 w-auto lg:block"
              priority
            />
          </Link>

          {/* Desktop Navigation — next to logo */}
          <nav className="hidden lg:flex lg:items-center lg:gap-7" role="navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm font-medium uppercase tracking-luxury text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search — desktop only (mobile search is on left) */}
            <button
              onClick={toggleSearch}
              className="hidden h-10 w-10 items-center justify-center rounded-luxury-md text-white/80 transition-colors hover:text-white lg:flex"
              aria-label="Search"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            {/* Account */}
            <Link
              href={user ? "/account" : "/login"}
              className="hidden h-10 w-10 items-center justify-center rounded-luxury-md text-white/80 transition-colors hover:text-white sm:flex"
              aria-label={user ? "My Account" : "Sign In"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-luxury-md text-white/80 transition-colors hover:text-white"
              aria-label={`Cart (${cartCount} items)`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-purple">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
