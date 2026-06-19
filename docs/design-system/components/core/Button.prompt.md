Action control — accent fill for the single primary action, blue outline for secondary, ghost for tertiary/nav, danger for destructive.

```jsx
<Button variant="primary" onClick={open}>Open thread</Button>
<Button variant="secondary" href="https://trello.com/…" iconRight="↗">View Trello board</Button>
<Button variant="ghost" size="sm">Dismiss</Button>
```

- One primary per view. Keep label terse and verb-led ("Open thread", "View board").
- `href` turns it into a link (used for the external Trello CTA).
- `icon` / `iconRight` accept any node — pass an SVG or unicode glyph.
