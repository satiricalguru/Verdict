"use client";

import React, { useState } from "react";
import { Swords, ThumbsUp, RefreshCw, Code, Eye } from "lucide-react";

export default function ArenaPage() {
  const [blindMode, setBlindMode] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<"A" | "B" | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewTabA, setViewTabA] = useState<"preview" | "code">("preview");
  const [viewTabB, setViewTabB] = useState<"preview" | "code">("preview");

  const [modelA, setModelA] = useState({
    id: "m1",
    name: "Claude Fable 5",
    score: 98.4,
    elo: 1680,
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0b0f19; color: #fff; font-family: sans-serif; padding: 20px; }
    .card { background: #161c2e; border: 1px solid #2a3450; padding: 20px; border-radius: 8px; }
    .btn { background: #4f40ff; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .bar { height: 10px; background: #3d2eff; border-radius: 5px; width: 85%; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <h3>Realtime Analytics Widget</h3>
    <p>Live memory utilization & task throughput.</p>
    <div class="bar"></div>
    <br/>
    <button class="btn" onclick="alert('Running live task!')">Trigger Stream Task</button>
  </div>
</body>
</html>`,
  });

  const [modelB, setModelB] = useState({
    id: "m2",
    name: "GPT-5.6 Sol",
    score: 96.2,
    elo: 1655,
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0a0a0f; color: #e2e8f0; font-family: monospace; padding: 20px; }
    .panel { background: #12121a; border: 1px dashed #f5a623; padding: 20px; border-radius: 6px; }
    .chip { background: #f5a623; color: #000; font-weight: bold; padding: 2px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="panel">
    <div>Status: <span class="chip">ACTIVE</span></div>
    <h4>System Resource Gauge</h4>
    <p>CPU Concurrency: 64 Workers | Memory: 4.2 GB</p>
  </div>
</body>
</html>`,
  });

  const handleVote = async (winner: "A" | "B") => {
    setSelectedWinner(winner);
    setVoted(true);
    setBlindMode(false);
    try {
      await fetch("/api/arena/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelAId: modelA.id, modelBId: modelB.id, winner }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewMatch = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/arena/match", { method: "POST" });
      const data = await res.json();
      if (data.modelA && data.modelB) {
        setModelA((prev) => ({ ...prev, id: data.modelA.id, name: data.modelA.name, score: data.modelA.score, elo: data.modelA.elo }));
        setModelB((prev) => ({ ...prev, id: data.modelB.id, name: data.modelB.name, score: data.modelB.score, elo: data.modelB.elo }));
        setVoted(false);
        setBlindMode(true);
        setSelectedWinner(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)] ${
      active
        ? "bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)] shadow-xs"
        : "text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]/60"
    }`;

  const voteButtonClass = (side: "A" | "B") => {
    if (voted) {
      return selectedWinner === side
        ? "bg-[var(--pass)] text-white shadow-xs"
        : "bg-[var(--fog)] text-[var(--mist)] border border-[var(--border)]";
    }
    return "bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 active:scale-[0.98]";
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
              <Swords className="w-4 h-4" />
              <span>Head-to-Head Arena</span>
            </div>
            {/* h1 — font-sans font-semibold */}
            <h1 className="font-sans font-semibold text-2xl sm:text-3xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
              Blind Model Comparison
            </h1>
            {/* Collapsed dual-signal description — no redundant info cards */}
            <p className="text-sm text-[var(--mist)] max-w-2xl leading-relaxed">
              Compare AI output quality blind — then reveal model identities. Your votes build crowd Elo ratings (
              <ThumbsUp className="w-3.5 h-3.5 inline -mt-0.5 text-[var(--gauge)]" />
              ) alongside auditable multi-judge scores across Functionality, Craft, Design, and Fidelity.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleNewMatch}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--fog)] border border-[var(--border)] text-xs font-semibold text-[var(--ink)] hover:bg-[var(--paper)] transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Fetching..." : "Surprise Pairing"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-side Sandboxed Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Alpha Container */}
        <div
          className={`rounded-xl bg-[var(--paper)] border ${
            voted && selectedWinner === "A"
              ? "border-[var(--pass)]"
              : "border-[var(--border)]"
          } p-6 space-y-4 transition-colors`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="font-sans font-semibold text-sm text-[var(--ink)]">
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
            <span className="text-[10px] font-mono text-[var(--pass)]">Sandbox CSP</span>
          </div>

          {/* Output Window — responsive height */}
          <div className="h-64 sm:h-80 lg:h-72 xl:h-80 rounded-xl bg-[var(--fog)] border border-[var(--border)] overflow-hidden">
            {viewTabA === "preview" ? (
              <iframe
                srcDoc={modelA.code}
                title={`${blindMode ? "Anonymous Model Alpha" : modelA.name} — AI generated UI preview`}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            ) : (
              <pre className="p-4 text-xs font-mono text-[var(--ink)] overflow-auto h-full leading-relaxed">
                {modelA.code}
              </pre>
            )}
          </div>

          {/* Vote Action */}
          <button
            disabled={voted}
            onClick={() => handleVote("A")}
            aria-label="Vote: Model Alpha output is better"
            aria-pressed={voted && selectedWinner === "A"}
            aria-disabled={voted}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2 ${voteButtonClass("A")}`}
          >
            {voted
              ? selectedWinner === "A"
                ? "✓ Voted Model Alpha"
                : "Model Alpha"
              : "Vote Alpha is Better"}
          </button>
        </div>

        {/* Model Beta Container */}
        <div
          className={`rounded-xl bg-[var(--paper)] border ${
            voted && selectedWinner === "B"
              ? "border-[var(--pass)]"
              : "border-[var(--border)]"
          } p-6 space-y-4 transition-colors`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <span className="font-sans font-semibold text-sm text-[var(--ink)]">
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
            <span className="text-[10px] font-mono text-[var(--pass)]">Sandbox CSP</span>
          </div>

          {/* Output Window — responsive height */}
          <div className="h-64 sm:h-80 lg:h-72 xl:h-80 rounded-xl bg-[var(--fog)] border border-[var(--border)] overflow-hidden">
            {viewTabB === "preview" ? (
              <iframe
                srcDoc={modelB.code}
                title={`${blindMode ? "Anonymous Model Beta" : modelB.name} — AI generated UI preview`}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            ) : (
              <pre className="p-4 text-xs font-mono text-[var(--ink)] overflow-auto h-full leading-relaxed">
                {modelB.code}
              </pre>
            )}
          </div>

          {/* Vote Action */}
          <button
            disabled={voted}
            onClick={() => handleVote("B")}
            aria-label="Vote: Model Beta output is better"
            aria-pressed={voted && selectedWinner === "B"}
            aria-disabled={voted}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2 ${voteButtonClass("B")}`}
          >
            {voted
              ? selectedWinner === "B"
                ? "✓ Voted Model Beta"
                : "Model Beta"
              : "Vote Beta is Better"}
          </button>
        </div>
      </div>
    </div>
  );
}
