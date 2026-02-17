import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function startOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

async function main() {
  const email = process.env.SEED_USER_EMAIL;
  if (!email) {
    console.log("SEED_USER_EMAIL not set. Skipping seed data.");
    return;
  }

  const name = process.env.SEED_USER_NAME ?? "Goals Demo";

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  const cycleName = "Q1 Focus Sprint";
  const cycleStart = startOfWeek(new Date());
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setDate(cycleEnd.getDate() + 7 * 12);

  let cycle = await prisma.cycle.findFirst({
    where: { userId: user.id, name: cycleName },
  });

  if (!cycle) {
    cycle = await prisma.cycle.create({
      data: {
        userId: user.id,
        name: cycleName,
        startDate: cycleStart,
        endDate: cycleEnd,
      },
    });
  }

  const goals = [
    {
      title: "Ship weekly customer interviews",
      description: "Complete 12 interviews over the cycle",
      unit: "interviews",
      startValue: 0,
      targetValue: 12,
    },
    {
      title: "Publish product updates",
      description: "Share weekly updates with stakeholders",
      unit: "updates",
      startValue: 0,
      targetValue: 12,
    },
    {
      title: "Close expansion revenue",
      description: "Drive $30k expansion this cycle",
      unit: "USD",
      startValue: 0,
      targetValue: 30000,
    },
  ];

  for (const goal of goals) {
    const existing = await prisma.goal.findFirst({
      where: { cycleId: cycle.id, title: goal.title },
    });
    if (!existing) {
      await prisma.goal.create({
        data: {
          userId: user.id,
          cycleId: cycle.id,
          title: goal.title,
          description: goal.description,
          unit: goal.unit,
          startValue: goal.startValue,
          currentValue: goal.startValue,
          targetValue: goal.targetValue,
        },
      });
    }
  }

  console.log("Seed complete for", email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
