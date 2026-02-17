import { prisma } from "@/lib/prisma";

export const DEFAULT_CATEGORIES = [
  { name: "Health", color: "#22c55e", icon: "heart-pulse", sortOrder: 0 },
  { name: "Career", color: "#3b82f6", icon: "briefcase", sortOrder: 1 },
  { name: "Finance", color: "#f59e0b", icon: "wallet", sortOrder: 2 },
  { name: "Personal", color: "#8b5cf6", icon: "user", sortOrder: 3 },
  { name: "Relationships", color: "#ec4899", icon: "users", sortOrder: 4 },
  { name: "Learning", color: "#06b6d4", icon: "book-open", sortOrder: 5 },
] as const;

export async function getCategoriesForUser(userId: string) {
  const existing = await prisma.category.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });

  if (existing.length > 0) return existing;

  // Seed default categories on first access
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId })),
  });

  return prisma.category.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryMap(userId: string) {
  const categories = await getCategoriesForUser(userId);
  return Object.fromEntries(categories.map((c) => [c.id, c]));
}
