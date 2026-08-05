/* SIGNAL — 服务端大模型排行榜快照构建脚本
   由 GitHub Actions 定时运行：抓取三大排行榜数据源，归一化后写入同源 rankings.json，
   供前端 rank.html 直接读取。仅此脚本依赖无，站点本身零依赖。
   每个源独立 try/catch：单个源失败不影响其他源，前端只渲染成功的榜单。

   数据源（2026-08 实测结构）：
   - OpenRouter：/api/frontend/v1/rankings/models（JSON，按日期+模型排列，客户端拉取的真实使用量）
   - Artificial Analysis：/models 页面内嵌 ld+json Dataset 块（Intelligence Index）
   - HuggingFace：/api/models?sort=downloads（公开 JSON） */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "rankings.json");
const UA = "Mozilla/5.0 (compatible; SignalNews/1.0; +https://github.com)";

const OR_API = "https://openrouter.ai/api/frontend/v1/rankings/models";
const AA_URL = "https://artificialanalysis.ai/models";
const HF_URL = "https://huggingface.co/api/models?sort=downloads&direction=-1&limit=100&filter=text-generation";

const HF_MIN_DOWNLOADS = 1000;
const TOP_N = 50;

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

/* ============ OpenRouter 月度使用量排行 ============
   返回按 model_permaslug 聚合的近 7 天 completion+prompt tokens 总量。 */
async function loadOpenRouter() {
  const data = JSON.parse(await fetchText(OR_API, 20000));
  const rows = data && Array.isArray(data.data) ? data.data : [];
  if (!rows.length) throw new Error("empty api data");
  const agg = new Map();
  for (const e of rows) {
    if (!e || !e.model_permaslug) continue;
    const key = e.model_permaslug;
    const cur = agg.get(key) || { comp: 0, prompt: 0 };
    cur.comp += num(e.total_completion_tokens);
    cur.prompt += num(e.total_prompt_tokens);
    agg.set(key, cur);
  }
  const out = Array.from(agg.entries())
    .map(([slug, v]) => ({
      name: slug,
      org: String(slug.split("/")[0] || "").trim(),
      value: v.comp,
      display: fmt(v.comp),
      extra: { prompt: fmt(v.prompt) }
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, TOP_N);
  if (!out.length) throw new Error("no rows aggregated");
  return {
    id: "openrouter",
    name: { zh: "OpenRouter 月度使用量", en: "OpenRouter monthly usage" },
    unit: { zh: "近 7 天完成 token 量", en: "completion tokens, 7d" },
    url: "https://openrouter.ai/rankings",
    rows: out
  };
}

/* ============ Artificial Analysis 综合能力排行 ============
   从页面 ld+json Dataset 块取 Intelligence Index（label + intelligenceIndex）。 */
async function loadAA() {
  const html = await fetchText(AA_URL, 20000);
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try { blocks.push(JSON.parse(m[1])); } catch (e) { /* skip */ }
  }
  let dataset = null;
  for (const b of blocks) {
    if (b && b["@type"] === "Dataset" && b.name === "Artificial Analysis Intelligence Index" && Array.isArray(b.data)) {
      dataset = b;
      break;
    }
  }
  if (!dataset) throw new Error("intelligence dataset not found");
  const rows = dataset.data
    .filter((r) => r && r.label)
    .map((r) => {
      const score = num(r.intelligenceIndex ?? r.intelligence_index ?? 0);
      return { name: String(r.label).trim(), org: "", value: score, display: score ? score.toFixed(1) : "" };
    })
    .filter((r) => r.value > 0)
    .slice(0, TOP_N);
  if (!rows.length) throw new Error("no rows extracted");
  return {
    id: "aa",
    name: { zh: "Artificial Analysis 综合能力", en: "Artificial Analysis intelligence" },
    unit: { zh: "综合能力指数", en: "intelligence index" },
    url: "https://artificialanalysis.ai/leaderboards/models",
    rows
  };
}

/* ============ HuggingFace 开源模型下载排行 ============ */
async function loadHF() {
  const data = JSON.parse(await fetchText(HF_URL, 20000));
  if (!Array.isArray(data)) throw new Error("bad json");
  const rows = data
    .filter((mdl) => mdl && mdl.id && num(mdl.downloads) >= HF_MIN_DOWNLOADS)
    .map((mdl) => {
      const d = num(mdl.downloads);
      return { name: String(mdl.id || "").trim(), org: String((mdl.author || mdl.id || "").split("/")[0] || "").trim(), value: d, display: fmt(d) };
    })
    .filter((r) => r.name && r.value > 0)
    .slice(0, TOP_N);
  if (!rows.length) throw new Error("no rows extracted");
  return {
    id: "hf",
    name: { zh: "HuggingFace 开源下载量", en: "HuggingFace open downloads" },
    unit: { zh: "累计下载量", en: "total downloads" },
    url: "https://huggingface.co/models?sort=downloads",
    rows
  };
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
