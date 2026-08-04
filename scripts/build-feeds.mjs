/* SIGNAL — 服务端 RSS 快照构建脚本
   由 GitHub Actions 定时运行：直接抓取 4 个 RSS/Atom 源并解析（Node 端无 CORS 限制），
   归一化后写入同源 feeds.json，供前端直接读取。仅此脚本依赖 fast-xml-parser，站点本身零依赖。 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { XMLParser } from "fast-xml-parser";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "feeds.json");
const UA = "Mozilla/5.0 (compatible; SignalNews/1.0; +https://github.com)";

const FEEDS = [
  { id: "techcrunch", url: "https://techcrunch.com/category/artificial-intelligence/feed/", cap: 30 },
  { id: "verge", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", cap: 30 },
  { id: "qbitai", url: "https://www.qbitai.com/feed", cap: 20 },
  { id: "kr36", url: "https://36kr.com/feed", cap: 80, filter: true }
];

const ZH_AI_KW = ["大模型", "人工智能", " ai", "ai ", "模型", "deepseek", "openai", "chatgpt", "gpt", "gemini", "claude", "qwen", "千问", "kimi", "智能体", "具身", "机器人", "多模态", "推理", "算法", "英伟达", "nvidia", "gpu", "算力", "芯片", "智谱", "minimax", "月之暗面"];

const parser = new XMLParser({ ignoreAttributes: false });

function decodeEntities(s) {
  if (!s) return "";
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeChar(parseInt(d, 10)));
}

function safeChar(code) {
  return code >= 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
    ? String.fromCodePoint(code)
    : "\uFFFD";
}

function stripHtml(s) {
  if (!s) return "";
  return decodeEntities(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function isAiZh(title) {
  const hay = title.toLowerCase();
  return ZH_AI_KW.some((k) => hay.includes(k));
}

function asArray(v) {
  return v == null ? [] : Array.isArray(v) ? v : [v];
}

function text(v) {
  if (v == null) return "";
  if (typeof v === "string") return decodeEntities(v);
  if (typeof v === "object" && "#text" in v) return decodeEntities(v["#text"]);
  return "";
}

async function fetchText(url) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const c = new AbortController();
      const to = setTimeout(() => c.abort(), 20000);
      const res = await fetch(url, { signal: c.signal, headers: { "User-Agent": UA } });
      clearTimeout(to);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

function parseRssItems(channel) {
  return asArray(channel && channel.item);
}

function parseAtomEntries(feed) {
  return asArray(feed && feed.entry).map((e) => {
    let link = "";
    for (const l of asArray(e.link)) {
      const href = typeof l === "object" ? l["@_href"] : l;
      if (href && (typeof l !== "object" || !l["@_rel"] || l["@_rel"] === "alternate")) { link = href; break; }
    }
    return {
      title: text(e.title),
      link,
      date: text(e.published) || text(e.updated),
      desc: text(e.summary) || text(e.content)
    };
  });
}

function normalize(id, items, cap) {
  const out = [];
  for (const raw of items) {
    const title = text(raw.title || raw["@_title"]).replace(/\s+/g, " ").trim();
    let url = "";
    if (typeof raw.link === "string") url = raw.link.trim();
    else if (raw.link && typeof raw.link === "object") url = raw.link["@_href"] || "";
    else if (raw.guid && typeof raw.guid === "string") url = raw.guid.trim();
    if (!url && raw.id && typeof raw.id === "string") url = raw.id.trim();
    if (!title || !url) continue;

    let time = Date.parse(raw.pubDate || raw.published || raw.updated || raw.date || "");
    if (Number.isNaN(time)) time = Date.now();

    out.push({
      source: id,
      title,
      url,
      time,
      excerpt: truncate(stripHtml(raw.description || raw.summary || raw.content || ""), 150)
    });
    if (out.length >= cap) break;
  }
  return out;
}

async function load(feed) {
  const xml = await fetchText(feed.url);
  const j = parser.parse(xml);
  if (j.rss && j.rss.channel) return parseRssItems(j.rss.channel);
  if (j.feed) return parseAtomEntries(j.feed);
  throw new Error("无法识别的格式");
}

async function main() {
  const articles = [];
  for (const feed of FEEDS) {
    try {
      const raw = await load(feed);
      let list = normalize(feed.id, raw, feed.cap);
      if (feed.filter) list = list.filter((a) => isAiZh(a.title));
      articles.push(...list);
      console.log(`[ok] ${feed.id}: ${list.length} items`);
    } catch (e) {
      console.log(`[fail] ${feed.id}: ${String(e.message || e).slice(0, 60)}`);
    }
  }

  articles.sort((a, b) => b.time - a.time);
  const payload = { builtAt: new Date().toISOString(), articles };

  let prev = null;
  if (existsSync(OUT)) {
    try { prev = readFileSync(OUT, "utf8"); } catch (e) { /* ignore */ }
  }
  const next = JSON.stringify(payload);
  if (prev === next) {
    console.log("feeds.json 无变化，跳过写入");
    return;
  }
  writeFileSync(OUT, next);
  console.log(`written feeds.json (${articles.length} articles, ${(next.length / 1024).toFixed(0)} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
