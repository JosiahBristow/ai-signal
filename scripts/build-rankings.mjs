/* SIGNAL — 服务端大模型排行榜快照构建脚本
   由 GitHub Actions 定时运行：抓取三大排行榜数据源，归一化后写入同源 rankings.json，
   供前端 rank.html 直接读取。仅此脚本依赖无，站点本身零依赖。
   每个源独立 try/catch：单个源失败不影响其他源，前端只渲染成功的榜单。 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "rankings.json");
const UA = "Mozilla/5.0 (compatible; SignalNews/1.0; +https://github.com)";

const HF_MODELS_URL = "https://huggingface.co/api/models?sort=downloads&direction=-1&limit=100&filter=text-generation";
const OPENROUTER_URL = "https://openrouter.ai/rankings";
const AA_URL = "https://artificialanalysis.ai/leaderboards/models";

const HF_MIN_DOWNLOADS = 1000;

async function fetchText(url, timeoutMs) {
  const c = new AbortController();
  const to = setTimeout(() => c.abort(), timeoutMs || 20000);
  try {
    const res = await fetch(url, { signal: c.signal, headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } finally {
    clearTimeout(to);
  }
}

function extractNextData(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    return null;
  }
}

function walk(obj, pred, out, depth) {
  if (out.length) return out;
  if (depth > 12 || obj == null) return out;
  if (pred(obj)) { out.push(obj); return out; }
  if (Array.isArray(obj)) {
    for (const v of obj) { walk(v, pred, out, depth + 1); if (out.length) return out; }
  } else if (typeof obj === "object") {
    for (const k of Object.keys(obj)) { walk(obj[k], pred, out, depth + 1); if (out.length) return out; }
  }
  return out;
}

function findRankingArray(data, keys) {
  const out = walk(data, (o) => {
    if (!Array.isArray(o) || !o.length) return false;
    const first = o[0];
    if (typeof first !== "object" || first == null) return false;
    const hay = JSON.stringify(first).toLowerCase();
    return keys.every((k) => hay.includes(k));
  }, [], 0);
  return out[0] || null;
}

function num(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2).replace(/\.?0+$/, "") + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(Math.round(n));
}

/* ============ OpenRouter 月度使用量排行 ============ */
async function loadOpenRouter() {
  const html = await fetchText(OPENROUTER_URL, 20000);
  const data = extractNextData(html);
  if (!data) throw new Error("no __NEXT_DATA__");
  const arr = findRankingArray(data, ["rank"]);
  if (!arr) throw new Error("ranking array not found");
  const rows = arr
    .filter((r) => r && (r.name || r.id))
    .map((r) => {
      const tokens = num(r.monthly_tokens ?? r.tokens ?? r.token_count ?? r.total_tokens ?? r.monthly_usage ?? 0);
      return {
        name: String(r.name || r.id || "").trim(),
        org: String(r.organization || r.author || r.org || "").trim(),
        value: tokens,
        display: tokens ? fmt(tokens) : ""
      };
    })
    .filter((r) => r.name && r.value > 0)
    .slice(0, 50);
  if (!rows.length) throw new Error("no rows extracted");
  return { id: "openrouter", name: { zh: "OpenRouter 月度使用量", en: "OpenRouter monthly usage" }, unit: { zh: "月 token 使用量", en: "monthly tokens" }, url: OPENROUTER_URL, rows };
}

/* ============ Artificial Analysis 综合能力排行 ============ */
async function loadAA() {
  const html = await fetchText(AA_URL, 20000);
  const data = extractNextData(html);
  if (!data) throw new Error("no __NEXT_DATA__");
  const arr = findRankingArray(data, ["intelligence"]);
  if (!arr) throw new Error("ranking array not found");
  const rows = arr
    .filter((r) => r && (r.name || r.model))
    .map((r) => {
      const score = num(r.intelligence_index ?? r.intelligence ?? r.score ?? r.intelligenceIndex ?? 0);
      return {
        name: String(r.name || r.model || "").trim(),
        org: String(r.organization || r.org || r.vendor || "").trim(),
        value: score,
        display: score ? score.toFixed(1) : ""
      };
    })
    .filter((r) => r.name && r.value > 0)
    .slice(0, 50);
  if (!rows.length) throw new Error("no rows extracted");
  return { id: "aa", name: { zh: "Artificial Analysis 综合能力", en: "Artificial Analysis intelligence" }, unit: { zh: "综合能力指数", en: "intelligence index" }, url: AA_URL, rows };
}

/* ============ HuggingFace 开源模型下载排行 ============ */
async function loadHF() {
  const data = JSON.parse(await fetchText(HF_MODELS_URL, 20000));
  if (!Array.isArray(data)) throw new Error("bad json");
  const rows = data
    .filter((m) => m && m.id && num(m.downloads) >= HF_MIN_DOWNLOADS)
    .map((m) => {
      const d = num(m.downloads);
      return {
        name: String(m.id || "").trim(),
        org: String((m.author || m.id || "").split("/")[0] || "").trim(),
        value: d,
        display: fmt(d)
      };
    })
    .filter((r) => r.name && r.value > 0)
    .slice(0, 50);
  if (!rows.length) throw new Error("no rows extracted");
  return { id: "hf", name: { zh: "HuggingFace 开源下载量", en: "HuggingFace open downloads" }, unit: { zh: "累计下载量", en: "total downloads" }, url: "https://huggingface.co/models?sort=downloads", rows };
}

const SOURCES = [
  { id: "openrouter", label: "OpenRouter", load: loadOpenRouter },
  { id: "aa", label: "Artificial Analysis", load: loadAA },
  { id: "hf", label: "HuggingFace", load: loadHF }
];

async function main() {
  const boards = [];
  for (const s of SOURCES) {
    try {
      const b = await s.load();
      boards.push(b);
      console.log(`[ok] ${s.id}: ${b.rows.length} rows`);
    } catch (e) {
      console.log(`[fail] ${s.id}: ${String(e.message || e).slice(0, 80)}`);
    }
  }

  const payload = { builtAt: new Date().toISOString(), boards };

  let prev = null;
  if (existsSync(OUT)) {
    try { prev = readFileSync(OUT, "utf8"); } catch (e) { /* ignore */ }
  }
  const next = JSON.stringify(payload);
  if (prev === next) {
    console.log("rankings.json 无变化，跳过写入");
    return;
  }
  writeFileSync(OUT, next);
  console.log(`written rankings.json (${boards.length} boards, ${(next.length / 1024).toFixed(0)} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
