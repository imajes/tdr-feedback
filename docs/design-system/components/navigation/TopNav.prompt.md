Persistent top bar for the feedback site: diamond-mark wordmark on the left, bucket links in the middle, external Trello CTA pinned right.

```jsx
<TopNav
  active="balance"
  links={[
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Specs' },
    { id: 'balance', label: 'Balance' },
    { id: 'features', label: 'Features' },
    { id: 'bugs', label: 'Bug Reports' },
  ]}
  trelloHref="https://trello.com/b/…"
  onNav={(l) => setView(l.id)}
/>
```

- Always present, full-width, sticky at top. The Trello link is the only outbound CTA.
- `onNav` intercepts clicks for SPA routing; omit it to use plain `href`s.
