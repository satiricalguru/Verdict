<div align="center">

  <br />

  <a href="https://github.com/satiricalguru/Verdict">
    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Zap.png" alt="Verdict Lightning Icon" width="100" height="100" />
  </a>

  <h1 align="center">⚡ VERDICT</h1>

  <p align="center">
    <b>The World's #1 Vibe Coding &amp; Frontier AI Model Evaluation Benchmark</b>
    <br />
    <i>Benchmarking 100+ SOTA AI Models in Live Sandboxed Web Applications &amp; Blind Crowdsourced Arena Matches</i>
  </p>

  <p align="center">
    <a href="#-quickstart"><b>Explore Quickstart »</b></a>
    &nbsp;•&nbsp;
    <a href="#-blind-head-to-head-arena"><b>Try Model Arena »</b></a>
    &nbsp;•&nbsp;
    <a href="#-docker-self-hosting"><b>Self-Host Docker »</b></a>
  </p>

  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License MIT" /></a>
  </p>

  <br />

  <img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="Animated Header Line Divider" />

</div>

<br />

> **Verdict** is an independent, 100% free, and self-hostable evaluation platform for AI models. It benchmarks **100+ SOTA AI models** (*Claude Fable 5*, *GPT-5.6 Sol*, *Gemini 3 Pro*, *DeepSeek V4 Pro*, *Qwen 3.7 Max*, *Grok 4.20*) on real-world interactive web application generation, agentic code refactoring, and multi-modal tasks — evaluated by an auditable multi-judge panel and blind crowd Elo rankings.

---

## ✨ Highlights & Key Features

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🏆 Master 100+ SOTA Dataset</h3>
      <p>Comprehensive evaluations for 100 frontier AI models updated in real time across latency, cost, and output throughput.</p>
    </td>
    <td width="50%">
      <h3 align="center">⚔️ Blind Head-to-Head Arena</h3>
      <p>Crowdsourced Elo rating comparisons with sandboxed CSP iframe renders, unmasking model identities only after casting votes.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">🔐 100% Free BYOK Architecture</h3>
      <p>Bring Your Own API Keys with client-side envelope encryption. Zero paywalls, subscriptions, or token markups.</p>
    </td>
    <td width="50%">
      <h3 align="center">🐳 1-Command Docker Deployment</h3>
      <p>Deploy private, offline-capable evaluation infrastructure anywhere using Docker Compose and PostgreSQL/SQLite.</p>
    </td>
  </tr>
</table>

---

## 🚀 Quickstart

### Prerequisites
- **Node.js**: `v20.0.0+`
- **npm** or **pnpm**

### Local Setup in 4 Steps

```bash
# 1. Clone repository
git clone https://github.com/satiricalguru/Verdict.git
cd Verdict

# 2. Install dependencies
npm install

# 3. Synchronize database schema & seed 100 SOTA models
npx prisma db push
npm run db:seed

# 4. Launch development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view **Verdict** live.

---

## ⚔️ Blind Head-to-Head Arena

The **Verdict Arena** provides blind, bias-free model evaluation:

- **Anonymous Pairings**: Models are masked as `Model Alpha` & `Model Beta` to prevent brand bias.
- **Interactive Web App Previews**: Render full HTML5, CSS, and JS components live inside isolated sandboxes.
- **Direct Model Selection Mode**: Toggle from blind pairing to direct head-to-head comparisons between any 2 models in the dataset.
- **Statistically Sound Elo Ratings**: Updated via Bradley-Terry pairwise regression with spam cooldown protection.

---

## 🐳 Docker Self-Hosting

Spin up a production-ready private evaluation environment:

```bash
docker compose up -d
```

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      VERDICT ENGINE                         │
├───────────────────┬───────────────────┬─────────────────────┤
│  Next.js 16 Web   │  SQLite / Prisma  │ Python 3.12 Engine  │
│  React 19 & CSP   │  100 SOTA Models  │ Sandbox Playwright  │
└───────────────────┴───────────────────┴─────────────────────┘
```

---

## 🎯 Evaluation Rubric (Auditable Multi-Judge Panel)

Every generated output is evaluated by 3 independent judge models across 5 weighted dimensions:

| Metric | Weight | Description |
| :--- | :---: | :--- |
| **Functionality** | `30%` | Zero runtime JavaScript exceptions, complete interactive handlers |
| **Craft & Architecture** | `25%` | Clean semantic markup, idiomatic TypeScript, structured CSS |
| **Design & Aesthetics** | `20%` | Modern visual hierarchy, color palette harmony, contrast ratio |
| **Creativity & Delight** | `15%` | Micro-interactions, original motion design, polished UX |
| **Prompt Fidelity** | `10%` | Strict adherence to complex multi-part requirements |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

<div align="center">
  <br />
  <p>Built with ⚡ for the global AI developer community.</p>
  <img src="https://raw.githubusercontent.com/andreasbm/readme-badges/master/badges/made-with-python.svg" alt="Made with Python" />
  &nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/andreasbm/readme-badges/master/badges/made-with-typescript.svg" alt="Made with TypeScript" />
</div>
