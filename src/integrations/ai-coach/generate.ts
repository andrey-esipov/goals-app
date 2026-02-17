import { prisma } from "@/lib/prisma";
import { startOfWeek } from "date-fns";

const AZURE_OPENAI_URL =
  "https://molt-bot-resource.cognitiveservices.azure.com/openai/deployments/gpt-5.2/chat/completions?api-version=2024-10-21";
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_API_KEY ?? "";

type GoalSnapshot = {
  title: string;
  category: string | null;
  progress: number;
  expectedProgress: number;
  gap: number;
  unit: string | null;
  currentValue: number;
  targetValue: number;
};

export async function generateWeeklyInsight(
  userId: string,
): Promise<string | null> {
  if (!AZURE_OPENAI_KEY) return null;

  const goals = await prisma.goal.findMany({
    where: { userId, archivedAt: null },
    include: {
      cycle: { select: { name: true, startDate: true, endDate: true } },
      category: { select: { name: true } },
    },
  });

  if (goals.length === 0) return null;

  const now = new Date();
  const snapshots: GoalSnapshot[] = goals.map((g) => {
    const range = g.targetValue - g.startValue;
    const progress =
      range === 0
        ? 1
        : Math.max(0, Math.min(1, (g.currentValue - g.startValue) / range));
    const cycleMs = g.cycle.endDate.getTime() - g.cycle.startDate.getTime();
    const elapsedMs = now.getTime() - g.cycle.startDate.getTime();
    const expected =
      cycleMs === 0 ? 1 : Math.max(0, Math.min(1, elapsedMs / cycleMs));
    return {
      title: g.title,
      category: g.category?.name ?? null,
      progress: Math.round(progress * 100),
      expectedProgress: Math.round(expected * 100),
      gap: Math.round((expected - progress) * 100),
      unit: g.unit,
      currentValue: g.currentValue,
      targetValue: g.targetValue,
    };
  });

  // Check recent check-ins for streak/consistency data
  const recentCheckIns = await prisma.weeklyCheckIn.findMany({
    where: { userId },
    orderBy: { weekStart: "desc" },
    take: 4,
    select: { weekStart: true },
  });

  const prompt = `You are a concise, supportive goals coach. Analyze this person's goal progress and give a weekly insight.

Goals:
${snapshots.map((g) => `- ${g.title}${g.category ? ` [${g.category}]` : ""}: ${g.progress}% done (${g.expectedProgress}% expected)${g.gap > 0 ? ` — ${g.gap}% behind` : " — on track"} | ${g.currentValue}/${g.targetValue}${g.unit ? ` ${g.unit}` : ""}`).join("\n")}

Recent check-ins: ${recentCheckIns.length} in last 4 weeks.

Rules:
- Max 120 words
- Start with a one-line summary of overall status
- Call out 1-2 specific patterns (e.g. "Health goals slipping 3 weeks in a row")
- End with 2 concrete action items for the coming week
- Be direct and honest. No fluff. No "Great job!" unless it's genuinely warranted.
- Use the person's goal titles, not generic language`;

  try {
    const res = await fetch(AZURE_OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_KEY,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a concise goals coach." },
          { role: "user", content: prompt },
        ],
        max_completion_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export async function getOrGenerateInsight(userId: string) {
  // Check for recent insight (within last 24h)
  const recent = await prisma.insight.findFirst({
    where: {
      userId,
      type: "weekly_summary",
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recent) return recent;

  // Generate new one
  const content = await generateWeeklyInsight(userId);
  if (!content) return null;

  return prisma.insight.create({
    data: {
      userId,
      type: "weekly_summary",
      content,
    },
  });
}
