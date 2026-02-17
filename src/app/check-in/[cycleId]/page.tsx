import Link from "next/link";
import { notFound } from "next/navigation";
import { upsertWeeklyCheckIn } from "@/app/check-in/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  differenceInDays,
  formatDateInput,
  formatShortDate,
  parseDateInput,
  startOfWeek,
} from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

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

function getProgressPercent(
  goal: { startValue: number; targetValue: number; direction: string },
  value: number,
) {
  const delta =
    goal.direction === "DECREASE"
      ? goal.startValue - goal.targetValue
      : goal.targetValue - goal.startValue;

  if (delta === 0) {
    return value === goal.targetValue ? 1 : 0;
  }

  const progress =
    goal.direction === "DECREASE"
      ? (goal.startValue - value) / delta
      : (value - goal.startValue) / delta;

  return clamp(progress);
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
  const weekStartInput = formatDateInput(weekStart);

  const cycle = await prisma.cycle.findFirst({
    where: { id: params.cycleId, userId },
    include: {
      goals: {
        where: { archivedAt: null },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cycle) {
    notFound();
  }

  const checkIn = await prisma.weeklyCheckIn.findFirst({
    where: { cycleId: cycle.id, userId, weekStart },
    include: { updates: true },
  });

  const updatesByGoal = new Map(
    checkIn?.updates.map((update) => [update.goalId, update]) ?? [],
  );
  const totalWeeks = getTotalWeeks(cycle.startDate, cycle.endDate);
  const weeksElapsed = getWeeksElapsed(cycle.startDate, weekStart, totalWeeks);
  const expectedPercent = totalWeeks === 0 ? 1 : weeksElapsed / totalWeeks;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Weekly check-in
          </h1>
          <p className="text-muted-foreground text-sm">
            {cycle.name} · {formatShortDate(cycle.startDate)} —{" "}
            {formatShortDate(cycle.endDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/check-in">Back to cycles</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/cycles/${cycle.id}`}>View cycle</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select week</CardTitle>
          <CardDescription>
            Weeks start on Monday. Load another week to review or edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            method="get"
            className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          >
            <div className="grid gap-2">
              <Label htmlFor="weekStartFilter">Week starting</Label>
              <Input
                id="weekStartFilter"
                name="weekStart"
                type="date"
                defaultValue={weekStartInput}
              />
            </div>
            <Button type="submit" variant="secondary">
              Load week
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Check-in details</CardTitle>
          <CardDescription>
            Week of {formatShortDate(weekStart)} · {weeksElapsed || 0} of{" "}
            {totalWeeks} weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" action={upsertWeeklyCheckIn}>
            <input type="hidden" name="cycleId" value={cycle.id} />
            <div className="grid gap-2">
              <Label htmlFor="weekStart">Week starting</Label>
              <Input
                id="weekStart"
                name="weekStart"
                type="date"
                defaultValue={weekStartInput}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weekNotes">Weekly notes</Label>
              <Textarea
                id="weekNotes"
                name="notes"
                placeholder="Wins, blockers, focus for next week..."
                defaultValue={checkIn?.notes ?? ""}
              />
            </div>

            <Separator />

            {cycle.goals.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground text-sm">
                  No active goals in this cycle yet. Add goals to track weekly
                  progress.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {cycle.goals.map((goal) => {
                  const existingUpdate = updatesByGoal.get(goal.id);
                  const updateValue =
                    existingUpdate?.value ?? goal.startValue ?? 0;
                  const progressRatio = getProgressPercent(goal, updateValue);
                  const progressPercent = Math.round(progressRatio * 100);
                  const expectedPercentRounded = Math.round(
                    expectedPercent * 100,
                  );
                  const onTrack = progressRatio >= expectedPercent;

                  return (
                    <Card key={goal.id}>
                      <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-base">
                            {goal.title}
                          </CardTitle>
                          {goal.description && (
                            <CardDescription>
                              {goal.description}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {goal.direction === "DECREASE"
                            ? "Decrease"
                            : "Increase"}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-3">
                          <div>
                            <p className="text-xs tracking-wide uppercase">
                              Start
                            </p>
                            <p className="text-foreground font-medium">
                              {goal.startValue} {goal.unit ?? ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs tracking-wide uppercase">
                              Target
                            </p>
                            <p className="text-foreground font-medium">
                              {goal.targetValue} {goal.unit ?? ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs tracking-wide uppercase">
                              Pace
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-foreground font-medium">
                                {progressPercent}% · {expectedPercentRounded}%
                                expected
                              </p>
                              <Badge
                                variant={onTrack ? "secondary" : "outline"}
                              >
                                {onTrack ? "On track" : "Behind"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <input type="hidden" name="goalId" value={goal.id} />
                        <div className="grid gap-2">
                          <Label htmlFor={`goal-value-${goal.id}`}>
                            Update value
                          </Label>
                          <Input
                            id={`goal-value-${goal.id}`}
                            name={`value-${goal.id}`}
                            type="number"
                            step="any"
                            defaultValue={updateValue}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`goal-notes-${goal.id}`}>
                            Notes (optional)
                          </Label>
                          <Textarea
                            id={`goal-notes-${goal.id}`}
                            name={`notes-${goal.id}`}
                            placeholder="Context or blockers"
                            defaultValue={existingUpdate?.notes ?? ""}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit">
                {checkIn ? "Update check-in" : "Save check-in"}
              </Button>
              {checkIn && (
                <p className="text-muted-foreground text-xs">
                  Last updated {formatShortDate(checkIn.updatedAt)}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
