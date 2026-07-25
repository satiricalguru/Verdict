"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Swords,
  RefreshCw,
  Code,
  Eye,
  Sparkles,
  Scale,
  KeyRound,
  Play,
  ShieldCheck,
  HelpCircle,
  ThumbsDown,
  Loader2,
} from "lucide-react";

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  composite: number;
}

interface MatchModel {
  id: string;
  name: string;
  score: number;
  elo: number;
  code: string;
}

export default function ArenaPage() {
  const [matchMode, setMatchMode] = useState<"blind" | "direct">("blind");
  const [blindMode, setBlindMode] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<"A" | "B" | "TIE" | "BAD" | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingLive, setIsGeneratingLive] = useState(false);
  const [viewTabA, setViewTabA] = useState<"preview" | "code">("preview");
  const [viewTabB, setViewTabB] = useState<"preview" | "code">("preview");
  const [promptTitle, setPromptTitle] = useState("Realtime Financial Analytics Dashboard");
  const [customPromptInput, setCustomPromptInput] = useState("");
  const [voteNotice, setVoteNotice] = useState<string | null>(null);
  const [hasConnectedKeys, setHasConnectedKeys] = useState<boolean>(false);
  const [keyNotice, setKeyNotice] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [allModels, setAllModels] = useState<ModelOption[]>([]);
  const [selectedAId, setSelectedAId] = useState<string>("");
  const [selectedBId, setSelectedBId] = useState<string>("");

  const [modelA, setModelA] = useState<MatchModel>({
    id: "m1",
    name: "Model Alpha",
    score: 0,
    elo: 1500,
    code: "",
  });

  const [modelB, setModelB] = useState<MatchModel>({
    id: "m2",
    name: "Model Beta",
    score: 0,
    elo: 1500,
    code: "",
  });

  const handleFetchMatch = async (modelAId?: string, modelBId?: string) => {
    setIsRefreshing(true);
    setVoteNotice(null);
    setKeyNotice(null);
    try {
      const res = await fetch("/api/arena/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelAId, modelBId }),
      });
      const data = await res.json();
      if (data.modelA && data.modelB) {
        if (data.title) setPromptTitle(data.title);
        setModelA({
          id: data.modelA.id,
          name: data.modelA.name,
          score: data.modelA.score,
          elo: data.modelA.elo,
          code: data.modelA.code,
        });
        setModelB({
          id: data.modelB.id,
          name: data.modelB.name,
          score: data.modelB.score,
          elo: data.modelB.elo,
          code: data.modelB.code,
        });
        setSelectedAId(data.modelA.id);
        setSelectedBId(data.modelB.id);
        setVoted(false);
        // In direct mode, never mask names
        setBlindMode(matchMode === "blind");
        setSelectedWinner(null);
        setIsDemoMode(true); // Static templates until real samples exist
      }
    } catch (e) {
      console.error("Failed to load match:", e);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    // Parallel fetch: keys, models, initial match
    Promise.all([
      fetch("/api/keys").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/models").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/arena/match", { method: "POST" }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([keysData, modelsData, matchData]) => {
      if (!active) return;

      if (keysData?.keys?.length > 0) setHasConnectedKeys(true);
      if (modelsData?.models) setAllModels(modelsData.models);

      if (matchData?.modelA && matchData?.modelB) {
        if (matchData.title) setPromptTitle(matchData.title);
        setModelA({
          id: matchData.modelA.id,
          name: matchData.modelA.name,
          score: matchData.modelA.score,
          elo: matchData.modelA.elo,
          code: matchData.modelA.code,
        });
        setModelB({
          id: matchData.modelB.id,
          name: matchData.modelB.name,
          score: matchData.modelB.score,
          elo: matchData.modelB.elo,
          code: matchData.modelB.code,
        });
        setSelectedAId(matchData.modelA.id);
        setSelectedBId(matchData.modelB.id);
      }

      setIsLoading(false);
    });

    return () => { active = false; };
  }, []);

  const handleRunCustomMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPromptInput.trim()) return;

    if (!hasConnectedKeys) {
      setKeyNotice(
        "API Key Required: To generate live model completions for your custom prompt, connect your provider API key in Settings first."
      );
      setVoteNotice(null);
      return;
    }

    setIsGeneratingLive(true);
    setVoteNotice(null);
    setKeyNotice(null);

    try {
      setPromptTitle(customPromptInput.trim());
      await handleFetchMatch(selectedAId, selectedBId);
    } catch (err) {
      console.error("Live arena run error:", err);
    } finally {
      setIsGeneratingLive(false);
    }
  };

  const handleVote = async (winner: "A" | "B" | "TIE" | "BAD") => {
    setSelectedWinner(winner);
    setVoted(true);
    setBlindMode(false); // Reveal identities after voting
    try {
      const res = await fetch("/api/arena/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelAId: modelA.id, modelBId: modelB.id, winner }),
      });
      const data = await res.json();
      if (data.success) {
        if (winner === "BAD") {
          setVoteNotice(`✓ Vote recorded: Both outputs marked as poor quality. No Elo change.`);
        } else {
          setVoteNotice(
            `✓ Vote recorded! Arena Elo: ${data.modelA.name} (${data.modelA.arenaElo}) vs ${data.modelB.name} (${data.modelB.arenaElo})`
          );
        }
      } else if (data.error) {
        setVoteNotice(`⚠ ${data.error}`);
      }
    } catch (e) {
      console.error("Vote error:", e);
    }
  };

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--signal)] ${
      active
        ? "bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)] shadow-xs"
        : "text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]"
    }`;

  const voteButtonClass = (side: "A" | "B") => {
    if (voted) {
      return selectedWinner === side
        ? "bg-[var(--pass)] text-black shadow-xs"
        : "bg-[var(--fog)] text-[var(--mist)] border border-[var(--border)]";
    }
    return "bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 active:scale-[0.98]";
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[var(--signal)] animate-spin" />
          <span className="text-sm font-mono text-[var(--mist)]">Loading Arena Match...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 font-sans">
      {/* Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)] uppercase tracking-wider font-semibold">
              <Swords className="w-4 h-4 text-[var(--signal)]" />
              <span>Head-to-Head Arena</span>
            </div>
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-[var(--ink)] tracking-tight leading-tight">
              Model Comparison Arena
            </h1>
            <p className="text-sm text-[var(--mist)] max-w-2xl leading-relaxed">
              Compare AI model output side-by-side. In{" "}
              <span className="text-[var(--ink)] font-semibold">Blind Mode</span>, identities are masked
              as <span className="text-[var(--signal)] font-mono">Model Alpha</span> &amp;{" "}
              <span className="text-[var(--signal)] font-mono">Model Beta</span> to eliminate bias.
              Vote to reveal their real names and updated Elo ratings!
            </p>
          </div>

          {/* Mode Switcher & Surprise Pairing */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex p-1 bg-[var(--fog)] border border-[var(--border)] rounded-lg font-mono text-xs font-semibold">
              <button
                onClick={() => {
                  setMatchMode("blind");
                  if (!voted) setBlindMode(true);
                }}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  matchMode === "blind"
                    ? "bg-[var(--paper)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                Blind Match
              </button>
              <button
                onClick={() => {
                  setMatchMode("direct");
                  setBlindMode(false); // #4: Never mask in direct mode
                }}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  matchMode === "direct"
                    ? "bg-[var(--paper)] text-[var(--ink)] shadow-xs"
                    : "text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                Select Models
              </button>
            </div>

            <button
              onClick={() => handleFetchMatch()}
              disabled={isRefreshing || isGeneratingLive}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--signal)] text-black font-mono font-bold text-xs hover:bg-[var(--signal-hover)] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Pairing..." : "Surprise Pairing"}</span>
            </button>
          </div>
        </div>

        {/* Direct Model Selection Bar */}
        {matchMode === "direct" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--fog)] border border-[var(--border)]">
            <div>
              <label className="block text-xs font-mono text-[var(--mist)] uppercase tracking-wider mb-1.5">
                Model A (Left Panel)
              </label>
              <select
                value={selectedAId}
                onChange={(e) => {
                  setSelectedAId(e.target.value);
                  handleFetchMatch(e.target.value, selectedBId);
                }}
                className="w-full p-2.5 text-xs bg-[var(--paper)] border border-[var(--border)] rounded-lg text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--signal)]"
              >
                {allModels.map((m) => (
                  <option key={`a-${m.id}`} value={m.id}>
                    {m.provider} — {m.name} ({m.composite} pts)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--mist)] uppercase tracking-wider mb-1.5">
                Model B (Right Panel)
              </label>
              <select
                value={selectedBId}
                onChange={(e) => {
                  setSelectedBId(e.target.value);
                  handleFetchMatch(selectedAId, e.target.value);
                }}
                className="w-full p-2.5 text-xs bg-[var(--paper)] border border-[var(--border)] rounded-lg text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--signal)]"
              >
                {allModels.map((m) => (
                  <option key={`b-${m.id}`} value={m.id}>
                    {m.provider} — {m.name} ({m.composite} pts)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Custom Prompt Bar */}
        <form onSubmit={handleRunCustomMatch} className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={customPromptInput}
              onChange={(e) => setCustomPromptInput(e.target.value)}
              placeholder="Enter a custom prompt to test both models live (requires API key)…"
              className="w-full bg-[var(--fog)] border border-[var(--border)] rounded-lg pl-3.5 pr-10 py-2.5 text-xs font-mono text-[var(--ink)] placeholder-[var(--mist)] focus:outline-none focus:border-[var(--signal)]"
            />
          </div>
          <button
            type="submit"
            disabled={isGeneratingLive || !customPromptInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--paper)] border border-[var(--border)] text-[var(--ink)] font-mono font-bold text-xs hover:bg-[var(--fog)] transition-colors disabled:opacity-40 shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[var(--signal)]" />
            <span>{isGeneratingLive ? "Generating..." : "Run Custom Match"}</span>
          </button>
        </form>

        {/* Status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2 pt-1">
          <div className="flex items-center gap-2 text-[var(--mist)]">
            <span className="text-[var(--ink)] font-semibold">Active Prompt:</span>
            <span className="text-[var(--signal)]">{promptTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1 text-[var(--mist)] text-[11px]"
              title="Model identities are masked until you vote"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[var(--signal)]" />
              <span>{blindMode ? "Blind Mask Active" : "Identities Revealed"}</span>
            </div>

            {hasConnectedKeys ? (
              <span className="inline-flex items-center gap-1 text-[var(--pass)]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>API Keys Connected</span>
              </span>
            ) : (
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-1 text-amber-400 hover:underline"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Connect API Keys</span>
              </Link>
            )}
          </div>
        </div>

        {/* Demo mode banner (#5) */}
        {isDemoMode && (
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>
              Demo Mode: Previews are sample templates for illustration. Connect your API keys in{" "}
              <Link href="/dashboard/settings" className="underline font-bold">
                Settings
              </Link>{" "}
              and use &quot;Run Custom Match&quot; to generate live model completions.
            </span>
          </div>
        )}

        {/* Key notice */}
        {keyNotice && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>{keyNotice}</span>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-3 py-1 rounded bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shrink-0"
            >
              Connect Key
            </Link>
          </div>
        )}

        {/* Vote notice */}
        {voteNotice && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{voteNotice}</span>
          </div>
        )}
      </div>

      {/* Vote Actions Bar */}
      {!voted && (
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => handleVote("TIE")}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--mist)] hover:text-[var(--ink)] hover:border-[var(--mist)] transition-colors cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Both Are Equally Good (Tie)</span>
          </button>
          <button
            onClick={() => handleVote("BAD")}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--fog)] border border-[var(--border)] text-xs font-mono text-[var(--mist)] hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Both Are Bad</span>
          </button>
        </div>
      )}

      {/* Side-by-side Sandboxed Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Alpha Container */}
        <div
          className={`rounded-xl bg-[var(--paper)] border ${
            voted && selectedWinner === "A"
              ? "border-[var(--pass)] shadow-lg"
              : "border-[var(--border)]"
          } p-6 space-y-4 transition-all`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="font-sans font-bold text-sm text-[var(--ink)]">
              {blindMode ? "Model Alpha" : modelA.name}
            </span>
            {!blindMode && (
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[var(--signal)] font-bold">Score: {modelA.score}</span>
                <span className="text-[var(--gauge)] font-bold">Elo: {modelA.elo}</span>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <button
                onClick={() => setViewTabA("preview")}
                aria-pressed={viewTabA === "preview"}
                className={tabClass(viewTabA === "preview")}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Render</span>
              </button>
              <button
                onClick={() => setViewTabA("code")}
                aria-pressed={viewTabA === "code"}
                className={tabClass(viewTabA === "code")}
              >
                <Code className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>
            <span className="text-[10px] font-mono text-[var(--pass)]">Sandboxed CSP</span>
          </div>

          {/* Output Window */}
          <div className="h-64 sm:h-80 lg:h-72 xl:h-80 rounded-xl bg-[var(--fog)] border border-[var(--border)] overflow-hidden">
            {modelA.code ? (
              viewTabA === "preview" ? (
                <iframe
                  srcDoc={modelA.code}
                  title={`${blindMode ? "Model Alpha" : modelA.name} preview`}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="p-4 text-xs font-mono text-[var(--ink)] overflow-auto h-full leading-relaxed">
                  {modelA.code}
                </pre>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-xs font-mono text-[var(--mist)]">Waiting for match data...</span>
              </div>
            )}
          </div>

          {/* Vote Action */}
          <button
            disabled={voted}
            onClick={() => handleVote("A")}
            className={`w-full py-2.5 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer ${voteButtonClass("A")}`}
          >
            {voted
              ? selectedWinner === "A"
                ? `✓ Voted ${blindMode ? "Model Alpha" : modelA.name}`
                : blindMode
                  ? "Model Alpha"
                  : modelA.name
              : "Vote Alpha is Better"}
          </button>
        </div>

        {/* Model Beta Container */}
        <div
          className={`rounded-xl bg-[var(--paper)] border ${
            voted && selectedWinner === "B"
              ? "border-[var(--pass)] shadow-lg"
              : "border-[var(--border)]"
          } p-6 space-y-4 transition-all`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="font-sans font-bold text-sm text-[var(--ink)]">
              {blindMode ? "Model Beta" : modelB.name}
            </span>
            {!blindMode && (
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[var(--signal)] font-bold">Score: {modelB.score}</span>
                <span className="text-[var(--gauge)] font-bold">Elo: {modelB.elo}</span>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <button
                onClick={() => setViewTabB("preview")}
                aria-pressed={viewTabB === "preview"}
                className={tabClass(viewTabB === "preview")}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Render</span>
              </button>
              <button
                onClick={() => setViewTabB("code")}
                aria-pressed={viewTabB === "code"}
                className={tabClass(viewTabB === "code")}
              >
                <Code className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>
            <span className="text-[10px] font-mono text-[var(--pass)]">Sandboxed CSP</span>
          </div>

          {/* Output Window */}
          <div className="h-64 sm:h-80 lg:h-72 xl:h-80 rounded-xl bg-[var(--fog)] border border-[var(--border)] overflow-hidden">
            {modelB.code ? (
              viewTabB === "preview" ? (
                <iframe
                  srcDoc={modelB.code}
                  title={`${blindMode ? "Model Beta" : modelB.name} preview`}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="p-4 text-xs font-mono text-[var(--ink)] overflow-auto h-full leading-relaxed">
                  {modelB.code}
                </pre>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-xs font-mono text-[var(--mist)]">Waiting for match data...</span>
              </div>
            )}
          </div>

          {/* Vote Action */}
          <button
            disabled={voted}
            onClick={() => handleVote("B")}
            className={`w-full py-2.5 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer ${voteButtonClass("B")}`}
          >
            {voted
              ? selectedWinner === "B"
                ? `✓ Voted ${blindMode ? "Model Beta" : modelB.name}`
                : blindMode
                  ? "Model Beta"
                  : modelB.name
              : "Vote Beta is Better"}
          </button>
        </div>
      </div>
    </div>
  );
}
