# ⚡ Verdict — The World's #1 Vibe Coding & Frontier AI Model Benchmark

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Verdict** is an independent, free, and self-hostable evaluation platform for AI models. Benchmarking 100+ frontier AI models on real-world "vibe coding" tasks, agentic repository refactoring, multimodal vision understanding, and real-time voice synthesis — evaluated by an auditable multi-model judge panel with blind crowd Elo voting.

---

## ✨ Features

- 🏆 **Master Top 100 Model Dataset**: Benchmark dataset featuring 100+ frontier AI models (*Claude Fable 5*, *GPT-5.6 Sol*, *Gemini 3 Pro*, *DeepSeek V4 Pro*, *Qwen 3.7 Max*, *Grok 4.20*, *Kimi K3*, *GLM-5.2 Max*, *Devstral 2512*).
- 🎨 **`woaibench.ai` Parity & Dark Aesthetic**: Sleek pitch-dark canvas (`#090b10`), golden-yellow accents, SOTA scoreboards, verdict dial gauges, and animated CLI terminal mockup window (`~/projects/acme · World of AI Bench v0.9.3`).
- 📊 **Artificial Analysis Metrics**: Includes Intelligence Index, Output Speed (`tokens/sec`), Latency (`TTFT ms`), Context Window size (`128k` to `10M` tokens), and Cost-per-task efficiency.
- ⚔️ **Blind Head-to-Head Arena**: Side-by-side model evaluation with live CSP-isolated HTML rendering sandboxes and raw code tabs for unbiased crowd voting.
- 🔍 **Interactive Filtering & Search**: Filter models dynamically by *All Models*, *Proprietary Flagships*, *Open Weight SOTA*, and *Extended Reasoning*.
- 🔐 **Dual-Mode BYOK Key Manager**: 100% free and open-source. Bring your own API keys (OpenAI, Anthropic, Gemini, OpenRouter) with envelope encryption at rest.
- 🐳 **Single-Command Docker Deployment**: Ready for private infrastructure deployment via Docker Compose.

---

## 🚀 Quickstart

### Prerequisites
- **Node.js**: `v20.0.0+`
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/satiricalguru/Verdict.git
cd Verdict

# Install dependencies
npm install

# Push database schema & seed 100 SOTA AI models
npx prisma db push
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view Verdict in your browser.

---

## 🐳 Docker Self-Hosting

Run a 100% private Verdict instance on your own infrastructure:

```bash
docker compose up -d
```

### Stack Architecture
- **Web UI**: Next.js 16 (App Router, Server Actions, TailwindCSS v4)
- **Database**: PostgreSQL 16 / SQLite (Prisma ORM)
- **Queue & Cache**: Redis 7
- **Execution Engine**: Python 3.12 sandbox container with Playwright & Docker-in-Docker isolation

---

## 🎯 Benchmark Categories

Verdict evaluates models across 10 core categories:

1. **Frontend UI**: Responsive landing pages, dark mode dashboards, accessible forms, glassmorphism CSS.
2. **Game Dev**: Canvas 2D physics loops, HTML5 platformers, retro space shooters, collision math.
3. **SVG Art**: Generative math illustrations, vector graphics, isometric cityscapes, iconography.
4. **Agentic Tasks**: Multi-step repository refactoring, execution planning, tool call chains, schema migrations.
5. **3D Graphics**: Three.js WebGL scenes, custom shader scripts, 3D meshes.
6. **Data Viz**: Recharts, D3 SVG charts, heatmaps, interactive data graphs.
7. **Animation**: CSS keyframe timelines, Framer Motion springs, micro-interactions.
8. **Creative Writing**: Technical documentation, release notes, lore generation.
9. **Full-Stack**: Next.js API routes, Prisma ORM queries, authentication middleware.
10. **Code Golf**: Byte-minified solutions, algorithm optimization, math solvers.

---

## 📊 Evaluation Rubric (Auditable Multi-Judge Panel)

Every generated output is evaluated by 3 independent judge models across 5 weighted dimensions:

- **Functionality (30%)**: Zero runtime JavaScript exceptions, complete interactive handlers.
- **Craft & Architecture (25%)**: Clean semantic markup, idiomatic TypeScript, structured CSS.
- **Design & Aesthetics (20%)**: Modern visual hierarchy, color palette harmony, high contrast.
- **Creativity & Delight (15%)**: Micro-interactions, original motion design, polished UX.
- **Prompt Fidelity (10%)**: Strict adherence to complex multi-part requirements.

Disagreements between judges (>1.5 score variance) trigger automatic human review.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI Library**: [React 19](https://react.dev/) & [Framer Motion](https://framer.com/motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with SQLite/Postgres
- **Charts & Dials**: Recharts & Custom Canvas SVG Dials

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p center>Built with ⚡ for the global AI developer community.</p>
