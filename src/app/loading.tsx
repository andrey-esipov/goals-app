export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      {/* Hero skeleton */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-8">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
          <div className="skeleton-shimmer mx-auto h-52 w-52 rounded-full" />
          <div className="space-y-3">
            <div className="skeleton-shimmer h-5 w-32 rounded" />
            <div className="skeleton-shimmer h-20 rounded-xl" />
          </div>
          <div className="skeleton-shimmer h-16 w-28 rounded-xl" />
        </div>
      </div>

      {/* Cycles grid skeleton */}
      <div className="space-y-5">
        <div className="skeleton-shimmer h-4 w-24 rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton-shimmer h-44 rounded-2xl border border-[var(--border-subtle)]"
            />
          ))}
        </div>
      </div>

      {/* Activity skeleton */}
      <div className="skeleton-shimmer h-40 rounded-2xl border border-[var(--border-subtle)]" />
    </div>
  );
}
