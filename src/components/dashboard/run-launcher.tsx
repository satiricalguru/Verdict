"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, X, CheckCircle2 } from "lucide-react";

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

    return () => {
      isMounted = false;
    };
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
        body: JSON.stringify({
          modelId: selectedModel,
          categories: selectedCategories,
          byokKey,
        }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-[var(--signal)]" />
            <h2 className="font-display font-bold text-lg text-[var(--ink)]">
              Launch Benchmark Evaluation
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-[var(--mist)] hover:text-[var(--ink)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dynamic Model Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)]">
            1. Target AI Model ({loadingModels ? "Loading registry..." : `${models.length} Models Available`})
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={loadingModels}
            className="w-full p-2.5 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--signal)]"
          >
            {models.map((m) => (
              <option key={m.id} value={m.slug}>
                {m.name} ({m.provider} — Verdict: {m.composite.toFixed(1)}{m.isOpenWeight ? " • Open" : ""})
              </option>
            ))}
          </select>
        </div>

        {/* Category Scope Picker */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)]">
            2. Category Evaluation Scope
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
                  className={`p-2.5 rounded-md text-xs font-mono text-left border transition-all flex items-center justify-between ${
                    selected
                      ? "bg-[var(--signal)]/10 text-[var(--signal)] border-[var(--signal)] font-bold"
                      : "bg-[var(--fog)] text-[var(--mist)] border-[var(--border)]"
                  }`}
                >
                  <span>{cat.label}</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cost & Budget Summary */}
        <div className="p-4 rounded-lg bg-[var(--fog)] border border-[var(--border)] font-mono text-xs space-y-1">
          <div className="flex justify-between text-[var(--ink)]">
            <span className="text-[var(--mist)]">Estimated BYOK Token Cost:</span>
            <span className="font-bold text-[var(--gauge)]">${estimatedCost} USD</span>
          </div>
          <p className="text-[10px] text-[var(--mist)] pt-1">
            Charges are billed directly to your provider API account. Zero platform commission.
          </p>
        </div>

        {/* Submit Action */}
        <div className="flex items-center gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)] text-sm font-semibold hover:bg-[var(--paper)] transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting || selectedCategories.length === 0}
            onClick={handleLaunch}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-md bg-[var(--signal)] text-white text-sm font-semibold hover:bg-[var(--signal-hover)] transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{isSubmitting ? "Queueing..." : "Confirm & Launch Run"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
