export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />
  );
}

// Home page: big banner + row of cards + one large block
export function HomeSkeleton() {
  return (
    <div
      className="mx-auto max-w-5xl space-y-6 px-4 py-4"
      aria-busy="true"
      aria-label="Loading"
    >
      <Skeleton className="h-48 w-full sm:h-64" />

      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-36 shrink-0 sm:h-44 sm:w-44" />
        ))}
      </div>

      <Skeleton className="h-64 w-full sm:h-80" />
    </div>
  );
}

// Product cards grid (Categories, Products, Wishlist pages)
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      aria-busy="true"
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="space-y-2 rounded-2xl border border-slate-100 p-2"
        >
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// Product detail page
export function ProductDetailSkeleton() {
  return (
    <div
      className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-2"
      aria-busy="true"
    >
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
