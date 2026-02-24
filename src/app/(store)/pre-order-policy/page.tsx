import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Pre-Order Policy | Maison ISIVIS",
  description:
    "Secure early access to upcoming Maison ISIVIS pieces. Learn about pre-order timelines, shipping, cancellations, and what to expect.",
};

export default function PreOrderPolicyPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Pre-Order Policy" }]}
        className="mb-6"
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Pre-Order Policy
        </h1>

        {/* What is a pre-order? */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            What is a pre-order?
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            A pre-order allows you to secure early access to the most coveted
            pieces of the upcoming season before they sell out. When you place a
            pre-order, it means that the item is still in production and not
            immediately available in our warehouse. It is essential to check if
            the product is in pre-order status before finalising your purchase,
            as delivery times can vary for pre-orders.
          </p>
        </section>

        {/* Shipping timeline */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            How long will it take to ship out my pre-order?
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <p>
              The waiting time for shipping out a pre-order can vary depending on
              the specific item. Typically, the estimated waiting period is
              between 15–30 working days from the date the item was published.
              Once the item is in stock at our warehouse, your order will be
              dispatched within three days.
            </p>
            <p>
              Please note that if your order contains a pre-order item, it will
              be shipped separately from any other items you may have purchased.
            </p>
          </div>
        </section>

        {/* Delays */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            What causes delays in shipping pre-orders?
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <p>
              The production process involves multiple steps of manufacturing and
              processing, which can lead to delays. While the production sequence
              is typically linear, unforeseen errors or challenges may arise.
            </p>
            <p>
              In the rare event of a delay, our Customer Care team will promptly
              reach out to you to provide updates and assistance.
            </p>
          </div>
        </section>

        {/* Cancellation */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Can I cancel a pre-order?
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <p>
              Yes, you can cancel a pre-order within 24 hours of purchase. After
              this window, cancellations are not possible. If you change your
              mind about a pre-order item within 24 hours, you can contact our
              Customer Care team to request cancellation.
            </p>
            <p>
              Additionally, if the 30 working days have passed and the item is
              still not available, you can also request cancellation of the
              pre-order.
            </p>
          </div>
        </section>

        {/* Address change */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Can I change my shipping address for a pre-order?
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Yes, you can change your shipping address before the order is
            dispatched by accessing your order details in your account and
            contacting customer service. Once the order has been shipped,
            modifications to the shipping address are no longer possible.
          </p>
        </section>

        {/* Contact CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <p className="text-body-sm text-neutral-600">
            Questions about your pre-order? Contact our Customer Care team at{" "}
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
