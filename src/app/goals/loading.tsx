export default function GoalsLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-16 rounded bg-white/[0.04]" />
        <div className="h-4 w-40 rounded bg-white/[0.04]" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
          />
        ))}
      </div>
    </div>
  );
}
