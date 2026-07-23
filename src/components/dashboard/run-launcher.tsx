"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, X, CheckCircle2, ChevronDown } from "lucide-react";

interface ModelOption {
  id: string;
  name: string;
  slug: string;
  provider: string;
  composite: number;
  isOpenWeight: boolean;
}

export default function RunLauncher({
  onClose,
}: {
  onClose?: () => void;
}) {
  const router = useRouter();
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState("claude-fable-5");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "frontend-ui",
    "game-dev",
  ]);
  const [byokKey] = useState("sk-proj-default");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.models && data.models.length > 0) {
          setModels(data.models);
          setSelectedModel(data.models[0].slug);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoadingModels(false);
      });
    return () => { isMounted = false; };
  }, []);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId: selectedModel, categories: selectedCategories, byokKey }),
      });
      const data = await res.json();
      if (data.success && data.runId) {
        if (onClose) onClose();
        router.push(`/dashboard/runs/${data.runId}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedCost = (selectedCategories.length * 0.25).toFixed(2);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="launcher-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl bg-[var(--paper)] border border-[var(--border)] ring-1 ring-white/5 p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150 text-[var(--ink)] font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-[var(--signal)]" />
            <h2 id="launcher-dialog-title" className="font-sans font-semibold text-base text-[var(--ink)]">
              Launch Benchmark Evaluation
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Model Selection */}
        <div className="space-y-1.5">
          <label htmlFor="model-select" className="block text-xs font-semibold tracking-tight text-[var(--ink)]">
            1. Target AI Model{" "}
            <span className="font-normal text-[var(--mist)]">
              ({loadingModels ? "Loading registry..." : `${models.length} available`})
            </span>
          </label>
          <div className="relative">
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={loadingModels}
              className="w-full appearance-none p-2.5 pr-8 text-xs bg-[var(--fog)] border border-[var(--border)] rounded-lg text-[var(--ink)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--signal)] focus:ring-offset-0 transition-colors cursor-pointer disabled:opacity-60"
            >
              {models.map((m) => (
                <option key={m.id} value={m.slug}>
                  {m.name} ({m.provider} — {m.composite.toFixed(1)}{m.isOpenWeight ? " · Open" : ""})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--mist)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Category Scope Picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold tracking-tight text-[var(--ink)]">
            2. Evaluation Scope
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "frontend-ui", label: "Frontend UI" },
              { id: "game-dev", label: "Game Dev" },
              { id: "svg-art", label: "SVG Art" },
              { id: "agentic-tasks", label: "Agentic Tasks" },
            ].map((cat) => {
              const selected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={selected}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[var(--signal)] active:scale-[0.98] ${
                    selected
                      ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)] font-semibold shadow-xs"
                      : "bg-[var(--fog)] text-[var(--mist)] border-[var(--border)] hover:text-[var(--ink)] hover:border-[var(--mist)]"
                  }`}
                >
                  <span>{cat.label}</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="p-4 rounded-xl bg-[var(--fog)] border border-[var(--border)] text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-[var(--mist)] font-sans">Estimated BYOK Token Cost</span>
            <span className="font-mono font-semibold text-[var(--ink)]">${estimatedCost} USD</span>
          </div>
          <p className="text-[11px] text-[var(--mist)] pt-0.5 leading-relaxed">
            Directly billed to your provider API account. Zero platform markup.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3 pt-1">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[var(--paper)] text-[var(--ink)] border border-[var(--border)] text-xs font-semibold hover:bg-[var(--fog)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting || selectedCategories.length === 0}
            onClick={handleLaunch}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Queueing..." : "Launch Evaluation"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
