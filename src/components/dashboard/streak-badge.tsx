"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;

  return (
    <motion.div
      className="bg-card inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -5, 0] }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Flame className="h-4 w-4 text-orange-500" />
      </motion.div>
      <span className="text-sm font-semibold">{streak}</span>
      <span className="text-muted-foreground text-xs">
        week{streak !== 1 ? "s" : ""}
      </span>
    </motion.div>
  );
}
