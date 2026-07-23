import React from "react";
import Link from "next/link";
import { Layers, Play, Sparkles, Cpu, ArrowRight } from "lucide-react";
import { getCategoriesWithCounts } from "@/lib/models";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
  const dbCategories = await getCategoriesWithCounts();

  const iconMap: Record<string, React.ElementType> = {
    "frontend-ui": Layers,
    "game-dev": Play,
    "svg-art": Sparkles,
    "agentic-tasks": Cpu,
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          Benchmark Scope &amp; Categories
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Verdict evaluates frontier models across 10 benchmark categories spanning interactive web apps, 2D game loops, vector artwork, and multi-step autonomous planning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dbCategories.map((cat) => {
          const IconComp = iconMap[cat.slug] || Cpu;
          return (
            <div
              key={cat.slug}
              className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4 hover:border-[var(--signal)] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase tracking-wider bg-[var(--fog)] text-[var(--signal)] border border-[var(--border)]">
                    {cat.tag}
                  </span>
                  <IconComp className="w-5 h-5 text-[var(--signal)]" />
                </div>

                <h2 className="font-sans font-semibold text-2xl text-[var(--ink)]">
                  {cat.name}
                </h2>

                <p className="text-sm text-[var(--mist)] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[var(--mist)]">Prompts Sourced: </span>
                  <span className="font-bold text-[var(--ink)]">{cat.promptCount}</span>
                </div>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="inline-flex items-center gap-1 text-[var(--signal)] font-semibold hover:underline"
                >
                  <span>View Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
