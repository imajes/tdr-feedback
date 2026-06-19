import React from 'react';
import { Avatar } from '../core/Avatar.jsx';

/**
 * QuoteBlock — Discord-style verbatim community quote.
 * Left accent rail, avatar, bold accent username, faint timestamp.
 */
export function QuoteBlock({ username, avatarSrc, timestamp, children, tone, source, style, ...rest }) {
  const railColor =
    tone === 'positive' ? 'var(--color-positive)'
    : tone === 'negative' ? 'var(--color-negative)'
    : 'var(--color-accent)';

  return (
    <figure
      style={{
        margin: 0,
        display: 'flex',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-surface-1)',
        borderRadius: 'var(--radius-md)',
        borderLeft: `3px solid ${railColor}`,
        ...style,
      }}
      {...rest}
    >
      <Avatar name={username || '?'} src={avatarSrc} size={36} style={{ marginTop: 2 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-accent-bright)',
            }}
          >
            {username}
          </span>
          {timestamp && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
              {timestamp}
            </span>
          )}
        </div>
        <blockquote
          style={{
            margin: '3px 0 0',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-normal)',
            color: 'var(--color-text)',
            textWrap: 'pretty',
          }}
        >
          {children}
        </blockquote>
        {source && (
          <figcaption style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            {source}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
