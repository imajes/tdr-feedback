Circular user avatar — image when `src` is provided, otherwise colored initials with a deterministic tint per name.

```jsx
<Avatar name="Ghost_Recon" size={36} />
<Avatar name="DevTeam" src="/assets/img/dev.png" size={44} />
```

- Used inside QuoteBlock and ask attribution rows.
- Tint is stable per name, so the same user reads the same colour across threads.
