import * as React from 'react';

/**
 * Discord-style verbatim community quote with left accent rail.
 * @startingPoint section="Feedback" subtitle="Verbatim player quote, Discord-style" viewport="560x150"
 */
export interface QuoteBlockProps {
  /** Forum username (bold, accent colour). */
  username: string;
  /** Optional avatar image URL. */
  avatarSrc?: string;
  /** Faint timestamp / post meta (mono). */
  timestamp?: string;
  /** The quoted message body. */
  children: React.ReactNode;
  /** Tints the left rail to match sentiment. */
  tone?: 'positive' | 'negative' | 'neutral';
  /** Optional source line under the quote (thread name, link). */
  source?: React.ReactNode;
  style?: React.CSSProperties;
}

export function QuoteBlock(props: QuoteBlockProps): JSX.Element;
