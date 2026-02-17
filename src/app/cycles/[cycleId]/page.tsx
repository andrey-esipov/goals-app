import Link from "next/link";
import { notFound } from "next/navigation";
import { setCycleArchived } from "@/app/cycles/actions";
import { createGoal, setGoalArchived, updateGoal } from "@/app/goals/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBadge } from "@/components/category-badge";
import { formatShortDate } from "@/lib/dates";
import { getCycleWithGoals } from "@/lib/cycles";
import { getCategoriesForUser } from "@/lib/categories";
import { requireUserId } from "@/lib/session";
import {
  ArrowLeft,
  Pencil,
  Archive,
  RotateCcw,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  ChevronDown,
} from "lucide-react";

const selectClass =
  "h-9 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white focus:border-emerald-500/40 focus:outline-none";

export default async function CycleDetailPage({
  params,
}: {
  params: { cycleId: string };
}) {
  const userId = await requireUserId();
  const [cycle, categories] = await Promise.all([
    getCycleWithGoals(userId, params.cycleId),
    getCategoriesForUser(userId),
  ]);

  if (!cycle) notFound();

  const activeGoals = cycle.goals.filter((g) => !g.archivedAt);
  const archivedGoals = cycle.goals.filter((g) => g.archivedAt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/cycles"
            className="mb-2 inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-3 w-3" />
            Cycles
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {cycle.name}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                cycle.archivedAt
                  ? "bg-zinc-500/10 text-zinc-500"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${cycle.archivedAt ? "bg-zinc-500" : "bg-emerald-500"}`}
              />
              {cycle.archivedAt ? "Archived" : "Active"}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="h-3 w-3" />
            {formatShortDate(cycle.startDate)} —{" "}
            {formatShortDate(cycle.endDate)}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href={`/cycles/${cycle.id}/edit`}
            className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
          <form action={setCycleArchived}>
            <input type="hidden" name="cycleId" value={cycle.id} />
            <input
              type="hidden"
              name="archive"
              value={cycle.archivedAt ? "false" : "true"}
            />
            <button
              type="submit"
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs transition-colors ${
                cycle.archivedAt
                  ? "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                  : "text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
              }`}
            >
              {cycle.archivedAt ? (
                <RotateCcw className="h-3 w-3" />
              ) : (
                <Archive className="h-3 w-3" />
              )}
              {cycle.archivedAt ? "Restore" : "Archive"}
            </button>
          </form>
        </div>
      </div>

      {/* Add goal form */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Plus className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Add a goal</h3>
        </div>

        <form
          className="grid gap-4 sm:grid-cols-2"
          action={createGoal.bind(null, cycle.id)}
        >
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Title</Label>
            <Input
              name="title"
              placeholder="Ship v1"
              required
              className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-emerald-500/40"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Unit (optional)</Label>
            <Input
              name="unit"
              placeholder="hrs, leads, lbs"
              className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-emerald-500/40"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs text-zinc-400">Description</Label>
            <Textarea
              name="description"
              placeholder="Why does this matter?"
              className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-emerald-500/40"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Start value</Label>
            <Input
              name="startValue"
              type="number"
              step="any"
              defaultValue={0}
              className="border-white/[0.08] bg-white/[0.03] text-white focus:border-emerald-500/40"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Target value</Label>
            <Input
              name="targetValue"
              type="number"
              step="any"
              required
              className="border-white/[0.08] bg-white/[0.03] text-white focus:border-emerald-500/40"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Direction</Label>
            <select name="direction" className={selectClass}>
              <option value="INCREASE">Increase</option>
              <option value="DECREASE">Decrease</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Category</Label>
            <select name="categoryId" className={selectClass}>
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
            >
              Create goal
            </button>
          </div>
        </form>
      </div>

      {/* Active goals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-[0.1em] text-zinc-400 uppercase">
            Active goals
          </h2>
          <span className="text-xs text-zinc-600">{activeGoals.length}</span>
        </div>

        {activeGoals.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <Target className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
            <p className="text-sm text-zinc-500">
              No goals yet. Add the first outcome for this cycle.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeGoals.map((goal) => {
              const range = goal.targetValue - goal.startValue;
              const progress =
                range === 0
                  ? 100
                  : Math.round(
                      Math.max(
                        0,
                        Math.min(
                          1,
                          (goal.currentValue - goal.startValue) / range,
                        ),
                      ) * 100,
                    );
              const progressColor =
                progress >= 70
                  ? "#34d399"
                  : progress >= 40
                    ? "#fbbf24"
                    : "#f87171";
              const cat = (goal as any).category;

              return (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-white">
                          {goal.title}
                        </h3>
                        {cat && (
                          <CategoryBadge
                            name={cat.name}
                            color={cat.color}
                            icon={cat.icon}
                          />
                        )}
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
                          style={{
                            backgroundColor: `${progressColor}12`,
                            color: progressColor,
                          }}
                        >
                          {goal.direction === "DECREASE" ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : (
                            <TrendingUp className="h-3 w-3" />
                          )}
                          {goal.direction === "DECREASE"
                            ? "Decrease"
                            : "Increase"}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="mt-1 text-xs text-zinc-500">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-lg font-medium text-white">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progressColor,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      {goal.startValue}
                      {goal.unit ? ` ${goal.unit}` : ""} → {goal.targetValue}
                      {goal.unit ? ` ${goal.unit}` : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <details className="group relative">
                        <summary className="cursor-pointer list-none text-xs text-zinc-500 transition-colors hover:text-zinc-300">
                          <span className="flex items-center gap-1">
                            Edit
                            <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                          </span>
                        </summary>
                        <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border border-white/[0.08] bg-[#0c0c0d] p-4 shadow-xl">
                          <form
                            className="space-y-3"
                            action={updateGoal.bind(null, goal.id)}
                          >
                            <Input
                              name="title"
                              defaultValue={goal.title}
                              required
                              className="border-white/[0.08] bg-white/[0.03] text-sm text-white focus:border-emerald-500/40"
                            />
                            <Input
                              name="unit"
                              defaultValue={goal.unit ?? ""}
                              placeholder="Unit"
                              className="border-white/[0.08] bg-white/[0.03] text-sm text-white focus:border-emerald-500/40"
                            />
                            <Textarea
                              name="description"
                              defaultValue={goal.description ?? ""}
                              className="border-white/[0.08] bg-white/[0.03] text-sm text-white focus:border-emerald-500/40"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                name="startValue"
                                type="number"
                                step="any"
                                defaultValue={goal.startValue}
                                className="border-white/[0.08] bg-white/[0.03] text-sm text-white focus:border-emerald-500/40"
                              />
                              <Input
                                name="targetValue"
                                type="number"
                                step="any"
                                defaultValue={goal.targetValue}
                                required
                                className="border-white/[0.08] bg-white/[0.03] text-sm text-white focus:border-emerald-500/40"
                              />
                            </div>
                            <select
                              name="direction"
                              defaultValue={goal.direction}
                              className={selectClass + " text-sm"}
                            >
                              <option value="INCREASE">Increase</option>
                              <option value="DECREASE">Decrease</option>
                            </select>
                            <select
                              name="categoryId"
                              defaultValue={(goal as any).categoryId ?? ""}
                              className={selectClass + " text-sm"}
                            >
                              <option value="">No category</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="w-full rounded-lg bg-emerald-500 py-2 text-xs font-medium text-white hover:bg-emerald-400"
                            >
                              Save
                            </button>
                          </form>
                        </div>
                      </details>
                      <form action={setGoalArchived}>
                        <input type="hidden" name="goalId" value={goal.id} />
                        <input type="hidden" name="archive" value="true" />
                        <button
                          type="submit"
                          className="text-xs text-zinc-600 transition-colors hover:text-red-400"
                        >
                          Archive
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Archived goals */}
      {archivedGoals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-[0.1em] text-zinc-500 uppercase">
            Archived
          </h2>
          <div className="space-y-2">
            {archivedGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    {goal.title}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {goal.startValue} → {goal.targetValue}
                    {goal.unit ? ` ${goal.unit}` : ""}
                  </p>
                </div>
                <form action={setGoalArchived}>
                  <input type="hidden" name="goalId" value={goal.id} />
                  <input type="hidden" name="archive" value="false" />
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
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
  );
}
