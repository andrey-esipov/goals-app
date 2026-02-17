import { prisma } from "@/lib/prisma";
import { startOfWeek } from "date-fns";

export async function getLifeScore(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId, archivedAt: null },
    select: {
      startValue: true,
      targetValue: true,
      currentValue: true,
      direction: true,
    },
  });

  if (goals.length === 0) return 0;

  const progressValues = goals.map((g) => {
    const range = g.targetValue - g.startValue;
    if (range === 0) return 1;
    const raw = (g.currentValue - g.startValue) / range;
    return Math.max(0, Math.min(1, raw));
  });

  const avg = progressValues.reduce((a, b) => a + b, 0) / progressValues.length;
  return Math.round(avg * 100);
}

export async function getCycleProgress(userId: string) {
  const cycles = await prisma.cycle.findMany({
    where: { userId, archivedAt: null },
    include: {
      goals: {
        where: { archivedAt: null },
        select: { startValue: true, targetValue: true, currentValue: true },
      },
      checkIns: {
        orderBy: { weekStart: "asc" },
        select: {
          weekStart: true,
          updates: {
            select: {
              value: true,
              goal: { select: { startValue: true, targetValue: true } },
            },
          },
        },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return cycles.map((cycle) => {
    const goalCount = cycle.goals.length;
    const progress =
      goalCount === 0
        ? 0
        : cycle.goals.reduce((sum, g) => {
            const range = g.targetValue - g.startValue;
            if (range === 0) return sum + 1;
            return (
              sum +
              Math.max(0, Math.min(1, (g.currentValue - g.startValue) / range))
            );
          }, 0) / goalCount;

    const weeklyProgress = cycle.checkIns.map((ci) => {
      if (ci.updates.length === 0) return 0;
      const avg =
        ci.updates.reduce((sum, u) => {
          const range = u.goal.targetValue - u.goal.startValue;
          if (range === 0) return sum + 1;
          return (
            sum +
            Math.max(0, Math.min(1, (u.value - u.goal.startValue) / range))
          );
        }, 0) / ci.updates.length;
      return Math.round(avg * 100);
    });

    return {
      id: cycle.id,
      name: cycle.name,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      goalCount,
      progress: Math.round(progress * 100),
      weeklyProgress,
    };
  });
}

export async function getWeeklyStreak(userId: string) {
  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { userId },
    select: { weekStart: true },
    orderBy: { weekStart: "desc" },
    take: 52,
  });

  if (checkIns.length === 0) return 0;

  let streak = 0;
  let currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  for (const ci of checkIns) {
    const ciWeek = startOfWeek(ci.weekStart, { weekStartsOn: 1 });
    if (ciWeek.getTime() === currentWeek.getTime()) {
      streak++;
      currentWeek = new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (ciWeek.getTime() < currentWeek.getTime()) {
      break;
    }
  }

  return streak;
}

export async function getFocusGoals(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId, archivedAt: null },
    include: {
      cycle: { select: { name: true, startDate: true, endDate: true } },
    },
  });

  const now = new Date();

  const scored = goals
    .map((g) => {
      const range = g.targetValue - g.startValue;
      const progress =
        range === 0 ? 1 : (g.currentValue - g.startValue) / range;
      const cycleMs = g.cycle.endDate.getTime() - g.cycle.startDate.getTime();
      const elapsedMs = now.getTime() - g.cycle.startDate.getTime();
      const expectedProgress =
        cycleMs === 0 ? 1 : Math.max(0, Math.min(1, elapsedMs / cycleMs));
      const gap = expectedProgress - Math.max(0, Math.min(1, progress));
      return {
        ...g,
        progress: Math.round(Math.max(0, Math.min(1, progress)) * 100),
        expectedProgress: Math.round(expectedProgress * 100),
        gap,
      };
    })
    .filter((g) => g.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  return scored;
}

export async function getRecentActivity(userId: string) {
  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { userId },
    include: {
      cycle: { select: { name: true } },
      updates: { include: { goal: { select: { title: true } } } },
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return checkIns.map((ci) => ({
    id: ci.id,
    cycleName: ci.cycle.name,
    weekStart: ci.weekStart,
    updatedAt: ci.updatedAt,
    goalUpdates: ci.updates.length,
    goals: ci.updates.map((u) => u.goal.title),
  }));
}
