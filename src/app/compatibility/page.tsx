"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Cpu,
  Search,
  AlertTriangle,
  ChevronDown,
  HardDrive,
  Globe,
  RefreshCw,
  Coins,
} from "lucide-react";
import {
  HARDWARE_PRESETS,
  SYSTEM_RAM_OPTIONS,
  CPU_CORE_OPTIONS,
  LOCAL_MODELS_DATASET,
  type QuantInfo,
} from "@/lib/hardware-models";

interface CloudModelData {
  name: string;
  slug: string;
  provider: string;
  capabilities: { vision: boolean; tools: boolean; maxTokens: number };
  priceInput: string;
  priceOutput: string;
  contextWindow: string;
  isOpenWeight: boolean;
  estimatedCostPerPrompt: string;
  estimatedFullRunCost: string;
  warnings: string[];
}

export default function CompatibilityPage() {
  const [activeTab, setActiveTab] = useState<"local" | "cloud">("local");

  // Local Hardware State
  const [selectedGpuId, setSelectedGpuId] = useState<string>("apple-m2-16");
  const [systemRamGb, setSystemRamGb] = useState<number>(16);
  const [cpuCores, setCpuCores] = useState<number>(8);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedSizeRange, setSelectedSizeRange] = useState("All");
  const [sortBy, setSortBy] = useState<"hardware" | "quality" | "speed" | "size">("hardware");

  // Cloud API State
  const [cloudModelOptions, setCloudModelOptions] = useState<
    { name: string; slug: string; provider: string; isOpenWeight: boolean }[]
  >([]);
  const [selectedCloudSlug, setSelectedCloudSlug] = useState("claude-fable-5");
  const [cloudModelData, setCloudModelData] = useState<CloudModelData | null>(null);
  const [loadingCloud, setLoadingCloud] = useState(false);

  // Fetch Cloud API Models & Data
  useEffect(() => {
    let isMounted = true;
    if (activeTab === "cloud") {
      fetch(`/api/compatibility?model=${selectedCloudSlug}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (isMounted) {
            if (data.cloudModels) setCloudModelOptions(data.cloudModels);
            if (data.selectedCloudModel) setCloudModelData(data.selectedCloudModel);
          }
        })
        .catch((err) => console.warn("Fetch cloud compatibility error:", err))
        .finally(() => {
          if (isMounted) setLoadingCloud(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [selectedCloudSlug, activeTab]);

  const handleCloudSlugChange = (newSlug: string) => {
    setLoadingCloud(true);
    setSelectedCloudSlug(newSlug);
  };

  const handleTabChange = (newTab: "local" | "cloud") => {
    if (newTab === "cloud") {
      setLoadingCloud(true);
    }
    setActiveTab(newTab);
  };

  // Selected Hardware Preset Object
  const currentGpu = useMemo(() => {
    return (
      HARDWARE_PRESETS.find((p) => p.id === selectedGpuId) || HARDWARE_PRESETS[1]
    );
  }, [selectedGpuId]);

  // Total Available Memory for Local Execution
  const effectiveVramGb = currentGpu.vramGb;
  const isUnified = currentGpu.isUnified;
  const totalMemoryAvailableGb = isUnified
    ? Math.max(effectiveVramGb, systemRamGb)
    : effectiveVramGb + Math.round(systemRamGb * 0.4);

  // Calculate local model compatibility for given hardware
  const evaluatedLocalModels = useMemo(() => {
    return LOCAL_MODELS_DATASET.map((model) => {
      // Find best fitting quant level
      let bestQuant: QuantInfo | null = null;
      let fitType: "vram" | "ram" | "oom" = "oom";

      // Prefer Q4_K_M -> Q5_K_M -> Q8_0 -> F16 depending on VRAM fit
      const quantsRev = [...model.quants].reverse(); // F16 down to Q2_K
      for (const q of quantsRev) {
        if (q.vramGb <= effectiveVramGb) {
          bestQuant = q;
          fitType = "vram";
          break;
        }
      }

      // If nothing fits in GPU VRAM, check if compact quant fits in RAM
      if (!bestQuant) {
        for (const q of model.quants) {
          if (q.vramGb <= totalMemoryAvailableGb) {
            bestQuant = q;
            fitType = "ram";
            break;
          }
        }
      }

      // Default fallback quant for display if OOM
      if (!bestQuant) {
        bestQuant = model.quants[2] || model.quants[0]; // Q4_K_M
        fitType = "oom";
      }

      // Calculate performance score & speed
      let perfScore = 0;
      let estimatedTokSec = 0;

      if (fitType === "vram") {
        const bandwidthFactor = Math.min(2.0, currentGpu.bandwidthGbs / 300);
        estimatedTokSec = Math.round(
          Math.min(180, (currentGpu.bandwidthGbs / (bestQuant.vramGb * 8)) * 12)
        );
        perfScore = Math.min(
          99,
          Math.max(70, Math.round(65 + bandwidthFactor * 15))
        );
      } else if (fitType === "ram") {
        estimatedTokSec = Math.round(Math.max(4, cpuCores * 1.5));
        perfScore = Math.min(65, Math.max(35, Math.round(30 + cpuCores * 1.8)));
      } else {
        estimatedTokSec = 0;
        perfScore = 15;
      }

      return {
        ...model,
        bestQuant,
        fitType,
        perfScore,
        estimatedTokSec,
      };
    });
  }, [effectiveVramGb, totalMemoryAvailableGb, currentGpu.bandwidthGbs, cpuCores]);

  // Statistics Summary
  const runnableAtQ4Count = useMemo(() => {
    return evaluatedLocalModels.filter((m) => {
      const q4 = m.quants.find((q) => q.name === "Q4_K_M");
      return Boolean(q4 && q4.vramGb <= totalMemoryAvailableGb);
    }).length;
  }, [evaluatedLocalModels, totalMemoryAvailableGb]);

  // Hero Recommendation ("BEST FOR YOU")
  const featuredModel = useMemo(() => {
    const runnable = evaluatedLocalModels.filter((m) => m.fitType !== "oom");
    if (runnable.length === 0) return evaluatedLocalModels[0];
    // Sort by combined quality & performance
    return [...runnable].sort(
      (a, b) => b.qualityScore + b.perfScore - (a.qualityScore + a.perfScore)
    )[0];
  }, [evaluatedLocalModels]);

  // Filtered & Sorted Local Models List
  const filteredLocalModels = useMemo(() => {
    return evaluatedLocalModels
      .filter((model) => {
        // Tag filter
        if (selectedTag !== "All") {
          const t = selectedTag.toUpperCase();
          if (!model.tags.includes(t)) return false;
        }
        // Size range filter
        if (selectedSizeRange !== "All") {
          if (selectedSizeRange === "< 4B" && model.paramsNum >= 4) return false;
          if (selectedSizeRange === "4B - 10B" && (model.paramsNum < 4 || model.paramsNum > 10)) return false;
          if (selectedSizeRange === "10B - 34B" && (model.paramsNum <= 10 || model.paramsNum > 34)) return false;
          if (selectedSizeRange === "34B - 70B" && (model.paramsNum <= 34 || model.paramsNum > 70)) return false;
          if (selectedSizeRange === "70B+" && model.paramsNum < 70) return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            model.name.toLowerCase().includes(q) ||
            model.provider.toLowerCase().includes(q) ||
            model.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "hardware") return b.perfScore - a.perfScore;
        if (sortBy === "quality") return b.qualityScore - a.qualityScore;
        if (sortBy === "speed") return b.estimatedTokSec - a.estimatedTokSec;
        if (sortBy === "size") return a.paramsNum - b.paramsNum;
        return 0;
      });
  }, [evaluatedLocalModels, selectedTag, selectedSizeRange, searchQuery, sortBy]);

  const tagList = [
    "All",
    "Agentic",
    "Audio",
    "Chat",
    "Code",
    "Edge",
    "Local",
    "Multilingual",
    "Rag",
    "Reasoning",
    "Value",
    "Vision",
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header Banner */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--signal)]">
            <Cpu className="w-4 h-4" />
            <span>Can I Run It? — Hardware &amp; Model Benchmark</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div role="tablist" className="flex items-center gap-1 p-1 rounded-lg bg-[var(--fog)] border border-[var(--border)] self-start sm:self-auto">
            <button
              role="tab"
              aria-selected={activeTab === "local"}
              onClick={() => handleTabChange("local")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--signal)] ${
                activeTab === "local"
                  ? "bg-[var(--paper)] text-[var(--ink)] shadow-xs"
                  : "text-[var(--mist)] hover:text-[var(--ink)]"
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-[var(--signal)]" />
              <span>Local Hardware (Ollama / GGUF)</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "cloud"}
              onClick={() => handleTabChange("cloud")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--signal)] ${
                activeTab === "cloud"
                  ? "bg-[var(--paper)] text-[var(--ink)] shadow-xs"
                  : "text-[var(--mist)] hover:text-[var(--ink)]"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[var(--signal-alt)]" />
              <span>Cloud API Token Calculator</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-[var(--ink)] tracking-tight">
            {activeTab === "local" ? "Can I Run It?" : "Cloud API Model Budget Calculator"}
          </h1>
          <p className="text-sm text-[var(--mist)] mt-1.5 max-w-3xl leading-relaxed">
            {activeTab === "local"
              ? "Check which open-weights AI models your workstation or laptop hardware can run locally across GGUF quantization levels."
              : "Calculate token costs, context limits, and capabilities for commercial frontier cloud APIs."}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: LOCAL HARDWARE COMPATIBILITY CALCULATOR                           */}
      {/* ========================================================================= */}
      {activeTab === "local" && (
        <div className="space-y-8">
          {/* Hardware Selector Box */}
          <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Cpu className="w-4 h-4 text-[var(--signal)]" />
              <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                YOUR HARDWARE
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* GPU / CHIP */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[var(--mist)] uppercase tracking-wider">
                  GPU / CHIP
                </label>
                <div className="relative">
                  <select
                    value={selectedGpuId}
                    onChange={(e) => setSelectedGpuId(e.target.value)}
                    className="w-full appearance-none p-3 pr-8 bg-[var(--fog)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)] cursor-pointer"
                  >
                    {HARDWARE_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[var(--mist)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* SYSTEM RAM */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[var(--mist)] uppercase tracking-wider">
                  SYSTEM RAM
                </label>
                <div className="relative">
                  <select
                    value={systemRamGb}
                    onChange={(e) => setSystemRamGb(Number(e.target.value))}
                    className="w-full appearance-none p-3 pr-8 bg-[var(--fog)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)] cursor-pointer"
                  >
                    {SYSTEM_RAM_OPTIONS.map((ram) => (
                      <option key={ram} value={ram}>
                        {ram} GB
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[var(--mist)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* CPU CORES */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[var(--mist)] uppercase tracking-wider">
                  CPU CORES
                </label>
                <div className="relative">
                  <select
                    value={cpuCores}
                    onChange={(e) => setCpuCores(Number(e.target.value))}
                    className="w-full appearance-none p-3 pr-8 bg-[var(--fog)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)] cursor-pointer"
                  >
                    {CPU_CORE_OPTIONS.map((cores) => (
                      <option key={cores} value={cores}>
                        {cores} cores
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[var(--mist)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Memory Capacity Status Banner */}
            <div className="p-3.5 rounded-lg bg-[var(--pass)]/10 border border-[var(--pass)]/20 text-xs font-mono text-[var(--pass)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--pass)] animate-pulse" />
                <span>
                  <strong className="font-bold">{totalMemoryAvailableGb} GB</strong> {isUnified ? "unified memory" : "effective memory"} available. You can run{" "}
                  <strong className="font-bold">{runnableAtQ4Count}</strong> of{" "}
                  <strong className="font-bold">{LOCAL_MODELS_DATASET.length}</strong> models at Q4_K_M.
                </span>
              </div>
              <span className="hidden sm:inline-block text-[11px] opacity-80">
                Bandwidth: {currentGpu.bandwidthGbs} GB/s
              </span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* FEATURED "BEST FOR YOU" CARD                                           */}
          {/* ===================================================================== */}
          {featuredModel && (
            <div className="rounded-xl bg-[var(--paper)] border-2 border-[var(--pass)]/40 p-6 space-y-3 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--pass)] text-black">
                  BEST FOR YOU
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[var(--pass)]/10 text-[var(--pass)] border border-[var(--pass)]/30">
                  RUNS WELL {featuredModel.perfScore}/100
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="font-sans font-bold text-2xl text-[var(--ink)]">
                    {featuredModel.name}
                  </h3>
                  <div className="text-xs font-mono text-[var(--mist)] mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[var(--signal)] font-semibold">{featuredModel.provider}</span>
                    <span>•</span>
                    <span>{featuredModel.paramsText}</span>
                    <span>•</span>
                    <span>Quality: <strong className="text-[var(--ink)]">{featuredModel.qualityScore}/100</strong></span>
                    <span>•</span>
                    <span>Best quant: <strong className="text-[var(--pass)]">{featuredModel.bestQuant.name}</strong></span>
                    <span>•</span>
                    <span className="text-[var(--pass)] font-bold">~{featuredModel.estimatedTokSec} tok/s</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--mist)] leading-relaxed">
                {featuredModel.description}
              </p>
            </div>
          )}

          {/* Search, Filter & Sort Toolbar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Tag Pills */}
              <div role="tablist" aria-label="Filter local models by capability" className="flex flex-wrap items-center gap-1.5 text-xs">
                {tagList.map((tag) => (
                  <button
                    key={tag}
                    role="tab"
                    aria-selected={selectedTag === tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition-all ${
                      selectedTag === tag
                        ? "bg-[var(--ink)] text-[var(--paper)] shadow-xs"
                        : "bg-[var(--paper)] text-[var(--mist)] border border-[var(--border)] hover:text-[var(--ink)] hover:bg-[var(--fog)]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Controls: Search, Size Range & Sort */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Search */}
                <div className="relative w-44">
                  <Search className="w-3.5 h-3.5 text-[var(--mist)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search models..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[var(--paper)] border border-[var(--border)] rounded-lg text-xs font-sans text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)]"
                  />
                </div>

                {/* Size Filter */}
                <select
                  value={selectedSizeRange}
                  onChange={(e) => setSelectedSizeRange(e.target.value)}
                  className="bg-[var(--paper)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)] cursor-pointer"
                >
                  <option value="All">All Sizes</option>
                  <option value="< 4B">&lt; 4B</option>
                  <option value="4B - 10B">4B - 10B</option>
                  <option value="10B - 34B">10B - 34B</option>
                  <option value="34B - 70B">34B - 70B</option>
                  <option value="70B+">70B+</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-[var(--paper)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--signal)] cursor-pointer"
                >
                  <option value="hardware">Sort: Best for Hardware</option>
                  <option value="quality">Quality (High to Low)</option>
                  <option value="speed">Speed (Tok/s)</option>
                  <option value="size">Size (Small to Large)</option>
                </select>
              </div>
            </div>

            {/* Model Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocalModels.map((model) => {
                const isRunWell = model.perfScore >= 70;
                const isSluggish = model.perfScore >= 35 && model.perfScore < 70;

                return (
                  <div
                    key={model.id}
                    className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-5 space-y-4 hover:border-[var(--signal)] transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Title & Status Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-sans font-bold text-lg text-[var(--ink)]">
                            {model.name}
                          </h4>
                          <span className="text-xs font-mono text-[var(--signal)] font-semibold">
                            {model.provider}
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${
                            isRunWell
                              ? "bg-[var(--pass)]/10 text-[var(--pass)] border-[var(--pass)]/30"
                              : isSluggish
                              ? "bg-[var(--gauge)]/10 text-[var(--gauge)] border-[var(--gauge)]/30"
                              : "bg-[var(--fail)]/10 text-[var(--fail)] border-[var(--fail)]/30"
                          }`}
                        >
                          {isRunWell
                            ? `RUNS WELL ${model.perfScore}/100`
                            : isSluggish
                            ? `SLUGGISH ${model.perfScore}/100`
                            : "OOM / NO FIT"}
                        </span>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="text-xs text-[var(--mist)] leading-relaxed">
                        {model.description}
                      </p>

                      {/* Meta line */}
                      <div className="text-[11px] font-mono text-[var(--mist)] flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--border)]">
                        <span>{model.paramsText}</span>
                        <span>•</span>
                        <span>{model.contextWindow}</span>
                        <span>•</span>
                        <span>{model.license}</span>
                        {model.estimatedTokSec > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-[var(--pass)] font-bold">~{model.estimatedTokSec} tok/s</span>
                          </>
                        )}
                      </div>

                      {/* Capability Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {model.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[var(--fog)] text-[var(--mist)] border border-[var(--border)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quantization Pill Grid */}
                    <div className="pt-4 border-t border-[var(--border)] space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--mist)]">
                        <span>QUANTIZATION / VRAM</span>
                        <span className="text-[var(--ink)] font-bold">
                          Best: {model.bestQuant.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {model.quants.map((q) => {
                          const isRecommended = q.name === model.bestQuant.name && model.fitType !== "oom";
                          const fitsInVram = q.vramGb <= effectiveVramGb;
                          const fitsInRam = q.vramGb <= totalMemoryAvailableGb;

                          return (
                            <div
                              key={q.name}
                              className={`p-1 rounded text-center border text-[9px] font-mono transition-colors ${
                                isRecommended
                                  ? "bg-[var(--pass)] text-black border-[var(--pass)] font-bold shadow-xs"
                                  : fitsInVram
                                  ? "bg-[var(--fog)] text-[var(--pass)] border-[var(--pass)]/30 font-semibold"
                                  : fitsInRam
                                  ? "bg-[var(--fog)] text-[var(--gauge)] border-[var(--gauge)]/30"
                                  : "bg-[var(--fog)]/40 text-[var(--mist)]/40 border-[var(--border)]/40"
                              }`}
                            >
                              <div className="truncate font-bold">{q.name.replace("_K_M", "")}</div>
                              <div className="text-[8px] opacity-90">{q.vramGb}GB</div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[10px] font-mono text-[var(--mist)] pt-1 flex justify-between">
                        <span>Recommended: <strong className="text-[var(--ink)]">{model.bestQuant.name} ({model.bestQuant.vramGb} GB)</strong></span>
                        {model.fitType === "ram" && <span className="text-[var(--gauge)] font-bold">CPU Offload</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CLOUD API MODEL BUDGET CALCULATOR                                  */}
      {/* ========================================================================= */}
      {activeTab === "cloud" && (
        <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <Coins className="w-4 h-4 text-[var(--signal-alt)]" />
            <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
              COMMERCIAL CLOUD API MODEL COST CALCULATOR
            </h2>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] mb-2">
              Select Model from Registry ({cloudModelOptions.length} Models Available)
            </label>
            <select
              value={selectedCloudSlug}
              onChange={(e) => handleCloudSlugChange(e.target.value)}
              className="w-full max-w-md p-3 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-lg text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--signal)] cursor-pointer"
            >
              {cloudModelOptions.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name} ({m.provider}{m.isOpenWeight ? " • Open Weight" : ""})
                </option>
              ))}
            </select>
          </div>

          {loadingCloud || !cloudModelData ? (
            <div className="py-12 flex items-center justify-center font-mono text-xs text-[var(--mist)] gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[var(--signal)]" />
              <span>Fetching model specs and token pricing...</span>
            </div>
          ) : (
            <div className="space-y-6 pt-4 border-t border-[var(--border)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Capabilities */}
                <div className="rounded-lg bg-[var(--fog)] border border-[var(--border)] p-5 space-y-4">
                  <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                    Capabilities &amp; Specs ({cloudModelData.name})
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--mist)]">Max Context Window:</span>
                      <span className="font-bold text-[var(--ink)]">{cloudModelData.contextWindow || "1M"} tokens</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--mist)]">Multimodal Vision:</span>
                      <span className={`font-bold ${cloudModelData.capabilities.vision ? "text-[var(--pass)]" : "text-[var(--fail)]"}`}>
                        {cloudModelData.capabilities.vision ? "Supported" : "Not Supported"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--mist)]">Function Calling / Tools:</span>
                      <span className={`font-bold ${cloudModelData.capabilities.tools ? "text-[var(--pass)]" : "text-[var(--fail)]"}`}>
                        {cloudModelData.capabilities.tools ? "Supported" : "Not Supported"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* API Budget */}
                <div className="rounded-lg bg-[var(--fog)] border border-[var(--border)] p-5 space-y-4">
                  <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[var(--ink)]">
                    Estimated BYOK API Budget
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--mist)]">Input Rate:</span>
                      <span className="font-bold text-[var(--ink)]">{cloudModelData.priceInput}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--mist)]">Output Rate:</span>
                      <span className="font-bold text-[var(--ink)]">{cloudModelData.priceOutput}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--mist)]">Est. Cost Per Prompt:</span>
                      <span className="font-bold text-[var(--gauge)]">{cloudModelData.estimatedCostPerPrompt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--mist)]">Est. Full Benchmark Run:</span>
                      <span className="font-bold text-[var(--gauge)]">{cloudModelData.estimatedFullRunCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {cloudModelData.warnings.length > 0 && (
                <div className="p-4 rounded-lg bg-[var(--gauge)]/10 border border-[var(--gauge)]/30 text-xs font-mono text-[var(--ink)] flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[var(--gauge)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Readiness Notice: </span>
                    {cloudModelData.warnings.join(" ")}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
