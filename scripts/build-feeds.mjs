/* SIGNAL — 服务端 RSS + X 快照构建脚本
   由 GitHub Actions 定时运行：直接抓取 RSS/Atom 源与 X (Twitter) 一线 AI 从业者动态
   并解析（Node 端无 CORS 限制），归一化后写入同源 feeds.json，供前端直接读取。
   仅此脚本依赖 fast-xml-parser，站点本身零依赖。 */

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

/* X (Twitter) 一线 AI 从业者动态 —— Bluesky 镜像方案。
   X 已无免费 API，RSSHub 的 Twitter 路由需自备 token（公共实例均无法抓取），
   因此通过 Bluesky 公共 AT 协议 API（public.api.bsky.app，无需认证）抓取同一批
   从业者的镜像动态，CI 端抓取后写进 feeds.json 快照，来源标注为从业者账号。 */
const X_ACCOUNTS = [
  { handle: "sama",         zh: "Sam Altman",     en: "Sam Altman",     bsky: "sama.bsky.social" },
  { handle: "karpathy",     zh: "Andrej Karpathy", en: "Andrej Karpathy", bsky: "karpathy.bsky.social" },
  { handle: "ilyasut",      zh: "Ilya Sutskever", en: "Ilya Sutskever", bsky: "ilyasut.bsky.social" },
  { handle: "AndrewYNg",    zh: "吴恩达",         en: "Andrew Ng",      bsky: "andrewyng.bsky.social" },
  { handle: "ylecun",       zh: "Yann LeCun",     en: "Yann LeCun",     bsky: "ylecun.bsky.social" },
  { handle: "DemisHassabis", zh: "Demis Hassabis", en: "Demis Hassabis", bsky: "demishassabis.bsky.social" },
  { handle: "drfeifei",     zh: "李飞飞",         en: "Fei-Fei Li",     bsky: "drfeifei.bsky.social" },
  { handle: "YangqingJia",  zh: "贾扬清",         en: "Yangqing Jia",   bsky: "yangqingjia.bsky.social" },
  { handle: "Jim_fanwu",    zh: "范犁犁",         en: "Jim Fan",        bsky: "jimfan.bsky.social" },
  { handle: "kaifulee",     zh: "李开复",         en: "Kai-Fu Lee",     bsky: "kaifulee.bsky.social" },
  { handle: "_akhaliq",     zh: "AK · HF Daily",  en: "AK · HF Daily",  bsky: "akhaliq.bsky.social" },
  { handle: "_philschmid",  zh: "Philipp Schmid", en: "Philipp Schmid", bsky: "philschmid.bsky.social" },
  { handle: "emollick",     zh: "Ethan Mollick",  en: "Ethan Mollick",  bsky: "emollick.bsky.social" },
  { handle: "hwchase17",    zh: "Harrison Chase", en: "Harrison Chase", bsky: "hwchase17.bsky.social" }
];

const BSKY_API = "https://public.api.bsky.app/xrpc";
const X_MAX_TOTAL = 40;
const X_TIME_BUDGET_MS = 75000;
const X_PER_ACCOUNT = 4;

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

function absUrl(v, baseUrl) {
  if (!v) return "";
  try {
    const u = new URL(v, baseUrl);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
    return "";
  } catch (e) {
    return "";
  }
}

/* 提取封面图：优先 enclosure / media:content / media:thumbnail，
   再回退到 description/content 里的第一个 <img> */
function extractCover(raw, baseUrl) {
  if (!raw) return "";
  let url = raw.cover || "";
  const enc = raw.enclosure;
  if (!url && enc) url = (typeof enc === "object" ? enc["@_url"] || enc.url || "" : String(enc)) || "";
  if (!url && raw["media:content"]) {
    const mc = Array.isArray(raw["media:content"]) ? raw["media:content"][0] : raw["media:content"];
    url = mc["@_url"] || mc.url || "";
  }
  if (!url && raw["media:thumbnail"]) {
    const mt = Array.isArray(raw["media:thumbnail"]) ? raw["media:thumbnail"][0] : raw["media:thumbnail"];
    url = mt["@_url"] || mt.url || "";
  }
  if (!url) {
    const html = [raw.description, raw.summary, raw.content, raw.desc]
      .map(function (v) { return text(v); }).join(" ");
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) url = m[1];
  }
  return absUrl(url, baseUrl);
}

