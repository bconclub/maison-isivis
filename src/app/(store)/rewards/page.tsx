"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Tier {
  name: string;
  color: string; // gradient classes
  perks: string[];
}

const TIERS: Tier[] = [
  {
    name: "Bronze",
    color: "from-amber-700 to-amber-500",
    perks: [
      "Points with every purchase",
      "Double points days",
      "First order discount",
    ],
  },
  {
    name: "Silver",
    color: "from-neutral-400 to-neutral-300",
    perks: [
      "Points with every purchase",
      "Double points days",
      "First order discount",
      "Birthday points",
      "Early access to latest collections",
    ],
  },
  {
    name: "Gold",
    color: "from-yellow-500 to-amber-300",
    perks: [
      "Points with every purchase",
      "Double points days",
      "First order discount",
      "Birthday points",
      "Early access to latest collections",
      "Secret sale days",
      "Free next-day delivery for a year (UK only)",
    ],
  },
  {
    name: "Platinum",
    color: "from-brand-purple to-brand-blue",
    perks: [
      "Points with every purchase",
      "Double points days",
      "First order discount",
      "Birthday points",
      "Early access to latest collections",
      "Secret sale days",
      "Free next-day delivery for a year (UK only)",
      "Triple points days",
      "VIP phoneline",
    ],
  },
];

interface EarnMethod {
  action: string;
  points: string;
}

const EARN_METHODS: EarnMethod[] = [
  { action: "Create An Account", points: "500 points" },
  { action: "Make A Purchase", points: "5 points per \u00a31" },
  { action: "Join Our Mailing List", points: "50 points" },
  { action: "Follow Us On Instagram", points: "50 points" },
  { action: "Follow Us On Twitter", points: "50 points" },
  { action: "Like Us On Facebook", points: "50 points" },
  { action: "Refer A Friend", points: "500 points" },
];

interface FAQItem {
  q: string;
  a: ReactNode;
}

const REWARDS_FAQS: FAQItem[] = [
  {
    q: "Do returns affect my points?",
    a: "Yes. If you return an item, the points earned from that purchase will be deducted from your account balance.",
  },
  {
    q: "How long does ISIVIS London rewards run for?",
    a: "ISIVIS London Rewards is an ongoing loyalty programme with no end date. Your tier status is reviewed annually based on your spending within each calendar year.",
  },
  {
    q: "How do I enter the next tier?",
    a: "Your tier is determined by the total amount you spend within a calendar year. As you accumulate qualifying purchases, you will automatically move up to the next tier once you reach the required threshold.",
  },
  {
    q: "How do birthday points work?",
    a: "Members at Silver tier and above receive bonus birthday points automatically credited to their account during their birthday month. Make sure your date of birth is saved in your account settings.",
  },
  {
    q: "How does refer a friend work?",
    a: "Share your unique referral link with friends. When they make their first purchase, you both earn 500 bonus points. There is no limit to the number of friends you can refer.",
  },
  {
    q: "How do I get my free unlimited next day delivery on ISIVIS London Rewards?",
    a: "Gold and Platinum tier members enjoy free next-day delivery (UK only) for a full year. This is applied automatically at checkout when you are logged in to your rewards account.",
  },
  {
    q: "What are pending points?",
    a: "Pending points are points from recent purchases that are being processed. They will be added to your available balance once the return window for that order has passed.",
  },
  {
    q: "My points haven\u2019t been added to my account / I\u2019m missing points",
    a: (
      <>
        Points can take up to 48 hours to appear in your account after a
        qualifying action. If your points are still missing after this time,
        please{" "}
        <a
          href="mailto:connect@maisonisivis.com"
          className="font-medium text-brand-purple hover:underline"
        >
          contact us
        </a>{" "}
        with your order number and we&apos;ll look into it.
      </>
    ),
  },
  {
    q: "Why have I moved down a tier?",
    a: "Tier status is reviewed at the end of each calendar year based on your total spend. If your spending did not meet the threshold for your current tier, you may be moved to a lower tier. Any unused points remain in your account.",
  },
  {
    q: "How many points can I redeem at checkout?",
    a: "You can redeem as many available points as you like at checkout, up to the full value of your order. Points cannot be used to cover shipping charges.",
  },
  {
    q: "Can I redeem points and use a voucher/discount at the same time?",
    a: "No, you can only use one or the other. Applying a discount code on top of redeemed points will overwrite your points at checkout.",
  },
];

