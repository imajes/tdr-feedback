import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DIR = path.resolve(__dirname, '..');
const REPO_DIR = path.resolve(SITE_DIR, '..');
const ASSESSMENTS_DIR = path.join(REPO_DIR, 'assessments');
const DESIGN_SYSTEM_DIR = path.join(REPO_DIR, 'docs', 'design-system');
const DIST_DIR = path.join(SITE_DIR, 'dist');

export const TRELLO_URL = 'https://trello.com/b/qTP1a9cv';

const SENTIMENT_HELP = [
  'Positive: broad support or constructive agreement.',
  'Negative: frustration, defect pressure, or strong dissatisfaction.',
  'Neutral: primarily informational or low-emotion reporting.',
  'Mixed: split opinion, competing player archetypes, or important caveats.',
].join('||');

const ASK_TYPE_HELP = [
  'Balance change: tuning numbers, mechanics, counters, or class interactions.',
  'Rework request: players want the shape of a system changed, not just tuned.',
  'New feature: a capability that does not currently exist.',
  'QoL: usability, workflow, clarity, or friction reduction.',
  'Bug report: concrete defect, typo, mismatch, or broken behavior.',
  'Multiple: the thread contains more than one ask type.',
].join('||');

export const BUCKETS = [
  {
    id: 'specialisation-deep-dives',
    label: 'Specialisation Deep-Dives',
    shortLabel: 'Specialisations',
    icon: 'shield',
    accent: 'specs',
    description: 'Master threads, one per spec. Long-form community analysis of each class.',
    slugs: [
      'bulwark-master-thread',
      'demolitionist-master-thread',
      'field-medic-master-thread',
      'tech-operator-master-thread',
      'vanguard-master-thread',
    ],
  },
  {
    id: 'balance',
    label: 'Balance',
    shortLabel: 'Balance',
    icon: 'scale',
    accent: 'balance',
    description: 'Things that feel numerically or mechanically wrong right now.',
    slugs: [
      'healing-is-too-strong',
      'defence-reduction',
      'pummelling-shield',
      'dark-zone-drops-are-too-plentiful-not-focused-enough',
      'dark-zone-time-limit',
    ],
  },
  {
    id: 'progression-economy',
    label: 'Progression & Economy',
    shortLabel: 'Progression',
    icon: 'package-open',
    accent: 'features',
    description: 'The build-completion loop: loot, crafting, recalibration.',
    slugs: [
      'loot-system-master-thread',
      'drop-rates-are-an-issue',
      'crafting-needs-a-change',
      'recalibration-modules',
    ],
  },
  {
    id: 'features-qol',
    label: 'Features & QoL',
    shortLabel: 'Features',
    icon: 'sliders-horizontal',
    accent: 'features',
    description: 'Things players want added or meaningfully improved.',
    slugs: [
      'add-a-stash',
      'add-loadouts-to-the-game',
      'inventory-filters',
      'shooting-range-to-test-weapons-builds',
      'lone-wolf',
    ],
  },
  {
    id: 'clan-social',
    label: 'Clan & Social',
    shortLabel: 'Clan',
    icon: 'users',
    accent: 'features',
    description: 'Clan infrastructure and social features.',
    slugs: ['clan-nests', 'clan-vendor'],
  },
  {
    id: 'world-content',
    label: 'World & Content',
    shortLabel: 'World',
    icon: 'map',
    accent: 'balance',
    description: 'NPC behaviour, patrol design, environmental content.',
    slugs: ['elite-patrol-can-be-improved', 'npcs-need'],
  },
  {
    id: 'bug-reports-polish',
    label: 'Bug Reports & Polish',
    shortLabel: 'Polish',
    icon: 'bug',
    accent: 'bugs',
    description: 'Text errors, mislabelling, localisation issues.',
    slugs: ['spot-a-typo-or-error'],
  },
];

const META_SLUGS = new Set(['suggest-a-topic-for-review']);
const BUCKET_BY_THREAD = new Map(BUCKETS.flatMap((bucket) => bucket.slugs.map((slug) => [slug, bucket])));

export function routeForThread(slug) {
  const bucket = BUCKET_BY_THREAD.get(slug);
  if (!bucket) {
    return META_SLUGS.has(slug) ? '/about/#suggest-a-topic-for-review' : '#';
  }
  return `/${bucket.id}/${slug}/`;
}

