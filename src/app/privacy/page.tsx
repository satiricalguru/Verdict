import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 space-y-4">
        <h1 className="font-sans font-semibold text-3xl text-[var(--ink)] -tracking-[0.02em]">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-[var(--mist)]">
          Last updated: March 2026
        </p>

        <div className="prose text-xs text-[var(--mist)] leading-relaxed space-y-3 font-sans">
          <p>
            Verdict respects user privacy. Self-hosted instances transmit zero telemetry or tracking data.
          </p>
          <h2 className="font-sans font-semibold text-sm text-[var(--ink)] pt-2">
            1. Encrypted API Keys
          </h2>
          <p>
            All provider API keys are encrypted at rest using envelope encryption algorithms and are strictly used to authenticate calls to model provider endpoints.
          </p>
          <h2 className="font-sans font-semibold text-sm text-[var(--ink)] pt-2">
            2. Analytics
          </h2>
          <p>
            The hosted public instance uses privacy-focused, cookie-less analytics (Plausible/PostHog) to measure overall site traffic.
          </p>
        </div>
      </div>
    </div>
  );
}
