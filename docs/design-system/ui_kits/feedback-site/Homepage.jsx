/* global React */
const { useState, useEffect, useRef } = React;

// Lucide icon helper — renders an <i data-lucide> and hydrates it.
function Icon({ name, size = 18, color = 'currentColor', style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: { width: size, height: size, stroke: color, 'stroke-width': 2 },
        nameAttr: 'data-lucide',
      });
    }
  }, [name, size, color]);
  return <span ref={ref} style={{ display: 'inline-flex', ...style }} />;
}

const C = () => window.TDRCommunityFeedbackDesignSystem_42173e;
const SENT_LABEL = { positive: 'Net positive', negative: 'Net negative', neutral: 'Neutral', mixed: 'Mixed' };

/* ─────────────────────────── Homepage ─────────────────────────── */
function Homepage({ go }) {
  const { MetricCard, AskCard } = C();
  const D = window.FEEDBACK_DATA;
  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-pad)' }}>
      {/* Hero */}
      <header style={{ padding: '56px 0 36px' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 14 }}>
          The Division: Resurgence · Community Debrief
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 48, lineHeight: 1.08, letterSpacing: '-.02em', color: 'var(--color-text)', maxWidth: 760, textWrap: 'balance' }}>
          Consolidated player feedback, read like a field report.
        </h1>
        <p style={{ margin: '18px 0 0', fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.55, color: 'var(--color-text-muted)', maxWidth: 620 }}>
          25 active forum threads, distilled into ranked asks across specs, balance, features and bug reports — sourced verbatim from the community.
        </p>
      </header>

      {/* Metrics strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
        {D.metrics.map((m) => (
          <MetricCard key={m.label} icon={<Icon name={m.icon} size={20} />} value={m.value} label={m.label} sublabel={m.sub} accent={m.accent} />
        ))}
      </div>

      {/* Bucket grid */}
      <SectionLabel icon="layout-grid">Feedback buckets</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 56 }}>
        {D.buckets.map((b) => (
          <BucketCard key={b.id} bucket={b} onClick={() => go({ view: 'bucket', bucket: b.id })} />
        ))}
      </div>

      {/* Top priority asks */}
      <SectionLabel icon="flag">Top-priority asks</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 72 }}>
        {D.topAsks.map((a) => (
          <AskCard key={a.priority} {...a} onClick={() => go({ view: 'bucket', bucket: a.category })} />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
      <Icon name={icon} size={16} color="var(--color-accent)" />
      <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{children}</h2>
    </div>
  );
}

function BucketCard({ bucket, onClick }) {
  const { SentimentBadge } = C();
  const [hover, setHover] = useState(false);
  const accent = { specs: 'var(--color-cat-specs)', balance: 'var(--color-cat-balance)', features: 'var(--color-cat-features)', bugs: 'var(--color-cat-bugs)' }[bucket.id];
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', gap: 16, padding: '20px 22px', cursor: 'pointer',
        background: hover ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
        border: '1px solid', borderColor: hover ? 'var(--color-border-strong)' : 'var(--color-border)',
        borderRadius: 'var(--radius-lg)', transition: 'all 180ms cubic-bezier(0.22,0.61,0.36,1)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, flex: '0 0 auto', borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${accent} 16%, transparent)`, color: accent }}>
        <Icon name={bucket.icon} size={22} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 19, color: 'var(--color-text)' }}>{bucket.label}</h3>
          <SentimentBadge tone={bucket.net} showDot />
        </div>
        <p style={{ margin: '6px 0 12px', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--color-text-muted)' }}>{bucket.blurb}</p>
        <div style={{ display: 'flex', gap: 18, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-faint)' }}>
          <span>{bucket.threads} threads</span>
          <span>{bucket.asks} asks</span>
        </div>
      </div>
    </article>
  );
}

window.Homepage = Homepage;
window.TDRIcon = Icon;
window.TDRSectionLabel = SectionLabel;
