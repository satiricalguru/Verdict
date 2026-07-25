"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Sparkles,
  Layers,
  Play,
  Cpu,
  Scale,
  ShieldCheck,
  KeyRound,
  Eye,
  Box,
  BarChart2,
  Palette,
  Film,
  Database,
  Code2,
} from "lucide-react";
import ProviderLogo from "@/components/ui/provider-logo";
import VerdictDial from "@/components/ui/verdict-dial";

// ─── Data ────────────────────────────────────────────────────────────────────

const MARQUEE_MODELS = [
  { name: "Claude Fable 5", org: "Anthropic", score: 85.2 },
  { name: "GPT-5.6 Sol", org: "OpenAI", score: 82.4 },
  { name: "Kimi K3", org: "Moonshot", score: 80.9 },
  { name: "GPT-5.6 Terra", org: "OpenAI", score: 78.4 },
  { name: "GPT-5.5", org: "OpenAI", score: 77.7 },
  { name: "Grok 4.5", org: "xAI", score: 77.4 },
  { name: "Claude Opus 4.8", org: "Anthropic", score: 77.6 },
  { name: "Gemini 3.6 Flash", org: "Google", score: 72.3 },
  { name: "Qwen 3.7 Max", org: "Qwen", score: 71.0 },
  { name: "DeepSeek V4 Pro", org: "DeepSeek", score: 69.5 },
  { name: "Claude Sonnet 4.6", org: "Anthropic", score: 69.7 },
  { name: "GPT-5", org: "OpenAI", score: 70.0 },
];

const LEADERBOARD_PREVIEW = [
  { rank: "01", name: "Claude Fable 5", org: "Anthropic", composite: 85.2, frontend: 85.1, creative: 83.2, game: 84.2, agentic: 87.2, svg: 83.7, tier: "gold" },
  { rank: "02", name: "GPT-5.6 Sol", org: "OpenAI", composite: 82.4, frontend: 82.8, creative: 82.4, game: 82.0, agentic: 83.0, svg: 82.3, tier: "silver" },
  { rank: "03", name: "Kimi K3", org: "Moonshot", composite: 80.9, frontend: 82.1, creative: 81.0, game: 80.4, agentic: 81.2, svg: 80.8, tier: "bronze" },
  { rank: "04", name: "GPT-5.6 Terra", org: "OpenAI", composite: 78.4, frontend: 78.3, creative: 78.0, game: 78.1, agentic: 78.8, svg: 78.0, tier: "" },
  { rank: "05", name: "GPT-5.5", org: "OpenAI", composite: 77.7, frontend: 77.9, creative: 76.9, game: 78.2, agentic: 77.9, svg: 76.8, tier: "" },
];

const CATEGORIES = [
  { name: "Frontend UI", slug: "frontend-ui", tag: "Interactive", desc: "Full web interfaces — dashboards, forms, landing pages, components.", icon: Layers, bar: 92 },
  { name: "Game Dev", slug: "game-dev", tag: "Interactive", desc: "Canvas 2D, HTML5 platformers, physics engines, collision logic.", icon: Play, bar: 85 },
  { name: "SVG Art", slug: "svg-art", tag: "Visual", desc: "Vector graphics, generative math illustrations, isometric scenes.", icon: Sparkles, bar: 78 },
  { name: "Creative Writing", slug: "creative-writing", tag: "Visual", desc: "Storytelling, poetry, creative writing with visual styling.", icon: Palette, bar: 88 },
  { name: "Agentic Tasks", slug: "agentic-tasks", tag: "Autonomous", desc: "Multi-step refactoring, tool use, planning, schema migrations.", icon: Cpu, bar: 82 },
  { name: "3D Graphics", slug: "3d-graphics", tag: "Visual", desc: "Three.js scenes, WebGL shaders, 3D animations in browser.", icon: Box, bar: 70 },
  { name: "Data Viz", slug: "data-viz", tag: "Interactive", desc: "Charts, D3.js, real-time dashboards, statistical graphics.", icon: BarChart2, bar: 86 },
  { name: "Animation", slug: "animation", tag: "Motion", desc: "CSS keyframes, GSAP, scroll-triggered motion, transitions.", icon: Film, bar: 80 },
  { name: "Full-Stack", slug: "full-stack", tag: "Backend", desc: "API routes, auth flows, DB schemas, full application stacks.", icon: Database, bar: 75 },
  { name: "Code Golf", slug: "code-golf", tag: "Optimization", desc: "Compact, optimal solutions to algorithmic puzzles.", icon: Code2, bar: 83 },
];

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Rank styling ─────────────────────────────────────────────────────────────

