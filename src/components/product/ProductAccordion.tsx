"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductAccordionProps {
  product: Product;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-body-sm font-medium uppercase tracking-luxury text-neutral-800 transition-colors duration-200 group-hover:text-brand-purple">
          {title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={cn(
            "shrink-0 text-neutral-400 transition-all duration-200 group-hover:text-brand-purple",
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
          <div className="text-body-sm leading-relaxed text-neutral-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductAccordion({ product }: ProductAccordionProps) {
  return (
    <div className="border-t-2 border-transparent" style={{ borderImage: "linear-gradient(to right, #0D0033, #0033CC) 1" }}>
      {/* Description */}
      {product.description && (
        <AccordionItem title="Description" defaultOpen>
          <p className="whitespace-pre-line">{product.description}</p>
        </AccordionItem>
      )}

      {/* Fabric & Material */}
      {product.fabric && (
        <AccordionItem title="Fabric & Material">
          <p>{product.fabric}</p>
        </AccordionItem>
      )}

      {/* Care Instructions */}
      {product.careInstructions && (
        <AccordionItem title="Care Instructions">
          <p className="whitespace-pre-line">{product.careInstructions}</p>
        </AccordionItem>
      )}

      {/* Measurements */}
      {product.measurements && Object.keys(product.measurements).length > 0 && (
        <AccordionItem title="Measurements">
          <div className="space-y-2">
            {Object.entries(product.measurements).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize text-neutral-500">{key}</span>
                <span className="font-medium text-neutral-800">{value}</span>
              </div>
            ))}
          </div>
        </AccordionItem>
      )}

      {/* Shipping & Returns */}
      <AccordionItem title="Shipping & Returns">
        <div className="space-y-3">
          <p>
            <span className="font-medium text-neutral-800">Free UK Delivery</span>{" "}
            on orders over £150. Standard delivery within 3–5 business days.
          </p>
          <p>
            <span className="font-medium text-neutral-800">Express Delivery</span>{" "}
            available for £9.99. Next-day delivery when ordered before 2pm.
          </p>
          <p>
            <span className="font-medium text-neutral-800">Returns</span>{" "}
            accepted within 14 days of delivery. Items must be unworn with tags attached.
          </p>
        </div>
      </AccordionItem>
    </div>
  );
}
