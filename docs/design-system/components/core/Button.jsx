import React from 'react';

/**
 * Button — primary action control.
 * Variants: primary (accent fill), secondary (cold-blue outline),
 * ghost (bare), danger. Sizes: sm | md | lg.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconRight,
  disabled = false,
  style,
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 'var(--text-sm)', padding: '6px 12px', gap: '6px' },
    md: { fontSize: 'var(--text-sm)', padding: '9px 16px', gap: '8px' },
    lg: { fontSize: 'var(--text-base)', padding: '12px 22px', gap: '9px' },
  };

  const variants = {
    primary: {
      background: 'var(--color-accent)',
      color: 'var(--color-text-inverse)',
      border: '1px solid var(--color-accent)',
      fontWeight: 'var(--weight-semibold)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-blue-bright)',
      border: '1px solid var(--color-border-strong)',
      fontWeight: 'var(--weight-semibold)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      border: '1px solid transparent',
      fontWeight: 'var(--weight-semibold)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--color-negative)',
      border: '1px solid rgba(207, 106, 79, 0.4)',
      fontWeight: 'var(--weight-semibold)',
    },
  };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  const content = (
    <>
      {icon && <span style={{ display: 'inline-flex', fontSize: '1.05em' }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', fontSize: '1.05em' }}>{iconRight}</span>}
    </>
  );

  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} disabled={href ? undefined : disabled} style={base} {...rest}>
      {content}
    </Tag>
  );
}
