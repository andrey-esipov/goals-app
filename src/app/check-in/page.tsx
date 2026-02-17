import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/lib/dates";
import { getCyclesForUser } from "@/lib/cycles";
import { requireUserId } from "@/lib/session";
import {
  Calendar,
  ArrowRight,
  ClipboardCheck,
  Archive as ArchiveIcon,
} from "lucide-react";

export default async function CheckInIndexPage() {
  const userId = await requireUserId();
  const cycles = await getCyclesForUser(userId);
  const activeCycles = cycles.filter((cycle) => !cycle.archivedAt);
  const archivedCycles = cycles.filter((cycle) => cycle.archivedAt);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Weekly check-in
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pick a cycle to log progress for the current week.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold tracking-[0.1em] text-zinc-400 uppercase">
          Active cycles
        </h2>

        {activeCycles.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <ClipboardCheck className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-500">
              No active cycles. Create a cycle to start weekly check-ins.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {activeCycles.map((cycle) => (
              <Link
                key={cycle.id}
                href={`/check-in/${cycle.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-emerald-500/20 hover:bg-white/[0.04]">
                  <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[15px] font-semibold text-white transition-colors group-hover:text-emerald-300">
                        {cycle.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar className="h-3 w-3" />
                        {formatShortDate(cycle.startDate)} —{" "}
                        {formatShortDate(cycle.endDate)}
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">
                        {cycle._count.goals} goals to update
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {archivedCycles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-[0.1em] text-zinc-500 uppercase">
            Archived
          </h2>
          <div className="space-y-2">
            {archivedCycles.map((cycle) => (
              <Link
                key={cycle.id}
                href={`/check-in/${cycle.id}`}
                className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-3 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <ArchiveIcon className="h-3.5 w-3.5 text-zinc-600" />
                  <div>
                    <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300">
                      {cycle.name}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {cycle._count.goals} goals
                    </p>
                  </div>
                </div>
                <span className="text-xs text-zinc-600">Review</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
