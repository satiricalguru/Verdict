import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import VerdictLogo from "@/components/ui/verdict-logo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--paper)] py-12 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <VerdictLogo size="sm" />
              <span className="font-sans font-semibold text-base tracking-tight text-[var(--ink)]">
                Verdict
              </span>
            </div>
            <p className="text-sm text-[var(--mist)] leading-relaxed">
              The scoreboard vendors don&apos;t get to grade. An independent, free, and self-hostable AI coding benchmark platform.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--fog)] border border-[var(--border)] text-[11px] font-mono text-[var(--pass)]">
              <span className="w-2 h-2 rounded-full bg-[var(--pass)]" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-tight text-[var(--mist)] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[var(--mist)]">
              <li>
                <Link href="/leaderboard" className="hover:text-[var(--ink)] transition-colors">
                  Public Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/arena" className="hover:text-[var(--ink)] transition-colors">
                  Arena (Blind Test)
                </Link>
              </li>
              <li>
                <Link href="/compatibility" className="hover:text-[var(--ink)] transition-colors">
                  Compatibility Checker
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="hover:text-[var(--ink)] transition-colors">
                  Community Showcase
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers & Docs Column */}
          <div>
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-tight text-[var(--mist)] mb-3">
              Developers
            </h4>
            <ul className="space-y-2 text-sm text-[var(--mist)]">
              <li>
                <Link href="/self-host" className="hover:text-[var(--ink)] transition-colors">
                  Docker Compose Self-Host
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-[var(--ink)] transition-colors">
                  Scoring Methodology
                </Link>
              </li>
              <li>
                <Link href="/prompts" className="hover:text-[var(--ink)] transition-colors">
                  Prompt Set &amp; Rubric
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-[var(--ink)] transition-colors">
                  System Status &amp; SLA
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Open Source Column */}
          <div>
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-tight text-[var(--mist)] mb-3">
              Legal &amp; Open Source
            </h4>
            <ul className="space-y-2 text-sm text-[var(--mist)]">
              <li>
                <Link href="/terms" className="hover:text-[var(--ink)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--ink)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--ink)] transition-colors">
                  Contact Maintainers
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[var(--ink)] transition-colors"
                >
                  <span>MIT License Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--mist)]">
          <p className="font-sans">© {new Date().getFullYear()} Verdict Benchmark. MIT Licensed Open Source Project.</p>
          <p className="font-mono text-[11px]">Dual-Mode: Hosted + Self-Hosted with BYOK Architecture</p>
        </div>
      </div>
    </footer>
  );
}
