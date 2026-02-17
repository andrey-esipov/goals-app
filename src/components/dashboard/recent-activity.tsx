"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Activity = {
  id: string;
  cycleName: string;
  weekStart: Date;
  updatedAt: Date;
  goalUpdates: number;
  goals: string[];
};

export function RecentActivity({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No check-ins yet. Start by creating a cycle and logging your first
            week.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((a, i) => (
          <motion.div
            key={a.id}
            className="flex items-start gap-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 + 0.3 }}
          >
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <div className="min-w-0">
              <p className="truncate text-sm">
                <span className="font-medium">{a.cycleName}</span>
                {" — "}
                {a.goalUpdates} goal{a.goalUpdates !== 1 ? "s" : ""} updated
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDistanceToNow(a.updatedAt, { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
