# TDR Feedback Site

Static Cloudflare Pages site for `https://tdr-feedback.imaj.es/`.

## Source

- `../assessments/*.md` is the source of truth for published feedback.
- `../docs/site-structure.md` defines the route and review-lane model.
- `../docs/design-system` provides tokens, brand assets, and visual rules.

## Build

Run from the repo root:

```sh
node site/scripts/build.mjs
```

The build writes generated output to `site/dist/`. That directory is ignored and can be regenerated at any time.

## Cloudflare Pages

Recommended Pages settings:

| Setting | Value |
| --- | --- |
| Project name | `tdr-feedback` |
| Production branch | `main` |
| Build command | `node site/scripts/build.mjs` |
| Build output directory | `site/dist` |

If the Cloudflare project root is set to `site`, use:

| Setting | Value |
| --- | --- |
| Build command | `node scripts/build.mjs` |
| Build output directory | `dist` |

The GitHub Actions workflow in `.github/workflows/cloudflare-pages.yml` deploys on pushes to `main`. It requires these repository secrets:

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token with Cloudflare Pages deploy access |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier |
