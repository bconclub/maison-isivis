import Link from "next/link";

interface EmptyCartStateProps {
  /** "drawer" shows a compact version, "page" shows a full-width version */
  variant?: "drawer" | "page";
}

export function EmptyCartState({ variant = "drawer" }: EmptyCartStateProps) {
  const isPage = variant === "page";

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* Bag icon */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
        <svg
          width={isPage ? 32 : 28}
          height={isPage ? 32 : 28}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-300"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>

      <h2 className={`mb-2 font-heading font-semibold text-neutral-900 ${isPage ? "text-h3" : "text-h4"}`}>
        Your Bag is Empty
      </h2>
      <p className="mb-6 max-w-xs text-body-sm text-neutral-500">
        Looks like you haven&apos;t added anything yet. Discover our latest collection.
      </p>

      <Link
        href="/products"
        className="inline-flex h-11 items-center justify-center rounded-luxury-md bg-brand-purple px-6 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
