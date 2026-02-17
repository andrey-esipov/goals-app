"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown } from "lucide-react";

type FocusGoal = {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string | null;
  progress: number;
  expectedProgress: number;
  gap: number;
  cycle: { name: string };
  cycleId: string;
};

export function FocusGoals({ goals }: { goals: FocusGoal[] }) {
  if (goals.length === 0) {
    return (
      <motion.div
        className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-300">All on track</p>
            <p className="text-xs text-zinc-500">
              Every goal is at or above pace
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Needs attention</h3>
          <p className="text-xs text-zinc-500">
            {goals.length} goals behind pace
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {goals.map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 + 0.6 }}
          >
            <Link href={`/cycles/${goal.cycleId}`} className="group block">
              <div className="-mx-2 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">
                      {goal.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {goal.cycle.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-red-400">
                    <TrendingDown className="h-3 w-3" />
                    {Math.round(goal.gap * 100)}% behind
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className="h-full rounded-full bg-red-400/60"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {goal.progress}%
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
