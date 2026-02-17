"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { parseDateInput, startOfWeek } from "@/lib/dates";

function parseNumber(value: FormDataEntryValue | null, label: string) {
  if (value === null || value === "") {
    throw new Error(`${label} is required.`);
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    throw new Error(`Invalid ${label.toLowerCase()}.`);
  }

  return numberValue;
}

export async function upsertWeeklyCheckIn(formData: FormData) {
  const userId = await requireUserId();
  const cycleId = String(formData.get("cycleId") ?? "");
  const weekStartRaw = String(formData.get("weekStart") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!cycleId) {
    throw new Error("Missing cycle id.");
  }

  const parsedDate = parseDateInput(weekStartRaw);

  if (!parsedDate) {
    throw new Error("Week start is required.");
  }

  const weekStart = startOfWeek(parsedDate);

  const cycle = await prisma.cycle.findFirst({
    where: { id: cycleId, userId },
    select: { id: true },
  });

  if (!cycle) {
    throw new Error("Cycle not found.");
  }

  const goalIds = Array.from(
    new Set(
      formData
        .getAll("goalId")
        .map((id) => String(id))
        .filter(Boolean),
    ),
  );

  const goals = goalIds.length
    ? await prisma.goal.findMany({
        where: {
          id: { in: goalIds },
          cycleId,
          userId,
          archivedAt: null,
        },
        select: { id: true },
      })
    : [];

  await prisma.$transaction(async (tx) => {
    const checkIn = await tx.weeklyCheckIn.upsert({
      where: { cycleId_weekStart: { cycleId, weekStart } },
      create: {
        cycleId,
        userId,
        weekStart,
        notes: notes || null,
      },
      update: {
        notes: notes || null,
      },
    });

    if (goals.length === 0) {
      return;
    }

    await Promise.all(
      goals.map((goal) => {
        const value = parseNumber(
          formData.get(`value-${goal.id}`),
          "Update value",
        );
        const updateNotes = String(
          formData.get(`notes-${goal.id}`) ?? "",
        ).trim();

        return tx.weeklyGoalUpdate.upsert({
          where: {
            goalId_checkInId: { goalId: goal.id, checkInId: checkIn.id },
          },
          create: {
            goalId: goal.id,
            checkInId: checkIn.id,
            value,
            notes: updateNotes || null,
          },
          update: {
            value,
            notes: updateNotes || null,
          },
        });
      }),
    );
  });

  revalidatePath("/check-in");
  revalidatePath(`/check-in/${cycleId}`);
}