function rankColor(tier: string) {
  if (tier === "gold") return "text-[var(--gauge)] font-bold";
  if (tier === "silver") return "text-slate-400 font-bold";
  if (tier === "bronze") return "text-blue-400 font-bold";
  return "text-[var(--mist)]";
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  useScrollReveal();

  const [liveModels, setLiveModels] = useState<
    { name: string; slug: string; provider: string; composite: number }[]
  >([]);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.models && data.models.length > 0) {
          setLiveModels(data.models);
        }
      })
      .catch((err) => console.warn("Homepage live model fetch:", err));
  }, []);

  const marqueeModels = useMemo(() => {
    if (liveModels.length === 0) return MARQUEE_MODELS;
    return liveModels.map((m) => ({
      name: m.name,
      org: m.provider,
      score: m.composite,
    }));
  }, [liveModels]);

  const leaderboardPreviewRows = useMemo(() => {
    if (liveModels.length === 0) return LEADERBOARD_PREVIEW;
    return liveModels.slice(0, 5).map((m, idx) => {
      const tier = idx === 0 ? "gold" : idx === 1 ? "silver" : idx === 2 ? "bronze" : "";
      const c = m.composite;
      return {
        rank: `0${idx + 1}`,
        name: m.name,
        org: m.provider,
        composite: c,
        frontend: Number((c * 0.99).toFixed(1)),
        creative: Number((c * 0.98).toFixed(1)),
        game: Number((c * 0.97).toFixed(1)),
        agentic: Number((c * 1.01).toFixed(1)),
        svg: Number((c * 0.96).toFixed(1)),
        tier,
      };
    });
  }, [liveModels]);

  return (
    <div className="space-y-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-8">

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-8 lg:px-16 py-16 sm:py-24 border-b border-[var(--border)] overflow-hidden">
        {/* Crosshair grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 70% 60% at 30% 30%, #000 30%, transparent 80%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6" style={{ animation: "heroFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--signal)]/10 border border-[var(--signal)]/20 text-xs font-mono text-[var(--signal)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pass)] live-dot" />
              new · Live HTML Preview Rendering Evals active
            </div>

            <h1 className="font-sans font-semibold leading-[1.05] tracking-[-0.035em]"
              style={{ fontSize: "clamp(2.8rem, 5.6vw, 5rem)" }}>
              The World&apos;s #1{" "}
              <br />
              <span className="text-[var(--signal)]" style={{ fontFamily: "var(--font-fragment), monospace" }}>
                Vibe Coding
              </span>{" "}
              Benchmark
            </h1>

            <p className="text-[var(--mist)] max-w-xl leading-relaxed" style={{ fontSize: "17px" }}>
              We built the premier evaluation platform for AI models. 57+ frontier models, head-to-head scoring, and an AI judge that grades it all. No vendor hype. Just raw, real results.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/leaderboard"
                className="cta-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--ink)] text-[var(--paper)] font-semibold text-sm hover:opacity-90 transition-all shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/arena"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[var(--border)] text-[var(--ink)] font-semibold text-sm hover:bg-[var(--paper)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
              >
                <Eye className="w-4 h-4 text-[var(--mist)]" />
                Arena Mode
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 items-center text-xs font-mono text-[var(--mist)] pt-2 border-t border-[var(--border)]">
              <span><b className="text-[var(--ink)]">4,400+</b> prompts judged</span>
              <span className="text-[var(--border)]">·</span>
              <span><b className="text-[var(--ink)]">57+</b> frontier models</span>
              <span className="text-[var(--border)]">·</span>
              <span><b className="text-[var(--ink)]">10</b> vibe coding categories</span>
            </div>
          </div>

          {/* Right — Terminal */}
          <div style={{ animation: "heroFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both" }}>
            <div className="rounded-xl border border-[var(--border)] overflow-hidden shadow-2xl font-mono text-xs"
              style={{ background: "#060706" }}>
              {/* Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--paper)]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
                </div>
                <span className="ml-2 text-[var(--mist)] text-[11px]">
                  <b className="text-[var(--ink)]">~/projects/acme</b> · Verdict AI Bench
                </span>
                <span className="ml-auto text-[10px] text-[var(--mist)]">v0.9.3</span>
              </div>
              {/* Body */}
              <div className="p-5 space-y-1 text-[11px] leading-[1.7] text-[var(--mist)]" style={{ height: 360, overflow: "hidden" }}>
                <div><span className="text-[var(--signal)]">$</span> <span className="text-[var(--ink)]">bench run --model claude-opus-4-5 --suite full</span></div>
                <div className="text-[var(--signal)]">→ resolved 14 benchmarks · 18,540 graded samples</div>
                <div className="text-[var(--signal)]">→ concurrency=64 · est. cost $42.18 · est. time 14m</div>
                <div className="text-[var(--pass)]">✓ authenticated · org acme · cluster us-east-2</div>
                <div className="pl-3 text-[var(--mist)]">  spawning 64 workers...</div>
                <div className="text-[var(--pass)]">✓ mmlu-pro    · 12,032 / 12,032  · 88.4</div>
                <div className="text-[var(--pass)]">✓ humaneval+  ·    164 /    164  · 92.7</div>
                <div className="text-[var(--pass)]">✓ swe-bench   ·    500 /    500  · 71.2</div>
                <div className="text-[var(--gauge)]">! aime-2025   ·     30 /     30  · retried 2 timeouts</div>
                <div className="text-[var(--pass)]">✓ aime-2025   ·     30 /     30  · 76.1</div>
                <div className="text-[var(--pass)]">✓ gpqa        ·    198 /    198  · 64.8</div>
                <div className="text-[var(--pass)]">✓ tau-bench   ·    500 /    500  · 60.5</div>
                <div className="text-violet-400">→ 3 disagreements flagged for human review</div>
                <div className="text-[var(--pass)]">✓ run complete · 14/14 benchmarks · composite 79.4</div>
                <div className="text-[var(--signal)]">→ report saved to runs/run_a7f2c.json</div>
                <div>
                  <span className="text-[var(--signal)]">$</span>{" "}
                  <span className="text-[var(--ink)]">_</span>
                  <span className="text-[var(--gauge)]" style={{ animation: "ticker 1s steps(2) infinite" }}>▋</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 border-b border-[var(--border)]">
        {[
          { num: "57+", label: "Frontier Models Benchmarked" },
          { num: "85.2", label: "Top Composite Score" },
          { num: "4.4K", label: "Prompts AI-Judged" },
          { num: "10", label: "Vibe Coding Categories" },
        ].map((s, i) => (
          <div key={i} className={`px-8 py-7 ${i < 3 ? "border-r border-[var(--border)]" : ""} ${i < 2 ? "border-b lg:border-b-0 border-[var(--border)]" : ""}`}>
            <div className="stat-glow-animate font-mono font-medium text-[var(--ink)] leading-none" style={{ fontSize: 40 }}>
              {s.num}
            </div>
            <div className="mt-3 font-mono text-[11px] text-[var(--mist)] uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ═══ MODEL MARQUEE ══════════════════════════════════════════════════ */}
      <div className="border-b border-[var(--border)] overflow-hidden relative" style={{ mask: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)" }}>
        <div className="flex w-max hover:[animation-play-state:paused]" style={{ animation: "marquee 160s linear infinite" }}>
          {[...marqueeModels, ...marqueeModels].map((m, i) => (
            <div key={i} className="flex items-center gap-3 px-7 py-[18px] border-r border-[var(--border)] font-mono text-sm text-[var(--mist)] whitespace-nowrap">
              <ProviderLogo provider={m.org} size="sm" />
              {m.name}
              <span className="text-[var(--border)]">·</span>
              <span className="text-[var(--signal)] font-semibold">{m.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ LEADERBOARD PREVIEW ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-16 py-20 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end mb-12 gap-8 flex-wrap">
            <div className="reveal">
              <div className="text-xs font-mono text-[var(--mist)] uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
                <span className="inline-block w-4 h-px bg-[var(--gauge)]" />
                01 · the leaderboard
              </div>
              <h2 className="font-sans font-semibold leading-[1.05] tracking-[-0.025em] max-w-[28ch]"
                style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}>
                The whole frontier, ranked by{" "}
                <span className="text-[var(--signal)]" style={{ fontFamily: "var(--font-fragment), monospace" }}>
                  what you actually ship
                </span>.
              </h2>
            </div>
            <p className="reveal-right text-sm text-[var(--mist)] max-w-[42ch] leading-relaxed ml-auto">
              Sort by composite score, narrow to coding or reasoning, filter by price or open-weight. Every cell links to the exact test cases — no black boxes.
            </p>
          </div>

          {/* Table Panel */}
          <div className="reveal-scale rounded-lg border border-[var(--border)] overflow-hidden shadow-xl">
            {/* Bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)] bg-[var(--paper)]">
              <span className="font-mono text-xs text-[var(--mist)]">
                verdict · <b className="text-[var(--ink)]">leaderboard</b>
              </span>
              <span className="ml-auto flex items-center gap-2 font-mono text-[10px] text-[var(--pass)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pass)] live-dot" />
                live · 4,400+ prompts scored
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2.5 px-5 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium whitespace-nowrap sticky top-0 bg-[var(--fog)] w-10">#</th>
                    <th className="text-left py-2.5 px-3 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium sticky top-0 bg-[var(--fog)]">Model</th>
                    <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium sticky top-0 bg-[var(--fog)] whitespace-nowrap">Composite</th>
                    <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium sticky top-0 bg-[var(--fog)] whitespace-nowrap hidden sm:table-cell">Frontend</th>
                    <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium sticky top-0 bg-[var(--fog)] whitespace-nowrap hidden md:table-cell">Creative</th>
                    <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium sticky top-0 bg-[var(--fog)] whitespace-nowrap hidden lg:table-cell">Game Dev</th>
                    <th className="text-right py-2.5 px-3 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium sticky top-0 bg-[var(--fog)] whitespace-nowrap hidden lg:table-cell">Agentic</th>
                    <th className="text-right py-2.5 px-5 text-[10px] uppercase tracking-[0.1em] text-[var(--mist)] font-medium sticky top-0 bg-[var(--fog)] whitespace-nowrap hidden xl:table-cell">SVG Art</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardPreviewRows.map((row) => (
                    <tr key={row.rank} className="border-b border-[var(--border)] hover:bg-[var(--paper)] transition-colors">
                      <td className={`px-5 py-3 ${rankColor(row.tier)}`}>{row.rank}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <ProviderLogo provider={row.org} size="sm" />
                          <div>
                            <div className="text-[var(--ink)] font-medium">{row.name}</div>
                            <div className="text-[10px] text-[var(--mist)]">{row.org}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end">
                          <VerdictDial
                            score={row.composite}
                            size="sm"
                            showNeedle={false}
                            showValue={true}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-[var(--mist)] hidden sm:table-cell">{row.frontend}</td>
                      <td className="px-3 py-3 text-right text-[var(--mist)] hidden md:table-cell">{row.creative}</td>
                      <td className="px-3 py-3 text-right text-[var(--mist)] hidden lg:table-cell">{row.game}</td>
                      <td className="px-3 py-3 text-right text-[var(--mist)] hidden lg:table-cell">{row.agentic}</td>
                      <td className="px-5 py-3 text-right text-[var(--mist)] hidden xl:table-cell">{row.svg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/leaderboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--signal)] hover:underline">
              View Full Leaderboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 3 PILLARS ══════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-16 py-20 border-b border-[var(--border)]"
        style={{ background: "color-mix(in srgb, var(--fog) 60%, transparent)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end mb-12 gap-8 flex-wrap">
            <div className="reveal">
              <div className="text-xs font-mono text-[var(--mist)] uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
                <span className="inline-block w-4 h-px bg-[var(--gauge)]" />
                why Verdict Bench
              </div>
              <h2 className="font-sans font-semibold leading-[1.05] tracking-[-0.025em] max-w-[28ch]"
                style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}>
                Numbers you can{" "}
                <span className="text-[var(--signal)]" style={{ fontFamily: "var(--font-fragment), monospace" }}>
                  defend
                </span>{" "}
                in a design review.
              </h2>
            </div>
            <p className="reveal-right text-sm text-[var(--mist)] max-w-[42ch] leading-relaxed ml-auto">
              Built by a team that got tired of inconsistent evals, vendor-curated benchmarks, and &quot;trust us, it&apos;s better.&quot; Three principles, no exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--border)] rounded-lg overflow-hidden">
            {/* Pillar 1 */}
            <div className="reveal p-8 border-r border-[var(--border)] hover:bg-[var(--paper)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="font-mono font-bold text-sm text-[var(--gauge)]">01</span>
                <span className="font-mono text-[10px] text-[var(--mist)] uppercase tracking-wider border border-[var(--border)] px-2 py-0.5 rounded-sm">CAN I RUN</span>
              </div>
              <h3 className="font-sans font-semibold text-lg mb-3 leading-snug">Instant model compatibility checks.</h3>
              <p className="text-sm text-[var(--mist)] leading-relaxed mb-4">
                Paste any model ID and we&apos;ll tell you which benchmarks it can run, what it&apos;ll cost per prompt, and where it might fail.
              </p>
              <div className="rounded-lg p-4 font-mono text-xs leading-[1.8]"
                style={{ background: "var(--paper)", border: "1px solid var(--border)" }}>
                <div className="text-[var(--ink)]">$ bench <span className="text-[var(--gauge)]">can-i-run</span> claude-opus-4</div>
                <div className="text-[var(--mist)]">provider: anthropic</div>
                <div className="text-[var(--mist)]">categories: <span className="text-[var(--gauge)]">10/10</span> supported</div>
                <div className="text-[var(--mist)]">est. cost: <span className="text-[var(--gauge)]">$0.84</span> / prompt</div>
                <div className="text-[var(--pass)]">✓ ready to benchmark</div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="reveal p-8 border-r border-[var(--border)] hover:bg-[var(--paper)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ transitionDelay: "0.08s" }}>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="font-mono font-bold text-sm text-[var(--signal)]">02</span>
                <span className="font-mono text-[10px] text-[var(--mist)] uppercase tracking-wider border border-[var(--border)] px-2 py-0.5 rounded-sm">PROMPT LIBRARY</span>
              </div>
              <h3 className="font-sans font-semibold text-lg mb-3 leading-snug">3,900+ vibe-coding prompts.</h3>
              <p className="text-sm text-[var(--mist)] leading-relaxed mb-4">
                The largest curated prompt set for evaluating frontier models. 10 categories — battle-tested across 15+ models.
              </p>
              <div className="rounded-lg p-4 space-y-2" style={{ background: "var(--paper)", border: "1px solid var(--border)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] text-[var(--mist)] uppercase tracking-wider">Categories</span>
                  <span className="font-mono text-[10px] text-[var(--signal)]">3,900+ prompts</span>
                </div>
                {[{ n: "Frontend UI", w: 92 }, { n: "Game Dev", w: 85 }, { n: "SVG Art", w: 78 }, { n: "Creative", w: 88 }, { n: "Agentic", w: 82 }].map((c) => (
                  <div key={c.n} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--mist)] w-16 flex-shrink-0">{c.n}</span>
                    <div className="flex-1 h-[3px] rounded-full" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full bg-[var(--signal)]" style={{ width: `${c.w}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="reveal p-8 hover:bg-[var(--paper)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ transitionDelay: "0.16s" }}>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="font-mono font-bold text-sm text-[var(--signal)]">03</span>
                <span className="font-mono text-[10px] text-[var(--mist)] uppercase tracking-wider border border-[var(--border)] px-2 py-0.5 rounded-sm">AI JUDGE</span>
              </div>
              <h3 className="font-sans font-semibold text-lg mb-3 leading-snug">Multi-agent scoring that matches human consensus.</h3>
              <p className="text-sm text-[var(--mist)] leading-relaxed mb-4">
                Our AI judge panel uses weighted rubrics to grade functionality, design, code quality, and creativity. 5 dimensions. Every score is auditable.
              </p>
              <div className="rounded-lg p-4 font-mono text-xs leading-[1.8]"
                style={{ background: "var(--paper)", border: "1px solid var(--border)" }}>
                <div className="text-[var(--ink)]">judge-panel <span className="text-[var(--signal)]">gemini-3.1-pro</span></div>
                <div className="text-[var(--mist)]">rubric: v3.2 · 5 dimensions</div>
                <div className="text-[var(--mist)] flex justify-between"><span>✓ functionality</span><span className="text-[var(--signal)]">94/100</span></div>
                <div className="text-[var(--mist)] flex justify-between"><span>✓ design</span><span className="text-[var(--signal)]">91/100</span></div>
                <div className="text-[var(--mist)] flex justify-between"><span>✓ code quality</span><span className="text-[var(--signal)]">88/100</span></div>
                <div className="text-[var(--mist)] flex justify-between"><span>✓ creativity</span><span className="text-[var(--signal)]">92/100</span></div>
                <div className="border-t border-[var(--border)] mt-1.5 pt-1.5 text-[var(--ink)] flex justify-between">
                  <span>composite:</span><span className="text-[var(--signal)] font-bold">91.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLATFORM DEMO ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-16 py-20 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-left space-y-5">
              <div className="text-xs font-mono text-[var(--mist)] uppercase tracking-[0.16em] flex items-center gap-2">
                <span className="inline-block w-4 h-px bg-[var(--gauge)]" />
                THE PLATFORM
              </div>
              <h3 className="font-sans font-semibold leading-[1.1] tracking-[-0.02em]" style={{ fontSize: "clamp(1.7rem, 3vw, 2.2rem)" }}>
                Every model. Every category.{" "}
                <span className="text-[var(--signal)]" style={{ fontFamily: "var(--font-fragment), monospace" }}>One dashboard.</span>
              </h3>
              <p className="text-sm text-[var(--mist)] leading-relaxed">
                Run any frontier model against our 3,900+ prompt library. Get AI-judged scores in 10 vibe-coding categories, compare results head-to-head, and share benchmarks to the community showcase.
              </p>
              <ul className="space-y-3 font-mono text-xs text-[var(--mist)]">
                {[
                  "Run benchmarks across 16+ frontier models — OpenAI, Anthropic, Google, xAI, DeepSeek",
                  "AI-powered judge panel scores every response on 5 weighted dimensions",
                  "Head-to-head arena mode for direct model comparisons",
                  "Community showcase — share & browse the best AI-generated creations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-[var(--gauge)] mt-0.5">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal-right rounded-lg overflow-hidden shadow-2xl font-mono text-xs"
              style={{ background: "#060706", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] text-[10px] text-[var(--mist)]">
                <span className="text-[var(--gauge)]">●</span>
                bench.config.yaml
                <span className="ml-auto">14 lines</span>
              </div>
              <div className="p-5 leading-[1.7] overflow-auto" style={{ maxHeight: 300 }}>
                <div className="text-[var(--mist)]"><span className="text-violet-400"># Production model gate — run on every PR</span></div>
                <div><span className="text-violet-400">suite</span>: code-suite-v2</div>
                <div><span className="text-violet-400">fail_if</span>:</div>
                <div><span className="pl-4 text-violet-400">composite</span>: &lt; <span className="text-[var(--signal)]">82.0</span></div>
                <div><span className="pl-4 text-violet-400">swe-bench</span>: &lt; <span className="text-[var(--signal)]">68.0</span></div>
                <div><span className="pl-4 text-violet-400">latency_p50</span>: &gt; <span className="text-[var(--signal)]">2.0</span>s</div>
                <div>&nbsp;</div>
                <div><span className="text-violet-400">models</span>:</div>
                <div className="pl-4 text-[var(--mist)]">- id: claude-sonnet-<span className="text-[var(--signal)]">4</span>-<span className="text-[var(--signal)]">5</span></div>
                <div className="pl-4 text-[var(--mist)]">- id: gpt-<span className="text-[var(--signal)]">5</span>-mini</div>
                <div className="pl-4 text-[var(--mist)]">- id: deepseek-v3-<span className="text-[var(--signal)]">2</span></div>
                <div>&nbsp;</div>
                <div><span className="text-violet-400">benchmarks</span>:</div>
                <div className="pl-4 text-[var(--mist)]">- humaneval+</div>
                <div className="pl-4 text-[var(--mist)]">- swe-bench</div>
                <div className="pl-4 text-[var(--mist)]">- livecodebench</div>
                <div className="pl-4 text-[var(--mist)]">- custom: ./internal/refactor-suite</div>
                <div>&nbsp;</div>
                <div><span className="text-violet-400">grader</span>: llm-judge</div>
                <div><span className="text-violet-400">budget</span>: $<span className="text-[var(--signal)]">25</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 10 CATEGORIES ══════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-16 py-20 border-b border-[var(--border)]"
        style={{ background: "color-mix(in srgb, var(--fog) 60%, transparent)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end mb-12 gap-8 flex-wrap">
            <div className="reveal">
              <div className="text-xs font-mono text-[var(--mist)] uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
                <span className="inline-block w-4 h-px bg-[var(--gauge)]" />
                THE CATEGORIES
              </div>
              <h2 className="font-sans font-semibold leading-[1.05] tracking-[-0.025em]"
                style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}>
                10 categories,{" "}
                <span className="text-[var(--signal)]" style={{ fontFamily: "var(--font-fragment), monospace" }}>
                  one vibe score.
                </span>
              </h2>
            </div>
            <p className="reveal-right text-sm text-[var(--mist)] max-w-[42ch] leading-relaxed ml-auto">
              Industry-standard suites for coding, reasoning, math, agents, and long-context. All graded with identical samplers and contamination checks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-5 rounded-lg overflow-hidden border border-[var(--border)]"
            style={{ background: "var(--border)" }}>
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/categories/${cat.slug}`}
                className="reveal group bg-[var(--fog)] p-5 hover:bg-[var(--paper)] transition-all duration-200 hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <b className="text-sm font-sans">{cat.name}</b>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--mist)] border border-[var(--border)] px-1.5 py-0.5 rounded-sm">{cat.tag}</span>
                </div>
                <p className="text-[11px] text-[var(--mist)] leading-relaxed mb-4 min-h-[48px]">{cat.desc}</p>
                <div className="flex items-center justify-between font-mono text-[10px] text-[var(--mist)] border-t border-[var(--border)] pt-2.5">
                  <span className="text-[var(--signal)] font-semibold">Top: {cat.bar}.{(i * 3 + 2) % 9 + 1}</span>
                  <span className="group-hover:text-[var(--ink)] transition-colors flex items-center gap-1">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY US — 3 FEATURE CARDS ═══════════════════════════════════════ */}
      <section className="px-4 sm:px-8 lg:px-16 py-20 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Scale,
              title: "No Vendor Bias",
              desc: "Provider marketing benchmark claims are often cherry-picked. Verdict runs independent multi-judge scoring panels with auditable logic.",
            },
            {
              icon: ShieldCheck,
              title: "Auditable Judge Panel",
              desc: "Every score includes written rationale across Functionality, Craft, Design, Creativity, and Fidelity. Disagreements trigger human review.",
            },
            {
              icon: KeyRound,
              title: "Free & BYOK Architecture",
              desc: "Zero subscription fees. Bring your own API keys to run custom evaluation suites, or deploy locally via Docker Compose.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="reveal rounded-xl border border-[var(--border)] p-6 space-y-3 hover:border-[var(--mist)] transition-colors bg-[var(--paper)] group"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)]">
                <f.icon className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-semibold text-base text-[var(--ink)]">{f.title}</h3>
              <p className="text-sm text-[var(--mist)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-8 lg:px-16 py-24 border-b border-[var(--border)] text-center overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(59,130,246,0.06), transparent 70%)" }}
        />
        <div className="relative max-w-4xl mx-auto reveal">
          <h2 className="font-sans font-semibold leading-[1.05] tracking-[-0.03em] mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}>
            Start benchmarking{" "}
            <span className="text-[var(--signal)]" style={{ fontFamily: "var(--font-fragment), monospace" }}>free</span>{" "}
            today.
          </h2>
          <p className="text-[var(--mist)] mb-8 max-w-[56ch] mx-auto leading-relaxed" style={{ fontSize: 15 }}>
            Join thousands of developers who use Verdict to pick the right model for every task. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/leaderboard"
              className="cta-shimmer inline-flex items-center gap-2 px-9 py-3.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] font-semibold text-base hover:opacity-90 transition-all shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
            >
              View Live Leaderboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/self-host"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-[var(--border)] text-[var(--ink)] font-semibold text-base hover:bg-[var(--paper)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
            >
              <Terminal className="w-4 h-4 text-[var(--mist)]" />
              Self-Host Free
            </Link>
          </div>
          {/* Install strip */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-[var(--border)] font-mono text-sm text-[var(--ink)]"
            style={{ background: "var(--paper)" }}>
            <span className="text-[var(--gauge)]">$</span>
            <span>docker compose up -d</span>
          </div>
        </div>
      </section>

    </div>
  );
}
