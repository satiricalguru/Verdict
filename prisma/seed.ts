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

  // Seed Prompts for ALL 10 Categories
  const promptDefs = [
    { cat: "frontend-ui", title: "Realtime Financial Analytics Dashboard", body: "Create a modern dark-mode stock portfolio analytics dashboard with dynamic SVG charts, tabular data, search filter pills, and accessible theme controls.", diff: "Hard" },
    { cat: "game-dev", title: "Retro Arcade Space Shooter", body: "Build a single-file HTML5 canvas space shooter game with player movement, particle explosion effects, score keeping, and collision detection.", diff: "Medium" },
    { cat: "svg-art", title: "Generative Cyberpunk Skyline", body: "Generate an inline SVG illustration of a futuristic cyberpunk skyline with glowing neon gradients, parallax buildings, and vector graphics.", diff: "Medium" },
    { cat: "agentic-tasks", title: "Repository Schema Migration Script", body: "Write a multi-step execution plan and TypeScript migration script to split monolithic user tables into tenant-scoped normalized models.", diff: "Hard" },
    { cat: "creative-writing", title: "System Architecture Specification", body: "Draft a comprehensive technical architecture overview and API spec for a distributed real-time AI evaluation engine.", diff: "Easy" },
    { cat: "3d-graphics", title: "Interactive WebGL Particle System", body: "Create a 3D HTML5 Three.js scene featuring an interactive particle globe that responds to mouse hover and scroll events.", diff: "Hard" },
    { cat: "data-viz", title: "Interactive Model Latency Heatmap", body: "Build a responsive D3 SVG heatmap grid visualizing global model latency across regional data centers with tooltips.", diff: "Medium" },
    { cat: "animation", title: "Framer Motion Spring UI Timeline", body: "Implement an animated timeline component featuring staggered entry spring transitions, interactive pill filters, and dynamic layout morphing.", diff: "Medium" },
    { cat: "full-stack", title: "Next.js 16 API Route & Prisma ORM Handler", body: "Write a type-safe Next.js API route handler with Prisma transactions, error handling, and rate limiting headers.", diff: "Hard" },
    { cat: "code-golf", title: "Minified Matrix Inversion Solver", body: "Provide a byte-optimized JavaScript function that computes the determinant and inverse of an n x n matrix without external libraries.", diff: "Hard" },
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
