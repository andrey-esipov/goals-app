import Link from "next/link";
import { getActiveGoalsForUser } from "@/lib/goals";
import { requireUserId } from "@/lib/session";
import { formatShortDate } from "@/lib/dates";
import { TrendingUp, TrendingDown, ArrowRight, Target } from "lucide-react";

export default async function GoalsPage() {
  const userId = await requireUserId();
  const goals = await getActiveGoalsForUser(userId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Goals</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Active goals across all cycles.
        </p>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <Target className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
          <p className="text-sm text-zinc-500">
            No active goals. Create one inside a cycle.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
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
            const isDecrease = goal.direction === "DECREASE";
            const progressColor =
              progress >= 70
                ? "#34d399"
                : progress >= 40
                  ? "#fbbf24"
                  : "#f87171";

            return (
              <Link
                key={goal.id}
                href={`/cycles/${goal.cycleId}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="truncate text-[15px] font-semibold text-white transition-colors group-hover:text-emerald-300">
                          {goal.title}
                        </h3>
                        <div
                          className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium"
                          style={{
                            backgroundColor: `${progressColor}12`,
                            color: progressColor,
                          }}
                        >
                          {isDecrease ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : (
                            <TrendingUp className="h-3 w-3" />
                          )}
                          {isDecrease ? "Decrease" : "Increase"}
                        </div>
                      </div>

                      {goal.description && (
                        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                          {goal.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                        <span>{goal.cycle.name}</span>
                        <span className="text-zinc-700">·</span>
                        <span>
                          {formatShortDate(goal.cycle.startDate)} —{" "}
                          {formatShortDate(goal.cycle.endDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-mono text-xl font-medium text-white">
                        {progress}%
                      </span>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>
                          {goal.currentValue}
                          {goal.unit ? ` ${goal.unit}` : ""}
                        </span>
                        <ArrowRight className="h-3 w-3 text-zinc-600" />
                        <span>
                          {goal.targetValue}
                          {goal.unit ? ` ${goal.unit}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progressColor,
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
