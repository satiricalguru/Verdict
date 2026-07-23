"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { Terminal, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RunLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`/api/runs/${id}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.log) {
          setLogs((prev) => [...prev, data.log]);
          if (data.log.includes("COMPLETE")) {
            setIsComplete(true);
          }
        }
      } catch {
        // ignore parse error
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsComplete(true);
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--mist)] hover:text-[var(--signal)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)] rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-semibold text-2xl text-[var(--ink)] -tracking-[0.02em]">
            Execution Log: {id}
          </h1>
          <p className="text-xs font-mono text-[var(--mist)] mt-1">
            Target Model: Nova-1 • Status: {isComplete ? "Completed" : "Streaming..."} • Total Cost: $0.42
          </p>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold border ${
          isComplete
            ? "bg-[var(--pass)]/10 text-[var(--pass)] border-[var(--pass)]/20"
            : "bg-[var(--signal)]/10 text-[var(--signal)] border-[var(--signal)]/20"
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{isComplete ? "Run Complete" : "Live Streaming"}</span>
        </div>
      </div>

      {/* Terminal Live Stream Panel — uses design tokens */}
      <div className="rounded-xl bg-[var(--fog)] border border-[var(--border)] p-5 font-mono text-xs text-[var(--ink)] space-y-2 shadow-xs overflow-hidden min-h-[340px]">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 text-[var(--mist)] text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--signal)]" />
            <span className="text-[var(--ink)] font-semibold font-sans">engine.verdict.stdout</span>
          </div>
          <span className="font-mono text-[11px]">EventSource Stream: Active</span>
        </div>

        <div className="space-y-1.5 pt-2 text-[11px] leading-relaxed">
          {logs.map((line, index) => {
            const isSuccess = line.includes("SUCCESS") || line.includes("COMPLETE");
            const isInfo = line.includes("INFO");

            return (
              <div
                key={index}
                className={
                  isSuccess
                    ? "text-[var(--pass)] font-bold"
                    : isInfo
                    ? "text-[var(--ink)]"
                    : "text-[var(--mist)]"
                }
              >
                {line}
              </div>
            );
          })}

          {!isComplete && (
            <div className="text-[var(--signal)] font-semibold pt-2">
              &gt; Streaming logs from evaluation engine...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
