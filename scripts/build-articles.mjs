/* SIGNAL — 服务端全文快照构建脚本
   由 GitHub Actions 定时运行：读取 feeds.json 中最新的若干头条，直连抓取原文全文
   （Node 端无 CORS 限制），用 cheerio 抽取正文并消毒，写入同源 articles.json，
   供前端「站内阅读」浮层直接读取。仅此脚本依赖 cheerio，站点本身零依赖。 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import * as cheerio from "cheerio";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FEEDS_IN = join(ROOT, "feeds.json");
const OUT = join(ROOT, "articles.json");
const UA = "Mozilla/5.0 (compatible; SignalNews/1.0; +https://github.com)";

const LIMIT = 80;
const CONCURRENCY = 6;
const TIMEOUT = 20000;
const MIN_TEXT = 120;

const STRIP_SEL = [
  "script", "style", "noscript", "iframe", "form", "nav", "footer", "header",
  "aside", "ins", "svg", "canvas", "button", "object", "embed",
  "audio", "video", "source", "track", "map", "area", "dialog", "menu",
  "[aria-hidden='true']", "[role='navigation']", "[role='banner']", "[role='complementary']",
  ".ad", ".ads", ".advert", ".adsbygoogle", ".banner", ".related", ".recommend",
  ".share", ".comment", ".comments", ".subscribe", ".newsletter", ".breadcrumb",
  ".widget", ".popup", ".mask", ".fixed", ".copyright", ".tip", ".backtop",
  "#ad", "#ads", "#sidebar", "#navbar", "#breadcrumb",
  "[id*='ad-']", "[class*='ad-']", "[class*='ads']", "[id*='related']",
  "[class*='related']", "[class*='recommend']", "[class*='share']", "[class*='comment']",
  "[class*='subscribe']", "[class*='newsletter']", "[class*='breadcrumb']",
  "[class*='widget']", "[class*='popup']", "[class*='footer']", "[class*='header']",
  "[class*='sidebar']", "[class*='author']", "[class*='meta']", "[class*='tags']"
].join(",");

const ALLOWED = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "img", "a", "blockquote",
  "ul", "ol", "li", "pre", "code", "strong", "b", "em", "i", "br",
  "figure", "figcaption", "hr", "div", "span", "table", "thead", "tbody",
  "tr", "td", "th", "dl", "dt", "dd"
]);

const CONTAINERS = [
  "article",
  "main",
  ".article-content", ".article_content", ".articleContent",
  ".post-content", ".post_content", ".postContent",
  ".entry-content", ".rich_media_content", "#js_content",
  "[class*='article-content']", "[class*='post-content']",
  "[class*='entry-content']", "[class*='articleContent']",
  "[class*='postContent']", "[class*='article_content']",
  "[class*='rich_media_content']", "[id='js_content']",
  "[id='content']", "[class*='content']", "[id='article']",
  "[class*='article']", "[class*='text']"
];

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

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr"
]);

function sanitizeNode($, el, baseUrl) {
  el.find(STRIP_SEL).remove();
  const nodes = el.find("*").toArray();
  for (const node of nodes) {
    const tag = node.tagName.toLowerCase();
    if (!ALLOWED.has(tag)) {
      if (VOID.has(tag)) $(node).remove();
      else $(node).replaceWith($(node).contents());
      continue;
    }
    const attrs = {};
    if (tag === "a") {
      const href = absUrl($(node).attr("href"), baseUrl);
      if (href) {
        attrs.href = href;
        attrs.target = "_blank";
        attrs.rel = "noopener";
      }
    } else if (tag === "img") {
      const src = absUrl($(node).attr("src"), baseUrl);
      if (src) {
        attrs.src = src;
        attrs.loading = "lazy";
        const alt = $(node).attr("alt");
        if (alt) attrs.alt = alt;
      }
    }
    for (const name of Array.from(node.attributes || [])) {
      if (name.name === "href" || name.name === "src" || name.name === "target" ||
          name.name === "rel" || name.name === "loading" || name.name === "alt") continue;
      $(node).removeAttr(name.name);
    }
    for (const [k, v] of Object.entries(attrs)) $(node).attr(k, v);
  }
  const kept = el.find("*").toArray();
  for (const node of kept) {
    const tag = node.tagName.toLowerCase();
    if (tag === "br" || tag === "img" || tag === "hr" || tag === "figcaption") continue;
    if (($(node).text() || "").replace(/\s+/g, "").length > 0) continue;
    if ($(node).find("img").length > 0) continue;
    $(node).remove();
  }
}

function extract(html, baseUrl) {  const $ = cheerio.load(html);
  let best = null;
  let bestLen = 0;
  for (const sel of CONTAINERS) {
    $(sel).each((i, el) => {
      const $el = $(el);
      const len = ($el.text() || "").replace(/\s+/g, "").length;
      if (len > bestLen) {
        bestLen = len;
        best = $el;
      }
    });
  }
  const root = best && bestLen >= MIN_TEXT ? best : $("body");
  const clone = root.clone();
  sanitizeNode($, clone, baseUrl);
  const textLen = (clone.text() || "").replace(/\s+/g, "").length;
  if (textLen < MIN_TEXT) return null;
  let cover = "";
  const firstImg = clone.find("img[src]").first();
  if (firstImg.length) cover = firstImg.attr("src") || "";
  return { content: clone.html(), textLen, cover };
}

async function fetchText(url) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const c = new AbortController();
      const to = setTimeout(() => c.abort(), TIMEOUT);
      const res = await fetch(url, { signal: c.signal, headers: { "User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8" } });
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

async function runJob(a) {
  try {
    const html = await fetchText(a.url);
    const r = extract(html, a.url);
    if (!r) return { url: a.url, skip: "抽取正文过短" };
    return {
      url: a.url,
      title: a.title,
      source: a.source,
      excerpt: a.excerpt || "",
      cover: r.cover,
      content: r.content,
      textLen: r.textLen
    };
  } catch (e) {
    return { url: a.url, skip: String(e.message || e).slice(0, 40) };
  }
}

async function main() {
  if (!existsSync(FEEDS_IN)) {
    console.log("feeds.json 不存在，跳过全文构建");
    return;
  }
  let feed;
  try { feed = JSON.parse(readFileSync(FEEDS_IN, "utf8")); }
  catch (e) { console.error("feeds.json 解析失败:", e.message); process.exit(1); }

  const all = (feed.articles || []).slice().sort((x, y) => y.time - x.time);
  const targets = all.filter((a) => a && a.url && /^https?:\/\//.test(a.url)).slice(0, LIMIT);
  console.log(`待抓取 ${targets.length} 篇文章…`);

  /* 保留旧快照：不在本次目标列表中的文章（已滑出最新 N 条）继续沿用历史内容，
     避免卡片随刷新失去全文；覆盖随运行次数逐步扩大。 */
  const keepPrev = [];
  if (existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, "utf8"));
      const prevArt = prev.articles || [];
      const fresh = new Set(targets.map((a) => a.url));
      const seen = new Set();
      for (const p of prevArt) {
        if (p && p.url && !fresh.has(p.url) && !seen.has(p.url)) {
          seen.add(p.url);
          keepPrev.push(p);
        }
      }
      console.log(`沿用历史快照 ${keepPrev.length} 篇`);
    } catch (e) {
      console.error("读取旧 articles.json 失败，跳过保留:", e.message);
    }
  }

  const out = [];
  let done = 0;
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const chunk = targets.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(runJob));
    for (const r of results) {
      done++;
      if (r.skip) console.log(`[skip] ${done}/${targets.length} ${r.skip} :: ${r.url}`);
      else {
        out.push(r);
        console.log(`[ok] ${done}/${targets.length} ${r.textLen}字 :: ${r.url}`);
      }
    }
  }

  out.sort((a, b) => b.textLen - a.textLen);
  const payload = { builtAt: new Date().toISOString(), articles: [...out, ...keepPrev] };

  let prev = null;
  if (existsSync(OUT)) {
    try { prev = readFileSync(OUT, "utf8"); } catch (e) { /* ignore */ }
  }
  const next = JSON.stringify(payload);
  if (prev === next) {
    console.log("articles.json 无变化，跳过写入");
    return;
  }
  writeFileSync(OUT, next);
  console.log(`written articles.json (${out.length} articles, ${(next.length / 1024).toFixed(0)} KB)`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export { extract };
