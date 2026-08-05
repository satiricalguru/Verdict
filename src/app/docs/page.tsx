"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Scale,
  Lock,
  Terminal,
  Key,
  Cpu,
  Layers,
  FileCode,
  CheckCircle2,
  Zap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Server,
  HelpCircle,
  Copy,
  Check,
  Code2,
  Workflow,
  Sliders,
  Database,
} from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const navItems = [
    { id: "overview", label: "Overview & Quickstart", icon: <BookOpen className="w-4 h-4" /> },
    { id: "methodology", label: "Scoring Methodology", icon: <Scale className="w-4 h-4" /> },
    { id: "rubric", label: "Evaluation Rubric (5D)", icon: <Layers className="w-4 h-4" /> },
    { id: "api-reference", label: "REST API Reference", icon: <Terminal className="w-4 h-4" /> },
    { id: "byok", label: "BYOK & Security Setup", icon: <Key className="w-4 h-4" /> },
    { id: "engine", label: "Python Engine & CLI", icon: <Cpu className="w-4 h-4" /> },
    { id: "categories", label: "Benchmark Categories", icon: <FileCode className="w-4 h-4" /> },
    { id: "faq", label: "FAQ & Troubleshooting", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
      {/* HEADER BANNER */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
            <BookOpen className="w-4 h-4" />
            <span>Verdict Developer Documentation Portal v2.5</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--pass)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audited Specification &amp; Live API Docs</span>
          </div>
        </div>

        <h1 className="font-sans font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight leading-tight">
          Verdict AI Benchmark Documentation
        </h1>

        <p className="text-sm text-[var(--mist)] max-w-3xl leading-relaxed">
          Complete technical guide to Verdict&apos;s multi-judge evaluation framework, real-time Artificial Analysis market sync, BYOK key execution pipeline, and REST API routes.
        </p>
      </div>

      {/* DOCUMENTATION CONTENT GRID WITH STICKY SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-2">
          <div className="sticky top-20 rounded-xl bg-[var(--paper)] border border-[var(--border)] p-3 space-y-1 shadow-xs">
            <div className="text-[11px] font-mono font-bold uppercase text-[var(--mist)] px-3 py-2 border-b border-[var(--border)] mb-1">
              Table of Contents
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  activeSection === item.id
                    ? "bg-[var(--signal)]/10 text-[var(--signal)] border border-[var(--signal)]/20 font-bold"
                    : "text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--mist)] opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* MAIN DOCUMENTATION BODY */}
        <div className="lg:col-span-3 space-y-10">
          {/* SECTION 1: OVERVIEW & QUICKSTART */}
          <section id="overview" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Sparkles className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">1. Overview &amp; Quickstart</h2>
            </div>

            <p className="text-sm text-[var(--mist)] leading-relaxed">
              <strong>Verdict</strong> is an enterprise-grade AI evaluation platform designed to benchmark 500+ frontier AI models on real-world engineering tasks including full-stack code generation, interactive WebGL 3D graphics, agentic refactoring, and financial analytics dashboards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-1">
                <div className="font-bold text-[var(--signal)]">500+ Models</div>
                <div className="text-[11px] text-[var(--mist)]">Live synced from Artificial Analysis &amp; Chatbot Arena</div>
              </div>
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-1">
                <div className="font-bold text-[var(--pass)]">100 Benchmark Prompts</div>
                <div className="text-[11px] text-[var(--mist)]">10 high-level prompts per engineering category</div>
              </div>
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-1">
                <div className="font-bold text-[var(--gauge)]">3-Judge Consensus</div>
                <div className="text-[11px] text-[var(--mist)]">Audited multi-judge scoring with bias safeguards</div>
              </div>
            </div>

            <h3 className="text-base font-bold text-[var(--ink)] font-mono">Quickstart: Fetch Live Model Rankings (cURL)</h3>
            <div className="relative rounded-lg bg-[#0b0d14] p-4 text-xs font-mono text-[#e4e4e7] overflow-x-auto">
              <button
                onClick={() => copyToClipboard(`curl -X GET "http://localhost:3000/api/leaderboard?sort=composite"`, "quickstart")}
                className="absolute right-3 top-3 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Copy Command"
              >
                {copiedCode === "quickstart" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre><code>{`curl -X GET "http://localhost:3000/api/leaderboard?sort=composite"`}</code></pre>
            </div>
          </section>

          {/* SECTION 2: SCORING METHODOLOGY */}
          <section id="methodology" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Scale className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">2. Multi-Judge Scoring Methodology</h2>
            </div>

            <p className="text-sm text-[var(--mist)] leading-relaxed">
              To eliminate single-model bias, Verdict employs an audited panel of 3 independent frontier judge models (e.g., GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro) to grade every generated artifact.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-2">
                <h4 className="text-xs font-mono font-bold text-[var(--ink)] uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--pass)]" />
                  Self-Evaluation Prevention Protocol
                </h4>
                <p className="text-xs text-[var(--mist)] leading-relaxed">
                  A model candidate is strictly prohibited from evaluating its own generated output. If Candidate A is <code>Claude Opus 5</code>, Anthropic models are excluded from the judge panel for that run.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-2">
                <h4 className="text-xs font-mono font-bold text-[var(--ink)] uppercase flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--gauge)]" />
                  50% Held-Out Prompt Suite
                </h4>
                <p className="text-xs text-[var(--mist)] leading-relaxed">
                  To prevent model providers from overfitting, 50% of Verdict benchmark prompts remain private and held-out. Evaluation runs execute on a randomized blend of public and held-out test sets.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: EVALUATION RUBRIC (5D) */}
          <section id="rubric" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Layers className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">3. 5-Dimensional Rubric Weights</h2>
            </div>

            <p className="text-sm text-[var(--mist)] leading-relaxed">
              Judges score each evaluation sample on a scale from 0.0 to 100.0 across 5 weighted dimensions:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--ink)]">1. Functionality &amp; Execution</span>
                  <span className="block text-[11px] font-sans text-[var(--mist)]">Zero console errors, valid DOM render, working interactive controls</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[var(--signal)]/10 text-[var(--signal)] font-bold border border-[var(--signal)]/20">25% Weight</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--ink)]">2. Code Craft &amp; Type Safety</span>
                  <span className="block text-[11px] font-sans text-[var(--mist)]">Semantic HTML5, strict TypeScript types, modular architectural pattern</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[var(--signal)]/10 text-[var(--signal)] font-bold border border-[var(--signal)]/20">25% Weight</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--ink)]">3. Visual Design &amp; Aesthetics</span>
                  <span className="block text-[11px] font-sans text-[var(--mist)]">Modern dark-mode UI, curated HSL color palettes, responsive layouts</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[var(--pass)]/10 text-[var(--pass)] font-bold border border-[var(--pass)]/20">20% Weight</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--ink)]">4. Micro-Interactions &amp; Motion</span>
                  <span className="block text-[11px] font-sans text-[var(--mist)]">Canvas particle physics, spring transitions, hover feedback states</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[var(--gauge)]/10 text-[var(--gauge)] font-bold border border-[var(--gauge)]/20">15% Weight</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--ink)]">5. Prompt Fidelity</span>
                  <span className="block text-[11px] font-sans text-[var(--mist)]">Strict compliance with all multi-constraint technical requirements</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[var(--gauge)]/10 text-[var(--gauge)] font-bold border border-[var(--gauge)]/20">15% Weight</span>
              </div>
            </div>
          </section>

          {/* SECTION 4: REST API REFERENCE */}
          <section id="api-reference" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Terminal className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">4. REST API Endpoint Reference</h2>
            </div>

            <div className="space-y-6 font-mono text-xs">
              {/* GET /api/leaderboard */}
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold border border-green-500/20">GET /api/leaderboard</span>
                  <span className="text-[11px] text-[var(--mist)] font-sans">Fetch Leaderboard Models</span>
                </div>
                <p className="font-sans text-xs text-[var(--mist)]">Query parameters: <code>sort=composite|frontend|game|svg|agentic</code>, <code>openWeight=true|false</code>.</p>
              </div>

              {/* POST /api/models/sync */}
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">POST /api/models/sync</span>
                  <span className="text-[11px] text-[var(--mist)] font-sans">Auto-Sync Market Rankings</span>
                </div>
                <p className="font-sans text-xs text-[var(--mist)]">Fetches latest Artificial Analysis Quality Index, throughput speed, latency, and pricing data.</p>
              </div>

              {/* POST /api/runs */}
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">POST /api/runs</span>
                  <span className="text-[11px] text-[var(--mist)] font-sans">Launch Benchmark Run</span>
                </div>
                <div className="relative rounded bg-[#0b0d14] p-3 text-[#e4e4e7] overflow-x-auto">
                  <pre><code>{`// Payload body
{
  "modelId": "gemini-3-6-flash",
  "promptText": "Create a responsive HTML5 particle galaxy script.",
  "categories": ["frontend-ui"]
}`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: BYOK & SECURITY */}
          <section id="byok" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Key className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">5. BYOK (Bring Your Own Key) &amp; Security</h2>
            </div>

            <p className="text-sm text-[var(--mist)] leading-relaxed">
              Verdict supports full Bring Your Own Key (BYOK) execution. You can connect your private API keys for Google Gemini, OpenAI, Anthropic, OpenRouter, and DeepSeek.
            </p>

            <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-3 text-xs font-mono">
              <div className="font-bold text-[var(--ink)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--pass)]" />
                AES-256-GCM Encryption Architecture
              </div>
              <p className="text-[11px] text-[var(--mist)] font-sans leading-relaxed">
                All API keys saved in Settings are encrypted at rest using AES-256-GCM authenticated encryption. Keys are decrypted strictly in-memory during benchmark execution and never written to plain-text logs.
              </p>
            </div>
          </section>

          {/* SECTION 6: PYTHON ENGINE */}
          <section id="engine" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Cpu className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">6. Python Execution Engine &amp; CLI Gating</h2>
            </div>

            <p className="text-sm text-[var(--mist)] leading-relaxed">
              For local or CI/CD automated test runs, Verdict includes a Python benchmark runner service in <code>engine/</code>.
            </p>

            <div className="relative rounded-lg bg-[#0b0d14] p-4 text-xs font-mono text-[#e4e4e7] overflow-x-auto">
              <button
                onClick={() => copyToClipboard(`python3 engine/main.py --config verdict.config.yaml`, "engine-cmd")}
                className="absolute right-3 top-3 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Copy Command"
              >
                {copiedCode === "engine-cmd" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre><code>{`# Execute local engine benchmark suite
python3 engine/main.py --config verdict.config.yaml`}</code></pre>
            </div>
          </section>

          {/* SECTION 7: BENCHMARK CATEGORIES */}
          <section id="categories" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <FileCode className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">7. All 10 Benchmark Categories</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {[
                { name: "Frontend UI", desc: "10 prompts for dashboards, landing pages, & accessible components." },
                { name: "Game Dev", desc: "10 prompts for 2D platformers, tower defense, & canvas shooters." },
                { name: "SVG Art", desc: "10 prompts for cyberpunk skylines, sacred geometry, & vector art." },
                { name: "Agentic Tasks", desc: "10 prompts for schema migrations, tool executors, & dependency audits." },
                { name: "Creative Writing", desc: "10 prompts for architecture specs, post-mortems, & release notes." },
                { name: "3D Graphics", desc: "10 prompts for Three.js WebGL particles, PBR shaders, & solar systems." },
                { name: "Data Viz", desc: "10 prompts for D3 heatmaps, candlestick charts, & network graphs." },
                { name: "Animation", desc: "10 prompts for Framer Motion spring timelines & SVG morphing loaders." },
                { name: "Full-Stack", desc: "10 prompts for Next.js API routes, JWT auth, & Stripe webhooks." },
                { name: "Code Golf", desc: "10 prompts for minified matrix solvers, Sudoku algorithms, & JSON parsers." },
              ].map((cat, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-1">
                  <div className="font-bold text-[var(--ink)] flex items-center justify-between">
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono text-[var(--signal)]">10 Prompts</span>
                  </div>
                  <div className="text-[11px] text-[var(--mist)]">{cat.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 8: FAQ & TROUBLESHOOTING */}
          <section id="faq" className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <HelpCircle className="w-5 h-5 text-[var(--signal)]" />
              <h2 className="text-xl font-bold text-[var(--ink)] tracking-tight">8. FAQ &amp; Troubleshooting</h2>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-2">
                <h4 className="font-bold text-[var(--ink)]">Q: How frequently are market rankings updated?</h4>
                <p className="text-[11px] text-[var(--mist)] leading-relaxed">
                  Rankings auto-sync every 1 hour from artificialanalysis.ai. You can also trigger an instant manual update using the <strong>Auto-Sync Now</strong> button on the Leaderboard.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-2">
                <h4 className="font-bold text-[var(--ink)]">Q: What happens if an API key request times out?</h4>
                <p className="text-[11px] text-[var(--mist)] leading-relaxed">
                  Verdict automatically retries API calls up to 3 times with exponential backoff before falling back to the sandboxed runtime inspector.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
