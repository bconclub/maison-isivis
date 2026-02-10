import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-h1 font-heading font-bold text-brand-purple">404</p>
        <h1 className="mt-4 font-heading text-h2 text-neutral-900">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-neutral-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-luxury bg-brand-gradient px-8 py-3.5 text-base font-medium uppercase tracking-luxury text-white shadow-luxury-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
