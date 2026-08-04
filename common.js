/* SIGNAL — 主题切换 / 导航 / 头部交互 */

(function () {
  "use strict";

  var THEME_KEY = "signal-theme";
  var THEMES = [
    { id: "paper",    label: "晨报",   swatch: "linear-gradient(135deg,#f5f7fa 50%,#b06f08 50%)" },
    { id: "midnight", label: "午夜",   swatch: "linear-gradient(135deg,#0b0c0e 50%,#4fd8ff 50%)" },
    { id: "aurora",   label: "极光",   swatch: "linear-gradient(135deg,#181730 50%,#c792ea 50%)" },
    { id: "ink",      label: "墨绿",   swatch: "linear-gradient(135deg,#12211b 50%,#7fd6a8 50%)" },
    { id: "mac",      label: "Mac 风格", swatch: "linear-gradient(135deg,#f5f5f7 50%,#0071e3 50%)" },
    { id: "auto",     label: "跟随系统", swatch: "conic-gradient(#ffffff,#000000,#ffffff)" }
  ];

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
        '<span>' + t.label + '</span>' +
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
