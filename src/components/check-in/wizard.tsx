"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { upsertWeeklyCheckIn } from "@/app/check-in/actions";
import { CategoryIcon } from "@/components/icons/category-icons";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type GoalData = {
  id: string;
  title: string;
  description: string | null;
  unit: string | null;
  startValue: number;
  targetValue: number;
  currentValue: number;
  direction: string;
  progress: number;
  notes: string;
  category: { name: string; color: string; icon: string } | null;
};

type WizardProps = {
  cycleId: string;
  cycleName: string;
  cycleStart: string;
  cycleEnd: string;
  weekStart: string;
  weekLabel: string;
  weeksElapsed: number;
  totalWeeks: number;
  expectedPercent: number;
  goals: GoalData[];
  existingNotes: string;
  isUpdate: boolean;
};

export function CheckInWizard(props: WizardProps) {
  const [step, setStep] = useState(0); // 0 = goals, last = notes, last+1 = done
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(props.goals.map((g) => [g.id, g.currentValue])),
  );
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(props.goals.map((g) => [g.id, g.notes])),
  );
  const [weekNotes, setWeekNotes] = useState(props.existingNotes);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const totalSteps = props.goals.length + 1; // goals + reflection
  const isReflection = step === props.goals.length;
  const currentGoal = !isReflection ? props.goals[step] : null;

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.set("cycleId", props.cycleId);
    formData.set("weekStart", props.weekStart);
    formData.set("notes", weekNotes);
    for (const goal of props.goals) {
      formData.set("goalId", goal.id);
      formData.set(
        `value-${goal.id}`,
        String(values[goal.id] ?? goal.startValue),
      );
      formData.set(`notes-${goal.id}`, notes[goal.id] ?? "");
    }
    await upsertWeeklyCheckIn(formData);
    setSaving(false);
    setDone(true);
  }

  if (done) {
    return (
      <motion.div
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Sparkles className="h-10 w-10 text-emerald-400" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Check-in complete!
        </h2>
        <p className="mb-6 text-sm text-zinc-400">
          {props.goals.length} goals updated for the week of {props.weekLabel}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
        >
          Back to dashboard
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/check-in"
            className="mb-2 inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Link>
          <h1 className="text-xl font-bold text-white">Weekly check-in</h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="h-3 w-3" />
            {props.cycleName} · Week {props.weeksElapsed} of {props.totalWeeks}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step
                ? "w-8 bg-emerald-400"
                : i < step
                  ? "w-1.5 bg-emerald-400/40"
                  : "w-1.5 bg-white/[0.08]"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {currentGoal ? (
          <motion.div
            key={`goal-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            {/* Goal header */}
            <div className="mb-6 flex items-start gap-3">
              {currentGoal.category && (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${currentGoal.category.color}15`,
                    color: currentGoal.category.color,
                  }}
                >
                  <CategoryIcon
                    icon={currentGoal.category.icon}
                    className="h-5 w-5"
                  />
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {currentGoal.title}
                </h2>
                {currentGoal.description && (
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {currentGoal.description}
                  </p>
                )}
              </div>
            </div>

            {/* Progress ring */}
            <div className="mb-6 flex items-center gap-6">
              <div className="relative h-24 w-24 shrink-0">
                <svg className="-rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    opacity="0.04"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={currentGoal.category?.color ?? "#34d399"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      42 *
                      (1 -
                        (values[currentGoal.id] - currentGoal.startValue) /
                          (currentGoal.targetValue - currentGoal.startValue ||
                            1))
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-lg font-medium text-white">
                    {Math.round(
                      Math.max(
                        0,
                        Math.min(
                          1,
                          (values[currentGoal.id] - currentGoal.startValue) /
                            (currentGoal.targetValue - currentGoal.startValue ||
                              1),
                        ),
                      ) * 100,
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>
                    Start: {currentGoal.startValue}
                    {currentGoal.unit ? ` ${currentGoal.unit}` : ""}
                  </span>
                  <span>
                    Target: {currentGoal.targetValue}
                    {currentGoal.unit ? ` ${currentGoal.unit}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Expected:</span>
                  <span className="text-zinc-400">
                    {props.expectedPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Value input */}
            <div className="mb-4 space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                Current value
              </label>
              <input
                type="number"
                step="any"
                value={values[currentGoal.id] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    [currentGoal.id]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 font-mono text-lg text-white placeholder:text-zinc-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">
                Notes (optional)
              </label>
              <textarea
                value={notes[currentGoal.id] ?? ""}
                onChange={(e) =>
                  setNotes((n) => ({
                    ...n,
                    [currentGoal.id]: e.target.value,
                  }))
                }
                placeholder="Context, blockers, wins..."
                rows={2}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
          </motion.div>
        ) : (
          /* Reflection step */
          <motion.div
            key="reflection"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Sparkles className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Weekly reflection
                </h2>
                <p className="text-xs text-zinc-500">
                  What went well? What needs work?
                </p>
              </div>
            </div>

            <textarea
              value={weekNotes}
              onChange={(e) => setWeekNotes(e.target.value)}
              placeholder="Wins, blockers, intentions for next week..."
              rows={5}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <span className="font-mono text-xs text-zinc-600">
          {step + 1} / {totalSteps}
        </span>

        {isReflection ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400 disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Check className="h-4 w-4" />
                {props.isUpdate ? "Update" : "Save"}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
