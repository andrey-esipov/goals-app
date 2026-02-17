"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

type FocusGoal = {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string | null;
  progress: number;
  expectedProgress: number;
  gap: number;
  cycle: { name: string };
  cycleId: string;
};

export function FocusGoals({ goals }: { goals: FocusGoal[] }) {
  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Focus areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            All goals are on track!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Needs attention
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
          >
            <Link href={`/cycles/${goal.cycleId}`} className="block">
              <div className="hover:bg-muted/50 -mx-2 space-y-1 rounded-lg p-2 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{goal.title}</span>
                  <Badge variant="destructive" className="shrink-0 text-xs">
                    {goal.gap > 0.2 ? "Behind" : "At risk"}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>{goal.cycle.name}</span>
                  <span>·</span>
                  <span>
                    {goal.progress}% done · {goal.expectedProgress}% expected
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span>
                    {goal.currentValue}
                    {goal.unit ? ` ${goal.unit}` : ""} / {goal.targetValue}
                    {goal.unit ? ` ${goal.unit}` : ""}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
