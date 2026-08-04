# AGENTS.md

Static multi-page AI news aggregator (SIGNAL). Pure HTML/CSS/JS, no framework, no
build step. Pages: `index.html` (news), `links.html` (site navigation),
`history.html` (AI history timeline). Data comes from `feeds.json` (RSS snapshot)
+ `articles.json` (full-text snapshot for reader mode), both produced in CI by
GitHub Actions and read same-origin. HN / DEV.to are fetched live via their APIs.

## Current state

- News engine: `app.js` (load, dedupe, classify, heat, render, reader mode, giscus).
- Theme system: `common.js` + `styles.css` (`signal-theme` localStorage,
  `data-theme` on `<html>`: paper / midnight / aurora / ink / auto).
- CI: `.github/workflows/feeds.yml` — cron `*/15 * * * *` + `workflow_dispatch`;
  builds `feeds.json` + `articles.json` via `scripts/build-feeds.mjs` and
  `scripts/build-articles.mjs` (Node + fast-xml-parser + cheerio), commits as
  signal-bot.
- Browser CORS reality: only allorigins works client-side and it is heavily
  rate-limited; r.jina.ai / codetabs / corsproxy / cors.eu.org are unreliable or
  blocked. Full-text fetching therefore happens server-side in CI only.
- Git: initialized with `main` branch, remote `origin` =
  `git@github.com:JosiahBristow/ai-signal.git` (SSH). Hosted on GitHub
  Pages (project site) at `https://josiahbristow.github.io/ai-signal/`
  once Pages is enabled for branch `main`, root `/`. `.nojekyll` present so
  Pages serves the static files directly. `feeds.yml` runs on push to `main` and
  on schedule; signal-bot commits snapshot refreshes — always `git pull --rebase`
  before pushing.

## Commands

- Install script deps (Node 20+): `npm install` in `scripts/` (installs
  fast-xml-parser + cheerio; lockfile committed).
- Build RSS snapshot: `node scripts/build-feeds.mjs`
- Build full-text snapshot: `node scripts/build-articles.mjs` (reads `feeds.json`,
  fetches top articles, sanitizes via cheerio whitelist, writes `articles.json`)
- Syntax check: `node --check app.js common.js history.js scripts/*.mjs`
- Smoke test (jsdom, mock fetch): `node /tmp/opencode/ai-test/smoke.js` — asserts
  pages render, snapshot-first feed loading, category chips, reader mode
  (open/render/close/fallback), history/links pages.

## Guidance

- Keep the site zero-dependency at runtime; all Node deps stay under `scripts/`.
- `articles.json` content is sanitized server-side (whitelist tags, `http(s)` URLs
  only, no `javascript:` hrefs, attributes stripped) before being rendered via
  `innerHTML` in the reader panel.
- If the project is initialized as a git repo, note any branch/PR/release workflow
  here once it is established.
