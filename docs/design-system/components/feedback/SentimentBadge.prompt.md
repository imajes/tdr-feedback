Pill summarising community sentiment. Muted teal (positive), warm red-orange (negative), slate (neutral), cold blue (mixed). Shape glyph doubles as a non-colour signal.

```jsx
<SentimentBadge tone="positive" count={42} />
<SentimentBadge tone="negative">Strongly opposed</SentimentBadge>
<SentimentBadge tone="neutral" showDot={false} />
```

- Keep sentiment colours reserved for this badge and sentiment data viz — don't reuse teal/red as general UI accents.
- `count` renders in mono to read as data.
