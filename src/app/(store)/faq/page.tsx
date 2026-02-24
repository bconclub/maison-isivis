"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

const EMAIL_LINK = (
  <a
    href="mailto:info@isivislondon.com"
    className="font-medium text-brand-purple hover:underline"
  >
    contact us
  </a>
);

interface FAQItem {
  q: string;
  a: ReactNode;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "Shipping & Delivery",
    items: [
      {
        q: "Where is my order?",
        a: (
          <>
            <p>
              Once your order has been shipped, you will receive an email with
              tracking information. The estimated delivery date is determined by
              the country and shipping method selected. Please note that this
              date is an estimate, and your order may arrive slightly before, on,
              or slightly after the estimated delivery date.
            </p>
            <p className="mt-3">
              To track the progress of your order, check your{" "}
              <Link
                href="/account/orders"
                className="font-medium text-brand-purple hover:underline"
              >
                order history
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        q: "Why is there no tracking update?",
        a: (
          <>
            <p>
              If you do not see any tracking information a few days after your
              order has been shipped, it may take 1–3 days for the tracking
              information to be updated as the shipping company arranges the
              shipping space.
            </p>
            <p className="mt-3">
              If there are no updated tracking details during transportation for
              less than 5 days but still within the estimated delivery date,
              please do not worry. Tracking information is typically updated when
              it reaches important ports or destinations.
            </p>
            <p className="mt-3">
              If there are no updated tracking details for more than 5 days,
              please feel free to {EMAIL_LINK}.
            </p>
          </>
        ),
      },
      {
        q: "Why is my order taking so long to ship?",
        a: (
          <>
            <p>
              For products that are in stock, please allow 1–5 business days for
              order processing after placement. If your order includes any
              pre-order item(s), we will hold off on shipping until all items are
              available to reduce our carbon footprint and deliver all items to
              you in one shipment.
            </p>
            <p className="mt-3">
              We recognise that the current process may not be ideal and we are
              actively developing a long-term solution to enhance our forecasting
              to minimise any delays in the future.
            </p>
          </>
        ),
      },
      {
        q: "Why have I not received a shipment notification email?",
        a: (
          <>
            <p>
              Typically, an email containing the tracking number is sent to your
              account email address once the order has been shipped. If you have
              not received the email, please consider the following:
            </p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5">
              <li>
                Verify if the email address used to place the order is correct.
              </li>
              <li>
                Check your spam or junk folder to ensure the email was not
                filtered.
              </li>
              <li>
                Review your order status in your account to confirm if it has
                been shipped.
              </li>
            </ol>
          </>
        ),
      },
      {
        q: "Where do you ship to?",
        a: (
          <p>
            We offer global shipping services from London to the world. For more
            specific and precise details on our shipping timelines, please visit
            our{" "}
            <Link
              href="/shipping"
              className="font-medium text-brand-purple hover:underline"
            >
              shipping policy
            </Link>{" "}
            page for more information.
          </p>
        ),
      },
    ],
  },
  {
    title: "Orders",
    items: [
      {
        q: "How do I cancel my order?",
        a: (
          <p>
            You may be able to cancel your order within 4 hours of placing it.
            Kindly {EMAIL_LINK} with your order number to request a
            cancellation. Please note that a 5% processing fee of the total
            order value will be charged for order cancellations.
          </p>
        ),
      },
      {
        q: "Can I make changes to my order?",
        a: (
          <p>
            Clothing items are considered intimate products that come into direct
            contact with the body. In adherence to our commitment to customer
            responsibility, we do not offer exchange services. Once your order
            has been shipped from the warehouse, adjustments cannot be made, and
            you will need to await its delivery. Following the delivery of your
            order, you may request a refund within 14 days if the payment was
            not made using store credit. For additional information, please refer
            to our{" "}
            <Link
              href="/returns"
              className="font-medium text-brand-purple hover:underline"
            >
              return policy
            </Link>
            .
          </p>
        ),
      },
      {
        q: "What should I do if there are items missing from my order?",
        a: (
          <>
            <p>
              There are two potential reasons for missing items in your order:
            </p>
            <ol className="mt-3 list-decimal space-y-3 pl-5">
              <li>
                Your order is overweight due to too many items or includes
                pre-order products. We may split the order and ship it in
                multiple packages. In the case of orders with pre-sale items, we
                prioritise shipping items currently in stock to ensure you
                receive them promptly. The remaining pre-order products will be
                dispatched as soon as they are available. If you have any queries
                regarding your package tracking, please do not hesitate to{" "}
                {EMAIL_LINK}.
              </li>
              <li>
                The missing items were caused during packing or transportation.
                In this case please reach out to us immediately. Please{" "}
                <a
                  href="mailto:info@isivislondon.com"
                  className="font-medium text-brand-purple hover:underline"
                >
                  email us
                </a>{" "}
                with your order number, details of the problem, and provide
                images of both the items and the outer package you received.
              </li>
            </ol>
          </>
        ),
      },
      {
        q: "What should I do if I have received an incorrect item?",
        a: (
          <p>
            If you have received an incorrect item, please immediately{" "}
            {EMAIL_LINK} with your order number and details of the incorrect
            item received. We will work to resolve the issue promptly and ensure
            you receive the correct item as soon as possible. Please include
            pictures of the item you received.
          </p>
        ),
      },
      {
        q: "What steps should I take if there are issues with my order?",
        a: (
          <p>
            Please reach out to us promptly. You can{" "}
            <a
              href="mailto:info@isivislondon.com"
              className="font-medium text-brand-purple hover:underline"
            >
              email us
            </a>{" "}
            with your order number, details about the issue, and include
            pictures if there is any damage.
          </p>
        ),
      },
    ],
  },
  {
    title: "Returns & Refund",
    items: [
      {
        q: "Is it possible to exchange the item instead of receiving a refund?",
        a: (
          <p>
            Unfortunately we currently do not provide exchange services. If you
            wish to exchange an item, please place a new order and start a return
            for the original item. Your refund will be issued once we have
            received the returned package. For more information on returns,
            please visit our{" "}
            <Link
              href="/returns"
              className="font-medium text-brand-purple hover:underline"
            >
              return policy
            </Link>
            .
          </p>
        ),
      },
      {
        q: "What is the process for returning item(s)?",
        a: (
          <p>
            You can initiate returns within 14 days from the date you received
            all your items. For detailed information, please visit our{" "}
            <Link
              href="/returns"
              className="font-medium text-brand-purple hover:underline"
            >
              return policy
            </Link>
            .
          </p>
        ),
      },
      {
        q: "What is the timeframe for returns?",
        a: (
          <p>
            Please ensure the item is returned following the instructions within
            3 days after receiving the return address.
          </p>
        ),
      },
      {
        q: "When can I expect to receive my refund?",
        a: (
          <>
            <p>
              Once your return has been processed and received at our facilities,
              please allow up to 7 days for the refund to be credited to your
              bank account.
            </p>
            <p className="mt-3">
              As part of our commitment to transparency, we will send you an
              email notification once your return package has been received and
              your refund is being processed. If you do not receive an email from
              us within 28 days, please {EMAIL_LINK} for further assistance.
            </p>
          </>
        ),
      },
      {
        q: "Are delivery charges refunded for returned items?",
        a: (
          <p>
            Unfortunately, customers are responsible for covering the shipping
            fees for returns if the items are being returned for reasons other
            than quality issues. The specific shipping fees will vary depending
            on the local shipping company selected by the customer.
          </p>
        ),
      },
      {
        q: "Why have I not received my refund yet even though the return has been marked as delivered?",
        a: (
          <p>
            Typically, once the return package is delivered, it may take 1–3 days
            for us to receive and open the package for confirmation. The refund
            will be processed once the items are confirmed to be in good
            condition and the return is completed. It usually takes 7 days for
            the refund to be credited to your account.
          </p>
        ),
      },
    ],
  },
  {
    title: "Payment & Promotions",
    items: [
      {
        q: "Why was my payment declined?",
        a: (
          <>
            <p>Possible reasons for your payment being declined could include:</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5">
              <li>
                Incorrect card information. Please verify the expiration date,
                billing address, and security code (located on the back of your
                Visa/Mastercard).
              </li>
              <li>Your card issuer bank declined the payment.</li>
              <li>Insufficient balance on the card.</li>
              <li>
                Inconsistency between the shipping address and billing address.
                If feasible, we recommend trying to pay with PayPal or other
                supported payment methods.
              </li>
            </ol>
          </>
        ),
      },
      {
        q: "Are Customs and Duties Fees included in the total cost?",
        a: (
          <>
            <p>
              Customs and Duties Fees are not included in the total cost.
              Customers are responsible for paying these fees upon receipt of the
              package. The amount varies depending on the country and the items
              ordered.
            </p>
            <p className="mt-3">
              If an order is refused due to customs fees, the package may be
              destroyed and cannot be delivered again. Please note that in such
              cases, a refund will not be issued. We advise customers to review
              their local customs policy before placing an order.
            </p>
          </>
        ),
      },
      {
        q: "What payment methods do you accept?",
        a: (
          <>
            <p>
              We accept a variety of payment methods including American Express,
              Apple Pay, Visa, MasterCard, Discover, Diners Club, Google Pay,
              Shop Pay, Union Pay, and PayPal.
            </p>
            <p className="mt-3">
              Please ensure that the billing address provided for credit card
              payments matches the billing address associated with your bank to
              prevent potential fraud alerts.
            </p>
          </>
        ),
      },
      {
        q: "Where can I find discounts?",
        a: (
          <p>
            Typically, you will receive a £15 OFF coupon for your first order if
            you have subscribed to our newsletter and are new to our website.
            Additionally, we regularly offer various themed activities and
            promotions that can be found on our webpage. Stay tuned for updates
            and special offers.
          </p>
        ),
      },
    ],
  },
  {
    title: "Products & Stocks",
    items: [
      {
        q: "How can I check if the item is in stock?",
        a: (
          <>
            <p>
              Our products on the webpage are categorised into three inventory
              statuses:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <strong>In stock:</strong> The item is available and typically
                ships out within 1–5 business days.
              </li>
              <li>
                <strong>Out of stock:</strong> The item is currently unavailable,
                and the estimated restocking time is uncertain.
              </li>
              <li>
                <strong>Pre-order:</strong> The item is currently unavailable but
                is scheduled to begin production and is expected to be ready by
                the specified date.
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "What is the reason for offering a pre-order model?",
        a: (
          <>
            <p>
              What sets us apart from other fast fashion brands is our commitment
              to sustainability, as evidenced by our zero inventory mission and
              pre-order system.
            </p>
            <p className="mt-3">
              While we are not yet fully zero waste, we prioritise
              sustainability in our product creation process. Our pre-order model
              allows us to involve customers in decision-making and production
              planning, ensuring that we only produce what is needed and
              minimising waste.
            </p>
            <p className="mt-3">
              By normalising pre-order models, we aim to keep the fashion
              industry current without harming the planet. This approach enables
              us to maintain a small inventory of each style, reducing the risk
              of excess waste. Our dedication to environmental conservation
              drives us to create a positive impact and contribute to making the
              planet a better place for future generations.
            </p>
          </>
        ),
      },
      {
        q: "How can I receive notifications for out-of-stock items?",
        a: (
          <p>
            Orders containing in-stock items are usually shipped within 5
            business days. Once your order has been shipped, you will receive a
            shipping confirmation email. If your order includes pre-order
            products, we will provide you with an estimated delivery time via
            email.
          </p>
        ),
      },
      {
        q: "How do I determine the correct size to order?",
        a: (
          <p>
            Our size guide is a general recommendation for selecting the best
            size, but please note that certain pieces may fit differently
            depending on their style. For example, oversized sweatshirts and
            t-shirts may run larger than the standard guidelines. If you have any
            questions about specific measurements, please do not hesitate to{" "}
            {EMAIL_LINK}. Our goal is to ensure that you are satisfied with your
            choice.
          </p>
        ),
      },
      {
        q: "Where are the clothes manufactured?",
        a: (
          <p>
            Our clothing is designed, crafted, and manufactured in our London
            factories by skilled artisans, ensuring the production of
            high-quality garments. We prioritise fair wages, with our workers
            earning 4–5 times the minimum wage. Stringent standards are upheld
            for sizing, quality control, and our quality team conducts regular
            visits to the factories every two weeks. Customer feedback is highly
            valued. Please feel free to {EMAIL_LINK} with any input or ideas you
            may have.
          </p>
        ),
      },
    ],
  },
  {
    title: "Collabs & More",
    items: [
      {
        q: "What is the Affiliate Program?",
        a: (
          <>
            <p>
              ISIVIS London was launched by model, actor, entrepreneur, and
              philanthropist Ishita Reha Gupta during the peak of the COVID-19
              pandemic in 2021.
            </p>
            <p className="mt-3">
              Our foundation is rooted in Stakeholder Capitalism, focusing on
              creating long-term value by considering the interests of our
              shareholders, customers, supply chains, environment, and broader
              communities.
            </p>
            <p className="mt-3">
              If you&apos;d like to join forces with us, don&apos;t hesitate to
              become a part of our Affiliate Program, where you can earn 10% of
              the total order value from your referrals.
            </p>
          </>
        ),
      },
      {
        q: "What is your stance on size inclusivity?",
        a: (
          <p>
            We celebrate the beauty of every size and believe that each size has
            its unique charm. With our pre-order model, we can provide extended
            sizes for certain styles and are dedicated to expanding our size
            inclusivity efforts as we grow.
          </p>
        ),
      },
      {
        q: "How do I register an account?",
        a: (
          <p>
            To register an account, simply visit the{" "}
            <Link
              href="/register"
              className="font-medium text-brand-purple hover:underline"
            >
              registration page
            </Link>{" "}
            and create your account. If you require further assistance, feel free
            to {EMAIL_LINK}.
          </p>
        ),
      },
      {
        q: "How can I reset my password?",
        a: (
          <p>
            If you have forgotten your password, you can reset it on the{" "}
            <Link
              href="/login"
              className="font-medium text-brand-purple hover:underline"
            >
              login page
            </Link>{" "}
            by clicking on &ldquo;Forgot your password?&rdquo; For further
            assistance, please feel free to {EMAIL_LINK}.
          </p>
        ),
      },
      {
        q: "Want to collaborate with us?",
        a: (
          <p>
            To explore general partnership collaborations, please reach out to us
            via email at{" "}
            <a
              href="mailto:info@isivislondon.com"
              className="font-medium text-brand-purple hover:underline"
            >
              info@isivislondon.com
            </a>{" "}
            to share your interest. We look forward to hearing from you!
          </p>
        ),
      },
    ],
  },
];

const SECTION_ANCHORS = [
  "Shipping & Delivery",
  "Orders",
  "Returns & Refund",
  "Payment & Promotions",
  "Products & Stocks",
  "Collabs & More",
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AccordionItem({ q, a }: FAQItem) {
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
          <div className="text-body-sm leading-relaxed text-neutral-600">
            {a}
          </div>
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
          <a
            href="mailto:info@isivislondon.com"
            className="font-medium text-brand-purple hover:underline"
          >
            Contact us
          </a>
          .
        </p>

        {/* Quick nav */}
        <div className="mt-8 flex flex-wrap gap-2">
          {SECTION_ANCHORS.map((title) => (
            <a
              key={title}
              href={`#${slugify(title)}`}
              className="rounded-full border border-neutral-200 px-4 py-2 text-caption font-medium text-neutral-600 transition-all hover:border-brand-purple hover:text-brand-purple"
            >
              {title}
            </a>
          ))}
        </div>

        {FAQ_SECTIONS.map((section) => (
          <section
            key={section.title}
            id={slugify(section.title)}
            className="mt-10 scroll-mt-24"
          >
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

        {/* Contact CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <p className="text-body-sm text-neutral-600">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-purple hover:underline"
            >
              Contact us
            </Link>{" "}
            or email{" "}
            <a
              href="mailto:info@isivislondon.com"
              className="font-medium text-brand-purple hover:underline"
            >
              info@isivislondon.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
