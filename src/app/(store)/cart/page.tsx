import type { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "Your Bag | Maison ISIVIS",
  description: "Review your shopping bag and proceed to checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
