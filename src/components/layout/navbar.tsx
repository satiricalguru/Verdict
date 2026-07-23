"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, Cpu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    const timer = setTimeout(() => setIsDark(isDarkMode), 0);
    return () => clearTimeout(timer);
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

  const navLinks = [
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/categories", label: "Categories" },
    { href: "/arena", label: "Arena" },
    { href: "/compatibility", label: "Compatibility" },
    { href: "/prompts", label: "Prompts" },
    { href: "/showcase", label: "Showcase" },
    { href: "/docs", label: "Docs" },
    { href: "/self-host", label: "Self-Host" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--paper)]/80 border-b border-[var(--border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-md bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center font-mono font-bold text-lg group-hover:bg-[var(--signal)] transition-colors shadow-sm">
              V
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-[var(--ink)]">
                VERDICT
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[var(--mist)] uppercase -mt-1">
                AI BENCHMARK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--fog)] text-[var(--signal)] font-semibold"
                      : "text-[var(--ink)] opacity-80 hover:opacity-100 hover:bg-[var(--fog)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle & Dashboard CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--fog)] transition-colors"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-[var(--gauge)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-[var(--signal)] text-white hover:bg-[var(--signal-hover)] transition-all shadow-sm active:scale-95"
            >
              <Cpu className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-[var(--border)] text-[var(--ink)]"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-[var(--gauge)]" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md border border-[var(--border)] text-[var(--ink)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[var(--border)] bg-[var(--paper)] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[var(--ink)] hover:bg-[var(--fog)]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--signal)] text-white font-semibold"
            >
              <Cpu className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
