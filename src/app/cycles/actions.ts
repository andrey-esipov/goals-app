"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseDate(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function createCycle(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const startDate = parseDate(formData.get("startDate"));
  const endDate = parseDate(formData.get("endDate"));

  if (!name || !startDate || !endDate) {
    throw new Error("Missing required fields.");
  }

  const cycle = await prisma.cycle.create({
    data: {
      userId,
      name,
      startDate,
      endDate,
    },
  });

  revalidatePath("/cycles");
  redirect(`/cycles/${cycle.id}`);
}

export async function updateCycle(cycleId: string, formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const startDate = parseDate(formData.get("startDate"));
  const endDate = parseDate(formData.get("endDate"));

  if (!name || !startDate || !endDate) {
    throw new Error("Missing required fields.");
  }

  const { count } = await prisma.cycle.updateMany({
    where: { id: cycleId, userId },
    data: {
      name,
      startDate,
      endDate,
    },
  });

  if (!count) {
    throw new Error("Cycle not found.");
  }

  revalidatePath("/cycles");
  revalidatePath(`/cycles/${cycleId}`);
  redirect(`/cycles/${cycleId}`);
}

export async function setCycleArchived(formData: FormData) {
  const userId = await requireUserId();
  const cycleId = String(formData.get("cycleId") ?? "");
  const archive = String(formData.get("archive") ?? "true") === "true";

  if (!cycleId) {
    throw new Error("Missing cycle id.");
  }

  const { count } = await prisma.cycle.updateMany({
    where: { id: cycleId, userId },
    data: {
      archivedAt: archive ? new Date() : null,
    },
  });

  if (!count) {
    throw new Error("Cycle not found.");
  }

  revalidatePath("/cycles");
  revalidatePath(`/cycles/${cycleId}`);
  revalidatePath("/goals");
}
