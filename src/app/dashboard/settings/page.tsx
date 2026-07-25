"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, ShieldCheck, Check, Cpu, AlertCircle } from "lucide-react";
import ProviderLogo from "@/components/ui/provider-logo";

interface ProviderConfig {
  id: string;
  name: string;
  providerKey: string;
  modelsText: string;
  placeholder: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    providerKey: "OpenAI",
    modelsText: "GPT-5.6 Sol, Terra, Luna, GPT-5.5, GPT-5.3 Codex, o3",
    placeholder: "Paste OpenAI API key..",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    providerKey: "Anthropic",
    modelsText: "Claude Fable 5, Opus 5, Sonnet 5, Opus 4.8, Sonnet 4.6, Haiku 4.5",
    placeholder: "Paste Anthropic API key..",
  },
  {
    id: "google",
    name: "Google AI",
    providerKey: "Google AI",
    modelsText: "Gemini 3.1 Flash, Gemini 1.5 Pro, Gemini Flash Lite, Gemini Ultra",
    placeholder: "Paste Google AI API key..",
  },
  {
    id: "xai",
    name: "xAI",
    providerKey: "xAI",
    modelsText: "Grok 4.20, Grok 4.5, Grok 4 Vision, Grok Mini",
    placeholder: "Paste xAI API key..",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    providerKey: "DeepSeek",
    modelsText: "DeepSeek V4 Pro, DeepSeek R1 70B, DeepSeek V3",
    placeholder: "Paste DeepSeek API key..",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    providerKey: "OpenRouter",
    modelsText: "Universal API gateway — connects 200+ frontier AI models",
    placeholder: "Paste OpenRouter API key..",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    providerKey: "Mistral AI",
    modelsText: "Mistral Large 3, Devstral 2512, Codestral 22B, Mixtral 8x7B",
    placeholder: "Paste Mistral API key..",
  },
  {
    id: "qwen",
    name: "Alibaba Qwen",
    providerKey: "Qwen",
    modelsText: "Qwen 3.7 Max, Qwen 2.5 Coder 32B, Qwen 3.5 9B",
    placeholder: "Paste Qwen API key..",
  },
];

