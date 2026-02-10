export default function ProductDetailLoading() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 h-4 w-64 animate-pulse rounded bg-neutral-200" />

      {/* Product layout skeleton */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery skeleton */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-2 sm:flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 animate-pulse rounded-luxury-md bg-neutral-200 sm:h-20 sm:w-20"
              />
            ))}
          </div>
          <div className="aspect-[3/4] flex-1 animate-pulse rounded-luxury-md bg-neutral-200" />
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="h-8 w-32 animate-pulse rounded bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="h-5 w-16 animate-pulse rounded bg-neutral-200" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-11 animate-pulse rounded-luxury-md bg-neutral-200"
              />
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 animate-pulse rounded-full bg-neutral-200"
              />
            ))}
          </div>
          <div className="h-14 w-full animate-pulse rounded-luxury-md bg-neutral-200" />
        </div>
      </div>

      {/* Accordion skeleton */}
      <div className="mt-12 max-w-3xl space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-neutral-200" />
        ))}
      </div>
    </div>
  );
}
