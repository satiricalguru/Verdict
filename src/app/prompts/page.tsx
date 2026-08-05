"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, BookOpen, ChevronRight, Filter, Zap, Code2, Palette, Play, Cpu, Box, BarChart2, Film, Database, Globe } from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  "Frontend UI": Code2,
  "Game Dev": Play,
  "SVG Art": Palette,
  "Creative Writing": Zap,
  "Agentic Tasks": Cpu,
  "3D Graphics": Box,
  "Data Viz": BarChart2,
  Animation: Film,
  "Full-Stack": Database,
  "Code Golf": Globe,
};

const DIFF_COLORS: Record<string, string> = {
  Easy: "text-[var(--pass)] border-[var(--pass)]/30 bg-[var(--pass)]/10",
  Medium: "text-[var(--signal)] border-[var(--signal)]/30 bg-[var(--signal)]/10",
  Hard: "text-[var(--gauge)] border-[var(--gauge)]/30 bg-[var(--gauge)]/10",
};

interface LivePrompt {
  id: string;
  title: string;
  body: string;
  difficulty: string;
  category: string;
}

export default function PromptsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDiff, setActiveDiff] = useState("All");
  const [prompts, setPrompts] = useState<LivePrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prompts")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.prompts) {
          setPrompts(
            data.prompts.map((p: { id: string; title: string; body: string; difficulty: string; category: { name: string } }) => ({
              id: p.id,
              title: p.title,
              body: p.body,
              difficulty: p.difficulty,
              category: p.category?.name || "General",
            }))
          );
        }
      })
      .catch((err) => console.warn("Fetch prompts error:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    prompts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return [
      { name: "All", count: prompts.length, icon: BookOpen },
      ...Object.entries(counts).map(([name, count]) => ({
        name,
        count,
        icon: CATEGORY_ICONS[name] || BookOpen,
      })),
    ];
  }, [prompts]);

  const difficulties = useMemo(
    () => ["All", ...new Set(prompts.map((p) => p.difficulty))],
    [prompts]
  );

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchDiff = activeDiff === "All" || p.difficulty === activeDiff;
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [prompts, search, activeCategory, activeDiff]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <BookOpen className="w-4 h-4" />
          <span>Curated Prompt Library</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          {loading ? "Loading Vibe Coding Prompts…" : `${prompts.length} Vibe Coding Prompt${prompts.length === 1 ? "" : "s"}`}
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          The curated prompt set for evaluating frontier AI models. Frontend UI, Games, SVG Art, Creative, Agentic, and more. Every prompt is a real benchmark task graded by the Verdict judge panel.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 pt-2 text-xs font-mono text-[var(--mist)] border-t border-[var(--border)]">
          <span><b className="text-[var(--ink)]">{prompts.length}</b> total prompts</span>
          <span className="text-[var(--border)]">·</span>
          <span><b className="text-[var(--ink)]">{categories.length - 1}</b> categories</span>
          <span className="text-[var(--border)]">·</span>
          <span><b className="text-[var(--ink)]">{difficulties.length - 1}</b> difficulty tiers</span>
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
            {categories.map((cat) => (
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
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--paper)] space-y-2">
            <p className="text-[10px] font-mono text-[var(--mist)] uppercase tracking-wider mb-3">Difficulty</p>
            {difficulties.map((d) => (
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

          {filtered.length === 0 && !loading && (
            <div className="rounded-xl border border-[var(--border)] p-10 text-center text-[var(--mist)] font-mono text-sm">
              No prompts match your filters.
            </div>
          )}

          {filtered.map((p) => (
            <div
              key={p.id}
              className="group rounded-xl bg-[var(--paper)] border border-[var(--border)] px-5 py-4 flex items-center justify-between gap-4 hover:border-[var(--signal)] transition-all duration-200"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--fog)] border border-[var(--border)] flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--mist)]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans font-semibold text-sm text-[var(--ink)] leading-snug group-hover:text-[var(--signal)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="font-mono text-[10px] text-[var(--mist)] mt-1 leading-relaxed line-clamp-2">
                    {p.body}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="font-mono text-[10px] text-[var(--mist)] border border-[var(--border)] px-1.5 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${DIFF_COLORS[p.difficulty] ?? ""}`}>
                      {p.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-[var(--mist)] group-hover:text-[var(--signal)] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
