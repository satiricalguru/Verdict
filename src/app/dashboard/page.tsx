"use client";

import React, { useState } from "react";
import Link from "next/link";
import RunLauncher from "@/components/dashboard/run-launcher";
import { Cpu, Play, KeyRound, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const [showLauncher, setShowLauncher] = useState(false);

  const recentRuns = [
    {
      id: "run-9842",
      model: "Nova-1",
      categories: ["Frontend UI", "Game Dev"],
      status: "complete",
      costActual: "$0.42",
      completedAt: "10 mins ago",
      score: 86.5,
    },
    {
      id: "run-9841",
      model: "Halcyon-2",
      categories: ["SVG Art"],
      status: "complete",
      costActual: "$0.18",
      completedAt: "1 hour ago",
      score: 83.5,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
            <Cpu className="w-4 h-4" />
            <span>Workspace Dashboard</span>
          </div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--fog)] border border-[var(--border)] text-xs font-mono font-semibold text-[var(--ink)] hover:border-[var(--signal)]"
          >
            <KeyRound className="w-3.5 h-3.5 text-[var(--gauge)]" />
            <span>BYOK API Keys</span>
          </Link>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
          Benchmark Execution Control
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Trigger new evaluation runs, monitor live streaming terminal logs, manage your encrypted BYOK API keys, and download detailed judge reports.
        </p>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[var(--ink)]">
              Launch Custom Benchmark Run
            </h2>
            <p className="text-xs text-[var(--mist)] mt-1">
              Select model targets and category scopes to execute using your BYOK API keys.
            </p>
          </div>
          <button
            onClick={() => setShowLauncher(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--signal)] text-white text-sm font-semibold hover:bg-[var(--signal-hover)] transition-all shadow-sm active:scale-95"
          >
            <Play className="w-4 h-4" />
            <span>Start New Run</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--fog)] flex items-center justify-between font-mono text-xs text-[var(--mist)]">
          <span className="font-bold text-[var(--ink)] uppercase tracking-wider">
            Recent Benchmark Runs
          </span>
          <span>Showing last 2 executions</span>
        </div>

        <div className="divide-y divide-[var(--border)] font-mono text-xs">
          {recentRuns.map((run) => (
            <div
              key={run.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--fog)]/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                  <span>{run.id}</span>
                  <span className="text-xs font-normal text-[var(--mist)]">
                    ({run.model})
                  </span>
                </div>
                <div className="text-[var(--mist)]">
                  Categories: {run.categories.join(", ")}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[var(--mist)]">Actual Cost: </span>
                  <span className="font-bold text-[var(--ink)]">{run.costActual}</span>
                </div>
                <div>
                  <span className="text-[var(--mist)]">Score: </span>
                  <span className="font-bold text-[var(--gauge)]">{run.score}</span>
                </div>
                <Link
                  href={`/dashboard/runs/${run.id}`}
                  className="inline-flex items-center gap-1 text-[var(--signal)] font-semibold hover:underline"
                >
                  <span>Live Log</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLauncher && <RunLauncher onClose={() => setShowLauncher(false)} />}
    </div>
  );
}
