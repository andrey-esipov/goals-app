import Link from "next/link";
import { createCycle, setCycleArchived } from "@/app/cycles/actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatShortDate } from "@/lib/dates";
import { getCyclesForUser } from "@/lib/cycles";
import { requireUserId } from "@/lib/session";

export default async function CyclesPage() {
  const userId = await requireUserId();
  const cycles = await getCyclesForUser(userId);
  const activeCycles = cycles.filter((cycle) => !cycle.archivedAt);
  const archivedCycles = cycles.filter((cycle) => cycle.archivedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cycles</h1>
        <p className="text-muted-foreground text-sm">
          Create focus windows and track goals inside each cycle.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active cycles</h2>
              <span className="text-muted-foreground text-xs">
                {activeCycles.length} active
              </span>
            </div>
            {activeCycles.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground text-sm">
                  No active cycles yet. Create one to start planning goals.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeCycles.map((cycle) => (
                  <Card key={cycle.id}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">
                          {cycle.name}
                        </CardTitle>
                        <CardDescription>
                          {formatShortDate(cycle.startDate)} —{" "}
                          {formatShortDate(cycle.endDate)}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-muted-foreground text-sm">
                        {cycle._count.goals} goals
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/cycles/${cycle.id}`}>View</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/cycles/${cycle.id}/edit`}>Edit</Link>
                        </Button>
                        <form action={setCycleArchived}>
                          <input
                            type="hidden"
                            name="cycleId"
                            value={cycle.id}
                          />
                          <input type="hidden" name="archive" value="true" />
                          <Button size="sm" variant="destructive" type="submit">
                            Archive
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {archivedCycles.length > 0 && (
            <section className="space-y-3">
              <Separator />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Archived cycles</h2>
                <span className="text-muted-foreground text-xs">
                  {archivedCycles.length} archived
                </span>
              </div>
              <div className="grid gap-4">
                {archivedCycles.map((cycle) => (
                  <Card key={cycle.id}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">
                          {cycle.name}
                        </CardTitle>
                        <CardDescription>
                          {formatShortDate(cycle.startDate)} —{" "}
                          {formatShortDate(cycle.endDate)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Archived</Badge>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-muted-foreground text-sm">
                        {cycle._count.goals} goals
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/cycles/${cycle.id}`}>View</Link>
                        </Button>
                        <form action={setCycleArchived}>
                          <input
                            type="hidden"
                            name="cycleId"
                            value={cycle.id}
                          />
                          <input type="hidden" name="archive" value="false" />
                          <Button size="sm" variant="secondary" type="submit">
                            Unarchive
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Create a cycle</CardTitle>
            <CardDescription>
              Name the cycle and choose the start + end dates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" action={createCycle}>
              <div className="grid gap-2">
                <Label htmlFor="cycle-name">Cycle name</Label>
                <Input
                  id="cycle-name"
                  name="name"
                  placeholder="Spring 12 Week"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cycle-start">Start date</Label>
                <Input id="cycle-start" name="startDate" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cycle-end">End date</Label>
                <Input id="cycle-end" name="endDate" type="date" required />
              </div>
              <Button type="submit">Create cycle</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
