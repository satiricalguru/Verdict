"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Eye, Code, ExternalLink, Filter } from "lucide-react";
import ProviderLogo from "@/components/ui/provider-logo";

// ─── Mock showcase data ───────────────────────────────────────────────────────
const SHOWCASE_ITEMS = [
  {
    id: "s1",
    title: "Neon Dashboard UI",
    category: "Frontend UI",
    model: "Claude Fable 5",
    provider: "Anthropic",
    score: 95.2,
    code: `<!DOCTYPE html><html><head><style>
body{background:#0a0b14;color:#fff;font-family:sans-serif;padding:24px;margin:0;}
.card{background:linear-gradient(135deg,#161c2e,#0d1117);border:1px solid #30363d;border-radius:12px;padding:20px;margin-bottom:16px;}
.stat{font-size:32px;font-weight:700;background:linear-gradient(135deg,#58a6ff,#bc8cff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.bar{height:6px;background:#21262d;border-radius:3px;overflow:hidden;margin:8px 0;}
.fill{height:100%;background:linear-gradient(90deg,#58a6ff,#bc8cff);border-radius:3px;}
h3{margin:0 0 12px;font-size:13px;color:#8b949e;text-transform:uppercase;letter-spacing:1px;}
</style></head><body>
<div class="card"><h3>CPU Usage</h3><div class="stat">72<small style="font-size:16px;color:#8b949e">%</small></div><div class="bar"><div class="fill" style="width:72%"></div></div></div>
<div class="card"><h3>Memory</h3><div class="stat">4.2<small style="font-size:16px;color:#8b949e">GB</small></div><div class="bar"><div class="fill" style="width:60%;background:linear-gradient(90deg,#56d364,#2ea043)"></div></div></div>
</body></html>`,
  },
  {
    id: "s2",
    title: "Retro Space Shooter",
    category: "Game Dev",
    model: "GPT-5.6 Sol",
    provider: "OpenAI",
    score: 92.1,
    code: `<!DOCTYPE html><html><head><style>canvas{background:#000;display:block;margin:0 auto;}</style></head><body>
<canvas id="c" width="400" height="300"></canvas>
<script>
const c=document.getElementById('c'),ctx=c.getContext('2d');
let ship={x:200,y:260,w:20,h:20},bullets=[],stars=[],score=0,enemies=[];
for(let i=0;i<50;i++)stars.push({x:Math.random()*400,y:Math.random()*300,r:Math.random()*1.5});
for(let i=0;i<5;i++)enemies.push({x:40+i*70,y:40,w:20,h:14});
document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')ship.x-=15;if(e.key==='ArrowRight')ship.x+=15;if(e.key===' ')bullets.push({x:ship.x+10,y:ship.y});});
function draw(){
  ctx.clearRect(0,0,400,300);
  stars.forEach(s=>{ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
  ctx.fillStyle='#4dff91';ctx.beginPath();ctx.moveTo(ship.x+10,ship.y);ctx.lineTo(ship.x,ship.y+20);ctx.lineTo(ship.x+20,ship.y+20);ctx.fill();
  bullets.forEach((b,i)=>{ctx.fillStyle='#ff0';ctx.fillRect(b.x+9,b.y,2,8);b.y-=5;if(b.y<0)bullets.splice(i,1);});
  enemies.forEach(e=>{ctx.fillStyle='#f55';ctx.fillRect(e.x,e.y,e.w,e.h);});
  ctx.fillStyle='#fff';ctx.font='12px monospace';ctx.fillText('Score: '+score,10,20);
  requestAnimationFrame(draw);
}draw();
</script></body></html>`,
  },
  {
    id: "s3",
    title: "Geometric SVG Mandala",
    category: "SVG Art",
    model: "Kimi K3",
    provider: "Moonshot",
    score: 89.4,
    code: `<!DOCTYPE html><html><head><style>body{margin:0;background:#0f0f1a;display:flex;align-items:center;justify-content:center;min-height:100vh;}</style></head><body>
<svg width="300" height="300" viewBox="0 0 300 300">
<defs>
  <radialGradient id="g1" cx="50%" cy="50%"><stop offset="0%" stop-color="#e8b54b"/><stop offset="100%" stop-color="#4d6bfe"/></radialGradient>
</defs>
${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,r=100;const x=150+r*Math.cos(a),y=150+r*Math.sin(a);return `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="url(#g1)" stroke-width="1.5" opacity="${0.4+i*0.05}"/>`;}).join('')}
${Array.from({length:6},(_,i)=>{const a=i*60*Math.PI/180,r=60;const x=150+r*Math.cos(a),y=150+r*Math.sin(a);return `<polygon points="${x},${y-15} ${x-13},${y+8} ${x+13},${y+8}" fill="url(#g1)" opacity="0.7"/>`;}).join('')}
<circle cx="150" cy="150" r="20" fill="url(#g1)"/>
<circle cx="150" cy="150" r="6" fill="#fff"/>
</svg></body></html>`,
  },
  {
    id: "s4",
    title: "Creative Haiku Generator",
    category: "Creative",
    model: "Claude Opus 4.8",
    provider: "Anthropic",
    score: 91.8,
    code: `<!DOCTYPE html><html><head><style>
body{background:#0d0d0d;color:#e2e8f0;font-family:'Georgia',serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
.container{max-width:440px;text-align:center;padding:40px;}
h1{font-size:13px;letter-spacing:3px;color:#666;text-transform:uppercase;margin-bottom:32px;}
.haiku{font-size:22px;line-height:1.9;color:#f8f4ef;margin:20px 0;}
.haiku p{margin:0;font-style:italic;}
.author{margin-top:24px;font-size:12px;color:#555;letter-spacing:1px;}
button{margin-top:28px;background:transparent;border:1px solid #333;color:#999;padding:10px 24px;border-radius:4px;cursor:pointer;font-size:12px;letter-spacing:1px;text-transform:uppercase;transition:all 0.2s;}
button:hover{border-color:#666;color:#e2e8f0;}
</style></head><body>
<div class="container">
  <h1>Haiku Generator</h1>
  <div class="haiku" id="h">
    <p>Cherry blossoms fall</p><p>In the silence of winter</p><p>Code compiles at last</p>
  </div>
  <div class="author">— AI Composed</div>
  <button onclick="gen()">Generate New</button>
</div>
<script>
const haikus=[
  ['Stars guide the wanderer','Through paths of ancient forest','Home was always near'],
  ['Rain on dark server','Electrons dream of sunrise','Cache clears at midnight'],
  ['One function returns','The entire universe bends','Then garbage collects'],
];
function gen(){const h=haikus[Math.floor(Math.random()*haikus.length)];document.getElementById('h').innerHTML=h.map(l=>'<p>'+l+'</p>').join('');}
</script></body></html>`,
  },
  {
    id: "s5",
    title: "Multi-Step Planner Agent",
    category: "Agentic",
    model: "GPT-5.5",
    provider: "OpenAI",
    score: 88.6,
    code: `<!DOCTYPE html><html><head><style>
body{background:#090912;color:#c9d1d9;font-family:monospace;padding:20px;margin:0;}
.step{padding:10px 14px;margin:8px 0;border-radius:6px;border-left:3px solid #30363d;font-size:12px;line-height:1.6;}
.step.done{border-color:#56d364;background:rgba(86,211,100,0.06);}
.step.active{border-color:#58a6ff;background:rgba(88,166,255,0.06);animation:pulse 1.5s infinite;}
.step.pending{opacity:0.4;}
.label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#8b949e;margin-bottom:4px;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
</style></head><body>
<div style="font-size:11px;color:#8b949e;margin-bottom:16px;letter-spacing:1px">AGENT · REFACTOR PIPELINE</div>
<div class="step done"><div class="label">✓ Step 1 — Analysis</div>Parsed 847 lines across 12 modules. Found 23 code smells.</div>
<div class="step done"><div class="label">✓ Step 2 — Planning</div>Generated 8-step refactor plan. Estimated complexity: medium.</div>
<div class="step active"><div class="label">⟳ Step 3 — Extract Functions</div>Extracting 6 utility functions into /lib/utils.ts…</div>
<div class="step pending"><div class="label">  Step 4 — Type Safety</div>Add TypeScript interfaces to all data models.</div>
<div class="step pending"><div class="label">  Step 5 — Tests</div>Generate 40+ unit tests with 90%+ coverage.</div>
</body></html>`,
  },
  {
    id: "s6",
    title: "3D Cube Orbit Scene",
    category: "3D Graphics",
    model: "Gemini 3.6 Flash",
    provider: "Google",
    score: 87.3,
    code: `<!DOCTYPE html><html><head><style>body{margin:0;background:#050510;overflow:hidden;}</style></head><body>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c');c.width=window.innerWidth;c.height=window.innerHeight;
const ctx=c.getContext('2d');let t=0;
const project=(x,y,z)=>{const fov=300,d=fov/(z+400);return{x:x*d+c.width/2,y:y*d+c.height/2};};
const cube=[[-80,-80,-80],[80,-80,-80],[80,80,-80],[-80,80,-80],[-80,-80,80],[80,-80,80],[80,80,80],[-80,80,80]];
const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
function rotate(pts){return pts.map(([x,y,z])=>{const cx=Math.cos(t),sx=Math.sin(t),cy=Math.cos(t*0.7),sy=Math.sin(t*0.7);const y2=cy*y-sy*z,z2=sy*y+cy*z;return[cx*x+sx*z2,y2,-sx*x+cx*z2];});}
function draw(){ctx.clearRect(0,0,c.width,c.height);const r=rotate(cube);ctx.strokeStyle='rgba(77,107,254,0.8)';ctx.lineWidth=1.5;edges.forEach(([a,b])=>{const p=project(...r[a]),q=project(...r[b]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();});r.forEach(([x,y,z])=>{const p=project(x,y,z);ctx.fillStyle='#e8b54b';ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();});t+=0.012;requestAnimationFrame(draw);}draw();
</script></body></html>`,
  },
  {
    id: "s7",
    title: "Real-time Data Dashboard",
    category: "Data Viz",
    model: "Claude Sonnet 4.6",
    provider: "Anthropic",
    score: 90.5,
    code: `<!DOCTYPE html><html><head><style>
body{background:#0a0a0f;color:#c9d1d9;font-family:sans-serif;padding:20px;margin:0;}
canvas{background:#111;border:1px solid #21262d;border-radius:8px;}
h3{margin:0 0 12px;font-size:12px;color:#8b949e;text-transform:uppercase;letter-spacing:1px;}
</style></head><body>
<h3>Live Network Traffic</h3>
<canvas id="c" width="400" height="180"></canvas>
<script>
const c=document.getElementById('c'),ctx=c.getContext('2d');
let data=Array.from({length:60},()=>Math.random()*120+30);
function draw(){
  ctx.clearRect(0,0,400,180);
  ctx.beginPath();ctx.strokeStyle='#58a6ff';ctx.lineWidth=1.5;
  data.forEach((v,i)=>{i===0?ctx.moveTo(i*(400/60),180-v):ctx.lineTo(i*(400/60),180-v);});ctx.stroke();
  ctx.fillStyle='rgba(88,166,255,0.1)';ctx.lineTo(400,180);ctx.lineTo(0,180);ctx.fill();
  data.shift();data.push(Math.random()*120+30);requestAnimationFrame(draw);
}draw();
</script></body></html>`,
  },
  {
    id: "s8",
    title: "CSS Scroll Animation",
    category: "Animation",
    model: "Qwen 3.7 Max",
    provider: "Qwen",
    score: 86.9,
    code: `<!DOCTYPE html><html><head><style>
*{box-sizing:border-box;}body{margin:0;background:#080810;font-family:sans-serif;overflow-x:hidden;}
.item{height:100vh;display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(40px);transition:all 0.8s cubic-bezier(0.22,1,0.36,1);}
.item.visible{opacity:1;transform:translateY(0);}
.card{background:linear-gradient(135deg,#161c2e,#0d1117);border:1px solid #30363d;padding:40px;border-radius:16px;text-align:center;color:#c9d1d9;max-width:400px;}
h2{font-size:2rem;margin:0 0 12px;background:linear-gradient(135deg,#58a6ff,#bc8cff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
</style></head><body>
<div class="item"><div class="card"><h2>Frame One</h2><p>Scroll down to reveal animations</p></div></div>
<div class="item"><div class="card"><h2>Frame Two</h2><p>Each element fades up smoothly</p></div></div>
<div class="item"><div class="card"><h2>Frame Three</h2><p>Powered by IntersectionObserver</p></div></div>
<script>
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.3});
document.querySelectorAll('.item').forEach(el=>obs.observe(el));
</script></body></html>`,
  },
  {
    id: "s9",
    title: "Full-Stack Auth Flow",
    category: "Full-Stack",
    model: "DeepSeek V4 Pro",
    provider: "DeepSeek",
    score: 85.4,
    code: `<!DOCTYPE html><html><head><style>
body{background:#090912;color:#c9d1d9;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
.form{background:#0d1117;border:1px solid #30363d;border-radius:12px;padding:32px;width:320px;}
h2{margin:0 0 24px;font-size:16px;color:#e6edf3;}
input{width:100%;padding:8px 12px;background:#161b22;border:1px solid #30363d;border-radius:6px;color:#c9d1d9;font-size:13px;margin-bottom:12px;box-sizing:border-box;outline:none;}
input:focus{border-color:#58a6ff;}
button{width:100%;padding:10px;background:#238636;border:none;border-radius:6px;color:#fff;font-size:13px;cursor:pointer;transition:background 0.2s;}
button:hover{background:#2ea043;}
.divider{text-align:center;color:#8b949e;font-size:11px;margin:16px 0;}
.alt{color:#58a6ff;font-size:12px;text-align:center;margin-top:12px;cursor:pointer;}
</style></head><body>
<div class="form">
  <h2>Sign in to Verdict</h2>
  <input type="email" placeholder="Email address" />
  <input type="password" placeholder="Password" />
  <button>Sign in</button>
  <div class="divider">or continue with</div>
  <button style="background:#21262d">GitHub OAuth</button>
  <div class="alt">Forgot password?</div>
</div></body></html>`,
  },
];