async function fetchText(url, timeoutMs) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const c = new AbortController();
      const to = setTimeout(() => c.abort(), timeoutMs || 20000);
      const res = await fetch(url, { signal: c.signal, headers: { "User-Agent": UA } });
      clearTimeout(to);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1200 * attempt));
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
      desc: text(e.summary) || text(e.content),
      cover: extractCover(e, link)
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
      excerpt: truncate(stripHtml(raw.description || raw.summary || raw.content || raw.desc || ""), 150),
      cover: extractCover(raw, url) || ""
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

function coverFromEmbed(embed) {
  if (!embed || typeof embed !== "object") return "";
  if (Array.isArray(embed.images) && embed.images.length) {
    return absUrl(embed.images[0].fullsize || embed.images[0].thumb || "", "https://bsky.app");
  }
  if (embed.external && embed.external.thumb) {
    return absUrl(embed.external.thumb, "https://bsky.app");
  }
  return "";
}

/* 抓取 X 一线 AI 从业者动态（Bluesky 镜像）：直接以 handle 作为 actor 调 getAuthorFeed，
   并发 4、全局时间预算兜底。仅保留纯文本/有意义的原创帖（排除回复与仅含话题标签的空标题）。 */
async function loadX() {
  const start = Date.now();
  const pool = 4;

  async function fetchAccount(acc) {
    if (Date.now() - start > X_TIME_BUDGET_MS) return { acc, ok: false, err: "time budget" };
    const handle = acc.bsky || (acc.handle + ".bsky.social");
    try {
      const data = JSON.parse(await fetchText(
        `${BSKY_API}/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(handle)}&limit=30&filter=posts_no_replies`,
        10000
      ));
      const feed = Array.isArray(data && data.feed) ? data.feed : [];
      const list = [];
      for (const entry of feed) {
        const post = entry && entry.post;
        if (!post || !post.record || post.record.reply) continue;
        const rec = post.record;
        let text = typeof rec.text === "string" ? rec.text : "";
        text = text.replace(/\s+/g, " ").trim();
        if (!text || !/[\p{L}\p{N}]/u.test(text)) continue;
        const time = Date.parse(post.indexedAt || rec.createdAt || "");
        if (Number.isNaN(time)) continue;
        const rkey = String(post.uri || "").split("/").pop();
        if (!rkey) continue;
        const url = `https://bsky.app/profile/${encodeURIComponent(post.author && post.author.handle || acc.handle)}/post/${rkey}`;
        list.push({
          source: "x",
          title: truncate(text, 200),
          url,
          time,
          excerpt: truncate(text, 150),
          cover: coverFromEmbed(post.embed),
          author: "@" + acc.handle
        });
        if (list.length >= X_PER_ACCOUNT) break;
      }
      if (!list.length) throw new Error("no usable posts");
      return { acc, ok: true, list };
    } catch (e) {
      return { acc, ok: false, err: String((e && e.message) || e).slice(0, 60) };
    }
  }

  const results = [];
  const queue = X_ACCOUNTS.map((acc) => () => fetchAccount(acc));
  async function worker() {
    while (queue.length) {
      const r = await queue.shift()();
      results.push(r);
      console.log(r.ok
        ? `[ok] x/${r.acc.handle}: ${r.list.length} posts`
        : `[fail] x/${r.acc.handle}: ${r.err}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(pool, queue.length) }, worker));

  const out = results.filter((r) => r.ok).flatMap((r) => r.list);
  out.sort((a, b) => b.time - a.time);
  return out.slice(0, X_MAX_TOTAL);
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

  try {
    const x = await loadX();
    articles.push(...x);
    console.log(`[ok] x: ${x.length} tweets total`);
  } catch (e) {
    console.log(`[fail] x: ${String(e.message || e).slice(0, 60)}`);
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
