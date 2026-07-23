import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryName = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

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

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase bg-[var(--fog)] text-[var(--signal)]">
          Category Detail
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
          {categoryName}
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Complete listing of prompts, evaluation rubrics, and model performance rankings within the {categoryName} benchmark suite.
        </p>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
        <h2 className="font-display font-bold text-xl text-[var(--ink)]">
          Category Prompts & Benchmark Tasks
        </h2>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex justify-between items-center">
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">
                #1 Realtime Financial Dashboard
              </div>
              <div className="text-[var(--mist)] mt-1">
                Public Test Set • Difficulty: Hard
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-[var(--pass)]/10 text-[var(--pass)] font-bold">
              Nova-1: 89.4
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex justify-between items-center">
            <div>
              <div className="font-bold text-sm text-[var(--ink)]">
                #2 Responsive E-Commerce Checkout Flow
              </div>
              <div className="text-[var(--mist)] mt-1">
                Public Test Set • Difficulty: Medium
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-[var(--pass)]/10 text-[var(--pass)] font-bold">
              Nova-1: 87.2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
