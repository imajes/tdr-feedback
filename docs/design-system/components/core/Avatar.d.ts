import * as React from 'react';

export interface AvatarProps {
  /** Display name; initials are derived from it. */
  name?: string;
  /** Optional image URL; overrides initials. */
  src?: string;
  /** Diameter in px. @default 36 */
  size?: number;
  /** Override the auto tint (CSS color). */
  color?: string;
  style?: React.CSSProperties;
}

/** Circular monogram / image avatar for forum users. */
export function Avatar(props: AvatarProps): JSX.Element;