/* ------------------------------------------------------------------ */
/*  Accordion component                                                */
/* ------------------------------------------------------------------ */

function Accordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="pr-4 text-body-sm font-medium text-neutral-800">
          {item.q}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "shrink-0 text-neutral-400 transition-transform duration-300",
            open && "rotate-180"
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="text-body-sm leading-relaxed text-neutral-600">
            {item.a}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RewardsPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Rewards" }]} className="mb-6" />

      {/* Hero */}
      <div className="text-center">
        <h1 className="font-heading text-h1 font-light text-neutral-800">
          Rewards
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-body-sm leading-relaxed text-neutral-600">
          By enrolling in our unique rewards program, you&apos;ll receive more
          than just points for your purchases. Upon joining, you&apos;ll
          instantly earn 500 points, with additional points awarded for
          connecting with us on social media and subscribing to our mailing list.
        </p>
      </div>

      {/* ---- Reward Tiers ---- */}
      <section className="mt-16">
        <h2 className="text-center font-heading text-h2 font-light text-neutral-800">
          Membership Tiers
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="group flex flex-col overflow-hidden rounded-luxury-md border border-neutral-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-luxury"
            >
              {/* Tier header */}
              <div
                className={cn(
                  "bg-gradient-to-r px-5 py-4 text-center",
                  tier.color
                )}
              >
                <h3 className="font-heading text-lg font-medium uppercase tracking-luxury-wide text-white">
                  {tier.name}
                </h3>
              </div>

              {/* Perks list */}
              <ul className="flex flex-1 flex-col gap-2.5 p-5">
                {tier.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2 text-body-sm text-neutral-600"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 shrink-0 text-brand-purple"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Ways to Earn Points ---- */}
      <section className="mt-20">
        <h2 className="text-center font-heading text-h2 font-light text-neutral-800">
          Ways to Earn Points
        </h2>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="overflow-hidden rounded-luxury-md border border-neutral-100 bg-white shadow-sm">
            {EARN_METHODS.map((method, i) => (
              <div
                key={method.action}
                className={cn(
                  "flex items-center justify-between px-6 py-4",
                  i !== EARN_METHODS.length - 1 && "border-b border-neutral-100"
                )}
              >
                <span className="text-body-sm font-medium text-neutral-800">
                  {method.action}
                </span>
                <span className="shrink-0 rounded-full bg-brand-purple/10 px-3 py-1 text-caption font-semibold text-brand-purple">
                  {method.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FAQs ---- */}
      <section className="mt-20">
        <h2 className="text-center font-heading text-h2 font-light text-neutral-800">
          FAQs
        </h2>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-luxury-md border border-neutral-100 bg-white px-6 shadow-sm">
            {REWARDS_FAQS.map((item) => (
              <Accordion key={item.q} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <div className="mt-16 text-center">
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 rounded-luxury-md bg-gradient-to-r from-brand-purple via-brand-purple-80 to-brand-blue px-10 py-4 text-body-sm font-medium uppercase tracking-luxury text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury hover:brightness-110"
        >
          Join Now &amp; Earn 500 Points
        </Link>
        <p className="mt-4 text-body-sm text-neutral-500">
          Have questions?{" "}
          <a
            href="mailto:connect@maisonisivis.com"
            className="font-medium text-brand-purple hover:underline"
          >
            connect@maisonisivis.com
          </a>
        </p>
      </div>
    </div>
  );
}
