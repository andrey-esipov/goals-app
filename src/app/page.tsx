import { redirect } from "next/navigation";
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
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const userId = await getUserId();

  if (!userId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Track your goals</h1>
        <p className="text-muted-foreground max-w-md">
          Set goals, track weekly progress, and see your life score improve over
          time. Sign in to get started.
        </p>
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

  const hasData = cycles.length > 0;

  if (!hasData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome!</h1>
        <p className="text-muted-foreground max-w-md">
          Create your first cycle to start tracking goals and see your dashboard
          come to life.
        </p>
        <Button asChild>
          <Link href="/cycles">
            <Plus className="mr-2 h-4 w-4" />
            Create a cycle
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Your goals at a glance
          </p>
        </div>
        <StreakBadge streak={streak} />
      </div>

      {/* Life Score + Focus */}
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="flex items-center justify-center">
          <LifeScoreRing score={lifeScore} />
        </div>
        <FocusGoals goals={focusGoals} />
      </div>

      {/* Cycles */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active cycles</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/cycles">View all</Link>
          </Button>
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
