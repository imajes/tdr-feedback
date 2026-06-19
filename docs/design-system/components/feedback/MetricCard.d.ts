import * as React from 'react';

/**
 * Metric callout: icon + large number + label.
 * @startingPoint section="Feedback" subtitle="Icon + big number + label" viewport="320x180"
 */
export interface MetricCardProps {
  /** Icon node (SVG / glyph). */
  icon?: React.ReactNode;
  /** The large headline number/value. */
  value: React.ReactNode;
  /** Uppercase label under the value. */
  label: React.ReactNode;
  /** Optional plain-case detail line. */
  sublabel?: React.ReactNode;
  /** Accent colour for icon chip. @default accent amber */
  accent?: string;
  style?: React.CSSProperties;
}

export function MetricCard(props: MetricCardProps): JSX.Element;
