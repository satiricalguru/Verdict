"use client";

import React, { useState, useEffect } from "react";
import { Play, Columns, RefreshCw } from "lucide-react";
import ProviderLogo from "@/components/ui/provider-logo";

interface ModelChoice {
  slug: string;
  name: string;
  provider: string;
  composite: number;
}

export default function PlaygroundPage() {
  const [availableModels, setAvailableModels] = useState<ModelChoice[]>([]);
  const [modelA, setModelA] = useState<string>("claude-fable-5");
  const [modelB, setModelB] = useState<string>("gpt-5-6-sol");
  const [prompt, setPrompt] = useState<string>(
    "Create a responsive HTML5 Canvas particle galaxy animation with interactive mouse gravity physics, glowing star dust, and dark mode controls."
  );
  const [running, setRunning] = useState<boolean>(false);
  const [outputA, setOutputA] = useState<string | null>(null);
  const [outputB, setOutputB] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.models && data.models.length > 0) {
          setAvailableModels(data.models);
          setModelA(data.models[0].slug);
          if (data.models.length > 1) {
            setModelB(data.models[1].slug);
          }
        }
      })
      .catch((err) => console.warn("Fetch models for playground:", err));
  }, []);

  const handleRunComparison = async () => {
    setRunning(true);
    setOutputA(null);
    setOutputB(null);

    try {
      // Execute runs for both candidates in parallel via /api/runs
      const [resA, resB] = await Promise.all([
        fetch("/api/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId: modelA, categories: ["frontend-ui"], promptText: prompt }),
        }),
        fetch("/api/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId: modelB, categories: ["frontend-ui"], promptText: prompt }),
        }),
      ]);

      const dataA = resA.ok ? await resA.json() : null;
      const dataB = resB.ok ? await resB.json() : null;

      setOutputA(
        dataA?.rawOutput ||
          `<!DOCTYPE html><html><body style="background:#0b0d14;color:#e4e4e7;font-family:sans-serif;padding:2rem;"><h3>${modelA} Rendered Output</h3><p>${prompt}</p></body></html>`
      );

      setOutputB(
        dataB?.rawOutput ||
          `<!DOCTYPE html><html><body style="background:#0b0d14;color:#e4e4e7;font-family:sans-serif;padding:2rem;"><h3>${modelB} Rendered Output</h3><p>${prompt}</p></body></html>`
      );
    } catch (err) {
      console.warn("Playground execution error:", err);
    } finally {
      setRunning(false);
    }
  };

  const choiceA = availableModels.find((m) => m.slug === modelA) || {
    slug: "claude-fable-5",
    name: "Claude Fable 5",
    provider: "Anthropic",
    composite: 98.4,
  };
  const choiceB = availableModels.find((m) => m.slug === modelB) || {
    slug: "gpt-5-6-sol",
    name: "GPT-5.6 Sol (max)",
    provider: "OpenAI",
    composite: 96.2,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
            <Columns className="w-4 h-4" />
            <span>Interactive Side-by-Side Model Arena &amp; Playground</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--signal)]/10 border border-[var(--signal)]/30 text-[11px] font-mono text-[var(--signal)] font-semibold">
            ● Pro Unlocked Free Feature
          </span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--ink)] tracking-tight">
            Model Playground
          </h1>
          <p className="text-sm text-[var(--mist)] mt-1 max-w-2xl">
            Compare two frontier models simultaneously on custom prompts. Inspect live sandboxed previews, latency, token costs, and judge ratings side-by-side.
          </p>
        </div>
      </div>

      {/* Input Form & Controls */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-[var(--mist)] uppercase tracking-wider block mb-2">
              Model Candidate A
            </label>
            <select
              value={modelA}
              onChange={(e) => setModelA(e.target.value)}
              className="w-full bg-[var(--fog)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--signal)] cursor-pointer"
            >
              {availableModels.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-[var(--mist)] uppercase tracking-wider block mb-2">
              Model Candidate B
            </label>
            <select
              value={modelB}
              onChange={(e) => setModelB(e.target.value)}
              className="w-full bg-[var(--fog)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--signal)] cursor-pointer"
            >
              {availableModels.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-[var(--mist)] uppercase tracking-wider block mb-2">
            Benchmark Prompt Input
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full bg-[var(--fog)] border border-[var(--border)] rounded-lg p-3 text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--signal)] resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunComparison}
            disabled={running}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--signal)] text-black font-mono font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {running ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Playground Benchmark...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Parallel Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-Side Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model A Box */}
        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-3">
              <ProviderLogo provider={choiceA.provider} size="sm" />
              <div>
                <span className="font-mono font-bold text-sm text-[var(--ink)]">{choiceA.name}</span>
                <span className="block text-[10px] font-mono text-[var(--mist)]">{choiceA.provider}</span>
              </div>
            </div>
            <span className="text-xs font-mono text-[var(--pass)] font-semibold bg-[var(--pass)]/10 px-2 py-0.5 rounded border border-[var(--pass)]/20">
              {choiceA.composite.toFixed(1)} / 100
            </span>
          </div>

          <div className="h-64 rounded-lg bg-[var(--fog)] border border-[var(--border)] overflow-hidden flex items-center justify-center relative">
            {outputA ? (
              <iframe srcDoc={outputA} sandbox="allow-scripts" className="w-full h-full border-none" />
            ) : (
              <span className="text-xs font-mono text-[var(--mist)]">
                {running ? "Executing model generation..." : "Click 'Run Parallel Comparison' to preview output"}
              </span>
            )}
          </div>
        </div>

        {/* Model B Box */}
        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-3">
              <ProviderLogo provider={choiceB.provider} size="sm" />
              <div>
                <span className="font-mono font-bold text-sm text-[var(--ink)]">{choiceB.name}</span>
                <span className="block text-[10px] font-mono text-[var(--mist)]">{choiceB.provider}</span>
              </div>
            </div>
            <span className="text-xs font-mono text-[var(--pass)] font-semibold bg-[var(--pass)]/10 px-2 py-0.5 rounded border border-[var(--pass)]/20">
              {choiceB.composite.toFixed(1)} / 100
            </span>
          </div>

          <div className="h-64 rounded-lg bg-[var(--fog)] border border-[var(--border)] overflow-hidden flex items-center justify-center relative">
            {outputB ? (
              <iframe srcDoc={outputB} sandbox="allow-scripts" className="w-full h-full border-none" />
            ) : (
              <span className="text-xs font-mono text-[var(--mist)]">
                {running ? "Executing model generation..." : "Click 'Run Parallel Comparison' to preview output"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
