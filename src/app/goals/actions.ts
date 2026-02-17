"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { revalidatePath } from "next/cache";

function parseNumber(value: FormDataEntryValue | null, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    throw new Error("Invalid number value.");
  }

  return numberValue;
}

export async function createGoal(cycleId: string, formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  const directionRaw = String(formData.get("direction") ?? "INCREASE");
  const direction = directionRaw === "DECREASE" ? "DECREASE" : "INCREASE";
  const startValue = parseNumber(formData.get("startValue"));
  const targetValueRaw = formData.get("targetValue");
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;

  if (targetValueRaw === null || targetValueRaw === "") {
    throw new Error("Target value is required.");
  }

  const targetValue = parseNumber(targetValueRaw);

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!cycleId) {
    throw new Error("Missing cycle id.");
  }

  const cycle = await prisma.cycle.findFirst({
    where: { id: cycleId, userId },
    select: { id: true },
  });

  if (!cycle) {
    throw new Error("Cycle not found.");
  }

  await prisma.goal.create({
    data: {
      userId,
      cycleId,
      title,
      description: description || null,
      unit: unit || null,
      startValue,
      targetValue,
      direction,
      categoryId,
    },
  });

  revalidatePath(`/cycles/${cycleId}`);
  revalidatePath("/goals");
  revalidatePath("/");
}

export async function updateGoal(goalId: string, formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  const directionRaw = String(formData.get("direction") ?? "INCREASE");
  const direction = directionRaw === "DECREASE" ? "DECREASE" : "INCREASE";
  const startValue = parseNumber(formData.get("startValue"));
  const targetValueRaw = formData.get("targetValue");
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;

  if (targetValueRaw === null || targetValueRaw === "") {
    throw new Error("Target value is required.");
  }

  const targetValue = parseNumber(targetValueRaw);

  if (!title) {
    throw new Error("Title is required.");
  }

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    select: { cycleId: true },
  });

  if (!goal) {
    throw new Error("Goal not found.");
  }

  await prisma.goal.update({
    where: { id: goalId },
    data: {
      title,
      description: description || null,
      unit: unit || null,
      startValue,
      targetValue,
      direction,
      categoryId,
    },
  });

  revalidatePath(`/cycles/${goal.cycleId}`);
  revalidatePath("/goals");
  revalidatePath("/");
}

export async function setGoalArchived(formData: FormData) {
  const userId = await requireUserId();
  const goalId = String(formData.get("goalId") ?? "");
  const archive = String(formData.get("archive") ?? "true") === "true";

  if (!goalId) {
    throw new Error("Missing goal id.");
  }

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    select: { cycleId: true },
  });

  if (!goal) {
    throw new Error("Goal not found.");
  }

  await prisma.goal.update({
    where: { id: goalId },
    data: { archivedAt: archive ? new Date() : null },
  });

  revalidatePath(`/cycles/${goal.cycleId}`);
  revalidatePath("/goals");
  revalidatePath("/");
}
