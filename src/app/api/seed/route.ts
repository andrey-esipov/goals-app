import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: "andrey_yesipov@hotmail.com" },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create default categories
    const categoryData = [
      { name: "Health", color: "#22c55e", icon: "heart-pulse", sortOrder: 0 },
      { name: "Career", color: "#3b82f6", icon: "briefcase", sortOrder: 1 },
      { name: "Finance", color: "#f59e0b", icon: "wallet", sortOrder: 2 },
      { name: "Personal", color: "#8b5cf6", icon: "user", sortOrder: 3 },
      {
        name: "Relationships",
        color: "#ec4899",
        icon: "users",
        sortOrder: 4,
      },
      { name: "Learning", color: "#06b6d4", icon: "book-open", sortOrder: 5 },
    ];

    const categories: Record<string, { id: string }> = {};
    for (const cat of categoryData) {
      const existing = await prisma.category.findFirst({
        where: { userId: user.id, name: cat.name },
      });
      if (existing) {
        categories[cat.name] = existing;
      } else {
        categories[cat.name] = await prisma.category.create({
          data: { ...cat, userId: user.id },
        });
      }
    }

    // Q1 2026 Cycle (Jan 6 - Mar 31)
    let cycle = await prisma.cycle.findFirst({
      where: { userId: user.id, name: "Q1 2026 — 12 Week Year" },
    });
    if (!cycle) {
      cycle = await prisma.cycle.create({
        data: {
          userId: user.id,
          name: "Q1 2026 — 12 Week Year",
          startDate: new Date("2026-01-06"),
          endDate: new Date("2026-03-31"),
        },
      });
    }

    const goals = [
      {
        title: "Trading Operating System v0",
        description:
          "1-page doc: daily loop (scan→plan→execute→log), weekly loop (portfolio review + risk review), where logs live, what done looks like",
        unit: "pages",
        startValue: 0,
        targetValue: 1,
        direction: "INCREASE" as const,
        category: "Finance",
      },
      {
        title: "Risk Constitution v0",
        description:
          "1-page doc: risk limits (exposure caps, DD max, per-strategy limits), stop conditions, deviation policy",
        unit: "pages",
        startValue: 0,
        targetValue: 1,
        direction: "INCREASE" as const,
        category: "Finance",
      },
      {
        title: "Weekly portfolio reviews",
        description:
          "30 min: positions, exposure, P/L drivers, upcoming events",
        unit: "reviews",
        startValue: 0,
        targetValue: 12,
        direction: "INCREASE" as const,
        category: "Finance",
      },
      {
        title: "Weekly risk reviews",
        description:
          "20 min: check limits, note drift, log deviations within 24h",
        unit: "reviews",
        startValue: 0,
        targetValue: 12,
        direction: "INCREASE" as const,
        category: "Finance",
      },
      {
        title: "Covered call threat checks",
        description:
          "2x/week: price vs strike, DTE, delta. Roll when within 3% of strike",
        unit: "checks",
        startValue: 0,
        targetValue: 24,
        direction: "INCREASE" as const,
        category: "Finance",
      },
      {
        title: "Covered call decision log",
        description:
          "Weekly log: profit-take status, roll rationale, threat template",
        unit: "entries",
        startValue: 0,
        targetValue: 12,
        direction: "INCREASE" as const,
        category: "Finance",
      },
      {
        title: "Launch Substack",
        description:
          "Substack name + positioning, shell + About page, first outline",
        unit: "milestones",
        startValue: 0,
        targetValue: 3,
        direction: "INCREASE" as const,
        category: "Career",
      },
      {
        title: "GitHub trading mirror repo",
        description: "Create repo, structure, link to personal site with CTA",
        unit: "milestones",
        startValue: 0,
        targetValue: 1,
        direction: "INCREASE" as const,
        category: "Career",
      },
      {
        title: "AI PM portfolio artifacts",
        description:
          "Pick 1 artifact per week, lock Definition of Done, reach demo-able state. 2x build blocks (45-90 min)",
        unit: "artifacts",
        startValue: 0,
        targetValue: 6,
        direction: "INCREASE" as const,
        category: "Career",
      },
      {
        title: "Protected family blocks",
        description:
          "4 family blocks + 1 admin block per week, scheduled and honored",
        unit: "weeks",
        startValue: 0,
        targetValue: 12,
        direction: "INCREASE" as const,
        category: "Relationships",
      },
      {
        title: "HYROX training sessions",
        description:
          "4 sessions + 1 HYROX circuit per week: 2 runs, 1 strength/sled, 1 mixed engine, 1 circuit",
        unit: "sessions",
        startValue: 0,
        targetValue: 60,
        direction: "INCREASE" as const,
        category: "Health",
      },
      {
        title: "Weekly HYROX circuits",
        description:
          "1 full HYROX-style circuit per week for September race prep",
        unit: "circuits",
        startValue: 0,
        targetValue: 12,
        direction: "INCREASE" as const,
        category: "Health",
      },
    ];

    let created = 0;
    for (const goal of goals) {
      const existing = await prisma.goal.findFirst({
        where: { userId: user.id, cycleId: cycle.id, title: goal.title },
      });
      if (!existing) {
        await prisma.goal.create({
          data: {
            userId: user.id,
            cycleId: cycle.id,
            categoryId: categories[goal.category]?.id ?? null,
            title: goal.title,
            description: goal.description,
            unit: goal.unit,
            startValue: goal.startValue,
            targetValue: goal.targetValue,
            currentValue: goal.startValue,
            direction: goal.direction,
          },
        });
        created++;
      }
    }

    return NextResponse.json({
      ok: true,
      userId: user.id,
      cycleId: cycle.id,
      cycleName: cycle.name,
      goalsCreated: created,
      goalsTotal: goals.length,
      categories: Object.keys(categories),
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
