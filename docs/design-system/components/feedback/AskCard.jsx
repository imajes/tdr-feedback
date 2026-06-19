import React from 'react';
import { CategoryBadge } from './CategoryBadge.jsx';
import { SentimentBadge } from './SentimentBadge.jsx';

/**
 * AskCard — a consolidated community ask: the ask text, who raised it,
 * a category badge, and optional sentiment + mention count.
 */
export function AskCard({
  ask,
  raisedBy,
  category,
  categoryLabel,
  sentiment,
  mentions,
  priority,
  onClick,
  style,
  ...rest
}) {
  const interactive = !!onClick;
  return (
    <article
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4) var(--space-5)',
        background: 'var(--surface-card)',
        border: 'var(--border-1)',
        borderRadius: 'var(--radius-lg)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {priority != null && (
        <span
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-5)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-faint)',
          }}
        >
          #{String(priority).padStart(2, '0')}
        </span>
      )}

      <p
        style={{
          margin: 0,
          paddingRight: priority != null ? 'var(--space-8)' : 0,
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-md)',
          lineHeight: 'var(--leading-snug)',
          color: 'var(--color-text)',
          textWrap: 'pretty',
        }}
      >
        {ask}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <CategoryBadge category={category}>{categoryLabel}</CategoryBadge>
        {sentiment && <SentimentBadge tone={sentiment} count={mentions} />}
        {raisedBy && (
          <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)' }}>
            Raised by <span style={{ color: 'var(--color-text-muted)', fontWeight: 'var(--weight-semibold)' }}>{raisedBy}</span>
          </span>
        )}
      </div>
    </article>
  );
}
