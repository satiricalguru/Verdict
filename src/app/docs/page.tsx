import React from "react";
import { Scale, Lock, BookOpen } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <BookOpen className="w-4 h-4" />
          <span>Documentation & Methodology</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          Scoring Methodology &amp; Auditing Framework
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Comprehensive documentation explaining how AI judge panels grade frontier models, how held-out prompt sets are protected, and how composite scores are calculated.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
          <h2 className="font-sans font-semibold text-xl text-[var(--ink)] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[var(--signal)]" />
            <span>1. Multi-Judge Panel Architecture</span>
          </h2>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            Verdict uses a panel of 3 independent frontier models to grade generated artifacts. Crucially, no model family evaluates its own outputs. Judges evaluate each sample across 5 distinct dimensions:
          </p>
          <ul className="list-disc pl-5 text-xs font-mono space-y-1 text-[var(--ink)]">
            <li><strong>Functionality (25%)</strong>: Runtime execution without console or rendering errors.</li>
            <li><strong>Craft (25%)</strong>: Clean HTML5/CSS architecture, TypeScript type safety, semantic markup.</li>
            <li><strong>Design (20%)</strong>: Visual aesthetics, color palette harmony, contrast ratio compliance.</li>
            <li><strong>Creativity (15%)</strong>: Original micro-interactions, layout depth, animations.</li>
            <li><strong>Fidelity (15%)</strong>: Adherence to complex system prompt constraints.</li>
          </ul>
        </div>

        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
          <h2 className="font-sans font-semibold text-xl text-[var(--ink)] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--gauge)]" />
            <span>2. Held-Out Prompt Set Protection</span>
          </h2>
          <p className="text-sm text-[var(--mist)] leading-relaxed">
            To prevent model providers from overfitting their models to our test suite, 50% of Verdict prompts remain private. Every benchmark run evaluates models against a mix of public and held-out prompts.
          </p>
        </div>
      </div>
    </div>
  );
}
