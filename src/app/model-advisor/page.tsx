"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Filter, RefreshCcw } from "lucide-react";
import ProviderLogo from "@/components/ui/provider-logo";

interface ModelRecommendation {
  id: string;
  name: string;
  provider: string;
  slug: string;
  composite: number;
  priceInput: number;
  priceOutput: number;
  isOpenWeight: boolean;
  contextWindow: string;
  latencyAvg: number;
  matchScore: number;
  why: string;
}

export default function ModelAdvisorPage() {
  const [models, setModels] = useState<ModelRecommendation[]>([]);
  const [taskCategory, setTaskCategory] = useState<string>("frontend-ui");
  const [maxPrice, setMaxPrice] = useState<number>(10.0);
  const [requireOpenWeight, setRequireOpenWeight] = useState<boolean>(false);
  const [priority, setPriority] = useState<"quality" | "cost" | "speed">("quality");

  useEffect(() => {
    fetch("/api/models")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.models && data.models.length > 0) {
          const mapped: ModelRecommendation[] = data.models.map(
            (m: {
              id: string;
              name: string;
              provider: { name: string } | string;
              slug: string;
              composite: number;
              priceInput: number;
              priceOutput: number;
              isOpenWeight: boolean;
              capabilities?: string;
            }) => {
              const provName = typeof m.provider === "string" ? m.provider : m.provider?.name || "AI";
              return {
                id: m.id,
                name: m.name,
                provider: provName,
                slug: m.slug,
                composite: m.composite,
                priceInput: m.priceInput || 1.0,
                priceOutput: m.priceOutput || 3.0,
                isOpenWeight: Boolean(m.isOpenWeight),
                contextWindow: "1M tokens",
                latencyAvg: 650,
                matchScore: Math.round(m.composite),
                why: `Evaluated benchmark leader for ${taskCategory} generation with high composite rating.`,
              };
            }
          );
          setModels(mapped);
        }
      })
      .catch((err) => console.warn("Fetch models for advisor:", err));
  }, [taskCategory]);

  const filteredModels = models
    .filter((m) => !requireOpenWeight || m.isOpenWeight)
    .filter((m) => m.priceInput <= maxPrice)
    .sort((a, b) => {
      if (priority === "cost") return a.priceInput - b.priceInput;
      if (priority === "speed") return a.latencyAvg - b.latencyAvg;
      return b.composite - a.composite;
    });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
            <Sparkles className="w-4 h-4" />
            <span>SOTA Model Recommendation Wizard</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--signal)]/10 border border-[var(--signal)]/30 text-[11px] font-mono text-[var(--signal)] font-semibold">
            ● Pro Unlocked Free Feature
          </span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--ink)] tracking-tight">
            AI Model Advisor
          </h1>
          <p className="text-sm text-[var(--mist)] mt-1 max-w-2xl">
            Input your target task requirement, context size, and budget parameters to instantly discover the optimal AI model for your prompt.
          </p>
        </div>
      </div>

      {/* Main Advisor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filter Controls Panel */}
        <div className="lg:col-span-4 space-y-6 bg-[var(--paper)] border border-[var(--border)] rounded-xl p-6 h-fit">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--ink)] uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-[var(--signal)]" />
              <span>Target Parameters</span>
            </div>
            <button
              onClick={() => {
                setTaskCategory("frontend-ui");
                setMaxPrice(10.0);
                setRequireOpenWeight(false);
                setPriority("quality");
              }}
              className="text-xs font-mono text-[var(--mist)] hover:text-[var(--signal)] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--mist)] uppercase tracking-wider block">
              Benchmark Task Type
            </label>
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="w-full bg-[var(--fog)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--signal)] cursor-pointer"
            >
              <option value="frontend-ui">Frontend UI &amp; Glassmorphism</option>
              <option value="game-dev">Browser 2D Game Dev &amp; Physics</option>
              <option value="svg-art">SVG Vector Art &amp; Math Graphics</option>
              <option value="agentic-tasks">Agentic Repo Refactoring</option>
              <option value="full-stack">Full-Stack Next.js &amp; Prisma</option>
              <option value="3d-graphics">Three.js 3D WebGL Scenes</option>
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--mist)] uppercase tracking-wider block">
              Primary Metric Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "quality", label: "Quality" },
                { id: "cost", label: "Cost" },
                { id: "speed", label: "Speed" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriority(p.id as "quality" | "cost" | "speed")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border cursor-pointer ${
                    priority === p.id
                      ? "bg-[var(--signal)]/15 border-[var(--signal)] text-[var(--signal)]"
                      : "bg-[var(--fog)] border-[var(--border)] text-[var(--mist)] hover:text-[var(--ink)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Input Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-[var(--mist)]">
              <span>Max Input Cost ($/1M)</span>
              <span className="text-[var(--signal)] font-semibold">${maxPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="15.00"
              step="0.10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full accent-[var(--signal)] cursor-pointer"
            />
          </div>

          {/* Open Weight Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <span className="text-xs font-mono text-[var(--ink)]">Require Open-Weight Model</span>
            <input
              type="checkbox"
              checked={requireOpenWeight}
              onChange={(e) => setRequireOpenWeight(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] accent-[var(--signal)] cursor-pointer"
            />
          </div>
        </div>

        {/* Recommendations List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--mist)] uppercase tracking-wider">
              Recommended Model Matches ({filteredModels.length})
            </span>
            <span className="text-xs font-mono text-[var(--signal)]">Sorted by {priority.toUpperCase()}</span>
          </div>

          {filteredModels.map((model, idx) => (
            <div
              key={model.id}
              className="rounded-xl bg-[var(--paper)] border border-[var(--border)] hover:border-[var(--signal)]/50 transition-all p-5 space-y-4 relative overflow-hidden group"
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[var(--signal)] to-amber-500 text-[10px] font-mono font-bold text-black px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  #1 Recommended Match
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ProviderLogo provider={model.provider} size="md" />
                  <div>
                    <Link
                      href={`/models/${model.slug}`}
                      className="font-sans font-bold text-lg text-[var(--ink)] group-hover:text-[var(--signal)] transition-colors flex items-center gap-2"
                    >
                      {model.name}
                      {model.isOpenWeight && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Open Weight
                        </span>
                      )}
                    </Link>
                    <span className="text-xs font-mono text-[var(--mist)]">{model.provider}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-mono font-extrabold text-[var(--signal)]">
                    {model.composite.toFixed(1)}
                    <span className="text-xs text-[var(--mist)] font-normal"> / 100</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--mist)] uppercase">Verdict Score</span>
                </div>
              </div>

              <p className="text-xs text-[var(--ink)]/90 bg-[var(--fog)] p-3 rounded-lg border border-[var(--border)]">
                💡 <span className="font-semibold">Why this model:</span> {model.why}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono text-[var(--mist)] border-t border-[var(--border)]">
                <div>
                  <span className="block text-[10px] text-[var(--mist)]/70 uppercase">Input Cost</span>
                  <span className="text-[var(--ink)] font-semibold">${model.priceInput.toFixed(2)} / 1M</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--mist)]/70 uppercase">Output Cost</span>
                  <span className="text-[var(--ink)] font-semibold">${model.priceOutput.toFixed(2)} / 1M</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--mist)]/70 uppercase">Context Window</span>
                  <span className="text-[var(--ink)] font-semibold">{model.contextWindow}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--mist)]/70 uppercase">Avg Latency</span>
                  <span className="text-[var(--ink)] font-semibold">{model.latencyAvg} ms</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  href={`/models/${model.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--signal)] hover:underline"
                >
                  <span>View Full Benchmark Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