export default function SettingsPage() {
  const [connectedKeys, setConnectedKeys] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/keys")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.keys) {
          const map: Record<string, string> = {};
          data.keys.forEach((k: { provider: string; prefix: string }) => {
            map[k.provider.toLowerCase()] = k.prefix;
          });
          setConnectedKeys(map);
        }
      })
      .catch((e) => console.warn("Failed to fetch connected keys:", e));

    return () => {
      active = false;
    };
  }, []);

  const reloadKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        if (data.keys) {
          const map: Record<string, string> = {};
          data.keys.forEach((k: { provider: string; prefix: string }) => {
            map[k.provider.toLowerCase()] = k.prefix;
          });
          setConnectedKeys(map);
        }
      }
    } catch (e) {
      console.warn("Failed to reload keys:", e);
    }
  };

  const handleSaveKey = async (providerConfig: ProviderConfig) => {
    const keyVal = inputs[providerConfig.id]?.trim();
    if (!keyVal) return;

    setSaving((prev) => ({ ...prev, [providerConfig.id]: true }));
    setMessage(null);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: providerConfig.providerKey,
          key: keyVal,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: `${providerConfig.name} API key connected securely!`, type: "success" });
        setInputs((prev) => ({ ...prev, [providerConfig.id]: "" }));
        await reloadKeys();
      } else {
        throw new Error(data.error || "Failed to save key");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving key";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving((prev) => ({ ...prev, [providerConfig.id]: false }));
    }
  };

  const handleDisconnectKey = async (providerConfig: ProviderConfig) => {
    setSaving((prev) => ({ ...prev, [providerConfig.id]: true }));
    try {
      const res = await fetch(`/api/keys?provider=${encodeURIComponent(providerConfig.providerKey)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage({ text: `${providerConfig.name} disconnected.`, type: "success" });
        await reloadKeys();
      }
    } catch (e) {
      console.warn("Disconnect error:", e);
    } finally {
      setSaving((prev) => ({ ...prev, [providerConfig.id]: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 font-sans">
      {/* Top back navigation */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--mist)] hover:text-[var(--signal)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Page Title */}
      <div className="space-y-1">
        <div className="text-[11px] font-mono font-bold text-[var(--signal)] tracking-widest uppercase">
          SETTINGS
        </div>
        <h1 className="text-3xl font-sans font-bold text-[var(--ink)] tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[var(--mist)]">
          Configure API providers and evaluation preferences
        </p>
      </div>

      {/* Sleek BYOK Banner Card */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono font-semibold text-xs text-[var(--signal)] uppercase tracking-wide">
            <Cpu className="w-4 h-4 text-[var(--signal)]" />
            <span>BYOK Evaluation Engine Setup</span>
          </div>
          <p className="text-xs text-[var(--mist)] leading-relaxed max-w-2xl">
            Verdict is 100% free and open-source. Connect your AI provider API keys below. Every provider, custom endpoint, multi-judge scoring, benchmark report, and execution history is fully unlocked.
          </p>
        </div>
        <span className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-[var(--fog)] border border-[var(--border)] font-mono font-semibold text-xs text-[var(--ink)] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[var(--pass)]" />
          100% Unlocked BYOK
        </span>
      </div>

      {/* Alert message if any */}
      {message && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            message.type === "success"
              ? "bg-[var(--pass)]/10 border-[var(--pass)]/30 text-[var(--pass)]"
              : "bg-[var(--fail)]/10 border-[var(--fail)]/30 text-[var(--fail)]"
          }`}
        >
          {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* API Keys Section Header */}
      <div className="space-y-1 pt-2">
        <div className="flex items-center gap-2 font-mono font-bold text-xs text-[var(--ink)] uppercase tracking-wider">
          <KeyRound className="w-4 h-4 text-[var(--signal)]" />
          <span>API KEYS</span>
        </div>
        <p className="text-xs text-[var(--mist)]">
          Connect your AI providers to start benchmarking
        </p>
      </div>

      {/* Providers Grid */}
      <div className="space-y-4">
        {PROVIDERS.map((provider) => {
          const isConnected = Boolean(connectedKeys[provider.providerKey.toLowerCase()]);
          const prefix = connectedKeys[provider.providerKey.toLowerCase()];
          const isSaving = Boolean(saving[provider.id]);

          return (
            <div
              key={provider.id}
              className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-5 space-y-4 hover:border-[var(--border)] transition-colors"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-3">
                  <ProviderLogo provider={provider.name} size="md" />
                  <div>
                    <h3 className="font-sans font-bold text-base text-[var(--ink)]">
                      {provider.name}
                    </h3>
                    <p className="text-xs font-mono text-[var(--mist)] mt-0.5">
                      {provider.modelsText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--pass)]/10 border border-[var(--pass)]/20 font-mono text-[11px] font-bold text-[var(--pass)]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Connected ({prefix})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--fog)] border border-[var(--border)] font-mono text-[11px] font-semibold text-[var(--mist)]">
                      Not connected
                    </span>
                  )}
                </div>
              </div>

              {/* Key Input & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="password"
                  value={inputs[provider.id] || ""}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [provider.id]: e.target.value }))}
                  placeholder={provider.placeholder}
                  className="w-full bg-[var(--fog)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-xs font-mono text-[var(--ink)] placeholder-[var(--mist)] focus:outline-none focus:border-[var(--signal)]"
                />

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleSaveKey(provider)}
                    disabled={isSaving || !inputs[provider.id]?.trim()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--signal)] text-black font-mono font-bold text-xs hover:bg-[var(--signal-hover)] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>

                  {isConnected && (
                    <button
                      onClick={() => handleDisconnectKey(provider)}
                      disabled={isSaving}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg bg-[var(--fog)] border border-[var(--border)] text-red-400 font-mono font-semibold text-xs hover:border-red-400/50 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
