"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Target, ArrowRight, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await signIn("resend", { email, redirect: false });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div
          className="mb-8 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <Target className="h-7 w-7 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Goals
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track progress. Build momentum.
          </p>
        </motion.div>

        {sent ? (
          /* Check email state */
          <motion.div
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Mail className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-white">
              Check your email
            </h2>
            <p className="text-sm text-zinc-400">
              We sent a magic link to{" "}
              <span className="font-medium text-white">{email}</span>. Click it
              to sign in.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Use a different email
            </button>
          </motion.div>
        ) : (
          /* Email form */
          <motion.div
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-zinc-400"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white transition-colors placeholder:text-zinc-600 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-medium text-white transition-all hover:bg-emerald-400 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Continue with email
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-zinc-600">
              No password needed — we&apos;ll send you a magic link.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
