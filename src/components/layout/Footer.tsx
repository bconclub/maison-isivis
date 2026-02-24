import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-brand-gradient text-white/60">
      {/* Brand tagline banner */}
      <div className="border-b border-white/10">
        <div className="container-luxury flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="font-script text-lg text-white/60">
            Turning Fantasy Into Reality
          </p>
          <p className="text-caption text-white/40">
            Explore our philanthropic work at{" "}
            <a
              href="https://rehvampfoundation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 underline transition-colors hover:text-white"
            >
              RehVamp Foundation
            </a>
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo + Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/Maison-ISIVIS.png"
                alt={SITE_NAME}
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-body-sm leading-relaxed">
              Maison ISIVIS. Handcrafted luxury fashion from our London
              atelier. Empowering women through elegance since 2021.
            </p>

            {/* Newsletter */}
            <form className="mt-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-luxury border border-white/15 bg-white/10 px-3.5 py-2.5 text-body-sm text-white placeholder:text-white/40 focus:border-brand-blue focus:outline-none focus:ring-[2px] focus:ring-brand-blue/20"
                  required
                />
                <button
                  type="submit"
                  className="rounded-luxury bg-brand-gradient px-5 py-2.5 text-caption font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-sm"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-white/30">
                By signing up you agree to our Terms &amp; Conditions. You can
                unsubscribe at anytime you wish.
              </p>
            </form>
          </div>

          {/* Column 2: Help */}
          <div>
            <h3 className="mb-4 font-heading text-base font-light uppercase tracking-luxury-wide text-white">
              Help
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Info */}
          <div>
            <h3 className="mb-4 font-heading text-base font-light uppercase tracking-luxury-wide text-white">
              Info
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="mb-4 font-heading text-base font-light uppercase tracking-luxury-wide text-white">
              Connect
            </h3>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.instagram && (
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/50 transition-all hover:bg-white/20 hover:text-white"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.youtube && (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/50 transition-all hover:bg-white/20 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Community CTA */}
            <div className="mt-6">
              <p className="text-body-sm text-white/40">
                Join 50,000+ women worldwide
              </p>
              <p className="mt-1 text-body-sm font-medium text-white/70">
                #maisonisivis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-luxury flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          {/* Left: Copyright */}
          <p className="text-caption text-white/40">
            &copy; 2021&ndash;{new Date().getFullYear()} {SITE_NAME}.
            Handcrafted in London.
          </p>

          {/* Center: Payment icons */}
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "Amex", "PayPal", "Razorpay"].map(
              (name) => (
                <span
                  key={name}
                  className="rounded border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/40"
                >
                  {name}
                </span>
              )
            )}
          </div>

          {/* Right: Tagline */}
          <p className="text-caption text-white/40">
            Empowering women through fashion
          </p>
        </div>
      </div>
    </footer>
  );
}
