/* @ds-bundle: {"format":3,"namespace":"TDRCommunityFeedbackDesignSystem_42173e","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"AskCard","sourcePath":"components/feedback/AskCard.jsx"},{"name":"CategoryBadge","sourcePath":"components/feedback/CategoryBadge.jsx"},{"name":"MetricCard","sourcePath":"components/feedback/MetricCard.jsx"},{"name":"QuoteBlock","sourcePath":"components/feedback/QuoteBlock.jsx"},{"name":"SentimentBadge","sourcePath":"components/feedback/SentimentBadge.jsx"},{"name":"TopNav","sourcePath":"components/navigation/TopNav.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"61163e6330bb","components/core/Button.jsx":"9d805540fc8b","components/feedback/AskCard.jsx":"91090f6517b6","components/feedback/CategoryBadge.jsx":"6739f292137d","components/feedback/MetricCard.jsx":"ab0bcfa61249","components/feedback/QuoteBlock.jsx":"039383212b14","components/feedback/SentimentBadge.jsx":"3f399e945550","components/navigation/TopNav.jsx":"69d517fbdb0d","ui_kits/feedback-site/BucketView.jsx":"32bfc060b338","ui_kits/feedback-site/Homepage.jsx":"605fb6e74190","ui_kits/feedback-site/ThreadView.jsx":"69936b6e9e35","ui_kits/feedback-site/data.js":"f3f05ed86a89"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TDRCommunityFeedbackDesignSystem_42173e = window.TDRCommunityFeedbackDesignSystem_42173e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — circular monogram for forum users.
 * Renders an image if `src` is set, else colored initials.
 */
function Avatar({
  name = '?',
  src,
  size = 36,
  color,
  style,
  ...rest
}) {
  const initials = name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  // deterministic tint from name when no color given
  const palette = ['var(--color-accent)', 'var(--color-blue)', 'var(--color-positive)', 'var(--color-cat-specs)', 'var(--color-cat-balance)'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = hash * 31 + name.charCodeAt(i) | 0;
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
    ...style
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: base
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary action control.
 * Variants: primary (accent fill), secondary (cold-blue outline),
 * ghost (bare), danger. Sizes: sm | md | lg.
 */
function Button({
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
    sm: {
      fontSize: 'var(--text-sm)',
      padding: '6px 12px',
      gap: '6px'
    },
    md: {
      fontSize: 'var(--text-sm)',
      padding: '9px 16px',
      gap: '8px'
    },
    lg: {
      fontSize: 'var(--text-base)',
      padding: '12px 22px',
      gap: '9px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--color-accent)',
      color: 'var(--color-text-inverse)',
      border: '1px solid var(--color-accent)',
      fontWeight: 'var(--weight-semibold)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-blue-bright)',
      border: '1px solid var(--color-border-strong)',
      fontWeight: 'var(--weight-semibold)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      border: '1px solid transparent',
      fontWeight: 'var(--weight-semibold)'
    },
    danger: {
      background: 'transparent',
      color: 'var(--color-negative)',
      border: '1px solid rgba(207, 106, 79, 0.4)',
      fontWeight: 'var(--weight-semibold)'
    }
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
    ...style
  };
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.05em'
    }
  }, icon), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.05em'
    }
  }, iconRight));
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: href ? undefined : disabled,
    style: base
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/feedback/CategoryBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CATS = {
  specs: {
    color: 'var(--color-cat-specs)',
    label: 'Specs'
  },
  balance: {
    color: 'var(--color-cat-balance)',
    label: 'Balance'
  },
  features: {
    color: 'var(--color-cat-features)',
    label: 'Features'
  },
  bugs: {
    color: 'var(--color-cat-bugs)',
    label: 'Bug Reports'
  }
};

/**
 * CategoryBadge — small tag marking which feedback bucket an item belongs to.
 * category: specs | balance | features | bugs (or pass `color` + children for custom).
 */
