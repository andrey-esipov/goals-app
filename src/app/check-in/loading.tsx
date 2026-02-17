export default function CheckInLoading() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded bg-white/[0.04]" />
        <div className="h-4 w-52 rounded bg-white/[0.04]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
          />
        ))}
      </div>
    </div>
  );
}
