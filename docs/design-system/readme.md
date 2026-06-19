# TDR Community Feedback — Design System

A dark-mode, "field ops debrief" design system for **TDR Community Feedback**: an internal site that consolidates player feedback from **The Division: Resurgence** community forum threads. It distils ~25 discussion threads across four buckets — **Specs, Balance, Features, Bug Reports** — into ranked, attributed asks for the game's developers.

**Audience:** game developers reviewing community sentiment. **Tone:** structured, data-forward, tactical — a debrief, not a consumer app.

> **Sources:** This system was built from a written brief only — no codebase, Figma, or existing brand assets were provided. The wordmark/mark in `assets/brand/` and all sample content are original placeholders. If real brand assets, font files, or product screenshots exist, share them and they'll replace the placeholders.

---

## CONTENT FUNDAMENTALS

How copy is written across the product:

- **Voice:** analytical and third-person about the community ("Players consistently flag…", "The community broadly agrees…"). The site speaks *about* players to developers — not *to* players. Avoid "you"; avoid first-person "we" except in internal notes.
- **Asks are synthesised, quotes are verbatim.** An **ask** is one declarative sentence stating a request ("Add a stash search and tag filter…"). A **quote** is the player's exact words, never paraphrased or cleaned up — keep slang, abbreviations (TTK, DZ), and frustration intact.
- **Casing:** Sentence case for headings and body. UPPERCASE only for short labels/eyebrows/badges (e.g. "BUG REPORTS", "NET POSITIVE") with wide letter-spacing.
- **Data is foreground.** Counts, thread IDs, mention totals and timestamps are shown in **monospace** so they read as instrument data: `THREAD-014 · 64 mentions · Mar 14 2:08 PM`.
- **Attribution is explicit.** Every ask says who raised it — a username (`Ghost_Recon +40`), a tally (`18 players`), or a span (`18 threads`).
- **No emoji, no exclamation marks, no hype.** Sentiment is expressed through the muted sentiment palette and shape glyphs (▲ ▼ ■ ◆), not punctuation. Terse, verb-led CTAs ("Open thread", "Add to Trello board").
- **Numbers:** abbreviate large counts (`1.3k`), use tabular figures so metric columns align.

Example eyebrow → headline → support:
> THE DIVISION: RESURGENCE · COMMUNITY DEBRIEF
> **Consolidated player feedback, read like a field report.**
> 25 active forum threads, distilled into ranked asks across specs, balance, features and bug reports — sourced verbatim from the community.

---

## VISUAL FOUNDATIONS

