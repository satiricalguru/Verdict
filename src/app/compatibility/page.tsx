"use client";

import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

interface ModelOption {
  name: string;
  slug: string;
  provider: string;
  isOpenWeight: boolean;
}

interface SelectedModelData {
  name: string;
  slug: string;
  provider: string;
  capabilities: { vision: boolean; tools: boolean; maxTokens: number };
  priceInput: string;
  priceOutput: string;
  contextWindow: string;
  isOpenWeight: boolean;
  estimatedCostPerPrompt: string;
  estimatedFullRunCost: string;
  warnings: string[];
}

export default function CompatibilityPage() {
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("claude-fable-5");
  const [modelData, setModelData] = useState<SelectedModelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`/api/compatibility?model=${selectedSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.models) setModelOptions(data.models);
          if (data.selectedModel) setModelData(data.selectedModel);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSlug]);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <Cpu className="w-4 h-4" />
          <span>Model Compatibility & Readiness Tool</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          Model Compatibility &amp; Cost Calculator
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-2xl">
          Check if a target frontier model supports vision, function calling, max context windows, and estimate API token budget required for a full benchmark execution.
        </p>
      </div>

      {/* Model Selector Instrument Panel */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6">
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] mb-2">
            Select Model from Registry ({modelOptions.length > 0 ? `${modelOptions.length} Models` : "Loading..."})
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full max-w-md p-3 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--signal)]"
          >
            {modelOptions.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name} ({m.provider}{m.isOpenWeight ? " • Open Weight" : ""})
              </option>
            ))}
          </select>
        </div>

        {/* Results Grid */}
        {loading || !modelData ? (
          <div className="py-12 flex items-center justify-center font-mono text-xs text-[var(--mist)] gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--signal)]" />
            <span>Fetching model specs and token pricing...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
              {/* Technical Specs */}
              <div className="rounded-lg bg-[var(--fog)] border border-[var(--border)] p-5 space-y-4">
                <h3 className="font-mono font-bold text-sm text-[var(--ink)] uppercase tracking-wider">
                  Capabilities & Specs ({modelData.name})
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-[var(--mist)]">Max Context Window:</span>
                    <span className="font-bold text-[var(--ink)]">{modelData.contextWindow || "1M"} tokens</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-[var(--mist)]">Multimodal Vision:</span>
                    <span className={`font-bold ${modelData.capabilities.vision ? "text-[var(--pass)]" : "text-[var(--fail)]"}`}>
                      {modelData.capabilities.vision ? "Supported" : "Not Supported"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--mist)]">Function Calling / Tools:</span>
                    <span className={`font-bold ${modelData.capabilities.tools ? "text-[var(--pass)]" : "text-[var(--fail)]"}`}>
                      {modelData.capabilities.tools ? "Supported" : "Not Supported"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Estimates */}
              <div className="rounded-lg bg-[var(--fog)] border border-[var(--border)] p-5 space-y-4">
                <h3 className="font-mono font-bold text-sm text-[var(--ink)] uppercase tracking-wider">
                  Estimated BYOK API Budget
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-[var(--mist)]">Input Rate:</span>
                    <span className="font-bold text-[var(--ink)]">{modelData.priceInput}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-[var(--mist)]">Output Rate:</span>
                    <span className="font-bold text-[var(--ink)]">{modelData.priceOutput}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-[var(--mist)]">Est. Cost Per Prompt:</span>
                    <span className="font-bold text-[var(--gauge)]">{modelData.estimatedCostPerPrompt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--mist)]">Est. Full Benchmark Run:</span>
                    <span className="font-bold text-[var(--gauge)]">{modelData.estimatedFullRunCost}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Categories */}
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                Category Benchmark Scope Compatibility
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Frontend UI", "Game Dev", "SVG Art", "Agentic Tasks", "Creative Writing", "3D Graphics", "Data Viz", "Animation", "Full-Stack", "Code Golf"].map((cat) => {
                  const isSupported = true; // All 10 categories supported by LLM engine
                  return (
                    <div
                      key={cat}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border ${
                        isSupported
                          ? "bg-[var(--pass)]/10 text-[var(--pass)] border-[var(--pass)]/20"
                          : "bg-[var(--fog)] text-[var(--mist)] border-[var(--border)] opacity-60"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{cat}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warnings */}
            {modelData.warnings.length > 0 && (
              <div className="p-4 rounded-lg bg-[var(--gauge)]/10 border border-[var(--gauge)]/30 text-xs font-mono text-[var(--ink)] flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[var(--gauge)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Readiness Notice: </span>
                  {modelData.warnings.join(" ")}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

