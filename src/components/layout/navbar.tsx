"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, Cpu, ChevronDown } from "lucide-react";
import VerdictLogo from "@/components/ui/verdict-logo";

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    const timer = setTimeout(() => setIsDark(isDarkMode), 0);
    return () => clearTimeout(timer);
  }, []);

  // Close explore dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const primaryNav = [
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/arena", label: "Arena" },
    { href: "/categories", label: "Categories" },
    { href: "/docs", label: "Docs" },
  ];

  const secondaryNav = [
    { href: "/compatibility", label: "Compatibility" },
    { href: "/prompts", label: "Prompts" },
    { href: "/showcase", label: "Showcase" },
    { href: "/self-host", label: "Self-Host" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[var(--paper)]/80 border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[var(--signal)] rounded-md p-1">
            <VerdictLogo size="md" />
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-base tracking-tight text-[var(--ink)] group-hover:text-[var(--signal)] transition-colors">
                Verdict
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[var(--mist)] uppercase -mt-0.5 font-medium">
                AI Benchmark
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Primary navigation">
            {primaryNav.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-[var(--fog)] text-[var(--ink)] shadow-xs"
                      : "text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Accessible Explore Dropdown */}
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => setExploreOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={exploreOpen}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setExploreOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]/60 transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
              >
                <span>Explore</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${exploreOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Panel */}
              <div
                className={`absolute top-full right-0 mt-1.5 w-48 rounded-xl bg-[var(--paper)] border border-[var(--border)] shadow-xl p-1.5 z-50 transition-all duration-150 origin-top ${
                  exploreOpen
                    ? "opacity-100 visible scale-100 translate-y-0"
                    : "opacity-0 invisible scale-95 -translate-y-1"
                }`}
                role="menu"
                aria-label="Explore navigation"
              >
                {secondaryNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setExploreOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-medium text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Actions: Theme Toggle & Dashboard CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--fog)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)]"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-[var(--gauge)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 transition-all shadow-xs active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--fog)] transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-[var(--gauge)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--fog)] transition-colors"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer — animated with max-h transition */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="border-b border-[var(--border)] bg-[var(--paper)] px-4 pt-2 pb-4 space-y-1">
          {[...primaryNav, ...secondaryNav].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[var(--fog)] text-[var(--ink)] font-semibold"
                  : "text-[var(--mist)] hover:text-[var(--ink)] hover:bg-[var(--fog)]/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--ink)] text-[var(--paper)] font-semibold text-sm hover:opacity-90 transition-all active:scale-[0.98]"
            >
              <Cpu className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
