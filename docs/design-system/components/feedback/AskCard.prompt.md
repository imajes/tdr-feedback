A single consolidated community ask: the ask statement, who raised it, a category badge, optional sentiment + mention count, and an optional priority rank.

```jsx
<AskCard
  priority={1}
  ask="Add a stash search/filter — players can't find gear across 200+ slots."
  category="features"
  sentiment="positive"
  mentions={64}
  raisedBy="18 players"
/>
```

- `ask` is the synthesised request, not a verbatim quote — keep it one declarative sentence.
- `raisedBy` is attribution: a username, "18 players", or a thread reference.
- Pass `onClick` to make the whole card open the source thread.
