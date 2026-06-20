# TDR Community Feedback

Static feedback debrief site for **The Division: Resurgence** community review work.

This repository turns Discord forum feedback threads into structured assessments and publishes them as a Cloudflare Pages site at:

https://tdr-feedback.imaj.es/

The goal is to give the development team a reviewable, source-linked summary of player asks, sentiment, and recurring issues without needing to read every raw Discord thread.

## What Is In This Repo

```text
.
|-- assessments/              # Published Markdown assessments, one per feedback thread
|-- docs/
|   |-- site-structure.md     # Routing model, buckets, page templates, and stats
|   `-- design-system/        # Visual system, tokens, components, and UI kit reference
|-- site/                     # Static site source, tests, build script, and Pages config
|-- threads/                  # Raw Discord thread exports as JSONL
|-- tools/                    # Discord export and attachment helper scripts
`-- output/                   # Local generated/scratch output; ignored by git
```

## Content Model

The public site is generated from `assessments/*.md`. Each assessment is expected to include the thread metadata, ask type, summary, primary asks, volume, sentiment, key comments, and editorial assessment sections that `site/scripts/build.mjs` parses into route data.

The raw Discord exports in `threads/*.jsonl` are retained as source evidence. Screenshot and attachment evidence for the typo/polish thread lives under `assessments/screenshots/spot-a-typo/`.

The route and bucket model is documented in `docs/site-structure.md`.

## Local Workflow

Prerequisite: Node.js 22 or newer.

Run the full site check from the `site/` package:

```sh
cd site
npm run check
```

Run the individual commands when iterating:

```sh
cd site
npm run test
npm run build
```

The build writes static output to `site/dist/`. That directory is ignored by git and can be regenerated at any time.

## Deployment

The site deploys to Cloudflare Pages from the `main` branch via `.github/workflows/cloudflare-pages.yml`.

Required repository secrets:

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token with Cloudflare Pages deploy access |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier |

Current Pages settings:

| Setting | Value |
| --- | --- |
| Project name | `tdr-feedback` |
| Build command | `node site/scripts/build.mjs` |
| Build output directory | `site/dist` |

## Refreshing Source Data

The helper scripts in `tools/` are for collecting Discord evidence:

| Script | Purpose |
| --- | --- |
| `tools/fetch-discord-threads.js` | Browser-console scraper that exports forum threads to JSONL |
| `tools/download-thread-attachments.py` | Downloads attachments for a Discord thread into a local evidence folder |

Do not commit Discord tokens or private credentials. `tools/download-thread-attachments.py` reads `DISCORD_TOKEN` from the environment or prompts locally.

After refreshing source data:

1. Add or update the relevant `threads/*.jsonl` files.
2. Update the matching `assessments/*.md` summaries and evidence links.
3. Confirm the route still exists in `docs/site-structure.md` and `site/scripts/build.mjs`.
4. Run `npm run check` from `site/`.
5. Commit source assessment changes, not generated `site/dist/` output.

## Project Links

| Resource | URL |
| --- | --- |
| Published site | https://tdr-feedback.imaj.es/ |
| GitHub repository | https://github.com/imajes/tdr-feedback |
| TDR team Trello board | https://trello.com/b/qTP1a9cv |