function CategoryBadge({
  category,
  color,
  children,
  style,
  ...rest
}) {
  const c = CATS[category];
  const tint = color || (c ? c.color : 'var(--color-neutral)');
  const label = children || (c ? c.label : category);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '2px 8px 2px 7px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--color-surface-4)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: '11px',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 2,
      background: tint,
      flex: '0 0 auto'
    }
  }), label);
}
Object.assign(__ds_scope, { CategoryBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/CategoryBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/MetricCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MetricCard — icon + large number + label callout.
 * Used in homepage hero strip and bucket summaries.
 */
function MetricCard({
  icon,
  value,
  label,
  sublabel,
  accent = 'var(--color-accent)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: 'var(--border-1)',
      borderRadius: 'var(--radius-lg)',
      minWidth: 0,
      ...style
    }
  }, rest), icon != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      background: `color-mix(in srgb, ${accent} 14%, transparent)`,
      color: accent,
      fontSize: 20,
      marginBottom: 'var(--space-1)'
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-metric)',
      lineHeight: 1,
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--color-text)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-sm)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)'
    }
  }, label), sublabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-faint)',
      textTransform: 'none',
      letterSpacing: 0
    }
  }, sublabel));
}
Object.assign(__ds_scope, { MetricCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/MetricCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/QuoteBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * QuoteBlock — Discord-style verbatim community quote.
 * Left accent rail, avatar, bold accent username, faint timestamp.
 */
function QuoteBlock({
  username,
  avatarSrc,
  timestamp,
  children,
  tone,
  source,
  style,
  ...rest
}) {
  const railColor = tone === 'positive' ? 'var(--color-positive)' : tone === 'negative' ? 'var(--color-negative)' : 'var(--color-accent)';
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--color-surface-1)',
      borderRadius: 'var(--radius-md)',
      borderLeft: `3px solid ${railColor}`,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: username || '?',
    src: avatarSrc,
    size: 36,
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-accent-bright)'
    }
  }, username), timestamp && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-faint)'
    }
  }, timestamp)), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: '3px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-normal)',
      color: 'var(--color-text)',
      textWrap: 'pretty'
    }
  }, children), source && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-2)',
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-faint)'
    }
  }, source)));
}
Object.assign(__ds_scope, { QuoteBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/QuoteBlock.jsx", error: String((e && e.message) || e) }); }

// components/feedback/SentimentBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  positive: {
    color: 'var(--color-positive)',
    bg: 'var(--color-positive-tint)',
    dot: '▲',
    label: 'Positive'
  },
  negative: {
    color: 'var(--color-negative)',
    bg: 'var(--color-negative-tint)',
    dot: '▼',
    label: 'Negative'
  },
  neutral: {
    color: 'var(--color-neutral)',
    bg: 'var(--color-neutral-tint)',
    dot: '■',
    label: 'Neutral'
  },
  mixed: {
    color: 'var(--color-blue)',
    bg: 'var(--color-blue-tint)',
    dot: '◆',
    label: 'Mixed'
  }
};

/**
 * SentimentBadge — pill summarising community sentiment.
 * tone: positive | negative | neutral | mixed.
 */
function SentimentBadge({
  tone = 'neutral',
  children,
  count,
  showDot = true,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.color,
      border: `1px solid color-mix(in srgb, ${t.color} 35%, transparent)`,
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.02em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), showDot && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7em'
    }
  }, t.dot), children || t.label, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7,
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--weight-regular)'
    }
  }, count));
}
Object.assign(__ds_scope, { SentimentBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/SentimentBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AskCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AskCard — a consolidated community ask: the ask text, who raised it,
 * a category badge, and optional sentiment + mention count.
 */
function AskCard({
  ask,
  raisedBy,
  category,
  categoryLabel,
  sentiment,
  mentions,
  priority,
  onClick,
  style,
  ...rest
}) {
  const interactive = !!onClick;
  return /*#__PURE__*/React.createElement("article", _extends({
    onClick: onClick,
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--space-5)',
      background: 'var(--surface-card)',
      border: 'var(--border-1)',
      borderRadius: 'var(--radius-lg)',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), priority != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 'var(--space-4)',
      right: 'var(--space-5)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-faint)'
    }
  }, "#", String(priority).padStart(2, '0')), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      paddingRight: priority != null ? 'var(--space-8)' : 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-md)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--color-text)',
      textWrap: 'pretty'
    }
  }, ask), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.CategoryBadge, {
    category: category
  }, categoryLabel), sentiment && /*#__PURE__*/React.createElement(__ds_scope.SentimentBadge, {
    tone: sentiment,
    count: mentions
  }), raisedBy && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-faint)'
    }
  }, "Raised by ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-text-muted)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, raisedBy))));
}
Object.assign(__ds_scope, { AskCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AskCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * TopNav — persistent ops-debrief top bar: wordmark, bucket links,
 * and an external Trello CTA on the right.
 */
function TopNav({
  brand = 'TDR FEEDBACK',
  links = [],
  active,
  trelloHref = '#',
  onNav,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      height: 'var(--nav-height)',
      padding: '0 var(--space-6)',
      background: 'color-mix(in srgb, var(--color-surface-2) 88%, transparent)',
      borderBottom: 'var(--border-1)',
      backdropFilter: 'blur(8px)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-base)',
      letterSpacing: 'var(--tracking-wide)',
      color: 'var(--color-text)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      background: 'var(--color-accent)',
      transform: 'rotate(45deg)',
      flex: '0 0 auto'
    }
  }), brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)'
    }
  }, links.map(l => {
    const isActive = active === (l.id || l.label);
    return /*#__PURE__*/React.createElement("a", {
      key: l.id || l.label,
      href: l.href || '#',
      onClick: onNav ? e => {
        e.preventDefault();
        onNav(l);
      } : undefined,
      style: {
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-sm)',
        letterSpacing: '0.01em',
        color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
        textDecoration: 'none',
        padding: '7px 12px',
        borderRadius: 'var(--radius-sm)',
        background: isActive ? 'var(--color-surface-4)' : 'transparent',
        whiteSpace: 'nowrap'
      }
    }, l.label);
  })), /*#__PURE__*/React.createElement("a", {
    href: trelloHref,
    target: "_blank",
    rel: "noreferrer",
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-semibold)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-blue-bright)',
      textDecoration: 'none',
      padding: '7px 13px',
      border: '1px solid var(--color-border-strong)',
      borderRadius: 'var(--radius-md)',
      whiteSpace: 'nowrap'
    }
  }, "Trello board ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2197")));
}
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/feedback-site/BucketView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
const {
  useState: useStateBV
} = React;

/* ─────────────────────────── Bucket view ─────────────────────────── */
function BucketView({
  bucket,
  go
}) {
  const C = window.TDRCommunityFeedbackDesignSystem_42173e;
  const Icon = window.TDRIcon;
  const {
    CategoryBadge,
    SentimentBadge,
    AskCard
  } = C;
  const D = window.FEEDBACK_DATA;
  const b = D.buckets.find(x => x.id === bucket);
  const threads = D.threads[bucket] || [];
  const accent = {
    specs: 'var(--color-cat-specs)',
    balance: 'var(--color-cat-balance)',
    features: 'var(--color-cat-features)',
    bugs: 'var(--color-cat-bugs)'
  }[bucket];
  const bucketAsks = threads.flatMap(t => t.asks).sort((a, b2) => b2.mentions - a.mentions).slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go({
      view: 'home'
    }),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 0,
      cursor: 'pointer',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 13,
      padding: '28px 0 18px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " Overview"), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 18,
      paddingBottom: 28,
      borderBottom: '1px solid var(--color-border)',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 52,
      height: 52,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-lg)',
      background: `color-mix(in srgb, ${accent} 16%, transparent)`,
      color: accent
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: b.icon,
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 32,
      letterSpacing: '-.01em',
      color: 'var(--color-text)'
    }
  }, b.label), /*#__PURE__*/React.createElement(SentimentBadge, {
    tone: b.net
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--color-text-muted)',
      maxWidth: 620
    }
  }, b.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      marginTop: 12,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--color-text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, b.threads, " threads"), /*#__PURE__*/React.createElement("span", null, b.asks, " consolidated asks")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 40,
      paddingBottom: 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.TDRSectionLabel, {
    icon: "messages-square"
  }, "Discussion threads"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, threads.map(t => /*#__PURE__*/React.createElement(ThreadRow, {
    key: t.id,
    thread: t,
    onClick: () => go({
      view: 'thread',
      bucket,
      thread: t.id
    })
  })), threads.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-faint)',
      fontSize: 14
    }
  }, "Thread digests for this bucket are still being compiled."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.TDRSectionLabel, {
    icon: "flag"
  }, "Top asks in ", b.label.toLowerCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, bucketAsks.map((a, i) => /*#__PURE__*/React.createElement(AskCard, _extends({
    key: i
  }, a, {
    priority: i + 1
  })))))));
}
function ThreadRow({
  thread,
  onClick
}) {
  const C = window.TDRCommunityFeedbackDesignSystem_42173e;
  const Icon = window.TDRIcon;
  const {
    SentimentBadge
  } = C;
  const [hover, setHover] = useStateBV(false);
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      padding: '16px 18px',
      cursor: 'pointer',
      background: hover ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
      border: '1px solid',
      borderColor: hover ? 'var(--color-border-strong)' : 'var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      transition: 'all 180ms cubic-bezier(0.22,0.61,0.36,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--color-text-faint)'
    }
  }, thread.id), /*#__PURE__*/React.createElement(SentimentBadge, {
    tone: thread.sentiment,
    count: thread.mentions
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 18,
      color: 'var(--color-text)'
    }
  }, thread.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--color-text-muted)'
    }
  }, thread.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--color-text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 13
  }), " ", thread.replies), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "quote",
    size: 13
  }), " ", thread.quotes.length, " cited"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: 'var(--color-accent)'
    }
  }, "Open ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 13,
    color: "var(--color-accent)"
  }))));
}
window.BucketView = BucketView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/feedback-site/BucketView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/feedback-site/Homepage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
const {
  useState,
  useEffect,
  useRef
} = React;

