import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions | Maison ISIVIS",
  description:
    "Terms and Conditions governing the sale and purchase of goods from ISIVIS London. Orders, pricing, payment, and customer responsibilities.",
};

export default function TermsPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Terms & Conditions" }]}
        className="mb-6"
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
          The following Terms and Conditions govern the sale and purchase of
          goods between you and ISIVIS London. Your statutory rights as a
          consumer are not affected by these Terms and Conditions. By placing an
          order with us, you agree to adhere to these Terms and Conditions.
          Please note that these Terms and Conditions may be revised without
          prior notice, and it is your responsibility to review them before
          making a purchase.
        </p>

        {/* Governing Law */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Governing Law
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            These Terms of Service and any agreements for Services provided by us
            are subject to the laws of the UK.
          </p>
        </section>

        {/* Orders & Pricing */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Orders &amp; Pricing
          </h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-body-sm leading-relaxed text-neutral-600">
            <li>
              All orders are subject to approval and product availability.
            </li>
            <li>
              Product prices are accurate at the time of publication on our
              website.
            </li>
            <li>
              We reserve the right to modify prices on our website without prior
              notice. In the event of a pricing error on goods you have ordered,
              we will promptly notify you. You can choose to cancel the order or
              reorder at the correct price. Failure to reach you regarding a
              pricing error will result in order cancellation. Refunds will be
              issued for any payments already made.
            </li>
            <li>
              All prices are in GBP, with other currencies calculated
              automatically as an estimate.
            </li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Limitation of Liability
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            While we strive for accuracy, we do not warrant the information on
            our web pages. Our liability for breaches of these terms is limited
            to the value of goods ordered in that transaction.
          </p>
        </section>

        {/* Order Acknowledgment */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Order Acknowledgment
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Upon order submission, you will receive an email confirming your
            order and another email when your order is dispatched, including
            tracking details.
          </p>
        </section>

        {/* Stock Availability */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Stock Availability
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            There may be instances where we cannot immediately fulfil your order.
            In such cases, we will promptly notify you of any delays or issues.
          </p>
        </section>

        {/* Customer Responsibilities */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Customer Responsibilities
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Customers must ensure that all information provided on the order form
            is accurate and complete. Inaccurate or incomplete information may
            result in liability for any related costs. Customers are prohibited
            from copying, reproducing, or publishing any content from the
            website.
          </p>
        </section>

        {/* Payment Checks */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Payment Checks
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Credit and charge card holders are subject to validation and
            authorisation checks by the card issuer. Non-authorisation by the
            issuer will result in non-dispatch of goods, and we will not be
            liable for any delays. Payments are processed securely through Stripe
            or PayPal on our website. You can make purchases via PayPal or Stripe
            with your card without an account.
          </p>
        </section>
      </div>
    </div>
  );
}
