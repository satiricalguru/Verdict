"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
          <Mail className="w-4 h-4" />
          <span>Maintainer Contact</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
          Get in Touch
        </h1>
        <p className="text-sm text-[var(--mist)]">
          Have feedback on scoring rubrics, benchmark prompts, or self-hosting? Send us a message.
        </p>
      </div>

      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[var(--pass)] mx-auto" />
            <h2 className="font-display font-bold text-2xl text-[var(--ink)]">
              Message Received
            </h2>
            <p className="text-xs text-[var(--mist)] font-mono">
              Thank you for reaching out! A Verdict maintainer will respond shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[var(--ink)] mb-1">
                Name
              </label>
              <input
                type="text"
                required
                placeholder="Your Name"
                className="w-full p-2.5 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] focus:outline-none focus:border-[var(--signal)]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[var(--ink)] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full p-2.5 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] focus:outline-none focus:border-[var(--signal)]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[var(--ink)] mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="Model benchmark inquiry, self-host feedback..."
                className="w-full p-2.5 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] focus:outline-none focus:border-[var(--signal)]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[var(--ink)] mb-1">
                Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your message..."
                className="w-full p-2.5 text-sm bg-[var(--fog)] border border-[var(--border)] rounded-md text-[var(--ink)] focus:outline-none focus:border-[var(--signal)]"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[var(--signal)] text-white font-semibold text-sm hover:bg-[var(--signal-hover)] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
