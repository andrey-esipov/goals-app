import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActiveGoalsForUser } from "@/lib/goals";
import { requireUserId } from "@/lib/session";
import { formatShortDate } from "@/lib/dates";

export default async function GoalsPage() {
  const userId = await requireUserId();
  const goals = await getActiveGoalsForUser(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Goals</h1>
        <p className="text-muted-foreground text-sm">
          Active goals across all cycles.
        </p>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground text-sm">
            No active goals yet. Create one inside a cycle to see it here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{goal.title}</CardTitle>
                  <CardDescription>
                    {goal.cycle.name} · {formatShortDate(goal.cycle.startDate)}{" "}
                    — {formatShortDate(goal.cycle.endDate)}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {goal.direction === "DECREASE" ? "Decrease" : "Increase"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {goal.description && (
                  <p className="text-muted-foreground text-sm">
                    {goal.description}
                  </p>
                )}
                <div className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs tracking-wide uppercase">Start</p>
                    <p className="text-foreground font-medium">
                      {goal.startValue} {goal.unit ?? ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide uppercase">Target</p>
                    <p className="text-foreground font-medium">
                      {goal.targetValue} {goal.unit ?? ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide uppercase">Cycle</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/cycles/${goal.cycleId}`}>Open cycle</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
