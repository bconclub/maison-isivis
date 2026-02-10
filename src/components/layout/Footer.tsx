import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      {/* Brand tagline banner */}
      <div className="border-b border-neutral-800">
        <div className="container-luxury flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="font-script text-lg text-white/60">
            Turning Fantasy Into Reality
          </p>
          <p className="text-caption text-neutral-500">
            Proud supporter of RehVamp Foundation &mdash; Every purchase
            empowers women
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
              Maison ISIVIS &mdash; Handcrafted luxury fashion from our London
              atelier. Empowering women through elegance since 2021.
            </p>

            {/* Newsletter */}
            <form className="mt-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-luxury border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-body-sm text-white placeholder:text-neutral-500 focus:border-brand-blue focus:outline-none focus:ring-[2px] focus:ring-brand-blue/20"
                  required
                />
                <button
                  type="submit"
                  className="rounded-luxury bg-brand-gradient px-5 py-2.5 text-caption font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-sm"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-600">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all hover:bg-neutral-700 hover:text-white"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.facebook && (
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all hover:bg-neutral-700 hover:text-white"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.twitter && (
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all hover:bg-neutral-700 hover:text-white"
                  aria-label="Twitter"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.youtube && (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all hover:bg-neutral-700 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {SOCIAL_LINKS.tiktok && (
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-all hover:bg-neutral-700 hover:text-white"
                  aria-label="TikTok"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Community CTA */}
            <div className="mt-6">
              <p className="text-body-sm text-neutral-500">
                Join 50,000+ women worldwide
              </p>
              <p className="mt-1 text-body-sm font-medium text-white/70">
                #IsivisLondon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container-luxury flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          {/* Left: Copyright */}
          <p className="text-caption text-neutral-500">
            &copy; 2021&ndash;{new Date().getFullYear()} {SITE_NAME}.
            Handcrafted in London.
          </p>

          {/* Center: Payment icons */}
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "Amex", "PayPal", "Razorpay"].map(
              (name) => (
                <span
                  key={name}
                  className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500"
                >
                  {name}
                </span>
              )
            )}
          </div>

          {/* Right: Tagline */}
          <p className="text-caption text-neutral-500">
            Empowering women through fashion
          </p>
        </div>
      </div>
    </footer>
  );
}
