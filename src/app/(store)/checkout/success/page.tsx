import type { Metadata } from "next";
import { SuccessPageClient } from "./SuccessPageClient";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your order has been placed successfully — Maison ISIVIS",
};

export default function SuccessPage() {
  return <SuccessPageClient />;
}
