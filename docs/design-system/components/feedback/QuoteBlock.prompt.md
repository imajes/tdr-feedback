Verbatim player quote in a Discord message style: left accent rail, avatar, bold accent username, faint mono timestamp.

```jsx
<QuoteBlock username="Ghost_Recon" timestamp="Mar 14 · 2:08 PM" tone="negative">
  TTK feels inconsistent at range — the same burst kills instantly up close but chips at 30m.
</QuoteBlock>
```

- Quote text verbatim; don't paraphrase player voice.
- `tone` tints the rail to match the sentiment of the quote (default amber).
- Use `source` for the originating thread name when the quote is shown out of context.
