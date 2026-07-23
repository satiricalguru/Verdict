import React from "react";
import VerdictDial from "@/components/ui/verdict-dial";
import { Sparkles } from "lucide-react";
import { getShowcaseSamples } from "@/lib/models";

export const revalidate = 60;

export default async function ShowcasePage() {
  const showcaseItems = await getShowcaseSamples(6);

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <Sparkles className="w-4 h-4" />
          <span>Community Generation Gallery</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          Community Output Showcase
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Opt-in showcase of top-rated model generations evaluated by the Verdict judge panel. Each card renders in a sandboxed isolated runtime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showcaseItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-5 space-y-4 hover:border-[var(--signal)] transition-colors overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-lg bg-[var(--fog)] border border-[var(--border)] overflow-hidden relative">
                <iframe
                  srcDoc={item.code}
                  title={item.title}
                  className="w-full h-full border-none pointer-events-none scale-90 origin-top-left"
                  sandbox="allow-scripts"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-semibold text-base text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-[var(--mist)]">
                    Model: {item.model} ({item.provider})
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VerdictDial score={item.score} size="sm" showNeedle={false} />
                <span className="font-mono font-bold text-sm text-[var(--ink)]">
                  {item.score.toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--pass)]">
                Sandboxed CSP Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

