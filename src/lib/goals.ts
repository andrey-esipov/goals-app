import { prisma } from "@/lib/prisma";

export async function getActiveGoalsForUser(userId: string) {
  return prisma.goal.findMany({
    where: { userId, archivedAt: null },
    include: { cycle: true },
    orderBy: [{ createdAt: "asc" }],
  });
}
