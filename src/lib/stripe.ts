import Stripe from "stripe";

/**
 * Server-side Stripe client singleton.
 * Only use in API routes / server actions, NEVER on the client.
 */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY env var");
  }
  return new Stripe(key, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

export const stripe = getStripe();
