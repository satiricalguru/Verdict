"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import VerdictDial from "@/components/ui/verdict-dial";
import {
  ArrowUpDown,
  TrendingUp,
  ChevronRight,
  Zap,
  Search,
  Brain,
  Shield,
  Gauge,
  Clock,
  Coins,
  Layers,
} from "lucide-react";

export interface LeaderboardModelItem {
  id: string;
  rank: number;
  name: string;
  slug: string;
  provider: string;
  logo: string;
  composite: number;
  trend: string;
  tokensPerSec?: string;
  ttftMs?: string;
  contextWindow?: string;
  frontend: number;
  game: number;
  svg: number;
  agentic: number;
  priceInput: string;
  priceOutput: string;
  isOpenWeight: boolean;
  capabilities: { vision: boolean; tools: boolean; maxTokens: number };
}

export default function LeaderboardTable({ models }: { models: LeaderboardModelItem[] }) {
  const [activeFilter, setActiveFilter] = useState<"all" | "proprietary" | "open" | "reasoning">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"composite" | "frontend" | "game" | "svg" | "agentic">("composite");
  const [sortAsc, setSortAsc] = useState(false);

  const filteredModels = useMemo(() => {
    return models
      .filter((m) => {
        // Filter by tab
        if (activeFilter === "proprietary" && m.isOpenWeight) return false;
        if (activeFilter === "open" && !m.isOpenWeight) return false;
        if (activeFilter === "reasoning") {
          const nameLower = m.name.toLowerCase();
          if (!nameLower.includes("thinking") && !nameLower.includes("reasoning") && !nameLower.includes("o1") && !nameLower.includes("sol")) {
            return false;
          }
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q);
        }

        return true;
      })
      .sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [models, activeFilter, searchQuery, sortBy, sortAsc]);

  const handleSort = (field: "composite" | "frontend" | "game" | "svg" | "agentic") => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ARTIFICIAL ANALYSIS BENCHMARK INDEX CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Intelligence Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--signal)]/10 text-[var(--signal)] border border-[var(--signal)]/20">
              Intelligence
            </span>
            <Brain className="w-4 h-4 text-[var(--signal)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Claude Fable 5</strong> & <strong className="text-[var(--ink)] font-semibold">GPT-5.6 Sol</strong> lead composite reasoning & coding accuracy.
          </p>
          <div className="text-[10px] font-mono text-[var(--pass)]">SOTA S-Tier Rankings</div>
        </div>

        {/* Speed Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--gauge)]/10 text-[var(--gauge)] border border-[var(--gauge)]/20">
              Output Speed
            </span>
            <Gauge className="w-4 h-4 text-[var(--gauge)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Gemini 3.6 Flash</strong> & <strong className="text-[var(--ink)] font-semibold">Mercury 2</strong> top generation throughput ({">"}210 tokens/sec).
          </p>
          <div className="text-[10px] font-mono text-[var(--gauge)]">Ultra Low Throughput Latency</div>
        </div>

        {/* Latency (TTFT) Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Latency (TTFT)
            </span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Gemini 2.5 Flash-Lite</strong> & <strong className="text-[var(--ink)] font-semibold">North Mini Code</strong> yield fastest first token response (&lt;140ms).
          </p>
          <div className="text-[10px] font-mono text-purple-400">Realtime Voice & Chat</div>
        </div>

        {/* Cost Efficiency Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--pass)]/10 text-[var(--pass)] border border-[var(--pass)]/20">
              Cost per Task
            </span>
            <Coins className="w-4 h-4 text-[var(--pass)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">DeepSeek V4 Pro</strong> & <strong className="text-[var(--ink)] font-semibold">MiMo V2.5</strong> offer SOTA intelligence at $0.43/1M input tokens.
          </p>
          <div className="text-[10px] font-mono text-[var(--pass)]">Lowest Cost per Sample</div>
        </div>

        {/* Context Window Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Context Window
            </span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Llama 4 Scout</strong> & <strong className="text-[var(--ink)] font-semibold">Grok 4.20</strong> support up to 2M–10M token context windows.
          </p>
          <div className="text-[10px] font-mono text-blue-400">Whole Repository Analysis</div>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* WoAI Bench Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-colors ${
              activeFilter === "all"
                ? "bg-[var(--signal)] text-white shadow-sm"
                : "bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--signal)]"
            }`}
          >
            All {models.length} Models
          </button>

          <button
            onClick={() => setActiveFilter("proprietary")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === "proprietary"
                ? "bg-[var(--signal)] text-white shadow-sm"
                : "bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--signal)]"
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Proprietary Flagships</span>
          </button>

          <button
            onClick={() => setActiveFilter("open")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === "open"
                ? "bg-[var(--signal)] text-white shadow-sm"
                : "bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--signal)]"
            }`}
          >
            <Zap className="w-3 h-3 text-[var(--pass)]" />
            <span>Open Weight SOTA</span>
          </button>

          <button
            onClick={() => setActiveFilter("reasoning")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === "reasoning"
                ? "bg-[var(--signal)] text-white shadow-sm"
                : "bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--signal)]"
            }`}
          >
            <Brain className="w-3 h-3 text-[var(--gauge)]" />
            <span>Extended Reasoning</span>
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[var(--mist)] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model or provider..."
            className="w-full pl-9 pr-3 py-1.5 bg-[var(--fog)] border border-[var(--border)] rounded-md text-xs font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--signal)]"
          />
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--fog)] flex items-center justify-between font-mono text-xs text-[var(--mist)]">
          <span className="font-bold text-[var(--ink)] uppercase tracking-wider">
            Artificial Analysis & WoAI Bench Rankings ({filteredModels.length} Models Displayed)
          </span>
          <span>0–100 Normalized Composite Scale</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--paper)] border-b border-[var(--border)] text-[11px] font-mono uppercase tracking-wider text-[var(--mist)]">
                <th className="py-3 px-4 font-bold">Rank</th>
                <th className="py-3 px-4 font-bold">Model & Provider</th>
                <th
                  onClick={() => handleSort("composite")}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-[var(--signal)] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>AA Intelligence Index</span>
                    <ArrowUpDown className="w-3 h-3 text-[var(--signal)]" />
                  </div>
                </th>
                <th className="py-3 px-4 font-bold">Speed</th>
                <th className="py-3 px-4 font-bold">Latency (TTFT)</th>
                <th className="py-3 px-4 font-bold">Context</th>
                <th
                  onClick={() => handleSort("frontend")}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-[var(--signal)] transition-colors"
                >
                  Frontend
                </th>
                <th
                  onClick={() => handleSort("game")}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-[var(--signal)] transition-colors"
                >
                  Game Dev
                </th>
                <th
                  onClick={() => handleSort("agentic")}
                  className="py-3 px-4 font-bold cursor-pointer hover:text-[var(--signal)] transition-colors"
                >
                  Agentic
                </th>
                <th className="py-3 px-4 font-bold">Pricing (1M Tokens)</th>
                <th className="py-3 px-4 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-xs font-mono text-[var(--mist)]">
                    No models match your current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredModels.map((model, idx) => (
                  <tr
                    key={model.id}
                    className="hover:bg-[var(--fog)]/60 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-[var(--ink)]">
                      #{idx + 1}
                    </td>

                    <td className="py-4 px-4">
                      <Link
                        href={`/models/${model.slug}`}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded bg-[var(--ink)] text-[var(--paper)] font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {model.logo}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--ink)] group-hover:text-[var(--signal)] transition-colors flex items-center gap-2">
                            <span>{model.name}</span>
                            {model.isOpenWeight && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[var(--pass)]/10 text-[var(--pass)] border border-[var(--pass)]/20 font-semibold">
                                Open
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[var(--mist)] font-medium">
                            {model.provider}
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <VerdictDial
                          score={model.composite}
                          size="sm"
                          showNeedle={false}
                          showValue={true}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-[var(--ink)]">
                      <div className="font-bold">{model.tokensPerSec || "120 t/s"}</div>
                      <div className="text-[10px] text-[var(--mist)]">throughput</div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-[var(--ink)]">
                      <div className="font-bold">{model.ttftMs || "220ms"}</div>
                      <div className="text-[10px] text-[var(--mist)]">first token</div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-[var(--ink)]">
                      <span className="px-2 py-0.5 rounded bg-[var(--fog)] border border-[var(--border)] text-[var(--ink)] font-bold">
                        {model.contextWindow || "1M"}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-[var(--ink)]">
                      {model.frontend.toFixed(1)}
                    </td>
                    <td className="py-4 px-4 font-mono text-[var(--ink)]">
                      {model.game.toFixed(1)}
                    </td>
                    <td className="py-4 px-4 font-mono text-[var(--ink)]">
                      {model.agentic.toFixed(1)}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-[var(--mist)]">
                      <div>In: {model.priceInput}</div>
                      <div>Out: {model.priceOutput}</div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/models/${model.slug}`}
                        className="inline-flex items-center gap-1 p-2 rounded-md hover:bg-[var(--paper)] text-[var(--signal)]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
