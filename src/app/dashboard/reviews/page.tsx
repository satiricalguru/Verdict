import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function HumanReviewQueuePage() {
  const flaggedSamples = [
    {
      id: "sample-302",
      promptTitle: "Multi-File Refactoring Plan",
      model: "Nova-1",
      judgeScores: [
        { model: "GPT-4o", score: 92 },
        { model: "Claude-3.5-Sonnet", score: 68 },
        { model: "Gemini-1.5-Pro", score: 85 },
      ],
      disagreementDelta: 24,
      status: "pending_review",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--mist)] hover:text-[var(--signal)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--gauge)]">
          <ShieldAlert className="w-4 h-4" />
          <span>Auditable Quality Control</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
          Human Review Disagreement Queue
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          When judge model scores disagree beyond a set delta threshold (&gt;15 points), samples are flagged here for human audit instead of silently averaging out disagreements.
        </p>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--fog)] font-mono text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
          Flagged Evaluation Samples
        </div>

        <div className="divide-y divide-[var(--border)]">
          {flaggedSamples.map((sample) => (
            <div key={sample.id} className="p-6 space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-base text-[var(--ink)]">
                    {sample.promptTitle}
                  </div>
                  <div className="text-[var(--mist)]">
                    Model Under Test: {sample.model} • Disagreement Delta: {sample.disagreementDelta} points
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[var(--gauge)]/10 text-[var(--gauge)] font-bold border border-[var(--gauge)]/20 self-start sm:self-auto">
                  Action Required
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-[var(--fog)] border border-[var(--border)]">
                {sample.judgeScores.map((j) => (
                  <div key={j.model} className="space-y-1">
                    <span className="text-[var(--mist)] text-[11px]">{j.model}:</span>
                    <div className="font-bold text-sm text-[var(--ink)]">{j.score} / 100</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="px-4 py-2 rounded-md bg-[var(--pass)] text-white font-semibold text-xs hover:opacity-90">
                  Approve Consensus
                </button>
                <button className="px-4 py-2 rounded-md bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)] font-semibold text-xs hover:border-[var(--signal)]">
                  Override Score
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
