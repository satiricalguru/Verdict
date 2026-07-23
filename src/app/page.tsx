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
  CheckCircle2,
  Play,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 py-4">
      {/* WOAIBENCH HERO SECTION */}
      <section className="relative rounded-2xl bg-[#090b10] border border-zinc-800 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden text-white">
        {/* Subtle Grid Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: WoAIBench Title & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>new · Live HTML Preview Rendering Evals active</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
              The World&apos;s #1{" "}
              <span className="text-amber-400 underline decoration-amber-400/40 decoration-wavy underline-offset-8">
                Vibe Coding
              </span>{" "}
              Benchmark
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed font-sans">
              We built the premier evaluation platform for AI models. 100+ frontier models, head-to-head scoring, and an auditable AI judge panel that grades it all. No vendor hype. Just raw, real results.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition-all shadow-lg active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/self-host"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-zinc-900/90 text-zinc-200 font-semibold text-sm border border-zinc-700 hover:border-zinc-500 transition-all"
              >
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Run It Yourself (Docker)</span>
              </Link>
            </div>

            {/* Bottom Hero Stats Bar */}
            <div className="pt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">4,400+</span>
                <span>prompts judged</span>
              </div>
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">100+</span>
                <span>frontier models benchmarked</span>
              </div>
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">10</span>
                <span>vibe coding categories</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Mockup Window */}
          <div className="lg:col-span-5">
            <div className="w-full rounded-xl bg-[#0d0f17] border border-zinc-800 shadow-2xl font-mono text-xs overflow-hidden">
              {/* Window Titlebar */}
              <div className="px-4 py-2.5 bg-[#141724] border-b border-zinc-800 flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-zinc-500">~/projects/acme</span>
                </div>
                <span className="text-zinc-500">World of AI Bench v0.9.3</span>
              </div>

              {/* Terminal Code Content */}
              <div className="p-4 space-y-1.5 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto max-h-[380px]">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span>$ bench run --model claude-opus-4-5 --suite full</span>
                </div>
                <div className="text-blue-400">
                  ↪ resolved 14 benchmarks · 18,540 graded samples
                </div>
                <div className="text-blue-400">
                  ↪ concurrency=64 · est. cost $42.18 · est. time 14m
                </div>
                <div className="text-emerald-400 flex items-center gap-1">
                  <span>✓ authenticated</span>
                  <span className="text-zinc-500">· org acme · cluster us-east-2</span>
                </div>
                <div className="text-zinc-500 pl-3">spawning 64 workers...</div>

                <div className="pt-1 text-zinc-300 flex justify-between border-t border-zinc-800/60">
                  <span>✓ mmlu-pro</span>
                  <span className="text-zinc-500">12,032 / 12,032</span>
                  <span className="text-amber-400 font-bold">88.4</span>
                </div>
                <div className="flex justify-between">
                  <span>✓ humaneval+</span>
                  <span className="text-zinc-500">164 / 164</span>
                  <span className="text-amber-400 font-bold">92.7</span>
                </div>
                <div className="flex justify-between">
                  <span>✓ swe-bench</span>
                  <span className="text-zinc-500">500 / 500</span>
                  <span className="text-amber-400 font-bold">71.2</span>
                </div>
                <div className="flex justify-between text-amber-400/90">
                  <span>! aime-2025</span>
                  <span className="text-zinc-500">30 / 30</span>
                  <span className="text-amber-400">retried 2 timeouts</span>
                </div>
                <div className="flex justify-between">
                  <span>✓ aime-2025</span>
                  <span className="text-zinc-500">30 / 30</span>
                  <span className="text-amber-400 font-bold">76.1</span>
                </div>
                <div className="flex justify-between">
                  <span>✓ gpqa</span>
                  <span className="text-zinc-500">198 / 198</span>
                  <span className="text-amber-400 font-bold">64.8</span>
                </div>
                <div className="flex justify-between">
                  <span>✓ tau-bench</span>
                  <span className="text-zinc-500">500 / 500</span>
                  <span className="text-amber-400 font-bold">60.5</span>
                </div>

                <div className="pt-1 text-purple-400">
                  ↪ 3 disagreements flagged for human review
                </div>
                <div className="text-emerald-400 font-bold">
                  ✓ run complete · 14/14 benchmarks · composite 79.4
                </div>
                <div className="text-blue-400">
                  ↪ report saved to runs/run_a7f2c.json
                </div>
                <div className="pt-1 text-amber-400 flex items-center">
                  <span>$ </span>
                  <span className="ml-1 w-2 h-4 bg-amber-400 inline-block animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOTA INSTRUMENT CLUSTER (SOTA Scoreboard & Dial) */}
      <section className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--signal)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gauge)]" />
              <span>Verified Rank #1 SOTA Model</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[var(--ink)]">
              Claude Fable 5 (Anthropic)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mist)] max-w-xl">
              Leading composite scores across SWE-bench Verified (95.0%), LMArena (1505 Elo), and zero-shot HTML rendering evals.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Scoreboard
              value={98.4}
              decimals={1}
              label="Verdict Composite Score"
              size="md"
              suffix="/100"
            />
            <div className="hidden sm:block">
              <VerdictDial score={98.4} size="md" minScore={80} maxScore={100} />
            </div>
          </div>
        </div>
      </section>

      {/* AMBIENT RECENT RUNS TICKER */}
      <section className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-3 px-4 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 mr-4">
          <span className="px-2 py-0.5 rounded bg-[var(--signal)]/10 text-[var(--signal)] font-mono text-xs font-bold uppercase tracking-wider">
            Live Stream
          </span>
        </div>
        <div className="flex-1 overflow-x-auto whitespace-nowrap text-xs font-mono text-[var(--mist)] flex gap-8">
          <span className="inline-flex items-center gap-2">
            <span className="text-[var(--ink)] font-semibold">Claude Fable 5</span> scored{" "}
            <span className="text-[var(--gauge)] font-bold">98.4</span> (LMArena 1505 Elo)
          </span>
          <span className="text-[var(--border)]">|</span>
          <span className="inline-flex items-center gap-2">
            <span className="text-[var(--ink)] font-semibold">GPT-5.6 Sol</span> scored{" "}
            <span className="text-[var(--gauge)] font-bold">96.2%</span> on SWE-bench Verified
          </span>
          <span className="text-[var(--border)]">|</span>
          <span className="inline-flex items-center gap-2">
            <span className="text-[var(--ink)] font-semibold">Claude Mythos 5</span> scored{" "}
            <span className="text-[var(--gauge)] font-bold">64.5%</span> on HLE Exam
          </span>
          <span className="text-[var(--border)]">|</span>
          <span className="inline-flex items-center gap-2">
            <span className="text-[var(--ink)] font-semibold">DeepSeek V4 Pro</span> scored{" "}
            <span className="text-[var(--gauge)] font-bold">80.6%</span> SWE Verified ($0.87/1M)
          </span>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4 hover:border-[var(--signal)] transition-colors group">
          <div className="w-10 h-10 rounded bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center text-[var(--signal)] group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--ink)]">
            No Vendor Homework Grading
          </h3>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            Provider marketing claims are often cherry-picked. Verdict runs independent evaluations using a multi-model judge panel so no model provider grades its own output.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4 hover:border-[var(--signal)] transition-colors group">
          <div className="w-10 h-10 rounded bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center text-[var(--gauge)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--ink)]">
            Auditable Judge Reasoning
          </h3>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            Every score traces back to written judge rationale across 5 dimensions: Functionality, Craft, Design, Creativity, and Fidelity. Disagreements trigger human review.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4 hover:border-[var(--signal)] transition-colors group">
          <div className="w-10 h-10 rounded bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center text-[var(--signal)] group-hover:scale-105 transition-transform">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-[var(--ink)]">
            Free & Dual-Mode (BYOK)
          </h3>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            Zero subscription fees. Bring your own API keys to run custom benchmarks on the hosted app, or run `docker compose up` for a 100% private local instance.
          </p>
        </div>
      </section>

      {/* LAUNCH PROMPT CATEGORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-[var(--ink)]">
              Launch Category Scope
            </h2>
            <p className="text-sm text-[var(--mist)] mt-1">
              Real-world tasks designed to evaluate code generation, styling, and multi-step reasoning.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-mono font-semibold text-[var(--signal)] hover:underline flex items-center gap-1"
          >
            <span>View All 10 Categories</span>
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
              className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-[var(--fog)] text-[var(--signal)] border border-[var(--border)]">
                    {cat.tag}
                  </span>
                  <cat.icon className="w-4 h-4 text-[var(--mist)]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--mist)] mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border)]">
                <Link
                  href={`/categories/${cat.name.toLowerCase().replace(" ", "-")}`}
                  className="text-xs font-mono text-[var(--ink)] hover:text-[var(--signal)] font-semibold flex items-center justify-between"
                >
                  <span>Explore category</span>
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
            <span className="px-2.5 py-1 rounded bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--gauge)]">
              Single-Command Deployment
            </span>
            <h2 className="font-display font-bold text-3xl text-[var(--ink)]">
              Deploy Verdict on your own infrastructure.
            </h2>
            <p className="text-sm text-[var(--mist)] leading-relaxed">
              Keep your evaluation data, custom model benchmarks, and internal prompts 100% private. Run the web frontend, Python execution engine, Celery worker queue, Redis, and Postgres in one container stack.
            </p>
            <div className="pt-2">
              <Link
                href="/self-host"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--ink)] text-[var(--paper)] text-sm font-semibold hover:bg-[var(--signal)] transition-colors"
              >
                <Terminal className="w-4 h-4" />
                <span>Read Docker Compose Guide</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[var(--fog)] border border-[var(--border)] rounded-lg p-4 font-mono text-xs text-[var(--ink)] space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-[var(--mist)]">
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
    image: redis:7-alpine
  db:
    image: postgres:16-alpine`}
            </pre>
            <div className="pt-2 text-[var(--signal)] font-bold">
              $ docker compose up -d
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
