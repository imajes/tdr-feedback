# Claude Design Tool — Prompts

Three rounds. Each builds on the previous output.

---

## Round 1 — Palette + Typography

Paste into "Company name and blurb":

> TDR Community Feedback — a dark-mode web site presenting consolidated player feedback from The Division: Resurgence's community forum threads. Covers 25 discussion threads across specs, balance, features, and bug reports. Audience: game developers reviewing community sentiment.

Paste into "Any other notes":

> Dark tactical aesthetic — field ops debrief, not a consumer app. Key decisions: background #0d1117, surface cards #161b22, raised elements #21262d, borders #30363d. Accent: desaturated orange-amber (#d4820a) for highlights, CTAs, active nav. Secondary: cold blue (#4a90d9) for informational elements. Sentiment colours: muted teal (#3fb68d) for positive, warm red-orange (#e07b39) for frustrated/negative, slate (#6e7681) for neutral/mixed. Text: #e6edf3 primary, #8b949e secondary, #484f58 muted. Headings: Montserrat SemiBold/Bold. Body: Source Sans 3 Regular 16px. Deliver as CSS custom properties with usage comments. Also show a type scale from 11px (timestamps) through 48px (hero stat numbers).

---

## Round 2 — Components

> Using the dark tactical palette and Montserrat/Source Sans 3 type system from the previous output, design these four components:
>
> 1. **Metric callout card** — small tile, icon top-left, large Montserrat Bold number, Source Sans 3 label below. Background --bg-surface, 1px border, 6px radius. Used in rows of 3–4 on thread pages.
>
> 2. **Discord-style quote block** — 3px left border in accent orange, background --bg-raised, 28px avatar circle (initials only), Montserrat SemiBold username in accent colour, faint timestamp inline, Source Sans 3 body text. Feels like a lifted Discord message.
>
> 3. **Ask card** — background --bg-surface with a 4px left strip coloured by category (blue=Feature, amber=Balance, red=Bug, teal=QoL). Ask text in Montserrat SemiBold at 18px. "Raised by" and "Echoed by" rows in small secondary text. Category badge pill in top-right corner.
>
> 4. **Sentiment badge** — small pill, no border, Montserrat SemiBold 11px all-caps. Four states: Positive (teal bg/text), Constructive (blue), Frustrated (amber), Mixed (slate). Show all four states side by side.

---

## Round 3 — Layout

> Using the same design system, design two layouts:
>
> **Top navigation bar (56px, sticky):** site name Montserrat Bold left-aligned; centre links for seven buckets (Specialisations · Balance · Progression · Features · Clan · World · Polish) in Source Sans 3 small, secondary colour, accent on hover; right-aligned external Trello link in accent colour. Show desktop and collapsed mobile (hamburger) states.
>
> **Homepage layout:** (1) Hero — dark full-width strip, two-line context statement in Montserrat, two large stat callout cards (25 Threads · 200+ Participants). (2) Bucket grid — 7 cards in a 3+3+1 or 4+3 grid: icon, Montserrat bucket name, thread count badge, one-line Source Sans 3 summary. Cards use --bg-surface with border and subtle left accent strip. (3) Top Priority Asks strip — 3 ask cards in a row, pulled from highest-consensus items across all threads. (4) Footer — credits line, Trello link, last updated date. Show desktop (1100px max-width centred) and mobile breakpoints.
