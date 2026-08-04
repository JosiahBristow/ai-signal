/* SIGNAL — AI 发展历史时间线 */

(function () {
  "use strict";

  var ERAS = [
    { id: "origin",     zh: "思想萌芽",         en: "Origins",          hue: 45 },
    { id: "golden",     zh: "黄金时代",         en: "Golden Age",       hue: 160 },
    { id: "winter",     zh: "寒冬与专家系统",   en: "Winter & Experts", hue: 214 },
    { id: "rebirth",    zh: "深度学习复兴",     en: "Deep Learning",    hue: 268 },
    { id: "llm",        zh: "大模型时代",       en: "LLM Era",          hue: 330 }
  ];

  var ITEMS = [
    { year: "1943", era: "origin", title: "麦卡洛克-皮茨神经元模型", desc: "W. 麦卡洛克与 W. 皮茨提出首个神经计算模型 M-P 神经元，用逻辑运算刻画大脑神经元，为人工神经网络奠定基础。", hot: false },
    { year: "1950", era: "origin", title: "图灵测试提出", desc: "艾伦·图灵发表《计算机器与智能》，提出“机器能否思考”的判定标准——图灵测试，为智能定义提供基准。", hot: true },
    { year: "1956", era: "golden", title: "达特茅斯会议", desc: "约翰·麦卡锡等人召集达特茅斯暑期会议，“人工智能”（Artificial Intelligence）一词正式诞生，标志学科创立。", hot: true },
    { year: "1957", era: "golden", title: "感知机问世", desc: "弗兰克·罗森布拉特提出感知机，第一个能够学习的神经网络，点燃第一波 AI 热潮。", hot: false },
    { year: "1966", era: "golden", title: "ELIZA 聊天程序", desc: "MIT 的约瑟夫·维森鲍姆开发早期自然语言聊天程序 ELIZA，引发人机对话的早期想象。", hot: false },
    { year: "1969", era: "winter", title: "感知机局限与第一次寒冬", desc: "明斯基与帕佩特在《感知机》中指出单层网络无法解决异或等问题，资助与热度随之退潮，进入第一次 AI 寒冬。", hot: true },
    { year: "1980", era: "winter", title: "专家系统商业化", desc: "XCON 等专家系统在商业中大获成功，“知识工程”成为主流，AI 迎来一波应用复兴。", hot: false },
    { year: "1986", era: "winter", title: "反向传播算法推广", desc: "Rumelhart、Hinton 与 Williams 推广反向传播算法，多层神经网络的训练成为可能。", hot: false },
    { year: "1987", era: "winter", title: "第二次 AI 寒冬", desc: "专家系统维护成本高企、承诺落空，市场与投资再度退潮。", hot: false },
    { year: "1997", era: "rebirth", title: "深蓝战胜卡斯帕罗夫", desc: "IBM 深蓝在国际象棋中击败世界冠军卡斯帕罗夫，成为符号 AI 时代的巅峰象征。", hot: true },
    { year: "2006", era: "rebirth", title: "深度学习新浪潮", desc: "Hinton 提出深度信念网络，“深度学习”概念复兴，机器学习迎来新一轮进展。", hot: false },
    { year: "2012", era: "rebirth", title: "AlexNet 引爆深度学习", desc: "AlexNet 在 ImageNet 大赛大幅刷新纪录，GPU 训练与深度卷积网络开启现代深度学习时代。", hot: true },
    { year: "2014", era: "rebirth", title: "GAN 生成对抗网络", desc: "Ian Goodfellow 提出生成对抗网络，生成式模型进入快速发展期。", hot: false },
    { year: "2016", era: "rebirth", title: "AlphaGo 击败李世石", desc: "DeepMind 的 AlphaGo 以 4:1 战胜围棋世界冠军李世石，标志强化学习与深度学习的里程碑。", hot: true },
    { year: "2017", era: "llm", title: "Transformer 架构诞生", desc: "Google 发表《Attention Is All You Need》，Transformer 架构成为此后所有大模型的基石。", hot: true },
    { year: "2018", era: "llm", title: "预训练范式确立", desc: "GPT-1 与 BERT 相继发布，“预训练 + 微调”成为自然语言处理的主流范式。", hot: false },
    { year: "2020", era: "llm", title: "GPT-3 与扩散模型复兴", desc: "1750 亿参数的 GPT-3 展示出惊人能力；扩散模型带动 AI 图像生成复兴。", hot: false },
    { year: "2022", era: "llm", title: "ChatGPT 发布，生成式 AI 爆发", desc: "OpenAI 上线 ChatGPT，生成式 AI 进入大众视野，全球掀起大模型热潮。", hot: true },
    { year: "2023", era: "llm", title: "大模型竞赛与监管升温", desc: "GPT-4 发布，Meta 开源 Llama 掀起开源浪潮，各国 AI 监管讨论加速。", hot: false },
    { year: "2024", era: "llm", title: "多模态与 AI Agent", desc: "多模态大模型普及，AI Agent 与智能体工作流成为产业焦点。", hot: false },
    { year: "2025", era: "llm", title: "推理模型与具身智能", desc: "推理模型兴起，人形机器人进入产业化早期，AI 与硬件加速结合。", hot: false },
    { year: "2026", era: "llm", title: "原生多模态与 AGI 之争", desc: "Kimi K3、Qwen3.8 等原生多模态基座发布，AI 安全与“减速”之争持续，AGI 讨论走向主流。", hot: true }
  ];

  var currentEra = "all";

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }

  function eraById(id) {
    for (var i = 0; i < ERAS.length; i++) if (ERAS[i].id === id) return ERAS[i];
    return null;
  }

  function buildFilters() {
    var el = document.getElementById("era-filters");
    if (!el) return;
    var opts = [["all", "全部"]].concat(ERAS.map(function (e) { return [e.id, e.zh]; }));
    opts.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (currentEra === o[0] ? " active" : "");
      b.textContent = o[1];
      b.addEventListener("click", function () {
        currentEra = o[0];
        document.querySelectorAll("#era-filters .chip").forEach(function (c) { c.classList.remove("active"); });
        b.classList.add("active");
        renderTimeline();
      });
      el.appendChild(b);
    });
  }

  function renderTimeline() {
    var el = document.getElementById("timeline");
    if (!el) return;
    var list = ITEMS.filter(function (i) { return currentEra === "all" || i.era === currentEra; });
    el.innerHTML = list.map(function (i) {
      var era = eraById(i.era);
      return (
        '<div class="tl-item' + (i.hot ? " hot" : "") + '" style="--tl-h:' + era.hue + '">' +
          '<span class="tl-dot" aria-hidden="true"></span>' +
          '<span class="tl-year">' + esc(i.year) + "</span>" +
          "<h2 class=\"tl-title\">" + esc(i.title) + "</h2>" +
          "<p class=\"tl-desc\">" + esc(i.desc) + "</p>" +
          '<span class="tl-tag">' + esc(era.zh) + "</span>" +
          (i.hot ? '<span class="tl-tag">里程碑</span>' : "") +
        "</div>"
      );
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildFilters();
    renderTimeline();
  });
})();
