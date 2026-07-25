"use client";

import React, { useState } from "react";

interface ProviderLogoProps {
  provider: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function ProviderLogo({
  provider,
  className = "",
  size = "md",
}: ProviderLogoProps) {
  const [hasError, setHasError] = useState(false);
  const p = (provider || "").toLowerCase().trim();

  const containerSizes = {
    xs: "w-6 h-6 rounded-md",
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-xl",
  }[size];

  // Map provider or model name to the exact processed image in /logos/
  let logoFileName: string | null = null;
  let bgClass = "bg-white border border-zinc-200 shadow-sm";
  let imgFit = "p-1.5 w-full h-full object-contain";

  if (p.includes("reve")) {
    logoFileName = "reve.svg";
    bgClass = "bg-transparent border-0 shadow-none";
    imgFit = "w-full h-full object-cover rounded-md";
  } else if (p.includes("microsoft") || p.includes("mai")) {
    logoFileName = "microsoft.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("anthropic") || p.includes("claude")) {
    logoFileName = "anthropic.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("qwen") || p.includes("alibaba")) {
    logoFileName = "qwen.png";
    bgClass = "bg-transparent border-0 shadow-none";
    imgFit = "w-full h-full object-cover rounded-md";
  } else if (p.includes("deepseek")) {
    logoFileName = "deepseek.png";
    bgClass = "bg-transparent border-0 shadow-none";
    imgFit = "w-full h-full object-cover rounded-md";
  } else if (p.includes("google") || p.includes("gemini")) {
    logoFileName = "gemini.png";
    bgClass = "bg-transparent border-0 shadow-none";
    imgFit = "w-full h-full object-cover rounded-md";
  } else if (p.includes("z.ai") || p.includes("zhipu") || p.includes("glm")) {
    logoFileName = "glm.svg";
    bgClass = "bg-transparent border-0 shadow-none";
    imgFit = "w-full h-full object-cover rounded-md";
  } else if (p.includes("moonshot") || p.includes("kimi")) {
    logoFileName = "kimi.png";
    bgClass = "bg-transparent border-0 shadow-none";
    imgFit = "w-full h-full object-cover rounded-md";
  } else if (p.includes("nvidia")) {
    logoFileName = "nvidia.png";
    bgClass = "bg-transparent border-0 shadow-none";
    imgFit = "w-full h-full object-cover rounded-md";
  } else if (p.includes("openai")) {
    logoFileName = "openai.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("meta") || p.includes("llama")) {
    logoFileName = "meta.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("xai") || p.includes("grok") || p.includes("spacex")) {
    logoFileName = "xai.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("mistral")) {
    logoFileName = "mistral.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("baidu")) {
    logoFileName = "baidu.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("bytedance")) {
    logoFileName = "bytedance.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("xiaomi")) {
    logoFileName = "xiaomi.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("minimax")) {
    logoFileName = "minimax.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  }

  return (
    <div
      className={`${containerSizes} ${bgClass} flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      title={provider}
    >
      {logoFileName && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/logos/${logoFileName}`}
          alt={`${provider} logo`}
          className={imgFit}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="font-mono font-bold text-zinc-900 text-xs uppercase">
          {(provider || "AI").charAt(0)}
        </span>
      )}
    </div>
  );
}
