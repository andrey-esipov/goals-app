"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { format, differenceInWeeks } from "date-fns";
import { ArrowRight, Calendar } from "lucide-react";

type CycleData = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goalCount: number;
  progress: number;
  weeklyProgress: number[];
};

function getProgressColor(progress: number) {
  if (progress >= 70) return { bar: "#34d399", bg: "rgba(52, 211, 153, 0.1)" };
  if (progress >= 40) return { bar: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" };
  return { bar: "#f87171", bg: "rgba(248, 113, 113, 0.1)" };
}

export function CycleCard({
  cycle,
  index,
}: {
  cycle: CycleData;
  index: number;
}) {
  const chartData = cycle.weeklyProgress.map((v, i) => ({
    week: i + 1,
    progress: v,
  }));
  const { bar, bg } = getProgressColor(cycle.progress);
  const weeksLeft = Math.max(0, differenceInWeeks(cycle.endDate, new Date()));
  const totalWeeks = differenceInWeeks(cycle.endDate, cycle.startDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08 + 0.3,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/cycles/${cycle.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]">
          {/* Subtle top accent */}
          <div
            className="absolute top-0 right-0 left-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${bar}40, transparent)`,
            }}
          />

          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-white">
                {cycle.name}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="h-3 w-3" />
                {format(cycle.startDate, "MMM d")} —{" "}
                {format(cycle.endDate, "MMM d")}
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-2 py-1 text-xs font-medium text-zinc-400">
              {cycle.goalCount} goals
            </div>
          </div>

          {/* Progress section */}
          <div className="mb-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-2xl font-medium text-white">
                {cycle.progress}%
              </span>
              <span className="text-xs text-zinc-500">
                {weeksLeft}w of {totalWeeks}w left
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: bar }}
                initial={{ width: 0 }}
                animate={{ width: `${cycle.progress}%` }}
                transition={{
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.08 + 0.5,
                }}
              />
            </div>
          </div>

          {/* Sparkline */}
          {chartData.length > 1 && (
            <div className="h-12 opacity-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke={bar}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Hover indicator */}
          <div className="mt-3 flex items-center gap-1 text-xs text-zinc-600 transition-colors group-hover:text-zinc-400">
            <span>View cycle</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
