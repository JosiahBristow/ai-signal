/* SIGNAL — AI 基础知识课程（中英双语 · 数据驱动渲染）
   内容来源：大学腾飞营2026《人工智能与机器学习》课件 + 公开网络教程补充 */

(function () {
  "use strict";

  var PARTS = [
    { no: "Ⅰ", zh: "基础入门", en: "Foundations" },
    { no: "Ⅱ", zh: "训练与评估", en: "Training & Evaluation" },
    { no: "Ⅲ", zh: "学习范式", en: "Learning Paradigms" },
    { no: "Ⅳ", zh: "深度学习与前沿", en: "Deep Learning & Frontiers" }
  ];

  var LESSONS = [
    /* ================= PART Ⅰ ================= */
    {
      part: 0,
      no: "01",
      zh: "人工智能、机器学习与深度学习",
      en: "AI, Machine Learning & Deep Learning",
      hue: 45,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "AI 是最外面的一圈，机器学习是它的核心实现路径，深度学习又是机器学习里的一种技术。", en: "AI is the outermost circle; machine learning is its core path; deep learning is one technique inside ML." },
      blocks: [
        { t: "p", zh: "人工智能（Artificial Intelligence，AI）是计算机科学的一个分支，目标是让机器执行通常需要人类智能的任务——推理、学习、感知、规划。机器学习（Machine Learning，ML）是 AI 的一个子集：核心思路是「不写死规则，用数据学习」。深度学习（Deep Learning，DL）是机器学习的一个子集：用多层神经网络，直接从原始数据中自动提取特征。三者关系就像同心圆：AI ⊃ ML ⊃ DL。", en: "Artificial intelligence (AI) is a branch of computer science aiming to make machines perform tasks that usually require human intelligence — reasoning, learning, perception, planning. Machine learning (ML) is a subset of AI: instead of hard-coding rules, learn from data. Deep learning (DL) is a subset of ML: multi-layer neural networks that automatically extract features from raw data. Their relation is like concentric circles: AI ⊃ ML ⊃ DL." },
        { t: "table", label: { zh: "三者对比", en: "Compared" }, head: [
          { zh: "维度", en: "Aspect" }, { zh: "人工智能 AI", en: "AI" }, { zh: "机器学习 ML", en: "ML" }, { zh: "深度学习 DL", en: "DL" }
        ], rows: [
          [ { zh: "范围", en: "Scope" }, { zh: "最广的概念", en: "Broadest" }, { zh: "AI 的子集", en: "Subset of AI" }, { zh: "ML 的子集", en: "Subset of ML" } ],
          [ { zh: "目标", en: "Goal" }, { zh: "模拟人类智能", en: "Mimic human intelligence" }, { zh: "从数据中学习", en: "Learn from data" }, { zh: "自动学习复杂特征", en: "Auto-learn complex features" } ],
          [ { zh: "特征", en: "Features" }, { zh: "规则 / 搜索 / 优化", en: "Rules / search / optimization" }, { zh: "人工特征工程", en: "Manual feature engineering" }, { zh: "端到端自动提取", en: "End-to-end automatic" } ],
          [ { zh: "数据需求", en: "Data" }, { zh: "视技术而定", en: "Depends" }, { zh: "中小规模", en: "Small-to-medium" }, { zh: "海量数据", en: "Massive data" } ],
          [ { zh: "算力", en: "Compute" }, { zh: "依技术而定", en: "Depends" }, { zh: "CPU 可行", en: "CPU is enough" }, { zh: "GPU / TPU", en: "GPU / TPU" } ],
          [ { zh: "典型算法", en: "Algorithms" }, { zh: "专家系统、搜索、博弈", en: "Expert systems, search, games" }, { zh: "线性回归、SVM、决策树、随机森林", en: "Linear regression, SVM, trees, random forest" }, { zh: "CNN、RNN、Transformer", en: "CNN, RNN, Transformer" } ]
        ] },
        { t: "callout", label: { zh: "一句话区分", en: "In one line" }, zh: "机器学习让模型「会做题」，深度学习让模型「自己发现做题的方法」，而人工智能让机器整体上「看起来像人一样会思考」。", en: "Machine learning makes a model good at a task; deep learning lets it discover how to solve the task itself; AI makes machines overall appear to think like humans." },
        { t: "list", label: { zh: "AI 的常见应用", en: "Where AI shows up" }, items: [
          { zh: "机器视觉：人脸识别、图像分类、目标检测", en: "Vision: face recognition, image classification, object detection" },
          { zh: "自然语言处理：机器翻译、问答、文本生成", en: "NLP: translation, Q&A, text generation" },
          { zh: "语音：语音识别、合成", en: "Speech: recognition and synthesis" },
          { zh: "推荐系统、自动驾驶、智能客服、医疗辅助诊断", en: "Recommendation, autonomous driving, assistants, medical diagnosis" },
          { zh: "生成式内容：文生图、文生视频", en: "Generative content: text-to-image, text-to-video" }
        ] }
      ]
    },
    {
      part: 0,
      no: "02",
      zh: "机器学习：从经验中学习",
      en: "Machine Learning: Learn From Experience",
      hue: 160,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "与其把规则一条条写进程序，不如把数据交给机器，让它自己总结规律。", en: "Instead of hard-coding every rule, hand the data to a machine and let it discover patterns itself." },
      blocks: [
        { t: "p", zh: "机器学习是一类「从经验中学习」的技术：让计算机从数据中自动学习规律，并基于这些规律进行预测或决策，而无需明确编程所有规则。人类至今无法讲清楚自己「识别猫狗」「判断心情」时的精确计算逻辑，但我们可以用大量「经验数据」教会模型——让它通过训练数据学习并获得「识别规律」的能力。", en: "Machine learning is a family of techniques that \"learn from experience\": computers automatically learn patterns from data and use them to predict or decide, without every rule being explicitly programmed. Humans still cannot articulate the exact logic behind recognizing a cat or reading a mood, but we can teach models with lots of \"experience data\" — letting them learn and gain the ability to spot patterns from training data." },
        { t: "callout", label: { zh: "类比 · 刷题", en: "Analogy · Practice" }, zh: "解一元二次方程 x² + 5x + 6 = 0。你刷过很多题、用过很多次——每道题就像一个训练样本；你总结出「看到二次项系数为 1 可以用因式分解」——这就是你心里的模型；做错题扣一分——这就是你的损失函数；看完解析调整思路——这就是在优化参数。", en: "Solving x² + 5x + 6 = 0. Every problem you've practiced is a training sample; the rule you infer — \"when the leading coefficient is 1, try factoring\" — is your model; losing a point for each mistake is your loss function; adjusting your strategy after reading the solution is optimizing parameters." },
        { t: "list", label: { zh: "生活里的机器学习", en: "Machine learning around us" }, items: [
          { zh: "语音助手 Siri、手机人脸解锁", en: "Voice assistants like Siri, phone face unlock" },
          { zh: "输入法智能联想、B 站 / 淘宝 / 抖音推荐", en: "Smart input suggestions, Bilibili / Taobao / Douyin recommendations" },
          { zh: "网易云 / QQ 音乐歌单、相册自动分类", en: "Music playlists, automatic photo album sorting" },
          { zh: "导航软件估算到达时间", en: "Navigation apps estimating arrival time" }
        ] }
      ]
    },
    {
      part: 0,
      no: "03",
      zh: "数据：样本、特征与标签",
      en: "Data: Samples, Features & Labels",
      hue: 214,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "机器学习学的是数据里的规律。先认识三个词：样本、特征、标签。", en: "ML learns patterns hidden in data. Start with three words: samples, features, labels." },
      blocks: [
        { t: "p", zh: "数据是一组个体（样本）所具有的特征与结果。样本也叫数据点（data point）或数据实例（data instance），多个样本组成数据集（dataset）。当每个样本的特征数量一致时，数据集就形成固定维度（dimensionality），形状为「样本数 × 特征维度」（n × d）。", en: "Data is a collection of individuals (samples) with their features and outcomes. A sample is also called a data point or data instance; many samples form a dataset. When every sample has the same number of features, the dataset has a fixed dimensionality, shaped n (samples) × d (features)." },
        { t: "list", label: { zh: "三个核心概念", en: "Three core concepts" }, items: [
          { zh: "样本（example / sample）：一张图片、一段文字、一位病人、一次交易记录", en: "A sample: an image, a piece of text, a patient, a transaction" },
          { zh: "特征（feature）：机器用来「做判断」的输入，如身高、年龄、图像像素", en: "A feature: the input the machine judges on, like height, age, or image pixels" },
          { zh: "标签（label）：希望机器「预测」的结果，如房价、是否患病、是狗还是猫", en: "A label: the outcome we want predicted, like a price, sick or not, dog or cat" }
        ] },
        { t: "p", zh: "比如一个学生有 3 个特征：身高 = 170、体重 = 60、年龄 = 18，就是一个 3 维向量，每一行就是该学生（一个样本）的特征向量。", en: "For example, a student with 3 features — height=170, weight=60, age=18 — is a 3-dimensional vector; each row is one sample's feature vector." },
        { t: "fig", src: "images/learn/learn-recommend.jpg", alt: "商品特征向量与距离", caption: { zh: "把商品表示成特征向量：A 与 B 距离近（相似），A 与 C 距离远——系统推荐「离用户喜欢的商品最近」的商品。", en: "Products as feature vectors: A and B are close (similar), A and C far — the system recommends items nearest to what the user likes." } },
        { t: "callout", label: { zh: "Garbage in, garbage out（垃圾进，垃圾出）", en: "Garbage in, garbage out" }, zh: "标签错误 → 模型学错；特征冗余或无意义 → 增加训练难度；样本偏差 → 模型只适用于少数人。数据并不客观：用过去 20 年的投资回报数据训练「最佳策略」，学到的是历史的偏见与局限。", en: "Wrong labels → the model learns wrong; redundant or meaningless features → harder to train; biased samples → the model only fits a few people. Data isn't objective: training a \"best strategy\" on 20 years of past returns teaches historical bias and limitation." },
        { t: "table", label: { zh: "数据集的划分", en: "Dataset splits" }, head: [
          { zh: "名称", en: "Split" }, { zh: "作用", en: "Role" }, { zh: "类比", en: "Analogy" }
        ], rows: [
          [ { zh: "训练集", en: "Training" }, { zh: "模型用来「学」，生成模型", en: "The model learns" }, { zh: "平时刷的模拟题", en: "Practice sets" } ],
          [ { zh: "验证集", en: "Validation" }, { zh: "模型用来「选」，选择模型", en: "The model is selected" }, { zh: "考前模考", en: "Mock exams" } ],
          [ { zh: "测试集", en: "Test" }, { zh: "模型用来「考」，最终性能", en: "Final performance" }, { zh: "期末考试（不能泄题）", en: "Final exams (must not leak)" } ]
        ] }
      ]
    },
    {
      part: 0,
      no: "04",
      zh: "模型：从输入到输出",
      en: "The Model: Input to Output",
      hue: 268,
      tags: [{ zh: "入门", en: "Basics" }],
      lead: { zh: "模型是输入到输出的「转换器」，可以简单到一条直线，也可以复杂到一个神经网络。", en: "A model maps inputs to outputs — as simple as a line, as complex as a neural network." },
      blocks: [
        { t: "p", zh: "模型的本质是从输入到输出的一种转换关系（映射）：图像输入 → 情绪输出，传感器读数 → 正常 / 异常。模型可以很简单（线性），也可以非常复杂（神经网络）。比如「幸福指数 = 参数₁ × 维度₁ + 参数₂ × 维度₂ + … + 偏置量」，本质上就是「拉一条线」来拟合数据。", en: "A model is a mapping from inputs to outputs: image → emotion, sensor readings → normal/anomaly. Models can be simple (linear) or very complex (neural networks). For example, \"happiness = weight₁·dim₁ + weight₂·dim₂ + … + bias\" is really just fitting a line to the data." },
        { t: "p", zh: "如果直接用原始像素判断，信息太多太乱（等于盯着每一个像素）。神经网络就像一条「信息提炼流水线」：每一层都是一个「小模型」，将前一层的输出继续处理并生成新的表示（representation）。多层堆叠，就能从原始数据中逐步提取出更抽象、更有用的特征。", en: "Judging directly from raw pixels is too messy (like staring at every pixel). A neural network is like a feature-refinery pipeline: each layer is a \"mini model\" that processes the previous output into a new representation. Stacking layers extracts progressively more abstract, useful features from raw data." },
        { t: "fig", src: "images/learn/learn-pipeline.jpg", alt: "神经网络信息提炼流水线", caption: { zh: "神经网络像一条信息提炼流水线：每一层提取更高一级的特征，最终从原始像素走向「是什么物体」的判断。", en: "A neural network is a feature-refinery pipeline: each layer extracts a higher-level feature, from raw pixels toward a final decision." } },
        { t: "terms", label: { zh: "神经元的三步计算", en: "A neuron's three steps" }, items: [
          { name: { zh: "线性变换", en: "Linear transform" }, def: { zh: "把输入向量 x 和权重向量 w 做内积再加偏置", en: "Inner product of input x and weights w, plus bias" } },
          { name: { zh: "非线性激活", en: "Nonlinear activation" }, def: { zh: "把上一步结果 z 输入激活函数 f(z)，得到输出 a，如 ReLU(x) = max(0, x)", en: "Feed z through an activation f(z) to get output a, e.g. ReLU(x) = max(0, x)" } },
          { name: { zh: "输出", en: "Output" }, def: { zh: "输入 → 加权和 → 激活函数 → 输出", en: "Input → weighted sum → activation → output" } }
        ] }
      ]
    },

    /* ================= PART Ⅱ ================= */
    {
      part: 1,
      no: "05",
      zh: "损失函数：如何衡量对错",
      en: "Loss Functions: Scoring Mistakes",
      hue: 330,
      tags: [{ zh: "数学", en: "Math" }],
      lead: { zh: "没有「考试」就谈不上「进步」。损失函数就是那张评分表。", en: "No exam, no progress. The loss function is the scorecard." },
      blocks: [
        { t: "p", zh: "学习不是「胡乱学」，而是不断让损失函数的值更好（通常更低）。每错一点就罚一点；错得越离谱，罚得越重——平方误差就是这样：对离谱的错误加倍惩罚，而且数学上可导、可优化。", en: "Learning isn't random — it keeps pushing the loss lower. Each mistake gets penalized; the worse the mistake, the heavier the penalty. Squared error does exactly this: it punishes large errors more, and it's differentiable and optimizable." },
        { t: "table", label: { zh: "常用损失函数", en: "Common losses" }, head: [
          { zh: "损失", en: "Loss" }, { zh: "适用任务", en: "Task" }, { zh: "直觉", en: "Intuition" }
        ], rows: [
          [ { zh: "平方误差 MSE", en: "Squared error (MSE)" }, { zh: "回归（连续数值，如房价）", en: "Regression (continuous output)" }, { zh: "平方惩罚，大误差罚得更重", en: "Penalizes large errors quadratically" } ],
          [ { zh: "交叉熵", en: "Cross-Entropy" }, { zh: "分类（猫 vs 狗）", en: "Classification (cat vs dog)" }, { zh: "衡量预测分布与真实标签分布的距离", en: "Measures distance between predicted and true distribution" } ],
          [ { zh: "二值交叉熵 BCE", en: "Binary cross-entropy (BCE)" }, { zh: "多标签分类（图里既有狗又有草地）", en: "Multi-label (dog AND grass)" }, { zh: "每个类别独立 Sigmoid + BCE", en: "Each class independent via Sigmoid + BCE" } ]
        ] },
        { t: "callout", label: { zh: "换个说法", en: "In other words" }, zh: "如果你预测「它是猫」的概率只有 0.1，但它其实是猫，那就会被罚得很重。", en: "If you predict \"it's a cat\" with probability 0.1, but it really is a cat, you get penalized heavily." }
      ]
    },
    {
      part: 1,
      no: "06",
      zh: "训练与优化：梯度下降",
      en: "Training: Gradient Descent",
      hue: 25,
      tags: [{ zh: "数学", en: "Math" }],
      lead: { zh: "模型一开始是「空的」。训练就是沿着最陡的方向，一步步把损失滚下山。", en: "A model starts \"empty\". Training is rolling the loss downhill, step by step." },
      blocks: [
        { t: "p", zh: "模型一开始参数随机，我们用数据「教」它什么输入该对应什么输出，它会不断调整自己（优化参数），越来越接近我们想要的结果。梯度下降（Gradient Descent）是最核心、最常用的优化算法：每次往「损失函数下降最快的方向」走一步，直到找到最低点。但它并不完美——可能陷入「局部最小值」或「鞍点」，导致训练卡住。", en: "A model starts with random parameters; we teach it which input maps to which output, and it keeps adjusting itself (optimizing parameters) to get closer to what we want. Gradient descent is the core optimizer: each step moves in the steepest downhill direction of the loss until it reaches a low point. But it's imperfect — it can get stuck in a local minimum or a saddle point." },
        { t: "fig", src: "images/learn/learn-gradient.jpg", alt: "梯度下降示意", caption: { zh: "梯度下降：每次朝损失函数下降最快的方向走一步，直到找到最低点。", en: "Gradient descent: step in the steepest downhill direction until reaching a low point." } },
        { t: "fig", src: "images/learn/learn-gradient3.jpg", alt: "局部最小值与鞍点", caption: { zh: "梯度下降不是完美的：可能陷入「局部最小值」或「鞍点」，导致训练卡住。", en: "Gradient descent isn't perfect: it can get stuck in a local minimum or saddle point." } },
        { t: "table", label: { zh: "三种梯度下降", en: "Three flavors of gradient descent" }, head: [
          { zh: "方法", en: "Method" }, { zh: "每次更新用", en: "Per update" }, { zh: "特点", en: "Trade-off" }
        ], rows: [
          [ { zh: "批量 BGD", en: "Batch (BGD)" }, { zh: "全部训练数据", en: "All training data" }, { zh: "梯度准确、方向稳定；但计算代价大、训练慢", en: "Accurate and stable; expensive and slow" } ],
          [ { zh: "随机 SGD", en: "Stochastic (SGD)" }, { zh: "一条样本", en: "One sample" }, { zh: "计算量小、容易跳出局部最小值；但方向不稳定、容易抖动", en: "Cheap, can escape local minima; jittery and unstable" } ],
          [ { zh: "小批量 Mini-batch", en: "Mini-batch" }, { zh: "一小批（32 / 64 / 128）", en: "A small batch (32 / 64 / 128)" }, { zh: "兼顾速度与稳定，可矩阵并行；深度学习最常用", en: "Fast + stable, matrix-parallel; the standard choice" } ]
        ] },
        { t: "p", zh: "Adam 会记录每个参数历史上的一阶梯度的「平均方向」（像惯性）和二阶梯度的「方差」（调整步长）：学得快的参数步子小点避免抖动，学得慢的参数步子大点加快学习。99% 的深度学习模型默认都在用 Adam，无需精调学习率，收敛速度快。", en: "Adam tracks each parameter's historical first-order average (like momentum) and second-order variance (to size the step): fast-learners take small steps to avoid jitter, slow-learners take big steps to speed up. About 99% of deep learning models default to Adam — fast convergence with little learning-rate tuning." }
      ]
    },
    {
      part: 1,
      no: "07",
      zh: "评估指标：模型考了多少分",
      en: "Evaluation Metrics: Grading the Model",
      hue: 120,
      tags: [{ zh: "数学", en: "Math" }],
      lead: { zh: "模型练得好不好？先把四种结果数清楚，再算准确率、精确率、召回率和 F1。", en: "How good is the model? Count four kinds of outcomes first, then compute accuracy, precision, recall and F1." },
      blocks: [
        { t: "p", zh: "对于二分类问题，把「真实情况」和「模型预测」两两组合，可以得到四种结果，排成一张混淆矩阵（Confusion Matrix）。", en: "For binary classification, pairing the true label with the prediction yields four outcomes, laid out as a confusion matrix." },
        { t: "terms", label: { zh: "混淆矩阵四格", en: "The four cells" }, items: [
          { name: { zh: "TP 真正例", en: "True Positive" }, def: { zh: "实际为正、预测为正——判断对了", en: "Actually positive, predicted positive — correct" } },
          { name: { zh: "FP 假正例", en: "False Positive" }, def: { zh: "实际为负、预测为正——误报", en: "Actually negative, predicted positive — false alarm" } },
          { name: { zh: "FN 假负例", en: "False Negative" }, def: { zh: "实际为正、预测为负——漏报", en: "Actually positive, predicted negative — missed" } },
          { name: { zh: "TN 真负例", en: "True Negative" }, def: { zh: "实际为负、预测为负——判断对了", en: "Actually negative, predicted negative — correct" } }
        ] },
        { t: "table", label: { zh: "常用指标", en: "Common metrics" }, head: [
          { zh: "指标", en: "Metric" }, { zh: "公式", en: "Formula" }, { zh: "衡量什么", en: "What it measures" }
        ], rows: [
          [ { zh: "准确率", en: "Accuracy" }, { zh: "(TP+TN) / 总数", en: "(TP+TN) / total" }, { zh: "所有预测正确的比例；数据不均衡时会虚高", en: "Fraction correct; misleading on imbalanced data" } ],
          [ { zh: "精确率", en: "Precision" }, { zh: "TP / (TP+FP)", en: "TP / (TP+FP)" }, { zh: "预测为正里真正为正的比例（查准）", en: "Of positive predictions, how many are right" } ],
          [ { zh: "召回率", en: "Recall" }, { zh: "TP / (TP+FN)", en: "TP / (TP+FN)" }, { zh: "实际为正里被找出的比例（查全）", en: "Of actual positives, how many are found" } ],
          [ { zh: "F1", en: "F1" }, { zh: "2·P·R/(P+R)", en: "2·P·R/(P+R)" }, { zh: "精确率与召回率的调和平均", en: "Harmonic mean of precision and recall" } ]
        ] },
        { t: "callout", label: { zh: "该看哪个指标？", en: "Which metric matters?" }, zh: "垃圾邮件想「一个不漏」用召回率；误报代价高（如把好邮件删了）用精确率；两者都重要就用 F1；数据严重不均衡时别迷信准确率——99% 都是负类时，模型全猜负类也有 99% 准确率。", en: "Spam filtering that must catch everything? Optimize recall. False alarms costly? Optimize precision. Both matter? Use F1. And don't trust accuracy on imbalanced data — with 99% negatives, always predicting negative still gives 99% accuracy." },
        { t: "p", zh: "ROC 曲线用「真正例率」对「假正例率」，画出分类器在不同阈值下的表现；AUC 是曲线下的面积，越接近 1 越好。它综合衡量分类能力，且与阈值选择无关，常用于模型对比。", en: "The ROC curve plots true-positive rate against false-positive rate across thresholds; AUC is the area under it, the closer to 1 the better. It summarizes classification ability independent of any threshold, and is common for model comparison." }
      ]
    },
    {
      part: 1,
      no: "08",
      zh: "过拟合与泛化",
      en: "Overfitting & Generalization",
      hue: 190,
      tags: [{ zh: "进阶", en: "Intermediate" }],
      lead: { zh: "背答案不是学会。只有在没见过的题上答得好，才是真的懂了。", en: "Memorizing answers isn't learning. Only doing well on unseen problems counts." },
      blocks: [
        { t: "p", zh: "让模型背答案，它确实会「零错误」——训练集就像模拟题本，你天天做它；测试集就像期末考试题，你从没见过。损失函数算的是「表现」，但表现好 ≠ 懂得好。只有在看不见的数据上也表现好，才是真的学会了。过拟合不是你太聪明，而是你太「听话」——连错误的记忆都照单全收。", en: "Let a model memorize the answers and it scores perfectly — the training set is the practice booklet you drill daily, the test set is the unseen final. Loss measures performance, but performing well does not mean truly understanding. Only doing well on unseen data means you've really learned. Overfitting isn't being too smart; it's being too obedient — memorizing even the wrong memories." },
        { t: "list", label: { zh: "防过拟合三板斧", en: "Fighting overfitting" }, items: [
          { zh: "验证集 + 提前停止（Early Stopping）：训练中用未参与训练的数据定期测试，连续多轮不提升就停止；第 10 轮最好就选第 10 轮", en: "Validation set + early stopping: periodically test on held-out data and stop when improvement stalls; if round 10 is best, pick round 10" },
          { zh: "数据增强（Data Augmentation）：对训练数据做随机翻转、旋转、缩放、裁剪、亮度变化，让模型「见多识广」", en: "Data augmentation: flips, rotations, scales, crops, brightness so the model \"has seen it all\"" },
          { zh: "降低复杂度 / 加正则：减少层数与神经元，限制模型的「旋钮」", en: "Reduce capacity with fewer layers/neurons and regularization to limit the model's knobs" }
        ] }
      ]
    },
    {
      part: 1,
      no: "09",
      zh: "参数与超参数",
      en: "Parameters vs Hyperparameters",
      hue: 250,
      tags: [{ zh: "进阶", en: "Intermediate" }],
      lead: { zh: "参数是模型自己学出来的，超参数是你提前定好的。", en: "Parameters are learned by the model; hyperparameters are set by you." },
      blocks: [
        { t: "p", zh: "模型参数（权重 weights、偏置 bias）通过反向传播自动学习；超参数在训练前人为设定，不会通过训练自动学习，却决定训练过程怎么跑。", en: "Model parameters (weights, biases) are learned automatically via backpropagation; hyperparameters are set by humans before training, never learned, yet they shape how training runs." },
        { t: "table", label: { zh: "两者的区别", en: "The difference" }, head: [
          { zh: "类型", en: "Type" }, { zh: "举例", en: "Examples" }, { zh: "是否通过学习获得", en: "Learned?" }
        ], rows: [
          [ { zh: "模型参数", en: "Parameters" }, { zh: "权重、偏置", en: "Weights, bias" }, { zh: "✅ 通过反向传播学习", en: "Learned via backpropagation" } ],
          [ { zh: "超参数", en: "Hyperparameters" }, { zh: "学习率、batch size、epoch 数", en: "Learning rate, batch size, epochs" }, { zh: "❌ 人为设定，影响训练过程", en: "Set by hand, shapes training" } ]
        ] },
        { t: "list", label: { zh: "常用超参数", en: "Common hyperparameters" }, items: [
          { zh: "learning_rate 学习率：控制每步更新幅度，太大不稳定，太小收敛慢", en: "Learning rate: step size; too large is unstable, too small converges slowly" },
          { zh: "optimizer 优化器：SGD / Adam / RMSprop", en: "Optimizer: SGD / Adam / RMSprop" },
          { zh: "batch_size 批次大小：一次训练多少样本", en: "Batch size: how many samples per step" },
          { zh: "num_epochs 迭代轮数：整个数据集训练多少遍", en: "Epochs: how many passes over the dataset" },
          { zh: "num_layers、hidden_size：控制网络深度与宽度", en: "Layers and hidden size: network depth and width" },
          { zh: "数据增强参数：裁剪、旋转、翻转等，提高泛化能力", en: "Augmentation settings: crops, rotation, flips for better generalization" }
        ] }
      ]
    },
    {
      part: 1,
      no: "10",
      zh: "数据预处理与特征工程",
      en: "Preprocessing & Feature Engineering",
      hue: 300,
      tags: [{ zh: "实战", en: "Practice" }],
      lead: { zh: "数据不洗没法用。让模型少吃垃圾、少走弯路。", en: "Raw data is unusable. Clean it first, so the model eats less garbage and takes fewer detours." },
      blocks: [
        { t: "list", label: { zh: "常见预处理", en: "Common preprocessing" }, items: [
          { zh: "缺失值处理：删除或填充（均值 / 中位数 / 众数）", en: "Missing values: drop or impute (mean / median / mode)" },
          { zh: "标准化 / 归一化：把数值缩到同一量纲，防止量纲大的特征支配模型", en: "Standardization / normalization: scale values so big-magnitude features don't dominate" },
          { zh: "类别编码：One-hot 把「普通 / 高档」变成 [1,0] / [0,1]", en: "Categorical encoding: one-hot turns \"basic/luxury\" into [1,0] / [0,1]" },
          { zh: "去重去噪：剔除重复与异常样本", en: "Deduplicate and remove noise and outliers" },
          { zh: "划分数据集：训练 / 验证 / 测试（如 7:2:1）", en: "Split into train / validation / test (e.g. 7:2:1)" }
        ] },
        { t: "sub", zh: "特征工程", en: "Feature engineering" },
        { t: "p", zh: "特征工程是把原始数据通过一系列技术手段，转换成更好被模型利用的「特征」的过程：多项式扩展（加入 x²、x³）拟合非线性；取对数处理指数/幂次增长；离散化把连续变量转成类别；交叉特征（面积 × 装修质量）模拟特征间的协同效应；时间、地理特征分解提取隐含结构。", en: "Feature engineering transforms raw data into features the model can exploit: polynomial expansion (x², x³) to fit nonlinearity; log transforms for exponential growth; discretization of continuous variables; cross features (area × renovation) to capture interaction effects; and decomposition of time/geo features for hidden structure." },
        { t: "callout", label: { zh: "本质是「人工设计非线性」", en: "Hand-crafted nonlinearity" }, zh: "帮助模型从原始数据中获得更有效的表达能力。真实任务中我们并不知道是否存在交互效应，往往要靠领域知识假设，再数据驱动地枚举两两、三三组合的交叉项去探索。", en: "It helps the model express more from raw data. In practice we don't know which interactions exist, so we combine domain assumptions with data-driven search over pairwise (even triple) cross terms." }
      ]
    },

    /* ================= PART Ⅲ ================= */
    {
      part: 2,
      no: "11",
      zh: "监督学习",
      en: "Supervised Learning",
      hue: 350,
      tags: [{ zh: "核心", en: "Core" }],
      lead: { zh: "有「标准答案」的学习：输入特征，输出标签，模型从（x, y）对里学映射。", en: "Learning with an answer key: input features, output labels, the model learns the mapping from (x, y) pairs." },
      blocks: [
        { t: "p", zh: "监督学习的数据是一堆「输入-输出对」（样本）：每个样本的输入是特征，输出是标签。我们希望模型能在给定输入特征的前提下估计标签的概率，并泛化到未知输入。几乎所有工业级 AI 系统（诊断、翻译、预测）都依赖监督学习。它的主要挑战是：标注成本高、过拟合风险、样本不均衡、泛化能力差（遇到分布漂移可能失效）。", en: "Supervised learning uses (input, output) pairs: inputs are features, outputs are labels. We want the model to estimate the label's probability given the features and to generalize to unseen inputs. Nearly all industrial AI — diagnosis, translation, forecasting — relies on it. Key challenges: expensive labeling, overfitting, class imbalance, and poor generalization under distribution shift." },
        { t: "table", label: { zh: "常见监督任务", en: "Common supervised tasks" }, head: [
          { zh: "任务", en: "Task" }, { zh: "例子", en: "Example" }, { zh: "输入 → 输出", en: "Input → Output" }, { zh: "常见模型", en: "Models" }
        ], rows: [
          [ { zh: "二分类", en: "Binary" }, { zh: "垃圾邮件判断", en: "Spam detection" }, { zh: "邮件文本 → 是 / 否", en: "Text → yes / no" }, { zh: "逻辑回归、决策树、SVM、BERT", en: "Logistic regression, trees, SVM, BERT" } ],
          [ { zh: "多分类", en: "Multiclass" }, { zh: "手写数字识别", en: "Digit recognition" }, { zh: "28×28 像素 → 0~9", en: "Pixels → digit" }, { zh: "CNN、KNN、Softmax 回归、ResNet", en: "CNN, KNN, Softmax, ResNet" } ],
          [ { zh: "线性回归", en: "Regression" }, { zh: "房价预测", en: "House price" }, { zh: "面积、房间、地段 → 房价", en: "Features → price" }, { zh: "线性回归、Lasso、SVR", en: "Linear, Lasso, SVR" } ],
          [ { zh: "序列预测", en: "Sequence" }, { zh: "天气预报", en: "Weather" }, { zh: "历史序列 → 未来温度", en: "History → future" }, { zh: "RNN、LSTM、GRU、Transformer", en: "RNN, LSTM, GRU, Transformer" } ],
          [ { zh: "机器翻译", en: "Translation" }, { zh: "英译中", en: "English → Chinese" }, { zh: "英文句子 → 中文句子", en: "Sentence → sentence" }, { zh: "Seq2Seq、Transformer、T5", en: "Seq2Seq, Transformer, T5" } ],
          [ { zh: "多标签分类", en: "Multi-label" }, { zh: "给图片打多个标签（风景 + 夜景）", en: "Image tags (landscape + night)" }, { zh: "图像 → 标签集合", en: "Image → set of tags" }, { zh: "Sigmoid 输出层、BERT", en: "Sigmoid head, BERT" } ]
        ] }
      ]
    },
    {
      part: 2,
      no: "12",
      zh: "无监督学习",
      en: "Unsupervised Learning",
      hue: 45,
      tags: [{ zh: "核心", en: "Core" }],
      lead: { zh: "没有「标准答案」，模型要自己从数据里看门道。", en: "No answer key — the model must find structure on its own." },
      blocks: [
        { t: "p", zh: "老师发下答题卡问「你觉得问题出在哪」、学长丢给你 10 篇论文说「自己研究」——没有标签，模型要自己从数据里学会看门道。虽然没有真实答案，我们仍可以构造一个目标函数来「间接定义什么是好」。", en: "The teacher hands back your paper and asks \"what's wrong?\" — no labels, the model must find the pattern itself. Without a ground truth, we still construct an objective that indirectly defines what \"good\" means." },
        { t: "table", label: { zh: "无监督任务", en: "Unsupervised tasks" }, head: [
          { zh: "方法", en: "Method" }, { zh: "例子", en: "Example" }, { zh: "常见模型", en: "Models" }
        ], rows: [
          [ { zh: "聚类", en: "Clustering" }, { zh: "按浏览行为划分用户类型", en: "Segment users by behavior" }, { zh: "K-Means、DBSCAN、层次聚类", en: "K-Means, DBSCAN, hierarchical" } ],
          [ { zh: "降维 / PCA", en: "Dimensionality reduction / PCA" }, { zh: "个性评估、数据压缩", en: "Personality assessment, compression" }, { zh: "PCA、t-SNE、UMAP", en: "PCA, t-SNE, UMAP" } ],
          [ { zh: "异常检测", en: "Anomaly detection" }, { zh: "金融欺诈、设备故障", en: "Fraud, equipment faults" }, { zh: "GMM、Isolation Forest、AutoEncoder", en: "GMM, Isolation Forest, AutoEncoder" } ],
          [ { zh: "生成模型", en: "Generation" }, { zh: "生成写实头像、风格迁移", en: "Realistic avatars, style transfer" }, { zh: "GAN、VAE、Diffusion", en: "GAN, VAE, Diffusion" } ],
          [ { zh: "词嵌入", en: "Embedding" }, { zh: "词与词的语义关系", en: "Semantic word relations" }, { zh: "Word2Vec、GloVe、FastText", en: "Word2Vec, GloVe, FastText" } ]
        ] }
      ]
    },
    {
      part: 2,
      no: "13",
      zh: "强化学习",
      en: "Reinforcement Learning",
      hue: 160,
      tags: [{ zh: "核心", en: "Core" }],
      lead: { zh: "不靠标签，靠「试错」：与环境互动，为了长期奖励做决策。", en: "No labels — trial and error: interact with an environment to maximize long-term reward." },
      blocks: [
        { t: "p", zh: "强化学习（Reinforcement Learning）是一类智能体（agent）通过与环境（environment）交互学习最优行为策略（policy）的学习方法，核心思想是「试错」：智能体采取动作（action），获得奖励（reward）或惩罚，以此指导未来的决策。与监督学习不同，它不直接给「正确标签」，而是提供稀疏或延迟的反馈。", en: "Reinforcement learning is a family of methods where an agent learns an optimal policy by interacting with an environment. The core idea is trial and error: the agent takes actions, receives rewards or penalties, and adjusts future decisions. Unlike supervised learning, it gives no direct \"correct labels\" — only sparse or delayed feedback." },
        { t: "list", label: { zh: "RL 要点", en: "RL key points" }, items: [
          { zh: "数据来自智能体与环境的不断交互，而不是一堆静态样本", en: "Data comes from agent–environment interaction, not static samples" },
          { zh: "目标是学出策略，追求长期奖励最大化", en: "The goal is a policy maximizing long-term reward" },
          { zh: "MDP（马尔可夫决策过程）：当前状态足以决定未来的转移概率，与历史无关（无记忆性假设）", en: "MDP: the current state fully determines future transitions — memoryless" },
          { zh: "下围棋的对手、与你对抗的攻击者，都是「环境」的一部分", en: "The Go opponent and the attacker you defend against are part of the environment" },
          { zh: "现实挑战：奖励设计、分布漂移、部分可观测（POMDP）", en: "Real challenges: reward design, concept drift, partial observability (POMDP)" }
        ] },
        { t: "callout", label: { zh: "代表成就", en: "Landmark win" }, zh: "AlphaGo 用「强化学习 + 深度网络」在围棋上战胜人类世界冠军，是 RL 的标志性胜利。", en: "AlphaGo combined reinforcement learning with deep networks to beat the human Go world champion — a landmark RL victory." }
      ]
    },
    {
      part: 2,
      no: "14",
      zh: "生成模型与生成式 AI",
      en: "Generative Models & Generative AI",
      hue: 214,
      tags: [{ zh: "前沿", en: "Frontier" }],
      lead: { zh: "从「判断」到「创造」——生成式模型学习数据的分布，然后造出新的数据。", en: "From \"judging\" to \"creating\" — generative models learn the data distribution and then produce new data." },
      blocks: [
        { t: "p", zh: "判别模型学的是「边界」——这张图是猫还是狗；生成模型学的是「分布」——猫到底长什么样。学会分布之后，模型就能「采样」出以假乱真的图像、音频和文本。", en: "Discriminative models learn boundaries — is this a cat or a dog; generative models learn distributions — what does a cat look like. Once the distribution is learned, the model can sample new images, audio and text that look real." },
        { t: "table", label: { zh: "主流生成模型", en: "Main generative models" }, head: [
          { zh: "模型", en: "Model" }, { zh: "思路", en: "Idea" }, { zh: "典型应用", en: "Typical use" }
        ], rows: [
          [ { zh: "GAN 生成对抗网络", en: "GAN" }, { zh: "生成器「造假」、判别器「识假」，对抗中共同进步", en: "Generator fakes, discriminator detects; they improve adversarially" }, { zh: "图像生成、换脸", en: "Image generation, face swap" } ],
          [ { zh: "VAE 变分自编码器", en: "VAE" }, { zh: "把数据压缩进潜空间分布，再从中重建", en: "Compress data into a latent distribution, then reconstruct" }, { zh: "压缩、生成、异常检测", en: "Compression, generation, anomaly detection" } ],
          [ { zh: "Diffusion 扩散模型", en: "Diffusion" }, { zh: "从噪声出发，一步步「去噪」还原图像", en: "Start from noise and denoise step by step to an image" }, { zh: "Stable Diffusion、AI 绘画", en: "Stable Diffusion, AI art" } ],
          [ { zh: "Transformer 生成", en: "Transformer" }, { zh: "自回归，一个 token 一个 token 地续写", en: "Autoregressive, token by token continuation" }, { zh: "GPT、文生文", en: "GPT, text generation" } ]
        ] },
        { t: "callout", label: { zh: "生成式 AI 已进入大众", en: "Generative AI went mainstream" }, zh: "文生图（Midjourney / Stable Diffusion）、文生视频、AI 助手——底层都是先学会「数据的分布」，再按这个分布采样生成新内容。", en: "Text-to-image (Midjourney / Stable Diffusion), text-to-video, AI assistants — all learn a data distribution first, then sample from it to generate new content." }
      ]
    },

    /* ================= PART Ⅳ ================= */
    {
      part: 3,
      no: "15",
      zh: "激活函数与多层网络",
      en: "Activations & Multi-layer Networks",
      hue: 268,
      tags: [{ zh: "核心", en: "Core" }],
      lead: { zh: "没有非线性，叠再多层也只是「把一条直线换成另一条直线」。", en: "Without nonlinearity, stacking layers is just \"swapping one straight line for another.\"" },
      blocks: [
        { t: "p", zh: "如果没有激活函数，多层线性层叠加起来仍然等价于一层线性模型：整个过程可以合并成一次线性变换，能力没有本质提升。线性层负责「拉伸、旋转、平移空间」，激活函数负责「掰弯空间」——多层网络反复拉伸、掰弯，最终才能形成复杂的分类边界。", en: "Without activations, stacked linear layers collapse into a single linear model — no real gain in power. Linear layers stretch, rotate, and translate space; activations \"bend\" it. Repeatedly stretching and bending lets deep networks form complex decision boundaries." },
        { t: "fig", src: "images/learn/learn-activation.jpg", alt: "线性层与激活函数", caption: { zh: "线性层拉伸平移空间，激活函数「掰弯」空间，多层反复加工形成复杂分类边界。", en: "Linear layers stretch and translate space; activations bend it; repeated layers form complex decision boundaries." } },
        { t: "p", zh: "MLP（多层感知机）至少包含三种层：输入层（Input）、隐藏层（Hidden）、输出层（Output）。输入数据 → 线性变换 y = Wx + b → 激活函数（非线性）→ 下一层。隐藏层不是故意藏起来，而是它不直接对应最终答案，负责把原始输入加工成更有用的中间特征。参数越多，模型能调节的「旋钮」越多、表示越复杂——但也越容易过拟合。", en: "An MLP has at least three layers: input, hidden, and output. Data flows: linear transform y = Wx + b → nonlinear activation → next layer. The hidden layer isn't hidden on purpose — it just doesn't map directly to the answer; it refines raw input into more useful intermediate features. More parameters mean more knobs and richer representations — and more overfitting risk." },
        { t: "fig", src: "images/learn/learn-mlp.jpg", alt: "MLP 三种层结构", caption: { zh: "MLP 至少包含输入层、隐藏层、输出层；隐藏层把原始输入加工成更高级的中间特征。", en: "An MLP has input, hidden and output layers; hidden layers refine raw input into higher-level features." } },
        { t: "table", label: { zh: "常用激活函数", en: "Common activations" }, head: [
          { zh: "函数", en: "Function" }, { zh: "公式", en: "Formula" }, { zh: "特点", en: "Notes" }
        ], rows: [
          [ { zh: "ReLU", en: "ReLU" }, { zh: "max(0, x)", en: "max(0, x)" }, { zh: "最常用，计算快，缓解梯度消失", en: "Most common, fast, eases vanishing gradients" } ],
          [ { zh: "Sigmoid", en: "Sigmoid" }, { zh: "1 / (1 + e⁻ˣ)", en: "1 / (1 + e⁻ˣ)" }, { zh: "压缩到 0~1，用于二分类 / 置信度", en: "Squeezes to 0~1, for binary probability / confidence" } ],
          [ { zh: "Tanh", en: "Tanh" }, { zh: "(eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)", en: "(eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)" }, { zh: "压缩到 -1~1，中心对称，常用于循环网络", en: "Squeezes to -1~1, centered, common in RNNs" } ]
        ] },
        { t: "callout", label: { zh: "通用逼近定理", en: "Universal Approximation Theorem" }, zh: "只要隐藏层神经元足够多，一个带非线性激活的前馈神经网络可以逼近任意连续函数。那么「一个隐藏层 + 无数神经元」能不能解决一切？理论上可以，但不实际：需要极多神经元、训练困难、容易过拟合，也缺乏分层语义结构——现实世界（语言、图像、策略）本质上是层级结构的。", en: "With enough hidden units, a feedforward net with nonlinear activations can approximate any continuous function. So can one hidden layer with unlimited neurons solve everything? In theory yes, but not in practice: you'd need a huge number of neurons, training becomes unstable, overfitting looms, and you lose hierarchical semantics — the real world (language, images, strategies) is inherently layered." }
      ]
    },
    {
      part: 3,
      no: "16",
      zh: "深度网络怎么设计",
      en: "Designing a Deep Network",
      hue: 330,
      tags: [{ zh: "实战", en: "Practice" }],
      lead: { zh: "没有万能公式，但有实用的经验法则：从浅到深，先小后大，再看学习曲线。", en: "No universal formula — but there are practical heuristics: start shallow, keep it small, watch the learning curves." },
      blocks: [
        { t: "table", label: { zh: "层数的经验选择", en: "Choosing depth" }, head: [
          { zh: "问题类型", en: "Problem" }, { zh: "推荐层数", en: "Recommended depth" }
        ], rows: [
          [ { zh: "简单回归（sinx、logx、多项式）", en: "Simple regression (sinx, logx, polynomials)" }, { zh: "1 ~ 2 层", en: "1–2 layers" } ],
          [ { zh: "表格数据分类 / 回归", en: "Tabular classification / regression" }, { zh: "2 ~ 4 层", en: "2–4 layers" } ],
          [ { zh: "图像任务（需局部结构建模）", en: "Images (need local structure)" }, { zh: "用 CNN 替代 MLP", en: "Use CNN instead" } ],
          [ { zh: "文本任务（需顺序建模）", en: "Text (need sequential modeling)" }, { zh: "用 RNN 或 Transformer 替代 MLP", en: "Use RNN / Transformer instead" } ],
          [ { zh: "不确定时", en: "When unsure" }, { zh: "从 1 层开始逐步加深，观察训练效果", en: "Start at 1 layer, deepen while watching results" } ]
        ] },
        { t: "table", label: { zh: "神经元数量（宽度）经验", en: "Choosing width (regression example)" }, head: [
          { zh: "位置", en: "Layer" }, { zh: "经验规则", en: "Heuristic" }
        ], rows: [
          [ { zh: "第一层", en: "First layer" }, { zh: "2 ~ 10 × 输入维度", en: "2–10 × input dimension" } ],
          [ { zh: "后续层", en: "Deeper layers" }, { zh: "通常逐层递减（128 → 64 → 32）", en: "Usually shrink: 128 → 64 → 32" } ],
          [ { zh: "输出层", en: "Output layer" }, { zh: "分类 = 类别数；回归 = 1", en: "Classes for classification; 1 for regression" } ]
        ] },
        { t: "list", label: { zh: "自动搜索超参数", en: "Automated hyperparameter search" }, items: [
          { zh: "GridSearchCV / RandomizedSearchCV（sklearn）：小规模任务最方便", en: "GridSearchCV / RandomizedSearchCV: simplest for small tasks" },
          { zh: "Optuna：高性能优化器，自动剪枝、并行执行", en: "Optuna: high-performance, automatic pruning, parallel" },
          { zh: "Ray Tune：分布式调参神器，工业级大规模任务", en: "Ray Tune: distributed tuning at industrial scale" },
          { zh: "Keras Tuner：深度学习友好、简单易上手", en: "Keras Tuner: deep-learning friendly and easy" }
        ] }
      ]
    },
    {
      part: 3,
      no: "17",
      zh: "卷积神经网络（CNN）",
      en: "Convolutional Neural Networks",
      hue: 25,
      tags: [{ zh: "核心", en: "Core" }],
      lead: { zh: "MLP 处理图像：参数爆炸、空间信息丢失。卷积就是来救场的。", en: "MLP on images: parameter explosion and lost spatial structure. Convolution to the rescue." },
      blocks: [
        { t: "p", zh: "MLP 的每一层每个神经元都连接到上一层所有神经元，非常通用，但对输入没有任何结构假设。用它处理图像有三个大问题：参数量极大（一张 28×28 的灰度图 = 784 个像素，接 100 个隐藏神经元就有 78400 个参数）；空间结构无法保留（相邻像素的关系被打乱）；无法局部建模，也难以应对平移、缩放、旋转。", en: "In an MLP every neuron connects to all neurons in the previous layer — universal but with no structural assumptions. On images it suffers: huge parameter counts (a 28×28 grayscale image is 784 pixels; 100 hidden neurons already means 78,400 parameters); lost spatial structure (adjacent-pixel relations get scrambled); no local modeling, and trouble with translation, scaling, and rotation." },
        { t: "fig", src: "images/learn/learn-cnn-basis.jpg", alt: "CNN 三大能力", caption: { zh: "CNN 的三大能力：局部感知、参数共享、保持空间结构。", en: "CNN's three superpowers: local receptive fields, parameter sharing, preserved spatial structure." } },
        { t: "fig", src: "images/learn/learn-conv.jpg", alt: "卷积层示意", caption: { zh: "卷积核（3×3 / 5×5）在图像上滑动提取特征，输出特征图；28×28 输入用 10 个 3×3 卷积核只需 90 个参数。", en: "A kernel (3×3 / 5×5) slides over the image extracting features into a feature map; 10 3×3 kernels on a 28×28 input need only 90 weights." } },
        { t: "p", zh: "CNN 通常由三类层组成：卷积层提取特征、池化层压缩信息、全连接层做最终决策。", en: "A CNN usually stacks three kinds of layers: convolutional (extract features), pooling (compress), and fully connected (final decision)." },
        { t: "table", label: { zh: "池化层：压缩并保留重要性", en: "Pooling: compress while keeping what matters" }, head: [
          { zh: "作用", en: "Role" }, { zh: "说明", en: "Notes" }
        ], rows: [
          [ { zh: "降低计算量", en: "Less compute" }, { zh: "池化后尺寸变小，后续计算更少", en: "Smaller maps mean less compute downstream" } ],
          [ { zh: "降低过拟合", en: "Less overfitting" }, { zh: "去除小幅扰动和不重要的细节", en: "Removes small perturbations and details" } ],
          [ { zh: "增加感受野", en: "Bigger receptive field" }, { zh: "后续神经元能看到更大区域的特征", en: "Later neurons see a larger region" } ],
          [ { zh: "增强平移不变性", en: "Translation invariance" }, { zh: "同一特征换个位置，池化后影响相似", en: "Same feature at different positions behaves similarly" } ]
        ] },
        { t: "fig", src: "images/learn/learn-pooling.jpg", alt: "池化类型", caption: { zh: "常见池化：最大池化（取窗口最大值，常用）、平均池化（取平均）、全局池化（每通道一个值）。", en: "Common pooling: max (window max, most used), average (window mean), global (one value per channel)." } },
        { t: "fig", src: "images/learn/learn-fc.jpg", alt: "全连接层", caption: { zh: "全连接层把卷积提取的局部特征「摊平」融合，做全局推理并输出任务结果。", en: "The fully connected layer flattens and fuses local features, reasons globally, and outputs the final result." } }
      ]
    },
    {
      part: 3,
      no: "18",
      zh: "目标检测与 YOLO",
      en: "Object Detection & YOLO",
      hue: 120,
      tags: [{ zh: "进阶", en: "Intermediate" }],
      lead: { zh: "图像识别有三层：这张图是什么 → 它在哪 → 图里都有什么、分别在哪。", en: "Three levels of vision: what is it → where is it → what is where." },
      blocks: [
        { t: "table", label: { zh: "图像识别的三个层次", en: "Three levels of image understanding" }, head: [
          { zh: "任务", en: "Task" }, { zh: "问题", en: "Question" }, { zh: "输出", en: "Output" }
        ], rows: [
          [ { zh: "图像分类", en: "Classification" }, { zh: "这张图是什么？", en: "What is this?" }, { zh: "「猫」", en: "\"Cat\"" } ],
          [ { zh: "目标定位", en: "Localization" }, { zh: "猫在哪里？", en: "Where is it?" }, { zh: "一个框", en: "A bounding box" } ],
          [ { zh: "目标检测", en: "Detection" }, { zh: "图里有哪些东西、分别在哪？", en: "What's there, and where?" }, { zh: "猫、狗、人、车…每个都有位置框", en: "Cats, dogs, people, cars… each with a box" } ]
        ] },
        { t: "fig", src: "images/learn/learn-detection.jpg", alt: "图像识别三层次", caption: { zh: "图像分类 / 目标定位 / 目标检测：检测 = 定位 + 分类。", en: "Classification / localization / detection: detection is localization plus classification." } },
        { t: "p", zh: "早期的检测方法大致是两步：先生成很多候选区域，再对每个区域做分类。思路直观，但候选区域多、每个都要处理，速度慢，不适合实时摄像头。", en: "Early detectors worked in two steps: generate many candidate regions, then classify each one. Intuitive but slow — too many regions to process, unsuitable for real-time cameras." },
        { t: "p", zh: "YOLO（You Only Look Once）把检测做成了「只看一次」：输入一张图，直接一步预测所有目标的位置和类别。训练时输入图片 + 标注框，模型不断比较自己预测的框和真实标注框的差距。速度大幅提升，适合实时检测。", en: "YOLO (You Only Look Once) does detection in a single pass: given one image, predict all object positions and classes at once. Training compares predicted boxes against labeled boxes. Much faster, built for real-time." }
      ]
    },
    {
      part: 3,
      no: "19",
      zh: "循环神经网络（RNN）",
      en: "Recurrent Neural Networks",
      hue: 190,
      tags: [{ zh: "进阶", en: "Intermediate" }],
      lead: { zh: "专门处理序列的神经网络——它有一个「记忆」。", en: "A network built for sequences — it has a memory." },
      blocks: [
        { t: "fig", src: "images/learn/learn-rnn.jpg", alt: "RNN 与记忆", caption: { zh: "RNN 专门处理序列数据（文本、语音、时间序列），关键特点是具有「记忆」能力。", en: "RNNs handle sequences (text, speech, time series); their key trait is memory." } },
        { t: "p", zh: "RNN 在每个时间步重复使用同一个神经网络单元（RNN Cell），并把上一个时间步的隐藏状态作为输入传给下一个时间步。读文章时，它每读一个词，就把「之前读过的内容」存在脑海（隐藏状态 hₜ₋₁）里，带着这份记忆去理解下一个词——大脑结构（权重）没变，只是记忆在不断更新。", en: "At each time step an RNN reuses the same cell, passing the previous hidden state into the next step. Reading an article, it stores \"what it read before\" (hidden state hₜ₋₁) and carries that memory into the next word — the \"brain\" (weights) stays fixed, only the memory updates." },
        { t: "table", label: { zh: "语言建模：预测下一个字", en: "Language modeling: predict the next token" }, head: [
          { zh: "时间步", en: "Step" }, { zh: "输入 xₜ", en: "Input xₜ" }, { zh: "目标输出 yₜ", en: "Target yₜ" }
        ], rows: [
          [ { zh: "t=1", en: "t=1" }, { zh: "我", en: "I" }, { zh: "想", en: "want" } ],
          [ { zh: "t=2", en: "t=2" }, { zh: "想", en: "want" }, { zh: "要", en: "to" } ],
          [ { zh: "t=3", en: "t=3" }, { zh: "要", en: "to" }, { zh: "吃", en: "eat" } ],
          [ { zh: "t=4", en: "t=4" }, { zh: "吃", en: "eat" }, { zh: "饭", en: "rice" } ]
        ] },
        { t: "table", label: { zh: "RNN 优缺点", en: "Pros and cons" }, head: [
          { zh: "优点", en: "Pros" }, { zh: "缺点", en: "Cons" }
        ], rows: [
          [ { zh: "处理任意长度输入", en: "Handles variable-length input" }, { zh: "不能并行训练，序列必须逐步处理", en: "No parallel training; strictly sequential" } ],
          [ { zh: "捕捉上下文依赖", en: "Captures context dependence" }, { zh: "长距离依赖信息逐渐丢失（梯度消失）", en: "Long-range dependencies vanish (vanishing gradients)" } ],
          [ { zh: "曾广泛用于 NLP 早期任务", en: "Used widely in early NLP" }, { zh: "训练难收敛，对超参数敏感", en: "Hard to converge; sensitive to hyperparameters" } ]
        ] }
      ]
    },
    {
      part: 3,
      no: "20",
      zh: "LSTM：给 RNN 装上门",
      en: "LSTM: Gating the RNN",
      hue: 250,
      tags: [{ zh: "进阶", en: "Intermediate" }],
      lead: { zh: "LSTM 引入记忆单元和门控，想留的留下，想忘的忘掉。", en: "LSTM adds a memory cell with gates — keep what matters, forget the rest." },
      blocks: [
        { t: "p", zh: "长短期记忆网络（LSTM）针对 RNN 的「健忘」引入了专门结构：记忆单元（Cell）和门控机制（Gates），用三个「门」控制信息的流动。", en: "Long Short-Term Memory (LSTM) fixes RNN forgetfulness with a memory cell and gating — three \"gates\" control the flow of information." },
        { t: "table", label: { zh: "门控三兄弟", en: "The three gates" }, head: [
          { zh: "门", en: "Gate" }, { zh: "作用", en: "Role" }, { zh: "类比", en: "Analogy" }
        ], rows: [
          [ { zh: "忘记门 fₜ", en: "Forget gate fₜ" }, { zh: "决定哪些旧信息要丢弃", en: "Decides which old info to drop" }, { zh: "清理无用记忆", en: "Clean up useless memories" } ],
          [ { zh: "输入门 iₜ", en: "Input gate iₜ" }, { zh: "决定哪些新信息要存入", en: "Decides which new info to store" }, { zh: "学进新的知识", en: "Learn new knowledge" } ],
          [ { zh: "输出门 oₜ", en: "Output gate oₜ" }, { zh: "决定最终输出什么", en: "Decides the final output" }, { zh: "说出口的内容", en: "What to say" } ]
        ] },
        { t: "fig", src: "images/learn/learn-lstm.jpg", alt: "LSTM 门控机制", caption: { zh: "LSTM 用忘记门、输入门、输出门控制信息的取舍，缓解长期记忆丢失。", en: "LSTM uses forget, input and output gates to control information, easing long-term memory loss." } },
        { t: "p", zh: "但是 RNN / LSTM 依然有三个硬伤：序列只能逐步计算、无法并行，训练慢；长距离依赖仍难捕捉；对超长文本或大规模场景扩展困难。这也推动了 Transformer 的出现。", en: "But RNN / LSTM still have three weaknesses: strictly sequential computation (no parallelism, slow training), hard long-range dependencies, and limited scalability to very long text — paving the way for the Transformer." }
      ]
    },
    {
      part: 3,
      no: "21",
      zh: "Transformer 与注意力机制",
      en: "Transformer & Attention",
      hue: 300,
      tags: [{ zh: "核心", en: "Core" }],
      lead: { zh: "完全抛弃循环结构，用「注意力」直接建模任意两个词之间的关系。", en: "It discards recurrence entirely and models relations between any two tokens directly with attention." },
      blocks: [
        { t: "fig", src: "images/learn/learn-transformer.jpg", alt: "RNN 问题与 Transformer", caption: { zh: "RNN / LSTM 序列计算慢、长依赖难捕捉、难以扩展——Transformer 用注意力机制解决了这些问题。", en: "RNN / LSTM are slow, lose long-range dependencies and scale poorly — the Transformer fixes all three with attention." } },
        { t: "p", zh: "Transformer 完全抛弃了 RNN 的时间结构，改用「注意力机制」（Attention）建模句子中任意两个词之间的依赖关系。它像是一个「动态的关注分配器」：不再死记硬背顺序，而是灵活地理解语义。", en: "The Transformer drops the temporal structure of RNNs and instead uses attention to model dependencies between any two tokens. It works like a dynamic focus allocator: rather than memorizing order, it flexibly understands semantics." },
        { t: "terms", label: { zh: "Q / K / V 三步", en: "Q / K / V in three steps" }, items: [
          { name: { zh: "查询 Query", en: "Query (Q)" }, def: { zh: "当前词「想找什么」——问的问题", en: "What the current token is looking for" } },
          { name: { zh: "键 Key", en: "Key (K)" }, def: { zh: "其他词「能提供什么」——被检索的标签", en: "What other tokens can offer — the lookup label" } },
          { name: { zh: "值 Value", en: "Value (V)" }, def: { zh: "真正取用的信息内容", en: "The actual content to take" } }
        ] },
        { t: "callout", label: { zh: "计算一句话", en: "In one sentence" }, zh: "用 Q 去「看」K，得到注意力权重，再用权重去加权 V，得到新的表示：Attention = softmax(QKᵀ/√dₖ)·V。", en: "Use Q to look up K, get attention weights, then use those weights to weigh V: Attention = softmax(QKᵀ/√dₖ)·V." },
        { t: "list", label: { zh: "三大优势", en: "Three superpowers" }, items: [
          { zh: "高度可并行：不像 RNN 逐个时间步，能一次性全并行计算", en: "Highly parallel: not step-by-step like RNN, computed all at once" },
          { zh: "长距离依赖没压力：哪怕距离很远也能「一眼关注」", en: "Effortless long-range dependencies: far-apart tokens connect directly" },
          { zh: "表达力更强：每个词根据上下文动态变形，还能用多头（Multi-Head）分工关注不同模式", en: "Richer representation: each token adapts to context; multiple heads attend to different patterns" }
        ] },
        { t: "p", zh: "经典例子：The animal didn't cross the street because it was too tired——注意力机制能算出 it 指的是 animal 而不是 street。Transformer 自 2017 年提出后成为一切大模型的基石。", en: "Classic example: \"The animal didn't cross the street because it was too tired\" — attention figures out that \"it\" refers to the animal, not the street. Since 2017 the Transformer has been the foundation of every large model." }
      ]
    },
    {
      part: 3,
      no: "22",
      zh: "大模型：Foundation Models",
      en: "Foundation Models (LLMs)",
      hue: 350,
      tags: [{ zh: "前沿", en: "Frontier" }],
      lead: { zh: "在海量数据上预训练、拥有数十亿到万亿参数的「超级大脑」，微调一下就能干各种活。", en: "A \"super brain\" pretrained on massive data with billions to trillions of parameters, fine-tunable for countless tasks." },
      blocks: [
        { t: "fig", src: "images/learn/learn-llm.jpg", alt: "大模型比喻", caption: { zh: "大模型是「通才学生 / 超级大脑 / 通用工程平台」：打地基型模型，是所有下游任务的基础。", en: "A foundation model is a \"well-rounded student / super brain / general platform\" — the base for all downstream tasks." } },
        { t: "p", zh: "大模型（Foundation Model / LLM）指在海量数据上预训练、拥有数十亿甚至万亿参数，可以通过微调适应多种下游任务的通用型人工智能模型。它不是为了完成某一个特定任务而训练的，而是「打地基」型模型——可以当作问答系统、情感分析、多模态生成等各种系统的底座。", en: "A foundation model (or LLM) is pretrained on massive data, holds billions to trillions of parameters, and adapts to many downstream tasks via fine-tuning. It isn't trained for one specific task — it's the \"foundation\" under Q&A systems, sentiment analysis, multimodal generation and more." },
        { t: "table", label: { zh: "关键特征", en: "Key traits" }, head: [
          { zh: "特征", en: "Trait" }, { zh: "描述", en: "Description" }
        ], rows: [
          [ { zh: "超大参数规模", en: "Huge scale" }, { zh: "数亿～万亿参数，能表达复杂的语言与知识结构", en: "Hundreds of millions to trillions of parameters" } ],
          [ { zh: "大规模预训练数据", en: "Massive pretraining data" }, { zh: "网页、百科、代码、论文等全网文本", en: "Web pages, encyclopedias, code, papers" } ],
          [ { zh: "统一训练范式", en: "Unified paradigm" }, { zh: "通过统一的「语言建模任务」学到泛化能力", en: "One language-modeling objective, broad generalization" } ],
          [ { zh: "多任务适应性", en: "Multi-task" }, { zh: "问答、翻译、摘要、对话…一个模型全包", en: "One model for Q&A, translation, summarization, chat" } ],
          [ { zh: "可微调", en: "Fine-tunable" }, { zh: "在特定数据或任务上继续训练以提升性能", en: "Further training on specific data/tasks" } ]
        ] },
        { t: "table", label: { zh: "发展关键节点", en: "Key milestones" }, head: [
          { zh: "年份", en: "Year" }, { zh: "模型", en: "Model" }, { zh: "特征", en: "Trait" }
        ], rows: [
          [ { zh: "2018", en: "2018" }, { zh: "BERT", en: "BERT" }, { zh: "Transformer 结构 + 双向语言建模", en: "Transformer + bidirectional language modeling" } ],
          [ { zh: "2020", en: "2020" }, { zh: "GPT-3", en: "GPT-3" }, { zh: "1750 亿参数，Few-shot 能力大放异彩", en: "175B params, few-shot shines" } ],
          [ { zh: "2022", en: "2022" }, { zh: "ChatGPT / GPT-3.5", en: "ChatGPT / GPT-3.5" }, { zh: "对话微调（SFT + RLHF），实用性爆发", en: "SFT + RLHF, practical assistant" } ],
          [ { zh: "2023", en: "2023" }, { zh: "GPT-4、Claude、LLaMA", en: "GPT-4, Claude, LLaMA" }, { zh: "多模态输入、长文本、多语言", en: "Multimodal input, long context" } ],
          [ { zh: "2024-2026", en: "2024-2026" }, { zh: "原生多模态、推理模型", en: "Native multimodal, reasoning" }, { zh: "工具调用、Agent 化发展", en: "Tool use, agentic evolution" } ]
        ] },
        { t: "table", label: { zh: "大模型 vs 传统小模型", en: "Foundation vs traditional models" }, head: [
          { zh: "特征", en: "Aspect" }, { zh: "传统小模型", en: "Traditional" }, { zh: "大模型", en: "Foundation model" }
        ], rows: [
          [ { zh: "训练数据", en: "Data" }, { zh: "一种任务的少量数据", en: "Small, task-specific" }, { zh: "全网大规模文本", en: "Massive web-scale text" } ],
          [ { zh: "参数规模", en: "Scale" }, { zh: "万～千万", en: "10k – 10M" }, { zh: "十亿～万亿", en: "1B – 1T" } ],
          [ { zh: "应用范围", en: "Scope" }, { zh: "单一任务", en: "One task" }, { zh: "多任务、多语言、多模态", en: "Multi-task, multi-language, multimodal" } ],
          [ { zh: "适应方式", en: "Adaptation" }, { zh: "从头训练", en: "Train from scratch" }, { zh: "微调、提示工程、检索增强", en: "Fine-tune, prompt, RAG" } ],
          [ { zh: "泛化能力", en: "Generalization" }, { zh: "弱，易过拟合", en: "Weak, overfits" }, { zh: "强，可 Zero / Few-shot", en: "Strong, zero/few-shot" } ]
        ] },
        { t: "fig", src: "images/learn/learn-llm-compare.jpg", alt: "大小模型对比", caption: { zh: "从训练数据、参数规模到泛化能力，大模型与小模型差别巨大。", en: "From data, scale to generalization, foundation models differ hugely from small ones." } },
        { t: "sub", zh: "大模型的应用技术", en: "Using foundation models" },
        { t: "list", label: { zh: "让大模型「学以致用」的几板斧", en: "Ways to put an LLM to work" }, items: [
          { zh: "提示工程（Prompt）：设计指令引导输出，如「让我们一步步思考」", en: "Prompt engineering: craft instructions, e.g. \"let's think step by step\"" },
          { zh: "检索增强生成（RAG）：回答前先从外部知识库检索，现查现用，缓解幻觉", en: "RAG: retrieve from external knowledge before answering — reduces hallucination" },
          { zh: "思维链（CoT）：让模型先列出推理步骤再作答，提升复杂问题可靠性", en: "Chain-of-thought: reason step by step before answering" },
          { zh: "监督微调（SFT）：用高质量问答对教模型「懂人话」", en: "SFT: teach the model to follow instructions with QA pairs" },
          { zh: "RLHF：基于人类反馈强化学习，让回答更有用、诚实、无害", en: "RLHF: align answers to be helpful, honest, harmless" }
        ] },
        { t: "callout", label: { zh: "大模型三步走", en: "Three stages" }, zh: "预训练（读遍全网，学会语言规律）→ 后训练（SFT + RLHF，从「书呆子」变成「助手」）→ 应用优化（提示工程、RAG、思维链，部署到真实场景）。", en: "Pretraining (read the web, learn language) → post-training (SFT + RLHF, from \"nerd\" to \"assistant\") → application (prompting, RAG, chain-of-thought, deployment)." }
      ]
    }
  ];

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }

  function isEn() { return window.SIGNAL_LANG === "en"; }
  function T(s) { return window.t ? window.t(s) : s; }
  function pick(o) { return isEn() ? (o.en || o.zh) : o.zh; }

  function iconBolt() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>';
  }

  function renderBlock(b, hue) {
    switch (b.t) {
      case "p":
        return '<p class="l-p">' + esc(pick(b)) + "</p>";
      case "sub":
        return "<h3 class=\"l-sub\">" + esc(pick(b)) + "</h3>";
      case "list":
        return (
          "<div class=\"l-block\">" +
            (b.label ? '<div class="l-block-label">' + esc(pick(b.label)) + "</div>" : "") +
            '<ul class="l-list">' +
              b.items.map(function (i) { return "<li>" + esc(pick(i)) + "</li>"; }).join("") +
            "</ul>" +
          "</div>"
        );
      case "terms":
        return (
          "<div class=\"l-block\">" +
            (b.label ? '<div class="l-block-label">' + esc(pick(b.label)) + "</div>" : "") +
            '<dl class="l-terms">' +
              b.items.map(function (it) {
                return '<div class="l-term"><dt>' + esc(pick(it.name)) + "</dt><dd>" + esc(pick(it.def)) + "</dd></div>";
              }).join("") +
            "</dl>" +
          "</div>"
        );
      case "table":
        return (
          "<div class=\"l-block\">" +
            (b.label ? '<div class="l-block-label">' + esc(pick(b.label)) + "</div>" : "") +
            '<div class="lg-wrap"><table class="lg-table">' +
              "<thead><tr>" + b.head.map(function (h) { return "<th>" + esc(pick(h)) + "</th>"; }).join("") + "</tr></thead>" +
              "<tbody>" + b.rows.map(function (r) {
                return "<tr>" + r.map(function (c) { return "<td>" + esc(pick(c)) + "</td>"; }).join("") + "</tr>";
              }).join("") + "</tbody>" +
            "</table></div>" +
          "</div>"
        );
      case "callout":
        return (
          '<aside class="l-callout" style="--lh:' + hue + '">' +
            '<div class="l-callout-head">' + iconBolt() + '<span>' + esc(pick(b.label)) + "</span></div>" +
            '<div class="l-callout-body"><p>' + esc(pick(b)) + "</p></div>" +
          "</aside>"
        );
      case "fig":
        return (
          '<figure class="l-fig" style="--lh:' + hue + '">' +
            '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || "") + '" loading="lazy">' +
            "<figcaption>" + esc(pick(b.caption)) +
              '<span class="l-fig-credit">' + (isEn() ? "Source: course slides" : "来源：课程课件") + "</span>" +
            "</figcaption>" +
          "</figure>"
        );
    }
    return "";
  }

  function renderLesson(l, idx) {
    var prev = LESSONS[idx - 1];
    var divider = !prev || prev.part !== l.part
      ? '<div class="lesson-part" id="part-' + l.part + '">' +
          '<span class="lesson-part-no">' + esc(PARTS[l.part].no) + "</span>" +
          "<h2>" + esc(isEn() ? PARTS[l.part].en : PARTS[l.part].zh) + "</h2>" +
        "</div>"
      : "";
    return (
      divider +
      '<article class="lesson" id="' + esc("c" + l.no) + '" style="--lh:' + l.hue + '">' +
        '<header class="lesson-head">' +
          '<span class="lesson-no" aria-hidden="true">' + esc(l.no) + "</span>" +
          '<div class="lesson-head-main">' +
            "<h2 class=\"lesson-title\">" + esc(isEn() ? l.en : l.zh) + "</h2>" +
            '<p class="lesson-lead">' + esc(pick(l.lead)) + "</p>" +
            '<div class="lesson-tags">' +
              (l.tags || []).map(function (tag) { return "<span>" + esc(pick(tag)) + "</span>"; }).join("") +
            "</div>" +
          "</div>" +
        "</header>" +
        '<div class="lesson-body">' +
          l.blocks.map(function (b) { return renderBlock(b, l.hue); }).join("") +
        "</div>" +
        renderPager(idx) +
      "</article>"
    );
  }

  function renderNav() {
    var nav = document.getElementById("tut-nav");
    if (!nav) return;
    var html = "";
    PARTS.forEach(function (p, pi) {
      var lessons = LESSONS.filter(function (l) { return l.part === pi; });
      if (!lessons.length) return;
      html += '<div class="tut-nav-group">' +
        "<h4>" + esc(p.no) + " · " + esc(isEn() ? p.en : p.zh) + "</h4>";
      html += lessons.map(function (l) {
        return '<a href="#c' + esc(l.no) + '" data-lid="' + esc("c" + l.no) + '">' +
          '<span class="tut-no">' + esc(l.no) + "</span>" +
          esc(isEn() ? l.en : l.zh) +
        "</a>";
      }).join("");
      html += "</div>";
    });
    nav.innerHTML = html;
  }

  function pagerBtn(idx, label, dir) {
    var l = LESSONS[idx];
    if (!l) return '<span class="lp-btn off"></span>';
    return '<a class="lp-btn' + (dir === "right" ? " right" : "") + '" href="#c' + esc(l.no) + '">' +
      '<span class="lp-dir">' + esc(T(label)) + "</span>" +
      '<span class="lp-name">' + esc(l.no) + " · " + esc(isEn() ? l.en : l.zh) + "</span>" +
    "</a>";
  }

  function renderPager(idx) {
    return '<nav class="lesson-pager" aria-label="' + (isEn() ? "Chapter navigation" : "课程导航") + '">' +
      pagerBtn(idx - 1, "上一章") +
      pagerBtn(idx + 1, "下一章", "right") +
    "</nav>";
  }

  function headerOffset() {
    var h = document.querySelector(".site-header");
    return h ? h.offsetHeight : 0;
  }

  function updateSpy() {
    var nav = document.getElementById("tut-nav");
    var links = nav ? nav.querySelectorAll("a") : [];
    if (!links.length) return;
    var offset = headerOffset() + 24;
    var current = LESSONS[0];
    for (var i = 0; i < LESSONS.length; i++) {
      var el = document.getElementById("c" + LESSONS[i].no);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= offset) current = LESSONS[i];
      else break;
    }
    var lid = "c" + current.no;
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle("active", links[j].getAttribute("data-lid") === lid);
    }
    var cur = document.getElementById("crumb-cur");
    if (cur) cur.textContent = isEn() ? "Lesson " + current.no : "第 " + current.no + " 章";
  }

  var spyTimer = null;
  function onScroll() {
    if (spyTimer) return;
    spyTimer = window.requestAnimationFrame(function () {
      spyTimer = null;
      updateSpy();
    });
  }

  function renderAll() {
    var toc = document.getElementById("lesson-toc");
    if (toc) {
      var html = "";
      PARTS.forEach(function (p, pi) {
        var lessons = LESSONS.filter(function (l) { return l.part === pi; });
        if (!lessons.length) return;
        html += '<span class="lesson-toc-part">' + esc(isEn() ? p.en : p.zh) + "</span>";
        html += lessons.map(function (l) {
          return '<a href="#c' + esc(l.no) + '"><span class="toc-no">' + esc(l.no) + "</span>" + esc(isEn() ? l.en : l.zh) + "</a>";
        }).join("");
      });
      toc.innerHTML = html;
    }
    renderNav();
    var ls = document.getElementById("lessons");
    if (ls) ls.innerHTML = LESSONS.map(renderLesson).join("");
    updateSpy();
  }

  document.addEventListener("DOMContentLoaded", renderAll);
  document.addEventListener("signal:lang", renderAll);
  window.addEventListener("scroll", onScroll, { passive: true });
})();
