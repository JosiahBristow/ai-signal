# AI SIGNAL · 实时 AI 新闻聚合台

纯前端、零依赖、多主题的中英双语 AI 新闻聚合站。无服务器、无追踪：GitHub Actions
定时抓取 RSS 与头条全文生成静态快照，页面直接同源读取，HN / DEV.to 走官方 API。

> 在线站点：<https://josiahbristow.github.io/ai-signal/>

## 功能特性

- **实时聚合** — TechCrunch AI、The Verge AI、量子位、36氪（AI 关键词过滤）+ Hacker News、DEV.to
- **快照优先** — CI 每 15 分钟生成 `feeds.json`，浏览器同源读取，绕开浏览器 CORS 限制
- **站内阅读** — 全文快照 `articles.json` 支持在站内直接读原文（服务端白名单消毒后渲染，无快照时自动回退新标签页）
- **智能分类** — 模型发布 / 融资商业 / 政策监管 / 安全风险 / 芯片算力 / 机器人 / 研究 / 应用 / 其他，共 9 类自动归类
- **头条与热门** — 大头条区、热门 TOP5、滚动信号流 ticker
- **搜索与筛选** — 关键词搜索 + 按语言 / 分类 / 来源过滤
- **多主题** — 晨报 / 午夜 / 极光 / 墨绿 + 跟随系统，localStorage 记忆
- **评论** — Giscus 接入（需填写配置后启用）
- **自动刷新** — 默认每 5 分钟同步，切回页面立即更新

## 页面

| 页面 | 说明 |
| --- | --- |
| `index.html` | 新闻首页（头条 / 热门 / 信号流 / 卡片列表 / 站内阅读） |
| `links.html` | AI 网站导航 |
| `history.html` | AI 发展历史时间线 |

## 技术栈

- 运行时：纯 HTML / CSS / JavaScript，无框架、无构建步骤
- CI 构建脚本（Node 20+）：`fast-xml-parser`（RSS/Atom 解析）、`cheerio`（全文抽取与消毒）
- 数据源：RSS/Atom 快照 + Hacker News / DEV.to 官方 API

## 工作原理

```
GitHub Actions (cron */15 + push to main)
   │
   ├─ scripts/build-feeds.mjs   抓取 4 个 RSS 源 ──► feeds.json
   │
   └─ scripts/build-articles.mjs 抓取头条全文 ──► articles.json
                                                     │
浏览器 (GitHub Pages 同源读取)  ◄────────────────────┘
  ├─ feeds.json    ── 头条 / 卡片 / 信号流
  ├─ articles.json ── 站内阅读模式
  ├─ HN / DEV.to   ── 浏览器直接请求官方 API
  └─ Giscus        ── 评论
```

## 目录结构

```
.
├── index.html        # 新闻首页
├── links.html        # 网站导航
├── history.html      # 发展历史
├── styles.css        # 多主题设计系统
├── common.js         # 主题切换 / 导航高亮
├── app.js            # 新闻引擎（加载/去重/分类/热度/渲染/读模式/评论）
├── feeds.json        # RSS 快照（CI 生成）
├── articles.json     # 全文快照（CI 生成）
├── .github/workflows/feeds.yml  # 定时构建 + 提交
└── scripts/
    ├── build-feeds.mjs      # RSS 快照构建
    ├── build-articles.mjs   # 全文快照构建
    └── package.json         # 仅构建期依赖
```

## 本地开发

```bash
# 安装脚本依赖（Node 20+）
cd scripts && npm install

# 构建 RSS 快照
node scripts/build-feeds.mjs

# 构建全文快照
node scripts/build-articles.mjs

# 语法检查
node --check app.js common.js history.js scripts/*.mjs

# 冒烟测试（jsdom + mock fetch）
node /tmp/opencode/ai-test/smoke.js
```

预览站点可直接用任意静态服务器，例如 `python3 -m http.server`。

## 部署（GitHub Pages）

1. 推送到仓库 `main` 分支
2. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**
3. 等待几分钟后访问 `https://<username>.github.io/<repo>/`

仓库已包含 `.nojekyll`，Pages 会直接以纯静态方式提供服务。`feeds.yml`
在 push 与定时调度时会自动刷新快照并提交。

## 配置

- **Giscus 评论**：在 `app.js` 中填写 `GISCUS` 对象（`repo` / `repoId` /
  `category` / `categoryId`）。未配置时评论区显示友好提示。
- **数据源**：在 `app.js` 的 `SOURCES` 与 `scripts/build-feeds.mjs` 的 `FEEDS`
  中增删。
- **主题**：`common.js` + `styles.css` 中的 CSS 变量。

## 免责声明

本站仅聚合链接与摘要，所有内容版权归原网站所有。全文快照用于站内阅读，请在
15 分钟快照周期内以原文为准。
