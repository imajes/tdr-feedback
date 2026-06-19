import React from 'react';

/**
 * MetricCard — icon + large number + label callout.
 * Used in homepage hero strip and bucket summaries.
 */
export function MetricCard({ icon, value, label, sublabel, accent = 'var(--color-accent)', style, ...rest }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-5)',
        background: 'var(--surface-card)',
        border: 'var(--border-1)',
        borderRadius: 'var(--radius-lg)',
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {icon != null && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            background: `color-mix(in srgb, ${accent} 14%, transparent)`,
            color: accent,
            fontSize: 20,
            marginBottom: 'var(--space-1)',
          }}
        >
          {icon}
        </span>
      )}
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--weight-bold)',
          fontSize: 'var(--text-metric)',
          lineHeight: 1,
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--color-text)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--weight-semibold)',
          fontSize: 'var(--text-sm)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </span>
      {sublabel && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', textTransform: 'none', letterSpacing: 0 }}>
          {sublabel}
        </span>
      )}
    </div>
  );
}
