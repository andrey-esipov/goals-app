export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Hero skeleton */}
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
          <div className="mx-auto h-52 w-52 rounded-full bg-white/[0.04]" />
          <div className="space-y-3">
            <div className="h-5 w-32 rounded bg-white/[0.04]" />
            <div className="h-20 rounded-xl bg-white/[0.04]" />
          </div>
          <div className="h-16 w-28 rounded-xl bg-white/[0.04]" />
        </div>
      </div>

      {/* Cycles grid skeleton */}
      <div className="space-y-5">
        <div className="h-4 w-24 rounded bg-white/[0.04]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
      </div>

      {/* Activity skeleton */}
      <div className="h-40 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
    </div>
  );
}
