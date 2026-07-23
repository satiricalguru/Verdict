"use client";

import React, { useState } from "react";

interface ProviderLogoProps {
  provider: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProviderLogo({
  provider,
  className = "",
  size = "md",
}: ProviderLogoProps) {
  const [hasError, setHasError] = useState(false);
  const p = (provider || "").toLowerCase().trim();

  const containerSizes = {
    sm: "w-7 h-7 rounded-md",
    md: "w-9 h-9 rounded-lg",
    lg: "w-11 h-11 rounded-xl",
  }[size];

  // Map provider or model name to the exact processed image in /logos/
  let logoFileName = "anthropic.svg";
  let bgClass = "bg-white border border-zinc-200 shadow-sm";
  let imgFit = "p-1 object-contain";

  if (p.includes("qwen") || p.includes("alibaba")) {
    logoFileName = "qwen.png";
    imgFit = "w-full h-full object-cover rounded-lg";
  } else if (p.includes("deepseek")) {
    logoFileName = "deepseek.png";
    imgFit = "w-full h-full object-cover rounded-lg";
  } else if (p.includes("google") || p.includes("gemini")) {
    logoFileName = "google.png";
    imgFit = "w-full h-full object-cover rounded-lg";
  } else if (p.includes("z.ai") || p.includes("zhipu") || p.includes("glm")) {
    logoFileName = "glm.png";
    imgFit = "w-full h-full object-cover rounded-lg";
  } else if (p.includes("moonshot") || p.includes("kimi")) {
    logoFileName = "kimi.png";
    imgFit = "w-full h-full object-cover rounded-lg";
  } else if (p.includes("nvidia")) {
    logoFileName = "nvidia.png";
    imgFit = "w-full h-full object-cover rounded-lg";
  } else if (p.includes("microsoft")) {
    logoFileName = "microsoft.png";
    imgFit = "p-1 w-full h-full object-contain";
  } else if (p.includes("openai")) {
    logoFileName = "openai.svg";
    imgFit = "p-1.5 w-full h-full object-contain";
  } else if (p.includes("meta")) {
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
      {!hasError ? (
        <img
          src={`/logos/${logoFileName}`}
          alt={`${provider} logo`}
          className={imgFit}
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="font-mono font-bold text-black text-xs uppercase">
          {(provider || "AI").charAt(0)}
        </span>
      )}
    </div>
  );
}
