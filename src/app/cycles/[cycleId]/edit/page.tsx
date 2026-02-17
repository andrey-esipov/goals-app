import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCycle } from "@/app/cycles/actions";
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
import { formatDateInput, formatShortDate } from "@/lib/dates";
import { getCycleById } from "@/lib/cycles";
import { requireUserId } from "@/lib/session";

export default async function EditCyclePage({
  params,
}: {
  params: { cycleId: string };
}) {
  const userId = await requireUserId();
  const cycle = await getCycleById(userId, params.cycleId);

  if (!cycle) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit cycle</h1>
        <p className="text-muted-foreground text-sm">
          {cycle.name} · {formatShortDate(cycle.startDate)} —{" "}
          {formatShortDate(cycle.endDate)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cycle details</CardTitle>
          <CardDescription>Adjust the cycle name or dates.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid max-w-xl gap-4"
            action={updateCycle.bind(null, cycle.id)}
          >
            <div className="grid gap-2">
              <Label htmlFor="cycle-name">Cycle name</Label>
              <Input
                id="cycle-name"
                name="name"
                defaultValue={cycle.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cycle-start">Start date</Label>
              <Input
                id="cycle-start"
                name="startDate"
                type="date"
                defaultValue={formatDateInput(cycle.startDate)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cycle-end">End date</Label>
              <Input
                id="cycle-end"
                name="endDate"
                type="date"
                defaultValue={formatDateInput(cycle.endDate)}
                required
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit">Save cycle</Button>
              <Button asChild variant="ghost">
                <Link href={`/cycles/${cycle.id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
