/* global React */

/* ─────────────────────────── Thread view ─────────────────────────── */
function ThreadView({ bucket, thread, go }) {
  const C = window.TDRCommunityFeedbackDesignSystem_42173e;
  const Icon = window.TDRIcon;
  const { SentimentBadge, CategoryBadge, QuoteBlock, AskCard, Button } = C;
  const D = window.FEEDBACK_DATA;
  const t = (D.threads[bucket] || []).find((x) => x.id === thread);
  if (!t) return null;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 var(--container-pad)' }}>
      <button onClick={() => go({ view: 'bucket', bucket })} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 0, cursor: 'pointer', color: 'var(--color-text-muted)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13, padding: '28px 0 18px' }}>
        <Icon name="chevron-left" size={16} /> {D.buckets.find((b) => b.id === bucket).label}
      </button>

      <header style={{ paddingBottom: 24, borderBottom: '1px solid var(--color-border)', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-faint)' }}>{t.id}</span>
          <CategoryBadge category={bucket} />
          <SentimentBadge tone={t.sentiment} count={t.mentions} />
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 30, letterSpacing: '-.01em', lineHeight: 1.15, color: 'var(--color-text)' }}>{t.title}</h1>
        <p style={{ margin: '12px 0 0', fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.55, color: 'var(--color-text-muted)' }}>{t.summary}</p>
      </header>

      <section style={{ marginBottom: 36 }}>
        <window.TDRSectionLabel icon="flag">Consolidated asks</window.TDRSectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {t.asks.map((a, i) => <AskCard key={i} {...a} priority={i + 1} />)}
        </div>
      </section>

      <section style={{ marginBottom: 48 }}>
        <window.TDRSectionLabel icon="quote">Cited player voices</window.TDRSectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {t.quotes.map((q, i) => (
            <QuoteBlock key={i} username={q.username} timestamp={q.time} tone={q.tone}>{q.text}</QuoteBlock>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', gap: 12, paddingBottom: 72 }}>
        <Button variant="secondary" href={D.trello} iconRight={<Icon name="external-link" size={15} />}>Add to Trello board</Button>
        <Button variant="ghost" onClick={() => go({ view: 'bucket', bucket })}>Back to bucket</Button>
      </div>
    </div>
  );
}

window.ThreadView = ThreadView;
