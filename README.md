# Canada.ca 2.0 (canadafuturegov.ca)

An independent concept for a new Government of Canada front door. Ask a question in
English or French and get a short answer with links, drawn only from canada.ca and gc.ca
pages. Built as a "yes, and" to America.gov, with commentary on what has to change
behind the website.

Not affiliated with or endorsed by the Government of Canada.

## Run locally

```bash
npm install
ANTHROPIC_API_KEY=... netlify dev
```

## Stack

Static HTML, CSS and JavaScript. One Netlify Function calls Claude (Anthropic) with web
search limited to official Government of Canada domains and streams the answer back.
