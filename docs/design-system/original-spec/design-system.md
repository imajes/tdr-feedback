# TDR Feedback Site — Design System Spec

## Aesthetic Direction

Field ops debrief. Dark, structured, data-forward. Not a consumer app, not a game marketing site — closer to an internal dashboard that happens to be public. The visual language should feel like the game's tactical UI translated into editorial form.

---

## Colour Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0d1117` | Page background |
| `--bg-surface` | `#161b22` | Cards, panels |
| `--bg-raised` | `#21262d` | Inputs, quote blocks, hover states |
| `--border` | `#30363d` | Dividers, card outlines |
| `--text-primary` | `#e6edf3` | Body text |
| `--text-secondary` | `#8b949e` | Labels, timestamps, meta |
| `--text-muted` | `#484f58` | Disabled, placeholder |
| `--accent` | `#d4820a` | CTAs, highlighted usernames, active nav |
| `--accent-subtle` | `#2d1f07` | Accent backgrounds (quote left border, badges) |
| `--info` | `#4a90d9` | Informational, secondary actions |
| `--info-subtle` | `#0d2040` | Info backgrounds |
| `--positive` | `#3fb68d` | Positive sentiment, success |
| `--positive-subtle` | `#0d2b21` | Positive badge backgrounds |
| `--warning` | `#e07b39` | Frustrated sentiment, warnings |
| `--warning-subtle` | `#2b1507` | Warning badge backgrounds |
| `--neutral` | `#6e7681` | Mixed/neutral sentiment |
| `--neutral-subtle` | `#1c2128` | Neutral badge backgrounds |

---

## Typography

| Token | Value |
|-------|-------|
| `--font-heading` | `'Montserrat', sans-serif` |
| `--font-body` | `'Source Sans 3', sans-serif` |
| `--font-mono` | `'JetBrains Mono', monospace` *(optional, for IDs/codes)* |

### Scale

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 11px | Timestamps, fine print |
| `--text-sm` | 13px | Tags, badges, table labels |
| `--text-base` | 16px | Body copy |
| `--text-lg` | 18px | Lead text, summaries |
| `--text-xl` | 22px | Section headers |
| `--text-2xl` | 28px | Page titles |
| `--text-3xl` | 36px | Bucket headings |
| `--text-4xl` | 48px | Homepage hero stat numbers |

Headings: Montserrat SemiBold (600) or Bold (700).
Body: Source Sans 3 Regular (400). Secondary/meta: Regular at `--text-secondary` colour.

---

## Components

### Metric Callout Card
A small tile surfacing a single stat. Used in a row of 3–4 on thread pages and the homepage.

```
┌─────────────────────┐
│  ⬜  59             │
│     Messages        │
└─────────────────────┘
```

- Background: `--bg-surface`
- Border: `--border`, 1px, radius 6px
- Icon: 20px, `--text-secondary`
- Number: `--text-4xl` (or `--text-3xl`), Montserrat Bold, `--text-primary`
- Label: `--text-sm`, `--text-secondary`
- Padding: 16px

---

### Discord-Style Quote Block

Used for "Community Voices" — lifted directly from Discord message appearance.

```
│  ◉ username          2026-06-05
│  Message body text goes here. Can run to two or three
│  lines comfortably.
```

- Left border: 3px solid `--accent`
- Background: `--bg-raised`
- Border radius: 0 6px 6px 0
- Avatar: 28px circle, `--bg-surface` fill with initials in `--accent`
- Username: Montserrat SemiBold, `--accent`, `--text-sm`
- Timestamp: `--text-xs`, `--text-muted`, same line, right-aligned or inline
- Body: Source Sans 3, `--text-base`, `--text-primary`
- Padding: 12px 16px

---

### Ask Card

Used in the Primary Asks section of each thread page.

```
┌──────────────────────────────────────────────────┐
│  [Feature]  Add a targeted loot system           │
│                                                  │
│  Raised by  @maxstriker                          │
│  Echoed by  @caperguy  @jbcode  @maku95  +5      │
└──────────────────────────────────────────────────┘
```

- Background: `--bg-surface`
- Border: `--border` with left accent strip (4px, colour from category badge)
- Ask text: Montserrat SemiBold, `--text-lg`
- "Raised by" / "Echoed by": `--text-sm`, `--text-secondary` label + `--text-primary` value
- Category badge: top-right corner, pill style

---

### Sentiment Badge

Inline pill. Used on thread cards and thread page headers.

| Label | Background | Text colour |
|-------|-----------|-------------|
| Positive | `--positive-subtle` | `--positive` |
| Constructive | `--info-subtle` | `--info` |
| Frustrated | `--warning-subtle` | `--warning` |
| Mixed | `--neutral-subtle` | `--neutral` |

- Font: Montserrat SemiBold, `--text-xs`, all caps
- Padding: 3px 8px, border-radius: 999px
- No border

---

### Category Badge

Same pill shape as sentiment badge, used on ask cards and thread headers.

| Label | Accent colour |
|-------|--------------|
| Feature | `--info` |
| Balance | `--warning` |
| Bug | red (`#cf4a4a`) |
| QoL | `--positive` |
| Meta | `--neutral` |

---

### Ask Type Tag

Used in the header bar of each thread page. Slightly larger than a badge, outlined rather than filled.

- Border: 1px solid current category colour
- Text: category colour
- Radius: 4px
- Font: Montserrat Medium, `--text-sm`

---

## Navigation

Top bar, sticky. Height: 56px.

- Background: `--bg-surface` with 1px bottom border `--border`
- Site name: Montserrat Bold, `--text-primary`, left-aligned
- Bucket links: Source Sans 3, `--text-sm`, `--text-secondary` default, `--accent` on hover/active
- Trello link: right-aligned, `--accent` colour, external icon
- Mobile: hamburger menu collapses bucket links

---

## Spacing

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |

Max content width: 1100px, centred.

---

## Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Source+Sans+3:wght@400;600&display=swap');
```
