import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--paper)] py-12 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-mono font-bold">
                V
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-[var(--ink)]">
                VERDICT
              </span>
            </div>
            <p className="text-xs text-[var(--mist)] leading-relaxed">
              The scoreboard vendors don&apos;t get to grade. An independent, free, and self-hostable AI coding benchmark platform.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--fog)] border border-[var(--border)] text-[11px] font-mono text-[var(--pass)]">
              <span className="w-2 h-2 rounded-full bg-[var(--pass)] animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[var(--mist)]">
              <li>
                <Link href="/leaderboard" className="hover:text-[var(--signal)] transition-colors">
                  Public Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/arena" className="hover:text-[var(--signal)] transition-colors">
                  Arena (Blind Test)
                </Link>
              </li>
              <li>
                <Link href="/compatibility" className="hover:text-[var(--signal)] transition-colors">
                  Compatibility Checker
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="hover:text-[var(--signal)] transition-colors">
                  Community Showcase
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers & Docs Column */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] mb-3">
              Developers
            </h4>
            <ul className="space-y-2 text-sm text-[var(--mist)]">
              <li>
                <Link href="/self-host" className="hover:text-[var(--signal)] transition-colors">
                  Docker Compose Self-Host
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-[var(--signal)] transition-colors">
                  Scoring Methodology
                </Link>
              </li>
              <li>
                <Link href="/prompts" className="hover:text-[var(--signal)] transition-colors">
                  Prompt Set & Rubric
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-[var(--signal)] transition-colors">
                  System Status & SLA
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Open Source Column */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink)] mb-3">
              Legal & Open Source
            </h4>
            <ul className="space-y-2 text-sm text-[var(--mist)]">
              <li>
                <Link href="/terms" className="hover:text-[var(--signal)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--signal)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--signal)] transition-colors">
                  Contact Maintainers
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[var(--signal)] transition-colors"
                >
                  <span>MIT License Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--mist)]">
          <p>© {new Date().getFullYear()} Verdict Benchmark. MIT Licensed Open Source Project.</p>
          <p>Dual-Mode: Hosted + Self-Hosted with BYOK Architecture</p>
        </div>
      </div>
    </footer>
  );
}
