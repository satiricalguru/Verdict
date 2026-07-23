"use client";

import React from "react";

interface VerdictLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function VerdictLogo({ className = "", size = "md" }: VerdictLogoProps) {
  const containerSizes = {
    sm: "w-7 h-7 rounded-lg p-1.5",
    md: "w-9 h-9 rounded-xl p-2",
    lg: "w-11 h-11 rounded-2xl p-2.5",
  }[size];

  const svgSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  return (
    <div
      className={`${containerSizes} bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center shrink-0 shadow-sm border border-[var(--ink)]/80 group-hover:scale-105 transition-transform duration-200 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={svgSizes}>
        {/* Minimalist Premium Geometric V (X.com Aesthetic) */}
        <path d="M3.5 3.5H7.7L12 14.5L16.3 3.5H20.5L13.7 20.5H10.3L3.5 3.5Z" />
      </svg>
    </div>
  );
}
