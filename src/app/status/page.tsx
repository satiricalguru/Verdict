import React from "react";
import { Activity, CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  const services = [
    { name: "Public Scoreboard API", status: "Operational", uptime: "99.98%" },
    { name: "Multi-Judge Engine Pipeline", status: "Operational", uptime: "99.95%" },
    { name: "Sandboxed Preview Subdomain", status: "Operational", uptime: "100.0%" },
    { name: "Worker Queue Cluster", status: "Operational", uptime: "99.99%" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--pass)]">
            <Activity className="w-4 h-4" />
            <span>Live System Status</span>
          </div>
          <span className="text-xs font-mono text-[var(--mist)]">
            Checked every 60s
          </span>
        </div>

        <h1 className="font-display font-black text-3xl text-[var(--ink)]">
          All Verdict Services Operational
        </h1>

        <div className="divide-y divide-[var(--border)] font-mono text-xs pt-4 border-t border-[var(--border)]">
          {services.map((s) => (
            <div key={s.name} className="py-3 flex items-center justify-between">
              <span className="font-bold text-[var(--ink)]">{s.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-[var(--mist)]">{s.uptime}</span>
                <span className="inline-flex items-center gap-1 text-[var(--pass)] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{s.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
