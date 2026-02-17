import Link from "next/link";
import {
  Target,
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Sparkles,
  Flame,
  Calendar,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Life Score Dashboard",
    description:
      "See all your goals at a glance. Know instantly what's on track.",
    color: "#34d399",
  },
  {
    icon: ClipboardCheck,
    title: "Weekly Check-ins",
    description:
      "A guided ritual to review each goal, log progress, and reflect.",
    color: "#3b82f6",
  },
  {
    icon: Sparkles,
    title: "AI Coach",
    description:
      "Personalized weekly insights that spot patterns and suggest actions.",
    color: "#a78bfa",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description:
      "Build momentum with weekly check-in streaks. Consistency wins.",
    color: "#f59e0b",
  },
  {
    icon: Calendar,
    title: "Flexible Frameworks",
    description:
      "12 Week Year, OKRs, or your own system. Templates to get started.",
    color: "#06b6d4",
  },
  {
    icon: Zap,
    title: "Integrations",
    description:
      "Connect Strava, Google Calendar, and more. Auto-track fitness goals.",
    color: "#ec4899",
  },
];

export function LandingHero() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-12 text-center sm:pt-20">
        <div className="relative mx-auto mb-8 inline-block">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03]">
            <Target className="h-10 w-10 text-emerald-400" />
          </div>
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Track goals with{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            obsessive clarity
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-zinc-400">
          The goals app for ambitious people. Set outcomes, check in weekly, and
          watch your life score climb. Built for 12 Week Year and OKRs.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Start tracking free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-4 text-xs text-zinc-600">
          No credit card required. Free forever for basic use.
        </p>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-8 text-center text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
          Everything you need
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                <div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${feature.color}10`,
                    color: feature.color,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-10 text-center">
        <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-10">
          <h2 className="text-xl font-bold text-white">
            Ready to build momentum?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Join ambitious professionals who track goals with clarity.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
