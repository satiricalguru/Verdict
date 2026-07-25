"use client";

import React, { useState, useMemo } from "react";
import { Search, BookOpen, ChevronRight, Filter, Zap, Code2, Palette, Play, Cpu, Box, BarChart2, Film, Database, Globe } from "lucide-react";

const CATEGORIES = [
  { name: "All", count: 3900, icon: BookOpen },
  { name: "Frontend UI", count: 620, icon: Code2 },
  { name: "Game Dev", count: 480, icon: Play },
  { name: "SVG Art", count: 390, icon: Palette },
  { name: "Creative", count: 510, icon: Zap },
  { name: "Agentic", count: 340, icon: Cpu },
  { name: "3D Graphics", count: 290, icon: Box },
  { name: "Data Viz", count: 420, icon: BarChart2 },
  { name: "Animation", count: 360, icon: Film },
  { name: "Full-Stack", count: 310, icon: Database },
  { name: "Code Golf", count: 180, icon: Globe },
];

const DIFFICULTY = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

const PROMPTS = [
  { id: "p1", title: "Build a real-time analytics dashboard with live chart updates", category: "Frontend UI", difficulty: "Advanced", models: 57, topScore: 95.2 },
  { id: "p2", title: "Create a Canvas 2D space shooter with collision detection", category: "Game Dev", difficulty: "Intermediate", models: 52, topScore: 92.1 },
  { id: "p3", title: "Generate a geometric SVG mandala with gradient fills", category: "SVG Art", difficulty: "Beginner", models: 55, topScore: 89.4 },
  { id: "p4", title: "Write a short story set in a server farm at midnight", category: "Creative", difficulty: "Beginner", models: 54, topScore: 91.8 },
  { id: "p5", title: "Build a multi-step code refactoring agent pipeline", category: "Agentic", difficulty: "Expert", models: 48, topScore: 88.6 },
  { id: "p6", title: "Render a rotating 3D cube with WebGL", category: "3D Graphics", difficulty: "Advanced", models: 42, topScore: 87.3 },
  { id: "p7", title: "Create an interactive D3.js bar chart with transitions", category: "Data Viz", difficulty: "Intermediate", models: 51, topScore: 90.5 },
  { id: "p8", title: "Implement a scroll-triggered reveal animation system", category: "Animation", difficulty: "Intermediate", models: 49, topScore: 86.9 },
  { id: "p9", title: "Build a full auth flow with JWT and refresh tokens", category: "Full-Stack", difficulty: "Expert", models: 45, topScore: 85.4 },
  { id: "p10", title: "Build a responsive landing page with dark/light mode toggle", category: "Frontend UI", difficulty: "Beginner", models: 57, topScore: 94.1 },
  { id: "p11", title: "Create a physics-based platformer with gravity and jump", category: "Game Dev", difficulty: "Advanced", models: 50, topScore: 91.2 },
  { id: "p12", title: "Generate an isometric landscape SVG illustration", category: "SVG Art", difficulty: "Advanced", models: 47, topScore: 87.8 },
  { id: "p13", title: "Write a haiku generator with dynamic seasonal themes", category: "Creative", difficulty: "Beginner", models: 56, topScore: 93.3 },
  { id: "p14", title: "Implement a web scraping agent with retry logic", category: "Agentic", difficulty: "Advanced", models: 44, topScore: 86.1 },
  { id: "p15", title: "Build a Three.js particle system with mouse interaction", category: "3D Graphics", difficulty: "Expert", models: 38, topScore: 84.7 },
  { id: "p16", title: "Create a real-time stock chart with candlestick rendering", category: "Data Viz", difficulty: "Expert", models: 43, topScore: 89.2 },
];

const DIFF_COLORS: Record<string, string> = {
  Beginner: "text-[var(--pass)] border-[var(--pass)]/30 bg-[var(--pass)]/10",
  Intermediate: "text-[var(--signal)] border-[var(--signal)]/30 bg-[var(--signal)]/10",
  Advanced: "text-[var(--gauge)] border-[var(--gauge)]/30 bg-[var(--gauge)]/10",
  Expert: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function PromptsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDiff, setActiveDiff] = useState("All");

  const filtered = useMemo(() => {
    return PROMPTS.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchDiff = activeDiff === "All" || p.difficulty === activeDiff;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [search, activeCategory, activeDiff]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <BookOpen className="w-4 h-4" />
          <span>Curated Prompt Library</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          3,900+ Vibe Coding Prompts
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          The largest curated prompt set for evaluating frontier AI models. 10 categories — Frontend UI, Games, SVG Art, Creative, Agentic, and more. Battle-tested across 57+ models.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 pt-2 text-xs font-mono text-[var(--mist)] border-t border-[var(--border)]">
          <span><b className="text-[var(--ink)]">3,900+</b> total prompts</span>
          <span className="text-[var(--border)]">·</span>
          <span><b className="text-[var(--ink)]">10</b> categories</span>
          <span className="text-[var(--border)]">·</span>
          <span><b className="text-[var(--ink)]">57+</b> models tested</span>
          <span className="text-[var(--border)]">·</span>
          <span><b className="text-[var(--ink)]">4</b> difficulty tiers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Search */}
          <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--paper)] space-y-3">
            <label className="text-[10px] font-mono text-[var(--mist)] uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3 h-3" /> Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--mist)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts…"
                className="w-full pl-9 pr-3 py-2 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--fog)] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--signal)] transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--paper)] space-y-2">
            <p className="text-[10px] font-mono text-[var(--mist)] uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Filter className="w-3 h-3" /> Category
            </p>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                  activeCategory === cat.name
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <cat.icon className="w-3 h-3" />
                  {cat.name}
                </span>
                <span className={`text-[10px] ${activeCategory === cat.name ? "opacity-70" : "text-[var(--mist)]"}`}>
                  {cat.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--paper)] space-y-2">
            <p className="text-[10px] font-mono text-[var(--mist)] uppercase tracking-wider mb-3">Difficulty</p>
            {DIFFICULTY.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDiff(d)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                  activeDiff === d
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]"
                }`}
              >
                {d}
                {d !== "All" && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${activeDiff === d ? "opacity-70" : DIFF_COLORS[d] ?? ""}`}>
                    {d}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Prompts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-[var(--mist)]">
              Showing <b className="text-[var(--ink)]">{filtered.length}</b> prompts
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--mist)]">
              Sorted by: <b className="text-[var(--ink)]">Top Score</b>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-[var(--border)] p-10 text-center text-[var(--mist)] font-mono text-sm">
              No prompts match your filters.
            </div>
          )}

          {filtered.map((p) => (
            <div
              key={p.id}
              className="group rounded-xl bg-[var(--paper)] border border-[var(--border)] px-5 py-4 flex items-center justify-between gap-4 hover:border-[var(--signal)] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--mist)]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans font-semibold text-sm text-[var(--ink)] leading-snug group-hover:text-[var(--signal)] transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="font-mono text-[10px] text-[var(--mist)] border border-[var(--border)] px-1.5 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${DIFF_COLORS[p.difficulty] ?? ""}`}>
                      {p.difficulty}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--mist)]">
                      {p.models} models tested
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-[var(--ink)]">{p.topScore.toFixed(1)}</div>
                  <div className="font-mono text-[9px] text-[var(--mist)] uppercase tracking-wider">top score</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--mist)] group-hover:text-[var(--signal)] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
