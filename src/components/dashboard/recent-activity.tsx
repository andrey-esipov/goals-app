"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Activity = {
  id: string;
  cycleName: string;
  weekStart: Date;
  updatedAt: Date;
  goalUpdates: number;
  goals: string[];
};

export function RecentActivity({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <motion.div
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-zinc-600" />
          <p className="text-sm text-zinc-500">
            No check-ins yet. Complete your first weekly check-in to see
            activity here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-[0.1em] text-zinc-400 uppercase">
        Recent activity
      </h3>
      <div className="space-y-0.5">
        {activities.map((a, i) => (
          <motion.div
            key={a.id}
            className="flex items-center gap-3 rounded-lg px-2 py-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 + 0.9 }}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500/70" />
            <div className="min-w-0 flex-1">
              <span className="text-sm text-zinc-300">
                <span className="font-medium text-white">{a.cycleName}</span>
                {" — "}
                {a.goalUpdates} goal{a.goalUpdates !== 1 ? "s" : ""} updated
              </span>
            </div>
            <span className="shrink-0 text-xs text-zinc-600">
              {formatDistanceToNow(a.updatedAt, { addSuffix: true })}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
