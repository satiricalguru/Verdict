import React from "react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 text-center space-y-6 shadow-sm">
        <div className="w-12 h-12 rounded bg-[var(--ink)] text-[var(--paper)] font-mono font-bold text-xl flex items-center justify-center mx-auto">
          V
        </div>

        <div className="space-y-1">
          <h1 className="font-display font-black text-2xl text-[var(--ink)]">
            Create Verdict Account
          </h1>
          <p className="text-xs text-[var(--mist)]">
            Free forever • Hosted + Self-Hosted Dual Mode
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-[var(--signal)] text-white font-semibold text-sm hover:bg-[var(--signal-hover)] transition-colors"
          >
            <span>Sign Up with GitHub</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--mist)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--signal)] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
