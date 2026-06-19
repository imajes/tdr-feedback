import React from 'react';

/**
 * TopNav — persistent ops-debrief top bar: wordmark, bucket links,
 * and an external Trello CTA on the right.
 */
export function TopNav({ brand = 'TDR FEEDBACK', links = [], active, trelloHref = '#', onNav, style, ...rest }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-6)',
        height: 'var(--nav-height)',
        padding: '0 var(--space-6)',
        background: 'color-mix(in srgb, var(--color-surface-2) 88%, transparent)',
        borderBottom: 'var(--border-1)',
        backdropFilter: 'blur(8px)',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-base)',
          letterSpacing: 'var(--tracking-wide)',
          color: 'var(--color-text)',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ width: 9, height: 9, background: 'var(--color-accent)', transform: 'rotate(45deg)', flex: '0 0 auto' }} />
        {brand}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        {links.map((l) => {
          const isActive = active === (l.id || l.label);
          return (
            <a
              key={l.id || l.label}
              href={l.href || '#'}
              onClick={onNav ? (e) => { e.preventDefault(); onNav(l); } : undefined}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--weight-semibold)',
                fontSize: 'var(--text-sm)',
                letterSpacing: '0.01em',
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                textDecoration: 'none',
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--color-surface-4)' : 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {l.label}
            </a>
          );
        })}
      </div>

      <a
        href={trelloHref}
        target="_blank"
        rel="noreferrer"
        style={{
          marginLeft: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--weight-semibold)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-blue-bright)',
          textDecoration: 'none',
          padding: '7px 13px',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 'var(--radius-md)',
          whiteSpace: 'nowrap',
        }}
      >
        Trello board <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}
