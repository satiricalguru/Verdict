import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import VerdictDial from "@/components/ui/verdict-dial";
import Scoreboard from "@/components/ui/scoreboard";
import { getModelBySlug } from "@/lib/models";
import {
  ArrowLeft,
  Swords,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const modelData = await getModelBySlug(slug);

  if (!modelData) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--mist)] hover:text-[var(--signal)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Leaderboard</span>
        </Link>
      </div>

      {/* Hero Header Panel */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[var(--ink)] text-[var(--paper)] font-mono font-bold text-lg flex items-center justify-center">
              {modelData.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
                  {modelData.name}
                </h1>
                {modelData.isOpenWeight && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-[var(--pass)]/10 text-[var(--pass)] border border-[var(--pass)]/20">
                    Open Weight
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[var(--mist)]">
                Provider: {modelData.provider} • ID: {modelData.modelIdString}
              </p>
            </div>
          </div>

          <p className="text-sm text-[var(--mist)] max-w-2xl leading-relaxed">
            Detailed evaluation metrics and judge breakdown for {modelData.name} across all 4 launch categories.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              href={`/arena?model=${slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--signal)] text-white text-sm font-semibold hover:bg-[var(--signal-hover)] transition-all shadow-sm"
            >
              <Swords className="w-4 h-4" />
              <span>Compare in Blind Arena</span>
            </Link>

            <div className="px-3 py-1 rounded bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--ink)]">
              Pricing: In {modelData.priceInput} • Out {modelData.priceOutput}
            </div>
          </div>
        </div>

        {/* Verdict Dial & Score Card */}
        <div className="lg:col-span-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] p-6 flex flex-col items-center justify-center space-y-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--mist)]">
            Composite Verdict Score
          </span>
          <VerdictDial score={modelData.composite} size="lg" minScore={65} maxScore={95} />
          <Scoreboard value={modelData.composite} decimals={1} size="md" suffix="/100" />
        </div>
      </div>

      {/* Category Breakdown Grid */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-2xl text-[var(--ink)]">
          Category Score Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modelData.categories.map((cat) => (
            <div
              key={cat.name}
              className="rounded-lg bg-[var(--paper)] border border-[var(--border)] p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-base text-[var(--ink)]">
                  {cat.name}
                </span>
                <span className="font-mono font-bold text-lg text-[var(--gauge)]">
                  {cat.score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-[var(--mist)]">{cat.desc}</p>
              <div className="w-full h-1.5 rounded-full bg-[var(--fog)] overflow-hidden">
                <div
                  className="h-full bg-[var(--signal)] rounded-full"
                  style={{ width: `${Math.min(100, cat.score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Judge Dimension Rationale */}
      <section className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[var(--ink)]">
              Auditable Multi-Judge Dimension Scoring
            </h2>
            <p className="text-xs text-[var(--mist)] mt-1">
              Grades evaluated across 3 independent judge models using published rubrics.
            </p>
          </div>
          <ShieldCheck className="w-6 h-6 text-[var(--signal)]" />
        </div>

        <div className="space-y-4">
          {modelData.judges.map((j) => (
            <div
              key={j.dimension}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] text-sm"
            >
              <div className="space-y-1">
                <div className="font-bold text-[var(--ink)] flex items-center gap-2">
                  <span>{j.dimension}</span>
                  <span className="text-xs font-mono font-normal text-[var(--mist)]">
                    — {j.desc}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-32 h-2 rounded-full bg-[var(--paper)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--gauge)]"
                    style={{ width: `${Math.min(100, j.score)}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-base text-[var(--ink)]">
                  {j.score.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
