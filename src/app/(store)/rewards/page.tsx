"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

export default function RewardsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast("Application submitted! We'll be in touch soon.", "success");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Join The Queendom" }]}
        className="mb-6"
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Join The Queendom
        </h1>

        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Let&apos;s Join Forces
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Established in 2021 in the vibrant city of London, ISIVIS London has
            swiftly risen to prominence as a top-tier international fashion
            design company, embodying contemporary sensuality and opulence on a
            global scale. As the premier next-generation designer in London, we
            specialise in creating, producing, distributing, and retailing
            fashion and lifestyle items tailored for the discerning Millennial
            and Gen Z audience, emphasising quality, comfort, and luxury.
          </p>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            From the outset, ISIVIS London has been a trailblazer, pushing
            boundaries and revolutionising the fashion landscape. With a
            commitment to innovation, we continuously introduce new products,
            staying ahead of the curve to offer our community an unparalleled
            and glamorous experience that sets us apart from the rest.
          </p>
        </section>

        {/* Application Form */}
        <section className="mt-12">
          <div className="rounded-luxury-md border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-2 font-heading text-h3 font-light text-neutral-800">
              Apply to Collaborate
            </h2>
            <p className="mb-8 text-body-sm text-neutral-500">
              Fill in your details and we&apos;ll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Instagram Username"
                placeholder="Instagram Username"
                required
              />
              <Input
                label="Email Id"
                type="email"
                placeholder="Email Id"
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Phone Number"
                required
              />

              {/* Why do you want to work with us */}
              <div>
                <label className="mb-1.5 block text-body-sm font-medium text-neutral-700">
                  Why do you want to work with us
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us why you'd be a great fit..."
                  className="w-full rounded-luxury-md border border-neutral-200 bg-white px-4 py-3 font-body text-base text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-brand-blue focus:outline-none focus:ring-[3px] focus:ring-brand-blue/10"
                  required
                />
              </div>

              {/* Screenshots of insights */}
              <div>
                <label className="mb-1.5 block text-body-sm font-medium text-neutral-700">
                  Screenshots of insights
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full rounded-luxury-md border border-neutral-200 bg-white px-4 py-3 font-body text-sm text-neutral-600 file:mr-4 file:rounded-md file:border-0 file:bg-brand-purple/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-purple hover:file:bg-brand-purple/20 transition-all duration-200 focus:border-brand-blue focus:outline-none focus:ring-[3px] focus:ring-brand-blue/10"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-luxury-md bg-gradient-to-r from-brand-purple via-brand-purple-80 to-brand-blue px-6 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white shadow-md transition-all duration-300 hover:shadow-luxury hover:brightness-110 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <p className="text-body-sm text-neutral-600">
            Have questions?{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-purple hover:underline"
            >
              Get in touch
            </Link>{" "}
            or email{" "}
            <a
              href="mailto:connect@maisonisivis.com"
              className="font-medium text-brand-purple hover:underline"
            >
              connect@maisonisivis.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
