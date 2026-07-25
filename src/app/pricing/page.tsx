"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Zap, Building2, Users } from "lucide-react";

const FREE_FEATURES = [
  "Public leaderboard access",
  '"Can I Run It?" hardware calculator',
  "Community Discord support",
  "Basic model comparison",
];

const UNLOCKED_FEATURES = [
  { text: "All features included 100% free", bold: true },
  "Hosted runs & BYOK key management",
  "AI-as-a-Judge auto-scoring engine",
  "Live head-to-head model arena",
  "Smart model use-case matches",
  "Full judge panel notes & reasoning",
  "Unlimited BYOK execution history",
  "100% open source & self-hostable",
];

const ENTERPRISE_FEATURES = [
  "Secure VPC or On-prem deployment",
  "Custom LLM evaluation rubrics",
  "Private custom model integrations",
  "Team dashboard & workspace sharing",
  "Dedicated capacity & custom SLAs",
  "SSO / SAML support",
];

export default function PricingPage() {
  return (
    <div className="space-y-16 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--pass)]/10 border border-[var(--pass)]/20 text-xs font-mono text-[var(--pass)] font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          100% Free &amp; Open Source AI Benchmarking
        </div>
        <h1 className="text-3xl sm:text-5xl font-sans font-extrabold text-[var(--ink)] tracking-tight leading-tight">
          Every provider, every run,<br />
          <span className="text-[var(--signal)]">100% free forever</span>.
        </h1>
        <p className="text-base text-[var(--mist)] leading-relaxed">
          Verdict is completely open source and free for all developers. Connect any AI provider API key with zero subscription fees.
        </p>
      </div>

      {/* ─── Pricing Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
        {/* Free / Community */}
        <div
          className="rounded-2xl border border-[var(--border)] p-8 space-y-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
          style={{ background: "var(--paper)" }}
        >
          <div className="space-y-5">
            <div>
              <p className="font-mono text-[11px] text-[var(--mist)] uppercase tracking-[2px] mb-3">Community</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-5xl font-bold text-[var(--ink)]">$0</span>
                <span className="font-mono text-sm text-[var(--mist)]">/forever</span>
              </div>
              <p className="mt-3 text-sm text-[var(--mist)] leading-relaxed">
                For individual developers, researchers, and open source contributors.
              </p>
            </div>
            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--mist)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--mist)] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/leaderboard"
            className="block text-center py-3.5 px-6 rounded-xl border border-[var(--border)] text-[var(--ink)] font-mono font-semibold text-sm hover:bg-[var(--fog)] transition-colors"
          >
            Explore Leaderboard
          </Link>
        </div>

        {/* Full Stack — 100% Free Unlocked */}
        <div
          className="relative rounded-2xl p-8 space-y-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 border border-[var(--signal)]"
          style={{
            background: "rgba(232,181,75,0.03)",
            boxShadow: "0 8px 32px rgba(232,181,75,0.08)",
          }}
        >
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--signal)] text-black text-[10px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Full Access Unlocked
          </div>

          <div className="space-y-5">
            <div>
              <p className="font-mono text-[11px] text-[var(--signal)] uppercase tracking-[2px] font-semibold mb-3">Verdict Full Suite</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-5xl font-bold text-[var(--ink)]">$0</span>
                <span className="font-mono text-sm text-[var(--mist)]">/forever</span>
              </div>
              <p className="mt-3 text-sm text-[var(--mist)] leading-relaxed">
                Full access to all provider API integrations, playground, arena, and model advisor.
              </p>
            </div>
            <ul className="space-y-3">
              {UNLOCKED_FEATURES.map((f) => (
                <li key={typeof f === "string" ? f : f.text} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[var(--signal)] flex-shrink-0 mt-0.5" />
                  <span className={typeof f === "object" && f.bold ? "text-[var(--ink)] font-semibold" : "text-[var(--mist)]"}>
                    {typeof f === "string" ? f : f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block text-center py-3.5 px-6 rounded-xl font-mono font-bold text-sm bg-[var(--signal)] text-black hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
            <p className="text-center text-[10px] font-mono text-[var(--pass)]">
              ★ 100% Free Forever • BYOK API Keys
            </p>
          </div>
        </div>

        {/* Enterprise / Self-Hosted */}
        <div
          className="rounded-2xl border border-[var(--border)] p-8 space-y-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
          style={{ background: "var(--paper)" }}
        >
          <div className="space-y-5">
            <div>
              <p className="font-mono text-[11px] text-[var(--mist)] uppercase tracking-[2px] mb-3">Self-Hosted / Enterprise</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-4xl font-bold text-[var(--ink)]">$0</span>
                <span className="font-mono text-sm text-[var(--mist)]">/ Open Source</span>
              </div>
              <p className="mt-3 text-sm text-[var(--mist)] leading-relaxed">
                For teams requiring custom VPC, private models, and isolated infrastructure.
              </p>
            </div>
            <ul className="space-y-3">
              {ENTERPRISE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--mist)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--mist)] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/self-host"
            className="block text-center py-3.5 px-6 rounded-xl border border-[var(--border)] text-[var(--ink)] font-mono font-semibold text-sm hover:bg-[var(--fog)] transition-colors"
          >
            Deploy Self-Hosted
          </Link>
        </div>
      </div>

      {/* ─── Feature Comparison Banner ────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--border)] p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-[var(--paper)]">
        {[
          { icon: Zap, title: "100% Free & Unlocked", desc: "Every feature is completely unlocked at $0/month — run full benchmark suites, inspect multi-judge reasoning, and compare models." },
          { icon: Building2, title: "Self-host anytime", desc: "Deploy the full Docker Compose stack (Next.js + Python engine + Redis + Postgres) on your own infrastructure for 100% data privacy." },
          { icon: Users, title: "Open source community", desc: "Join the open community, contribute benchmark prompts, and audit the evaluation methodology. 100% transparent." },
        ].map((item) => (
          <div key={item.title} className="flex gap-4">
            <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--fog)] flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-[var(--signal)]" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-sm text-[var(--ink)] mb-1">{item.title}</h3>
              <p className="text-xs text-[var(--mist)] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
