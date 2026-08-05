import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface SeedModel {
  rank: number;
  name: string;
  slug: string;
  provider: string | null;
  releaseDate: string | null;
  isOpenWeight: boolean;
  isReasoning: boolean;
  priceIn: number;
  priceOut: number;
  composite: number;
  capabilities: Record<string, unknown>;
}

function loadModels(): SeedModel[] {
  const file = path.join(__dirname, "models-data.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  return raw as SeedModel[];
}

async function main() {
  const modelsData = loadModels();
  console.log(`Seeding Verdict database with Artificial Analysis leaderboard (${modelsData.length} models)...`);

  // Clean existing data
  await prisma.judgment.deleteMany({});
  await prisma.sample.deleteMany({});
  await prisma.run.deleteMany({});
  await prisma.arenaMatch.deleteMany({});
  await prisma.prompt.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.model.deleteMany({});
  await prisma.provider.deleteMany({});

  // Seed Providers from Artificial Analysis creator data
  const providerNames = [...new Set(modelsData.map((m) => m.provider).filter((p): p is string => !!p))].sort();
  const providerMap: Record<string, { id: string }> = {};
  for (const name of providerNames) {
    const created = await prisma.provider.create({
      data: {
        name,
        logoUrl: `/logos/${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.svg`,
      },
    });
    providerMap[name] = created;
  }
  console.log(`Providers: ${providerNames.length}`);

  // Seed Models — exact copy of the artificialanalysis.ai leaderboard,
  // ranked by Intelligence Index (rank = site order, composite = exact index)
  for (const mData of modelsData) {
    const prov = mData.provider ? providerMap[mData.provider] : providerMap["Anthropic"];
    if (!prov) {
      throw new Error(`Provider missing for ${mData.slug}`);
    }
    await prisma.model.create({
      data: {
        providerId: prov.id,
        name: mData.name,
        slug: mData.slug,
        modelIdString: mData.slug,
        releaseDate: mData.releaseDate ? new Date(mData.releaseDate) : null,
        priceInput: mData.priceIn,
        priceOutput: mData.priceOut,
        isOpenWeight: mData.isOpenWeight,
        capabilities: JSON.stringify(mData.capabilities),
        composite: mData.composite,
      },
    });
  }

  // Seed All 10 Categories
  const categoryDefs = [
    { name: "Frontend UI", slug: "frontend-ui", typeTag: "Interactive", description: "Landing pages, dashboards, responsive CSS, accessible forms." },
    { name: "Game Dev", slug: "game-dev", typeTag: "Interactive", description: "Browser 2D canvas games, physics loops, platformers, shooters." },
    { name: "SVG Art", slug: "svg-art", typeTag: "Visual", description: "Vector illustrations, generative math art, isometric cityscapes." },
    { name: "Agentic Tasks", slug: "agentic-tasks", typeTag: "Autonomous", description: "Multi-step refactoring, execution planning, tool use." },
    { name: "Creative Writing", slug: "creative-writing", typeTag: "Textual", description: "Technical documentation, release notes, lore generation." },
    { name: "3D Graphics", slug: "3d-graphics", typeTag: "Visual", description: "Three.js WebGL scenes, shader shaders, 3D meshes." },
    { name: "Data Viz", slug: "data-viz", typeTag: "Interactive", description: "Recharts, D3 SVG charts, heatmaps, interactive data graphs." },
    { name: "Animation", slug: "animation", typeTag: "Interactive", description: "CSS keyframe timelines, Framer Motion springs, micro-interactions." },
    { name: "Full-Stack", slug: "full-stack", typeTag: "Autonomous", description: "API routes, database ORM queries, auth middleware." },
    { name: "Code Golf", slug: "code-golf", typeTag: "Algorithmic", description: "Byte-minified solutions, algorithm optimization, math solvers." },
  ];

  const createdCategories: Record<string, { id: string }> = {};
  for (const cat of categoryDefs) {
    const createdCat = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = createdCat;
  }

  // Seed Prompts for ALL 10 Categories (10 High-Level Prompts Per Category = 100 Total)
  const promptDefs = [
    // ── 1. Frontend UI ──
    { cat: "frontend-ui", title: "Realtime Financial Analytics Dashboard", body: "Create a modern dark-mode stock portfolio analytics dashboard with dynamic SVG charts, tabular data, search filter pills, and accessible theme controls.", diff: "Hard" },
    { cat: "frontend-ui", title: "Enterprise SaaS Billing & Subscription Portal", body: "Build a responsive SaaS pricing and billing portal featuring monthly/annual toggle switches, tier feature comparison matrix, dynamic tax estimation, and interactive checkout modal.", diff: "Hard" },
    { cat: "frontend-ui", title: "Multimodal AI Chat & Artifact Inspector", body: "Implement a glassmorphism AI chat interface with rich markdown rendering, code block copy buttons, collapsible thoughts drawer, and side-by-side artifact preview.", diff: "Hard" },
    { cat: "frontend-ui", title: "Accessible E-Commerce Product Explorer", body: "Create a high-performance product catalog with multi-facet filters (category, price range, ratings), grid/list view toggle, quick view modal, and keyboard-navigable pagination.", diff: "Medium" },
    { cat: "frontend-ui", title: "Real-time KanBan Task Board", body: "Build a drag-and-drop KanBan board supporting custom column creation, subtask progress indicators, tag filters, user avatar assignments, and undo toast notifications.", diff: "Medium" },
    { cat: "frontend-ui", title: "Developer Documentation Portal with Search", body: "Implement a documentation layout featuring a sticky sidebar tree, inline code playground, TOC outline observer, and instant fuzzy command-k search modal.", diff: "Medium" },
    { cat: "frontend-ui", title: "Audio/Video Stream Processing Studio UI", body: "Create a dark-mode video editing control suite with audio waveform visualizers, timeline scrubber tracks, keyframe sliders, and layer management panels.", diff: "Hard" },
    { cat: "frontend-ui", title: "Interactive Design System Component Gallery", body: "Build an interactive component UI library showcasing dynamic button variants, form inputs with inline validation, modals, popovers, and theme token customizers.", diff: "Medium" },
    { cat: "frontend-ui", title: "Log Intelligence & Telemetry Console", body: "Implement an enterprise log viewer with virtualized infinite scrolling, regex filter controls, log level color coding, and timestamp range selectors.", diff: "Hard" },
    { cat: "frontend-ui", title: "Customer Support Command Center", body: "Build a multi-channel support inbox with ticket queue filters, live status indicators, split-pane conversation view, and macro response quick-insert palette.", diff: "Medium" },

    // ── 2. Game Dev ──
    { cat: "game-dev", title: "Retro Arcade Space Shooter", body: "Build a single-file HTML5 canvas space shooter game with player movement, particle explosion effects, score keeping, power-up drops, and collision detection.", diff: "Medium" },
    { cat: "game-dev", title: "2D Physics Platformer with Gravity Flip", body: "Create a 2D canvas platformer featuring smooth player acceleration, wall jumping, gravity invert mechanics, moving platforms, and spike hazards.", diff: "Hard" },
    { cat: "game-dev", title: "Tower Defense Strategy Game", body: "Implement a grid-based tower defense game with enemy pathfinding, multiple tower upgrade paths, splash damage projectiles, and wave difficulty scaling.", diff: "Hard" },
    { cat: "game-dev", title: "Isometric City Builder & Resource Manager", body: "Build an isometric canvas city builder with tile placement (roads, residential, commercial), budget/population resource meters, and day/night cycle lighting.", diff: "Hard" },
    { cat: "game-dev", title: "Turn-Based RPG Battle Engine", body: "Create a turn-based RPG battle system with character party management, elemental magic attacks, turn order timeline visualizer, and animated damage numbers.", diff: "Medium" },
    { cat: "game-dev", title: "Procedural Dungeon Crawler Rogue-like", body: "Implement a top-down rogue-like featuring procedurally generated tilemap dungeons, line-of-sight fog-of-war, inventory management, and enemy AI pathing.", diff: "Hard" },
    { cat: "game-dev", title: "Vector Synthwave Cyberpunk Racing Game", body: "Build a pseudo-3D retro arcade highway racer with curving horizon projection, speed boost pads, traffic obstacle evasion, and neon grid shaders.", diff: "Hard" },
    { cat: "game-dev", title: "Physics-Driven Marble Puzzle Maze", body: "Create an HTML5 physics puzzle game with tilting maze controls, gravity acceleration, portal teleportation pads, and star score tracking.", diff: "Medium" },
    { cat: "game-dev", title: "Rhythm Action Bullet-Hell Shooter", body: "Implement a fast-paced bullet-hell shooter featuring procedural boss bullet patterns, grazing score mechanics, slow-motion focus mode, and combo multiplier meters.", diff: "Hard" },
    { cat: "game-dev", title: "Multi-ball Pinball Physics Arcade", body: "Build an HTML5 canvas pinball game with physics flippers, spring plunger launcher, bumper score multipliers, tilt sensor penalties, and high-score persistency.", diff: "Hard" },

    // ── 3. SVG Art ──
    { cat: "svg-art", title: "Generative Cyberpunk Skyline", body: "Generate an inline SVG illustration of a futuristic cyberpunk skyline with glowing neon gradients, parallax buildings, atmospheric fog, and vector rain drops.", diff: "Medium" },
    { cat: "svg-art", title: "Isometric Futuristic Laboratory", body: "Create a detailed isometric SVG vector artwork depicting an advanced quantum computing laboratory with glowing laser arrays, holographic displays, and server racks.", diff: "Hard" },
    { cat: "svg-art", title: "Mathematical Sacred Geometry Patterns", body: "Generate a complex generative SVG mandala featuring golden ratio spirals, intricate overlapping geometric tessellations, and dynamic radial color gradients.", diff: "Hard" },
    { cat: "svg-art", title: "Retro Vaporware Synthwave Sunset", body: "Create a retro 80s vaporwave landscape SVG with a wireframe perspective grid sun, glowing palm tree silhouettes, chrome typography, and neon gradient hues.", diff: "Medium" },
    { cat: "svg-art", title: "Biomorphic Mechanical Insect Blueprint", body: "Generate an architectural vector schematic SVG of a robotic mechanical dragonfly with labeled technical dimensions, cross-sections, and blueprint grid overlays.", diff: "Hard" },
    { cat: "svg-art", title: "Detailed Celestial Constellation Map", body: "Create a vector astronomical star chart SVG depicting celestial constellations, orbital trajectory rings, moon phase icons, and gold foil gradient accents.", diff: "Medium" },
    { cat: "svg-art", title: "Minimalist Organic Alpine Mountain Range", body: "Generate a modern flat-vector mountain landscape SVG with layered depth gradients, minimalist pine forest silhouettes, mist layers, and sun halo rays.", diff: "Easy" },
    { cat: "svg-art", title: "Steampunk Mechanical Clockwork Engine", body: "Create an intricate SVG vector art piece displaying interlocking gear trains, brass pistons, pressure gauges, and vintage Victorian filigree borders.", diff: "Hard" },
    { cat: "svg-art", title: "Low-Poly Geometric Fox Mascot", body: "Generate a low-poly vector illustration SVG of a majestic fox head constructed from shaded polygonal facets and vibrant warm lighting gradients.", diff: "Medium" },
    { cat: "svg-art", title: "Art Nouveau Botanical Floral Frame", body: "Create an ornate vector SVG border frame inspired by Alphonse Mucha, featuring flowing organic vines, lily flowers, and decorative gold scrollwork.", diff: "Hard" },

    // ── 4. Agentic Tasks ──
    { cat: "agentic-tasks", title: "Repository Schema Migration Script", body: "Write a multi-step execution plan and TypeScript migration script to split monolithic user tables into tenant-scoped normalized models with rollback capabilities.", diff: "Hard" },
    { cat: "agentic-tasks", title: "Autonomous Dependency Vulnerability Audit", body: "Create a multi-step CLI agent script that parses package.json files, queries vulnerability databases, evaluates breaking API changes, and auto-generates pull request patches.", diff: "Hard" },
    { cat: "agentic-tasks", title: "Multi-Agent Task Orchestrator & Task Queue", body: "Implement an asynchronous multi-agent task runner with dependency DAG resolution, retries, exponential backoff, worker pool concurrency limits, and execution logging.", diff: "Hard" },
    { cat: "agentic-tasks", title: "Automated API Documentation Generator", body: "Write a static analysis agent script that parses AST syntax trees of TypeScript code to extract API route signatures, type definitions, and generates OpenAPI 3.0 YAML specs.", diff: "Medium" },
    { cat: "agentic-tasks", title: "Git Repository Refactoring Pipeline", body: "Create an automated code refactoring script that scans a codebase for deprecated API usages, rewrites imports using AST transformations, and formats git diff reports.", diff: "Hard" },
    { cat: "agentic-tasks", title: "LLM Function Calling Tool Executor Engine", body: "Implement a type-safe tool execution engine that validates JSON schema tool arguments, enforces execution timeout limits, sanitizes outputs, and handles multi-turn tool loops.", diff: "Hard" },
    { cat: "agentic-tasks", title: "Distributed Web Crawler & Structure Extractor", body: "Write an asynchronous agent crawler with rate-limiting queues, robots.txt compliance, URL deduplication, and automated JSON metadata extraction pipelines.", diff: "Medium" },
    { cat: "agentic-tasks", title: "Automated Incident Triage & Log Analyzer", body: "Create an agentic log analyzer script that parses multi-server error tracebacks, clusters root causes using regex clustering, and auto-generates Slack markdown incident summaries.", diff: "Medium" },
    { cat: "agentic-tasks", title: "Database Query Optimizer & Index Recommender", body: "Implement an agent script that analyzes SQL EXPLAIN query execution plans, identifies missing indexes, detects N+1 query antipatterns, and outputs optimized SQL rewrites.", diff: "Hard" },
    { cat: "agentic-tasks", title: "CI/CD Pipeline Security Policy Checker", body: "Write a static analysis tool that scans GitHub Actions workflow files for untrusted script injection vulnerabilities, hardcoded secrets, and generates security remediation scripts.", diff: "Medium" },

    // ── 5. Creative Writing ──
    { cat: "creative-writing", title: "System Architecture Specification", body: "Draft a comprehensive technical architecture overview and API spec for a distributed real-time AI evaluation engine, including SLAs, failure modes, and data flow diagrams.", diff: "Easy" },
    { cat: "creative-writing", title: "Futuristic AI Consciousness Science Fiction", body: "Write a compelling hard-sf short story exploring the emergence of self-awareness in a deep space probe AI navigating an anomaly near Saturn's rings.", diff: "Medium" },
    { cat: "creative-writing", title: "Developer API Changelog & Release Notes", body: "Draft clear, developer-centric release notes for a major v3.0 framework update featuring breaking change migration guides, deprecation warnings, and performance benchmarks.", diff: "Easy" },
    { cat: "creative-writing", title: "Post-Mortem Incident Report", body: "Write a detailed blameless post-mortem report for a multi-region cloud database outage, documenting timeline of events, root cause analysis, and preventative action items.", diff: "Medium" },
    { cat: "creative-writing", title: "Cyberpunk Detective Worldbuilding Dossier", body: "Draft a rich lore dossier for a futuristic noir metropolis, detailing corporate factions, black-market cybernetics, ambient slang glossary, and district descriptions.", diff: "Medium" },
    { cat: "creative-writing", title: "Executive Technical Whitepaper on Quantum Encryption", body: "Write a high-level whitepaper explaining post-quantum cryptography transition strategies for enterprise CTOs, comparing lattice-based algorithms and migration roadmaps.", diff: "Hard" },
    { cat: "creative-writing", title: "Interactive Story Branching Script", body: "Draft a non-linear branching narrative script for an interactive text RPG, complete with dialogue choice trees, inventory checks, character alignment flags, and multiple endings.", diff: "Medium" },
    { cat: "creative-writing", title: "Developer Advocacy Tutorial Article", body: "Write an engaging step-by-step tutorial article explaining how to implement WebSockets real-time state synchronization in modern web applications.", diff: "Easy" },
    { cat: "creative-writing", title: "Technical RFP (Request for Proposal) Response", body: "Draft a professional technical RFP response for an enterprise cloud migration project, outlining compliance, security architecture, milestones, and SLA guarantees.", diff: "Hard" },
    { cat: "creative-writing", title: "Philosophical Essay on AI Ethics & Autonomy", body: "Write a nuanced philosophical essay analyzing moral agency, alignment frameworks, and societal impacts of autonomous AI decision systems.", diff: "Medium" },

    // ── 6. 3D Graphics ──
    { cat: "3d-graphics", title: "Interactive WebGL Particle System", body: "Create a 3D HTML5 Three.js scene featuring an interactive particle globe that responds to mouse hover, scroll events, and audio frequency input.", diff: "Hard" },
    { cat: "3d-graphics", title: "Photorealistic Metallic Shader Material", body: "Build a Three.js WebGL scene showcasing a metallic PBR sphere with custom GLSL shaders, environment map reflections, Fresnel glowing edges, and bump mapping.", diff: "Hard" },
    { cat: "3d-graphics", title: "Procedural Low-Poly Terrain Generator", body: "Create a 3D procedural terrain generator using Three.js and simplex noise, featuring elevation height coloring, water plane reflections, and camera orbit controls.", diff: "Hard" },
    { cat: "3d-graphics", title: "Interactive Solar System Simulator", body: "Build an interactive 3D WebGL solar system with proportional planetary orbits, textured sphere meshes, Saturn ring geometry, and camera focal target selection.", diff: "Medium" },
    { cat: "3d-graphics", title: "Volumetric Cloud & Skybox Shader Scene", body: "Create a Three.js scene featuring custom GLSL volumetric ray-marched clouds with dynamic sun directional light scattering and dynamic time-of-day controls.", diff: "Hard" },
    { cat: "3d-graphics", title: "Animated Character Rig Mesh Viewer", body: "Build a 3D WebGL model viewer featuring skeletal animation playback controls (walk, run, idle), bone gizmo overlays, and shadow depth mapping.", diff: "Hard" },
    { cat: "3d-graphics", title: "Interactive 3D Data Scatterplot", body: "Create a 3D spatial data visualization scene in Three.js with floating data points, axes grid lines, dynamic tooltips on hover, and camera smooth transitions.", diff: "Medium" },
    { cat: "3d-graphics", title: "Real-time Glass Refractive Distortion Scene", body: "Build a Three.js WebGL scene demonstrating chromatic aberration glass refraction shaders over moving geometric primitives with dynamic light sources.", diff: "Hard" },
    { cat: "3d-graphics", title: "Procedural City Grid Generator", body: "Create a 3D WebGL city generator rendering procedural skyscraper meshes with window glow textures, street grid layouts, and moving vector traffic lights.", diff: "Hard" },
    { cat: "3d-graphics", title: "Interactive Audio Visualizer Spectrum Wave", body: "Build a 3D WebGL sound visualizer where a mesh terrain deforms dynamically based on real-time Web Audio API frequency analysis spectrum data.", diff: "Medium" },

    // ── 7. Data Viz ──
    { cat: "data-viz", title: "Interactive Model Latency Heatmap", body: "Build a responsive D3 SVG heatmap grid visualizing global model latency across regional data centers with interactive hover tooltips and filtering controls.", diff: "Medium" },
    { cat: "data-viz", title: "Real-time Stock Market Candlestick Chart", body: "Create a high-performance financial chart with candlestick bars, volume histogram overlays, technical indicators (SMA, EMA, RSI), and pan/zoom brush selection.", diff: "Hard" },
    { cat: "data-viz", title: "Global Network Topology Graph", body: "Build an interactive D3 force-directed network graph visualizing interconnected server nodes, latency edge weights, node dragging physics, and cluster highlighting.", diff: "Hard" },
    { cat: "data-viz", title: "Hierarchical Treasury Budget Treemap", body: "Create a nested D3 treemap visualization displaying multi-level organizational budget allocations with dynamic breadcrumb navigation and drill-down interactions.", diff: "Medium" },
    { cat: "data-viz", title: "Interactive Parallel Coordinates Benchmark Plot", body: "Build a multi-dimensional parallel coordinates plot comparing AI models across intelligence, throughput, latency, context length, and price dimensions.", diff: "Hard" },
    { cat: "data-viz", title: "Real-time System CPU & Memory Gauges", body: "Create a dashboard panel of animated circular radial progress gauges and live line series charts tracking CPU core utilization, memory pressure, and network I/O.", diff: "Medium" },
    { cat: "data-viz", title: "Multi-Series Cohort Retention Analysis Chart", body: "Build a cohort retention heatmap matrix visualizing user engagement decay over 12 weeks with color gradient intensity scales and average trendlines.", diff: "Medium" },
    { cat: "data-viz", title: "Interactive Sankey Flow Diagram", body: "Create a D3 Sankey flow chart illustrating energy generation sources, grid transmission distribution, and end-user consumption splits with path highlighting.", diff: "Hard" },
    { cat: "data-viz", title: "Geographic Sales Revenue Choropleth Map", body: "Build an SVG choropleth world map visualizing country-by-country revenue metrics with tooltip data popups, region zoom controls, and legend thresholds.", diff: "Medium" },
    { cat: "data-viz", title: "Interactive Radar/Spider Chart Evaluator", body: "Create a dynamic multi-axis radar chart overlaying model capability scores across coding, math, vision, reasoning, and instruction following.", diff: "Medium" },

    // ── 8. Animation ──
    { cat: "animation", title: "Framer Motion Spring UI Timeline", body: "Implement an animated timeline component featuring staggered entry spring transitions, interactive pill filters, and dynamic layout morphing.", diff: "Medium" },
    { cat: "animation", title: "Interactive SVG Morphing Loader Icon", body: "Build an animated SVG loader component that morphs smoothly between geometric shapes (circle, triangle, square, star) using CSS keyframes and spring physics.", diff: "Medium" },
    { cat: "animation", title: "Kinetic Typography Hero Banner", body: "Create a hero section with kinetic text reveal animations, character-by-character staggered opacity transitions, floating ambient background spheres, and scroll parallax.", diff: "Medium" },
    { cat: "animation", title: "Interactive Card Stack Swipe Carousel", body: "Build an interactive CSS/JS card stack carousel with gesture drag mechanics, card rotation physics, velocity snap points, and stack depth elevation shadows.", diff: "Hard" },
    { cat: "animation", title: "Animated Micro-Interaction Like Button", body: "Create a burst animation for an interactive bookmark/like heart icon featuring exploding particle confetti, scale bounce, and glowing gradient rings.", diff: "Easy" },
    { cat: "animation", title: "Smooth Scroll Parallax Landing Showcase", body: "Build a multi-section landing page with smooth scroll parallax reveals, scrubbed sticky element pinning, and horizontal image marquee track animations.", diff: "Hard" },
    { cat: "animation", title: "Interactive Credit Card Flip & Shimmer UI", body: "Create a 3D perspective credit card component that flips smoothly on hover/click, featuring holographic foil shimmer shaders and dynamic reflection highlights.", diff: "Medium" },
    { cat: "animation", title: "Staggered Grid Item Reveal Gallery", body: "Build an image gallery grid where items animate into position with staggered spring physics, blur reveals, and layout morphing expand-on-click modals.", diff: "Medium" },
    { cat: "animation", title: "Interactive Elastic Drawer Menu", body: "Create a side navigation drawer with elastic spring physics, liquid pull-to-open curves, backdrop backdrop-filter blur transitions, and staggered menu item slide-ins.", diff: "Hard" },
    { cat: "animation", title: "Animated Confetti Celebration Explosion", body: "Build a canvas-based celebratory particle explosion system with realistic gravity acceleration, wind sway, rotation physics, and auto-cleanup loops.", diff: "Easy" },

    // ── 9. Full-Stack ──
    { cat: "full-stack", title: "Next.js 16 API Route & Prisma ORM Handler", body: "Write a type-safe Next.js API route handler with Prisma transactions, robust error handling, zod request validation, and rate limiting headers.", diff: "Hard" },
    { cat: "full-stack", title: "JWT Authentication & RBAC Middleware", body: "Implement a full-stack JWT authentication system featuring access/refresh token rotation, HTTP-only cookies, password hashing with bcrypt, and role-based access control middleware.", diff: "Hard" },
    { cat: "full-stack", title: "Stripe Subscription Webhook Listener", body: "Build an enterprise Stripe webhook integration handler supporting signature verification, customer subscription state synchronization, and database transaction updates.", diff: "Hard" },
    { cat: "full-stack", title: "Real-time WebSockets Chat Backend Server", body: "Create a Node.js WebSocket server supporting multi-room chat channels, client heartbeat ping/pong, message persistence, and presence tracking.", diff: "Hard" },
    { cat: "full-stack", title: "File Upload Manager with S3 Presigned URLs", body: "Build a secure file upload pipeline with client-side image compression, S3 presigned URL generation, file type validation, and database asset metadata creation.", diff: "Medium" },
    { cat: "full-stack", title: "REST API Rate Limiter & Token Bucket", body: "Implement a Redis-backed token bucket rate limiting middleware with sliding window algorithms, custom quota tier overrides, and standard HTTP rate limit headers.", diff: "Hard" },
    { cat: "full-stack", title: "GraphQL Schema & Resolver Suite", body: "Write a complete GraphQL server schema with type definitions, queries, mutations, dataloader batching to solve N+1 problems, and field-level authorization policies.", diff: "Hard" },
    { cat: "full-stack", title: "Multi-Tenant Database Row Level Security (RLS)", body: "Implement a multi-tenant database isolation architecture using PostgreSQL Row Level Security policies, tenant context middleware, and automated migration scripts.", diff: "Hard" },
    { cat: "full-stack", title: "Background Job Queue & Task Worker", body: "Build an asynchronous background task processing system with BullMQ/Redis queues, failure retry strategies, task progress reporting, and dead-letter queues.", diff: "Hard" },
    { cat: "full-stack", title: "Server-Sent Events (SSE) Streaming API", body: "Create a Next.js Server-Sent Events route handler that streams real-time AI token generation chunks to the client with reconnection event id tracking.", diff: "Medium" },

    // ── 10. Code Golf ──
    { cat: "code-golf", title: "Minified Matrix Inversion Solver", body: "Provide a byte-optimized JavaScript function that computes the determinant and inverse of an n x n matrix without external libraries.", diff: "Hard" },
    { cat: "code-golf", title: "Shortest Maze Solver Algorithm", body: "Write a minified JavaScript function under 150 bytes that finds the shortest path through a 2D grid maze using BFS or DFS traversal.", diff: "Hard" },
    { cat: "code-golf", title: "Byte-Optimized JSON Parser & Serializer", body: "Create a byte-minified standalone JSON stringifier/parser implementation in under 200 bytes handling nested objects, arrays, strings, and booleans.", diff: "Hard" },
    { cat: "code-golf", title: "Compact Sudoku Solver", body: "Write a minified Sudoku solver in JavaScript under 120 bytes that solves any valid 9x9 Sudoku puzzle using backtracking recursion.", diff: "Hard" },
    { cat: "code-golf", title: "Golfed Markdown to HTML Parser", body: "Create a byte-minified Markdown parser in under 180 bytes supporting bold, italics, headers (#), links, and code blocks using regex replacements.", diff: "Medium" },
    { cat: "code-golf", title: "Minified Conway's Game of Life Core", body: "Write a byte-minified Game of Life tick function in under 100 bytes that updates a 2D cellular automaton state array.", diff: "Medium" },
    { cat: "code-golf", title: "Compact Expression Evaluator Shunting-Yard", body: "Provide a minified math expression evaluator in JavaScript under 150 bytes handling precedence, parentheses, +, -, *, /, and ^ operators.", diff: "Hard" },
    { cat: "code-golf", title: "Golfed Regex Engine String Matcher", body: "Write a byte-minified regular expression matching function supporting `.`, `*`, and `+` wildcards in under 140 bytes.", diff: "Hard" },
    { cat: "code-golf", title: "Compact SHA-256 Hashing Algorithm", body: "Create a byte-optimized JavaScript function implementing SHA-256 string hashing in minimal bytecode length.", diff: "Hard" },
    { cat: "code-golf", title: "Minified Run-Length Image Compression", body: "Write a byte-minified RLE (Run-Length Encoding) compressor and decompressor for 2D array matrix datasets in under 90 bytes.", diff: "Medium" },
  ];

  for (const p of promptDefs) {
    if (createdCategories[p.cat]) {
      await prisma.prompt.create({
        data: {
          categoryId: createdCategories[p.cat].id,
          title: p.title,
          body: p.body,
          difficulty: p.diff,
          isPublic: true,
          heldOut: false,
        },
      });
    }
  }

  console.log(`Successfully seeded ${modelsData.length} models from the Artificial Analysis leaderboard and 10 category prompt sets!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
