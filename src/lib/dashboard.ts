import { cache } from "react";
import {
  addWeeks,
  differenceInDays,
  differenceInWeeks,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { GoalDirection } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type LifeScore = {
  score: number;
  label: string;
  goalCount: number;
};

export type CycleProgress = {
  cycleId: string | null;
  name: string;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  daysRemaining: number | null;
  weeksElapsed: number;
  weeksTotal: number;
  sparkline: { label: string; value: number }[];
};

export type WeeklyStreak = {
  streak: number;
  isCurrentWeekComplete: boolean;
};

export type FocusGoal = {
  id: string;
  title: string;
  progress: number;
  pace: number;
  delta: number;
  currentValue: number;
  targetValue: number;
  unit: string | null;
  category: { name: string; color: string; icon: string } | null;
};

export type RecentActivity = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
};

const getUserContext = cache(async () => {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const sessionId = (session.user as { id?: string | null }).id;
  if (sessionId) return { id: sessionId };

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user ? { id: user.id } : null;
});

const getActiveCycle = cache(async (userId: string) =>
  prisma.cycle.findFirst({
    where: { userId, archivedAt: null },
    orderBy: { startDate: "desc" },
  }),
);

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const calculateGoalProgress = (
  goal: {
    startValue: number;
    targetValue: number;
    currentValue: number;
    direction: GoalDirection;
  },
  overrideValue?: number,
) => {
  const current = overrideValue ?? goal.currentValue;
  const total = Math.abs(goal.targetValue - goal.startValue);
  if (total === 0) return 0;

  const completed =
    goal.direction === "DECREASE"
      ? goal.startValue - current
      : current - goal.startValue;

  return clamp(completed / total);
};

const getTimeProgress = (startDate: Date, endDate: Date) => {
  const total = endDate.getTime() - startDate.getTime();
  if (total <= 0) return 0;
  const elapsed = clamp((Date.now() - startDate.getTime()) / total, 0, 1);
  return elapsed;
};

const buildTimeSparkline = (progress: number, points = 8) =>
  Array.from({ length: points }, (_, index) => {
    const ratio = points === 1 ? progress : (index / (points - 1)) * progress;
    return {
      label: `W${index + 1}`,
      value: Math.round(clamp(ratio, 0, 1) * 100),
    };
  });

const buildCheckInSparkline = (
  checkIns: Array<{
    weekStart: Date;
    updates: Array<{
      value: number;
      goal: {
        startValue: number;
        targetValue: number;
        currentValue: number;
        direction: GoalDirection;
      };
    }>;
  }>,
) =>
  checkIns.map((checkIn) => {
    if (!checkIn.updates.length) {
      return {
        label: `W${checkIn.weekStart.getMonth() + 1}/${checkIn.weekStart.getDate()}`,
        value: 0,
      };
    }

    const average =
      checkIn.updates.reduce((sum, update) => {
        const progress = calculateGoalProgress(update.goal, update.value);
        return sum + progress;
      }, 0) / checkIn.updates.length;

    return {
      label: `W${checkIn.weekStart.getMonth() + 1}/${checkIn.weekStart.getDate()}`,
      value: Math.round(clamp(average, 0, 1) * 100),
    };
  });

const emptyCycle: CycleProgress = {
  cycleId: null,
  name: "No active cycle",
  startDate: null,
  endDate: null,
  progress: 0,
  daysRemaining: null,
  weeksElapsed: 0,
  weeksTotal: 0,
  sparkline: buildTimeSparkline(0),
};

export async function getLifeScore(): Promise<LifeScorecquerLifeScore> {
  const user = await getUserContext();
  if (!user) {
    return { score: 0, label: "Sign in to see your score", goalCount: 0 };
  }

  const cycle = await getActiveCycle(user.id);
  if (!cycle) {
    return { score: 0, label: "Create a cycle to get started", goalCount: 0 };
  }

  const goals = await prisma.goal.findMany({
    where: { cycleId: cycle.id, archivedAt: null },
    select: {
      startValue: true,
      targetValue: true,
      currentValue: true,
      direction: true,
    },
  });

  if (!goals.length) {
    return { score: 0, label: "Add goals to calculate score", goalCount: 0 };
  }

  const average =
    goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0) /
    goals.length;

  const score = Math.round(clamp(average, 0, 1) * 100);
  const label =
    score >= 70
      ? "Strong momentum"
      : score >= 40
        ? "Steady pace"
        : "Needs focus";

  return { score, label, goalCount: goals.length };
}

