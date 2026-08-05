/* SIGNAL — 主题切换 / 导航 / 头部交互 / 中英双语 */

(function () {
  "use strict";

  var THEME_KEY = "signal-theme";
  var THEMES = [
    { id: "paper",    label: "晨报",   swatch: "linear-gradient(135deg,#f5f7fa 50%,#b06f08 50%)" },
    { id: "midnight", label: "午夜",   swatch: "linear-gradient(135deg,#0b0c0e 50%,#4fd8ff 50%)" },
    { id: "aurora",   label: "极光",   swatch: "linear-gradient(135deg,#181730 50%,#c792ea 50%)" },
    { id: "ink",      label: "墨绿",   swatch: "linear-gradient(135deg,#12211b 50%,#7fd6a8 50%)" },
    { id: "mac",      label: "Mac 风格", swatch: "linear-gradient(135deg,#f5f5f7 50%,#0071e3 50%)" },
    { id: "suckless", label: "极简",    swatch: "linear-gradient(135deg,#ffffff 50%,#000000 50%)" },
    { id: "auto",     label: "跟随系统", swatch: "conic-gradient(#ffffff,#000000,#ffffff)" }
  ];

  /* ============ 中英双语（i18n） ============ */

  var LANG_KEY = "signal-lang";

  var I18N = {
    /* 通用 / 头部 */
    "跳到正文": { zh: "跳到正文", en: "Skip to content" },
    "实时新闻聚合 · 中英双语": { zh: "实时新闻聚合 · 中英双语", en: "Real-time news · CN/EN" },
    "新闻": { zh: "新闻", en: "News" },
    "网站导航": { zh: "网站导航", en: "Directory" },
    "发展历史": { zh: "发展历史", en: "History" },
    "主导航": { zh: "主导航", en: "Main navigation" },
    "刷新": { zh: "刷新", en: "Refresh" },
    "主题": { zh: "主题", en: "Theme" },
    "晨报": { zh: "晨报", en: "Morning" },
    "午夜": { zh: "午夜", en: "Midnight" },
    "极光": { zh: "极光", en: "Aurora" },
    "墨绿": { zh: "墨绿", en: "Ink" },
    "极简": { zh: "极简", en: "Suckless" },
    "Mac 风格": { zh: "Mac 风格", en: "Mac" },
    "跟随系统": { zh: "跟随系统", en: "System" },
    "返回顶部": { zh: "返回顶部", en: "Back to top" },
    /* 信号流 */
    "信号流": { zh: "信号流", en: "Signal feed" },
    /* 搜索 */
    "搜索标题 / 来源…": { zh: "搜索标题 / 来源…", en: "Search title / source…" },
    "搜索新闻": { zh: "搜索新闻", en: "Search news" },
    /* 筛选 */
    "语言": { zh: "语言", en: "Lang" },
    "分类": { zh: "分类", en: "Category" },
    "来源": { zh: "来源", en: "Source" },
    "全部": { zh: "全部", en: "All" },
    "中文": { zh: "中文", en: "Chinese" },
    /* 时间 */
    "刚刚": { zh: "刚刚", en: "just now" },
    "分钟前": { zh: "分钟前", en: "min ago" },
    "小时前": { zh: "小时前", en: "h ago" },
    "天前": { zh: "天前", en: "d ago" },
    " 同步": { zh: " 同步", en: " synced" },
    "尚未同步": { zh: "尚未同步", en: "Not synced yet" },
    /* 头条 / 热门 */
    "热门 TOP 5": { zh: "热门 TOP 5", en: "Hot TOP 5" },
    "信号强度": { zh: "信号强度", en: "Signal strength" },
    "按互动热度加权排序": { zh: "按互动热度加权排序", en: "Sorted by engagement heat" },
    "暂无数据": { zh: "暂无数据", en: "No data" },
    /* 列表 */
    "全部新闻": { zh: "全部新闻", en: "All news" },
    "没有匹配的新闻": { zh: "没有匹配的新闻", en: "No matching news" },
    "试试切换筛选或关键词": { zh: "试试切换筛选或关键词", en: "Try other filters or keywords" },
    "加载更多": { zh: "加载更多", en: "Load more" },
    /* 卡片 */
    "全文": { zh: "全文", en: "Full" },
    "评论": { zh: "评论", en: "Comments" },
    "原文 ↗": { zh: "原文 ↗", en: "Original ↗" },
    "在新标签页打开原文": { zh: "在新标签页打开原文", en: "Open original in new tab" },
    "暂无全文快照": { zh: "暂无全文快照", en: "No full-text snapshot" },
    "前往原文 ↗": { zh: "前往原文 ↗", en: "Go to original ↗" },
    /* 阅读模式 */
    "站内阅读": { zh: "站内阅读", en: "On-site reading" },
    "查看原文": { zh: "查看原文", en: "View original" },
    "关闭": { zh: "关闭", en: "Close" },
    "打开原文": { zh: "打开原文", en: "Open original" },
    "内容由 AI SIGNAL 于 15 分钟快照周期内抓取，版权归原作者所有 · 以原文为准": {
      zh: "内容由 AI SIGNAL 于 15 分钟快照周期内抓取，版权归原作者所有 · 以原文为准",
      en: "Content snapshotted by AI SIGNAL within a 15-min cycle; rights belong to original authors · Original is authoritative"
    },
    /* 来源状态 */
    "不可用": { zh: "不可用", en: "unavailable" },
    "评论系统待配置。请安装 Giscus 并填写 app.js 中的 GISCUS 配置后启用讨论。": {
      zh: "评论系统待配置。请安装 Giscus 并填写 app.js 中的 GISCUS 配置后启用讨论。",
      en: "Comments not configured. Install Giscus and fill in the GISCUS config in app.js to enable discussions."
    },
    /* 首页页脚 */
    "关于": { zh: "关于", en: "About" },
    "数据源状态": { zh: "数据源状态", en: "Sources" },
    "导航": { zh: "导航", en: "Nav" },
    "AI 网站导航": { zh: "AI 网站导航", en: "AI Directory" },
    "AI 发展历史": { zh: "AI 发展历史", en: "AI History" },
    "AI SIGNAL 是一个纯前端实时新闻聚合器，无服务器、无追踪。默认每 5 分钟自动刷新，切回页面时立即同步。所有内容版权归原网站所有，本站仅聚合链接与摘要。": {
      zh: "AI SIGNAL 是一个纯前端实时新闻聚合器，无服务器、无追踪。默认每 5 分钟自动刷新，切回页面时立即同步。所有内容版权归原网站所有，本站仅聚合链接与摘要。",
      en: "AI SIGNAL is a serverless, track-free real-time news aggregator. Auto-refreshes every 5 minutes and syncs instantly on tab focus. All content belongs to the original sites; we only aggregate links and summaries."
    },
    /* 导航页 */
    "精选与 AI 相关的重要站点，按用途分类。点击即在新标签打开。": {
      zh: "精选与 AI 相关的重要站点，按用途分类。点击即在新标签打开。",
      en: "Hand-picked AI sites, grouped by purpose. Click to open in a new tab."
    },
    "对话与模型": { zh: "对话与模型", en: "Chat & Models" },
    "开源与社区": { zh: "开源与社区", en: "Open Source" },
    "资讯与社区": { zh: "资讯与社区", en: "News & Community" },
    "研究动态": { zh: "研究动态", en: "Research" },
    "工具": { zh: "工具", en: "Tools" },
    "OpenAI 旗舰对话助手": { zh: "OpenAI 旗舰对话助手", en: "OpenAI flagship assistant" },
    "Anthropic 的 Claude AI": { zh: "Anthropic 的 Claude AI", en: "Claude AI by Anthropic" },
    "Google 多模态模型": { zh: "Google 多模态模型", en: "Google multimodal model" },
    "深度求索对话助手": { zh: "深度求索对话助手", en: "DeepSeek assistant" },
    "月之暗面长上下文助手": { zh: "月之暗面长上下文助手", en: "Moonshot long-context assistant" },
    "阿里通义千问": { zh: "阿里通义千问", en: "Alibaba Qwen" },
    "模型与数据集中心": { zh: "模型与数据集中心", en: "Models & datasets hub" },
    "AI 演示应用广场": { zh: "AI 演示应用广场", en: "AI demo apps plaza" },
    "开源代码与项目": { zh: "开源代码与项目", en: "Open-source code & projects" },
    "论文与代码对照": { zh: "论文与代码对照", en: "Papers & code" },
    "预印本论文库": { zh: "预印本论文库", en: "Preprint archive" },
    "本地运行开源模型": { zh: "本地运行开源模型", en: "Run open models locally" },
    "极客社区头条": { zh: "极客社区头条", en: "Hacker community front page" },
    "Reddit AI 版块": { zh: "Reddit AI 版块", en: "Reddit AI community" },
    "开发者博客社区": { zh: "开发者博客社区", en: "Developer blogging community" },
    "创业与科技新闻": { zh: "创业与科技新闻", en: "Startups & tech news" },
    "消费科技 AI 频道": { zh: "消费科技 AI 频道", en: "Consumer tech AI channel" },
    "中文 AI 前沿媒体": { zh: "中文 AI 前沿媒体", en: "Chinese AI front-line media" },
    "人工智能垂直媒体": { zh: "人工智能垂直媒体", en: "AI vertical media" },
    "科技商业资讯": { zh: "科技商业资讯", en: "Tech & business news" },
    "OpenAI 官方博客": { zh: "OpenAI 官方博客", en: "OpenAI official blog" },
    "Google DeepMind 研究": { zh: "Google DeepMind 研究", en: "Google DeepMind research" },
    "Anthropic 官方动态": { zh: "Anthropic 官方动态", en: "Anthropic official news" },
    "模型调用量排行": { zh: "模型调用量排行", en: "Model usage rankings" },
    "北京智源 AI 研究院": { zh: "北京智源 AI 研究院", en: "Beijing Academy of AI (BAAI)" },
    "多模型聚合平台": { zh: "多模型聚合平台", en: "Multi-model platform" },
    "本地模型桌面工具": { zh: "本地模型桌面工具", en: "Local model desktop app" },
    "提示词灵感库": { zh: "提示词灵感库", en: "Prompt inspiration library" },
    "收录站点均为公开资源，跳转行为发生在原网站": {
      zh: "收录站点均为公开资源，跳转行为发生在原网站",
      en: "Listed sites are public resources; navigation happens on the original sites"
    },
    /* 历史页 */
    "从 1943 年的神经元模型到今天的大模型竞赛，一条浓缩的人工智能发展时间线。": {
      zh: "从 1943 年的神经元模型到今天的大模型竞赛，一条浓缩的人工智能发展时间线。",
      en: "From the 1943 neuron model to today's LLM race — a condensed timeline of artificial intelligence."
    },
    "按公开资料整理，聚焦关键里程碑": {
      zh: "按公开资料整理，聚焦关键里程碑",
      en: "Compiled from public sources, focused on key milestones"
    },
    "阶段概览": { zh: "阶段概览", en: "Overview" },
    "关键节点": { zh: "关键节点", en: "Key milestones" },
    "返回全部时间线": { zh: "返回全部时间线", en: "Back to full timeline" },
    "里程碑": { zh: "里程碑", en: "Milestone" }
  };

  function storedLang() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }

  function currentLang() {
    var l = storedLang();
    return l === "zh" || l === "en" ? l : "zh";
  }

  window.SIGNAL_LANG = currentLang();

  function tr(s) {
    var e = I18N[s];
    if (!e) return s;
    return window.SIGNAL_LANG === "en" ? (e.en || e.zh) : e.zh;
  }
  window.t = tr;

  function applyI18n() {
    window.SIGNAL_LANG = currentLang();
    document.documentElement.lang = window.SIGNAL_LANG === "en" ? "en" : "zh-CN";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = tr(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", tr(el.getAttribute("data-i18n-ph")));
    });
    var lb = document.getElementById("lang-btn");
    if (lb) lb.textContent = window.SIGNAL_LANG === "en" ? "中文" : "EN";
    document.dispatchEvent(new CustomEvent("signal:lang", { detail: { lang: window.SIGNAL_LANG } }));
  }

  function setLang(l) {
    if (l !== "zh" && l !== "en") l = "zh";
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    applyI18n();
  }

  function buildLangBtn() {
    var mount = document.getElementById("theme-mount");
    if (!mount) return;
    var btn = document.createElement("button");
    btn.className = "header-btn";
    btn.type = "button";
    btn.id = "lang-btn";
    btn.setAttribute("aria-label", "切换语言 / Switch language");
    btn.title = window.SIGNAL_LANG === "en" ? "切换到中文" : "Switch to English";
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"/><path d="M9 3v2c0 4.5-3 7-5.5 9"/><path d="M5 9c3 1.5 5.5 4 6.5 7.5"/><path d="M13 19h7"/><path d="M16 15v4c0 3-1.5 4.5-3.5 5"/><path d="M14 11h6"/><path d="M17 8v3"/></svg>' +
      '<span class="btn-text">' + (window.SIGNAL_LANG === "en" ? "中文" : "EN") + "</span>";
    btn.addEventListener("click", function () {
      setLang(window.SIGNAL_LANG === "en" ? "zh" : "en");
    });
    mount.parentNode.insertBefore(btn, mount);
  }

  var mql = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function saveTheme(id) {
    try { localStorage.setItem(THEME_KEY, id); } catch (e) { /* noop */ }
  }

  function applyTheme(id) {
    document.documentElement.setAttribute("data-theme", id);
    document.dispatchEvent(new CustomEvent("signal:theme", { detail: { theme: id } }));
  }

  function currentTheme() {
    var t = storedTheme();
    return THEMES.some(function (x) { return x.id === t; }) ? t : "mac";
  }

  function resolvedTheme() {
    var t = currentTheme();
    if (t === "auto" || t === "mac") return mql && mql.matches ? "dark" : "light";
    return t === "paper" ? "light" : "dark";
  }

  /* 主题下拉菜单 */
  function buildMenu(container) {
    var wrap = document.createElement("div");
    wrap.className = "theme-menu";

    var btn = document.createElement("button");
    btn.className = "header-btn";
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.id = "theme-btn";
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' +
      '<span class="btn-text">主题</span>';
    wrap.appendChild(btn);

    var panel = document.createElement("div");
    panel.className = "theme-panel";
    panel.setAttribute("role", "menu");
    panel.setAttribute("aria-labelledby", "theme-btn");

    THEMES.forEach(function (t) {
      var opt = document.createElement("button");
      opt.type = "button";
      opt.className = "theme-opt";
      opt.setAttribute("role", "menuitem");
      opt.setAttribute("data-theme-opt", t.id);
      opt.innerHTML =
        '<span class="theme-swatch" style="background:' + t.swatch + '"></span>' +
        '<span data-i18n="' + t.label + '">' + tr(t.label) + "</span>" +
        '<span class="check" hidden>&#10003;</span>';
      opt.addEventListener("click", function () {
        saveTheme(t.id);
        applyTheme(t.id);
        closeMenu();
        paint();
      });
      panel.appendChild(opt);
    });

    wrap.appendChild(panel);
    container.appendChild(wrap);

    function openMenu() { panel.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    function closeMenu() { panel.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      panel.classList.contains("open") ? closeMenu() : openMenu();
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  function paint() {
    var cur = currentTheme();
    var opts = document.querySelectorAll("[data-theme-opt]");
    opts.forEach(function (o) {
      var active = o.getAttribute("data-theme-opt") === cur;
      o.classList.toggle("active", active);
      var check = o.querySelector(".check");
      if (check) check.hidden = !active;
    });
    document.querySelectorAll("[data-giscus-theme]").forEach(function (el) {
      el.setAttribute("data-giscus-theme", resolvedTheme() === "dark" ? "dark" : "light");
    });
  }

  /* 自动主题跟随系统变化 */
  if (mql) {
    mql.addEventListener("change", function () {
      if (currentTheme() === "auto") applyTheme("auto");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(currentTheme());
    buildLangBtn();
    applyI18n();

    var mount = document.getElementById("theme-mount");
    if (mount) {
      buildMenu(mount);
      paint();
    }

    /* 当前页导航高亮 */
    var page = document.body.getAttribute("data-page");
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      if (a.getAttribute("data-page") === page) a.classList.add("active");
    });

    /* 刷新按钮 */
    var refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () {
        document.dispatchEvent(new CustomEvent("signal:refresh"));
      });
    }

    /* 一键返回顶部 */
    var topBtn = document.createElement("button");
    topBtn.type = "button";
    topBtn.className = "back-top";
    topBtn.setAttribute("aria-label", "返回顶部");
    topBtn.setAttribute("aria-hidden", "true");
    topBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
    document.body.appendChild(topBtn);
    var topTimer = null;
    function syncTop() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var show = y > 480;
      topBtn.classList.toggle("show", show);
      topBtn.setAttribute("aria-hidden", show ? "false" : "true");
    }
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", function () {
      if (topTimer) return;
      topTimer = setTimeout(function () {
        topTimer = null;
        syncTop();
      }, 80);
    }, { passive: true });
    syncTop();
  });
})();
