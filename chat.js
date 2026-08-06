/* SIGNAL 对话页 — DeepSeek 风格，纯前端
 * 服务：free（Pollinations.ai 匿名，无需 Key）/ deepseek（直连官方 api.deepseek.com）
 * 存储：signal-chat-settings / signal-chat-msgs（仅本机浏览器）；主题跟随站点（signal-theme）
 * 说明：仅维护界面/会话/流式请求，不经过任何自有服务器。
 */

(function () {
  "use strict";

  var LS_MSGS = "signal-chat-msgs";
  var LS_SETTINGS = "signal-chat-settings";
  var LS_CURRENT = "signal-chat-current";
  var API_DS = "https://api.deepseek.com/chat/completions";
  var API_FREE = "https://text.pollinations.ai/openai";
  var FREE_COOLDOWN_MS = 15000;
  var MAX_CONVS = 40;
  var MAX_MSGS = 120;

  var MODELS = {
    "deepseek-v4-flash": { service: "deepseek", apiModel: "deepseek-chat",    reasoner: false, label: "DeepSeek-V4 Flash" },
    "deepseek-v4-pro":   { service: "deepseek", apiModel: "deepseek-reasoner", reasoner: true,  label: "DeepSeek-V4 Pro" },
    "openai":      { service: "free", apiModel: "openai",      label: "Pollinations · OpenAI" },
    "openai-fast": { service: "free", apiModel: "openai-fast", label: "Pollinations · OpenAI Fast" }
  };

  var ICON_CHAT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var ICON_TRASH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
  var ICON_SEND =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  var ICON_STOP =
    '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

  var SUGGESTIONS = [
    { icon: "bubble", text: "用一句话解释什么是大语言模型？" },
    { icon: "code", text: "帮我写一个 Python 快速排序" },
    { icon: "news", text: "今天 AI 圈有什么值得关注的新进展？" },
    { icon: "spark", text: "用简单比喻解释 Transformer 的注意力机制" }
  ];

  var SUG_ICONS = {
    bubble: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6"/><path d="m16 6 6 6-6 6"/></svg>',
    news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V8"/><path d="M18 14h-8"/><path d="M14 18h-4"/><path d="M18 6h-8"/><path d="M14 10h-4"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.6L19.4 9l-5.6 1.8L12 16.4l-1.8-5.6L4.6 9l5.6-1.4L12 2zM5 15l.9 2.6L8.5 18l-2.6.9L5 21l-.9-2.1L1.5 18l2.6-.4L5 15zM19 13l.7 1.9 1.9.7-1.9.7L19 18l-.7-1.7-1.9-.7 1.9-.7L19 13z"/></svg>'
  };

  var els = {};
  var state = {
    convs: [],
    current: null,
    settings: { service: "free", dsKey: "" },
    modelId: null,
    activeStreams: {},
    cooldowns: {},
    pendingSend: null
  };

  function $(id) { return document.getElementById(id); }
  function tr(s) { return window.t ? window.t(s) : s; }

  /* ---------- 本地存储 ---------- */

  function loadSettings() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_SETTINGS) || "null");
      if (s && (s.service === "free" || s.service === "deepseek")) return s;
    } catch (e) {}
    return { service: "free", dsKey: "" };
  }

  function saveSettings() {
    try { localStorage.setItem(LS_SETTINGS, JSON.stringify(state.settings)); } catch (e) {}
  }

  function loadConvs() {
    try {
      var a = JSON.parse(localStorage.getItem(LS_MSGS) || "null");
      if (Array.isArray(a)) return a;
    } catch (e) {}
    return [];
  }

  function saveConvs() {
    var keep = state.convs.slice(0, MAX_CONVS);
    keep.forEach(function (c) {
      if (c.msgs && c.msgs.length > MAX_MSGS) c.msgs = c.msgs.slice(-MAX_MSGS);
    });
    try { localStorage.setItem(LS_MSGS, JSON.stringify(keep)); } catch (e) {}
  }

  function loadCurrent() {
    try { return localStorage.getItem(LS_CURRENT); } catch (e) { return null; }
  }

  function saveCurrent() {
    try {
      if (state.current) localStorage.setItem(LS_CURRENT, state.current);
      else localStorage.removeItem(LS_CURRENT);
    } catch (e) {}
  }

  /* ---------- 模型 / 会话 ---------- */

  function defaultModelFor(service) {
    return service === "deepseek" ? "deepseek-v4-flash" : "openai";
  }

  function findConv(id) {
    for (var i = 0; i < state.convs.length; i++) if (state.convs[i].id === id) return state.convs[i];
    return null;
  }

  function newId() {
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function createConv() {
    var model = MODELS[state.modelId] ? state.modelId : defaultModelFor(state.settings.service);
    var conv = {
      id: newId(),
      title: "新对话",
      model: model,
      ts: Date.now(),
      msgs: []
    };
    state.convs.unshift(conv);
    state.current = conv.id;
    saveConvs();
    saveCurrent();
    return conv;
  }

  function currentConv() {
    return state.current ? findConv(state.current) : null;
  }

  function activeForCurrent() {
    var c = currentConv();
    return !!(c && state.activeStreams[c.id]);
  }

  /* ---------- 渲染 ---------- */

  function buildSuggest() {
    var grid = els.suggest;
    grid.innerHTML = "";
    SUGGESTIONS.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ds-suggest-card";
      b.innerHTML = '<span class="ds-sug-icon">' + (SUG_ICONS[s.icon] || "") + "</span>" +
        '<span class="ds-sug-text"></span>';
      b.querySelector(".ds-sug-text").textContent = s.text;
      b.addEventListener("click", function () {
        els.input.value = s.text;
        autoGrow();
        els.input.focus();
      });
      grid.appendChild(b);
    });
  }

  function renderSidebar() {
    var q = (els.searchInput.value || "").trim().toLowerCase();
    els.convList.innerHTML = "";
    var filtered = state.convs.filter(function (c) {
      return !q || (c.title || "").toLowerCase().indexOf(q) >= 0;
    });
    if (!filtered.length) {
      var em = document.createElement("div");
      em.className = "ds-conv-empty";
      em.textContent = tr("暂无对话");
      els.convList.appendChild(em);
      return;
    }
    filtered.forEach(function (c) { els.convList.appendChild(buildConvItem(c)); });
  }

  function buildConvItem(c) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "ds-conv-item" + (c.id === state.current ? " active" : "");
    b.innerHTML =
      '<span class="ds-conv-ico">' + ICON_CHAT + "</span>" +
      '<span class="ds-conv-title"></span>' +
      '<span class="ds-conv-del" title="删除">' + ICON_TRASH + "</span>";
    b.querySelector(".ds-conv-title").textContent = c.title || "新对话";
    b.addEventListener("click", function (e) {
      if (e.target.closest(".ds-conv-del")) return;
      selectConv(c.id);
    });
    b.querySelector(".ds-conv-del").addEventListener("click", function (e) {
      e.stopPropagation();
      delConv(c.id);
    });
    return b;
  }

  function selectConv(id) {
    if (!findConv(id)) return;
    state.current = id;
    saveCurrent();
    renderSidebar();
    renderMessages();
    syncModelUI();
    syncToolButtons();
    closeDrawer();
  }

  function delConv(id) {
    var st = state.activeStreams[id];
    if (st) { st.aborted = true; try { st.controller.abort(); } catch (e) {} delete state.activeStreams[id]; }
    state.convs = state.convs.filter(function (c) { return c.id !== id; });
    if (state.current === id) state.current = state.convs.length ? state.convs[0].id : null;
    saveConvs();
    saveCurrent();
    renderSidebar();
    renderMessages();
    syncModelUI();
    syncToolButtons();
    syncSendButton();
  }

  function renderMessages() {
    var conv = currentConv();
    els.messages.innerHTML = "";
    if (!conv || !conv.msgs.length) {
      els.empty.classList.remove("hidden");
      return;
    }
    els.empty.classList.add("hidden");
    conv.msgs.forEach(function (m) { els.messages.appendChild(buildMsgEl(m)); });
    scrollToBottom(true);
  }

  function buildMsgEl(m) {
    var el = document.createElement("div");
    el.className = "ds-msg " + m.role;
    var inner = document.createElement("div");
    inner.className = "ds-msg-inner";
    if (m.role === "assistant") {
      var meta = document.createElement("span");
      meta.className = "ds-msg-model";
      meta.textContent = m.model || "";
      el.appendChild(meta);
      inner.innerHTML = m.content ? renderMarkdown(m.content) : "";
      if (m.error) el.classList.add("error");
    } else {
      inner.textContent = m.content;
    }
    el.appendChild(inner);
    el.appendChild(copyBtn(m.content));
    return el;
  }

  function copyBtn(text) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "ds-copy";
    b.textContent = tr("复制");
    b.addEventListener("click", function () {
      copyText(text || "");
      toast(tr("已复制"));
    });
    return b;
  }

  function syncModelUI() {
    var conv = currentConv();
    var id = conv ? conv.model : (MODELS[state.modelId] ? state.modelId : defaultModelFor(state.settings.service));
    var model = MODELS[id] || MODELS[defaultModelFor(state.settings.service)];
    els.modelName.textContent = model.label;
    els.modeBadge.textContent = model.service === "deepseek" ? "DeepSeek API" : tr("免费试用");
    els.modeBadge.title = model.service === "deepseek" ? "api.deepseek.com" : "text.pollinations.ai";

    var btns = els.modelMenu.querySelectorAll("[data-model]");
    btns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-model") === id);
    });
  }

  /* ---------- 轻量语法高亮（零依赖，颜色用主题 --tok-* tokens） ---------- */

  var HL_LANGS = {
    py: "python", js: "js", jsx: "js", ts: "js", tsx: "js", json: "json",
    sh: "sh", bash: "sh", zsh: "sh", shell: "sh", rb: "ruby", ruby: "ruby",
    sql: "sql", css: "css", html: "html", xml: "html", yml: "yaml", yaml: "yaml",
    go: "go", java: "java", rust: "rust", c: "c", cpp: "cpp", csharp: "csharp",
    php: "php", swift: "swift", kt: "kt", kotlin: "kt", md: "md", markdown: "md"
  };

  var HL_KEYWORDS = {
    python: "def return if elif else for while in not and or import from as class try except finally with lambda pass break continue global nonlocal yield raise assert is del async await None True False".split(" "),
    js: "const let var function return if else for while do switch case break continue new delete typeof instanceof in of class extends super this async await try catch finally throw import export from default null undefined true false void yield static get set".split(" "),
    json: "true false null".split(" "),
    sh: "if then else elif fi for while do done case esac function export return in select until".split(" "),
    ruby: "def end if elsif else unless while until for in do return class module require puts case when begin rescue ensure yield true false nil".split(" "),
    sql: "select from where insert update delete create table join on group order by as into values set and or not null primary key index drop alter add constraint foreign references having distinct union left right inner outer cross".split(" "),
    go: "func var const if else for range return import package type struct interface map chan go defer select case switch break continue true false nil".split(" "),
    java: "public private protected class interface extends implements new return if else for while do switch case break continue try catch finally throw static final void int double string boolean true false null import package".split(" "),
    rust: "fn let mut if else for while loop match return impl trait struct enum pub use mod self super true false as where ref move".split(" "),
    c: "int char float double void return if else for while do switch case break continue struct typedef enum union const static extern include define NULL true false".split(" "),
    cpp: "int char float double void bool return if else for while do switch case break continue struct class public private protected virtual template typename namespace using std new delete nullptr true false const static".split(" "),
    csharp: "public private protected class interface struct enum namespace using new return if else for foreach while do switch case break continue try catch finally throw static void int string bool var true false null readonly const".split(" "),
    php: "function return if else elseif for foreach while do switch case break continue class public private protected echo true false null new try catch throw namespace use as static extends implements".split(" "),
    swift: "func var let if else for while repeat switch case break continue return class struct enum protocol extension import public private internal inout guard defer true false nil self super".split(" "),
    kt: "fun val var if else for while when return class object interface import package private public internal protected is as try catch finally null true false".split(" "),
    css: "important".split(" "),
    yaml: "true false null yes no".split(" "),
    md: "true false null".split(" ")
  };

  var HL_BUILTINS = {
    python: "print len range type str int float list dict set tuple sum min max abs open input enumerate zip sorted reversed any all map filter isinstance issubclass super self Exception ValueError KeyError TypeError RuntimeError IndexError AttributeError NotImplementedError".split(" "),
    js: "console Math JSON Object Array String Number Boolean Symbol Promise Date window document navigator fetch setTimeout clearTimeout setInterval require module exports process Buffer parseInt parseFloat isNaN encodeURIComponent decodeURIComponent".split(" "),
    sh: "echo cd ls cat grep sed awk curl wget mv cp rm mkdir touch export source exit chmod sudo apt yum npm node python3 git docker".split(" "),
    go: "make new len cap append copy delete panic recover print println fmt".split(" "),
    java: "System String Integer Long Double Float Character Boolean List Map ArrayList HashMap Object Math Exception".split(" "),
    rust: "println print format vec Vec String str Some None Ok Err Box Clone Copy".split(" "),
    c: "printf scanf malloc calloc free strlen strcpy memcpy sizeof FILE fopen fclose fprintf".split(" "),
    cpp: "cout cin endl vector string map pair make_pair printf scanf nullptr size".split(" "),
    csharp: "Console WriteLine Write ReadLine List Dictionary string int var Task async await".split(" "),
    php: "print_r var_dump count array echo isset empty explode implode str_replace".split(" "),
    swift: "print String Int Double Array Dictionary Set print".split(" "),
    kt: "println print listOf arrayListOf mutableListOf mapOf hashMapOf setOf".split(" ")
  };

  function highlight(lang, code) {
    var group = HL_LANGS[lang] || "";
    var kw = Object.create(null);
    var bi = Object.create(null);
    if (group) {
      (HL_KEYWORDS[group] || []).forEach(function (w) { kw[w] = 1; });
      (HL_BUILTINS[group] || []).forEach(function (w) { bi[w] = 1; });
    }

    var RE =
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|<!--[\s\S]*?-->|--[ \t][^\n]*)|('[^'\n]*'|"[^"\n]*"|`[^`\n]*`)|\b(\d[\d_]*(?:\.[\d_]*)?[eE][+-]?\d+|\d[\d_]*(?:\.[\d_]*)?)\b|\b([A-Za-z_][A-Za-z0-9_]*)\b/g;
    var out = "";
    var last = 0;
    var m;
    while ((m = RE.exec(code))) {
      out += esc(code.slice(last, m.index));
      var comment = m[1];
      var str = m[2];
      var num = m[3];
      var word = m[4];
      if (comment) {
        out += '<span class="tok-c">' + esc(comment) + "</span>";
      } else if (str) {
        out += '<span class="tok-s">' + esc(str) + "</span>";
      } else if (num) {
        out += '<span class="tok-n">' + m[3] + "</span>";
      } else if (word) {
        if (kw[word]) out += '<span class="tok-k">' + word + "</span>";
        else if (bi[word]) out += '<span class="tok-b">' + word + "</span>";
        else out += word;
      }
      last = m.index + m[0].length;
    }
    out += esc(code.slice(last));
    return out;
  }

  /* ---------- Markdown（轻量） ---------- */

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, function (_, c) { return "<code>" + c + "</code>"; });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return s;
  }

  function renderMarkdown(md) {
    var lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
    var html = "";
    var i = 0;
    var inCode = false;
    var codeBuf = [];
    var codeLang = "";
    var para = [];

    function flushPara() {
      if (!para.length) return;
      html += "<p>" + para.join("<br>") + "</p>";
      para = [];
    }
    function flushCode() {
      if (!inCode) return;
      html +=
        '<pre class="ds-code"><button type="button" class="ds-code-copy">' +
        tr("复制") +
        "</button><code>" + highlight(codeLang, codeBuf.join("\n")) + "</code></pre>";
      codeBuf = [];
      inCode = false;
    }

    while (i < lines.length) {
      var line = lines[i];
      var fence = line.match(/^```(\S+)?/);
      if (fence) {
        if (inCode) flushCode();
        else { flushPara(); inCode = true; codeLang = (fence[1] || "").toLowerCase(); }
        i++;
        continue;
      }
      if (inCode) { codeBuf.push(line); i++; continue; }

      var t = line.trim();
      if (!t) { flushPara(); i++; continue; }

      var h = t.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        flushPara();
        html += "<h" + h[1].length + ">" + inline(h[2]) + "</h" + h[1].length + ">";
        i++;
        continue;
      }

      if (/^[-*]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
        flushPara();
        var items = [];
        while (i < lines.length) {
          var l2 = lines[i].trim();
          var m2 = l2.match(/^[-*]\s+(.*)$/) || l2.match(/^\d+[.)]\s+(.*)$/);
          if (!m2) break;
          items.push("<li>" + inline(m2[1]) + "</li>");
          i++;
        }
        html += "<ul>" + items.join("") + "</ul>";
        continue;
      }

      para.push(inline(t));
      i++;
    }
    flushCode();
    flushPara();
    return html;
  }

  /* ---------- 消息流式发送 ---------- */

  /* 深度思考：按会话开关决定实际请求的模型；联网搜索只注入站内资讯上下文 */
  function effectiveModel(conv) {
    var base = MODELS[conv.model] || MODELS[defaultModelFor(state.settings.service)];
    if (conv.think && base.service === "deepseek") {
      return { apiModel: "deepseek-reasoner", service: "deepseek", label: base.label + " · " + tr("深度思考"), reasoner: true, think: false };
    }
    return { apiModel: base.apiModel, service: base.service, label: base.label, reasoner: !!base.reasoner, think: !!conv.think };
  }

  function send(text) {
    text = (text || "").trim();
    if (!text) return;
    var conv = currentConv();
    if (!conv) conv = createConv();
    if (conv.title === "新对话") conv.title = text.length > 24 ? text.slice(0, 24) + "…" : text;
    conv.msgs.push({ role: "user", content: text });
    conv.msgs.push({ role: "assistant", content: "", model: "", error: false });
    saveConvs();
    renderSidebar();
    renderMessages();
    els.input.value = "";
    autoGrow();
    syncSendButton();

    if (effectiveModel(conv).service === "free") scheduleFreeSend(conv);
    else requestStream(conv);
  }

  function scheduleFreeSend(conv) {
    var key = effectiveModel(conv).apiModel;
    var until = state.cooldowns[key] || 0;
    var wait = until - Date.now();
    if (wait > 0 && wait <= FREE_COOLDOWN_MS * 2) {
      state.pendingSend = conv.id;
      toast(tr("免费服务冷却中") + "…", 3000);
      setTimeout(function () {
        if (state.pendingSend === conv.id) state.pendingSend = null;
        requestStream(conv);
      }, wait);
    } else {
      requestStream(conv);
    }
  }

  function requestStream(conv) {
    var eff = effectiveModel(conv);
    if (eff.service === "deepseek" && !(state.settings.dsKey || "").trim()) {
      finishWithError(conv, tr("未设置 API Key，请点击左下角「设置」填写。"));
      return;
    }

    var last = conv.msgs[conv.msgs.length - 1];
    if (!last || last.role !== "assistant") return;
    last.error = false;
    last.model = eff.label + (conv.search ? " · " + tr("联网搜索") : "");

    var controller = new AbortController();
    state.activeStreams[conv.id] = { controller: controller, aborted: false };
    syncSendButton();

    var base = conv.msgs
      .map(function (m) { return { role: m.role, content: m.content }; })
      .filter(function (m) { return m.content; });
    if (eff.think) {
      base.unshift({ role: "system", content: "请深入思考，先内部逐步推理，再给出简洁准确的最终答案。" });
    }

    function go(extraSystem) {
      if (!state.activeStreams[conv.id]) return;
      var msgs = base.slice();
      if (extraSystem) msgs.unshift({ role: "system", content: extraSystem });
      streamRequest(conv, eff, msgs, controller);
    }

    if (conv.search) {
      loadSearchContext(controller.signal).then(function (ctx) {
        go(ctx);
      }, function () {
        var st = state.activeStreams[conv.id];
        if (st) delete state.activeStreams[conv.id];
        var lastMsg = conv.msgs[conv.msgs.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          lastMsg.content = lastMsg.content ? lastMsg.content + tr("已停止") : tr("已停止");
        }
        saveConvs();
        if (conv.id === state.current) renderMessages();
        syncSendButton();
      });
    } else {
      go(null);
    }
  }

  /* 联网搜索：抓取站内 feeds.json（同源，始终可用），作为回答的真实资讯上下文 */
  var SEARCH_CONTEXT_MAX = 16;
  function loadSearchContext(signal) {
    return fetch("feeds.json", { cache: "no-store", signal: signal })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        var items = (data && data.articles) || [];
        if (!items.length) return null;
        var lines = items.slice(0, SEARCH_CONTEXT_MAX).map(function (it, i) {
          var title = it.title || "";
          var domain = "";
          try {
            if (it.url) domain = new URL(it.url).hostname.replace(/^www\./, "");
          } catch (e) {}
          return (i + 1) + ". 《" + title + "》" + (domain ? " — " + domain : "") + (it.url ? " " + it.url : "");
        });
        return "以下是 AI SIGNAL 站内实时聚合的最新资讯（标题/来源/链接）。用户开启了「联网搜索」，请优先基于这些真实信息回答问题，重要结论请标注来源链接；若问题与这些资讯无关，则正常作答。\n\n[AI SIGNAL 最新资讯]\n" + lines.join("\n");
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") throw err;
        return null;
      });
  }

  function streamRequest(conv, eff, msgs, controller) {
    var last = conv.msgs[conv.msgs.length - 1];
    if (!last || last.role !== "assistant") return;

    var headers = { "Content-Type": "application/json", Accept: "text/event-stream" };
    var url, payload;
    if (eff.service === "deepseek") {
      url = API_DS;
      headers.Authorization = "Bearer " + state.settings.dsKey.trim();
      payload = {
        model: eff.apiModel,
        messages: msgs,
        stream: true,
        stream_options: { include_usage: true }
      };
      if (!eff.reasoner) payload.temperature = 1.0;
    } else {
      url = API_FREE;
      payload = { model: eff.apiModel, messages: msgs, stream: true };
      if (eff.think) payload.reasoning_effort = "high";
    }

    var settled = false;
    var reasoning = "";
    var deltaEl = null;

    function ensureDeltaEl() {
      if (conv.id !== state.current) return;
      if (deltaEl && deltaEl.isConnected) return deltaEl;
      var all = els.messages.querySelectorAll(".ds-msg.assistant");
      var lastEl = all[all.length - 1];
      if (!lastEl) return null;
      lastEl.classList.add("streaming");
      deltaEl = lastEl.querySelector(".ds-msg-inner");
      return deltaEl;
    }

    function settle(opts) {
      if (settled) return;
      settled = true;
      var st = state.activeStreams[conv.id];
      if (st) {
        if (opts && opts.abort) { st.aborted = true; try { st.controller.abort(); } catch (e) {} }
        delete state.activeStreams[conv.id];
      }
      if (last) {
        if (reasoning) last.reasoning = reasoning;
        if (opts && opts.note) last.content = last.content ? last.content + opts.note : opts.note;
      }
      if (opts && opts.errorMsg) {
        last.error = true;
        last.content = "⚠ " + opts.errorMsg;
      }
      if (conv.id === state.current) {
        var all = els.messages.querySelectorAll(".ds-msg.assistant");
        var lastEl = all[all.length - 1];
        if (lastEl) {
          lastEl.classList.remove("streaming");
          if (opts && opts.errorMsg) lastEl.classList.add("error");
          var inner = lastEl.querySelector(".ds-msg-inner");
          if (inner) inner.innerHTML = renderAssistant(last);
          var cb = lastEl.querySelector(".ds-copy");
          if (cb) cb.hidden = false;
        }
      }
      saveConvs();
      syncSendButton();
      scrollToBottom(true);
    }

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    })
      .then(function (res) {
        if (!res.ok) return handleHTTPError(res, conv, settle);
        if (!res.body) { settle({ errorMsg: tr("当前浏览器不支持流式读取，请换用现代浏览器。") }); return null; }

        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var buf = "";
        var done = false;

        function pump() {
          return reader.read().then(function (chunk) {
            if (done || chunk.done) {
              settle({});
              return null;
            }
            buf += decoder.decode(chunk.value, { stream: true });
            var idx;
            while (!done && (idx = buf.indexOf("\n")) >= 0) {
              var line = buf.slice(0, idx).trim();
              buf = buf.slice(idx + 1);
              if (line.indexOf("data:") !== 0) continue;
              var data = line.slice(5).trim();
              if (!data) continue;
              if (data === "[DONE]") { done = true; settle({}); continue; }
              try {
                var obj = JSON.parse(data);
                var ch = obj.choices && obj.choices[0];
                if (!ch || !ch.delta) continue;
                var content = ch.delta.content || "";
                var rc = ch.delta.reasoning_content || "";
                if (rc) reasoning += rc;
                if (content) {
                  last.content += content;
                  var el = ensureDeltaEl();
                  if (el) {
                    el.textContent += content;
                    scrollToBottom();
                  }
                }
              } catch (e) {}
            }
            if (!done) return pump();
            return null;
          });
        }
        return pump();
      })
      .then(function () {
        /* noop — settle 已处理 */
      })
      .catch(function (err) {
        var st = state.activeStreams[conv.id];
        if (err && err.name === "AbortError") {
          settle({ abort: true, note: st && st.aborted ? tr("已停止") : "" });
        } else {
          settle({ errorMsg: tr("网络异常，请重试。") });
        }
      });
  }

  function handleHTTPError(res, conv, settle) {
    var status = res.status;
    var eff = effectiveModel(conv);
    if (eff.service === "free" && status === 429) {
      state.cooldowns[eff.apiModel] = Date.now() + FREE_COOLDOWN_MS;
      settle({ errorMsg: tr("免费服务请求太频繁（429），已进入约 15 秒冷却。") });
      return;
    }
    if (status === 402) {
      settle({ errorMsg: tr("DeepSeek API 无余额或无权限（402），请前往 platform.deepseek.com 充值后重试。") });
      return;
    }
    if (status === 401 || status === 403) {
      settle({ errorMsg: tr("API Key 无效（") + status + tr("），请检查设置中的 Key。") });
      return;
    }
    if (status === 429) {
      settle({ errorMsg: tr("请求过于频繁（429），请稍后再试。") });
      return;
    }
    res.text().then(function (t) {
      var msg = tr("请求失败（") + status + tr("）");
      try {
        var o = JSON.parse(t);
        var em = o && o.error && (o.error.message || o.error.msg);
        if (em) msg += "：" + em;
      } catch (e) {
        if (t) msg += "：" + t.slice(0, 200);
      }
      settle({ errorMsg: msg });
    }).catch(function () {
      settle({ errorMsg: tr("请求失败（") + status + tr("）") });
    });
  }

  function renderAssistant(last) {
    var html = "";
    if (last.reasoning) {
      html += '<details class="ds-reasoning"><summary>🤔 ' + tr("深度思考") + "</summary><div>" +
        renderMarkdown(last.reasoning) + "</div></details>";
    }
    html += renderMarkdown(last.content);
    return html;
  }

  function finishWithError(conv, msg) {
    var last = conv.msgs[conv.msgs.length - 1];
    if (last && last.role === "assistant") {
      last.error = true;
      last.content = "⚠ " + msg;
    }
    var st = state.activeStreams[conv.id];
    if (st) { st.aborted = true; try { st.controller.abort(); } catch (e) {} delete state.activeStreams[conv.id]; }
    saveConvs();
    if (conv.id === state.current) {
      renderMessages();
      syncSendButton();
      scrollToBottom(true);
    }
    syncSendButton();
  }

  function abortCurrent() {
    var c = currentConv();
    if (!c) return;
    var st = state.activeStreams[c.id];
    if (st) { st.aborted = true; try { st.controller.abort(); } catch (e) {} }
  }

  /* ---------- 输入 / 按钮 ---------- */

  function autoGrow() {
    els.input.style.height = "auto";
    els.input.style.height = Math.min(els.input.scrollHeight, 200) + "px";
  }

  function syncSendButton() {
    var active = activeForCurrent();
    var hasText = !!els.input.value.trim();
    els.send.classList.toggle("ready", hasText);
    els.send.classList.toggle("stop", active);
    els.send.innerHTML = active ? ICON_STOP : ICON_SEND;
    els.send.setAttribute("aria-label", active ? tr("停止") : tr("发送"));
  }

  function scrollToBottom(force) {
    var el = els.chat;
    if (!el) return;
    var near = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (force || near) el.scrollTop = el.scrollHeight;
  }

  function copyText(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).catch(function () { fallbackCopy(txt); });
    } else fallbackCopy(txt);
  }

  function fallbackCopy(txt) {
    var ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- Toast ---------- */

  var toastTimer = null;
  function toast(msg, ms) {
    els.toast.textContent = msg;
    els.toast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.hidden = true; }, ms || 2600);
  }

  /* ---------- 深度思考 / 联网搜索 开关 ---------- */

  function ensureConv() {
    var c = currentConv();
    if (c) return c;
    c = createConv();
    renderSidebar();
    renderMessages();
    syncModelUI();
    syncSendButton();
    return c;
  }

  function toggleThink() {
    var conv = ensureConv();
    conv.think = !conv.think;
    saveConvs();
    syncToolButtons();
    if (conv.think) {
      toast(MODELS[conv.model].service === "deepseek" ? tr("已开启深度思考（推理模式）") : tr("已开启深度思考"));
    } else {
      toast(tr("已关闭深度思考"));
    }
  }

  function toggleSearch() {
    var conv = ensureConv();
    conv.search = !conv.search;
    saveConvs();
    syncToolButtons();
    if (conv.search) toast(tr("已开启联网搜索（回答会结合 AI SIGNAL 站内最新资讯）"));
    else toast(tr("已关闭联网搜索"));
  }

  function syncToolButtons() {
    var conv = currentConv();
    els.thinkBtn.classList.toggle("on", !!(conv && conv.think));
    els.searchBtn.classList.toggle("on", !!(conv && conv.search));
  }

  /* 动态拉取 Pollinations 模型列表，把匿名可用的文本模型补充进免费分组 */
  function refreshFreeModels() {
    fetch("https://text.pollinations.ai/models", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error("bad")); })
      .then(function (list) {
        var group = els.freeGroup;
        if (!group || !Array.isArray(list)) return;
        list.forEach(function (m) {
          var name = m && m.name;
          if (!name || MODELS[name] || /audio|image|video/i.test(name)) return;
          var mods = m.output_modalities || [];
          if (mods.length && mods.indexOf("text") < 0) return;
          var aliases = m.aliases || [];
          if (aliases.some(function (a) { return MODELS[a]; })) return;
          MODELS[name] = { service: "free", apiModel: name, label: "Pollinations · " + name };
          var btn = document.createElement("button");
          btn.type = "button";
          btn.setAttribute("data-select", "free");
          btn.setAttribute("data-model", name);
          btn.innerHTML = '<span class="ds-opt-name"></span>';
          btn.querySelector(".ds-opt-name").textContent = MODELS[name].label;
          btn.addEventListener("click", function () { selectModel(name); });
          group.appendChild(btn);
        });
        syncModelUI();
      })
      .catch(function () { /* 拉取失败则保持内置列表 */ });
  }

  /* ---------- 设置弹窗 ---------- */

  function syncSettingsDialog() {
    els.settings.querySelectorAll(".ds-radio").forEach(function (r) {
      var active = r.getAttribute("data-svc") === state.settings.service;
      r.classList.toggle("active", active);
    });
    els.keyGroup.hidden = state.settings.service !== "deepseek";
    els.key.value = state.settings.dsKey || "";
    var status = els.keyStatus;
    var key = (state.settings.dsKey || "").trim();
    if (key) {
      var mask = key.slice(0, 4) + "…" + key.slice(-4);
      status.textContent = tr("已保存：") + mask;
    } else {
      status.textContent = tr("尚未设置 Key");
    }
  }

  function openSettings() {
    syncSettingsDialog();
    els.settings.hidden = false;
  }

  function closeSettings() {
    els.settings.hidden = true;
  }

  /* ---------- 抽屉（移动端） ---------- */

  function openDrawer() { els.app.classList.add("sidebar-open"); }
  function closeDrawer() { els.app.classList.remove("sidebar-open"); }
  function toggleDrawer() { els.app.classList.contains("sidebar-open") ? closeDrawer() : openDrawer(); }

  /* ---------- 事件绑定 ---------- */

  function wireEvents() {
    els.modelMenu.querySelectorAll("[data-model]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectModel(btn.getAttribute("data-model"));
      });
    });

    els.newBtn.addEventListener("click", function () {
      createConv();
      renderSidebar();
      renderMessages();
      syncModelUI();
      syncSendButton();
      closeDrawer();
      els.input.focus();
    });

    els.searchInput.addEventListener("input", renderSidebar);

    els.settingsBtn.addEventListener("click", function () { openSettings(); });
    els.settingsClose.addEventListener("click", closeSettings);
    els.settings.addEventListener("click", function (e) {
      if (e.target === els.settings) closeSettings();
    });

    els.thinkBtn.addEventListener("click", toggleThink);
    els.searchBtn.addEventListener("click", toggleSearch);

    els.settings.querySelectorAll(".ds-radio").forEach(function (r) {
      r.addEventListener("click", function () {
        state.settings.service = r.getAttribute("data-svc");
        state.modelId = defaultModelFor(state.settings.service);
        saveSettings();
        syncSettingsDialog();
        syncModelUI();
      });
    });

    els.keyToggle.addEventListener("click", function () {
      els.key.type = els.key.type === "password" ? "text" : "password";
      els.keyToggle.textContent = els.key.type === "password" ? tr("显示") : tr("隐藏");
    });

    els.keySave.addEventListener("click", function () {
      state.settings.dsKey = (els.key.value || "").trim();
      saveSettings();
      syncSettingsDialog();
      toast(tr("已保存"));
    });

    els.burger.addEventListener("click", toggleDrawer);
    els.app.addEventListener("click", function (e) {
      if (els.app.classList.contains("sidebar-open") && !e.target.closest(".ds-sidebar")) closeDrawer();
    });

    els.messages.addEventListener("click", function (e) {
      var btn = e.target.closest(".ds-code-copy");
      if (!btn) return;
      var pre = btn.closest("pre.ds-code");
      var code = pre && pre.querySelector("code");
      if (!code) return;
      copyText(code.innerText || code.textContent);
      toast(tr("已复制"));
    });

    els.modelBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !els.modelMenu.hidden;
      els.modelMenu.hidden = open;
      els.modelBtn.setAttribute("aria-expanded", String(!open));
    });
    document.addEventListener("click", function (e) {
      if (!els.modelMenu.hidden && !e.target.closest(".ds-model") && !e.target.closest(".ds-model-menu")) {
        els.modelMenu.hidden = true;
        els.modelBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (!els.settings.hidden) closeSettings();
        else if (!els.modelMenu.hidden) els.modelMenu.hidden = true;
        else closeDrawer();
      }
    });

    els.input.addEventListener("input", function () {
      autoGrow();
      syncSendButton();
    });
    els.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        if (!activeForCurrent()) send(els.input.value);
      }
    });

    els.send.addEventListener("click", function () {
      if (activeForCurrent()) abortCurrent();
      else send(els.input.value);
    });

    document.addEventListener("signal:lang", function () {
      buildSuggest();
      renderSidebar();
      renderMessages();
      syncModelUI();
      syncSendButton();
    });
  }

  function selectModel(id) {
    var model = MODELS[id];
    if (!model) return;
    state.modelId = id;
    state.settings.service = model.service;
    saveSettings();
    var conv = currentConv();
    if (conv) {
      conv.model = id;
      saveConvs();
    }
    els.modelMenu.hidden = true;
    els.modelBtn.setAttribute("aria-expanded", "false");
    syncModelUI();
    if (model.service === "deepseek" && !(state.settings.dsKey || "").trim()) {
      openSettings();
    }
  }

  /* ---------- 启动 ---------- */

  function init() {
    els.app = $("ds-app");
    els.main = $("main");
    els.sidebar = $("ds-sidebar");
    els.newBtn = $("ds-new");
    els.searchInput = $("ds-search-input");
    els.convList = $("ds-conv-list");
    els.settingsBtn = $("ds-settings-btn");
    els.burger = $("ds-burger");
    els.modelBtn = $("ds-model-btn");
    els.modelName = $("ds-model-name");
    els.modeBadge = $("ds-mode-badge");
    els.modelMenu = $("ds-model-menu");
    els.freeGroup = $("ds-free-group");
    els.chat = $("ds-chat");
    els.messages = $("ds-messages");
    els.empty = $("ds-empty");
    els.suggest = $("ds-suggest");
    els.composer = $("ds-composer");
    els.input = $("ds-input");
    els.send = $("ds-send");
    els.thinkBtn = $("ds-think");
    els.searchBtn = $("ds-search");
    els.settings = $("ds-settings");
    els.settingsClose = $("ds-settings-close");
    els.keyGroup = $("ds-key-group");
    els.key = $("ds-key");
    els.keyToggle = $("ds-key-toggle");
    els.keySave = $("ds-key-save");
    els.keyStatus = $("ds-key-status");
    els.toast = $("ds-toast");
    if (!els.app || !els.messages || !els.input) return;

    /* 将弹窗/提示移入 .ds-app，继承其 --ds-* 主题变量 */
    els.main.appendChild(els.modelMenu);
    els.app.appendChild(els.settings);
    els.app.appendChild(els.toast);

    state.settings = loadSettings();
    state.convs = loadConvs();
    state.modelId = defaultModelFor(state.settings.service);
    state.current = loadCurrent();
    if (state.current && !findConv(state.current)) state.current = null;
    if (!state.current && state.convs.length) state.current = state.convs[0].id;

    buildSuggest();
    wireEvents();
    renderSidebar();
    renderMessages();
    syncModelUI();
    syncToolButtons();
    syncSendButton();
    refreshFreeModels();
    autoGrow();
    els.input.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
