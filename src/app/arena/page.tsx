"use client";

import React, { useState } from "react";
import { Swords, ThumbsUp, RefreshCw, Sparkles, Code, Eye } from "lucide-react";

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
        body: JSON.stringify({
          modelAId: modelA.id,
          modelBId: modelB.id,
          winner,
        }),
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
        setModelA((prev) => ({
          ...prev,
          id: data.modelA.id,
          name: data.modelA.name,
          score: data.modelA.score,
          elo: data.modelA.elo,
        }));
        setModelB((prev) => ({
          ...prev,
          id: data.modelB.id,
          name: data.modelB.name,
          score: data.modelB.score,
          elo: data.modelB.elo,
        }));
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

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
              <Swords className="w-4 h-4" />
              <span>Head-to-Head Arena</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
              Blind Model Comparison
            </h1>
            <p className="text-sm text-[var(--mist)] max-w-2xl">
              Compare generated code outputs side-by-side without knowing model identities. Vote on quality to build crowd Elo ratings alongside AI judge scores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNewMatch}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--fog)] border border-[var(--border)] text-xs font-mono font-semibold text-[var(--ink)] hover:bg-[var(--paper)] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Fetching..." : "Surprise Pairing"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dual Signals Info Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--border)] space-y-1">
          <div className="font-bold text-[var(--signal)] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Signal 1: Auditable Multi-Judge Score</span>
          </div>
          <p className="text-[var(--mist)] font-sans">
            Rigorous rubric grading across Functionality, Craft, Design, Creativity, & Fidelity.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-[var(--paper)] border border-[var(--border)] space-y-1">
          <div className="font-bold text-[var(--gauge)] flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4" />
            <span>Signal 2: Blind Crowd Elo Rating</span>
          </div>
          <p className="text-[var(--mist)] font-sans">
            Human preference signal gathered from blind head-to-head votes.
          </p>
        </div>
      </div>

      {/* Side-by-side Sandboxed Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Alpha Container */}
        <div
          className={`rounded-xl bg-[var(--paper)] border ${
            voted && selectedWinner === "A"
              ? "border-[var(--pass)] shadow-md"
              : "border-[var(--border)]"
          } p-6 space-y-4`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-xs">
            <span className="font-bold text-[var(--ink)] text-sm">
              {blindMode ? "Model Alpha (Anonymous)" : modelA.name}
            </span>
            {!blindMode && (
              <div className="flex items-center gap-3">
                <span className="text-[var(--signal)] font-bold">Score: {modelA.score}</span>
                <span className="text-[var(--gauge)] font-bold">Elo: {modelA.elo}</span>
              </div>
            )}
          </div>

          {/* View Mode Toggle Tabs */}
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex gap-2">
              <button
                onClick={() => setViewTabA("preview")}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                  viewTabA === "preview"
                    ? "bg-[var(--signal)] text-white font-bold"
                    : "bg-[var(--fog)] text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Render</span>
              </button>
              <button
                onClick={() => setViewTabA("code")}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                  viewTabA === "code"
                    ? "bg-[var(--signal)] text-white font-bold"
                    : "bg-[var(--fog)] text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>
            <span className="text-[10px] text-[var(--pass)]">Sandbox CSP Isolated</span>
          </div>

          {/* Output Window */}
          <div className="h-80 rounded-lg bg-[var(--fog)] border border-[var(--border)] overflow-hidden">
            {viewTabA === "preview" ? (
              <iframe
                srcDoc={modelA.code}
                title="Model Alpha Live Preview"
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
            className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all ${
              voted
                ? selectedWinner === "A"
                  ? "bg-[var(--pass)] text-white shadow-md"
                  : "bg-[var(--fog)] text-[var(--mist)]"
                : "bg-[var(--signal)] text-white hover:bg-[var(--signal-hover)] active:scale-95"
            }`}
          >
            {voted
              ? selectedWinner === "A"
                ? "✓ Voted Model Alpha (Winner)"
                : "Model Alpha"
              : "Vote Output Alpha is Better"}
          </button>
        </div>

        {/* Model Beta Container */}
        <div
          className={`rounded-xl bg-[var(--paper)] border ${
            voted && selectedWinner === "B"
              ? "border-[var(--pass)] shadow-md"
              : "border-[var(--border)]"
          } p-6 space-y-4`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-xs">
            <span className="font-bold text-[var(--ink)] text-sm">
              {blindMode ? "Model Beta (Anonymous)" : modelB.name}
            </span>
            {!blindMode && (
              <div className="flex items-center gap-3">
                <span className="text-[var(--signal)] font-bold">Score: {modelB.score}</span>
                <span className="text-[var(--gauge)] font-bold">Elo: {modelB.elo}</span>
              </div>
            )}
          </div>

          {/* View Mode Toggle Tabs */}
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex gap-2">
              <button
                onClick={() => setViewTabB("preview")}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                  viewTabB === "preview"
                    ? "bg-[var(--signal)] text-white font-bold"
                    : "bg-[var(--fog)] text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Render</span>
              </button>
              <button
                onClick={() => setViewTabB("code")}
                className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                  viewTabB === "code"
                    ? "bg-[var(--signal)] text-white font-bold"
                    : "bg-[var(--fog)] text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
            </div>
            <span className="text-[10px] text-[var(--pass)]">Sandbox CSP Isolated</span>
          </div>

          {/* Output Window */}
          <div className="h-80 rounded-lg bg-[var(--fog)] border border-[var(--border)] overflow-hidden">
            {viewTabB === "preview" ? (
              <iframe
                srcDoc={modelB.code}
                title="Model Beta Live Preview"
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
            className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all ${
              voted
                ? selectedWinner === "B"
                  ? "bg-[var(--pass)] text-white shadow-md"
                  : "bg-[var(--fog)] text-[var(--mist)]"
                : "bg-[var(--signal)] text-white hover:bg-[var(--signal-hover)] active:scale-95"
            }`}
          >
            {voted
              ? selectedWinner === "B"
                ? "✓ Voted Model Beta (Winner)"
                : "Model Beta"
              : "Vote Output Beta is Better"}
          </button>
        </div>
      </div>
    </div>
  );
}
