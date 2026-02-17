export default function CyclesLoading() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="space-y-2">
        <div className="h-7 w-20 rounded bg-white/[0.04]" />
        <div className="h-4 w-48 rounded bg-white/[0.04]" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
        <div className="h-64 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
      </div>
    </div>
  );
}
