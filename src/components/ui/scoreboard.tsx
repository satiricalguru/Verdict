"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

interface ScoreboardProps {
  value: number;
  decimals?: number;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function Scoreboard({
  value,
  decimals = 1,
  label,
  size = "lg",
  prefix = "",
  suffix = "",
  className = "",
}: ScoreboardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(() => (shouldReduceMotion ? value : 0));

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1200;
    const initialVal = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = initialVal + (value - initialVal) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value, shouldReduceMotion]);

  const formattedStr = displayValue.toFixed(decimals);
  const chars = formattedStr.split("");

  const sizeClasses = {
    sm: "text-lg gap-1",
    md: "text-2xl gap-1.5",
    lg: "text-4xl gap-2",
    xl: "text-4xl sm:text-5xl gap-2",
  }[size];

  const charBoxSize = {
    sm: "min-w-[1.2rem] h-[1.8rem]",
    md: "min-w-[1.8rem] h-[2.5rem]",
    lg: "min-w-[2.4rem] h-[3.4rem]",
    xl: "min-w-[2.8rem] sm:min-w-[3.4rem] h-[3.8rem] sm:h-[4.5rem]",
  }[size];

  const suffixFontSize = {
    sm: "text-xs mb-1",
    md: "text-sm mb-1",
    lg: "text-lg mb-1.5",
    xl: "text-xl sm:text-2xl mb-2",
  }[size];

  return (
    <div className={`inline-flex flex-col items-center max-w-full select-none ${className}`}>
      <div className={`flex items-center flex-wrap justify-center font-mono font-bold ${sizeClasses}`}>
        {prefix && <span className="mr-1 text-[var(--mist)] text-sm">{prefix}</span>}
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          {chars.map((char, index) => {
            if (char === ".") {
              return (
                <span key={`dot-${index}`} className="text-[var(--signal)] px-0.5 self-center">
                  .
                </span>
              );
            }

            return (
              <div
                key={`digit-${index}-${char}`}
                className={`relative flex items-center justify-center rounded-lg bg-[var(--paper)] border border-[var(--border)] shadow-xs text-[var(--ink)] ${charBoxSize} overflow-hidden`}
              >
                {/* Animated Flip Character */}
                
                {/* Animated Flip Character */}
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={char}
                    initial={shouldReduceMotion ? false : { y: -12, opacity: 0, rotateX: 60 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={shouldReduceMotion ? undefined : { y: 12, opacity: 0, rotateX: -60 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="z-0 font-mono tracking-tight drop-shadow-xs"
                  >
                    {char}
                  </motion.span>
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {suffix && (
          <span className={`ml-2 font-mono font-bold text-[var(--signal)] opacity-90 self-end ${suffixFontSize}`}>
            {suffix}
          </span>
        )}
      </div>

      {label && (
        <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--mist)] text-center">
          {label}
        </span>
      )}
    </div>
  );
}
