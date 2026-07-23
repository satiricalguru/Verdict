"use client";

import React, { useState } from "react";
import { Cpu, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function CompatibilityPage() {
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");

  const registry: Record<
    string,
    {
      name: string;
      provider: string;
      maxTokens: string;
      vision: boolean;
      tools: boolean;
      supportedCategories: string[];
      estimatedCostPerPrompt: string;
      estimatedFullRunCost: string;
      warnings: string[];
    }
  > = {
    "claude-3-5-sonnet": {
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      maxTokens: "200,000",
      vision: true,
      tools: true,
      supportedCategories: ["Frontend UI", "Game Dev", "SVG Art", "Agentic Tasks"],
      estimatedCostPerPrompt: "$0.025",
      estimatedFullRunCost: "$0.90",
      warnings: [],
    },
    "o3-mini": {
      name: "o3-mini (High)",
      provider: "OpenAI",
      maxTokens: "200,000",
      vision: false,
      tools: true,
      supportedCategories: ["Frontend UI", "Game Dev", "Agentic Tasks"],
      estimatedCostPerPrompt: "$0.008",
      estimatedFullRunCost: "$0.32",
      warnings: ["High reasoning effort model without multimodal vision input."],
    },
    "gpt-4o": {
      name: "GPT-4o",
      provider: "OpenAI",
      maxTokens: "128,000",
      vision: true,
      tools: true,
      supportedCategories: ["Frontend UI", "Game Dev", "SVG Art", "Agentic Tasks"],
      estimatedCostPerPrompt: "$0.018",
      estimatedFullRunCost: "$0.65",
      warnings: [],
    },
    "deepseek-v3": {
      name: "DeepSeek V3",
      provider: "DeepSeek (Open Weight)",
      maxTokens: "64,000",
      vision: false,
      tools: true,
      supportedCategories: ["Frontend UI", "Game Dev", "Agentic Tasks"],
      estimatedCostPerPrompt: "$0.0015",
      estimatedFullRunCost: "$0.05",
      warnings: ["Ultra cost-effective open-weight model."],
    },
    "deepseek-r1": {
      name: "DeepSeek R1",
      provider: "DeepSeek (Open Weight)",
      maxTokens: "64,000",
      vision: false,
      tools: true,
      supportedCategories: ["Frontend UI", "Game Dev", "Agentic Tasks"],
      estimatedCostPerPrompt: "$0.004",
      estimatedFullRunCost: "$0.14",
      warnings: ["Reasoning model with chain-of-thought outputs."],
    },
    "gemini-1-5-pro": {
      name: "Gemini 1.5 Pro",
      provider: "Google AI",
      maxTokens: "2,000,000",
      vision: true,
      tools: true,
      supportedCategories: ["Frontend UI", "Game Dev", "SVG Art", "Agentic Tasks"],
      estimatedCostPerPrompt: "$0.012",
      estimatedFullRunCost: "$0.45",
      warnings: [],
    },
  };

  const current = registry[selectedModel] || registry["claude-3-5-sonnet"];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <Cpu className="w-4 h-4" />
          <span>Model Compatibility & Readiness Tool</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
          &quot;Can I Run It&quot; Benchmark Checker
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-2xl">
          Check if a target frontier model supports vision, function calling, max context windows, and estimate API token budget required for a full benchmark execution.
        </p>
      </div>

      {/* Model Selector Instrument Panel */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6">
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] mb-2">
            Select Model from Registry
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full max-w-md p-3 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--signal)]"
          >
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Anthropic)</option>
            <option value="o3-mini">o3-mini (OpenAI)</option>
            <option value="gpt-4o">GPT-4o (OpenAI)</option>
            <option value="deepseek-v3">DeepSeek V3 (DeepSeek)</option>
            <option value="deepseek-r1">DeepSeek R1 (DeepSeek)</option>
            <option value="gemini-1-5-pro">Gemini 1.5 Pro (Google AI)</option>
          </select>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
          {/* Technical Specs */}
          <div className="rounded-lg bg-[var(--fog)] border border-[var(--border)] p-5 space-y-4">
            <h3 className="font-mono font-bold text-sm text-[var(--ink)] uppercase tracking-wider">
              Capabilities & Specs
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--mist)]">Max Context Window:</span>
                <span className="font-bold text-[var(--ink)]">{current.maxTokens} tokens</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--mist)]">Multimodal Vision:</span>
                <span className={`font-bold ${current.vision ? "text-[var(--pass)]" : "text-[var(--fail)]"}`}>
                  {current.vision ? "Supported" : "Not Supported"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mist)]">Function Calling / Tools:</span>
                <span className={`font-bold ${current.tools ? "text-[var(--pass)]" : "text-[var(--fail)]"}`}>
                  {current.tools ? "Supported" : "Not Supported"}
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
                <span className="text-[var(--mist)]">Est. Cost Per Prompt:</span>
                <span className="font-bold text-[var(--gauge)]">{current.estimatedCostPerPrompt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--mist)]">Est. Full Benchmark Run:</span>
                <span className="font-bold text-[var(--gauge)]">{current.estimatedFullRunCost}</span>
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
            {["Frontend UI", "Game Dev", "SVG Art", "Agentic Tasks"].map((cat) => {
              const isSupported = current.supportedCategories.includes(cat);
              return (
                <div
                  key={cat}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border ${
                    isSupported
                      ? "bg-[var(--pass)]/10 text-[var(--pass)] border-[var(--pass)]/20"
                      : "bg-[var(--fog)] text-[var(--mist)] border-[var(--border)] opacity-60"
                  }`}
                >
                  {isSupported ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[var(--fail)]" />
                  )}
                  <span>{cat}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warnings */}
        {current.warnings.length > 0 && (
          <div className="p-4 rounded-lg bg-[var(--gauge)]/10 border border-[var(--gauge)]/30 text-xs font-mono text-[var(--ink)] flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[var(--gauge)] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Readiness Warning: </span>
              {current.warnings.join(" ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
