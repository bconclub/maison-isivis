import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Fit Guide | Maison ISIVIS",
  description:
    "Find your perfect fit with our comprehensive size guide. Measurements for US/CAN, UK, EU, and AUS sizing across all Maison ISIVIS garments.",
};

export default function FitGuidePage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Fit Guide" }]} className="mb-6" />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800 text-center">
          Fit Guide
        </h1>

        {/* Size Chart */}
        <section className="mt-10">
          <div className="overflow-hidden rounded-luxury-md border border-neutral-200 bg-white">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <Image
                src="/images/Fit guide/001.webp"
                alt="ISIVIS London size chart showing measurements for XS through XXL across US/CAN, UK, EU, and AUS sizing"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </div>
        </section>

        {/* How to Measure */}
        <section className="mt-12">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            How to Measure Your Body
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            To choose the correct size for you, measure your body as follows:
          </p>

          <div className="mt-8 space-y-8">
            {/* Illustration 1: Shoulder, Bust, Waist */}
            <div className="overflow-hidden rounded-luxury-md border border-neutral-200 bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/Fit guide/002.webp"
                  alt="How to measure shoulder width, bust, and waist"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>

            {/* Illustration 2: Waist, Hip */}
            <div className="overflow-hidden rounded-luxury-md border border-neutral-200 bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/Fit guide/003.webp"
                  alt="How to measure waist and hip"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>

            {/* Illustration 3: Full body measurements */}
            <div className="overflow-hidden rounded-luxury-md border border-neutral-200 bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/Fit guide/004.webp"
                  alt="How to measure shoulder width, bust, waist, and hip"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Need Help CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <h3 className="font-heading text-h4 font-light text-neutral-800">
            Not Sure Which Size to Choose?
          </h3>
          <p className="mt-3 text-body-sm text-neutral-600">
            Email us at{" "}
            <a
              href="mailto:connect@maisonisivis.com"
              className="font-medium text-brand-purple hover:underline"
            >
              connect@maisonisivis.com
            </a>{" "}
            and our styling experts will help you find the perfect size.
          </p>
        </div>
      </div>
    </div>
  );
}
