import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check session
    const session = await auth();

    // Check DB connection
    const userCount = await prisma.user.count();
    const sessionCount = await prisma.session.count();
    const tokenCount = await prisma.verificationToken.count();

    // Check recent tokens
    const recentTokens = await prisma.verificationToken.findMany({
      orderBy: { expires: "desc" },
      take: 5,
      select: { identifier: true, expires: true },
    });

    // Check recent sessions
    const recentSessions = await prisma.session.findMany({
      orderBy: { expires: "desc" },
      take: 5,
      select: { userId: true, expires: true },
    });

    return NextResponse.json({
      session: session ? { user: session.user } : null,
      db: {
        users: userCount,
        sessions: sessionCount,
        verificationTokens: tokenCount,
      },
      recentTokens,
      recentSessions,
      env: {
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        authUrl: process.env.AUTH_URL ?? "NOT SET",
        nextAuthUrl: process.env.NEXTAUTH_URL ?? "NOT SET",
        authTrustHost: process.env.AUTH_TRUST_HOST ?? "NOT SET",
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasDbUrl: !!process.env.DATABASE_URL,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
