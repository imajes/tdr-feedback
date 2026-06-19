import * as React from 'react';

/**
 * Consolidated community ask: ask text + who raised it + category + sentiment.
 * @startingPoint section="Feedback" subtitle="One consolidated player ask" viewport="560x180"
 */
export interface AskCardProps {
  /** The consolidated ask / request text. */
  ask: React.ReactNode;
  /** Attribution — who raised it (username or "12 players"). */
  raisedBy?: React.ReactNode;
  /** Bucket the ask belongs to. */
  category?: 'specs' | 'balance' | 'features' | 'bugs';
  /** Override the category label text. */
  categoryLabel?: React.ReactNode;
  /** Aggregate sentiment around the ask. */
  sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  /** Mention/up-vote count shown on the sentiment badge. */
  mentions?: number;
  /** Priority rank; renders as #NN in the corner. */
  priority?: number;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function AskCard(props: AskCardProps): JSX.Element;
