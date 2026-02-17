import { getUserId } from "@/lib/session";
import {
  getLifeScore,
  getCycleProgress,
  getWeeklyStreak,
  getFocusGoals,
  getRecentActivity,
} from "@/lib/dashboard";
import { LifeScoreRing } from "@/components/dashboard/life-score-ring";
import { CycleCard } from "@/components/dashboard/cycle-card";
import { FocusGoals } from "@/components/dashboard/focus-goals";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Plus, Target } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const userId = await getUserId();

  if (!userId) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <Target className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
          Track your goals
        </h1>
        <p className="mb-8 max-w-md text-base text-zinc-500">
          Set goals, track weekly progress, and see your life score improve over
          time. Built for ambitious people.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/10 text-zinc-300 hover:bg-white/5"
          >
            Learn more
          </Button>
          <Button className="bg-emerald-500 text-white hover:bg-emerald-400">
            Get started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const [lifeScore, cycles, streak, focusGoals, recentActivity] =
    await Promise.all([
      getLifeScore(userId),
      getCycleProgress(userId),
      getWeeklyStreak(userId),
      getFocusGoals(userId),
      getRecentActivity(userId),
    ]);

  const totalGoals = await prisma.goal.count({
    where: { userId, archivedAt: null },
  });

  const hasData = cycles.length > 0;

  if (!hasData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <Plus className="h-8 w-8 text-zinc-500" />
        </div>
        <div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
            Welcome to Goals
          </h1>
          <p className="max-w-sm text-sm text-zinc-500">
            Create your first cycle to start tracking goals and see your
            dashboard come to life.
          </p>
        </div>
        <Button
          asChild
          className="bg-emerald-500 text-white hover:bg-emerald-400"
        >
          <Link href="/cycles">
            <Plus className="mr-2 h-4 w-4" />
            Create a cycle
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero section: Life Score + Stats */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-8">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-500/[0.03] blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
          {/* Life Score */}
          <LifeScoreRing score={lifeScore} goalCount={totalGoals} />

          {/* Focus Goals */}
          <div className="flex-1">
            <FocusGoals goals={focusGoals} />
          </div>

          {/* Streak */}
          <div className="flex md:flex-col md:items-end">
            <StreakBadge streak={streak} />
          </div>
        </div>
      </div>

      {/* Cycles Grid */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-[0.1em] text-zinc-400 uppercase">
            Active cycles
          </h2>
          <Link
            href="/cycles"
            className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cycles.map((cycle, i) => (
            <CycleCard key={cycle.id} cycle={cycle} index={i} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />
    </div>
  );
}
