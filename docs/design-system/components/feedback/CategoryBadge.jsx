import React from 'react';

const CATS = {
  specs:    { color: 'var(--color-cat-specs)',    label: 'Specs' },
  balance:  { color: 'var(--color-cat-balance)',  label: 'Balance' },
  features: { color: 'var(--color-cat-features)',  label: 'Features' },
  bugs:     { color: 'var(--color-cat-bugs)',      label: 'Bug Reports' },
};

/**
 * CategoryBadge — small tag marking which feedback bucket an item belongs to.
 * category: specs | balance | features | bugs (or pass `color` + children for custom).
 */
export function CategoryBadge({ category, color, children, style, ...rest }) {
  const c = CATS[category];
  const tint = color || (c ? c.color : 'var(--color-neutral)');
  const label = children || (c ? c.label : category);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 8px 2px 7px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-surface-4)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: '11px',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 7, height: 7, borderRadius: 2, background: tint, flex: '0 0 auto' }} />
      {label}
    </span>
  );
}
