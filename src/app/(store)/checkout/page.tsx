import type { Metadata } from "next";
import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order — Maison ISIVIS",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
