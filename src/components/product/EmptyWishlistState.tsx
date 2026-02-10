import Link from "next/link";

export function EmptyWishlistState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Heart icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-300"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </div>

      <h2 className="mb-2 font-heading text-h3 text-neutral-900">
        Your Wishlist is Empty
      </h2>
      <p className="mb-8 max-w-sm text-body-sm text-neutral-500">
        Save the pieces you love by tapping the heart icon on any product.
        They&apos;ll appear here for easy access.
      </p>

      <Link
        href="/products"
        className="inline-flex h-12 items-center justify-center rounded-luxury-md bg-brand-purple px-8 text-body-sm font-medium uppercase tracking-luxury text-white transition-all duration-300 hover:bg-brand-purple-light hover:shadow-luxury"
      >
        Explore the Collection
      </Link>
    </div>
  );
}
