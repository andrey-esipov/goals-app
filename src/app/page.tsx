import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Command Center</CardTitle>
          <CardDescription>
            Weekly check-ins, pace, and at-risk goals will live here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            v0 scaffold — sign in to get started.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frameworks</CardTitle>
          <CardDescription>
            OKRs, 12 Week Year, Monarch-style lead/lag measures, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Templates and goal types are coming in PR2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
