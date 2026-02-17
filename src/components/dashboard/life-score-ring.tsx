"use client";

import { motion } from "framer-motion";

function getScoreColor(score: number) {
  if (score >= 70) return { stroke: "#22c55e", bg: "text-green-500" };
  if (score >= 40) return { stroke: "#f59e0b", bg: "text-amber-500" };
  return { stroke: "#ef4444", bg: "text-red-500" };
}

export function LifeScoreRing({ score }: { score: number }) {
  const { stroke, bg } = getScoreColor(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-44 w-44">
        <svg className="h-44 w-44 -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/20"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-4xl font-bold ${bg}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}%
          </motion.span>
          <span className="text-muted-foreground text-xs">Life Score</span>
        </div>
      </div>
    </div>
  );
}
