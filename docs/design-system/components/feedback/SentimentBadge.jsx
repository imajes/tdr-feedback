import React from 'react';

const TONES = {
  positive: { color: 'var(--color-positive)', bg: 'var(--color-positive-tint)', dot: '▲', label: 'Positive' },
  negative: { color: 'var(--color-negative)', bg: 'var(--color-negative-tint)', dot: '▼', label: 'Negative' },
  neutral:  { color: 'var(--color-neutral)',  bg: 'var(--color-neutral-tint)',  dot: '■', label: 'Neutral' },
  mixed:    { color: 'var(--color-blue)',      bg: 'var(--color-blue-tint)',     dot: '◆', label: 'Mixed' },
};

/**
 * SentimentBadge — pill summarising community sentiment.
 * tone: positive | negative | neutral | mixed.
 */
export function SentimentBadge({ tone = 'neutral', children, count, showDot = true, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: 'var(--radius-pill)',
        background: t.bg,
        color: t.color,
        border: `1px solid color-mix(in srgb, ${t.color} 35%, transparent)`,
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.02em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {showDot && <span style={{ fontSize: '0.7em' }}>{t.dot}</span>}
      {children || t.label}
      {count != null && (
        <span style={{ opacity: 0.7, fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-regular)' }}>
          {count}
        </span>
      )}
    </span>
  );
}
