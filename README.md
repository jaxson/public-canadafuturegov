# Canada.ca 2.0 (canadafuturegov.ca)

An independent concept for a new Government of Canada front door. Ask a question in
English or French and get a short, plain-language answer with links, drawn only from
canada.ca and gc.ca pages.

Live at **[canadafuturegov.ca](https://canadafuturegov.ca)**.

Not affiliated with or endorsed by the Government of Canada. For official services, go to
[canada.ca](https://www.canada.ca).

## Why

On September 29, 2026, the United States launched America.gov, an AI front door that pulls
29,000 federal websites into one place. This site is a "yes, and": Canadians deserve the
same, and the bigger gains sit behind the website. The page's commentary covers what that
could look like, from "tell us once" and benefits that find you to secure public APIs and
digitized processes.

## What it does

- **Ask anything about federal services.** Answers come from a live search of canada.ca and
  gc.ca, with the official pages listed as sources.
- **Life events.** Starting points for moments like having a baby, losing a job, retiring or
  moving to Canada, which cut across departments.
- **What's next.** Concept screens with sample data for tell-us-once address changes,
  application tracking, benefits that find you and pre-filled forms.
- **Bilingual.** Every visible string exists in English and French, and answers follow the
  language of the question.

## Guardrails

- **Official sources only.** Web search is restricted to canada.ca and gc.ca, the source
  list is filtered to those domains, and links in answers only render for official pages.
- **Federal programs only.** Questions outside government programs, services and benefits,
  including political opinions, hateful content and attempts to change the instructions,
  get a fixed reply from the server rather than a model-written one. Any reply written
  without first searching official pages gets the same fixed reply.
- **Non-partisan.** The site describes what programs offer. It does not comment on
  politicians, parties, elections or policy debates.
- **Private.** No accounts, no tracking and no ads. Questions and answers are not stored
  or logged; the function logs token counts only, and the conversation lives only in the
  browser tab. Questions are sent to Anthropic's API to write the answer. Asked whether it
  stores personal information, the site gives a fixed, accurate reply rather than a
  model-written one.
- **Demo limits.** 15 questions per visitor per day and a daily total cap. Counters are keyed
  by a hash of the IP address with a random salt that changes daily, and each day's salt
  and counters are deleted the next day.

## Accessibility

Built to WCAG 2.2 AA and checked with axe in light mode, dark mode and French on mobile.
Works with screen readers, keyboards and zoom.

## How it works

```
public/
  index.html          the whole page, with .en and .fr copies of every string
  assets/app.js       language toggle, chat client, escaping markdown renderer
  assets/styles.css   design tokens, light default with an optional dark mode
  assets/theme.js     applies the saved theme before first paint
netlify/functions/
  ask.mjs             POST /api/ask: calls Claude with web search, streams NDJSON
netlify.toml          publish settings and a strict Content Security Policy
```

There is no build step. Netlify serves `public/` and bundles the one function. The function
calls Claude (Anthropic) with the web search tool limited to official domains, caps tokens
and searches per question, and streams status, answer text and sources back to the page.
Daily usage counters live in Netlify Blobs.

The Content Security Policy allows no inline or third-party scripts; Google Fonts is the
only external asset.

## Run locally

Requires Node.js and the [Netlify CLI](https://docs.netlify.com/cli/get-started/).

```bash
npm install
ANTHROPIC_API_KEY=... netlify dev
```

The page and `/api/ask` run on http://localhost:8888. Pushing to `main` deploys to Netlify.
