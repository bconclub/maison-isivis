import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | Maison ISIVIS",
  description:
    "Learn how ISIVIS London collects, uses, and protects your personal information when you visit our website or make a purchase.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} className="mb-6" />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Privacy Policy
        </h1>
        <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
          This Privacy Policy explains how ISIVIS London collects, uses, and
          shares your personal information when you visit our website or make a
          purchase.
        </p>

        {/* Information We Collect */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Information We Collect
          </h2>

          <div className="mt-4 space-y-6 text-body-sm leading-relaxed text-neutral-600">
            <div>
              <h3 className="font-medium text-neutral-800">
                A. Personally Identifiable Information (PII)
              </h3>
              <p className="mt-2">
                You are not required to provide PII to use our website. However,
                you may choose to provide information such as your name or email
                address when prompted. If you subscribe to our email newsletter,
                we will collect your email address.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-neutral-800">
                B. Non-Personally Identifiable Information
              </h3>
              <p className="mt-2">
                We may collect Non-Personally Identifiable Information about your
                interactions with our website, including cookies: small files
                that help us recognise your browser and track site usage.
              </p>
              <p className="mt-2">
                When you visit our website, we automatically collect information
                about your device, such as your web browser, IP address, time
                zone, and cookies installed. We refer to this as &ldquo;Device
                Information.&rdquo;
              </p>
            </div>

            <div>
              <h3 className="font-medium text-neutral-800">
                Device Information Technologies
              </h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Cookies:</strong> Data files stored on your device
                  containing an anonymous unique identifier.
                </li>
                <li>
                  <strong>Log Files:</strong> Track actions on the site,
                  collecting data like your IP address, browser type, and
                  timestamps.
                </li>
                <li>
                  <strong>Web Beacons, Tags, and Pixels:</strong> Electronic
                  files that capture your browsing activities.
                </li>
              </ul>
            </div>

            <p>
              When you make a purchase, we collect information such as your name,
              billing address, shipping address, payment information, and email
              address, referred to as &ldquo;Order Information.&rdquo; When we
              mention &ldquo;Personal Information&rdquo; in this policy, we refer
              to both Device Information and Order Information.
            </p>
          </div>
        </section>

        {/* How We Use Your Personal Information */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            How We Use Your Personal Information
          </h2>
          <div className="mt-4 space-y-4 text-body-sm leading-relaxed text-neutral-600">
            <p>
              We primarily use Order Information to fulfil orders, including
              processing payments, arranging shipping, and sending invoices.
              Additionally, we use this information to:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Communicate with you</li>
              <li>Monitor orders for risks or fraud</li>
              <li>
                Provide information or advertising based on your preferences
              </li>
            </ul>
            <p>
              We use Device Information to identify potential risks and fraud and
              to enhance our website through analytics on user interactions.
            </p>
          </div>
        </section>

        {/* How We Share Your Personal Information */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            How We Share Your Personal Information
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            We share your Personal Information with third parties to assist us in
            utilising it as described. For example, we use Google Analytics for
            insights into user interactions. We may also share your information
            to comply with legal requirements or to protect our rights.
          </p>
        </section>

        {/* Behavioural Advertising */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Behavioural Advertising
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            We use your Personal Information to deliver targeted advertisements.
            You can opt out of certain targeted advertising services via the
            Digital Advertising Alliance&apos;s opt-out portal or your
            browser&apos;s privacy settings.
          </p>
        </section>

        {/* Do Not Track */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Do Not Track
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            We do not alter our data collection practices in response to Do Not
            Track signals from your browser.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Your Rights
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            If you are a resident of the UK or Europe, you have the right to
            access, correct, update, or delete your personal information. To
            exercise this right, please contact us. We process your information
            to fulfil contracts or pursue legitimate business interests, and it
            may be transferred outside the UK and Europe.
          </p>
        </section>

        {/* Disclosure to Outside Parties */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Disclosure to Outside Parties
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            We do not sell or trade your PII to outside parties, except for
            trusted third parties who assist us in our operations and are
            obligated to keep your information confidential. Non-PII may be
            shared for marketing purposes.
          </p>
        </section>

        {/* Data Retention */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Data Retention
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            We retain your Order Information for our records unless you request
            deletion.
          </p>
        </section>

        {/* Changes */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Changes
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            We may update this Privacy Policy periodically to reflect changes in
            practices or legal requirements.
          </p>
        </section>

        {/* Your Consent */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Your Consent
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            By using our site, you consent to this privacy policy. Updates will
            be posted on this page.
          </p>
        </section>

        {/* COPPA */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Children&apos;s Online Privacy Protection
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            We comply with COPPA and do not collect information from anyone under
            13 years old. Our services are intended for users aged 13 and older.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Contact Us
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            For more information about our privacy practices, questions, or
            complaints, please contact us at{" "}
            <a
              href="mailto:info@isivislondon.com"
              className="font-medium text-brand-purple hover:underline"
            >
              info@isivislondon.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
