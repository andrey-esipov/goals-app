import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCycle } from "@/app/cycles/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateInput, formatShortDate } from "@/lib/dates";
import { getCycleById } from "@/lib/cycles";
import { requireUserId } from "@/lib/session";
import { ArrowLeft, Pencil } from "lucide-react";

export default async function EditCyclePage({
  params,
}: {
  params: { cycleId: string };
}) {
  const userId = await requireUserId();
  const cycle = await getCycleById(userId, params.cycleId);

  if (!cycle) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <Link
          href={`/cycles/${cycle.id}`}
          className="mb-2 inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to cycle
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Edit cycle
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {cycle.name} · {formatShortDate(cycle.startDate)} —{" "}
          {formatShortDate(cycle.endDate)}
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Pencil className="h-4 w-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Cycle details</h3>
        </div>

        <form className="space-y-4" action={updateCycle.bind(null, cycle.id)}>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Cycle name</Label>
            <Input
              name="name"
              defaultValue={cycle.name}
              required
              className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-emerald-500/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Start date</Label>
              <Input
                name="startDate"
                type="date"
                defaultValue={formatDateInput(cycle.startDate)}
                required
                className="border-white/[0.08] bg-white/[0.03] text-white focus:border-emerald-500/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">End date</Label>
              <Input
                name="endDate"
                type="date"
                defaultValue={formatDateInput(cycle.endDate)}
                required
                className="border-white/[0.08] bg-white/[0.03] text-white focus:border-emerald-500/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
            >
              Save cycle
            </button>
            <Link
              href={`/cycles/${cycle.id}`}
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
