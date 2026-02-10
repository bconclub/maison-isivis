import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WishlistClient } from "./WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist | Maison ISIVIS",
  description: "Your saved pieces. Add them to your bag when you're ready.",
};

export default function WishlistPage() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Wishlist" }]} className="mb-6" />

      <h1 className="mb-8 font-heading text-h2 font-semibold text-neutral-900 sm:text-h1">
        Your Wishlist
      </h1>

      <WishlistClient />
    </div>
  );
}