export async function getCycleProgress(): Promise<CycleProgress> {
  const user = await getUserContext();
  if (!user) return emptyCycle;

  const cycle = await getActiveCycle(user.id);
  if (!cycle) return emptyCycle;

  const timeProgress = getTimeProgress(cycle.startDate, cycle.endDate);
  const daysRemaining = Math.max(
    0,
    differenceInDays(cycle.endDate, new Date()),
  );
  const weeksTotal = Math.max(
    1,
    differenceInWeeks(cycle.endDate, cycle.startDate),
  );
  const weeksElapsed = clamp(
    differenceInWeeks(new Date(), cycle.startDate),
    0,
    weeksTotal,
  );

  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { cycleId: cycle.id },
    orderBy: { weekStart: "asc" },
    include: {
      updates: {
        include: {
          goal: {
            select: {
              startValue: true,
              targetValue: true,
              currentValue: true,
              direction: true,
            },
          },
        },
      },
    },
  });

  const sparkline = checkIns.length
    ? buildCheckInSparkline(checkIns).slice(-8)
    : buildTimeSparkline(timeProgress);

  return {
    cycleId: cycle.id,
    name: cycle.name,
    startDate: cycle.startDate.toISOString(),
    endDate: cycle.endDate.toISOString(),
    progress: Math.round(timeProgress * 100),
    daysRemaining,
    weeksElapsed: Math.floor(weeksElapsed),
    weeksTotal,
    sparkline,
  };
}

export async function getWeeklyStreak(): Promise<WeeklyStreak> {
  const user = await getUserContext();
  if (!user) return { streak: 0, isCurrentWeekComplete: false };

  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { userId: user.id },
    select: { weekStart: true },
    orderBy: { weekStart: "desc" },
  });

  if (!checkIns.length) return { streak: 0, isCurrentWeekComplete: false };

  const weekStarts = new Set(
    checkIns.map((checkIn) =>
      startOfWeek(checkIn.weekStart, { weekStartsOn: 1 }).toISOString(),
    ),
  );

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  let streak = 0;
  let cursor = currentWeekStart;

  while (weekStarts.has(cursor.toISOString())) {
    streak += 1;
    cursor = subWeeks(cursor, 1);
  }

  return {
    streak,
    isCurrentWeekComplete: weekStarts.has(currentWeekStart.toISOString()),
  };
}

export async function getFocusGoals(): Promise<FocusGoal[]> {
  const user = await getUserContext();
  if (!user) return [];

  const cycle = await getActiveCycle(user.id);
  if (!cycle) return [];

  const timeProgress = getTimeProgress(cycle.startDate, cycle.endDate);

  const goals = await prisma.goal.findMany({
    where: { cycleId: cycle.id, archivedAt: null },
    include: {
      category: { select: { name: true, color: true, icon: true } },
    },
  });

  return goals
    .map((goal) => {
      const progress = calculateGoalProgress(goal) * 100;
      const pace = timeProgress * 100;
      const delta = pace - progress;

      return {
        id: goal.id,
        title: goal.title,
        progress: Math.round(progress),
        pace: Math.round(pace),
        delta: Math.round(delta),
        currentValue: goal.currentValue,
        targetValue: goal.targetValue,
        unit: goal.unit,
        category: goal.category,
      };
    })
    .filter((goal) => goal.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const user = await getUserContext();
  if (!user) return [];

  const updates = await prisma.weeklyGoalUpdate.findMany({
    where: { goal: { userId: user.id } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      goal: { select: { title: true, unit: true } },
      checkIn: { select: { weekStart: true } },
    },
  });

  if (updates.length) {
    return updates.map((update) => ({
      id: update.id,
      title: update.goal.title,
      detail: `Updated to ${update.value}${update.goal.unit ? ` ${update.goal.unit}` : ""}`,
      timestamp: update.createdAt.toISOString(),
    }));
  }

  const recentGoals = await prisma.goal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, title: true, createdAt: true },
  });

  return recentGoals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    detail: "Goal created",
    timestamp: goal.createdAt.toISOString(),
  }));
}
