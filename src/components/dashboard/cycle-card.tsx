"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type CycleData = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goalCount: number;
  progress: number;
  weeklyProgress: number[];
};

function getProgressColor(progress: number) {
  if (progress >= 70) return "bg-green-500";
  if (progress >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export function CycleCard({
  cycle,
  index,
}: {
  cycle: CycleData;
  index: number;
}) {
  const chartData = cycle.weeklyProgress.map((v, i) => ({
    week: i + 1,
    progress: v,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/cycles/${cycle.id}`}>
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-medium">
                {cycle.name}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {cycle.goalCount} goals
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {format(cycle.startDate, "MMM d")} —{" "}
              {format(cycle.endDate, "MMM d, yyyy")}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{cycle.progress}%</span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <motion.div
                  className={`h-full rounded-full ${getProgressColor(cycle.progress)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${cycle.progress}%` }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: index * 0.1 + 0.3,
                  }}
                />
              </div>
            </div>

            {/* Sparkline */}
            {chartData.length > 1 && (
              <div className="h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke={
                        cycle.progress >= 70
                          ? "#22c55e"
                          : cycle.progress >= 40
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
