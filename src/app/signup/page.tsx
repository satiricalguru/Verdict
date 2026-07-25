"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Signup failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6 font-sans">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 space-y-6 shadow-md">
        <div className="w-12 h-12 rounded bg-[var(--ink)] text-[var(--paper)] font-mono font-bold text-xl flex items-center justify-center mx-auto">
          V
        </div>

        <div className="text-center space-y-1">
          <h1 className="font-sans font-semibold text-2xl text-[var(--ink)] -tracking-[0.02em]">
            Create Verdict Account
          </h1>
          <p className="text-xs text-[var(--mist)]">
            Free forever • Hosted + Self-Hosted Dual Mode
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[var(--fail)]/10 border border-[var(--fail)]/30 text-xs font-mono text-[var(--fail)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <label className="block font-semibold text-[var(--ink)]">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--mist)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Developer"
                className="w-full pl-9 pr-3 py-2 bg-[var(--fog)] border border-[var(--border)] rounded-lg text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-[var(--ink)]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--mist)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@verdict.dev"
                className="w-full pl-9 pr-3 py-2 bg-[var(--fog)] border border-[var(--border)] rounded-lg text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-semibold text-[var(--ink)]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--mist)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[var(--fog)] border border-[var(--border)] rounded-lg text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] font-semibold text-xs hover:opacity-90 transition-all disabled:opacity-50"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--mist)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--signal)] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
