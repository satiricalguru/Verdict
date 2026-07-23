import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 text-center space-y-6 shadow-sm">
        <div className="w-12 h-12 rounded bg-[var(--ink)] text-[var(--paper)] font-mono font-bold text-xl flex items-center justify-center mx-auto">
          V
        </div>

        <div className="space-y-1">
          <h1 className="font-sans font-semibold text-2xl text-[var(--ink)] -tracking-[0.02em]">
            Sign In to Verdict
          </h1>
          <p className="text-xs text-[var(--mist)]">
            Hosted workspace & BYOK benchmark access
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-[var(--ink)] text-[var(--paper)] font-semibold text-sm hover:bg-[var(--signal)] transition-colors"
          >
            <span>Continue with GitHub</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-[var(--fog)] border border-[var(--border)] text-[var(--ink)] font-semibold text-sm hover:border-[var(--signal)] transition-colors"
          >
            <span>Continue with Email</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--mist)]">
          Self-hosting locally? Auth is skippable in single-user mode.
        </div>
      </div>
    </div>
  );
}
