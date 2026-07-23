"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerdictDial from "@/components/ui/verdict-dial";
import ProviderLogo from "@/components/ui/provider-logo";
import {
  ArrowUpDown,
  ChevronRight,
  Zap,
  Search,
  Brain,
  Shield,
  Gauge,
  Clock,
  Coins,
  Layers,
  RefreshCw,
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

function SkeletonRow() {
  return (
    <tr className="border-b border-[var(--border)]">
      <td className="py-3.5 px-4">
        <div className="h-3 w-6 rounded-md bg-[var(--border)] animate-pulse mx-auto" />
      </td>
      <td className="py-3.5 px-4 sticky left-0 bg-[var(--paper)] border-r border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--border)] animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded-md bg-[var(--border)] animate-pulse" />
            <div className="h-2 w-16 rounded-md bg-[var(--border)] animate-pulse" />
          </div>
        </div>
      </td>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-3 w-12 rounded-md bg-[var(--border)] animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function LeaderboardTable({ models }: { models: LeaderboardModelItem[] }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "proprietary" | "open" | "reasoning">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"composite" | "frontend" | "game" | "svg" | "agentic">("composite");
  const [sortAsc, setSortAsc] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const filteredModels = useMemo(() => {
    return models
      .filter((m) => {
        if (activeFilter === "proprietary" && m.isOpenWeight) return false;
        if (activeFilter === "open" && !m.isOpenWeight) return false;
        if (activeFilter === "reasoning") {
          const nameLower = m.name.toLowerCase();
          if (!nameLower.includes("thinking") && !nameLower.includes("reasoning") && !nameLower.includes("o1") && !nameLower.includes("sol")) {
            return false;
          }
        }
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

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/models/sync", { method: "POST" });
      router.refresh(); // soft refresh — no full page flash
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* BENCHMARK INDEX CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Intelligence Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-tight bg-[var(--signal)]/10 text-[var(--signal)] border border-[var(--signal)]/20">
              Intelligence
            </span>
            <Brain className="w-4 h-4 text-[var(--signal)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Claude Fable 5</strong> &amp; <strong className="text-[var(--ink)] font-semibold">GPT-5.6 Sol</strong> lead composite reasoning &amp; coding accuracy.
          </p>
          <div className="text-[10px] font-mono text-[var(--pass)]">SOTA S-Tier Rankings</div>
        </div>

        {/* Speed Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-tight bg-[var(--gauge)]/10 text-[var(--gauge)] border border-[var(--gauge)]/20">
              Output Speed
            </span>
            <Gauge className="w-4 h-4 text-[var(--gauge)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Gemini 3.6 Flash</strong> &amp; <strong className="text-[var(--ink)] font-semibold">Mercury 2</strong> top generation throughput (&gt;210 tokens/sec).
          </p>
          <div className="text-[10px] font-mono text-[var(--gauge)]">Ultra Low Throughput Latency</div>
        </div>

        {/* Latency (TTFT) Card — now uses --signal-alt instead of hardcoded purple */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-tight bg-[var(--signal-alt)]/10 text-[var(--signal-alt)] border border-[var(--signal-alt)]/20">
              Latency (TTFT)
            </span>
            <Clock className="w-4 h-4 text-[var(--signal-alt)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Gemini 2.5 Flash-Lite</strong> &amp; <strong className="text-[var(--ink)] font-semibold">North Mini Code</strong> yield fastest first token response (&lt;140ms).
          </p>
          <div className="text-[10px] font-mono text-[var(--signal-alt)]">Realtime Voice &amp; Chat</div>
        </div>

        {/* Cost Efficiency Card */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-tight bg-[var(--pass)]/10 text-[var(--pass)] border border-[var(--pass)]/20">
              Cost per Task
            </span>
            <Coins className="w-4 h-4 text-[var(--pass)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">DeepSeek V4 Pro</strong> &amp; <strong className="text-[var(--ink)] font-semibold">MiMo V2.5</strong> offer SOTA intelligence at $0.43/1M input tokens.
          </p>
          <div className="text-[10px] font-mono text-[var(--pass)]">Lowest Cost per Sample</div>
        </div>

        {/* Context Window Card — uses --signal instead of hardcoded blue */}
        <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--border)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-tight bg-[var(--signal)]/10 text-[var(--signal)] border border-[var(--signal)]/20">
              Context Window
            </span>
            <Layers className="w-4 h-4 text-[var(--signal)]" />
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed">
            <strong className="text-[var(--ink)] font-semibold">Llama 4 Scout</strong> &amp; <strong className="text-[var(--ink)] font-semibold">Grok 4.20</strong> support up to 2M–10M token context windows.
          </p>
          <div className="text-[10px] font-mono text-[var(--signal)]">Whole Repository Analysis</div>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tab Group — proper ARIA roles */}
        <div role="tablist" aria-label="Filter models by type" className="flex flex-wrap items-center gap-2 text-xs font-sans">
          {(
            [
              { id: "all", label: `All ${models.length} Models`, icon: null },
              { id: "proprietary", label: "Proprietary", icon: <Shield className="w-3.5 h-3.5" /> },
              { id: "open", label: "Open Weight", icon: <Zap className="w-3.5 h-3.5 text-[var(--pass)]" /> },
              { id: "reasoning", label: "Extended Reasoning", icon: <Brain className="w-3.5 h-3.5 text-[var(--gauge)]" /> },
            ] as { id: typeof activeFilter; label: string; icon: React.ReactNode }[]
          ).map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeFilter === tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--signal)] ${
                activeFilter === tab.id
                  ? "bg-[var(--ink)] text-[var(--paper)] shadow-xs"
                  : "bg-[var(--paper)] text-[var(--mist)] border border-[var(--border)] hover:text-[var(--ink)] hover:bg-[var(--fog)]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search & Sync */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-56">
            <Search className="w-4 h-4 text-[var(--mist)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name..."
              aria-label="Search models"
              className="w-full pl-9 pr-3 py-1.5 bg-[var(--paper)] border border-[var(--border)] rounded-lg text-xs font-sans text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)] focus:ring-offset-0 transition-colors"
            />
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            title="Fetch latest rankings & token prices from external market index"
            className="px-3 py-1.5 rounded-lg bg-[var(--paper)] border border-[var(--border)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--fog)] flex items-center gap-1.5 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--signal)] disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--mist)] ${syncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{syncing ? "Syncing..." : "Sync Market"}</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--fog)] flex items-center justify-between font-mono text-xs text-[var(--mist)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--pass)]" />
            <span className="font-semibold text-[var(--ink)] tracking-tight font-sans">
              Canonical AI Coding Model Rankings ({filteredModels.length} Models)
            </span>
          </div>
          <span className="text-[11px] text-[var(--mist)] font-sans">Auto-Sync Active</span>
        </div>

        {/* Mobile Card List View (<768px) */}
        <div className="block md:hidden divide-y divide-[var(--border)]">
          {models.length === 0 ? (
            <div className="p-8 text-center text-sm font-sans text-[var(--mist)]">Loading models...</div>
          ) : filteredModels.length === 0 ? (
            <div className="p-8 text-center text-sm font-sans text-[var(--mist)]">No models match your current filter.</div>
          ) : (
            filteredModels.map((model, idx) => (
              <div key={model.id} className="p-4 space-y-3 bg-[var(--paper)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-[var(--mist)]">#{idx + 1}</span>
                    <ProviderLogo provider={model.provider} size="sm" />
                    <div>
                      <Link href={`/models/${model.slug}`} className="font-semibold text-sm text-[var(--ink)] hover:text-[var(--signal)] transition-colors flex items-center gap-1.5">
                        <span>{model.name}</span>
                        {model.isOpenWeight && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[var(--pass)]/10 text-[var(--pass)] font-semibold border border-[var(--pass)]/20">
                            Open
                          </span>
                        )}
                      </Link>
                      <div className="text-[11px] text-[var(--mist)]">{model.provider}</div>
                    </div>
                  </div>
                  <VerdictDial score={model.composite} size="sm" showNeedle={false} showValue={true} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[var(--mist)] pt-1 border-t border-[var(--border)]/60">
                  <div className="flex items-center gap-3">
                    <span>Speed: <strong className="text-[var(--ink)] font-semibold">{model.tokensPerSec || "120 t/s"}</strong></span>
                    <span>Context: <strong className="text-[var(--ink)] font-semibold">{model.contextWindow || "1M"}</strong></span>
                  </div>
                  <Link
                    href={`/models/${model.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[var(--signal)] hover:underline"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Data Table (>=768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="AI model leaderboard">
            <thead>
              <tr className="bg-[var(--fog)]/40 border-b border-[var(--border)] text-[11px] font-sans font-semibold text-[var(--mist)]">
                <th scope="col" className="py-3 px-4 w-12 text-center">#</th>
                <th scope="col" className="py-3 px-4 sticky left-0 bg-[var(--paper)] z-10 border-r border-[var(--border)] min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                  Model &amp; Provider
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("composite")}
                  className="py-3 px-4 cursor-pointer hover:text-[var(--ink)] transition-colors select-none"
                  aria-sort={sortBy === "composite" ? (sortAsc ? "ascending" : "descending") : "none"}
                >
                  <div className="flex items-center gap-1">
                    <span>Score</span>
                    <ArrowUpDown className="w-3 h-3 text-[var(--signal)]" />
                  </div>
                </th>
                <th scope="col" className="py-3 px-4 hidden sm:table-cell">Speed</th>
                <th scope="col" className="py-3 px-4 hidden lg:table-cell">Latency</th>
                <th scope="col" className="py-3 px-4 hidden lg:table-cell">Context</th>
                <th
                  scope="col"
                  onClick={() => handleSort("frontend")}
                  className="py-3 px-4 cursor-pointer hover:text-[var(--ink)] transition-colors select-none hidden md:table-cell"
                  aria-sort={sortBy === "frontend" ? (sortAsc ? "ascending" : "descending") : "none"}
                >
                  Frontend
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("game")}
                  className="py-3 px-4 cursor-pointer hover:text-[var(--ink)] transition-colors select-none hidden md:table-cell"
                  aria-sort={sortBy === "game" ? (sortAsc ? "ascending" : "descending") : "none"}
                >
                  Game Dev
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("agentic")}
                  className="py-3 px-4 cursor-pointer hover:text-[var(--ink)] transition-colors select-none hidden lg:table-cell"
                  aria-sort={sortBy === "agentic" ? (sortAsc ? "ascending" : "descending") : "none"}
                >
                  Agentic
                </th>
                <th scope="col" className="py-3 px-4 hidden lg:table-cell">Pricing /1M</th>
                <th scope="col" className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs font-sans">
              {models.length === 0 ? (
                // Skeleton loading state
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-sm font-sans text-[var(--mist)]">
                    No models match your current filter or search.
                  </td>
                </tr>
              ) : (
                filteredModels.map((model, idx) => (
                  <tr
                    key={model.id}
                    className="hover:bg-[var(--fog)]/60 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--mist)] text-center text-[11px]">
                      {idx + 1}
                    </td>

                    {/* STICKY LEFT MODEL COLUMN */}
                    <td className="py-3.5 px-4 sticky left-0 bg-[var(--paper)] z-10 border-r border-[var(--border)] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] group-hover:bg-[var(--fog)]/60">
                      <Link
                        href={`/models/${model.slug}`}
                        className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[var(--signal)] rounded-md"
                      >
                        <ProviderLogo provider={model.provider} size="sm" />
                        <div>
                          <div className="font-semibold text-sm text-[var(--ink)] group-hover:text-[var(--signal)] transition-colors flex items-center gap-1.5">
                            <span>{model.name}</span>
                            {model.isOpenWeight && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-[var(--pass)]/10 text-[var(--pass)] font-semibold border border-[var(--pass)]/20">
                                Open
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--mist)]">
                            {model.provider}
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <VerdictDial
                          score={model.composite}
                          size="sm"
                          showNeedle={false}
                          showValue={true}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-[var(--ink)] hidden sm:table-cell">
                      <div className="font-semibold">{model.tokensPerSec || "120 t/s"}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-[var(--ink)] hidden lg:table-cell">
                      <div className="font-semibold">{model.ttftMs || "220ms"}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-[var(--ink)] hidden lg:table-cell">
                      <span className="px-2 py-0.5 rounded-md bg-[var(--fog)] border border-[var(--border)] text-[var(--ink)] font-medium">
                        {model.contextWindow || "1M"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[var(--ink)] font-medium hidden md:table-cell">
                      {model.frontend.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--ink)] font-medium hidden md:table-cell">
                      {model.game.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--ink)] font-medium hidden lg:table-cell">
                      {model.agentic.toFixed(1)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--mist)] leading-tight hidden lg:table-cell">
                      <div>In: {model.priceInput}</div>
                      <div>Out: {model.priceOutput}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/models/${model.slug}`}
                        aria-label={`View details for ${model.name}`}
                        className="inline-flex items-center gap-1 p-1.5 rounded-lg hover:bg-[var(--fog)] text-[var(--mist)] hover:text-[var(--ink)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
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
