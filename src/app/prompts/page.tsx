import React from "react";
import { Terminal, Lock, Globe } from "lucide-react";
import { getAllPrompts } from "@/lib/models";

export const revalidate = 60;

export default async function PromptsPage() {
  const prompts = await getAllPrompts();

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <Terminal className="w-4 h-4" />
          <span>Prompt Library & Evaluation Tasks</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
          Published Test Set & Held-Out Rubrics
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Browse the task specifications used in Verdict benchmark runs. A portion of the prompt set is held private to prevent model providers from overfitting to the benchmark.
        </p>
      </div>

      {/* Prompts Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map((p) => (
          <div
            key={p.id}
            className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-[var(--fog)] text-[var(--signal)] border border-[var(--border)]">
                  {p.category.name}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      p.difficulty === "Expert"
                        ? "bg-[var(--fail)]/10 text-[var(--fail)]"
                        : p.difficulty === "Hard"
                        ? "bg-[var(--gauge)]/10 text-[var(--gauge)]"
                        : "bg-[var(--pass)]/10 text-[var(--pass)]"
                    }`}
                  >
                    {p.difficulty}
                  </span>

                  {p.heldOut ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--ink)] text-[var(--paper)]">
                      <Lock className="w-3 h-3" />
                      <span>Held-Out</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--fog)] text-[var(--mist)]">
                      <Globe className="w-3 h-3" />
                      <span>Public</span>
                    </span>
                  )}
                </div>
              </div>

              <h2 className="font-display font-bold text-xl text-[var(--ink)]">
                {p.title}
              </h2>

              <p className="text-xs text-[var(--mist)] leading-relaxed">
                {p.body}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--mist)]">
              {p.heldOut
                ? "Protected evaluation set — verified via zero-shot prompt injection guardrails."
                : "Public benchmark prompt — available for local execution."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
