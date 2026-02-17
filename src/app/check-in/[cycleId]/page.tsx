import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import {
  differenceInDays,
  formatDateInput,
  formatShortDate,
  parseDateInput,
  startOfWeek,
} from "@/lib/dates";
import { CheckInWizard } from "@/components/check-in/wizard";

const DAYS_PER_WEEK = 7;

function getTotalWeeks(startDate: Date, endDate: Date) {
  const days = differenceInDays(startDate, endDate) + 1;
  return Math.max(1, Math.ceil(days / DAYS_PER_WEEK));
}

function getWeeksElapsed(startDate: Date, weekStart: Date, totalWeeks: number) {
  const diffDays = differenceInDays(startDate, weekStart);
  const weeksElapsed = Math.floor(diffDays / DAYS_PER_WEEK) + 1;
  return Math.min(totalWeeks, Math.max(0, weeksElapsed));
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default async function CheckInPage({
  params,
  searchParams,
}: {
  params: { cycleId: string };
  searchParams: { weekStart?: string };
}) {
  const userId = await requireUserId();
  const requestedWeek = parseDateInput(searchParams.weekStart ?? null);
  const defaultWeekStart = startOfWeek(new Date());
  const weekStart = startOfWeek(requestedWeek ?? defaultWeekStart);

  const cycle = await prisma.cycle.findFirst({
    where: { id: params.cycleId, userId },
    include: {
      goals: {
        where: { archivedAt: null },
        orderBy: { createdAt: "asc" },
        include: { category: true },
      },
    },
  });

  if (!cycle) notFound();

  const checkIn = await prisma.weeklyCheckIn.findFirst({
    where: { cycleId: cycle.id, userId, weekStart },
    include: { updates: true },
  });

  const totalWeeks = getTotalWeeks(cycle.startDate, cycle.endDate);
  const weeksElapsed = getWeeksElapsed(cycle.startDate, weekStart, totalWeeks);
  const expectedPercent = totalWeeks === 0 ? 1 : weeksElapsed / totalWeeks;

  const goals = cycle.goals.map((goal) => {
    const existingUpdate = checkIn?.updates.find((u) => u.goalId === goal.id);
    const currentValue =
      existingUpdate?.value ?? goal.currentValue ?? goal.startValue;
    const range =
      goal.direction === "DECREASE"
        ? goal.startValue - goal.targetValue
        : goal.targetValue - goal.startValue;
    const progress =
      range === 0
        ? 1
        : goal.direction === "DECREASE"
          ? (goal.startValue - currentValue) / range
          : (currentValue - goal.startValue) / range;

    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      unit: goal.unit,
      startValue: goal.startValue,
      targetValue: goal.targetValue,
      currentValue,
      direction: goal.direction,
      progress: Math.round(clamp(progress) * 100),
      notes: existingUpdate?.notes ?? "",
      category: goal.category
        ? {
            name: goal.category.name,
            color: goal.category.color,
            icon: goal.category.icon,
          }
        : null,
    };
  });

  return (
    <CheckInWizard
      cycleId={cycle.id}
      cycleName={cycle.name}
      cycleStart={cycle.startDate.toISOString()}
      cycleEnd={cycle.endDate.toISOString()}
      weekStart={formatDateInput(weekStart)}
      weekLabel={formatShortDate(weekStart)}
      weeksElapsed={weeksElapsed}
      totalWeeks={totalWeeks}
      expectedPercent={Math.round(expectedPercent * 100)}
      goals={goals}
      existingNotes={checkIn?.notes ?? ""}
      isUpdate={!!checkIn}
    />
  );
}