function section(markdown, heading) {
  const pattern = new RegExp(`(^|\\n)## ${escapeRegex(heading)}\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = markdown.match(pattern);
  return match ? match[2].trim() : '';
}

function metadataValue(markdown, label) {
  const pattern = new RegExp(`\\*\\*${escapeRegex(label)}:\\*\\*\\s*([^\\n]+)`);
  return markdown.match(pattern)?.[1].trim() ?? '';
}

function parseCount(value) {
  const match = value.match(/[0-9][0-9,]*/);
  return match ? Number(match[0].replaceAll(',', '')) : 0;
}

function normalizeSentiment(value) {
  const lower = value.toLowerCase();
  if (lower.includes('positive')) return 'positive';
  if (lower.includes('negative') || lower.includes('frustrated')) return 'negative';
  if (lower.includes('mixed')) return 'mixed';
  return 'neutral';
}

function trimMarkdownParagraphs(value) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.replace(/\n/g, ' ').trim())
    .filter((part) => !/^[-*_]{3,}$/.test(part))
    .filter(Boolean);
}

function parsePrimaryAsks(value) {
  const chunks = value
    .split(/\n(?=- \*\*Ask:\*\*)/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.map((chunk) => ({
    ask: chunk.match(/^- \*\*Ask:\*\*\s*([\s\S]*?)(?=\n\s+- \*\*First raised by:\*\*|\n\s+- \*\*Echoed by:\*\*|\n\s+- \*\*Category:\*\*|$)/)?.[1].trim() ?? '',
    firstRaisedBy: chunk.match(/\n\s+- \*\*First raised by:\*\*\s*([^\n]+)/)?.[1].trim() ?? '',
    echoedBy: chunk.match(/\n\s+- \*\*Echoed by:\*\*\s*([^\n]+)/)?.[1].trim() ?? '',
    category: chunk.match(/\n\s+- \*\*Category:\*\*\s*([^\n]+)/)?.[1].trim() ?? 'General',
  })).filter((ask) => ask.ask);
}

function parseBugFindings(value) {
  const findings = [];
  let current = null;

  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('- ')) {
      if (current) findings.push(current);
      current = parseBugFindingLine(line);
      continue;
    }

    if (!current) continue;

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      current.evidence.push({
        type: 'image',
        alt: image[1].trim() || current.title,
        href: screenshotHref(image[2].trim()),
      });
      continue;
    }

    const link = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      current.evidence.push({
        type: 'link',
        label: link[1].trim(),
        href: screenshotHref(link[2].trim()),
      });
    }
  }

  if (current) findings.push(current);
  return findings;
}

function parseBugFindingLine(line) {
  const text = line.replace(/^- /, '').trim();
  const match = text.match(/^\*\*([^*]+)\*\*:?\s*([\s\S]+)$/);
  if (match) {
    return {
      title: match[1].replace(/:$/, '').trim(),
      detail: match[2].trim(),
      evidence: [],
    };
  }

  return {
    title: titleFromFinding(text),
    detail: text,
    evidence: [],
  };
}

function screenshotHref(value) {
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return value;
  return `/assets/${value}`;
}

function titleFromFinding(value) {
  const withoutReporter = plainText(value).split(/\s+—\s+@/)[0].trim();
  if (withoutReporter.length <= 86) return withoutReporter;
  return `${withoutReporter.slice(0, 83).trim()}...`;
}

function parseKeyComments(value) {
  const lines = value.split('\n');
  const comments = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith('>')) continue;

    const quote = line.replace(/^>\s?/, '').trim();
    const noteLines = [];
    let cursor = index + 1;
    while (cursor < lines.length && !lines[cursor].trim().startsWith('>')) {
      const next = lines[cursor].trim();
      if (next) noteLines.push(next);
      cursor += 1;
    }

    comments.push({
      quote,
      note: noteLines.join(' '),
    });

    index = cursor - 1;
  }

  return comments;
}

export function parseAssessmentMarkdown(filename, markdown) {
  const slug = filename.replace(/\.md$/, '');
  const title = markdown.match(/^#\s+(.+)$/m)?.[1].trim() ?? titleFromSlug(slug);
  const sentimentSection = section(markdown, 'Sentiment');
  const sentimentLabel = sentimentSection.match(/\*\*Overall:\*\*\s*([^\n]+)/)?.[1].trim() ?? 'Neutral';
  const summary = trimMarkdownParagraphs(section(markdown, 'Summary')).join('\n\n');
  const assessment = section(markdown, 'Thread Assessment');

  return {
    slug,
    title,
    threadId: metadataValue(markdown, 'Thread ID'),
    messageCount: parseCount(metadataValue(markdown, 'Total Messages')),
    dateRange: metadataValue(markdown, 'Date Range'),
    uniqueParticipants: parseCount(metadataValue(markdown, 'Unique Participants')),
    reactionTotal: parseCount(section(markdown, 'Volume & Loudness').match(/\*\*Total reactions:\*\*\s*([^\n]+)/)?.[1] ?? ''),
    askType: trimMarkdownParagraphs(section(markdown, 'Ask Type'))[0] ?? 'Community Feedback',
    summary,
    primaryAsks: parsePrimaryAsks(section(markdown, 'Primary Asks')),
    bugFindings: parseBugFindings(section(markdown, 'Error Categories Found')),
    loudness: section(markdown, 'Volume & Loudness'),
    sentiment: normalizeSentiment(sentimentLabel),
    sentimentLabel,
    sentimentNotes: trimMarkdownParagraphs(sentimentSection.replace(/\*\*Overall:\*\*[^\n]+/, '').trim()).join('\n\n'),
    keyComments: parseKeyComments(section(markdown, 'Key Comments')),
    assessment,
    route: routeForThread(slug),
  };
}

export function buildSiteModel(threads) {
  const visibleThreads = threads.filter((thread) => !META_SLUGS.has(thread.slug));
  const metaThreads = threads.filter((thread) => META_SLUGS.has(thread.slug));
  const buckets = BUCKETS.map((bucket) => ({
    ...bucket,
    threads: bucket.slugs
      .map((slug) => visibleThreads.find((thread) => thread.slug === slug))
      .filter(Boolean)
      .map((thread) => ({ ...thread, bucket })),
  }));

  const allAsks = visibleThreads.flatMap((thread) => thread.primaryAsks.map((ask) => ({
    ...ask,
    threadSlug: thread.slug,
    threadTitle: thread.title,
    threadRoute: routeForThread(thread.slug),
    score: echoScore(ask) + thread.uniqueParticipants,
  })));

  return {
    buckets,
    threads: visibleThreads.map((thread) => ({ ...thread, bucket: BUCKET_BY_THREAD.get(thread.slug) })),
    metaThreads,
    topAsks: allAsks.sort((left, right) => right.score - left.score).slice(0, 5),
    stats: {
      totalThreads: threads.length,
      navigableThreads: visibleThreads.length,
      totalAssessments: threads.length,
      totalParticipants: visibleThreads.reduce((sum, thread) => sum + thread.uniqueParticipants, 0),
      totalMessages: visibleThreads.reduce((sum, thread) => sum + thread.messageCount, 0),
      buckets: BUCKETS.length,
      screenshots: 29,
      lastUpdated: new Date().toISOString().slice(0, 10),
    },
  };
}

async function readAssessments() {
  const entries = await fs.readdir(ASSESSMENTS_DIR);
  const files = entries.filter((entry) => entry.endsWith('.md')).sort();
  const threads = [];
  for (const file of files) {
    const markdown = await fs.readFile(path.join(ASSESSMENTS_DIR, file), 'utf8');
    const assessment = parseAssessmentMarkdown(file, markdown);
    threads.push({
      ...assessment,
      ...await readThreadSourceMetadata(assessment.slug, assessment.threadId),
    });
  }
  return threads;
}

async function readThreadSourceMetadata(slug, threadId) {
  const sourcePath = path.join(REPO_DIR, 'threads', `${slug}.jsonl`);
  let threadName = '';
  let guildId = '';

  try {
    const contents = await fs.readFile(sourcePath, 'utf8');
    for (const line of contents.split('\n')) {
      if (!line.trim()) continue;
      const message = JSON.parse(line);
      threadName ||= message.thread_name || '';
      guildId ||= message.message_reference?.guild_id || '';
      if (threadName && guildId) break;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  return {
    sourceThreadName: threadName,
    discordUrl: guildId && threadId ? `https://discord.com/channels/${guildId}/${threadId}` : '',
  };
}

