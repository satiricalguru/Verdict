import React from "react";
import Link from "next/link";

// Inline social SVGs (lucide-react in this version doesn't export social icons)
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);


const FOOTER_LINKS = {
  Product: [
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Arena", href: "/arena" },
    { label: "Playground", href: "/playground" },
    { label: "Model Advisor", href: "/model-advisor" },
    { label: "Showcase", href: "/showcase" },
    { label: "Categories", href: "/categories" },
  ],
  Resources: [
    { label: "Prompt Library", href: "/prompts" },
    { label: "Can I Run It?", href: "/compatibility" },
    { label: "Documentation", href: "/docs" },
    { label: "Self-Host Guide", href: "/self-host" },
    { label: "API Reference", href: "/docs" },
  ],
  Company: [
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const SOCIAL = [
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { label: "X / Twitter", href: "https://x.com", icon: TwitterIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "GitHub", href: "https://github.com", icon: GithubIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--paper)] mt-auto">
      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-6 h-6 rounded bg-[var(--ink)] flex items-center justify-center">
                <span className="text-[var(--paper)] font-mono font-bold text-[11px]">V</span>
              </div>
              <span className="font-sans font-semibold text-sm text-[var(--ink)] group-hover:text-[var(--signal)] transition-colors">
                Verdict
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--mist)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pass)] live-dot" />
                LIVE
              </span>
            </Link>
            <p className="font-mono text-[11px] text-[var(--mist)] leading-relaxed max-w-[34ch]">
              The independent AI coding benchmark platform. 57+ frontier models scored on real vibe-coding tasks with an auditable AI judge panel.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--mist)] hover:text-[var(--ink)] hover:border-[var(--mist)] transition-colors"
                >
                  {s.icon()}
                </a>
              ))}
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--mist)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--pass)] live-dot" />
              All systems operational
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h5 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--mist)] mb-4">{group}</h5>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-mono text-xs text-[var(--mist)] hover:text-[var(--ink)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[var(--mist)]">
            <span>© {new Date().getFullYear()} Verdict · Independent AI Benchmark</span>
            <Link href="/privacy" className="hover:text-[var(--ink)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--ink)] transition-colors">Terms</Link>
          </div>
          <pre
            className="font-mono text-[9px] leading-[1.1] text-[var(--border)] hidden lg:block select-none"
            aria-hidden
          >{`██╗   ██╗███████╗██████╗ ██████╗ ██╗ ██████╗████████╗
██║   ██║██╔════╝██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝
██║   ██║█████╗  ██████╔╝██║  ██║██║██║        ██║   
╚██╗ ██╔╝██╔══╝  ██╔══██╗██║  ██║██║██║        ██║   
 ╚████╔╝ ███████╗██║  ██║██████╔╝██║╚██████╗   ██║   
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝   ╚═╝`}</pre>
        </div>
      </div>
    </footer>
  );
}
