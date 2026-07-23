"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface VerdictDialProps {
  score: number; // 0 - 100
  size?: "sm" | "md" | "lg";
  minScore?: number;
  maxScore?: number;
  showNeedle?: boolean;
  showValue?: boolean;
  label?: string;
  className?: string;
}

export default function VerdictDial({
  score,
  size = "md",
  minScore = 60,
  maxScore = 95,
  showNeedle = true,
  showValue = true,
  label,
  className = "",
}: VerdictDialProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const dimensions = {
    sm: {
      width: 56,
      height: 56,
      radius: 21,
      strokeWidth: 4,
      fontSize: "text-[11px]",
      needleLength: 14,
      textOffset: showNeedle ? "pt-3" : "pt-0",
    },
    md: {
      width: 100,
      height: 100,
      radius: 38,
      strokeWidth: 6,
      fontSize: "text-sm",
      needleLength: 28,
      textOffset: showNeedle ? "pt-6" : "pt-0",
    },
    lg: {
      width: 160,
      height: 160,
      radius: 64,
      strokeWidth: 8,
      fontSize: "text-xl",
      needleLength: 46,
      textOffset: showNeedle ? "pt-10" : "pt-0",
    },
  }[size];

  const { width, height, radius, strokeWidth, fontSize, needleLength, textOffset } = dimensions;
  const center = width / 2;

  const startAngle = 135;
  const endAngle = 405;
  const angleRange = endAngle - startAngle;

  const scoreAngle = startAngle + (Math.min(100, Math.max(0, score)) / 100) * angleRange;
  const fieldMinAngle = startAngle + (Math.min(100, Math.max(0, minScore)) / 100) * angleRange;
  const fieldMaxAngle = startAngle + (Math.min(100, Math.max(0, maxScore)) / 100) * angleRange;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  const backgroundArc = describeArc(center, center, radius, startAngle, endAngle);
  const fieldArc = describeArc(center, center, radius, fieldMinAngle, fieldMaxAngle);
  const scoreArc = describeArc(center, center, radius, startAngle, scoreAngle);
  const needleEnd = polarToCartesian(center, center, needleLength, scoreAngle);

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
          role="img"
          aria-label={`Verdict Dial Score: ${score.toFixed(1)} out of 100`}
        >
          {/* Background Arc Track */}
          <path
            d={backgroundArc}
            fill="none"
            stroke="var(--mist)"
            strokeOpacity="0.25"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Target Field Arc */}
          <path
            d={fieldArc}
            fill="none"
            stroke="var(--mist)"
            strokeOpacity="0.45"
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
          />

          {/* Animated Score Arc */}
          {mounted && (
            <motion.path
              d={scoreArc}
              fill="none"
              stroke="var(--signal)"
              strokeWidth={strokeWidth + 1}
              strokeLinecap="round"
              initial={shouldReduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          {/* Needle & Center Pivot Dot */}
          {showNeedle && (
            <g>
              {mounted && (
                <motion.line
                  x1={center}
                  y1={center}
                  x2={needleEnd.x}
                  y2={needleEnd.y}
                  stroke="var(--ink)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { x2: center, y2: center }
                  }
                  animate={{ x2: needleEnd.x, y2: needleEnd.y }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              {/* Pivot Hub */}
              <circle cx={center} cy={center} r={Math.max(2.5, strokeWidth / 2.5)} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} />
            </g>
          )}
        </svg>

        {/* Score Value Display - Perfectly centered inside dial ring */}
        {showValue && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${textOffset} pointer-events-none`}>
            <span className={`font-mono font-bold tracking-tight text-[var(--ink)] ${fontSize} leading-none`}>
              {score.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {label && (
        <span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-[var(--mist)] text-center">
          {label}
        </span>
      )}
    </div>
  );
}
