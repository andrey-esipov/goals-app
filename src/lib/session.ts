import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getUserId() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const sessionUser = session.user as { id?: string; email?: string | null };

  if (sessionUser.id) {
    return sessionUser.id;
  }

  if (!sessionUser.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function requireUserId() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/");
  }

  return userId;
}
