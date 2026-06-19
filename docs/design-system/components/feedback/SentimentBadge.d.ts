import * as React from 'react';

export interface SentimentBadgeProps {
  /** Sentiment direction. @default "neutral" */
  tone?: 'positive' | 'negative' | 'neutral' | 'mixed';
  /** Custom label; defaults to the tone name. */
  children?: React.ReactNode;
  /** Optional numeric count shown after the label. */
  count?: number;
  /** Show the leading shape glyph. @default true */
  showDot?: boolean;
  style?: React.CSSProperties;
}

/** Pill summarising community sentiment for a thread or ask. */
export function SentimentBadge(props: SentimentBadgeProps): JSX.Element;