- **Background:** near-black `#0d1117` (GitHub-dark). Depth is built from **surface steps** (`#11161d → #161b22 → #1c2128 → #21262d`) plus 1px hairline borders (`#2a313a`) — *not* from heavy shadows. No gradients on backgrounds; no imagery behind text. The page is flat, dense and instrument-like.
- **Accent:** desaturated **orange-amber** `#d28e54` — used for the single primary action, the brand mark, quote-block rails, and key eyebrows. Used sparingly; it is a signal colour, not decoration.
- **Secondary:** cold **blue** `#5b94c2` — outlines, the external Trello CTA, "mixed" sentiment, the Features bucket.
- **Sentiment palette (reserved):** muted teal `#4f9e8c` (positive), warm red-orange `#cf6a4f` (negative), slate `#7c8794` (neutral), cold blue (mixed). Each carries a **shape glyph** (▲▼■◆) so sentiment survives colour-blindness and greyscale. Never reuse these hues as general UI accents.
- **Category hues:** specs = muted violet, balance = dull gold, features = blue, bugs = red. Shown as a small swatch on an otherwise-neutral chip so badge rows stay calm, not rainbow.
- **Type:** **Montserrat** (600/700) for all headings, labels and numbers — tight tracking (`-0.02em`) on large sizes, wide tracking (`0.08em`, uppercase) on small labels. **Source Sans 3** (400, occasional italic) for body and quotes. **JetBrains Mono** for data, IDs, timestamps.
- **Spacing:** 4px base grid. Layout is tight and structured; generous vertical rhythm between sections (48–72px), compact within cards.
- **Radii (restrained):** 4px chips/badges, 6px buttons, 8px cards, pill for sentiment + avatars. Nothing softer — corners stay tactical.
- **Cards:** `surface-2` fill, 1px `border` hairline, 8px radius, no shadow at rest. **Hover** lifts the fill to `surface-3` and the border to `border-strong` — a subtle surface change, never a glow or scale. Cursor-pointer cards transition `all 180ms` on an ease-out curve.
- **Quote block:** sunken `surface-1` fill with a **3px left accent rail** (amber, or tinted to match sentiment), avatar, bold accent username, faint mono timestamp — a Discord message recast in the debrief palette.
- **Shadows:** minimal. `shadow-lg` only for overlays/popovers; an accent **glow** is reserved for focus states. Elevation reads through surface steps first.
- **Borders over fills.** Secondary buttons, badges and dividers lean on hairline borders rather than filled blocks.
- **Motion:** restrained. 120–180ms ease-out on hover/press and view changes; fades and small surface shifts only. **No bounces, no infinite loops, no decorative animation.** Press state = slightly darker fill / `accent-dim`, never a large shrink.
- **Transparency & blur:** the sticky top nav uses a translucent `surface-2` with an 8px backdrop-blur. Otherwise surfaces are opaque.
- **Focus:** 2px `accent-bright` ring offset by the page colour — visible, tactical, accessible.
- **Imagery vibe:** if photography is added it should read cool, desaturated and high-contrast to sit on the near-black base. There is currently no stock imagery — the system is type-, data- and component-led.

---

## ICONOGRAPHY

- **Icon set:** **Lucide** (outline, 2px stroke), loaded from CDN (`unpkg.com/lucide`). Its thin, geometric, monoline style matches the tactical, low-chrome aesthetic. **Substitution flag:** no brand icon set was provided, so Lucide is the chosen default — swap if you have a house set.
- **Usage:** icons appear in `MetricCard` chips, bucket tiles, section labels, and inline meta rows (reply counts, quote counts). Sizes 13–26px; colour inherits or uses a category/accent hue inside a tinted square chip.
- **Sentiment glyphs** are **Unicode geometric shapes** (▲ ▼ ■ ◆), not icons — they double as a non-colour sentiment signal inside `SentimentBadge`.
- **Brand mark:** a rotated-square **diamond** in accent amber (`assets/brand/mark.svg`) with the `TDR / FEEDBACK` lockup (`assets/brand/logo.svg`). Placeholder — replace with a real mark if one exists.
- **No emoji** anywhere in product UI.

---

## INDEX — what's in this system

**Foundations**
- `styles.css` — root entry point (consumers link this). `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `fonts.css`.
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `assets/brand/` — `logo.svg`, `mark.svg` (placeholders).

**Components** (`window.TDRCommunityFeedbackDesignSystem_42173e`)
- `components/core/` — **Button**, **Avatar**
- `components/feedback/` — **MetricCard**, **QuoteBlock**, **AskCard**, **SentimentBadge**, **CategoryBadge**
- `components/navigation/` — **TopNav**

Each component dir has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and a `@dsCard` showcase HTML.

**UI kit**
- `ui_kits/feedback-site/` — interactive Homepage → Bucket → Thread click-through (`index.html` + `Homepage.jsx`, `BucketView.jsx`, `ThreadView.jsx`, `data.js`).

**Other**
- `SKILL.md` — Agent-Skills-compatible entry point.

> **Fonts:** Montserrat, Source Sans 3 and JetBrains Mono are loaded from Google Fonts (`tokens/fonts.css`). To self-host, drop `.woff2` files in `assets/fonts/` and replace the `@import` with local `@font-face` rules.
