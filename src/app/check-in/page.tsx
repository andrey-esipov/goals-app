import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatShortDate } from "@/lib/dates";
import { getCyclesForUser } from "@/lib/cycles";
import { requireUserId } from "@/lib/session";

export default async function CheckInIndexPage() {
  const userId = await requireUserId();
  const cycles = await getCyclesForUser(userId);
  const activeCycles = cycles.filter((cycle) => !cycle.archivedAt);
  const archivedCycles = cycles.filter((cycle) => cycle.archivedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Weekly check-in
        </h1>
        <p className="text-muted-foreground text-sm">
          Pick a cycle to log progress for the current week.
        </p>
      </div>

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
              No active cycles yet. Create a cycle to start weekly check-ins.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeCycles.map((cycle) => (
              <Card key={cycle.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{cycle.name}</CardTitle>
                    <CardDescription>
                      {formatShortDate(cycle.startDate)} —{" "}
                      {formatShortDate(cycle.endDate)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-muted-foreground text-sm">
                    {cycle._count.goals} goals
                  </p>
                  <Button asChild size="sm">
                    <Link href={`/check-in/${cycle.id}`}>Open check-in</Link>
                  </Button>
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
                <CardHeader>
                  <CardTitle className="text-base">{cycle.name}</CardTitle>
                  <CardDescription>
                    {formatShortDate(cycle.startDate)} —{" "}
                    {formatShortDate(cycle.endDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-muted-foreground text-sm">
                    {cycle._count.goals} goals
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/check-in/${cycle.id}`}>Review week</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
