"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast("Message sent! We'll get back to you shortly.", "success");
    console.log("Contact form:", data);
    reset();
  }

  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Contact Us" }]} className="mb-6" />

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Info Side */}
        <div>
          <h1 className="font-heading text-h1 font-light text-neutral-800">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-lg text-body-sm leading-relaxed text-neutral-600">
            We&apos;d love to hear from you. Whether you have a question about
            our collections, sizing, orders, or anything else, our team is here
            to help.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-purple/5 text-brand-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-body-sm font-medium text-neutral-900">Email</p>
                <a href="mailto:hello@maisonisivis.com" className="text-body-sm text-brand-purple hover:underline">
                  hello@maisonisivis.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-purple/5 text-brand-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-body-sm font-medium text-neutral-900">Atelier</p>
                <p className="text-body-sm text-neutral-600">London, United Kingdom</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-purple/5 text-brand-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-body-sm font-medium text-neutral-900">Response Time</p>
                <p className="text-body-sm text-neutral-600">Within 24 hours, Mon–Fri</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="rounded-luxury-md border border-neutral-100 p-6 sm:p-8">
          <h2 className="mb-6 font-heading text-h3 font-light text-neutral-800">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Your Name"
              placeholder="Full name"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Subject"
              placeholder="What is this regarding?"
              error={errors.subject?.message}
              {...register("subject")}
            />
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-neutral-700">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us how we can help..."
                className="w-full rounded-luxury-md border border-neutral-200 bg-white px-4 py-3 font-body text-base text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-brand-blue focus:outline-none focus:ring-[3px] focus:ring-brand-blue/10"
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1.5 text-body-sm text-error" role="alert">
                  {errors.message.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-luxury-md bg-brand-purple px-6 py-3.5 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
