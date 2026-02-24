import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Return Policy | Maison ISIVIS",
  description:
    "Returns and exchanges within 7 business days of delivery. Learn about our return process, exchange policy, and conditions for handcrafted luxury fashion.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Return Policy" }]} className="mb-6" />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Return Policy
        </h1>
        <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
          At ISIVIS London we put love and attention into hand-crafting our
          products, but we understand that they may not always meet your
          expectations. If you are not completely satisfied with your purchase,
          you can request a return or exchange within 7 business days from the
          delivery date of your order.
        </p>

        {/* How to Start a Return */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            How to Start a Return
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <p>
              To start a return or exchange process, please contact us at{" "}
              <a
                href="mailto:connect@maisonisivis.com"
                className="font-medium text-brand-purple hover:underline"
              >
                connect@maisonisivis.com
              </a>
              . When submitting your request, please include the following
              details:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Order number</li>
              <li>Name of the item(s) you wish to return or exchange</li>
              <li>Reasons for the return or exchange</li>
              <li>
                Photos of the item(s) you wish to return or exchange, clearly
                displaying the item(s) and attached tags
              </li>
            </ul>
            <p>
              Ensure that the photos clearly show the tags on the item(s) to
              confirm they have not been removed. We will process your request
              within 24 hours and provide further instructions. Please note that
              we only accept returns for Gift Cards or exchanges.
            </p>
          </div>
        </section>

        {/* Return Conditions */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Return Conditions
          </h2>
          <div className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            <p className="mb-3">
              Returned items must meet the following criteria to avoid rejection:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                The item is unworn and in original condition with all tags
                attached
              </li>
              <li>No marks or stains, including makeup and spray tan</li>
              <li>Hygiene stickers intact (Swimwear)</li>
              <li>
                No odours, such as deodorant, perfume, body odour, or washing
                powder
              </li>
              <li>Earrings cannot be returned for hygiene reasons</li>
              <li>
                Accessories (press-on nails, necklaces, glasses, gloves, and
                leggings) are non-returnable
              </li>
              <li>Proof of purchase is available</li>
            </ul>
          </div>
        </section>

        {/* Return Address */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Return Address
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Our return address is located in London. Please do not send packages
            to the waybill address, as they will be refused. Contact us at{" "}
            <a
              href="mailto:connect@maisonisivis.com"
              className="font-medium text-brand-purple hover:underline"
            >
              connect@maisonisivis.com
            </a>{" "}
            for the full return address.
          </p>
        </section>

        {/* Return Process */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Return Process
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Once we confirm the item has been returned correctly, a gift card
            will be emailed to the address associated with the order and will be
            valid for 12 months.
          </p>
        </section>

        {/* Exchanges */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Exchanges
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            If you wish to exchange for a more expensive product, you will need
            to cover the price difference. For a less expensive replacement item,
            we will email you a gift card with the difference value.
          </p>
        </section>

        {/* Faulty Items */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Faulty Items
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            While we strive for perfection, if you receive a faulty item, please
            notify us within 7 business days of delivery. We will replace the
            item with a new one or provide a gift card of equal value if you
            prefer.
          </p>
        </section>

        {/* Please Note */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Please Note
          </h2>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-body-sm leading-relaxed text-neutral-600">
            <li>Retain tracking information for the return package.</li>
            <li>Original shipping fees are non-refundable.</li>
            <li>
              Customers are responsible for return and exchange shipping costs.
            </li>
            <li>We do not provide shipping labels.</li>
          </ul>
        </section>

        {/* Final Sale */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Final Sale Items (Clearance)
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Final Sale styles are not eligible for returns unless confirmed
            faulty by our team. Unauthorised returns of Final Sale items will be
            refused.
          </p>
        </section>

        {/* Lost Items */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Lost Items
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            ISIVIS London is not responsible for customs fees, taxes, or lost or
            stolen items. Additionally, we are not liable for incorrect shipping
            information provided by customers.
          </p>
        </section>

        {/* Contact CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <p className="text-body-sm text-neutral-600">
            Need help with a return?{" "}
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
