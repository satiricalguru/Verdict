import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding mid-2026 Master Top 100 AI Model Dataset into Verdict database...");

  // Clean existing data
  await prisma.judgment.deleteMany({});
  await prisma.sample.deleteMany({});
  await prisma.run.deleteMany({});
  await prisma.arenaMatch.deleteMany({});
  await prisma.prompt.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.model.deleteMany({});
  await prisma.provider.deleteMany({});

  // Seed Providers
  const providerDefs = [
    { name: "Anthropic", logoUrl: "/logos/anthropic.svg" },
    { name: "OpenAI", logoUrl: "/logos/openai.svg" },
    { name: "Google", logoUrl: "/logos/google.svg" },
    { name: "Meta", logoUrl: "/logos/meta.svg" },
    { name: "Moonshot AI", logoUrl: "/logos/moonshot.svg" },
    { name: "DeepSeek", logoUrl: "/logos/deepseek.svg" },
    { name: "Z.AI", logoUrl: "/logos/zai.svg" },
    { name: "Alibaba", logoUrl: "/logos/alibaba.svg" },
    { name: "xAI", logoUrl: "/logos/xai.svg" },
    { name: "Mistral AI", logoUrl: "/logos/mistral.svg" },
    { name: "Baidu", logoUrl: "/logos/baidu.svg" },
    { name: "Xiaomi", logoUrl: "/logos/xiaomi.svg" },
    { name: "ByteDance", logoUrl: "/logos/bytedance.svg" },
    { name: "MiniMax", logoUrl: "/logos/minimax.svg" },
    { name: "Microsoft AI", logoUrl: "/logos/microsoft.svg" },
    { name: "NVIDIA", logoUrl: "/logos/nvidia.svg" },
    { name: "Reve", logoUrl: "/logos/reve.svg" },
    { name: "HiDream", logoUrl: "/logos/hidream.svg" },
    { name: "Recraft", logoUrl: "/logos/recraft.svg" },
    { name: "Black Forest", logoUrl: "/logos/blackforest.svg" },
    { name: "Tencent", logoUrl: "/logos/tencent.svg" },
    { name: "KlingAI", logoUrl: "/logos/kling.svg" },
    { name: "Skywork AI", logoUrl: "/logos/skywork.svg" },
    { name: "Vidu", logoUrl: "/logos/vidu.svg" },
    { name: "Speechify AI", logoUrl: "/logos/speechify.svg" },
    { name: "Cartesia", logoUrl: "/logos/cartesia.svg" },
    { name: "Inworld AI", logoUrl: "/logos/inworld.svg" },
    { name: "ElevenLabs", logoUrl: "/logos/elevenlabs.svg" },
    { name: "Smallest.ai", logoUrl: "/logos/smallest.svg" },
    { name: "Fish Audio", logoUrl: "/logos/fishaudio.svg" },
    { name: "IBM", logoUrl: "/logos/ibm.svg" },
    { name: "Morph", logoUrl: "/logos/morph.svg" },
  ];

  const providerMap: Record<string, { id: string }> = {};
  for (const p of providerDefs) {
    const created = await prisma.provider.create({ data: p });
    providerMap[p.name] = created;
  }

  // Mid-2026 Master Top 100 AI Model Dataset
  const top100Models = [
    { name: "Claude Fable 5", provider: "Anthropic", slug: "claude-fable-5", priceIn: 10.0, priceOut: 50.0, open: false, composite: 98.4 },
    { name: "Claude Opus 4.6 (Thinking)", provider: "Anthropic", slug: "claude-opus-4-6-thinking", priceIn: 5.0, priceOut: 25.0, open: false, composite: 97.8 },
    { name: "Claude Opus 4.7 (Thinking)", provider: "Anthropic", slug: "claude-opus-4-7-thinking", priceIn: 5.0, priceOut: 25.0, open: false, composite: 97.5 },
    { name: "Claude Opus 4.6", provider: "Anthropic", slug: "claude-opus-4-6", priceIn: 5.0, priceOut: 25.0, open: false, composite: 96.9 },
    { name: "Claude Mythos 5", provider: "Anthropic", slug: "claude-mythos-5", priceIn: 15.0, priceOut: 60.0, open: false, composite: 96.5 },
    { name: "Claude Opus 4.7", provider: "Anthropic", slug: "claude-opus-4-7", priceIn: 5.0, priceOut: 25.0, open: false, composite: 96.1 },
    { name: "Muse Spark 1.1", provider: "Meta", slug: "muse-spark-1-1", priceIn: 1.25, priceOut: 4.25, open: false, composite: 95.8 },
    { name: "GPT-5.6 Sol (xHigh)", provider: "OpenAI", slug: "gpt-5-6-sol", priceIn: 5.0, priceOut: 30.0, open: false, composite: 95.4 },
    { name: "Gemini 3 Pro", provider: "Google", slug: "gemini-3-pro", priceIn: 2.0, priceOut: 12.0, open: false, composite: 95.0 },
    { name: "Gemini 3.1 Pro Preview", provider: "Google", slug: "gemini-3-1-pro-preview", priceIn: 2.0, priceOut: 12.0, open: false, composite: 94.8 },
    { name: "Kimi K3", provider: "Moonshot AI", slug: "kimi-k3", priceIn: 3.0, priceOut: 15.0, open: true, composite: 94.5 },
    { name: "Claude Opus 4.8 (Thinking)", provider: "Anthropic", slug: "claude-opus-4-8-thinking", priceIn: 5.0, priceOut: 25.0, open: false, composite: 94.2 },
    { name: "GPT-5.5 High", provider: "OpenAI", slug: "gpt-5-5-high", priceIn: 5.0, priceOut: 30.0, open: false, composite: 93.9 },
    { name: "GPT-5.4 High", provider: "OpenAI", slug: "gpt-5-4-high", priceIn: 2.5, priceOut: 15.0, open: false, composite: 93.6 },
    { name: "Gemini 3.6 Flash", provider: "Google", slug: "gemini-3-6-flash", priceIn: 0.5, priceOut: 3.0, open: false, composite: 93.4 },
    { name: "Gemini 3.5 Flash High", provider: "Google", slug: "gemini-3-5-flash-high", priceIn: 0.5, priceOut: 3.0, open: false, composite: 93.1 },
    { name: "GPT-5.2 Chat Latest", provider: "OpenAI", slug: "gpt-5-2-chat-latest", priceIn: 2.5, priceOut: 10.0, open: false, composite: 92.8 },
    { name: "Qwen 3.7 Max Preview", provider: "Alibaba", slug: "qwen-3-7-max-preview", priceIn: 1.25, priceOut: 3.75, open: false, composite: 92.5 },
    { name: "Claude Opus 4.8", provider: "Anthropic", slug: "claude-opus-4-8", priceIn: 5.0, priceOut: 25.0, open: false, composite: 92.2 },
    { name: "Grok 4.20 Beta1", provider: "xAI", slug: "grok-4-20-beta1", priceIn: 1.5, priceOut: 6.0, open: false, composite: 92.0 },
    { name: "GPT-5.5", provider: "OpenAI", slug: "gpt-5-5", priceIn: 5.0, priceOut: 30.0, open: false, composite: 91.8 },
    { name: "Grok 4.20 Reasoning", provider: "xAI", slug: "grok-4-20-reasoning", priceIn: 1.5, priceOut: 6.0, open: false, composite: 91.5 },
    { name: "Gemini 3 Flash", provider: "Google", slug: "gemini-3-flash", priceIn: 0.5, priceOut: 3.0, open: false, composite: 91.2 },
    { name: "GLM-5.1", provider: "Z.AI", slug: "glm-5-1", priceIn: 1.4, priceOut: 4.4, open: true, composite: 91.0 },
    { name: "Claude Sonnet 4.6", provider: "Anthropic", slug: "claude-sonnet-4-6", priceIn: 3.0, priceOut: 15.0, open: false, composite: 90.8 },
    { name: "Grok 4.5", provider: "xAI", slug: "grok-4-5", priceIn: 1.5, priceOut: 6.0, open: false, composite: 90.5 },
    { name: "GLM-5.2 (Max)", provider: "Z.AI", slug: "glm-5-2-max", priceIn: 1.4, priceOut: 4.4, open: true, composite: 90.2 },
    { name: "Ernie 5.1", provider: "Baidu", slug: "ernie-5-1", priceIn: 2.0, priceOut: 8.0, open: false, composite: 90.0 },
    { name: "MiMo V2.5 Pro", provider: "Xiaomi", slug: "mimo-v2-5-pro", priceIn: 0.8, priceOut: 2.4, open: true, composite: 89.8 },
    { name: "Grok 4.1 Thinking", provider: "xAI", slug: "grok-4-1-thinking", priceIn: 1.5, priceOut: 6.0, open: false, composite: 89.5 },
    { name: "GPT-5.4", provider: "OpenAI", slug: "gpt-5-4", priceIn: 2.5, priceOut: 15.0, open: false, composite: 89.3 },
    { name: "Qwen 3.5 Max Preview", provider: "Alibaba", slug: "qwen-3-5-max-preview", priceIn: 1.25, priceOut: 3.75, open: false, composite: 89.1 },
    { name: "Claude Sonnet 5", provider: "Anthropic", slug: "claude-sonnet-5", priceIn: 3.0, priceOut: 15.0, open: false, composite: 88.9 },
    { name: "Kimi K2.6", provider: "Moonshot AI", slug: "kimi-k2-6", priceIn: 1.0, priceOut: 4.0, open: true, composite: 88.7 },
    { name: "Qwen 3.6 Max Preview", provider: "Alibaba", slug: "qwen-3-6-max-preview", priceIn: 1.25, priceOut: 3.75, open: false, composite: 88.5 },
    { name: "Qwen 3.7 Plus", provider: "Alibaba", slug: "qwen-3-7-plus", priceIn: 0.8, priceOut: 2.4, open: false, composite: 88.3 },
    { name: "DeepSeek V4 Pro Thinking", provider: "DeepSeek", slug: "deepseek-v4-pro-thinking", priceIn: 0.43, priceOut: 0.87, open: true, composite: 88.1 },
    { name: "GLM-5", provider: "Z.AI", slug: "glm-5", priceIn: 1.4, priceOut: 4.4, open: true, composite: 87.9 },
    { name: "DeepSeek V4 Pro", provider: "DeepSeek", slug: "deepseek-v4-pro", priceIn: 0.43, priceOut: 0.87, open: true, composite: 87.7 },
    { name: "Claude Sonnet 4.5 Thinking", provider: "Anthropic", slug: "claude-sonnet-4-5-thinking", priceIn: 3.0, priceOut: 15.0, open: false, composite: 87.5 },
    { name: "Dola Seed 2.0 Pro", provider: "ByteDance", slug: "dola-seed-2-0-pro", priceIn: 1.2, priceOut: 3.6, open: false, composite: 87.3 },
    { name: "GPT-5.1 High", provider: "OpenAI", slug: "gpt-5-1-high", priceIn: 2.5, priceOut: 10.0, open: false, composite: 87.1 },
    { name: "Gemma 4 31B", provider: "Google", slug: "gemma-4-31b", priceIn: 0.2, priceOut: 0.6, open: true, composite: 86.9 },
    { name: "GPT-5.4 Mini High", provider: "OpenAI", slug: "gpt-5-4-mini-high", priceIn: 0.5, priceOut: 2.0, open: false, composite: 86.7 },
    { name: "Kimi K2.5 Thinking", provider: "Moonshot AI", slug: "kimi-k2-5-thinking", priceIn: 1.0, priceOut: 4.0, open: true, composite: 86.5 },
    { name: "Claude Opus 4.1 Thinking", provider: "Anthropic", slug: "claude-opus-4-1-thinking", priceIn: 5.0, priceOut: 25.0, open: false, composite: 86.3 },
    { name: "Ernie 5.0 Preview", provider: "Baidu", slug: "ernie-5-0-preview", priceIn: 2.0, priceOut: 8.0, open: false, composite: 86.1 },
    { name: "GPT-5.3 Chat Latest", provider: "OpenAI", slug: "gpt-5-3-chat-latest", priceIn: 2.5, priceOut: 10.0, open: false, composite: 85.9 },
    { name: "Claude Mythos Preview", provider: "Anthropic", slug: "claude-mythos-preview-2", priceIn: 15.0, priceOut: 60.0, open: false, composite: 85.7 },
    { name: "GPT-5.6 Sol", provider: "OpenAI", slug: "gpt-5-6-sol-auto", priceIn: 5.0, priceOut: 30.0, open: false, composite: 85.5 },
    { name: "GPT-5.6 Terra", provider: "OpenAI", slug: "gpt-5-6-terra", priceIn: 3.0, priceOut: 15.0, open: false, composite: 85.3 },
    { name: "GPT-5.6 Luna", provider: "OpenAI", slug: "gpt-5-6-luna", priceIn: 1.0, priceOut: 6.0, open: false, composite: 85.1 },
    { name: "GPT-5.5-Codex", provider: "OpenAI", slug: "gpt-5-5-codex", priceIn: 5.0, priceOut: 30.0, open: false, composite: 84.9 },
    { name: "GPT-5.3 Codex", provider: "OpenAI", slug: "gpt-5-3-codex", priceIn: 2.5, priceOut: 10.0, open: false, composite: 84.7 },
    { name: "Qwen3 Coder 480B", provider: "Alibaba", slug: "qwen3-coder-480b", priceIn: 0.6, priceOut: 1.8, open: true, composite: 84.5 },
    { name: "Qwen3-Coder-30B", provider: "Alibaba", slug: "qwen3-coder-30b", priceIn: 0.15, priceOut: 0.45, open: true, composite: 84.3 },
    { name: "morph-dsv4flash", provider: "Morph", slug: "morph-dsv4flash", priceIn: 0.2, priceOut: 0.6, open: true, composite: 84.1 },
    { name: "MiniMax M3", provider: "MiniMax", slug: "minimax-m3", priceIn: 0.3, priceOut: 1.2, open: true, composite: 83.9 },
    { name: "MiniMax M2.7", provider: "MiniMax", slug: "minimax-m2-7", priceIn: 0.3, priceOut: 1.2, open: false, composite: 83.7 },
    { name: "Devstral 2512", provider: "Mistral AI", slug: "devstral-2512", priceIn: 0.4, priceOut: 1.2, open: true, composite: 83.5 },
    { name: "MAI-Code-1-Flash", provider: "Microsoft AI", slug: "mai-code-1-flash", priceIn: 0.5, priceOut: 1.5, open: false, composite: 83.3 },
    { name: "Grok Build 0.1", provider: "xAI", slug: "grok-build-0-1", priceIn: 1.0, priceOut: 4.0, open: false, composite: 83.1 },
    { name: "GPT Image 2 (High)", provider: "OpenAI", slug: "gpt-image-2-high", priceIn: 10.0, priceOut: 30.0, open: false, composite: 82.9 },
    { name: "GPT Image 1.5 (High)", provider: "OpenAI", slug: "gpt-image-1-5-high", priceIn: 8.0, priceOut: 24.0, open: false, composite: 82.7 },
    { name: "Reve 2.1", provider: "Reve", slug: "reve-2-1", priceIn: 5.0, priceOut: 20.0, open: false, composite: 82.5 },
    { name: "MAI-Image-2.5", provider: "Microsoft AI", slug: "mai-image-2-5", priceIn: 4.0, priceOut: 16.0, open: false, composite: 82.3 },
    { name: "MAI-Image-2.5-Flash", provider: "Microsoft AI", slug: "mai-image-2-5-flash", priceIn: 2.0, priceOut: 8.0, open: false, composite: 82.1 },
    { name: "HiDream-O1-Image-1.5", provider: "HiDream", slug: "hidream-o1-image-1-5", priceIn: 6.0, priceOut: 24.0, open: false, composite: 81.9 },
    { name: "Nano Banana 2", provider: "Google", slug: "nano-banana-2", priceIn: 2.0, priceOut: 8.0, open: false, composite: 81.7 },
    { name: "Nano Banana 2 Lite", provider: "Google", slug: "nano-banana-2-lite", priceIn: 1.0, priceOut: 4.0, open: false, composite: 81.5 },
    { name: "Nano Banana Pro", provider: "Google", slug: "nano-banana-pro", priceIn: 3.0, priceOut: 12.0, open: false, composite: 81.3 },
    { name: "Cosmos3-Super-Text2Image", provider: "NVIDIA", slug: "cosmos3-super-text2image", priceIn: 1.5, priceOut: 4.5, open: true, composite: 81.1 },
    { name: "Recraft V4.1 Utility Pro", provider: "Recraft", slug: "recraft-v4-1-utility-pro", priceIn: 4.0, priceOut: 16.0, open: false, composite: 80.9 },
    { name: "grok-imagine-image-quality", provider: "xAI", slug: "grok-imagine-image-quality", priceIn: 3.0, priceOut: 12.0, open: false, composite: 80.7 },
    { name: "HunyuanImage 3.0 Instruct", provider: "Tencent", slug: "hunyuanimage-3-0-instruct", priceIn: 1.0, priceOut: 3.0, open: true, composite: 80.5 },
    { name: "FLUX.2 [max]", provider: "Black Forest", slug: "flux-2-max", priceIn: 5.0, priceOut: 20.0, open: false, composite: 80.3 },
    { name: "FLUX.2 [pro]", provider: "Black Forest", slug: "flux-2-pro", priceIn: 3.0, priceOut: 12.0, open: false, composite: 80.1 },
    { name: "FLUX.2 [klein] 9B", provider: "Black Forest", slug: "flux-2-klein-9b", priceIn: 0.5, priceOut: 1.5, open: true, composite: 79.9 },
    { name: "Seedream 4.5", provider: "ByteDance", slug: "seedream-4-5", priceIn: 2.0, priceOut: 8.0, open: false, composite: 79.7 },
    { name: "Qwen Image 2.0 Pro", provider: "Alibaba", slug: "qwen-image-2-0-pro", priceIn: 2.0, priceOut: 6.0, open: false, composite: 79.5 },
    { name: "Gemini Omni Flash", provider: "Google", slug: "gemini-omni-flash", priceIn: 2.0, priceOut: 6.0, open: false, composite: 79.3 },
    { name: "Dreamina Seedance 2.0", provider: "ByteDance", slug: "dreamina-seedance-2-0", priceIn: 3.0, priceOut: 9.0, open: false, composite: 79.1 },
    { name: "Wan 2.7-260612", provider: "Alibaba", slug: "wan-2-7-260612", priceIn: 2.5, priceOut: 9.0, open: false, composite: 78.9 },
    { name: "HappyHorse-1.1", provider: "Alibaba", slug: "happyhorse-1-1", priceIn: 3.0, priceOut: 9.9, open: false, composite: 78.7 },
    { name: "HappyHorse-1.0", provider: "Alibaba", slug: "happyhorse-1-0", priceIn: 4.0, priceOut: 13.2, open: false, composite: 78.5 },
    { name: "Kling 3.0 1080p (Pro)", provider: "KlingAI", slug: "kling-3-0-1080p-pro", priceIn: 5.0, priceOut: 20.16, open: false, composite: 78.3 },
    { name: "SkyReels V4", provider: "Skywork AI", slug: "skyreels-v4", priceIn: 5.0, priceOut: 21.0, open: false, composite: 78.1 },
    { name: "Veo 3.1", provider: "Google", slug: "veo-3-1", priceIn: 6.0, priceOut: 24.0, open: false, composite: 77.9 },
    { name: "grok-imagine-video-1.5", provider: "xAI", slug: "grok-imagine-video-1-5", priceIn: 2.0, priceOut: 8.4, open: false, composite: 77.7 },
    { name: "Vidu Q3 Pro", provider: "Vidu", slug: "vidu-q3-pro", priceIn: 2.5, priceOut: 9.6, open: false, composite: 77.5 },
    { name: "Qwen-Audio-3.0-TTS-Plus", provider: "Alibaba", slug: "qwen-audio-3-0-tts-plus", priceIn: 5.0, priceOut: 27.6, open: false, composite: 77.3 },
    { name: "Simba 3.2", provider: "Speechify AI", slug: "simba-3-2", priceIn: 2.0, priceOut: 10.0, open: false, composite: 77.1 },
    { name: "Inworld TTS 1.5 Max", provider: "Inworld AI", slug: "inworld-tts-1-5-max", priceIn: 3.0, priceOut: 15.0, open: false, composite: 76.9 },
    { name: "Inworld Realtime TTS-2", provider: "Inworld AI", slug: "inworld-realtime-tts-2", priceIn: 4.0, priceOut: 20.8, open: false, composite: 76.7 },
    { name: "Gemini 3.1 Flash TTS", provider: "Google", slug: "gemini-3-1-flash-tts", priceIn: 3.5, priceOut: 18.3, open: false, composite: 76.5 },
    { name: "Cartesia Sonic 3.5", provider: "Cartesia", slug: "cartesia-sonic-3-5", priceIn: 10.0, priceOut: 49.0, open: false, composite: 76.3 },
    { name: "ElevenLabs Eleven v3", provider: "ElevenLabs", slug: "elevenlabs-eleven-v3", priceIn: 20.0, priceOut: 100.0, open: false, composite: 76.1 },
    { name: "Smallest.ai Lightning V3.1", provider: "Smallest.ai", slug: "smallest-ai-lightning-v3-1", priceIn: 2.0, priceOut: 10.0, open: false, composite: 75.9 },
    { name: "Fish Audio S2 Pro", provider: "Fish Audio", slug: "fish-audio-s2-pro", priceIn: 3.0, priceOut: 15.0, open: true, composite: 75.7 },
    { name: "Canary Qwen 2.5B", provider: "NVIDIA", slug: "canary-qwen-2-5b", priceIn: 0.1, priceOut: 0.3, open: true, composite: 75.5 },
  ];

  for (const mData of top100Models) {
    const prov = providerMap[mData.provider] || providerMap["Anthropic"];
    await prisma.model.create({
      data: {
        providerId: prov.id,
        name: mData.name,
        slug: mData.slug,
        modelIdString: mData.slug,
        releaseDate: new Date("2026-03-15"),
        priceInput: mData.priceIn,
        priceOutput: mData.priceOut,
        isOpenWeight: mData.open,
        capabilities: JSON.stringify({ vision: true, tools: true, maxTokens: 1000000 }),
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

  // Seed Initial Real Prompts
  await prisma.prompt.create({
    data: {
      categoryId: createdCategories["frontend-ui"].id,
      title: "Realtime Financial Analytics Dashboard",
      body: "Create a modern dark-mode stock portfolio analytics dashboard with dynamic SVG charts, tabular data, search filter pills, and accessible theme controls.",
      difficulty: "Hard",
      isPublic: true,
      heldOut: false,
    },
  });

  await prisma.prompt.create({
    data: {
      categoryId: createdCategories["game-dev"].id,
      title: "Retro Arcade Space Shooter",
      body: "Build a single-file HTML5 canvas space shooter game with player movement, particle explosion effects, score keeping, and collision detection.",
      difficulty: "Medium",
      isPublic: true,
      heldOut: false,
    },
  });

  console.log("Successfully seeded ALL 100 mid-2026 Master AI Models!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
