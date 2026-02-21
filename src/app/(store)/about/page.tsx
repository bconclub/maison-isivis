import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Maison ISIVIS",
  description:
    "Founded in London in 2021, Maison ISIVIS is a luxury fashion house built for the modern woman. Prêt-à-couture pieces that blend Golden Age elegance with contemporary sensuality.",
};

const PRINCIPLES = [
  {
    title: "Empowering Women",
    description:
      "Every purchase supports women\u2019s causes through our foundation, RehVamp.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    title: "Uncompromised Quality",
    description:
      "Each piece is handcrafted with meticulous attention to detail.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  },
  {
    title: "Sustainability First",
    description:
      "Eco-friendly materials and production practices to reduce our footprint.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
        <path d="M7 12a5 5 0 0 1 5-5" />
        <path d="M12 17a5 5 0 0 0 5-5" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "2021", label: "Founded" },
  { value: "30+", label: "Global Associates" },
  { value: "50,000+", label: "Customers Worldwide" },
];

export default function AboutPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden sm:min-h-[60vh]">
        <div className="absolute inset-0 bg-brand-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
        <div className="container-luxury relative z-10 text-center">
          <p className="font-script text-lg text-white/70">Our Story</p>
          <h1 className="mt-4 font-heading text-h1 font-light uppercase tracking-luxury text-white">
            About Us
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-body-lg">
            Where Golden Age glamour meets modern sensuality
          </p>
        </div>
      </section>

      {/* ===== BRAND INTRO ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-script text-lg text-brand-blue">
              Turning Fantasy Into Reality
            </p>
            <h2 className="mt-2 font-heading text-h2 text-brand-purple">
              Maison ISIVIS
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600">
              Founded in London in 2021, Maison ISIVIS is a luxury fashion house
              built for the modern woman. We design pr&ecirc;t-&agrave;-couture
              pieces that blend Golden Age elegance with contemporary sensuality,
              handcrafted in our London atelier using premium
              materials: silk, cashmere, organic cotton, wool, and luxurious
              vegan fur.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-luxury">
          <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-2">
            {/* Mission */}
            <div className="text-center sm:text-left">
              <p className="font-script text-lg text-brand-blue">
                What drives us
              </p>
              <h2 className="mt-2 font-heading text-h3 text-brand-purple">
                Our Mission
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                To empower women through fashion, one piece at a time. Every
                design is crafted to make women feel confident, beautiful, and
                unstoppable.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center sm:text-left">
              <p className="font-script text-lg text-brand-blue">
                Where we&apos;re headed
              </p>
              <h2 className="mt-2 font-heading text-h3 text-brand-purple">
                Our Vision
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                To build a global community of women who embrace individuality,
                uplift each other, and express their strength through style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Founder image */}
            <div className="w-full shrink-0 lg:w-2/5">
              <div className="aspect-[3/4] overflow-hidden rounded-luxury-md bg-neutral-200">
                <div className="flex h-full items-center justify-center">
                  <p className="text-body-sm text-neutral-400">
                    Ishita Gupta
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center lg:text-left">
              <p className="font-script text-lg text-brand-blue">
                The woman behind the brand
              </p>
              <h2 className="mt-2 font-heading text-h2 text-brand-purple">
                Our Founder
              </h2>
              <div className="mx-auto mt-6 max-w-lg space-y-4 text-base leading-relaxed text-neutral-600 lg:mx-0">
                <p>
                  Ishita Gupta, born in India, educated across Delhi, Kolkata,
                  Dubai, and London. A model, actress, and entrepreneur who
                  launched Maison ISIVIS while studying at LAMDA.
                </p>
                <p>
                  Her bold vision has made ISIVIS a staple for women across the
                  Middle East and Britain&mdash;a brand that celebrates
                  confidence, individuality, and the power of feminine strength.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR PRINCIPLES ===== */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-script text-lg text-brand-blue">
              What we believe
            </p>
            <h2 className="mt-2 font-heading text-h2 text-brand-purple">
              Our Principles
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple/5 text-brand-purple">
                  {principle.icon}
                </div>
                <h3 className="mt-4 font-heading text-h4 font-light text-brand-purple/80">
                  {principle.title}
                </h3>
                <p className="mt-3 text-body-sm leading-relaxed text-neutral-600">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR IMPACT ===== */}
      <section className="relative overflow-hidden">
        <div className="bg-brand-hero">
          <div className="container-luxury py-20 text-center sm:py-28">
            <p className="font-script text-lg text-white/70">
              A growing force in luxury fashion
            </p>
            <h2 className="mt-2 font-heading text-h1 font-light text-white">
              Our Impact
            </h2>

            <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-12 sm:gap-16">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-h2 font-light text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-caption uppercase tracking-luxury text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== COLLABORATE WITH US ===== */}
      <section className="section-spacing bg-white">
        <div className="container-luxury text-center">
          <p className="font-script text-lg text-brand-blue">
            Let&apos;s create together
          </p>
          <h2 className="mt-2 font-heading text-h2 text-brand-purple">
            Collaborate With Us
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-neutral-600">
            DM us on social, apply as an affiliate, or get in touch directly.
            We&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:info@isivislondon.com"
              className="group inline-flex items-center gap-2 rounded-luxury bg-brand-gradient px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white shadow-luxury-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
            >
              Email Us
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
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-luxury border-[1.5px] border-brand-purple px-8 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-brand-purple transition-all duration-300 hover:bg-brand-purple hover:text-white"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
