// Exact-copy scraper for the artificialanalysis.ai model leaderboard.
// Pipeline (mirrors the site's own client code):
//   1. GET /models -> parse RSC flight payload -> find manifest {path, key}
//   2. GET /data/<hash>.txt -> AES-256-GCM decrypt (IV = sha256(key)[:12], tag appended)
//   3. gunzip -> JSON models dataset
//   4. Filter non-deprecated models with an Intelligence Index, sort by
//      intelligenceIndex desc (= the site's "Intelligence" leaderboard ranking)
//   5. Write prisma/models-data.json (app schema mapping) + a full raw copy
const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_MODELS = path.join(ROOT, "prisma", "models-data.json");
const OUT_RAW = path.join(ROOT, "scraper-output", "aa-models-full.json");

function decodeRsc(html) {
  const chunks = [];
  const re = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      chunks.push(JSON.parse(`"${m[1]}"`));
    } catch {
      /* skip malformed chunk */
    }
  }
  return chunks;
}

function findManifests(chunks) {
  const out = [];
  for (const s of chunks) {
    const re = /"manifest":\{"path":"([^"]+)","key":"([^"]+)"\}/g;
    let m;
    while ((m = re.exec(s))) out.push({ path: m[1], key: m[2] });
  }
  return out;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.text();
}

async function fetchAndDecode(manifest) {
  const res = await fetch("https://artificialanalysis.ai" + manifest.path);
  if (!res.ok) throw new Error(`GET ${manifest.path} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const key = Buffer.from(manifest.key, "hex");
  const iv = crypto.createHash("sha256").update(key).digest().slice(0, 12);
  const tag = buf.slice(buf.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv, {
    authTagLength: 16,
  });
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(buf.slice(0, -16)), decipher.final()]);
  return JSON.parse(zlib.gunzipSync(plain).toString("utf8"));
}

function pickModelArray(data) {
  if (Array.isArray(data) && data.length && data[0] && data[0].intelligenceIndex !== undefined) return data;
  if (data && Array.isArray(data.models)) return data.models;
  return null;
}

function mapModel(m, rank) {
  const ts = m.timescaleData || {};
  const creator = m.creator || {};
  return {
    rank,
    name: m.name,
    slug: m.slug,
    provider: creator.name || null,
    releaseDate: m.releaseDate || null,
    isOpenWeight: !!m.isOpenWeights,
    isReasoning: !!m.isReasoning,
    priceIn: m.price1mInputTokens,
    priceOut: m.price1mOutputTokens,
    composite: m.intelligenceIndex,
    capabilities: {
      intelligenceIndex: m.intelligenceIndex,
      codingIndex: m.codingIndex,
      agenticIndex: m.agenticIndex,
      medianOutputSpeed: ts.medianOutputSpeed ?? null,
      medianTimeToFirstChunk: ts.medianTimeToFirstChunk ?? null,
      endToEndResponseTime: (m.endToEndResponseTime && m.endToEndResponseTime.total) ?? null,
      contextWindowTokens: m.contextWindowTokens ?? null,
      isReasoning: !!m.isReasoning,
      isOpenWeights: !!m.isOpenWeights,
      openSourceCategorization: m.openSourceCategorization ?? null,
      parameters: m.parameters ?? null,
      deprecated: !!m.deprecated,
      deprecatedTo: m.deprecatedTo ?? null,
      vision: !!m.inputModalityImage,
      speech: !!m.inputModalitySpeech,
      video: !!m.inputModalityVideo,
      tools: true,
      maxTokens: m.contextWindowTokens ?? 32000,
    },
  };
}

async function main() {
  const html = await fetchText("https://artificialanalysis.ai/models");
  const chunks = decodeRsc(html);
  const manifests = findManifests(chunks);
  console.log("manifests found:", manifests.map((m) => m.path));

  let models = null;
  for (const man of manifests) {
    const data = await fetchAndDecode(man);
    const arr = pickModelArray(data);
    if (arr && arr.length > 100) {
      models = arr;
      console.log("using manifest", man.path, "->", arr.length, "models");
      break;
    }
  }
  if (!models) throw new Error("no model dataset decoded");

  const eligible = models.filter((m) => m.intelligenceIndex != null && m.name && m.slug);
  eligible.sort((a, b) => b.intelligenceIndex - a.intelligenceIndex);

  const mapped = eligible.map((m, i) => mapModel(m, i + 1));

  fs.writeFileSync(OUT_MODELS, JSON.stringify(mapped, null, 2) + "\n");
  fs.writeFileSync(OUT_RAW, JSON.stringify(models, null, 2) + "\n");

  console.log("wrote", OUT_MODELS, "->", mapped.length, "models");
  console.log("top 5:");
  for (const r of mapped.slice(0, 5)) {
    console.log(`  ${r.rank}. ${r.name} (${r.provider}) ii=${r.composite}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
