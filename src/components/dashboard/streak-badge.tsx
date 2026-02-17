"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <motion.div
      className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={streak > 0 ? { rotate: [0, -8, 8, -4, 0] } : {}}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Flame
            className={`h-4 w-4 ${streak > 0 ? "text-orange-400" : "text-zinc-600"}`}
          />
        </motion.div>
        <span className="font-mono text-lg font-medium text-white">
          {streak}
        </span>
      </div>
      <div className="text-xs leading-tight text-zinc-500">
        week{streak !== 1 ? "s" : ""}
        <br />
        streak
      </div>
    </motion.div>
  );
}