async function build() {
  const threads = await readAssessments();
  const model = buildSiteModel(threads);
  await cleanDist();
  await fs.mkdir(DIST_DIR, { recursive: true });
  await copyDesignAssets();
  await copyPublicAssets();

  await writePage('index.html', renderHomePage(model, '/'));
  await writePage('about/index.html', renderAboutPage(model, '/about/'));

  for (const bucket of model.buckets) {
    await writePage(`${bucket.id}/index.html`, renderBucketPage(model, bucket, `/${bucket.id}/`));
    for (const thread of bucket.threads) {
      await writePage(`${bucket.id}/${thread.slug}/index.html`, renderThreadPage(model, bucket, thread, routeForThread(thread.slug)));
    }
  }

  await fs.writeFile(path.join(DIST_DIR, '_headers'), [
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
    '',
  ].join('\n'));

  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), renderSitemap(model));
  await fs.writeFile(path.join(DIST_DIR, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://tdr-feedback.imaj.es/sitemap.xml\n');
  await fs.writeFile(path.join(DIST_DIR, 'data.json'), `${JSON.stringify(model, null, 2)}\n`);
}

async function cleanDist() {
  const expectedDist = path.join(SITE_DIR, 'dist');
  if (DIST_DIR !== expectedDist || !DIST_DIR.startsWith(`${SITE_DIR}${path.sep}`)) {
    throw new Error(`Refusing to clean unexpected output directory: ${DIST_DIR}`);
  }

  try {
    const stat = await fs.stat(DIST_DIR);
    if (!stat.isDirectory()) {
      throw new Error(`Refusing to clean non-directory output path: ${DIST_DIR}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }

  await fs.rm(DIST_DIR, { recursive: true });
}

async function copyDesignAssets() {
  await fs.cp(path.join(DESIGN_SYSTEM_DIR, 'styles.css'), path.join(DIST_DIR, 'design-system', 'styles.css'), { recursive: true });
  await fs.cp(path.join(DESIGN_SYSTEM_DIR, 'tokens'), path.join(DIST_DIR, 'design-system', 'tokens'), { recursive: true });
  await fs.cp(path.join(DESIGN_SYSTEM_DIR, 'assets', 'brand'), path.join(DIST_DIR, 'assets', 'brand'), { recursive: true });
  await fs.cp(path.join(ASSESSMENTS_DIR, 'screenshots'), path.join(DIST_DIR, 'assets', 'screenshots'), { recursive: true });
}

async function copyPublicAssets() {
  await fs.mkdir(path.join(DIST_DIR, 'assets'), { recursive: true });
  await fs.copyFile(path.join(SITE_DIR, 'src', 'site.css'), path.join(DIST_DIR, 'assets', 'site.css'));
  await fs.copyFile(path.join(SITE_DIR, 'src', 'site.js'), path.join(DIST_DIR, 'assets', 'site.js'));
}

async function writePage(relativePath, html) {
  const destination = path.join(DIST_DIR, relativePath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, html);
}

function renderHomePage(model, currentPath) {
  return layout({
    model,
    currentPath,
    title: 'TDR Community Feedback',
    description: 'A field-report style index of The Division: Resurgence community feedback assessments.',
    body: `
      <header class="hero">
        <div class="eyebrow">THE DIVISION: RESURGENCE - COMMUNITY DEBRIEF</div>
        <div class="hero-grid">
          <div>
            <h1>Consolidated player feedback, read like a field report.</h1>
            <p class="hero-copy">Community forum threads distilled into ranked asks, attributed quotes, and reviewable assessment notes for the development team.</p>
            <div class="hero-actions">
              <a class="button primary" href="#top-priority"><i data-lucide="flag"></i>Review priority asks</a>
              <a class="button secondary" href="/about/"><i data-lucide="info"></i>Read context</a>
            </div>
          </div>
          <div class="hero-panel" aria-label="Feedback coverage">
            <article class="hero-stat">
              <strong>${formatNumber(model.stats.totalThreads)}</strong>
              <span>Total threads</span>
            </article>
            <article class="hero-stat">
              <strong>${formatNumber(model.stats.totalParticipants)}</strong>
              <span>Participant touches</span>
            </article>
          </div>
        </div>
      </header>

      <section class="section">
        ${sectionHeader('layout-grid', 'Review lanes', 'Seven feedback workstreams matching the assessment structure.')}
        <div class="bucket-grid">
          ${model.buckets.map((bucket) => bucketCard(bucket)).join('')}
        </div>
      </section>

      <section class="section" id="top-priority">
        ${sectionHeader('flag', 'Top priority asks', 'Highest-signal asks ranked from participant reach and echo density.')}
        <div class="ask-list">
          ${model.topAsks.map((ask, index) => askCard(ask, index + 1)).join('')}
        </div>
      </section>

      <section class="section split-section">
        <article class="callout">
          <div class="eyebrow">META INTAKE</div>
          <h2>Suggested review topics stay visible without becoming a lane.</h2>
          <p>${renderInlineMarkdown(model.metaThreads[0]?.summary ?? 'The meta thread is retained on the homepage and about page for intake continuity.')}</p>
          <a class="text-link" href="/about/#suggest-a-topic-for-review">Open meta context</a>
        </article>
        <article class="callout muted">
          <div class="eyebrow">BUILD OUTPUT</div>
          <h2>Every assessment has a static page.</h2>
          <p>The build creates review-lane pages, individual thread pages, a machine-readable data export, sitemap, and Cloudflare headers.</p>
          <a class="text-link" href="/data.json">Inspect JSON export</a>
        </article>
      </section>
    `,
  });
}

function renderBucketPage(model, bucket, currentPath) {
  const themes = bucket.threads.flatMap((thread) => thread.primaryAsks.slice(0, 2).map((ask) => ({ ...ask, thread }))).slice(0, 5);
  return layout({
    model,
    currentPath,
    title: `${bucket.label} - TDR Community Feedback`,
    description: bucket.description,
    body: `
      <header class="page-header">
        <div class="breadcrumb"><a href="/">Home</a><span>/</span><span>${escapeHtml(bucket.label)}</span></div>
        <div class="bucket-title-row">
          <span class="icon-tile ${bucket.accent}"><i data-lucide="${bucket.icon}"></i></span>
          <div>
            <div class="eyebrow">${bucket.threads.length} THREADS</div>
            <h1>${escapeHtml(bucket.label)}</h1>
          </div>
        </div>
        <p>${escapeHtml(bucket.description)}</p>
      </header>

      <section class="section">
        ${sectionHeader('messages-square', 'Thread assessments', 'Each card links to the full assessment, asks, voices, and related threads.')}
        <div class="thread-grid">
          ${bucket.threads.map((thread) => threadCard(thread, bucket)).join('')}
        </div>
      </section>

      <section class="section">
        ${sectionHeader('network', 'Common themes', 'Recurring asks surfaced across this review lane.')}
        <div class="ask-list compact">
          ${themes.map((ask, index) => askCard({
            ...ask,
            threadSlug: ask.thread.slug,
            threadTitle: ask.thread.title,
            threadRoute: routeForThread(ask.thread.slug),
          }, index + 1)).join('')}
        </div>
      </section>
    `,
  });
}

function renderThreadPage(model, bucket, thread, currentPath) {
  const related = bucket.threads.filter((candidate) => candidate.slug !== thread.slug).slice(0, 3);
  const actionModel = threadActionModel(thread);
  return layout({
    model,
    currentPath,
    title: `${thread.title} - TDR Community Feedback`,
    description: thread.summary,
    body: `
      <header class="page-header thread-header">
        <div class="breadcrumb"><a href="/">Home</a><span>/</span><a href="/${bucket.id}/">${escapeHtml(bucket.label)}</a><span>/</span><span>${escapeHtml(thread.title)}</span></div>
        <div class="thread-title-grid">
          <div>
            <div class="badge-row">
              ${categoryBadge(bucket.label, bucket.accent)}
              ${sentimentBadge(thread.sentiment, thread.sentimentLabel, true)}
              ${askTypeBadge(thread.askType)}
            </div>
            <h1>${escapeHtml(thread.title)}</h1>
            <p>${renderInlineMarkdown(thread.summary)}</p>
            <div class="hero-actions thread-actions">
              <a class="button secondary" href="#assessment"><i data-lucide="file-text"></i>Jump to assessment</a>
            </div>
          </div>
          <aside class="thread-meta">
            <div><span>DISCORD THREAD</span><strong>${thread.discordUrl ? `<a href="${escapeAttribute(thread.discordUrl)}">${escapeHtml(thread.sourceThreadName || thread.title)}</a>` : escapeHtml(thread.sourceThreadName || thread.title)}</strong></div>
            <div><span>DATE RANGE</span><strong>${escapeHtml(formatDateRange(thread.dateRange) || 'Unlisted')}</strong></div>
          </aside>
        </div>
      </header>

      <section class="metrics-row">
        ${metricCard('messages-square', thread.messageCount, 'Messages', 'excluding OP')}
        ${metricCard('users', thread.uniqueParticipants, 'Participants', 'unique contributors')}
        ${metricCard('radio', thread.reactionTotal, 'Reactions', 'thread total')}
        ${metricCard(actionModel.icon, actionModel.count, actionModel.metricLabel, actionModel.metricSublabel)}
      </section>

      ${renderActionSection(thread, actionModel)}

      <section class="section">
        ${sectionHeader('message-circle', 'Community voices', 'Representative comments preserved from the synthesis.')}
        <div class="quote-grid">
          ${thread.keyComments.slice(0, 4).map((comment) => quoteCard(comment, thread.sentiment)).join('')}
        </div>
      </section>

      <section class="section assessment-section" id="assessment">
        ${sectionHeader('file-text', 'Assessment', 'Editorial synthesis for developer review.')}
        <article class="prose">
          ${markdownProse(thread.assessment)}
        </article>
      </section>

      <section class="section">
        ${sectionHeader('corner-down-right', 'Related threads', `More assessments in ${bucket.label}.`)}
        <div class="related-grid">
          ${related.map((candidate) => threadCard(candidate, bucket)).join('')}
        </div>
      </section>
    `,
  });
}

function threadActionModel(thread) {
  if (thread.bugFindings.length > 0 && thread.primaryAsks.length === 0) {
    return {
      type: 'bugs',
      icon: 'bug',
      count: thread.bugFindings.length,
      metricLabel: 'Findings',
      metricSublabel: 'reported issues',
      title: 'Reported bugs',
      description: 'Concrete text, labelling, localisation, and UI defects extracted from the report thread.',
    };
  }

  return {
    type: 'asks',
    icon: 'activity',
    count: thread.primaryAsks.length,
    metricLabel: 'Primary asks',
    metricSublabel: thread.askType,
    title: 'Primary asks',
    description: 'Actionable requests extracted from the synthesis.',
  };
}

function renderActionSection(thread, actionModel) {
  if (actionModel.type === 'bugs') {
    return `
      <section class="section">
        ${sectionHeader('bug', actionModel.title, actionModel.description)}
        <div class="finding-list">
          ${thread.bugFindings.map((finding, index) => bugFindingCard(finding, index + 1)).join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="section">
      ${sectionHeader('flag', actionModel.title, actionModel.description)}
      ${thread.primaryAsks.length > 0 ? `
        <div class="ask-list">
          ${thread.primaryAsks.map((ask, index) => askDetailCard(ask, index + 1)).join('')}
        </div>
      ` : emptyState('No primary asks were separated in this assessment. Review the voices and assessment sections for the actionable findings.')}
    </section>
  `;
}

function renderAboutPage(model, currentPath) {
  const meta = model.metaThreads[0];
  return layout({
    model,
    currentPath,
    title: 'About - TDR Community Feedback',
    description: 'Context, credits, source model, and publishing details for the TDR feedback site.',
    body: `
      <header class="page-header">
        <div class="breadcrumb"><a href="/">Home</a><span>/</span><span>About</span></div>
        <div class="eyebrow">CONTEXT</div>
        <h1>Community feedback packaged for development review.</h1>
        <p><span class="user-mention">UBI_James</span> set up structured Discord forum threads for The Division: Resurgence feedback. <span class="user-mention">@imajes</span> consolidated the discussions into Markdown assessments. This site turns those assessments into static pages that are easier to browse, cite, and deploy.</p>
        <div class="hero-actions">
          <a class="button primary" href="${TRELLO_URL}"><i data-lucide="external-link"></i>Open Trello board</a>
          <a class="button secondary" href="/data.json"><i data-lucide="database"></i>View data export</a>
        </div>
      </header>

      <section class="section">
        ${sectionHeader('list-checks', 'Publishing model', 'The build is intentionally static and auditable.')}
        <div class="method-grid">
          ${methodCard('Source', 'Assessments in /assessments remain the source of truth. The generator reads Markdown and preserves asks, quotes, metrics, and assessment prose.')}
          ${methodCard('Structure', 'Routes follow docs/site-structure.md: homepage, about, review-lane landing pages, and individual thread pages.')}
          ${methodCard('Design', 'Visual treatment uses docs/design-system tokens, brand assets, restrained dark surfaces, monospace metrics, and muted sentiment badges.')}
          ${methodCard('Deployment', 'Cloudflare Pages builds site/dist from site/package.json and can deploy on push through the included workflow or Pages Git integration.')}
        </div>
      </section>

      <section class="section" id="suggest-a-topic-for-review">
        ${sectionHeader('inbox', 'Meta thread', 'Surfaced for intake continuity, not as a navigable review lane.')}
        <article class="callout">
          <div class="eyebrow">${escapeHtml(meta?.title ?? 'Suggest a Topic for Review')}</div>
          <h2>${escapeHtml(meta?.askType ?? 'Community intake')}</h2>
          <p>${renderInlineMarkdown(meta?.summary ?? 'No meta assessment was found.')}</p>
        </article>
      </section>
    `,
  });
}

function layout({ model, currentPath, title, description, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeAttribute(plainText(description))}">
    <meta property="og:title" content="${escapeAttribute(title)}">
    <meta property="og:description" content="${escapeAttribute(plainText(description))}">
    <meta property="og:url" content="https://tdr-feedback.imaj.es${currentPath}">
    <title>${escapeHtml(title)}</title>
    <link rel="icon" href="/assets/brand/mark.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/site.css">
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
    <script src="/assets/site.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    ${nav(model, currentPath)}
    <main id="main" class="page-shell">
      ${body}
    </main>
    ${footer(model)}
  </body>
</html>`;
}

function nav(model, currentPath) {
  const links = [
    ['/', 'Home'],
    ...model.buckets.map((bucket) => [`/${bucket.id}/`, bucket.shortLabel]),
    ['/about/', 'About'],
  ];

  return `
    <nav class="top-nav" aria-label="Primary navigation">
      <a class="brand" href="/">
        <img src="/assets/brand/mark.svg" alt="" width="22" height="22">
        <span>TDR FEEDBACK</span>
      </a>
      <div class="nav-scroll">
        ${links.map(([href, label]) => `<a class="${isActivePath(currentPath, href) ? 'active' : ''}" href="${href}">${escapeHtml(label)}</a>`).join('')}
      </div>
      <a class="trello-link" href="${TRELLO_URL}"><span>Trello board</span><i data-lucide="external-link"></i></a>
    </nav>
  `;
}

function footer(model) {
  return `
    <footer class="site-footer">
      <div>
        <strong>TDR Community Feedback</strong>
        <span>Built from Markdown assessments for Cloudflare Pages.</span>
      </div>
      <div class="footer-meta">
        <span>Last update ${escapeHtml(model.stats.lastUpdated)}</span>
        <a href="${TRELLO_URL}">Trello</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </footer>
  `;
}

function bucketCard(bucket) {
  return `
    <a class="bucket-card" href="/${bucket.id}/">
      <span class="icon-tile ${bucket.accent}"><i data-lucide="${bucket.icon}"></i></span>
      <span>
        <span class="card-title-row"><strong>${escapeHtml(bucket.label)}</strong><em>${bucket.threads.length} threads</em></span>
        <span>${escapeHtml(bucket.description)}</span>
      </span>
    </a>
  `;
}

function threadCard(thread, bucket) {
  return `
    <a class="thread-card" href="${routeForThread(thread.slug)}">
      <div class="card-topline">
        ${categoryBadge(bucket.label, bucket.accent)}
        ${sentimentBadge(thread.sentiment, thread.sentimentLabel)}
      </div>
      <h3>${escapeHtml(thread.title)}</h3>
      <p>${renderInlineMarkdown(firstParagraph(thread.summary))}</p>
      <div class="thread-card-meta">
        <span>${formatNumber(thread.messageCount)} msg</span>
        <span>${formatNumber(thread.uniqueParticipants)} participants</span>
        <span>${thread.primaryAsks.length} asks</span>
      </div>
    </a>
  `;
}

function askCard(ask, priority) {
  return `
    <a class="ask-card" href="${ask.threadRoute}">
      <span class="priority">#${String(priority).padStart(2, '0')}</span>
      <p>${renderInlineMarkdown(ask.ask)}</p>
      <div>
        ${categoryBadge(ask.category, categoryAccent(ask.category))}
        <span class="raised">From ${escapeHtml(ask.threadTitle)}</span>
      </div>
    </a>
  `;
}

function askDetailCard(ask, priority) {
  return `
    <article class="ask-card detail">
      <span class="priority">#${String(priority).padStart(2, '0')}</span>
      <p>${renderInlineMarkdown(ask.ask)}</p>
      <dl>
        <div><dt>Raised by</dt><dd class="people-line">${renderInlineMarkdown(ask.firstRaisedBy || 'Not specified')}</dd></div>
        <div><dt>Echoed by</dt><dd class="people-line">${renderInlineMarkdown(ask.echoedBy || 'No explicit echo captured')}</dd></div>
      </dl>
      <div>${categoryBadge(ask.category, categoryAccent(ask.category))}</div>
    </article>
  `;
}

function bugFindingCard(finding, priority) {
  return `
    <article class="finding-card">
      <span class="priority">#${String(priority).padStart(2, '0')}</span>
      <h3>${renderInlineMarkdown(finding.title)}</h3>
      <p>${renderInlineMarkdown(finding.detail)}</p>
      ${finding.evidence.length > 0 ? `
        <div class="evidence-grid">
          ${finding.evidence.map((item) => evidenceItem(item)).join('')}
        </div>
      ` : ''}
    </article>
  `;
}

function evidenceItem(item) {
  if (item.type === 'image') {
    return `
      <button class="evidence-thumb" type="button" data-lightbox-src="${escapeAttribute(item.href)}" data-lightbox-alt="${escapeAttribute(item.alt)}">
        <img src="${escapeAttribute(item.href)}" alt="${escapeAttribute(item.alt)}" loading="lazy">
        <span>${escapeHtml(item.alt)}</span>
      </button>
    `;
  }

  return `<a class="evidence-link" href="${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a>`;
}

function quoteCard(comment, sentiment) {
  return `
    <figure class="quote-card ${sentiment}">
      <blockquote>${renderInlineMarkdown(comment.quote)}</blockquote>
      ${comment.note ? `<figcaption>${renderInlineMarkdown(comment.note)}</figcaption>` : ''}
    </figure>
  `;
}

function methodCard(title, body) {
  return `
    <article class="method-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </article>
  `;
}

function emptyState(message) {
  return `
    <article class="empty-state">
      <i data-lucide="circle-dashed"></i>
      <p>${escapeHtml(message)}</p>
    </article>
  `;
}

function metricCard(icon, value, label, sublabel) {
  return `
    <article class="metric-card">
      ${icon ? `<span class="metric-icon"><i data-lucide="${icon}"></i></span>` : ''}
      <strong>${formatNumber(value)}</strong>
      <span>${escapeHtml(label)}</span>
      <em>${escapeHtml(sublabel)}</em>
    </article>
  `;
}

function sectionHeader(icon, title, description) {
  return `
    <div class="section-header">
      <span><i data-lucide="${icon}"></i></span>
      <div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(description)}</p>
      </div>
    </div>
  `;
}

function categoryBadge(label, accent) {
  return `<span class="badge category ${accent}">${escapeHtml(label)}</span>`;
}

function askTypeBadge(label) {
  return `<button class="badge neutral meta-chip" type="button" data-popover-title="Ask type" data-popover-content="${escapeAttribute(ASK_TYPE_HELP)}">${escapeHtml(label)}</button>`;
}

function sentimentBadge(tone, label, interactive = false) {
  const glyph = { positive: '▲', negative: '▼', neutral: '■', mixed: '◆' }[tone] ?? '■';
  const content = `${glyph} ${escapeHtml(label)}`;
  if (interactive) {
    return `<button class="badge sentiment ${tone} meta-chip" type="button" data-popover-title="Sentiment" data-popover-content="${escapeAttribute(SENTIMENT_HELP)}">${content}</button>`;
  }
  return `<span class="badge sentiment ${tone}">${content}</span>`;
}

function markdownProse(markdown) {
  return trimMarkdownParagraphs(markdown)
    .map((paragraph) => `<p>${renderInlineMarkdown(paragraph)}</p>`)
    .join('');
}

function paragraphs(text) {
  return trimMarkdownParagraphs(text)
    .map((paragraph) => escapeHtml(paragraph))
    .join('\n\n');
}

function renderSitemap(model) {
  const urls = [
    '/',
    '/about/',
    ...model.buckets.map((bucket) => `/${bucket.id}/`),
    ...model.threads.map((thread) => routeForThread(thread.slug)),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>https://tdr-feedback.imaj.es${url}</loc></url>`).join('\n')}
</urlset>
`;
}

function categoryAccent(category) {
  const value = category.toLowerCase();
  if (value.includes('bug')) return 'bugs';
  if (value.includes('balance')) return 'balance';
  if (value.includes('spec') || value.includes('class')) return 'specs';
  return 'features';
}

function echoScore(ask) {
  if (!ask.echoedBy || ask.echoedBy.toLowerCase().includes('no explicit')) return 0;
  return ask.echoedBy.split('@').length - 1;
}

function firstParagraph(text) {
  return trimMarkdownParagraphs(text)[0] ?? '';
}

function titleFromSlug(slug) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function formatNumber(value) {
  if (typeof value === 'number') return new Intl.NumberFormat('en-US').format(value);
  return String(value);
}

function formatDateRange(value) {
  const dates = String(value)
    .split(/\s*(?:→|->| to )\s*/i)
    .map((part) => parseDateOnly(part))
    .filter(Boolean);

  if (dates.length === 0) return value;
  if (dates.length === 1 || dates[0].getTime() === dates.at(-1).getTime()) {
    return formatDate(dates[0], true);
  }

  const start = dates[0];
  const end = dates.at(-1);
  if (start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${formatDate(start, false)} - ${formatDate(end, true)}`;
  }
  return `${formatDate(start, true)} - ${formatDate(end, true)}`;
}

function parseDateOnly(value) {
  const match = String(value).match(/(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  const date = new Date(`${match[1]}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date, includeYear) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC',
  }).format(date);
}

function isActivePath(currentPath, href) {
  if (href === '/') return currentPath === '/';
  return currentPath.startsWith(href);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(firstParagraph(String(value))).replaceAll('\n', ' ');
}

function plainText(value) {
  return String(value)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}

function renderInlineMarkdown(value) {
  const people = [];
  const withPeoplePlaceholders = String(value).replace(/(@[a-z0-9._-]+)\s+\(([^)]+)\)/gi, (_, handle, rawName) => {
    const label = rawName === 'None' ? handle : rawName;
    const token = `%%PERSON_${people.length}%%`;
    people.push(`<span class="user-chip" title="${escapeAttribute(handle)}" aria-label="${escapeAttribute(`${plainText(label)} ${handle}`)}">${escapeHtml(label)}</span>`);
    return token;
  });

  const html = escapeHtml(withPeoplePlaceholders)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return renderMentions(html).replace(/%%PERSON_(\d+)%%/g, (_, index) => people[Number(index)] ?? '');
}

function renderMentions(html) {
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => part.startsWith('<') ? part : part.replace(/(^|[\s([{"'>&;:-])(@[a-z0-9._-]+)/gi, '$1<span class="user-mention">$2</span>'))
    .join('');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