const CATEGORIES = ["All", "Frontend UI", "Game Dev", "SVG Art", "Creative", "Agentic", "3D Graphics", "Data Viz", "Animation", "Full-Stack"];

export default function ShowcasePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<Record<string, "preview" | "code">>({});

  const filtered = useMemo(() =>
    activeCategory === "All"
      ? SHOWCASE_ITEMS
      : SHOWCASE_ITEMS.filter((i) => i.category === activeCategory),
    [activeCategory]
  );

  const getView = (id: string) => viewMode[id] ?? "preview";
  const setView = (id: string, mode: "preview" | "code") =>
    setViewMode((prev) => ({ ...prev, [id]: mode }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--signal)]">
              <Sparkles className="w-4 h-4" />
              <span>Community Generation Gallery</span>
              <span className="ml-2 flex items-center gap-1.5 text-[var(--pass)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--pass)] live-dot" />
                LIVE
              </span>
            </div>
            <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[var(--ink)] -tracking-[0.02em] leading-tight">
              Community Output Showcase
            </h1>
            <p className="text-sm text-[var(--mist)] max-w-3xl">
              Opt-in showcase of top-rated model generations evaluated by the Verdict judge panel. Each card renders in a sandboxed isolated runtime.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--mist)] shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>{filtered.length} items</span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--signal)] ${
                activeCategory === cat
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "bg-[var(--fog)] text-[var(--mist)] border border-[var(--border)] hover:text-[var(--ink)] hover:bg-[var(--paper)]"
              }`}
            >
              {cat}
              {activeCategory === cat && cat !== "All" && (
                <span className="ml-1.5 opacity-70">
                  {SHOWCASE_ITEMS.filter((i) => i.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[var(--paper)] border border-[var(--border)] p-5 space-y-4 hover:border-[var(--signal)] transition-all duration-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ProviderLogo provider={item.provider} size="sm" />
                <div>
                  <h3 className="font-sans font-semibold text-sm text-[var(--ink)]">{item.title}</h3>
                  <p className="text-[10px] font-mono text-[var(--mist)] mt-0.5">
                    {item.model} · {item.provider}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider border border-[var(--border)] text-[var(--mist)]">
                {item.category}
              </span>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setView(item.id, "preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  getView(item.id) === "preview"
                    ? "bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)]"
                    : "text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
              <button
                onClick={() => setView(item.id, "code")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  getView(item.id) === "code"
                    ? "bg-[var(--fog)] text-[var(--ink)] border border-[var(--border)]"
                    : "text-[var(--mist)] hover:text-[var(--ink)]"
                }`}
              >
                <Code className="w-3 h-3" /> Code
              </button>
            </div>

            {/* Output */}
            <div className="h-48 rounded-lg overflow-hidden border border-[var(--border)]"
              style={{ background: getView(item.id) === "code" ? "#060706" : "var(--fog)" }}>
              {getView(item.id) === "preview" ? (
                <iframe
                  srcDoc={item.code}
                  title={item.title}
                  className="w-full h-full border-none pointer-events-none"
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="p-3 text-[10px] font-mono text-[var(--mist)] overflow-auto h-full leading-relaxed">
                  {item.code}
                </pre>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-14 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--signal)]" style={{ width: `${item.score}%` }} />
                </div>
                <span className="font-mono font-bold text-sm text-[var(--ink)]">{item.score.toFixed(1)}</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--pass)] flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Sandboxed CSP
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center text-[var(--mist)] font-mono text-sm">
          No items found for &quot;{activeCategory}&quot;.
        </div>
      )}
    </div>
  );
}
