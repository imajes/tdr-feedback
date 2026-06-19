Metric callout card: icon chip, oversized tabular number, uppercase label. Used in the homepage hero strip and bucket summaries.

```jsx
<MetricCard icon="◎" value="25" label="Threads" sublabel="across 4 buckets" />
<MetricCard icon="⚑" value="38" label="Open asks" accent="var(--color-blue)" />
```

- Number uses Montserrat bold + tabular-nums so columns of metrics align.
- Keep labels to 1–2 words, uppercase. Reserve `sublabel` for one short qualifier.
