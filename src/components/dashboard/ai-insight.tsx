"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

export function AiInsight({
  content,
  createdAt,
}: {
  content: string;
  createdAt: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-500/[0.04] to-transparent"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Top accent */}
      <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white">
              AI Weekly Coach
            </h3>
            <p className="text-[11px] text-zinc-500">
              {new Date(createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed text-zinc-300">
                {content.split("\n").map((line, i) => (
                  <p key={i} className={line.startsWith("-") ? "ml-2" : ""}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
