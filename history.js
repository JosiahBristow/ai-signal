/* SIGNAL — AI 发展历史时间线（阶段详解 + 有图时间线） */

(function () {
  "use strict";

  var ERAS = [
    { id: "origin",     zh: "思想萌芽",         en: "Origins",          hue: 45 },
    { id: "golden",     zh: "黄金时代",         en: "Golden Age",       hue: 160 },
    { id: "winter",     zh: "寒冬与专家系统",   en: "Winter & Experts", hue: 214 },
    { id: "rebirth",    zh: "深度学习复兴",     en: "Deep Learning",    hue: 268 },
    { id: "llm",        zh: "大模型时代",       en: "LLM Era",          hue: 330 }
  ];

  /* 每个阶段的详解：概览 + 关键节点 + 配图 */
  var DETAILS = [
    {
      id: "origin",
      img: "images/history-origin.svg",
      period: "1943 – 1956",
      zh: "思想萌芽",
      en: "Origins",
      overview: "AI 的种子埋藏在神经科学与计算机科学的交汇处。1943 年麦卡洛克与皮茨提出首个神经计算模型 M-P 神经元；1950 年图灵发表《计算机器与智能》，用「图灵测试」为机器智能立下判据；1956 年达特茅斯会议上「人工智能」一词正式诞生，一门新学科就此创立。",
      overviewEn: "The seeds of AI were planted where neuroscience met computing. In 1943 McCulloch and Pitts proposed the first neural computing model; in 1950 Turing framed machine intelligence with the Turing test; in 1956 the Dartmouth workshop gave the field its name.",
      points: [
        "1943 · M-P 神经元：用逻辑运算刻画大脑神经元，一切神经网络的起点",
        "1950 · 图灵测试：为「机器能否思考」提供可操作的判定基准",
        "1956 · 达特茅斯会议：麦卡锡命名「人工智能」，学科正式创立"
      ],
      pointsEn: [
        "1943 · M-P neuron: neural computation born, the ancestor of every neural network",
        "1950 · Turing test: an operational criterion for machine intelligence",
        "1956 · Dartmouth workshop: McCarthy coins \"artificial intelligence\""
      ]
    },
    {
      id: "golden",
      img: "images/history-golden.svg",
      period: "1956 – 1966",
      zh: "黄金时代",
      en: "Golden Age",
      overview: "学科创立后的第一个十年充满乐观。1957 年罗森布拉特造出会学习的感知机；1966 年维森鲍姆的 ELIZA 让计算机第一次「开口说话」。早期的研究者笃信机器很快就能像人一样思考，计算机科学也在这场热潮中迅速壮大。",
      overviewEn: "The first decade after the field's founding was full of optimism. In 1957 Rosenblatt built the perceptron, a network that could learn; in 1966 Weizenbaum's ELIZA made computers \"speak\" for the first time. Early researchers believed machines would soon think like people, and computer science grew fast in this fervor.",
      points: [
        "1957 · 感知机问世：第一个能够学习的神经网络",
        "1958 · LISP 发布：人工智能的「母语」编程语言",
        "1966 · ELIZA：早期自然语言聊天程序，人机对话的开端",
        "乐观预期：曾被预言「二十年内机器能做任何人能做的工作」"
      ],
      pointsEn: [
        "1957 · Perceptron: the first learning-capable neural network",
        "1958 · LISP: the programming language that became AI's native tongue",
        "1966 · ELIZA: an early chatbot, the dawn of human-machine dialogue",
        "Overoptimism: some predicted machines would do any human work within 20 years"
      ]
    },
    {
      id: "winter",
      img: "images/history-winter.svg",
      period: "1969 – 1993",
      zh: "寒冬与专家系统",
      en: "Winter & Experts",
      overview: "承诺兑现不了，热情就会降温。1969 年明斯基指出单层感知机无法解决异或问题，资助退潮，迎来第一次 AI 寒冬；1980 年代专家系统（如 XCON）让「知识工程」短暂复兴，却因维护成本高企再度遇冷，1987 年跌入第二次寒冬。而 1986 年推广的反向传播算法，正是后来一切复兴的火种。",
      overviewEn: "When promises went unfulfilled, enthusiasm cooled. In 1969 Minsky showed single-layer perceptrons cannot solve XOR, funding receded and the first AI winter set in; expert systems like XCON revived \"knowledge engineering\" in the 1980s, but sky-high maintenance costs froze the field again in 1987. Backpropagation, popularized in 1986, was the spark of everything that followed.",
      points: [
        "1969 · 感知机局限：明斯基与帕佩特揭示单层网络天花板",
        "1980 · 专家系统商业化：XCON 等知识系统在工业界落地",
        "1986 · 反向传播推广：多层神经网络训练成为可能",
        "1987 · 第二次寒冬：维护成本高企，资本与热情再度退潮"
      ],
      pointsEn: [
        "1969 · Perceptron limits: Minsky & Papert expose single-layer ceilings",
        "1980 · Expert systems go commercial: XCON lands in industry",
        "1986 · Backpropagation popularized: training deep nets becomes feasible",
        "1987 · Second AI winter: soaring maintenance costs chill the market again"
      ]
    },
    {
      id: "rebirth",
      img: "images/history-rebirth.svg",
      period: "1997 – 2016",
      zh: "深度学习复兴",
      en: "Deep Learning",
      overview: "当符号主义走入尽头，连接主义在数据与算力中重生。1997 年深蓝在象棋上击败卡斯帕罗夫；2006 年 Hinton 重提「深度学习」；2012 年 AlexNet 借助 GPU 横扫 ImageNet；2016 年 AlphaGo 以 4:1 战胜李世石。机器不再被「编程」完成一步，而是从海量数据中「学会」整个任务。",
      overviewEn: "As symbolism hit its ceiling, connectionism was reborn in data and compute. Deep Blue beat Kasparov at chess in 1997; Hinton revived \"deep learning\" in 2006; AlexNet swept ImageNet on GPUs in 2012; AlphaGo beat Lee Sedol 4:1 in 2016. Machines were no longer programmed step-by-step — they learned whole tasks from vast data.",
      points: [
        "1997 · 深蓝击败卡斯帕罗夫：符号 AI 的巅峰时刻",
        "2006 · 深度信念网络：Hinton 复兴「深度学习」",
        "2012 · AlexNet：GPU + 大数据引爆现代深度学习",
        "2016 · AlphaGo：强化学习与深度学习的标志性胜利"
      ],
      pointsEn: [
        "1997 · Deep Blue beats Kasparov: peak of the symbolic AI era",
        "2006 · Deep belief networks: Hinton revives \"deep learning\"",
        "2012 · AlexNet: GPUs and big data ignite modern deep learning",
        "2016 · AlphaGo: a landmark win for reinforcement + deep learning"
      ]
    },
    {
      id: "llm",
      img: "images/history-llm.svg",
      period: "2017 – 2026",
      zh: "大模型时代",
      en: "LLM Era",
      overview: "2017 年 Google 发表《Attention Is All You Need》，Transformer 成为此后一切大模型的基石；2018 年「预训练 + 微调」范式确立，GPT 与 BERT 相继登场；2022 年 ChatGPT 让生成式 AI 走进千家万户。随后多模态、AI Agent、推理模型与具身智能接连涌现，AGI 之争论也从实验室走向主流舆论。",
      overviewEn: "Google's \"Attention Is All You Need\" (2017) made the Transformer the bedrock of every large model to come; the \"pretrain + fine-tune\" paradigm solidified in 2018 as GPT and BERT arrived; in 2022 ChatGPT brought generative AI to the world. Multimodality, AI agents, reasoning models and embodied AI followed in quick succession, and the AGI debate moved from labs to the mainstream.",
      points: [
        "2017 · Transformer：注意力机制取代循环结构，大模型基石",
        "2018 · 预训练范式：GPT-1 与 BERT 确立「预训练 + 微调」",
        "2020 · GPT-3：1750 亿参数展示大模型的涌现能力",
        "2022 · ChatGPT：生成式 AI 进入大众视野，全球热潮",
        "2024 – 2026 · 多模态 / Agent / 推理模型 / AGI 之争"
      ],
      pointsEn: [
        "2017 · Transformer: attention replaces recurrence, the LLM bedrock",
        "2018 · Pretraining: GPT-1 and BERT establish \"pretrain + fine-tune\"",
        "2020 · GPT-3: 175B parameters reveal emergent abilities",
        "2022 · ChatGPT: generative AI goes mainstream, global boom",
        "2024 – 2026 · Multimodality / Agents / reasoning models / the AGI debate"
      ]
    }
  ];

  var ITEMS = [
    { year: "1943", era: "origin", title: "麦卡洛克-皮茨神经元模型", titleEn: "McCulloch–Pitts Neuron Model", desc: "W. 麦卡洛克与 W. 皮茨提出首个神经计算模型 M-P 神经元，用逻辑运算刻画大脑神经元，为人工神经网络奠定基础。", descEn: "W. McCulloch and W. Pitts proposed the first neural computing model (M-P neuron), describing brain neurons with logic operations and laying the foundation for artificial neural networks.", hot: false },
    { year: "1950", era: "origin", title: "图灵测试提出", titleEn: "The Turing Test", desc: "艾伦·图灵发表《计算机器与智能》，提出“机器能否思考”的判定标准——图灵测试，为智能定义提供基准。", descEn: "Alan Turing published \"Computing Machinery and Intelligence,\" proposing the Turing test as a criterion for whether machines can think.", hot: true },
    { year: "1956", era: "golden", title: "达特茅斯会议", titleEn: "The Dartmouth Conference", desc: "约翰·麦卡锡等人召集达特茅斯暑期会议，“人工智能”（Artificial Intelligence）一词正式诞生，标志学科创立。", descEn: "John McCarthy and colleagues convened the Dartmouth workshop; the term \"artificial intelligence\" was born, marking the founding of the field.", hot: true },
    { year: "1957", era: "golden", title: "感知机问世", titleEn: "The Perceptron", desc: "弗兰克·罗森布拉特提出感知机，第一个能够学习的神经网络，点燃第一波 AI 热潮。", descEn: "Frank Rosenblatt introduced the perceptron, the first learning-capable neural network, igniting the first wave of AI enthusiasm.", hot: false },
    { year: "1966", era: "golden", title: "ELIZA 聊天程序", titleEn: "ELIZA Chatbot", desc: "MIT 的约瑟夫·维森鲍姆开发早期自然语言聊天程序 ELIZA，引发人机对话的早期想象。", descEn: "Joseph Weizenbaum at MIT built ELIZA, an early natural-language chatbot, sparking early visions of human-machine dialogue.", hot: false },
    { year: "1969", era: "winter", title: "感知机局限与第一次寒冬", titleEn: "Perceptron Limits & the First AI Winter", desc: "明斯基与帕佩特在《感知机》中指出单层网络无法解决异或等问题，资助与热度随之退潮，进入第一次 AI 寒冬。", descEn: "Minsky and Papert showed in Perceptrons that single-layer networks cannot solve XOR-like problems; funding receded, ushering in the first AI winter.", hot: true },
    { year: "1980", era: "winter", title: "专家系统商业化", titleEn: "Expert Systems Go Commercial", desc: "XCON 等专家系统在商业中大获成功，“知识工程”成为主流，AI 迎来一波应用复兴。", descEn: "Expert systems like XCON succeeded commercially; \"knowledge engineering\" went mainstream and AI enjoyed an applications revival.", hot: false },
    { year: "1986", era: "winter", title: "反向传播算法推广", titleEn: "Backpropagation Popularized", desc: "Rumelhart、Hinton 与 Williams 推广反向传播算法，多层神经网络的训练成为可能。", descEn: "Rumelhart, Hinton, and Williams popularized backpropagation, making multi-layer neural network training possible.", hot: false },
    { year: "1987", era: "winter", title: "第二次 AI 寒冬", titleEn: "The Second AI Winter", desc: "专家系统维护成本高企、承诺落空，市场与投资再度退潮。", descEn: "Sky-high maintenance costs and unmet promises led to another retreat in market and investment.", hot: false },
    { year: "1997", era: "rebirth", title: "深蓝战胜卡斯帕罗夫", titleEn: "Deep Blue Beats Kasparov", desc: "IBM 深蓝在国际象棋中击败世界冠军卡斯帕罗夫，成为符号 AI 时代的巅峰象征。", descEn: "IBM's Deep Blue defeated world champion Garry Kasparov at chess, a peak symbol of the symbolic AI era.", hot: true },
    { year: "2006", era: "rebirth", title: "深度学习新浪潮", titleEn: "Deep Learning Revival", desc: "Hinton 提出深度信念网络，“深度学习”概念复兴，机器学习迎来新一轮进展。", descEn: "Hinton proposed deep belief networks; the concept of \"deep learning\" was revived, advancing machine learning anew.", hot: false },
    { year: "2012", era: "rebirth", title: "AlexNet 引爆深度学习", titleEn: "AlexNet Ignites Deep Learning", desc: "AlexNet 在 ImageNet 大赛大幅刷新纪录，GPU 训练与深度卷积网络开启现代深度学习时代。", descEn: "AlexNet shattered ImageNet records; GPU training and deep convolutional networks opened the modern deep learning era.", hot: true },
    { year: "2014", era: "rebirth", title: "GAN 生成对抗网络", titleEn: "Generative Adversarial Networks", desc: "Ian Goodfellow 提出生成对抗网络，生成式模型进入快速发展期。", descEn: "Ian Goodfellow introduced GANs, and generative models entered rapid development.", hot: false },
    { year: "2016", era: "rebirth", title: "AlphaGo 击败李世石", titleEn: "AlphaGo Defeats Lee Sedol", desc: "DeepMind 的 AlphaGo 以 4:1 战胜围棋世界冠军李世石，标志强化学习与深度学习的里程碑。", descEn: "DeepMind's AlphaGo beat Go champion Lee Sedol 4:1, a milestone for reinforcement learning and deep learning.", hot: true },
    { year: "2017", era: "llm", title: "Transformer 架构诞生", titleEn: "The Transformer Architecture", desc: "Google 发表《Attention Is All You Need》，Transformer 架构成为此后所有大模型的基石。", descEn: "Google published \"Attention Is All You Need\"; the Transformer became the foundation of every subsequent large model.", hot: true },
    { year: "2018", era: "llm", title: "预训练范式确立", titleEn: "Pretraining Paradigm", desc: "GPT-1 与 BERT 相继发布，“预训练 + 微调”成为自然语言处理的主流范式。", descEn: "GPT-1 and BERT launched; \"pretraining + fine-tuning\" became the dominant NLP paradigm.", hot: false },
    { year: "2020", era: "llm", title: "GPT-3 与扩散模型复兴", titleEn: "GPT-3 & Diffusion Revival", desc: "1750 亿参数的 GPT-3 展示出惊人能力；扩散模型带动 AI 图像生成复兴。", descEn: "GPT-3's 175B parameters showed stunning ability; diffusion models revived AI image generation.", hot: false },
    { year: "2022", era: "llm", title: "ChatGPT 发布，生成式 AI 爆发", titleEn: "ChatGPT & the Generative AI Boom", desc: "OpenAI 上线 ChatGPT，生成式 AI 进入大众视野，全球掀起大模型热潮。", descEn: "OpenAI launched ChatGPT; generative AI entered the mainstream and sparked a global LLM boom.", hot: true },
    { year: "2023", era: "llm", title: "大模型竞赛与监管升温", titleEn: "LLM Race & Rising Regulation", desc: "GPT-4 发布，Meta 开源 Llama 掀起开源浪潮，各国 AI 监管讨论加速。", descEn: "GPT-4 shipped, Meta open-sourced Llama, and global AI regulation debates accelerated.", hot: false },
    { year: "2024", era: "llm", title: "多模态与 AI Agent", titleEn: "Multimodality & AI Agents", desc: "多模态大模型普及，AI Agent 与智能体工作流成为产业焦点。", descEn: "Multimodal LLMs became common; AI agents and agentic workflows took center stage.", hot: false },
    { year: "2025", era: "llm", title: "推理模型与具身智能", titleEn: "Reasoning Models & Embodied AI", desc: "推理模型兴起，人形机器人进入产业化早期，AI 与硬件加速结合。", descEn: "Reasoning models emerged, humanoid robots entered early industrialization, and AI fused faster with hardware.", hot: false },
    { year: "2026", era: "llm", title: "原生多模态与 AGI 之争", titleEn: "Native Multimodality & the AGI Debate", desc: "Kimi K3、Qwen3.8 等原生多模态基座发布，AI 安全与“减速”之争持续，AGI 讨论走向主流。", descEn: "Native multimodal bases like Kimi K3 and Qwen3.8 launched; AI-safety and \"deceleration\" debates continue, and AGI talk went mainstream.", hot: true }
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

  function detailById(id) {
    for (var i = 0; i < DETAILS.length; i++) if (DETAILS[i].id === id) return DETAILS[i];
    return null;
  }

  function isEn() { return window.SIGNAL_LANG === "en"; }
  function T(s) { return window.t ? window.t(s) : s; }

  function buildFilters() {
    var el = document.getElementById("era-filters");
    if (!el) return;
    el.innerHTML = "";
    var opts = [["all", T("全部")]].concat(ERAS.map(function (e) { return [e.id, isEn() ? e.en : e.zh]; }));
    opts.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (currentEra === o[0] ? " active" : "");
      b.setAttribute("data-era", o[0]);
      b.textContent = o[1];
      b.addEventListener("click", function () { setEra(o[0]); });
      el.appendChild(b);
    });
  }

  /* 阶段详解：有图卡片 + 概览 + 关键节点 */
  function renderDetail(id) {
    var el = document.getElementById("era-detail");
    if (!el) return;
    var d = detailById(id);
    if (!d) { el.hidden = true; return; }
    var era = eraById(id);
    var title = isEn() ? d.en : d.zh;
    var overview = isEn() ? d.overviewEn : d.overview;
    var points = isEn() ? d.pointsEn : d.points;
    el.hidden = false;
    el.innerHTML =
      '<div class="ed-card" style="--ed-h:' + era.hue + '">' +
        '<div class="ed-media">' +
          '<img src="' + esc(d.img) + '" alt="' + esc(title) + '" loading="lazy">' +
          '<span class="ed-period">' + esc(d.period) + "</span>" +
        "</div>" +
        '<div class="ed-body">' +
          '<div class="ed-head">' +
            '<span class="ed-kicker">SIGNAL // ' + esc(d.en) + " · " + esc(d.period) + "</span>" +
            "<h2 class=\"ed-title\">" + esc(title) + "</h2>" +
          "</div>" +
          "<h3 class=\"ed-label\">" + esc(T("阶段概览")) + "</h3>" +
          '<p class="ed-overview">' + esc(overview) + "</p>" +
          "<h3 class=\"ed-label\">" + esc(T("关键节点")) + "</h3>" +
          '<ul class="ed-points">' +
            points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
          "</ul>" +
          '<button type="button" class="ed-back" id="ed-back">' + esc(T("返回全部时间线")) + "</button>" +
        "</div>" +
      "</div>";
    var back = document.getElementById("ed-back");
    if (back) back.addEventListener("click", function () { setEra("all"); });
  }

  function setEra(id) {
    currentEra = id;
    var chips = document.querySelectorAll("#era-filters .chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("active", chips[i].getAttribute("data-era") === id);
    }
    renderDetail(id);
    renderTimeline();
    if (id !== "all") {
      var det = document.getElementById("era-detail");
      if (det && det.scrollIntoView) setTimeout(function () { det.scrollIntoView({ behavior: "smooth", block: "start" }); }, 30);
    }
  }

  function renderTimeline() {
    var el = document.getElementById("timeline");
    if (!el) return;
    var list = ITEMS.filter(function (i) { return currentEra === "all" || i.era === currentEra; });
    el.innerHTML = list.map(function (i) {
      var era = eraById(i.era);
      var title = isEn() ? i.titleEn : i.title;
      var desc = isEn() ? i.descEn : i.desc;
      var eraLabel = isEn() ? era.en : era.zh;
      return (
        '<div class="tl-item' + (i.hot ? " hot" : "") + '" style="--tl-h:' + era.hue + '">' +
          '<span class="tl-dot" aria-hidden="true"></span>' +
          '<span class="tl-year">' + esc(i.year) + "</span>" +
          "<h2 class=\"tl-title\">" + esc(title) + "</h2>" +
          "<p class=\"tl-desc\">" + esc(desc) + "</p>" +
          '<span class="tl-tag">' + esc(eraLabel) + "</span>" +
          (i.hot ? '<span class="tl-tag">' + T("里程碑") + "</span>" : "") +
        "</div>"
      );
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildFilters();
    renderDetail(currentEra);
    renderTimeline();
  });

  document.addEventListener("signal:lang", function () {
    var el = document.getElementById("era-filters");
    if (el) {
      el.innerHTML = "";
      buildFilters();
    }
    renderDetail(currentEra);
    renderTimeline();
  });
})();
