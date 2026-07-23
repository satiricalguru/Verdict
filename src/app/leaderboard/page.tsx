import React from "react";
import LeaderboardTable from "@/components/ui/leaderboard-table";
import { getLeaderboardModels } from "@/lib/models";
import { Sparkles, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeaderboardPage() {
  const modelsData = await getLeaderboardModels();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
            <Sparkles className="w-4 h-4" />
            <span>WoAI Bench & Canonical Public Benchmark Suite</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--mist)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--pass)]" />
            <span>Audited Multi-Judge Evaluation Panel</span>
          </div>
        </div>

        <h1 className="font-sans font-semibold text-2xl sm:text-3xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          Frontier AI Model Leaderboard (Mid-2026)
        </h1>

        <p className="text-sm text-[var(--mist)] max-w-3xl leading-relaxed">
          Evaluating 100+ frontier AI models on real-world &quot;vibe coding&quot; tasks, agentic repository refactoring, multimodal vision understanding, and real-time voice synthesis.
        </p>
      </div>

      {/* Interactive Leaderboard Table Component */}
      <LeaderboardTable models={modelsData} />
    </div>
  );
}
