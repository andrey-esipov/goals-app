import { auth } from "@/auth";
import { getUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Settings, User, Bell, Download, AlertTriangle } from "lucide-react";

export default async function SettingsPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, image: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <User className="h-4 w-4 text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold text-white">Profile</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-lg font-bold text-emerald-300">
              {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white">
                {user.name ?? "No name set"}
              </p>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>
          <div className="text-xs text-zinc-600">
            Member since {user.createdAt.toLocaleDateString()}
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Settings className="h-4 w-4 text-amber-400" />
          </div>
          <h2 className="text-sm font-semibold text-white">Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Week starts on
              </p>
              <p className="text-xs text-zinc-500">
                Used for weekly check-in dates
              </p>
            </div>
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-400">
              Monday
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Default cycle length
              </p>
              <p className="text-xs text-zinc-500">
                Pre-filled when creating new cycles
              </p>
            </div>
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm text-zinc-400">
              12 weeks
            </span>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Bell className="h-4 w-4 text-purple-400" />
          </div>
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Weekly check-in reminder
              </p>
              <p className="text-xs text-zinc-500">Email on Sunday evening</p>
            </div>
            <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              Coming soon
            </span>
          </div>
        </div>
      </section>

      {/* Data export */}
      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Download className="h-4 w-4 text-cyan-400" />
          </div>
          <h2 className="text-sm font-semibold text-white">Data</h2>
        </div>
        <p className="text-sm text-zinc-500">
          Export all your goals, cycles, and check-in data.
        </p>
        <button
          disabled
          className="mt-4 rounded-xl bg-white/[0.04] px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.06]"
        >
          Export as CSV (coming soon)
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-6">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
        </div>
        <p className="text-sm text-zinc-500">
          Permanently delete your account and all data. This cannot be undone.
        </p>
        <button
          disabled
          className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
        >
          Delete account
        </button>
      </section>
    </div>
  );
}
