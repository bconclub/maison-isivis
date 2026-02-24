import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Join The Queendom | Maison ISIVIS",
  description:
    "Join forces with ISIVIS London. Become part of our affiliate program, earn rewards, and be part of a global community of empowered women.",
};

export default function RewardsPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Join The Queendom" }]}
        className="mb-6"
      />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Join The Queendom
        </h1>

        <section className="mt-10">
          <h2 className="font-heading text-h3 font-light text-neutral-800">
            Let&apos;s Join Forces
          </h2>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            Established in 2021 in the vibrant city of London, ISIVIS London has
            swiftly risen to prominence as a top-tier international fashion
            design company, embodying contemporary sensuality and opulence on a
            global scale. As the premier next-generation designer in London, we
            specialise in creating, producing, distributing, and retailing
            fashion and lifestyle items tailored for the discerning Millennial
            and Gen Z audience, emphasising quality, comfort, and luxury.
          </p>
          <p className="mt-4 text-body-sm leading-relaxed text-neutral-600">
            From the outset, ISIVIS London has been a trailblazer, pushing
            boundaries and revolutionising the fashion landscape. With a
            commitment to innovation, we continuously introduce new products,
            staying ahead of the curve to offer our community an unparalleled
            and glamorous experience that sets us apart from the rest.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-12 rounded-luxury-md bg-neutral-50 p-6 text-center sm:p-8">
          <p className="text-body-sm text-neutral-600">
            Interested in collaborating?{" "}
            <Link
              href="/contact"
              className="font-medium text-brand-purple hover:underline"
            >
              Get in touch
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
