"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RunLauncher from "@/components/dashboard/run-launcher";
import { Cpu, Play, KeyRound, ChevronRight, RefreshCw } from "lucide-react";

interface RunItem {
  id: string;
  model: string;
  modelSlug: string;
  provider: string;
  status: string;
  costActual: string;
  completedAt: string;
  score: number;
}

/** Converts a raw DB ID (e.g. "cm5x9kpabcd12") to a readable short ID like "RUN-BCD12" */
function formatRunId(id: string): string {
  return `RUN-${id.slice(-6).toUpperCase()}`;
}

export default function DashboardPage() {
  const [showLauncher, setShowLauncher] = useState(false);
  const [runs, setRuns] = useState<RunItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRuns = () => {
    setLoading(true);
    fetch("/api/runs")
      .then((res) => res.json())
      .then((data) => {
        if (data.runs) setRuns(data.runs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
            <Cpu className="w-4 h-4" />
            <span>Workspace Dashboard</span>
          </div>
          {/* BYOK Settings — fixed to rounded-lg */}
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--fog)] border border-[var(--border)] text-xs font-sans font-semibold text-[var(--ink)] hover:bg-[var(--paper)] hover:border-[var(--signal)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
          >
            <KeyRound className="w-3.5 h-3.5 text-[var(--gauge)]" />
            <span>BYOK API Keys</span>
          </Link>
        </div>
        {/* Page h1 — font-sans font-semibold, no more font-black */}
        <h1 className="font-sans font-semibold text-2xl sm:text-3xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          Benchmark Execution Control
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl leading-relaxed">
          Trigger new evaluation runs, monitor live streaming terminal logs, manage your encrypted BYOK API keys, and download detailed judge reports.
        </p>
      </div>

      {/* Launch Card */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Sub-section heading — font-sans, not font-display */}
            <h2 className="font-sans font-semibold text-lg text-[var(--ink)] -tracking-[0.01em]">
              Launch Custom Benchmark Run
            </h2>
            <p className="text-sm text-[var(--mist)] mt-1">
              Select model targets and category scopes to execute using your BYOK API keys.
            </p>
          </div>
          {/* Primary CTA — consistent ink/paper + rounded-lg */}
          <button
            onClick={() => setShowLauncher(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] text-sm font-semibold hover:opacity-90 transition-all shadow-xs active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2 shrink-0"
          >
            <Play className="w-4 h-4" />
            <span>Start New Run</span>
          </button>
        </div>
      </div>

      {/* Recent Runs Table */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--fog)] flex items-center justify-between">
          <span className="text-xs font-sans font-semibold text-[var(--ink)] tracking-tight">
            Recent Benchmark Executions ({runs.length})
          </span>
          <button
            onClick={fetchRuns}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--signal)] hover:underline disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--signal)] rounded"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {loading && runs.length === 0 ? (
            /* Skeleton loading state */
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-md bg-[var(--border)] animate-pulse" />
                  <div className="h-2.5 w-40 rounded-md bg-[var(--border)] animate-pulse" />
                  <div className="h-2 w-32 rounded-md bg-[var(--border)] animate-pulse" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-3 w-16 rounded-md bg-[var(--border)] animate-pulse" />
                  <div className="h-3 w-12 rounded-md bg-[var(--border)] animate-pulse" />
                  <div className="h-3 w-16 rounded-md bg-[var(--border)] animate-pulse" />
                </div>
              </div>
            ))
          ) : runs.length === 0 ? (
            <div className="p-10 text-center text-sm font-sans text-[var(--mist)]">
              No benchmark runs recorded yet.{" "}
              <button
                onClick={() => setShowLauncher(true)}
                className="text-[var(--signal)] font-semibold hover:underline"
              >
                Start your first run
              </button>
            </div>
          ) : (
            runs.map((run) => (
              <div
                key={run.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--fog)]/50 transition-colors"
              >
                <div className="space-y-1">
                  {/* Human-readable run ID instead of raw UUID */}
                  <div className="font-mono font-semibold text-sm text-[var(--ink)]">
                    {formatRunId(run.id)}
                  </div>
                  {/* Model info in sans-serif, not monospace */}
                  <div className="font-sans text-xs text-[var(--mist)]">
                    {run.model} — {run.provider}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--mist)]">
                    {run.completedAt} · Status:{" "}
                    <span className="text-[var(--pass)] font-bold">{run.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-xs">
                    <span className="text-[var(--mist)] font-sans">Cost </span>
                    <span className="font-mono font-semibold text-[var(--ink)]">{run.costActual}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-[var(--mist)] font-sans">Score </span>
                    <span className="font-mono font-bold text-[var(--gauge)]">{run.score}</span>
                  </div>
                  <Link
                    href={`/dashboard/runs/${run.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--signal)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--signal)] rounded"
                  >
                    <span>View Log</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showLauncher && (
        <RunLauncher
          onClose={() => {
            setShowLauncher(false);
            fetchRuns();
          }}
        />
      )}
    </div>
  );
}
