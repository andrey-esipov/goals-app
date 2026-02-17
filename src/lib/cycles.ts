import { prisma } from "@/lib/prisma";

export async function getCyclesForUser(userId: string) {
  return prisma.cycle.findMany({
    where: { userId },
    orderBy: [{ archivedAt: "asc" }, { startDate: "desc" }],
    include: {
      _count: { select: { goals: true } },
    },
  });
}

export async function getCycleById(userId: string, cycleId: string) {
  return prisma.cycle.findFirst({
    where: { id: cycleId, userId },
  });
}

export async function getCycleWithGoals(userId: string, cycleId: string) {
  return prisma.cycle.findFirst({
    where: { id: cycleId, userId },
    include: {
      goals: {
        orderBy: [{ archivedAt: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}
