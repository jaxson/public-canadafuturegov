# CLAUDE.md

Canada.ca 2.0 (canadafuturegov.ca): an independent concept for an AI-enabled Government of Canada front
door, built as a "yes, and" response to America.gov (launched 2026-09-29). Not an official
site; the notice bar and footer must always say so. Never use the Canada wordmark, the
Government of Canada FIP signature, or anything that could pass as an official page.

## Commands

```bash
npm install
netlify dev          # page plus the /api/ask function on :8888
git push             # deploys (Netlify is connected to jaxson/public-canadafuturegov)
```

No build step. `netlify.toml` publishes `public/` and bundles `netlify/functions/`.

## Architecture

- `public/index.html`: the whole page. Bilingual by duplication: every visible string has
  a `.en` and a `.fr` span, and CSS hides the inactive language. Add both or neither.
- `public/assets/app.js`: language toggle, placeholder rotation, department marquee,
  the streaming chat client, and a small escaping markdown renderer. Never insert model
  text with innerHTML except through `renderMarkdown`, which escapes first.
- `public/assets/styles.css`: tokens on `:root`. Light is the default; dark applies only
  when the visitor picks it in the Menu (`data-theme`, saved by `theme.js` before paint).
- Header: Français stays its own button; everything else lives in the one Menu disclosure.
- `netlify/functions/ask.mjs`: POST `/api/ask`, streams NDJSON events
  (`status`, `quota`, `text`, `reset`, `sources`, `error`, `done`, `ping`). Claude Opus 5.5 with the
  `web_search_20260209` server tool restricted to `canada.ca` and `gc.ca`.

## Rules

- Model is `claude-opus-5-5` for launch quality (2026-09-30). Sonnet 5.5 is the planned
  cheaper setting; do not change either way without asking the owner. No server-side
  fallbacks, so a decline never reroutes to another model.
- Demo limits: 15 questions per visitor per day and 300 in total per day, counted in
  Netlify Blobs (store `demo-usage`) under an HMAC of the IP with a random daily salt; each
  day's salt and counters are deleted the next day. The page states the
  limit, and the function returns `demo-limit` or `demo-closed` when it is reached.
- Token caps live at the top of `ask.mjs`: 1,500 output tokens, 3 searches, thinking off
  (Opus always thinks), low effort, 1 continuation, and a 60k input stop. Each request logs
  token counts only (never question text) to Netlify function logs.
- `ANTHROPIC_API_KEY` lives only in Netlify env. Never in the repo or the browser.
- Strict CSP in `netlify.toml`: no inline scripts or styles, no third-party scripts.
  Fonts from Google Fonts are the only external asset.
- Accessibility bar is WCAG 2.2 AA with zero axe violations in light, dark and mobile
  French. Re-run an axe pass after layout changes.
- Do not log question text. The footer promises the site keeps no logs of questions.
- Scope and privacy replies are fixed text in `ask.mjs` (`SCOPE_MESSAGE`, `PRIVACY_MESSAGE`),
  triggered by markers the model returns or by a reply written without a search. Keep the
  privacy text accurate if storage or logging ever changes.
- Facts in the commentary were verified 2026-09-29/30 against pm.gc.ca, canada.ca,
  digital.canada.ca (CanadaLogin) and america.gov. Re-verify before changing any claim.
