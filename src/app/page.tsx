import React from "react";
import Link from "next/link";
import Scoreboard from "@/components/ui/scoreboard";
import VerdictDial from "@/components/ui/verdict-dial";
import {
  ShieldCheck,
  Scale,
  KeyRound,
  Terminal,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Play,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8 py-4">
      {/* HERO SECTION */}
      <section className="relative rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 sm:p-12 lg:p-14 shadow-xs overflow-hidden text-[var(--ink)] transition-colors">
        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Title, Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--mist)]">
              <span className="w-2 h-2 rounded-full bg-[var(--pass)]" />
              <span className="font-semibold text-[var(--ink)]">v2026.07</span>
              <span>· Live Render &amp; Multi-Judge Evals Active</span>
            </div>

            <h1 className="font-sans font-semibold text-4xl sm:text-5xl lg:text-6xl -tracking-[0.03em] text-[var(--ink)] leading-[1.1]">
              The Independent{" "}
              <span className="text-[var(--signal)]">AI Coding</span> Benchmark
            </h1>

            <p className="text-base sm:text-lg text-[var(--mist)] max-w-2xl leading-relaxed font-sans font-normal">
              An auditable, multi-model evaluation framework built for real software engineering tasks. 100+ frontier models scored on code execution, craft, design, and reasoning. Zero provider bias.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--ink)] text-[var(--paper)] font-semibold text-sm hover:opacity-90 transition-all shadow-xs active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2"
              >
                <span>Explore Public Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/self-host"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--paper)] text-[var(--ink)] font-semibold text-sm border border-[var(--border)] hover:bg-[var(--fog)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2"
              >
                <Terminal className="w-4 h-4 text-[var(--mist)]" />
                <span>Run Self-Hosted (Docker)</span>
              </Link>
            </div>

            {/* Bottom Hero Stats */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-[var(--mist)] border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--ink)] font-bold">4,400+</span>
                <span>prompts graded</span>
              </div>
              <span className="text-[var(--border)]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--ink)] font-bold">100+</span>
                <span>frontier models</span>
              </div>
              <span className="text-[var(--border)]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--ink)] font-bold">10</span>
                <span>eval categories</span>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Window */}
          <div className="lg:col-span-5">
            <div className="w-full rounded-xl bg-[var(--paper)] border border-[var(--border)] shadow-xl font-mono text-xs overflow-hidden">
              {/* macOS Chrome Dots — authentic traffic lights */}
              <div className="px-4 py-3 bg-[var(--fog)] border-b border-[var(--border)] flex items-center justify-between text-[var(--mist)] text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
                  <span className="ml-2 font-medium text-[var(--ink)]">verdict-eval-runner</span>
                </div>
                <span>v0.9.3</span>
              </div>

              <div className="p-4 space-y-2 text-[11px] leading-relaxed text-[var(--ink)] overflow-x-auto max-h-[360px]">
                <div className="text-[var(--signal)] font-semibold">
                  $ verdict run --suite full --model claude-3-7-sonnet
                </div>
                <div className="text-[var(--mist)]">
                  ↪ 14 benchmark targets · 18,540 samples queued
                </div>
                <div className="text-[var(--pass)] font-semibold flex items-center gap-1">
                  <span>✓ Multi-judge panel initialized</span>
                </div>
                <div className="text-[var(--mist)] pl-3">running concurrency=64...</div>

                <div className="pt-2 text-[var(--ink)] flex justify-between border-t border-[var(--border)]">
                  <span>✓ swe-bench-verified</span>
                  <span className="text-[var(--mist)]">500 / 500</span>
                  <span className="font-bold text-[var(--pass)]">92.4</span>
                </div>
                <div className="flex justify-between">
                  <span>✓ humaneval-plus</span>
                  <span className="text-[var(--mist)]">164 / 164</span>
                  <span className="font-bold text-[var(--pass)]">95.1</span>
                </div>
                <div className="flex justify-between">
                  <span>✓ vibe-frontend-ui</span>
                  <span className="text-[var(--mist)]">250 / 250</span>
                  <span className="font-bold text-[var(--pass)]">98.4</span>
                </div>
                <div className="flex justify-between text-[var(--mist)]">
                  <span>✓ agentic-refactor</span>
                  <span className="text-[var(--mist)]">120 / 120</span>
                  <span className="font-bold text-[var(--ink)]">86.2</span>
                </div>

                <div className="pt-2 text-[var(--pass)] font-semibold border-t border-[var(--border)]">
                  ✓ Run complete · composite score 94.2/100
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOTA INSTRUMENT CLUSTER */}
      <section className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--signal)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gauge)]" />
              <span>Rank #1 Verified Model</span>
            </div>
            <h2 className="font-sans font-semibold text-2xl sm:text-3xl text-[var(--ink)] -tracking-[0.02em]">
              Claude Fable 5 (Anthropic)
            </h2>
            <p className="text-sm text-[var(--mist)] max-w-xl leading-relaxed">
              Top composite performance across SWE-bench Verified (95.0%), LMArena (1505 Elo), and live HTML rendering evals.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Scoreboard
              value={98.4}
              decimals={1}
              label="Verdict Score"
              size="md"
              suffix="/100"
            />
            <div className="hidden sm:block">
              <VerdictDial score={98.4} size="md" minScore={80} maxScore={100} />
            </div>
          </div>
        </div>
      </section>

      {/* LIVE RESULTS TICKER — animated marquee */}
      <section
        aria-label="Live benchmark results feed"
        aria-live="polite"
        className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-3 px-4 flex items-center overflow-hidden text-xs font-mono"
      >
        <div className="flex items-center gap-2 shrink-0 mr-4">
          <span className="px-2 py-0.5 rounded-lg bg-[var(--fog)] border border-[var(--border)] text-[var(--ink)] font-bold text-[10px] uppercase tracking-tight">
            Live
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-8 animate-[ticker_25s_linear_infinite] w-max">
            {[
              { model: "Claude Fable 5", score: "98.4", suffix: "" },
              { model: "GPT-5.6 Sol", score: "96.2%", suffix: " on SWE Verified" },
              { model: "DeepSeek V4 Pro", score: "80.6%", suffix: " ($0.87/1M)" },
              { model: "Gemini 3.6 Flash", score: "210 t/s", suffix: " throughput" },
              { model: "Llama 4 Scout", score: "2M ctx", suffix: " window" },
              // Duplicate for seamless loop
              { model: "Claude Fable 5", score: "98.4", suffix: "" },
              { model: "GPT-5.6 Sol", score: "96.2%", suffix: " on SWE Verified" },
              { model: "DeepSeek V4 Pro", score: "80.6%", suffix: " ($0.87/1M)" },
              { model: "Gemini 3.6 Flash", score: "210 t/s", suffix: " throughput" },
              { model: "Llama 4 Scout", score: "2M ctx", suffix: " window" },
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 whitespace-nowrap text-[var(--mist)]">
                <span className="text-[var(--ink)] font-semibold">{item.model}</span>
                <span>scored</span>
                <span className="text-[var(--pass)] font-bold">{item.score}</span>
                {item.suffix && <span>{item.suffix}</span>}
                <span className="text-[var(--border)] ml-4">|</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-3 hover:border-[var(--mist)] transition-colors group">
          <div className="w-9 h-9 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)]">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="font-sans font-semibold text-base text-[var(--ink)]">
            No Vendor Bias
          </h3>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            Provider marketing benchmark claims are often cherry-picked. Verdict runs independent multi-judge scoring panels with auditable logic.
          </p>
        </div>

        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-3 hover:border-[var(--mist)] transition-colors group">
          <div className="w-9 h-9 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-sans font-semibold text-base text-[var(--ink)]">
            Auditable Judge Panel
          </h3>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            Every score includes written rationale across Functionality, Craft, Design, Creativity, and Fidelity. Disagreements trigger human review.
          </p>
        </div>

        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-3 hover:border-[var(--mist)] transition-colors group">
          <div className="w-9 h-9 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center text-[var(--ink)]">
            <KeyRound className="w-4 h-4" />
          </div>
          <h3 className="font-sans font-semibold text-base text-[var(--ink)]">
            Free &amp; BYOK Architecture
          </h3>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            Zero subscription fees. Bring your own API keys to run custom evaluation suites, or deploy locally via Docker Compose.
          </p>
        </div>
      </section>

      {/* EVALUATION CATEGORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="font-sans font-semibold text-xl text-[var(--ink)] -tracking-[0.02em]">
              Evaluation Categories
            </h2>
            <p className="text-sm text-[var(--mist)] mt-0.5">
              Tasks designed to test code generation, styling, and multi-step reasoning.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-[var(--signal)] hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Frontend UI",
              tag: "Interactive",
              desc: "Landing pages, dashboards, forms, responsive CSS, accessible components.",
              icon: Layers,
            },
            {
              name: "Game Dev",
              tag: "Interactive",
              desc: "Canvas 2D physics, HTML5 platformers, retro space shooters, collision logic.",
              icon: Play,
            },
            {
              name: "SVG Art",
              tag: "Visual",
              desc: "Vector graphics, generative math illustrations, isometric landscapes, icons.",
              icon: Sparkles,
            },
            {
              name: "Agentic Tasks",
              tag: "Autonomous",
              desc: "Multi-step refactoring, execution planning, tool use, schema migrations.",
              icon: Cpu,
            },
          ].map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-5 space-y-3 flex flex-col justify-between hover:border-[var(--mist)] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)]">
                    {cat.tag}
                  </span>
                  <cat.icon className="w-4 h-4 text-[var(--mist)]" />
                </div>
                <h3 className="font-sans font-semibold text-base text-[var(--ink)]">
                  {cat.name}
                </h3>
                <p className="text-sm text-[var(--mist)] mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border)]">
                <Link
                  href={`/categories/${cat.name.toLowerCase().replace(" ", "-")}`}
                  className="text-xs text-[var(--ink)] hover:text-[var(--signal)] font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Explore benchmark</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOCKER SELF-HOST CTA */}
      <section className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="px-2.5 py-1 rounded-lg bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--ink)] font-semibold">
              Self-Hosted Docker Stack
            </span>
            <h2 className="font-sans font-semibold text-2xl sm:text-3xl text-[var(--ink)] -tracking-[0.02em]">
              Deploy Verdict on your infrastructure.
            </h2>
            <p className="text-sm text-[var(--mist)] leading-relaxed">
              Keep benchmark evaluation data, model prompts, and judge feedback 100% private. Run Next.js frontend, Python engine, Redis, and Postgres in one simple stack.
            </p>
            <div className="pt-2">
              <Link
                href="/self-host"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>View Docker Compose Guide</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[var(--fog)] border border-[var(--border)] rounded-xl p-4 font-mono text-xs text-[var(--ink)] space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-[var(--mist)] text-[11px]">
              <span>docker-compose.yml</span>
              <span>v1.0</span>
            </div>
            <pre className="text-[11px] leading-relaxed text-[var(--ink)]">
{`version: '3.8'
services:
  web:
    build: ./web
    ports: ["3000:3000"]
  engine:
    build: ./engine
  redis:
    image: redis:7-alpine`}
            </pre>
            <div className="pt-2 text-[var(--signal)] font-semibold">
              $ docker compose up -d
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
