"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const FAQ_SECTIONS = [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard UK delivery takes 3–5 business days. Express delivery (next-day) is available for orders placed before 2pm, Monday to Friday. International shipping typically takes 7–14 business days depending on your location.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard delivery on all UK orders over £150. For orders under £150, standard shipping is £4.99 and express delivery is £9.99.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order has been dispatched, you'll receive a confirmation email with a tracking number. You can also track your order from your account dashboard or our Shipment Tracking page.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide. International shipping rates and delivery times vary by destination. You'll see the exact shipping cost at checkout before placing your order.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. Please visit our Returns page for full details.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, navigate to your order history, and select the item you'd like to return. Follow the prompts to generate a return label. Alternatively, email us at hello@maisonisivis.com.",
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and inspect your return, refunds are processed within 5–7 business days. The refund will be credited to your original payment method.",
      },
    ],
  },
  {
    title: "Products & Sizing",
    items: [
      {
        q: "How do I find my size?",
        a: "We recommend consulting our Fit Guide, which includes detailed measurements for each size across all our garment types. If you're between sizes, we generally recommend sizing up for a more relaxed fit.",
      },
      {
        q: "What materials do you use?",
        a: "We use premium fabrics including silk, organic cotton, cashmere, vegan leather, and carefully sourced lace. Each product page lists the specific fabric composition and care instructions.",
      },
      {
        q: "Are your products sustainable?",
        a: "Sustainability is at the heart of what we do. We prioritise ethically sourced materials, minimal waste production methods, and recyclable packaging. Learn more on our About page.",
      },
    ],
  },
  {
    title: "Account & Payment",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, PayPal, and Razorpay. All payments are processed securely through our encrypted payment partners.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "No, you can check out as a guest. However, creating an account allows you to track orders, save addresses, build a wishlist, and earn loyalty rewards.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and never store your full payment details on our servers. All transactions are processed through PCI-compliant payment providers.",
      },
    ],
  },
] as const;

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-body-sm font-medium text-neutral-900">{q}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={cn(
            "mt-0.5 shrink-0 text-neutral-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-body-sm leading-relaxed text-neutral-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "FAQ" }]} className="mb-6" />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-body-sm leading-relaxed text-neutral-500">
          Find answers to the most common questions about our products, ordering,
          shipping, and more. Can&apos;t find what you&apos;re looking for?{" "}
          <a href="/contact" className="font-medium text-brand-purple hover:underline">
            Contact us
          </a>
          .
        </p>

        {FAQ_SECTIONS.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="mb-2 font-heading text-h3 font-light text-neutral-800">
              {section.title}
            </h2>
            <div className="border-t border-neutral-100">
              {section.items.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
