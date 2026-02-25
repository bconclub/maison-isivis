"use client";

import { useState } from "react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { toast } from "@/components/ui/Toast";

export default function JoinTheQueendomPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    instagram: "",
    email: "",
    phone: "",
    message: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.instagram || !form.email || !form.phone) {
      toast("Please fill in all required fields.", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/queendom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
      toast("Application submitted successfully!", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Join The Queendom" }]}
        className="mb-6"
      />

      {/* Hero Title */}
      <h1 className="text-center font-heading text-h1 font-light uppercase tracking-luxury-wide text-neutral-800">
        Join The Queendom
      </h1>

      {/* Content Grid */}
      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        {/* Left — Image */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-luxury-md bg-brand-gradient">
          <Image
            src="/images/hero/queendom.webp"
            alt="Join The Queendom"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Right — Copy + Form */}
        <div>
          <h2 className="font-heading text-h2 font-light text-neutral-800">
            Let&apos;s Join Forces
          </h2>

          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Established in 2021 in the vibrant city of London, ISIVIS London has
            swiftly risen to prominence as a top-tier international fashion
            design company, embodying contemporary sensuality and opulence on a
            global scale. As the premier next-generation designer in London, we
            specialize in creating, producing, distributing, and retailing
            fashion and lifestyle items tailored for the discerning Millennial
            and Gen Z audience, emphasizing quality, comfort, and luxury. From
            the outset, ISIVIS London has been a trailblazer, pushing boundaries
            and revolutionizing the fashion landscape. With a commitment to
            innovation, we continuously introduce new products, staying ahead of
            the curve to offer our community an unparalleled and glamorous
            experience that sets us apart from the rest.
          </p>

          {/* Form */}
          {submitted ? (
            <div className="mt-10 rounded-luxury-md border border-green-200 bg-green-50 p-8 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mx-auto mb-4 text-green-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="font-heading text-h4 text-green-800">
                Application Submitted
              </h3>
              <p className="mt-2 text-body-sm text-green-700">
                Thank you for your interest! We&apos;ll review your application
                and get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              {/* Instagram */}
              <div>
                <label className="mb-1.5 block text-body-sm font-medium text-neutral-700">
                  Instagram Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                  placeholder="@yourusername"
                  required
                  className="w-full rounded-luxury-sm border border-neutral-200 bg-white px-4 py-3 text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-body-sm font-medium text-neutral-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-luxury-sm border border-neutral-200 bg-white px-4 py-3 text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-body-sm font-medium text-neutral-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+44 7700 000000"
                  required
                  className="w-full rounded-luxury-sm border border-neutral-200 bg-white px-4 py-3 text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
                />
              </div>

              {/* Why do you want to work with us */}
              <div>
                <label className="mb-1.5 block text-body-sm font-medium text-neutral-700">
                  Why do you want to work with us?
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us about yourself, your audience, and why you'd be a great fit..."
                  rows={4}
                  className="w-full resize-none rounded-luxury-sm border border-neutral-200 bg-white px-4 py-3 text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple/20"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-luxury-md bg-gradient-to-r from-brand-purple via-brand-purple-80 to-brand-blue px-10 py-4 text-body-sm font-medium uppercase tracking-luxury text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
