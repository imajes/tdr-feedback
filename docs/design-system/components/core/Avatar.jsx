import React from 'react';

/**
 * Avatar — circular monogram for forum users.
 * Renders an image if `src` is set, else colored initials.
 */
export function Avatar({ name = '?', src, size = 36, color, style, ...rest }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  // deterministic tint from name when no color given
  const palette = [
    'var(--color-accent)',
    'var(--color-blue)',
    'var(--color-positive)',
    'var(--color-cat-specs)',
    'var(--color-cat-balance)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const tint = color || palette[Math.abs(hash) % palette.length];

  const base = {
    width: size,
    height: size,
    borderRadius: 'var(--radius-pill)',
    flex: '0 0 auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--weight-bold)',
    fontSize: Math.round(size * 0.4),
    color: 'var(--color-text)',
    background: `color-mix(in srgb, ${tint} 22%, var(--color-surface-4))`,
    border: `1px solid color-mix(in srgb, ${tint} 45%, transparent)`,
    overflow: 'hidden',
    userSelect: 'none',
    ...style,
  };

  return (
    <span style={base} {...rest}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </span>
  );
}
