/* global React */
const { useState: useStateBV } = React;

/* ─────────────────────────── Bucket view ─────────────────────────── */
function BucketView({ bucket, go }) {
  const C = window.TDRCommunityFeedbackDesignSystem_42173e;
  const Icon = window.TDRIcon;
  const { CategoryBadge, SentimentBadge, AskCard } = C;
  const D = window.FEEDBACK_DATA;
  const b = D.buckets.find((x) => x.id === bucket);
  const threads = D.threads[bucket] || [];
  const accent = { specs: 'var(--color-cat-specs)', balance: 'var(--color-cat-balance)', features: 'var(--color-cat-features)', bugs: 'var(--color-cat-bugs)' }[bucket];
  const bucketAsks = threads.flatMap((t) => t.asks).sort((a, b2) => b2.mentions - a.mentions).slice(0, 4);

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-pad)' }}>
      <button onClick={() => go({ view: 'home' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 0, cursor: 'pointer', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, padding: '28px 0 18px' }}>
        <Icon name="chevron-left" size={16} /> Overview
      </button>

      <header style={{ display: 'flex', alignItems: 'flex-start', gap: 18, paddingBottom: 28, borderBottom: '1px solid var(--color-border)', marginBottom: 32 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, flex: '0 0 auto', borderRadius: 'var(--radius-lg)', background: `color-mix(in srgb, ${accent} 16%, transparent)`, color: accent }}>
          <Icon name={b.icon} size={26} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 32, letterSpacing: '-.01em', color: 'var(--color-text)' }}>{b.label}</h1>
            <SentimentBadge tone={b.net} />
          </div>
          <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 620 }}>{b.blurb}</p>
          <div style={{ display: 'flex', gap: 18, marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-faint)' }}>
            <span>{b.threads} threads</span><span>{b.asks} consolidated asks</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 40, paddingBottom: 72, alignItems: 'start' }}>
        {/* Threads */}
        <div>
          <window.TDRSectionLabel icon="messages-square">Discussion threads</window.TDRSectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {threads.map((t) => <ThreadRow key={t.id} thread={t} onClick={() => go({ view: 'thread', bucket, thread: t.id })} />)}
            {threads.length === 0 && (
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-faint)', fontSize: 14 }}>Thread digests for this bucket are still being compiled.</p>
            )}
          </div>
        </div>
        {/* Top asks side rail */}
        <div>
          <window.TDRSectionLabel icon="flag">Top asks in {b.label.toLowerCase()}</window.TDRSectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bucketAsks.map((a, i) => <AskCard key={i} {...a} priority={i + 1} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadRow({ thread, onClick }) {
  const C = window.TDRCommunityFeedbackDesignSystem_42173e;
  const Icon = window.TDRIcon;
  const { SentimentBadge } = C;
  const [hover, setHover] = useStateBV(false);
  return (
    <article onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: '16px 18px', cursor: 'pointer', background: hover ? 'var(--color-surface-3)' : 'var(--color-surface-2)', border: '1px solid', borderColor: hover ? 'var(--color-border-strong)' : 'var(--color-border)', borderRadius: 'var(--radius-lg)', transition: 'all 180ms cubic-bezier(0.22,0.61,0.36,1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 7 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-faint)' }}>{thread.id}</span>
        <SentimentBadge tone={thread.sentiment} count={thread.mentions} />
      </div>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 18, color: 'var(--color-text)' }}>{thread.title}</h3>
      <p style={{ margin: '0 0 12px', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--color-text-muted)' }}>{thread.summary}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-faint)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="message-circle" size={13} /> {thread.replies}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="quote" size={13} /> {thread.quotes.length} cited</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)' }}>Open <Icon name="arrow-right" size={13} color="var(--color-accent)" /></span>
      </div>
    </article>
  );
}

window.BucketView = BucketView;
