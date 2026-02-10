export default function ProductsLoading() {
  return (
    <div className="container-luxury py-8 sm:py-12">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-neutral-200" />

      {/* Header skeleton */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded bg-neutral-200" />
      </div>

      {/* Grid skeleton */}
      <div className="flex gap-10">
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-6">
            <div className="h-6 w-20 animate-pulse rounded bg-neutral-200" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-neutral-200" />
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] animate-pulse rounded-luxury-md bg-neutral-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