// Lucide icon helper — renders an <i data-lucide> and hydrates it.
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          stroke: color,
          'stroke-width': 2
        },
        nameAttr: 'data-lucide'
      });
    }
  }, [name, size, color]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      ...style
    }
  });
}
const C = () => window.TDRCommunityFeedbackDesignSystem_42173e;
const SENT_LABEL = {
  positive: 'Net positive',
  negative: 'Net negative',
  neutral: 'Neutral',
  mixed: 'Mixed'
};

/* ─────────────────────────── Homepage ─────────────────────────── */
function Homepage({
  go
}) {
  const {
    MetricCard,
    AskCard
  } = C();
  const D = window.FEEDBACK_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      padding: '56px 0 36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
      marginBottom: 14
    }
  }, "The Division: Resurgence \xB7 Community Debrief"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 48,
      lineHeight: 1.08,
      letterSpacing: '-.02em',
      color: 'var(--color-text)',
      maxWidth: 760,
      textWrap: 'balance'
    }
  }, "Consolidated player feedback, read like a field report."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      lineHeight: 1.55,
      color: 'var(--color-text-muted)',
      maxWidth: 620
    }
  }, "25 active forum threads, distilled into ranked asks across specs, balance, features and bug reports \u2014 sourced verbatim from the community.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      marginBottom: 56
    }
  }, D.metrics.map(m => /*#__PURE__*/React.createElement(MetricCard, {
    key: m.label,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: m.icon,
      size: 20
    }),
    value: m.value,
    label: m.label,
    sublabel: m.sub,
    accent: m.accent
  }))), /*#__PURE__*/React.createElement(SectionLabel, {
    icon: "layout-grid"
  }, "Feedback buckets"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16,
      marginBottom: 56
    }
  }, D.buckets.map(b => /*#__PURE__*/React.createElement(BucketCard, {
    key: b.id,
    bucket: b,
    onClick: () => go({
      view: 'bucket',
      bucket: b.id
    })
  }))), /*#__PURE__*/React.createElement(SectionLabel, {
    icon: "flag"
  }, "Top-priority asks"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      paddingBottom: 72
    }
  }, D.topAsks.map(a => /*#__PURE__*/React.createElement(AskCard, _extends({
    key: a.priority
  }, a, {
    onClick: () => go({
      view: 'bucket',
      bucket: a.category
    })
  })))));
}
function SectionLabel({
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: "var(--color-accent)"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)'
    }
  }, children));
}
function BucketCard({
  bucket,
  onClick
}) {
  const {
    SentimentBadge
  } = C();
  const [hover, setHover] = useState(false);
  const accent = {
    specs: 'var(--color-cat-specs)',
    balance: 'var(--color-cat-balance)',
    features: 'var(--color-cat-features)',
    bugs: 'var(--color-cat-bugs)'
  }[bucket.id];
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      gap: 16,
      padding: '20px 22px',
      cursor: 'pointer',
      background: hover ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
      border: '1px solid',
      borderColor: hover ? 'var(--color-border-strong)' : 'var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      transition: 'all 180ms cubic-bezier(0.22,0.61,0.36,1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 44,
      height: 44,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-md)',
      background: `color-mix(in srgb, ${accent} 16%, transparent)`,
      color: accent
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: bucket.icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 19,
      color: 'var(--color-text)'
    }
  }, bucket.label), /*#__PURE__*/React.createElement(SentimentBadge, {
    tone: bucket.net,
    showDot: true
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--color-text-muted)'
    }
  }, bucket.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--color-text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, bucket.threads, " threads"), /*#__PURE__*/React.createElement("span", null, bucket.asks, " asks"))));
}
window.Homepage = Homepage;
window.TDRIcon = Icon;
window.TDRSectionLabel = SectionLabel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/feedback-site/Homepage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/feedback-site/ThreadView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */

