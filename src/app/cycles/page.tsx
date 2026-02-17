import Link from "next/link";
import { createCycle, setCycleArchived } from "@/app/cycles/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatShortDate } from "@/lib/dates";
import { getCyclesForUser } from "@/lib/cycles";
import { requireUserId } from "@/lib/session";
import {
  Calendar,
  Plus,
  ArrowRight,
  Archive,
  RotateCcw,
  Pencil,
  Target,
} from "lucide-react";

export default async function CyclesPage() {
  const userId = await requireUserId();
  const cycles = await getCyclesForUser(userId);
  const activeCycles = cycles.filter((cycle) => !cycle.archivedAt);
  const archivedCycles = cycles.filter((cycle) => cycle.archivedAt);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Cycles</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create focus windows and track goals inside each cycle.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Cycles list */}
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[0.1em] text-zinc-400 uppercase">
                Active
              </h2>
              <span className="text-xs text-zinc-600">
                {activeCycles.length} cycle
                {activeCycles.length !== 1 ? "s" : ""}
              </span>
            </div>

            {activeCycles.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
                <Target className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
                <p className="text-sm text-zinc-500">
                  No active cycles. Create one to start.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
                  >
                    <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/cycles/${cycle.id}`}
                          className="text-[15px] font-semibold text-white transition-colors hover:text-emerald-300"
                        >
                          {cycle.name}
                        </Link>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3" />
                          {formatShortDate(cycle.startDate)} —{" "}
                          {formatShortDate(cycle.endDate)}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-medium text-zinc-400">
                            {cycle._count.goals} goals
                          </span>
                          <span className="inline-flex items-center gap-1 text-emerald-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <Link
                          href={`/cycles/${cycle.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/cycles/${cycle.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <form action={setCycleArchived}>
                          <input
                            type="hidden"
                            name="cycleId"
                            value={cycle.id}
                          />
                          <input type="hidden" name="archive" value="true" />
                          <button
                            type="submit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {archivedCycles.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[0.1em] text-zinc-500 uppercase">
                  Archived
                </h2>
                <span className="text-xs text-zinc-600">
                  {archivedCycles.length}
                </span>
              </div>
              <div className="space-y-2">
                {archivedCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/cycles/${cycle.id}`}
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                      >
                        {cycle.name}
                      </Link>
                      <p className="text-xs text-zinc-600">
                        {formatShortDate(cycle.startDate)} —{" "}
                        {formatShortDate(cycle.endDate)} · {cycle._count.goals}{" "}
                        goals
                      </p>
                    </div>
                    <form action={setCycleArchived}>
                      <input type="hidden" name="cycleId" value={cycle.id} />
                      <input type="hidden" name="archive" value="false" />
                      <button
                        type="submit"
                        className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-300"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Create form */}
        <div className="h-fit rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Plus className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">New cycle</h3>
          </div>

          <form className="space-y-4" action={createCycle}>
            <div className="space-y-2">
              <Label htmlFor="cycle-name" className="text-xs text-zinc-400">
                Cycle name
              </Label>
              <Input
                id="cycle-name"
                name="name"
                placeholder="Q1 2026 — 12 Week Year"
                required
                className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-emerald-500/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cycle-start" className="text-xs text-zinc-400">
                  Start
                </Label>
                <Input
                  id="cycle-start"
                  name="startDate"
                  type="date"
                  required
                  className="border-white/[0.08] bg-white/[0.03] text-white focus:border-emerald-500/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-end" className="text-xs text-zinc-400">
                  End
                </Label>
                <Input
                  id="cycle-end"
                  name="endDate"
                  type="date"
                  required
                  className="border-white/[0.08] bg-white/[0.03] text-white focus:border-emerald-500/40"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
            >
              Create cycle
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
