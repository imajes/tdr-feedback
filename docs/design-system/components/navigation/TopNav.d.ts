import * as React from 'react';

export interface NavLink {
  id?: string;
  label: string;
  href?: string;
}

/**
 * Persistent top navigation: wordmark + bucket links + external Trello CTA.
 * @startingPoint section="Navigation" subtitle="Persistent feedback-site top bar" viewport="900x60"
 */
export interface TopNavProps {
  /** Wordmark text. @default "TDR FEEDBACK" */
  brand?: string;
  /** Bucket / section links. */
  links?: NavLink[];
  /** id (or label) of the active link. */
  active?: string;
  /** External Trello board URL. */
  trelloHref?: string;
  /** Called with the clicked link instead of navigating. */
  onNav?: (link: NavLink) => void;
  style?: React.CSSProperties;
}

export function TopNav(props: TopNavProps): JSX.Element;
