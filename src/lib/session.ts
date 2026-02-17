import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getDevUserId(): Promise<string | null> {
  if (process.env.NODE_ENV !== "development") return null;

  // In dev with no OAuth configured, use the first user in the database
  const hasOAuth =
    process.env.GOOGLE_CLIENT_ID || process.env.AZURE_AD_CLIENT_ID;
  if (hasOAuth) return null;

  const user = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  return user?.id ?? null;
}

export async function getUserId() {
  // Dev bypass: auto-login when no OAuth is configured
  const devUserId = await getDevUserId();
  if (devUserId) return devUserId;

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