/* ─────────────────────────── Thread view ─────────────────────────── */
function ThreadView({
  bucket,
  thread,
  go
}) {
  const C = window.TDRCommunityFeedbackDesignSystem_42173e;
  const Icon = window.TDRIcon;
  const {
    SentimentBadge,
    CategoryBadge,
    QuoteBlock,
    AskCard,
    Button
  } = C;
  const D = window.FEEDBACK_DATA;
  const t = (D.threads[bucket] || []).find(x => x.id === thread);
  if (!t) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 880,
      margin: '0 auto',
      padding: '0 var(--container-pad)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go({
      view: 'bucket',
      bucket
    }),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: 0,
      cursor: 'pointer',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: 13,
      padding: '28px 0 18px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16
  }), " ", D.buckets.find(b => b.id === bucket).label), /*#__PURE__*/React.createElement("header", {
    style: {
      paddingBottom: 24,
      borderBottom: '1px solid var(--color-border)',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--color-text-faint)'
    }
  }, t.id), /*#__PURE__*/React.createElement(CategoryBadge, {
    category: bucket
  }), /*#__PURE__*/React.createElement(SentimentBadge, {
    tone: t.sentiment,
    count: t.mentions
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: '-.01em',
      lineHeight: 1.15,
      color: 'var(--color-text)'
    }
  }, t.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      lineHeight: 1.55,
      color: 'var(--color-text-muted)'
    }
  }, t.summary)), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(window.TDRSectionLabel, {
    icon: "flag"
  }, "Consolidated asks"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, t.asks.map((a, i) => /*#__PURE__*/React.createElement(AskCard, _extends({
    key: i
  }, a, {
    priority: i + 1
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(window.TDRSectionLabel, {
    icon: "quote"
  }, "Cited player voices"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, t.quotes.map((q, i) => /*#__PURE__*/React.createElement(QuoteBlock, {
    key: i,
    username: q.username,
    timestamp: q.time,
    tone: q.tone
  }, q.text)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      paddingBottom: 72
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    href: D.trello,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "external-link",
      size: 15
    })
  }, "Add to Trello board"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => go({
      view: 'bucket',
      bucket
    })
  }, "Back to bucket")));
}
window.ThreadView = ThreadView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/feedback-site/ThreadView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/feedback-site/data.js
try { (() => {
// Fake consolidated-feedback data for The Division: Resurgence community site.
// Content is illustrative, written in the system's data-forward voice.
window.FEEDBACK_DATA = {
  trello: 'https://trello.com/b/tdr-community',
  buckets: [{
    id: 'specs',
    label: 'Specs',
    icon: 'cpu',
    threads: 6,
    asks: 9,
    net: 'mixed',
    blurb: 'Performance, device support, frame-rate and build targets.'
  }, {
    id: 'balance',
    label: 'Balance',
    icon: 'scale',
    threads: 7,
    asks: 14,
    net: 'negative',
    blurb: 'TTK, weapon tuning, skill cooldowns and PvP fairness.'
  }, {
    id: 'features',
    label: 'Features',
    icon: 'sparkles',
    threads: 7,
    asks: 11,
    net: 'positive',
    blurb: 'Requested systems: stash, social, endgame, QoL.'
  }, {
    id: 'bugs',
    label: 'Bug Reports',
    icon: 'bug',
    threads: 5,
    asks: 8,
    net: 'negative',
    blurb: 'Reproducible defects, crashes and progression blockers.'
  }],
  metrics: [{
    icon: 'messages-square',
    value: '25',
    label: 'Threads',
    sub: 'across 4 buckets',
    accent: 'var(--color-accent)'
  }, {
    icon: 'flag',
    value: '42',
    label: 'Open asks',
    sub: 'consolidated',
    accent: 'var(--color-blue)'
  }, {
    icon: 'users',
    value: '1.3k',
    label: 'Players cited',
    sub: 'unique authors',
    accent: 'var(--color-positive)'
  }, {
    icon: 'trending-up',
    value: '54%',
    label: 'Net positive',
    sub: 'feature requests',
    accent: 'var(--color-positive)'
  }],
  topAsks: [{
    priority: 1,
    ask: 'Add a stash search and tag filter — players can\'t locate gear across 200+ slots.',
    category: 'features',
    sentiment: 'positive',
    mentions: 64,
    raisedBy: '18 threads'
  }, {
    priority: 2,
    ask: 'Normalise time-to-kill at range; burst weapons feel inconsistent past 25m.',
    category: 'balance',
    sentiment: 'negative',
    mentions: 51,
    raisedBy: 'Ghost_Recon +40'
  }, {
    priority: 3,
    ask: 'Ship a 120fps target for flagship devices; cap feels dated on high-end hardware.',
    category: 'specs',
    sentiment: 'mixed',
    mentions: 38,
    raisedBy: '12 players'
  }, {
    priority: 4,
    ask: 'Fix the Dark Zone extraction crash that wipes loadouts on disconnect.',
    category: 'bugs',
    sentiment: 'negative',
    mentions: 33,
    raisedBy: 'Echo_7 +29'
  }, {
    priority: 5,
    ask: 'Add cross-progression between mobile and PC builds.',
    category: 'features',
    sentiment: 'positive',
    mentions: 47,
    raisedBy: '21 players'
  }],
  threads: {
    balance: [{
      id: 'THREAD-014',
      title: 'TTK feels inconsistent at range',
      sentiment: 'negative',
      mentions: 51,
      replies: 212,
      summary: 'Burst and DMR archetypes drop close-range targets instantly but chip at distance, making mid-range gunfights feel unreliable.',
      asks: [{
        ask: 'Normalise damage falloff curves across burst weapons.',
        category: 'balance',
        sentiment: 'negative',
        mentions: 51,
        raisedBy: 'Ghost_Recon +40'
      }, {
        ask: 'Surface per-weapon falloff ranges in the stat sheet.',
        category: 'balance',
        sentiment: 'positive',
        mentions: 22,
        raisedBy: '9 players'
      }],
      quotes: [{
        username: 'Ghost_Recon',
        time: 'Mar 14 · 2:08 PM',
        tone: 'negative',
        text: 'The same three-round burst that one-shots up close barely tickles at 30m. I can\'t read my own damage anymore.'
      }, {
        username: 'Tango_Down',
        time: 'Mar 14 · 4:51 PM',
        tone: 'neutral',
        text: 'It\'s not all guns — ARs feel fine. It\'s specifically the burst rifles and marksman builds that fall off a cliff.'
      }, {
        username: 'Maelstrom',
        time: 'Mar 15 · 9:02 AM',
        tone: 'positive',
        text: 'If they just showed the falloff numbers in the stat screen half these threads would disappear. Give us the data.'
      }]
    }, {
      id: 'THREAD-018',
      title: 'Skill cooldowns punish aggressive play',
      sentiment: 'mixed',
      mentions: 29,
      replies: 98,
      summary: 'Cooldowns on mobility and healing skills are seen as too long for the pace of Dark Zone engagements.',
      asks: [{
        ask: 'Reduce mobility-skill cooldowns by ~15% in PvP zones.',
        category: 'balance',
        sentiment: 'mixed',
        mentions: 29,
        raisedBy: '14 players'
      }],
      quotes: [{
        username: 'Sable_9',
        time: 'Mar 12 · 7:20 PM',
        tone: 'negative',
        text: 'By the time my pulse is back up the fight is already over. Cooldowns are tuned for a slower game than the one we\'re playing.'
      }, {
        username: 'DevWatch',
        time: 'Mar 13 · 11:14 AM',
        tone: 'neutral',
        text: 'Careful — shorter cooldowns means more skill spam. I\'d rather see cost reductions than blanket cuts.'
      }]
    }],
    features: [{
      id: 'THREAD-007',
      title: 'Stash management is unworkable at scale',
      sentiment: 'positive',
      mentions: 64,
      replies: 340,
      summary: 'The community broadly agrees the stash needs search, tagging and loadout locking. High engagement, constructive tone.',
      asks: [{
        ask: 'Add stash search and tag filters.',
        category: 'features',
        sentiment: 'positive',
        mentions: 64,
        raisedBy: '18 threads'
      }, {
        ask: 'Let players lock items to prevent accidental dismantle.',
        category: 'features',
        sentiment: 'positive',
        mentions: 31,
        raisedBy: '11 players'
      }],
      quotes: [{
        username: 'Quartermaster',
        time: 'Mar 10 · 1:33 PM',
        tone: 'positive',
        text: 'Give me a search bar and a "favourite" tag and I\'ll forgive almost everything else this season. It\'s the #1 quality-of-life ask.'
      }, {
        username: 'Loot_Goblin',
        time: 'Mar 11 · 8:47 AM',
        tone: 'neutral',
        text: 'Honestly even just letting me lock items so I stop shredding my god-roll by mistake would be huge.'
      }]
    }],
    specs: [{
      id: 'THREAD-021',
      title: '120fps support on flagship devices',
      sentiment: 'mixed',
      mentions: 38,
      replies: 121,
      summary: 'High-end users want an unlocked frame-rate target; others worry about battery and thermals.',
      asks: [{
        ask: 'Add an optional 120fps performance mode.',
        category: 'specs',
        sentiment: 'mixed',
        mentions: 38,
        raisedBy: '12 players'
      }],
      quotes: [{
        username: 'FrameChaser',
        time: 'Mar 9 · 6:02 PM',
        tone: 'positive',
        text: 'My phone can push 120 in every other shooter. Capping at 60 in 2026 feels like leaving performance on the table.'
      }, {
        username: 'BatterySaver',
        time: 'Mar 9 · 9:15 PM',
        tone: 'negative',
        text: 'Please make it optional. I already get two hours before my phone is a hand-warmer.'
      }]
    }],
    bugs: [{
      id: 'THREAD-003',
      title: 'Dark Zone extraction crash wipes loadout',
      sentiment: 'negative',
      mentions: 33,
      replies: 156,
      summary: 'A reproducible crash on extraction-helicopter disconnect that occasionally resets equipped gear. High severity.',
      asks: [{
        ask: 'Fix the extraction-disconnect crash and add loadout recovery.',
        category: 'bugs',
        sentiment: 'negative',
        mentions: 33,
        raisedBy: 'Echo_7 +29'
      }],
      quotes: [{
        username: 'Echo_7',
        time: 'Mar 8 · 3:41 PM',
        tone: 'negative',
        text: 'Lost a full extraction and my equipped mask to a disconnect. Repro: extract during a host migration. Happens ~1 in 5 for my squad.'
      }, {
        username: 'PatchNotes',
        time: 'Mar 8 · 5:09 PM',
        tone: 'neutral',
        text: 'Confirmed on Android 14, mid-tier device. Logs attached in the original post. This one needs to jump the queue.'
      }]
    }]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/feedback-site/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.AskCard = __ds_scope.AskCard;

__ds_ns.CategoryBadge = __ds_scope.CategoryBadge;

__ds_ns.MetricCard = __ds_scope.MetricCard;

__ds_ns.QuoteBlock = __ds_scope.QuoteBlock;

__ds_ns.SentimentBadge = __ds_scope.SentimentBadge;

__ds_ns.TopNav = __ds_scope.TopNav;

})();
