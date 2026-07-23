import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Terminal } from "lucide-react";
import { getCategoryBySlug } from "@/lib/models";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryData = await getCategoryBySlug(slug);

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--mist)] hover:text-[var(--signal)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Categories</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <Sparkles className="w-4 h-4" />
          <span>Category Suite: {categoryData.typeTag}</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          {categoryData.name} Evaluation Benchmark
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl leading-relaxed">
          {categoryData.description}
        </p>
      </div>

      {/* Top Models in Category */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
        <h2 className="font-sans font-semibold text-xl text-[var(--ink)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--gauge)]" />
          <span>Top Model Leaders in {categoryData.name}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {categoryData.topModels.map((m, idx) => (
            <Link
              key={m.slug}
              href={`/models/${m.slug}`}
              className="p-3.5 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-1 hover:border-[var(--signal)] transition-colors"
            >
              <div className="text-[10px] text-[var(--mist)] font-bold uppercase">Rank #{idx + 1}</div>
              <div className="font-bold text-[var(--ink)] truncate">{m.name}</div>
              <div className="text-[var(--gauge)] font-bold text-sm">{m.score.toFixed(1)} / 100</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Prompts List */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-xs">
          <span className="font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--signal)]" />
            <span>Category Prompts & Benchmark Tasks ({categoryData.prompts.length})</span>
          </span>
          <span className="text-[var(--mist)]">Zero-Shot & Multi-Turn Evals</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {categoryData.prompts.length === 0 ? (
            <div className="py-6 text-center text-[var(--mist)]">
              No prompts configured for this category yet.
            </div>
          ) : (
            categoryData.prompts.map((p, idx) => (
              <div key={p.id} className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-sm text-[var(--ink)]">
                    #{idx + 1} {p.title}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[var(--signal)]/10 text-[var(--signal)] font-bold text-[10px]">
                    Difficulty: {p.difficulty}
                  </span>
                </div>
                <p className="text-[var(--mist)] leading-relaxed font-sans text-xs">
                  {p.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

