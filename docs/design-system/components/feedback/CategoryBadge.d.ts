import * as React from 'react';

export interface CategoryBadgeProps {
  /** Known bucket; sets colour + label automatically. */
  category?: 'specs' | 'balance' | 'features' | 'bugs';
  /** Custom swatch colour (CSS) when not using a known category. */
  color?: string;
  /** Custom label; defaults to the category name. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Uppercase tag marking which feedback bucket an ask/thread belongs to. */
export function CategoryBadge(props: CategoryBadgeProps): JSX.Element;
