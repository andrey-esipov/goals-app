"use client";

import { motion } from "framer-motion";

function getScoreColor(score: number) {
  if (score >= 70)
    return {
      stroke: "#34d399",
      glow: "rgba(52, 211, 153, 0.3)",
      label: "On track",
    };
  if (score >= 40)
    return {
      stroke: "#fbbf24",
      glow: "rgba(251, 191, 36, 0.3)",
      label: "Needs focus",
    };
  return {
    stroke: "#f87171",
    glow: "rgba(248, 113, 113, 0.3)",
    label: "Behind",
  };
}

export function LifeScoreRing({
  score,
  goalCount,
}: {
  score: number;
  goalCount?: number;
}) {
  const { stroke, glow, label } = getScoreColor(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative h-52 w-52">
        {/* Glow effect */}
        <div
          className="absolute inset-4 rounded-full blur-2xl"
          style={{ backgroundColor: glow, opacity: 0.4 }}
        />

        <svg className="relative h-52 w-52 -rotate-90" viewBox="0 0 200 200">
          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="6"
            opacity="0.04"
          />
          {/* Progress */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Gradient overlay on the stroke */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            opacity="0.5"
          />
          <defs>
            <linearGradient
              id="scoreGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-mono text-5xl font-medium tracking-tighter text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {score}
          </motion.span>
          <motion.span
            className="mt-0.5 text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Life Score
          </motion.span>
        </div>
      </div>

      <motion.div
        className="flex items-center gap-3 text-sm"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: `${stroke}15`,
            color: stroke,
            border: `1px solid ${stroke}30`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: stroke }}
          />
          {label}
        </span>
        {goalCount !== undefined && (
          <span className="text-zinc-500">{goalCount} active goals</span>
        )}
      </motion.div>
    </div>
  );
}
