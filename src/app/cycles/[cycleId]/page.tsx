import Link from "next/link";
import { notFound } from "next/navigation";
import { setCycleArchived } from "@/app/cycles/actions";
import { createGoal, setGoalArchived, updateGoal } from "@/app/goals/actions";
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
import { formatShortDate } from "@/lib/dates";
import { getCycleWithGoals } from "@/lib/cycles";
import { requireUserId } from "@/lib/session";

const selectClassName =
  "border-input bg-background h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export default async function CycleDetailPage({
  params,
}: {
  params: { cycleId: string };
}) {
  const userId = await requireUserId();
  const cycle = await getCycleWithGoals(userId, params.cycleId);

  if (!cycle) {
    notFound();
  }

  const activeGoals = cycle.goals.filter((goal) => !goal.archivedAt);
  const archivedGoals = cycle.goals.filter((goal) => goal.archivedAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {cycle.name}
            </h1>
            {cycle.archivedAt ? (
              <Badge variant="outline">Archived</Badge>
            ) : (
              <Badge variant="secondary">Active</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {formatShortDate(cycle.startDate)} —{" "}
            {formatShortDate(cycle.endDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/cycles">Back to cycles</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/cycles/${cycle.id}/edit`}>Edit cycle</Link>
          </Button>
          <form action={setCycleArchived}>
            <input type="hidden" name="cycleId" value={cycle.id} />
            <input
              type="hidden"
              name="archive"
              value={cycle.archivedAt ? "false" : "true"}
            />
            <Button
              size="sm"
              variant={cycle.archivedAt ? "secondary" : "destructive"}
              type="submit"
            >
              {cycle.archivedAt ? "Unarchive" : "Archive"}
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a goal</CardTitle>
          <CardDescription>
            Define the outcomes you want to track during this cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 lg:grid-cols-2"
            action={createGoal.bind(null, cycle.id)}
          >
            <div className="grid gap-2">
              <Label htmlFor="goal-title">Title</Label>
              <Input
                id="goal-title"
                name="title"
                placeholder="Ship v1"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-unit">Unit (optional)</Label>
              <Input id="goal-unit" name="unit" placeholder="hrs, leads, lbs" />
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label htmlFor="goal-description">Description</Label>
              <Textarea
                id="goal-description"
                name="description"
                placeholder="Why does this matter?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-start">Start value</Label>
              <Input
                id="goal-start"
                name="startValue"
                type="number"
                step="any"
                defaultValue={0}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-target">Target value</Label>
              <Input
                id="goal-target"
                name="targetValue"
                type="number"
                step="any"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-direction">Direction</Label>
              <select
                id="goal-direction"
                name="direction"
                className={selectClassName}
              >
                <option value="INCREASE">Increase</option>
                <option value="DECREASE">Decrease</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit">Create goal</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active goals</h2>
          <span className="text-muted-foreground text-xs">
            {activeGoals.length} active
          </span>
        </div>
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground text-sm">
              No goals yet. Add the first outcome for this cycle.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    {goal.description && (
                      <CardDescription>{goal.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {goal.direction === "DECREASE" ? "Decrease" : "Increase"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <p className="text-xs tracking-wide uppercase">Status</p>
                      <p className="text-foreground font-medium">Active</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <form action={setGoalArchived}>
                      <input type="hidden" name="goalId" value={goal.id} />
                      <input type="hidden" name="archive" value="true" />
                      <Button size="sm" variant="destructive" type="submit">
                        Archive
                      </Button>
                    </form>
                  </div>

                  <details className="rounded-md border border-dashed p-4">
                    <summary className="text-primary cursor-pointer text-sm font-medium">
                      Edit goal
                    </summary>
                    <form
                      className="mt-4 grid gap-4 lg:grid-cols-2"
                      action={updateGoal.bind(null, goal.id)}
                    >
                      <div className="grid gap-2">
                        <Label htmlFor={`goal-title-${goal.id}`}>Title</Label>
                        <Input
                          id={`goal-title-${goal.id}`}
                          name="title"
                          defaultValue={goal.title}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`goal-unit-${goal.id}`}>Unit</Label>
                        <Input
                          id={`goal-unit-${goal.id}`}
                          name="unit"
                          defaultValue={goal.unit ?? ""}
                        />
                      </div>
                      <div className="grid gap-2 lg:col-span-2">
                        <Label htmlFor={`goal-description-${goal.id}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`goal-description-${goal.id}`}
                          name="description"
                          defaultValue={goal.description ?? ""}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`goal-start-${goal.id}`}>Start</Label>
                        <Input
                          id={`goal-start-${goal.id}`}
                          name="startValue"
                          type="number"
                          step="any"
                          defaultValue={goal.startValue}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`goal-target-${goal.id}`}>Target</Label>
                        <Input
                          id={`goal-target-${goal.id}`}
                          name="targetValue"
                          type="number"
                          step="any"
                          defaultValue={goal.targetValue}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`goal-direction-${goal.id}`}>
                          Direction
                        </Label>
                        <select
                          id={`goal-direction-${goal.id}`}
                          name="direction"
                          className={selectClassName}
                          defaultValue={goal.direction}
                        >
                          <option value="INCREASE">Increase</option>
                          <option value="DECREASE">Decrease</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button type="submit">Save changes</Button>
                      </div>
                    </form>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {archivedGoals.length > 0 && (
        <section className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Archived goals</h2>
            <span className="text-muted-foreground text-xs">
              {archivedGoals.length} archived
            </span>
          </div>
          <div className="grid gap-4">
            {archivedGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    {goal.description && (
                      <CardDescription>{goal.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant="outline">Archived</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <p className="text-xs tracking-wide uppercase">Status</p>
                      <p className="text-foreground font-medium">Archived</p>
                    </div>
                  </div>
                  <form action={setGoalArchived}>
                    <input type="hidden" name="goalId" value={goal.id} />
                    <input type="hidden" name="archive" value="false" />
                    <Button size="sm" variant="secondary" type="submit">
                      Restore
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
