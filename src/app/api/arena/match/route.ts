import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

const SAMPLE_TEMPLATES = [
  {
    title: "Realtime Financial Analytics & Stream Engine",
    codeA: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    body { background: #090a0f; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; margin: 0; }
    .card { background: #11131f; border: 1px solid #222738; padding: 20px; border-radius: 12px; max-width: 540px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { display: flex; justify-content: space-between; align-items: center; border-b: 1px solid #1e2438; padding-bottom: 12px; margin-bottom: 16px; }
    .title { font-size: 14px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
    .badge { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
    .metric { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -0.02em; margin: 4px 0; }
    .delta { font-size: 13px; color: #10b981; font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 16px 0; }
    .stat { background: #181b2c; border: 1px solid #272d42; padding: 10px; border-radius: 8px; }
    .stat-lbl { font-size: 10px; color: #818cf8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
    .stat-val { font-size: 15px; font-weight: 700; color: #fff; margin-top: 2px; }
    .chart { height: 48px; width: 100%; display: flex; align-items: flex-end; gap: 4px; margin: 16px 0; }
    .bar { flex: 1; background: #6366f1; border-radius: 3px 3px 0 0; transition: height 0.3s; }
    .bar:nth-child(even) { background: #10b981; }
    .btn { width: 100%; background: #6366f1; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; }
    .btn:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="title">Realtime Portfolio Engine</div>
      <div class="badge">● LIVE STREAM</div>
    </div>
    <div class="metric">$2,849,120.45 <span class="delta">+18.4%</span></div>
    <div class="chart">
      <div class="bar" style="height: 40%"></div>
      <div class="bar" style="height: 65%"></div>
      <div class="bar" style="height: 50%"></div>
      <div class="bar" style="height: 85%"></div>
      <div class="bar" style="height: 70%"></div>
      <div class="bar" style="height: 95%"></div>
      <div class="bar" style="height: 80%"></div>
      <div class="bar" style="height: 100%"></div>
    </div>
    <div class="grid">
      <div class="stat"><div class="stat-lbl">Throughput</div><div class="stat-val">14,200/s</div></div>
      <div class="stat"><div class="stat-lbl">Latency</div><div class="stat-val">12.4 ms</div></div>
      <div class="stat"><div class="stat-lbl">Uptime</div><div class="stat-val">99.99%</div></div>
    </div>
    <button class="btn" onclick="alert('Executing automated order batch!')">Execute Stream Task</button>
  </div>
</body>
</html>`,
    codeB: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    body { background: #0a0b10; color: #e2e8f0; font-family: monospace; padding: 20px; margin: 0; }
    .terminal { background: #12131c; border: 1px solid #f5a623; border-radius: 10px; padding: 20px; max-width: 540px; }
    .top { display: flex; justify-content: space-between; align-items: center; border-b: 1px dashed #2a2d40; pb: 10px; margin-bottom: 14px; }
    .status { background: #f5a623; color: #000; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 3px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1a1c29; font-size: 12px; }
    .sym { color: #f5a623; font-weight: bold; }
    .val { color: #10b981; font-weight: bold; }
    .console { background: #08090d; border: 1px solid #1e202d; padding: 10px; border-radius: 6px; font-size: 11px; color: #94a3b8; margin-top: 14px; }
    .green { color: #10b981; }
  </style>
</head>
<body>
  <div class="terminal">
    <div class="top">
      <div style="font-weight:bold; color:#fff; font-size:13px;">HIGH-FREQUENCY MARKET TERMINAL</div>
      <div class="status">ONLINE</div>
    </div>
    <div class="row"><span class="sym">BTC/USD</span><span>$94,820.00</span><span class="val">+4.2%</span></div>
    <div class="row"><span class="sym">ETH/USD</span><span>$3,420.50</span><span class="val">+6.1%</span></div>
    <div class="row"><span class="sym">SOL/USD</span><span>$214.80</span><span class="val">+12.8%</span></div>
    <div class="console">
      <div class="green">✓ Worker pool: 64 threads initialized</div>
      <div>> Stream listening on port 8080...</div>
    </div>
  </div>
</body>
</html>`,
  },
  {
    title: "Developer Code Editor & Live Debugger",
    codeA: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    body { background: #0e1117; color: #c9d1d9; font-family: SFMono-Regular, Consolas, monospace; padding: 16px; margin: 0; }
    .ide { background: #161b22; border: 1px solid #30363d; border-radius: 10px; overflow: hidden; max-width: 540px; }
    .tabs { display: flex; background: #0d1117; border-b: 1px solid #30363d; }
    .tab { padding: 8px 16px; font-size: 12px; color: #8b949e; border-right: 1px solid #30363d; }
    .tab.active { color: #58a6ff; background: #161b22; border-bottom: 2px solid #58a6ff; font-weight: bold; }
    .code { padding: 14px; font-size: 12px; line-height: 1.6; }
    .kw { color: #ff7b72; }
    .fn { color: #d2a8ff; }
    .str { color: #a5d6ff; }
    .num { color: #79c0ff; }
    .cm { color: #8b949e; font-style: italic; }
    .footer { background: #0d1117; padding: 6px 14px; font-size: 11px; color: #3fb950; border-t: 1px solid #30363d; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="ide">
    <div class="tabs">
      <div class="tab active">engine.ts</div>
      <div class="tab">judge.py</div>
    </div>
    <div class="code">
      <span class="cm">// Verdict AI Benchmarking Engine</span><br/>
      <span class="kw">export async function</span> <span class="fn">gradeSample</span>(id: <span class="str">string</span>) {<br/>
      &nbsp;&nbsp;<span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">"/api/judge"</span>);<br/>
      &nbsp;&nbsp;<span class="kw">return</span> res.json();<br/>
      }
    </div>
    <div class="footer">
      <span>✓ TypeScript 5.3 Ready</span>
      <span>0 Errors</span>
    </div>
  </div>
</body>
</html>`,
    codeB: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    body { background: #0b0c10; color: #c5c6c7; font-family: monospace; padding: 16px; margin: 0; }
    .box { background: #1f2833; border: 1px solid #45a29e; border-radius: 8px; padding: 16px; max-width: 540px; }
    .hdr { color: #66fcf1; font-weight: bold; font-size: 13px; border-bottom: 1px solid #45a29e; padding-bottom: 8px; margin-bottom: 12px; }
    .log { font-size: 11px; padding: 4px 0; }
    .pass { color: #66fcf1; }
    .info { color: #45a29e; }
  </style>
</head>
<body>
  <div class="box">
    <div class="hdr">⚡ VERDICT BENCHMARK SUITE EXECUTION</div>
    <div class="log info">[12:45:01] INFO verdict.engine: Enqueuing benchmark run...</div>
    <div class="log pass">[12:45:03] SUCCESS verdict.judge: Multi-Judge Panel graded sample.</div>
    <div class="log pass">[12:45:05] SUCCESS verdict.engine: Run complete (Score: 98.4/100).</div>
  </div>
</body>
</html>`,
  },
];

export async function POST(request: Request) {
  try {
    let requestedAId: string | undefined;
    let requestedBId: string | undefined;

    try {
      const body = await request.json();
      requestedAId = body?.modelAId;
      requestedBId = body?.modelBId;
    } catch {
      // Body empty or invalid JSON, ignore
    }

    const models = await db.model.findMany({
      include: { provider: true },
    });

    let mA, mB;

    if (requestedAId && requestedBId) {
      mA = models.find((m) => m.id === requestedAId || m.slug === requestedAId);
      mB = models.find((m) => m.id === requestedBId || m.slug === requestedBId);
    }

    if (!mA || !mB) {
      if (models.length >= 2) {
        // Fisher-Yates shuffle for uniform randomness
        const shuffled = [...models];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        mA = shuffled[0];
        mB = shuffled[1];
      } else {
        mA = { id: "m1", name: "Claude Fable 5", composite: 98.4, arenaElo: 1500, slug: "claude-fable-5" };
        mB = { id: "m2", name: "GPT-5.6 Sol", composite: 96.2, arenaElo: 1500, slug: "gpt-5-6-sol" };
      }
    }

    const tpl = SAMPLE_TEMPLATES[Math.floor(Math.random() * SAMPLE_TEMPLATES.length)];

    // Fetch sample code from database if present
    const sampleA = await db.sample.findFirst({
      where: { run: { modelId: mA.id } },
      orderBy: { id: "desc" },
    });
    const sampleB = await db.sample.findFirst({
      where: { run: { modelId: mB.id } },
      orderBy: { id: "desc" },
    });

    const matchId = `match-${crypto.randomUUID().substring(0, 8)}`;

    // Randomly swap positions to prevent left-side bias
    const swapped = Math.random() < 0.5;
    const displayA = swapped ? mB : mA;
    const displayB = swapped ? mA : mB;
    const displayCodeA = swapped ? (sampleB?.rawOutput || tpl.codeB) : (sampleA?.rawOutput || tpl.codeA);
    const displayCodeB = swapped ? (sampleA?.rawOutput || tpl.codeA) : (sampleB?.rawOutput || tpl.codeB);

    return NextResponse.json({
      matchId,
      title: tpl.title,
      swapped,
      modelA: {
        id: displayA.id,
        name: displayA.name,
        slug: displayA.slug,
        score: displayA.composite,
        elo: displayA.arenaElo ?? (1600 + Math.round(displayA.composite * 5)),
        code: displayCodeA,
      },
      modelB: {
        id: displayB.id,
        name: displayB.name,
        slug: displayB.slug,
        score: displayB.composite,
        elo: displayB.arenaElo ?? (1600 + Math.round(displayB.composite * 5)),
        code: displayCodeB,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch arena match";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
