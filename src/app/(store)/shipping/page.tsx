import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shipping Policy | Maison ISIVIS",
  description:
    "Worldwide shipping from our London atelier. Free standard shipping on orders over £150 GBP. Estimated delivery times and costs for all destinations.",
};

const SHIPPING_TABLE = [
  { country: "United States", time: "5–8 business days" },
  { country: "Germany", time: "5–8 business days" },
  { country: "Canada", time: "7–12 business days" },
  { country: "Australia", time: "8–12 business days" },
  { country: "Ireland", time: "9–13 business days" },
  { country: "United Kingdom", time: "4–8 business days" },
  { country: "France", time: "8–12 business days" },
  { country: "Italy", time: "10–15 business days" },
  { country: "Spain", time: "8–15 business days" },
  { country: "Netherlands", time: "6–8 business days" },
  { country: "Romania", time: "10–15 business days" },
  { country: "United Arab Emirates", time: "7–10 business days" },
  { country: "Hong Kong (China)", time: "3–5 business days" },
  { country: "Taiwan (China)", time: "4–6 business days" },
  { country: "Rest of World", time: "10–15 business days" },
];

export default function ShippingPolicyPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Shipping Policy" }]} className="mb-6" />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Shipping Policy
        </h1>

        {/* Dispatch Time */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Dispatch Time
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <p>
              Our products are uniquely crafted to order, ensuring the highest
              quality and attention to detail. Due to the handmade nature of our
              items, please allow 3–5 business days for your order to be shipped
              out. For pre-orders, please expect a production time of 15–30
              working days as we meticulously prepare the materials for your
              special piece.
            </p>
            <p>
              Good things take time, and we promise that the wait will be worth
              it. Once your order is shipped, you will receive an email with a
              tracking number. Please note that orders cannot be cancelled once
              they have been shipped.
            </p>
          </div>
        </section>

        {/* Shipping Times & Costs */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Shipping Times &amp; Costs
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <p>
              We proudly offer worldwide shipping with all prices listed in
              Great British Pounds (GBP). Please keep in mind that business days
              exclude weekends and public holidays. Refer to the table below for
              estimated delivery timeframes per destination.
            </p>
            <p className="font-medium text-brand-purple">
              For orders over £150 GBP, enjoy free standard shipping!
            </p>
            <p>
              Please remember that the timeframes provided are estimates only.
              International shipping involves various factors beyond our control,
              so we cannot guarantee specific delivery times. Unfortunately, we
              are unable to accept returns for items delayed in transit. View our
              full{" "}
              <Link
                href="/returns"
                className="font-medium text-brand-purple hover:underline"
              >
                return policy
              </Link>{" "}
              for more details.
            </p>
          </div>

          {/* Shipping Table */}
          <div className="mt-6 overflow-hidden rounded-luxury-md border border-neutral-200">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-5 py-3 text-left font-heading text-xs font-medium uppercase tracking-luxury-wide text-neutral-500">
                    Country
                  </th>
                  <th className="px-5 py-3 text-left font-heading text-xs font-medium uppercase tracking-luxury-wide text-neutral-500">
                    Standard Shipping (£12)
                  </th>
                </tr>
              </thead>
              <tbody>
                {SHIPPING_TABLE.map((row, i) => (
                  <tr
                    key={row.country}
                    className={
                      i < SHIPPING_TABLE.length - 1
                        ? "border-b border-neutral-100"
                        : ""
                    }
                  >
                    <td className="px-5 py-3 font-medium text-neutral-800">
                      {row.country}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Delivery Information */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Delivery Information
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-medium text-neutral-800">Delivery Delays</h3>
              <p className="mt-1">
                During peak sale periods or new collection launches, your order
                may experience delays beyond the specified timeframes.
                Regrettably, we are unable to offer compensation for unexpected
                delivery delays once your item has left our warehouse.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-800">Customs Charges</h3>
              <p className="mt-1">
                The prices displayed in our online store do not cover overseas
                duties or customs charges that may apply to your order. These
                fees are determined by your local customs office and are beyond
                our influence. Prior to placing an order, please familiarise
                yourself with your country&apos;s customs charges. Maison ISIVIS
                cannot be held responsible if customers are not notified by their
                postal authority of outstanding customs duties and taxes.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <p className="text-body-sm text-neutral-600">
            Have a question about your shipment?{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-purple hover:underline"
            >
              Contact us
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
