import { Target, Mail } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <Mail className="h-7 w-7 text-emerald-400" />
          </div>
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">Check your email</h1>
        <p className="text-sm text-zinc-400">
          A sign-in link has been sent to your email address. Click it to
          continue.
        </p>
      </div>
    </div>
  );
}
