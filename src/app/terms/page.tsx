import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 space-y-4">
        <h1 className="font-sans font-semibold text-3xl text-[var(--ink)] -tracking-[0.02em]">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-[var(--mist)]">
          Last updated: March 2026
        </p>

        <div className="prose text-xs text-[var(--mist)] leading-relaxed space-y-3 font-sans">
          <p>
            Verdict is an open-source, free AI coding benchmark platform. All canonical leaderboard scores and evaluation data published on the site are provided for informational purposes.
          </p>
          <h2 className="font-sans font-semibold text-sm text-[var(--ink)] pt-2">
            1. Open Source License
          </h2>
          <p>
            Verdict software is released under the MIT License. Anyone may freely inspect, modify, fork, and self-host the software.
          </p>
          <h2 className="font-sans font-semibold text-sm text-[var(--ink)] pt-2">
            2. BYOK API Key Usage
          </h2>
          <p>
            Users executing custom benchmark runs on hosted or self-hosted instances supply their own API keys. Verdict never resells API access or charges subscription fees.
          </p>
        </div>
      </div>
    </div>
  );
}
