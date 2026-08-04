/* SIGNAL — 新闻聚合引擎（纯前端，无服务器） */

(function () {
  "use strict";

  /* ============ 配置 ============ */

  var GISCUS = {
    repo: "",
    repoId: "",
    category: "Announcements",
    categoryId: "",
    lang: "zh-CN"
  };

  var REFRESH_MS = 5 * 60 * 1000;
  var STALE_MS = 2 * 60 * 1000;
  var PAGE_SIZE = 24;
  var PAGE_STEP = 18;

  var PROXIES = [
    function (u) { return "https://api.allorigins.win/raw?url=" + encodeURIComponent(u); },
    function (u) { return "https://api.allorigins.win/get?url=" + encodeURIComponent(u); },
    function (u) { return "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(u); }
  ];

  var SNAPSHOT_URL = "feeds.json";
  var snapshot = null;

  var ARTICLES_URL = "articles.json";
  var readerIndex = null;

  function loadSnapshot() {
    return fetchWithTimeout(SNAPSHOT_URL + "?t=" + Date.now(), 8000).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !Array.isArray(j.articles)) throw new Error("快照格式异常");
      snapshot = j;
      return j;
    });
  }

  function snapshotArticles(sid) {
    if (!snapshot || !snapshot.articles) return null;
    var items = snapshot.articles.filter(function (a) { return a.source === sid && a.title && a.url; });
    if (!items.length) return null;
    return items.map(function (a, i) {
      return {
        id: sid + "-s" + i + "-" + djb2(a.url),
        title: a.title,
        url: a.url,
        source: sid,
        lang: sourceById(sid) ? sourceById(sid).lang : "en",
        time: a.time || Date.now(),
        excerpt: a.excerpt || "",
        cover: a.cover || "",
        points: 0, comments: 0, eng: 0
      };
    });
  }

  function loadReaderIndex() {
    return fetchWithTimeout(ARTICLES_URL + "?t=" + Date.now(), 10000).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !Array.isArray(j.articles)) throw new Error("articles 格式异常");
      var idx = {};
      j.articles.forEach(function (a) { if (a && a.url) idx[urlKey(a.url)] = a; });
      readerIndex = idx;
      if (state.all.length) {
        state.all.forEach(function (it) {
          var art = idx[urlKey(it.url)];
          if (art && art.cover && !it.cover) it.cover = art.cover;
        });
      }
      return idx;
    }).catch(function () {
      readerIndex = null;
      return null;
    });
  }

  var CATEGORIES = [
    { id: "robotics", zh: "机器人", en: "Robotics", kw: ["机器人", "人形", "具身", "灵巧手", "机械臂", "无人驾驶", "robot", "humanoid", "embodied", "drone"] },
    { id: "compute", zh: "芯片与算力", en: "Compute & Chips", kw: ["芯片", "gpu", "chip", "算力", "数据中心", "半导体", "晶圆", "存储", "英伟达", "nvidia", "tpu", "compute", "semiconductor", "data center", "datacenter", "power plant", "reactor", "energy"] },
    { id: "research", zh: "研究与技术", en: "Research", kw: ["论文", "研究", "评测", "基准", "突破", "证明", "发现", "paper", "research", "study", "benchmark", "theorem", "math", "science"] },
    { id: "safety", zh: "安全与风险", en: "Safety & Risk", kw: ["安全", "风险", "攻击", "漏洞", "泄漏", "泄露", "滥用", "越狱", "hack", "hacked", "leak", "breach", "exploit", "vulnerab", "jailbreak", "safety", "rogue"] },
    { id: "policy", zh: "政策与监管", en: "Policy & Regulation", kw: ["法案", "监管", "政策", "法规", "禁令", "立法", "法院", "起诉", "诉讼", "制裁", "合规", "ai act", "regula", "ban", "law", "legislat", "court", "lawsuit", "sanction", "compliance"] },
    { id: "business", zh: "融资与商业", en: "Funding & Business", kw: ["融资", "收购", "投资", "上市", "估值", "财报", "营收", "利润", "ipo", "raise", "funding", "acquisition", "invest", "revenue", "earnings", "billion", "million", "valuation", "stake"] },
    { id: "apps", zh: "应用与产品", en: "Apps & Products", kw: ["应用", "产品", "功能", "工具", "上线", "接入", "客户端", "app", "feature", "tool", "product", "update", "体验"] },
    { id: "models", zh: "模型与发布", en: "Models & Releases", kw: ["模型", "大模型", "发布", "开源", "推出", "基座", "版本", "新品", "亮相", "gpt", "claude", "gemini", "deepseek", "qwen", "千问", "llama", "kimi", "minimax", "launch", "release", "announce", "unveil", "debut", "open-source", "opensource", "model"] },
    { id: "other", zh: "其他", en: "Other", kw: [] }
  ];

  var ZH_AI_KW = ["大模型", "人工智能", " ai", "ai ", "模型", "deepseek", "openai", "chatgpt", "gpt", "gemini", "claude", "qwen", "千问", "kimi", "智能体", "具身", "机器人", "多模态", "推理", "算法", "英伟达", "nvidia", "gpu", "算力", "芯片", "智谱", "minimax", "月之暗面"];

  var SOURCES = [
    { id: "hn", label: "Hacker News", lang: "en", badge: "HN",
      load: function () {
        var q = encodeURIComponent('AI OR LLM OR "artificial intelligence" OR "machine learning" OR "deep learning" OR "AI agent"');
        return fetchJSON("https://hn.algolia.com/api/v1/search_by_date?query=" + q + "&tags=story&restrictSearchableAttributes=title&numericFilters=points%3E5&hitsPerPage=50").then(parseHN);
      } },
    { id: "devto", label: "DEV.to", lang: "en", badge: "DEV",
      load: function () { return fetchJSON("https://dev.to/api/articles?tag=ai&per_page=30").then(parseDevto); } },
    { id: "techcrunch", label: "TechCrunch AI", lang: "en", badge: "TC",
      load: function (snapP) { return withSnapshot(snapP, "techcrunch", "https://techcrunch.com/category/artificial-intelligence/feed/"); } },
    { id: "verge", label: "The Verge AI", lang: "en", badge: "VERGE",
      load: function (snapP) { return withSnapshot(snapP, "verge", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"); } },
    { id: "qbitai", label: "量子位", lang: "zh", badge: "量子位",
      load: function (snapP) { return withSnapshot(snapP, "qbitai", "https://www.qbitai.com/feed"); } },
    { id: "kr36", label: "36氪", lang: "zh", badge: "36氪",
      load: function (snapP) { return withSnapshot(snapP, "kr36", "https://36kr.com/feed", true); } }
  ];

  function withSnapshot(snapP, sid, feedUrl, filterZh) {
    return (snapP || Promise.resolve()).then(function () {
      var snap = snapshotArticles(sid);
      if (snap) return snap;
      return fetchRss(feedUrl).then(function (d) {
        var list = parseFeed(d, sid);
        return filterZh ? list.filter(isAiZh) : list;
      });
    });
  }

  /* ============ 工具函数 ============ */

  function fetchWithTimeout(url, ms) {
    ms = ms || 20000;
    var c = new AbortController();
    var t = setTimeout(function () { c.abort(); }, ms);
    return fetch(url, { signal: c.signal }).finally(function () { clearTimeout(t); });
  }

  function fetchJSON(url) {
    return fetchWithTimeout(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function toXml(txt) {
    return new DOMParser().parseFromString(txt || "", "text/xml");
  }

  function attemptProxy(proxyFn, url) {
    return fetchWithTimeout(proxyFn(url), 15000).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    }).then(toXml);
  }

  function fetchRss(url) {
    return attemptProxy(PROXIES[0], url)
      .catch(function () {
        return new Promise(function (res) { setTimeout(function () { res(attemptProxy(PROXIES[0], url)); }, 700); });
      })
      .catch(function () { return attemptProxy(PROXIES[1], url); })
      .catch(function () { return attemptProxy(PROXIES[2], url); });
  }

  function stripHtml(s) {
    if (!s) return "";
    var t = document.createElement("div");
    t.innerHTML = s;
    return (t.textContent || "").replace(/\s+/g, " ").trim();
  }

  function truncate(s, n) {
    if (!s) return "";
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function relTime(ts) {
    var d = Date.now() - ts;
    if (d < 0) return "刚刚";
    var m = d / 60000;
    if (m < 1) return "刚刚";
    if (m < 60) return Math.floor(m) + " 分钟前";
    var h = m / 60;
    if (h < 24) return Math.floor(h) + " 小时前";
    return Math.floor(h / 24) + " 天前";
  }

  function djb2(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(16);
  }

  function urlKey(u) {
    try {
      var x = new URL(u);
      x.hash = "";
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "f", "ref"].forEach(function (k) { x.searchParams.delete(k); });
      return x.hostname + x.pathname.replace(/\/+$/, "");
    } catch (e) { return u; }
  }

  function isAiZh(a) {
    var hay = (a.title + " " + a.excerpt).toLowerCase();
    return ZH_AI_KW.some(function (k) { return hay.indexOf(k) !== -1; });
  }

  function classify(a) {
    var hay = (a.title + " " + a.excerpt).toLowerCase();
    for (var i = 0; i < CATEGORIES.length; i++) {
      var c = CATEGORIES[i];
      for (var j = 0; j < c.kw.length; j++) {
        if (hay.indexOf(c.kw[j]) !== -1) return c.id;
      }
    }
    return "other";
  }

  function catById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return CATEGORIES[CATEGORIES.length - 1];
  }

  function sourceById(id) {
    for (var i = 0; i < SOURCES.length; i++) if (SOURCES[i].id === id) return SOURCES[i];
    return null;
  }

  function heatOf(a, srcMax) {
    var pct = srcMax > 0 ? a.eng / srcMax : 0;
    var ageH = (Date.now() - a.time) / 3600000;
    var rec = Math.max(0, 1 - ageH / 72);
    return a.eng > 0 ? 0.7 * pct + 0.3 * rec : 0.15 * rec;
  }

  /* ============ 解析器 ============ */

  function parseHN(data) {
    return data.hits.filter(function (h) { return h.title && h.title !== "…"; }).map(function (h) {
      var pts = h.points || 0, cmts = h.num_comments || 0;
      return {
        id: "hn-" + h.objectID,
        title: h.title,
        url: h.url || "https://news.ycombinator.com/item?id=" + h.objectID,
        source: "hn", lang: "en",
        time: Date.parse(h.created_at),
        excerpt: "",
        points: pts, comments: cmts,
        eng: pts + cmts * 2
      };
    });
  }

  function parseDevto(data) {
    return data.filter(function (a) {
      return a.title && a.url && a.flare_tag && a.flare_tag.name !== "discuss" && a.flare_tag.name !== "watercooler";
    }).map(function (a) {
      var r = a.public_reactions_count || 0, cmts = a.comments_count || 0;
      return {
        id: "devto-" + a.id,
        title: a.title,
        url: a.url,
        source: "devto", lang: "en",
        time: Date.parse(a.published_timestamp),
        excerpt: a.description || "",
        points: r, comments: cmts,
        eng: r + cmts * 2
      };
    });
  }

  function parseFeed(doc, sid) {
    return parseXmlFeed(doc, sid);
  }

  function parseXmlFeed(doc, sid) {
    var out = [];
    var items = doc.querySelectorAll("item, entry");
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var titleEl = it.querySelector("title");
      var title = titleEl ? titleEl.textContent.trim() : "";
      if (!title) continue;

      var link = "";
      var linkEl = it.querySelector("link[rel=\"alternate\"]") || it.querySelector("link");
      if (linkEl) {
        link = linkEl.getAttribute("href") || linkEl.textContent || "";
      }
      link = link.trim();
      if (!link) continue;

      var dateEl = it.querySelector("pubDate") || it.querySelector("published") || it.querySelector("updated");
      var time = dateEl ? Date.parse(dateEl.textContent) : NaN;
      if (isNaN(time)) time = Date.now();

      var descEl = it.querySelector("description") || it.querySelector("summary");
      var excerpt = descEl ? truncate(stripHtml(descEl.textContent), 150) : "";

      out.push({
        id: sid + "-" + i + "-" + djb2(link),
        title: title.replace(/\s+/g, " ").trim(),
        url: link,
        source: sid,
        lang: sourceById(sid) ? sourceById(sid).lang : "en",
        time: time,
        excerpt: excerpt,
        points: 0, comments: 0, eng: 0
      });
    }
    return out;
  }

  /* ============ 状态 ============ */

  var state = {
    all: [],
    sourceOk: {},
    lang: "all",
    cat: "all",
    src: "all",
    query: "",
    visible: PAGE_SIZE,
    lastSync: 0,
    tickerBuilt: false
  };

  function merge(list) {
    var map = {};
    list.forEach(function (a) {
      if (!a.url) return;
      var k = urlKey(a.url);
      var prev = map[k];
      if (!prev || heatOf(a, {}) > heatOf(prev, {})) map[k] = a;
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  function finalize(list) {
    var srcMax = {};
    SOURCES.forEach(function (s) { srcMax[s.id] = 0; });
    list.forEach(function (a) { if (a.eng > srcMax[a.source]) srcMax[a.source] = a.eng; });
    list.forEach(function (a) {
      a.heat = heatOf(a, srcMax[a.source]);
      a.cat = classify(a);
    });
    list.sort(function (a, b) { return b.time - a.time; });
    return list;
  }

  function loadAll() {
    var bars = document.getElementById("signal-bars");
    if (bars) bars.classList.remove("off");
    var snapP = loadSnapshot().catch(function () { snapshot = null; return null; });
    var jobs = SOURCES.map(function (s) {
      return s.load(snapP).then(function (items) {
        state.sourceOk[s.id] = { ok: true, n: items.length };
        return items;
      }).catch(function () {
        state.sourceOk[s.id] = { ok: false, n: 0 };
        return [];
      });
    });
    return Promise.all(jobs).then(function (groups) {
      state.all = finalize(merge(groups.reduce(function (acc, g) { return acc.concat(g); }, [])));
      if (readerIndex) {
        state.all.forEach(function (it) {
          var art = readerIndex[urlKey(it.url)];
          if (art && art.cover && !it.cover) it.cover = art.cover;
        });
      }
      state.lastSync = Date.now();
      renderSourceStatus();
      if (!state.tickerBuilt) buildTicker();
      state.visible = PAGE_SIZE;
      render();
      var up = document.getElementById("last-update");
      if (up) up.textContent = relTime(state.lastSync) + " 同步";
      return state.all.length;
    });
  }

  function refresh() {
    loadAll().catch(function () {});
  }

  /* ============ 筛选 ============ */

  function filtered() {
    var q = state.query.toLowerCase();
    return state.all.filter(function (a) {
      if (state.lang !== "all" && a.lang !== state.lang) return false;
      if (state.cat !== "all" && a.cat !== state.cat) return false;
      if (state.src !== "all" && a.source !== state.src) return false;
      if (q) {
        var src = sourceById(a.source);
        var hay = (a.title + " " + a.excerpt + " " + (src ? src.label : "")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function hotList(list) {
    var hot = list.slice().sort(function (a, b) { return b.heat - a.heat; }).slice(0, 5);
    return hot;
  }

  /* ============ 渲染：筛选栏 ============ */

  function buildFilters() {
    var langs = [["all", "全部"], ["zh", "中文"], ["en", "English"]];
    renderChips("lang-filters", "语言", langs, function (v) { return state.lang === v; }, function (v) { state.lang = v; rerender(); });

    var cats = [["all", "全部"]].concat(CATEGORIES.map(function (c) { return [c.id, c.zh]; }));
    renderChips("cat-filters", "分类", cats, function (v) { return state.cat === v; }, function (v) { state.cat = v; rerender(); }, function (id) { return "cat-" + id; });

    var srcs = [["all", "全部"]].concat(SOURCES.map(function (s) { return [s.id, s.label]; }));
    renderChips("src-filters", "来源", srcs, function (v) { return state.src === v; }, function (v) { state.src = v; rerender(); });
  }

  function renderChips(elId, label, items, isActive, onClick, dotCls) {
    var el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = "";
    var lab = document.createElement("span");
    lab.className = "filter-label";
    lab.textContent = label;
    el.appendChild(lab);
    items.forEach(function (item) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (isActive(item[0]) ? " active" : "");
      b.setAttribute("aria-pressed", isActive(item[0]) ? "true" : "false");
      if (dotCls && item[0] !== "all") {
        var d = document.createElement("span");
        d.className = "cdot " + dotCls(item[0]);
        b.appendChild(d);
      }
      b.appendChild(document.createTextNode(item[1]));
      b.addEventListener("click", function () { onClick(item[0]); });
      el.appendChild(b);
    });
  }

  function rerender() {
    state.visible = PAGE_SIZE;
    buildFilters();
    render();
  }

  /* ============ 渲染：头条 / 列表 / 热门 ============ */

  function badgeHTML(a) {
    var src = sourceById(a.source);
    var cat = catById(a.cat);
    var html = "";
    html += '<span class="badge badge-src">' + esc(src ? src.label : a.source) + "</span>";
    html += '<span class="badge badge-cat">' + esc(cat.zh) + "</span>";
    if (Date.now() - a.time < 2 * 3600000) html += '<span class="badge badge-new">新</span>';
    return html;
  }

  function heatBadge(a) {
    if (a.eng <= 0) return "";
    return '<span class="badge badge-heat">▲ ' + fmtNum(a.points) + "</span>";
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }

  function fmtNum(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  function renderHero(list) {
    var hero = document.getElementById("hero-card");
    if (!list.length) {
      hero.innerHTML = "";
      hero.style.display = "none";
      return;
    }
    hero.style.display = "";
    var a = list[0];
    var src = sourceById(a.source);
    var cat = catById(a.cat);
    hero.className = "hero cat-" + a.cat;
    hero.href = a.url;
    hero.innerHTML =
      '<div class="hero-eyebrow">' +
        '<span class="badge badge-live">LIVE</span>' +
        '<span class="badge badge-src">' + esc(src ? src.label : a.source) + "</span>" +
        '<span class="badge badge-cat">' + esc(cat.zh) + "</span>" +
      "</div>" +
      (a.cover ? '<div class="hero-cover"><img src="' + esc(a.cover) + '" alt="" loading="lazy" onerror="this.closest(\'.hero-cover\').remove()"></div>' : "") +
      "<h1 class=\"hero-title\">" + esc(a.title) + "</h1>" +
      (a.excerpt ? "<p class=\"hero-desc\">" + esc(a.excerpt) + "</p>" : "") +
      '<div class="hero-meta">' +
        '<span class="badge badge-src">' + relTime(a.time) + "</span>" +
        heatBadge(a) +
        (a.comments > 0 ? '<span class="badge badge-src">' + fmtNum(a.comments) + " 评论</span>" : "") +
      "</div>";
  }

  function renderHot(list) {
    var el = document.getElementById("hot-list");
    var note = document.getElementById("hot-note");
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '<li style="border:none;color:var(--text-faint);font-size:12.5px;padding:10px 2px">暂无数据</li>';
      return;
    }
    var hot = hotList(list);
    if (note) note.textContent = "按互动热度加权排序";
    el.innerHTML = hot.map(function (a, i) {
      var src = sourceById(a.source);
      return "<li><a href=\"" + esc(a.url) + "\" target=\"_blank\" rel=\"noopener\">" +
        '<span class="hot-rank">' + (i + 1) + "</span>" +
        '<span><span class="hot-title">' + esc(a.title) + "</span>" +
        '<span class="hot-sub">' + esc(src ? src.label : "") + " · " + relTime(a.time) + heatBadge(a) + "</span></span>" +
        "</a></li>";
    }).join("");
  }

  function coverHTML(a) {
    if (!a.cover) return "";
    return '<div class="card-cover"><img src="' + esc(a.cover) + '" alt="" loading="lazy" onerror="this.closest(\'.card-cover\').remove()"></div>';
  }

  function cardHTML(a) {
    var src = sourceById(a.source);
    var cat = catById(a.cat);
    var term = djb2(a.url);
    return (
      '<article class="card cat-' + a.cat + '">' +
        coverHTML(a) +
        '<div class="card-top">' + badgeHTML(a) +
          '<button class="read-toggle" type="button" data-url="' + esc(a.url) + '" aria-expanded="false">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' +
            "全文</button>" +
          '<button class="comment-toggle" type="button" data-term="' + term + '" aria-expanded="false">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
            "评论</button>" +
        "</div>" +
        '<a class="card-link" href="' + esc(a.url) + '" target="_blank" rel="noopener">' +
          "<h3 class=\"card-title\">" + esc(a.title) + "</h3>" +
          (a.excerpt ? "<p class=\"card-desc\">" + esc(a.excerpt) + "</p>" : "") +
        "</a>" +
        '<div class="card-foot">' +
          '<span class="meta-item">' + esc(src ? src.label : a.source) + "</span>" +
          '<span class="meta-sep">·</span>' +
          '<span class="meta-item">' + relTime(a.time) + "</span>" +
          (a.comments > 0 ? '<span class="meta-sep">·</span><span class="meta-item">' + fmtNum(a.comments) + " 评</span>" : "") +
          heatBadge(a) +
          '<a class="card-open" href="' + esc(a.url) + '" target="_blank" rel="noopener" title="在新标签页打开原文">原文 ↗</a>' +
        "</div>" +
        '<div class="card-full" hidden></div>' +
        '<div class="comment-box" data-box="' + term + '"></div>' +
      "</article>"
    );
  }

  function renderGrid(list) {
    var grid = document.getElementById("feed-grid");
    var titleEl = document.getElementById("feed-title");
    var countEl = document.getElementById("feed-count");
    var more = document.getElementById("load-more");
    if (!grid) return;

    if (!list.length) {
      grid.innerHTML = '<div class="empty-state">没有匹配的新闻<span class="hint">试试切换筛选或关键词</span></div>';
      if (more) more.hidden = true;
      if (titleEl) titleEl.textContent = "全部新闻";
      if (countEl) countEl.textContent = "0 条";
      return;
    }

    var show = list.slice(0, state.visible);
    grid.innerHTML = show.map(cardHTML).join("");

    if (titleEl) titleEl.textContent = filterTitle();
    if (countEl) countEl.textContent = list.length + " 条";
    if (more) more.hidden = show.length >= list.length;
  }

  function filterTitle() {
    var parts = [];
    if (state.cat !== "all") parts.push(catById(state.cat).zh);
    if (state.lang !== "all") parts.push(state.lang === "zh" ? "中文" : "English");
    if (state.src !== "all") parts.push(sourceById(state.src).label);
    return (parts.length ? parts.join(" · ") : "全部新闻");
  }

  function render() {
    var list = filtered();
    renderHero(list);
    renderHot(list);
    renderGrid(list);
  }

  /* ============ Ticker ============ */

  function buildTicker() {
    var track = document.getElementById("ticker-track");
    if (!track || !state.all.length) return;
    state.tickerBuilt = true;
    var items = state.all.slice(0, 12);
    var html = items.map(function (a) {
      var src = sourceById(a.source);
      return '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">' +
        '<span class="t-src">' + esc(src ? src.badge : "") + "</span>" +
        "<span>" + esc(a.title) + "</span>" +
        '<span class="t-time">' + relTime(a.time) + "</span>" +
        "</a>";
    }).join("") ;
    track.innerHTML = '<span class="ticker-group" aria-hidden="true">' + html + "</span>" + '<span class="ticker-group" aria-hidden="true">' + html + "</span>";
  }

  /* ============ 评论（Giscus） ============ */

  function giscusTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t === "auto" || t === "mac") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return t === "paper" ? "light" : "dark";
  }

  function mountGiscus(box, term) {
    if (!GISCUS.repo || !GISCUS.repoId || !GISCUS.categoryId) {
      box.innerHTML = '<div class="comment-note">评论系统待配置。请安装 Giscus 并填写 app.js 中的 GISCUS 配置后启用讨论。</div>';
      return;
    }
    box.innerHTML = "";
    var s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-repo", GISCUS.repo);
    s.setAttribute("data-repo-id", GISCUS.repoId);
    s.setAttribute("data-category", GISCUS.category);
    s.setAttribute("data-category-id", GISCUS.categoryId);
    s.setAttribute("data-mapping", "specific");
    s.setAttribute("data-term", term);
    s.setAttribute("data-strict", "0");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-input-position", "top");
    s.setAttribute("data-theme", giscusTheme());
    s.setAttribute("data-lang", GISCUS.lang || "zh-CN");
    s.setAttribute("data-loading", "lazy");
    box.appendChild(s);
  }

  function setupComments() {
    var grid = document.getElementById("feed-grid");
    if (!grid) return;
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".comment-toggle");
      if (!btn) return;
      var term = btn.getAttribute("data-term");
      var card = btn.closest(".card");
      var box = card.querySelector(".comment-box");
      var open = box.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && !box.dataset.mounted) {
        box.dataset.mounted = "1";
        mountGiscus(box, "ai-news-" + term);
      }
    });
    document.addEventListener("signal:theme", function () {
      document.querySelectorAll("iframe.giscus-frame").forEach(function (f) {
        f.contentWindow.postMessage({ giscus: { setTheme: giscusTheme() } }, "https://giscus.app");
      });
    });
  }

  /* ============ 站内阅读（读模式） ============ */

  function findEntry(url) {
    var k = urlKey(url);
    for (var i = 0; i < state.all.length; i++) {
      if (urlKey(state.all[i].url) === k) return state.all[i];
    }
    return null;
  }

  function openReader(url) {
    var art = readerIndex ? readerIndex[urlKey(url)] : null;
    if (!art || !art.content) {
      window.open(url, "_blank", "noopener");
      return;
    }
    var overlay = document.getElementById("reader-overlay");
    var body = document.getElementById("reader-body");
    var titleEl = document.getElementById("reader-title");
    var srcEl = document.getElementById("reader-src");
    var catEl = document.getElementById("reader-cat");
    var metaEl = document.getElementById("reader-meta");
    var openEl = document.getElementById("reader-open");
    var footLink = document.getElementById("reader-foot-link");
    if (!overlay) return;

    var entry = findEntry(url);
    var src = entry ? sourceById(entry.source) : (art ? sourceById(art.source) : null);
    var cat = entry ? entry.cat : classify(art);
    var t = entry ? entry.time : Date.now();

    if (titleEl) titleEl.textContent = art.title || "";
    if (srcEl) srcEl.textContent = src ? src.label : (art.source || "");
    if (catEl) catEl.textContent = catById(cat).zh;
    if (metaEl) metaEl.innerHTML =
      '<span>' + esc(src ? src.label : (art.source || "")) + "</span>" +
      '<span class="meta-sep">·</span>' +
      "<span>" + relTime(t) + "</span>";
    if (openEl) openEl.href = url;
    if (footLink) footLink.href = url;
    if (body) body.innerHTML = art.content;
    overlay.hidden = false;
    document.body.classList.add("reader-open");
    var closeBtn = document.getElementById("reader-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeReader() {
    var overlay = document.getElementById("reader-overlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("reader-open");
    var closeBtn = document.getElementById("reader-close");
    if (closeBtn) closeBtn.blur();
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia("(max-width: 700px)").matches;
  }

  function collapseCard(card) {
    var full = card.querySelector(".card-full");
    var btn = card.querySelector(".read-toggle");
    if (!full) return;
    card.classList.remove("expanded");
    full.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function expandCard(card, url) {
    var full = card.querySelector(".card-full");
    var btn = card.querySelector(".read-toggle");
    if (!full) return;
    if (card.classList.contains("expanded")) {
      collapseCard(card);
      return;
    }
    if (card.dataset.loaded !== "1") {
      var art = readerIndex ? readerIndex[urlKey(url)] : null;
      if (art && art.content) {
        full.innerHTML = art.content;
      } else {
        full.innerHTML = '<div class="card-full-note">暂无全文快照' +
          '<a href="' + esc(url) + '" target="_blank" rel="noopener">前往原文 ↗</a></div>';
      }
      card.dataset.loaded = "1";
    }
    card.classList.add("expanded");
    full.hidden = false;
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  /* 点击卡片：桌面端 → 浮动窗口读全文；手机端 → 内联展开 */
  function handleArticleClick(card, url) {
    if (isMobile()) expandCard(card, url);
    else openReader(url);
  }

  function setupReader() {
    document.addEventListener("click", function (e) {
      var hero = e.target.closest("#hero-card");
      var readBtn = e.target.closest(".read-toggle");
      var link = e.target.closest(".card-link");
      if (hero) { e.preventDefault(); openReader(hero.getAttribute("href")); return; }
      if (readBtn) { e.preventDefault(); handleArticleClick(readBtn.closest(".card"), readBtn.getAttribute("data-url")); return; }
      if (link) { e.preventDefault(); handleArticleClick(link.closest(".card"), link.getAttribute("href")); return; }
    });
    /* 手机端：点击任意位置折叠已展开的卡片 */
    document.addEventListener("click", function (e) {
      if (!isMobile()) return;
      var expanded = document.querySelector(".card.expanded");
      if (!expanded || expanded.contains(e.target)) return;
      collapseCard(expanded);
    });
    var overlay = document.getElementById("reader-overlay");
    if (!overlay) return;
    var closeBtn = document.getElementById("reader-close");
    if (closeBtn) closeBtn.addEventListener("click", closeReader);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) closeReader();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeReader();
    });
  }

  /* ============ 来源状态 / 骨架 ============ */

  function renderSourceStatus() {
    var el = document.getElementById("source-status");
    if (!el) return;
    el.innerHTML = SOURCES.map(function (s) {
      var st = state.sourceOk[s.id] || { ok: false, n: 0 };
      return '<span class="src-chip ' + (st.ok ? "ok" : "bad") + '">' + esc(s.label) + ' <span class="s-count">' + (st.ok ? st.n + " 条" : "不可用") + "</span></span>";
    }).join("");
  }

  function renderSkeleton() {
    var grid = document.getElementById("feed-grid");
    if (!grid) return;
    var html = "";
    for (var i = 0; i < 6; i++) {
      html += '<div class="skeleton"><div class="sk-line tall"></div><div class="sk-line short"></div><div class="sk-line"></div><div class="sk-line"></div></div>';
    }
    grid.innerHTML = html;
  }

  /* ============ 事件与自动刷新 ============ */

  function init() {
    buildFilters();
    renderSkeleton();
    renderSourceStatus();
    setupComments();
    setupReader();
    loadReaderIndex();

    document.addEventListener("signal:refresh", function () { refresh(); });

    var search = document.getElementById("search-input");
    if (search) {
      var timer = null;
      search.addEventListener("input", function () {
        clearTimeout(timer);
        var v = search.value;
        timer = setTimeout(function () {
          state.query = v.trim();
          rerender();
        }, 200);
      });
    }

    var more = document.getElementById("load-more");
    if (more) more.addEventListener("click", function () {
      state.visible += PAGE_STEP;
      renderGrid(filtered());
    });

    window.addEventListener("focus", function () {
      if (state.all.length && Date.now() - state.lastSync > STALE_MS) refresh();
    });

    setInterval(refresh, REFRESH_MS);

    refresh();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
