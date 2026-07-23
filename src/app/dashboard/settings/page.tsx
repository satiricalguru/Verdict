"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, ShieldCheck, Plus } from "lucide-react";

export default function SettingsPage() {
  const [keys, setKeys] = useState<{ id: string; provider: string; prefix: string; status: string }[]>([]);
  const [provider, setProvider] = useState("OpenAI");
  const [keyInput, setKeyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/keys")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.keys) {
          setKeys(data.keys);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, key: keyInput }),
      });

      const data = await res.json();
      if (data.success && data.key) {
        setKeys((prev) => [data.key, ...prev]);
        setKeyInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--mist)] hover:text-[var(--signal)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <KeyRound className="w-4 h-4 text-[var(--gauge)]" />
          <span>BYOK Key Management</span>
        </div>
        <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
          BYOK API Key Management
        </h1>
        <p className="text-sm text-[var(--mist)] max-w-3xl">
          Verdict is 100% free and open-source. API keys supplied here are stored encrypted at rest using application envelope encryption, isolated to your workspace, and never shared or logged.
        </p>
      </div>

      {/* Add New Key Form */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 space-y-4">
        <h2 className="font-sans font-semibold text-xl text-[var(--ink)]">
          Add Provider API Key
        </h2>

        <form onSubmit={handleAddKey} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <label className="block text-xs font-mono text-[var(--mist)] uppercase tracking-wider mb-1">
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full p-2.5 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] font-mono"
            >
              <option>OpenAI</option>
              <option>Anthropic</option>
              <option>Google Gemini</option>
              <option>OpenRouter</option>
            </select>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-mono text-[var(--mist)] uppercase tracking-wider mb-1">
              API Key Token
            </label>
            <input
              type="password"
              required
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste provider key (sk-...)"
              className="w-full p-2.5 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--signal)]"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSubmitting || !keyInput.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-[var(--signal)] text-white text-sm font-semibold hover:bg-[var(--signal-hover)] transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Encrypting..." : "Add Key"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Configured Keys List */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--fog)] font-mono text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
          Configured Provider Keys
        </div>

        <div className="divide-y divide-[var(--border)] font-mono text-xs">
          {keys.length === 0 ? (
            <div className="p-6 text-center text-[var(--mist)]">
              No API keys configured yet. Add your first key above to run benchmarks.
            </div>
          ) : (
            keys.map((k) => (
              <div key={k.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[var(--ink)]">{k.provider}</div>
                  <div className="text-[var(--mist)]">{k.prefix}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[var(--pass)]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{k.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
