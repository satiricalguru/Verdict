import React from "react";
import { Terminal, Shield, KeyRound, Cpu } from "lucide-react";

export default function SelfHostPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <Terminal className="w-4 h-4" />
          <span>Self-Hosting Architecture</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          Self-Host Verdict via Docker Compose
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Deploy a 100% private, self-contained Verdict benchmark stack using Docker Compose. Your model evaluations, custom test suites, and BYOK API keys remain entirely under your control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-5 space-y-2">
          <div className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--pass)]" />
            <span>100% Data Privacy</span>
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            No telemetry, tracking, or logs sent to external servers. Your evaluation results stay inside your local database.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-5 space-y-2">
          <div className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[var(--gauge)]" />
            <span>Private BYOK Key Storage</span>
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            Store model API keys encrypted at rest using local pgcrypto database keys. Keys are only used to trigger your runs.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-5 space-y-2">
          <div className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[var(--signal)]" />
            <span>Single-Command Up</span>
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            All 5 services (Next.js web, FastAPI engine, Celery worker, Redis, Postgres) pre-wired in one `docker-compose.yml` file.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="font-sans font-semibold text-xl text-[var(--ink)]">
            Docker Compose Quickstart
          </h2>
          <span className="text-xs font-mono text-[var(--mist)]">
            Single file deployment
          </span>
        </div>

        <div className="rounded-lg bg-[var(--fog)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--ink)] space-y-3 overflow-x-auto">
          <div className="text-[var(--mist)] font-bold"># 1. Clone the open source repository</div>
          <div className="text-[var(--signal)]">$ git clone https://github.com/verdict-ai/verdict.git && cd verdict</div>

          <div className="text-[var(--mist)] font-bold pt-2"># 2. Start the local benchmark stack</div>
          <div className="text-[var(--signal)]">$ docker compose up -d</div>

          <div className="text-[var(--mist)] font-bold pt-2"># 3. Access local dashboard</div>
          <div className="text-[var(--pass)]">Open http://localhost:3000 in your browser</div>
        </div>
      </div>
    </div>
  );
}
