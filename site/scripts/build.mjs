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
export const GITHUB_URL = 'https://github.com/imajes/tdr-feedback';

const SENTIMENT_HELP = [
  'Positive: broad support or constructive agreement.',
  'Frustrated: clear dissatisfaction without a fully negative consensus.',
  'Negative: defect pressure, strong dissatisfaction, or broad rejection of the current state.',
  'Mixed: split opinion, competing player archetypes, or important caveats.',
  'Neutral: primarily informational or low-emotion reporting.',
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
    description: 'Primary threads, one per spec. Long-form community analysis of each class.',
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

const HEADLINES = {
  'add-a-stash': 'Stash Access',
  'add-loadouts-to-the-game': 'Loadouts',
  'bulwark-master-thread': 'Bulwark',
  'clan-nests': 'Clan Nests',
  'clan-vendor': 'Clan Vendor Economy',
  'crafting-needs-a-change': 'Crafting Friction',
  'dark-zone-drops-are-too-plentiful-not-focused-enough': 'Dark Zone Loot Focus',
  'dark-zone-time-limit': 'Dark Zone Timers',
  'defence-reduction': 'Defence Reduction',
  'demolitionist-master-thread': 'Demolitionist',
  'drop-rates-are-an-issue': 'Targeted Loot Pressure',
  'elite-patrol-can-be-improved': 'Elite Patrol Design',
  'field-medic-master-thread': 'Field Medic',
  'healing-is-too-strong': 'Healing Pressure',
  'inventory-filters': 'Inventory Filtering',
  'lone-wolf': 'Solo Play Viability',
  'loot-system-master-thread': 'Loot Mechanics',
  'npcs-need': 'NPC Behaviour',
  'pummelling-shield': 'Pummelling Shield',
  'recalibration-modules': 'Recalibration Costs',
  'shooting-range-to-test-weapons-builds': 'Build Testing Range',
  'spot-a-typo-or-error': 'Text & UI Bugs',
  'tech-operator-master-thread': 'Tech Operator',
  'vanguard-master-thread': 'Vanguard',
};

export function routeForThread(slug) {
  const bucket = BUCKET_BY_THREAD.get(slug);
  if (!bucket) {
    return '#';
  }
  return `/${bucket.id}/${routeSlugForThread(slug)}/`;
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
  if (lower.includes('mixed')) return 'mixed';
  if (lower.includes('negative') || lower.includes('frustrated')) return 'negative';
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
      ...parseVoiceQuote(quote),
      note: noteLines.join(' '),
    });

    index = cursor - 1;
  }

  return comments;
}

function parseVoiceQuote(value) {
  const match = value.match(/^["“]([\s\S]+)["”]\s+—\s+(@[a-z0-9._-]+)(?:\s+\(([^)]+)\))?,\s+(\d{4}-\d{2}-\d{2})(?:\s+\(([^)]+)\))?$/i);
  if (!match) {
    return {
      quote: value,
      body: value,
      handle: '',
      displayName: '',
      date: '',
      reactionNote: '',
    };
  }

  return {
    quote: value,
    body: match[1].trim(),
    handle: match[2].trim(),
    displayName: match[3]?.trim() ?? '',
    date: match[4].trim(),
    reactionNote: match[5]?.trim() ?? '',
  };
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
    sourceTitle: title,
    title: headlineForThread(slug, title),
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
    threadMessageCount: thread.messageCount,
    threadParticipantCount: thread.uniqueParticipants,
    threadReactionTotal: thread.reactionTotal,
    score: echoScore(ask) + thread.uniqueParticipants,
  })));

  return {
    buckets,
    threads: visibleThreads.map((thread) => ({ ...thread, bucket: BUCKET_BY_THREAD.get(thread.slug) })),
    topAsks: selectTopAsks(allAsks),
    stats: {
      totalThreads: visibleThreads.length,
      navigableThreads: visibleThreads.length,
      totalAssessments: visibleThreads.length,
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
    const sourceMetadata = await readThreadSourceMetadata(assessment.slug, assessment.threadId);
    threads.push({
      ...assessment,
      sourceThreadName: sourceMetadata.sourceThreadName,
      discordUrl: sourceMetadata.discordUrl,
      keyComments: assessment.keyComments.map((comment) => enrichVoiceComment(comment, sourceMetadata)),
    });
  }
  return threads;
}

async function readThreadSourceMetadata(slug, threadId) {
  const sourcePath = path.join(REPO_DIR, 'threads', `${slug}.jsonl`);
  let threadName = '';
  let guildId = '';
  const sourceMessages = [];

  try {
    const contents = await fs.readFile(sourcePath, 'utf8');
    for (const line of contents.split('\n')) {
      if (!line.trim()) continue;
      const message = JSON.parse(line);
      threadName ||= message.thread_name || '';
      guildId ||= message.message_reference?.guild_id || '';
      sourceMessages.push({
        id: message.id,
        threadId: message.thread_id || threadId,
        username: message.author?.username || '',
        globalName: message.author?.global_name || '',
        content: message.content || '',
        date: message.timestamp?.slice(0, 10) || '',
        reactionTotal: Array.isArray(message.reactions)
          ? message.reactions.reduce((sum, reaction) => sum + Number(reaction.count || 0), 0)
          : 0,
      });
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  return {
    sourceThreadName: threadName,
    discordUrl: guildId && threadId ? `https://discord.com/channels/${guildId}/${threadId}` : '',
    sourceMessages,
    guildId,
  };
}

function enrichVoiceComment(comment, sourceMetadata) {
  const match = findSourceMessage(comment, sourceMetadata.sourceMessages);
  const messageUrl = match && sourceMetadata.guildId
    ? `https://discord.com/channels/${sourceMetadata.guildId}/${match.threadId}/${match.id}`
    : '';

  return {
    ...comment,
    messageUrl,
    threadUrl: sourceMetadata.discordUrl,
    reactionTotal: match?.reactionTotal ?? 0,
  };
}

function findSourceMessage(comment, sourceMessages) {
  if (!comment.handle || !comment.body) return null;
  const handle = comment.handle.replace(/^@/, '').toLowerCase();
  const quote = normalizeVoiceText(comment.body);
  const quoteSegments = voiceQuoteSegments(comment.body);

  return sourceMessages.find((message) => {
    if (message.username.toLowerCase() !== handle) return false;
    if (comment.date && message.date !== comment.date) return false;

    const source = normalizeVoiceText(message.content);
    if (!source || !quote) return false;
    if (source.includes(quote) || quote.includes(source)) return true;
    return quoteSegments.length > 0 && quoteSegments.every((segment) => source.includes(segment));
  }) ?? null;
}

function voiceQuoteSegments(value) {
  return String(value)
    .split(/\.{3}|…/g)
    .map((segment) => normalizeVoiceText(segment))
    .filter((segment) => segment.length >= 18);
}

function normalizeVoiceText(value) {
  return plainText(value)
    .replace(/\.{3}|…/g, ' ')
    .replace(/[^\p{L}\p{N}@]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
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
      await writePage(`${bucket.id}/${routeSlugForThread(thread.slug)}/index.html`, renderThreadPage(model, bucket, thread, routeForThread(thread.slug)));
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
              <a class="button secondary" href="#review-lanes"><i data-lucide="layout-grid"></i>Review lanes</a>
              <a class="button secondary" href="/about/"><i data-lucide="info"></i>Learn about this project</a>
            </div>
          </div>
          <div class="hero-panel" aria-label="Feedback coverage">
            <article class="hero-stat">
              <strong>${formatNumber(model.stats.totalThreads)}</strong>
              <span>Total threads</span>
            </article>
            <article class="hero-stat">
              <strong>${formatNumber(model.stats.totalParticipants)}</strong>
              <span>Unique participants</span>
            </article>
          </div>
        </div>
      </header>

      <section class="section" id="review-lanes">
        ${sectionHeader('layout-grid', 'Review lanes', 'Seven feedback workstreams matching the assessment structure.')}
        <div class="bucket-grid">
          ${model.buckets.map((bucket) => bucketCard(bucket)).join('')}
        </div>
      </section>

      <section class="section" id="top-priority">
        ${sectionHeader('flag', 'Top priority asks', 'Highest-signal asks ranked from participant reach and echo density.')}
        <div class="ask-list overview">
          ${model.topAsks.map((ask, index) => askCard(ask, index + 1, {
            preview: true,
          })).join('')}
        </div>
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
        <div class="ask-list overview compact">
          ${themes.map((ask, index) => askCard({
            ...ask,
            threadSlug: ask.thread.slug,
            threadTitle: ask.thread.title,
            threadRoute: routeForThread(ask.thread.slug),
            threadMessageCount: ask.thread.messageCount,
            threadParticipantCount: ask.thread.uniqueParticipants,
            threadReactionTotal: ask.thread.reactionTotal,
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
          </div>
          <aside class="thread-meta">
            <div><span>DISCORD THREAD</span><strong>${thread.discordUrl ? `<a href="${escapeAttribute(thread.discordUrl)}">${escapeHtml(displayThreadSourceName(thread))}</a>` : escapeHtml(displayThreadSourceName(thread))}</strong></div>
            <div><span>DATE RANGE</span><strong>${escapeHtml(formatDateRange(thread.dateRange) || 'Unlisted')}</strong></div>
          </aside>
        </div>
      </header>

      <nav class="thread-toc" aria-label="Thread sections">
        ${threadTocLink('bar-chart-3', '#signals', 'Signals', 'signals')}
        ${threadTocLink('activity', '#sentiment', 'Summary', `sentiment ${thread.sentiment}`)}
        ${threadTocLink(actionModel.type === 'bugs' ? 'bug' : 'flag', `#${actionModel.sectionId}`, actionModel.tocLabel, actionModel.type === 'bugs' ? 'bugs' : 'asks')}
        ${threadTocLink('message-circle', '#community-voices', 'Voices', 'voices')}
        ${threadTocLink('file-text', '#assessment', 'Dev notes', 'dev-notes')}
        ${threadTocLink('corner-down-right', '#related-threads', 'Related', 'related')}
      </nav>

      <section class="section narrative-overview" id="signals">
        ${sectionHeader('bar-chart-3', 'Review signals', 'Start with the scale and shape of the thread before reading the asks.', 'signals')}
        <div class="metrics-row">
          ${metricCard(thread.messageCount, 'Messages', 'excluding OP')}
          ${metricCard(thread.uniqueParticipants, 'Participants', 'unique contributors')}
          ${metricCard(thread.reactionTotal, 'Reactions', 'thread total')}
          ${metricCard(actionModel.count, actionModel.metricLabel, actionModel.metricSublabel)}
        </div>
      </section>

      <section class="section sentiment-section" id="sentiment">
        ${sectionHeader('activity', 'Summary and sentiment', 'The short read before diving into the detailed asks and evidence.', `sentiment ${thread.sentiment}`)}
        <article class="sentiment-card ${thread.sentiment}">
          <div class="sentiment-card-head">
            ${sentimentBadge(thread.sentiment, thread.sentimentLabel, true)}
            ${askTypeBadge(thread.askType)}
          </div>
          <div class="sentiment-card-body">
            <div>
              <span class="sentiment-kicker">Overall summary</span>
              ${renderInlineParagraphs(thread.summary)}
            </div>
            <div>
              <span class="sentiment-kicker">Sentiment read</span>
              ${renderInlineParagraphs(thread.sentimentNotes || 'No separate sentiment summary was captured for this assessment.')}
            </div>
          </div>
        </article>
      </section>

      ${renderActionSection(thread, actionModel)}

      <section class="section" id="community-voices">
        ${sectionHeader('message-circle', 'Community voices', 'Representative comments preserved from the synthesis.', 'voices')}
        <div class="quote-grid">
          ${thread.keyComments.slice(0, 4).map((comment, index) => quoteCard(comment, thread.sentiment, index + 1)).join('')}
        </div>
      </section>

      <section class="section assessment-section" id="assessment">
        ${sectionHeader('file-text', 'Dev notes', 'Editorial synthesis for developer review.', 'dev-notes')}
        <article class="prose">
          ${markdownProse(thread.assessment)}
        </article>
      </section>

      <section class="section" id="related-threads">
        ${sectionHeader('corner-down-right', 'Related threads', `More assessments in ${bucket.label}.`, 'related')}
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
      sectionId: 'reported-bugs',
      tocLabel: 'Reported bugs',
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
    sectionId: 'primary-asks',
    tocLabel: 'Primary asks',
    description: 'Actionable requests extracted from the synthesis.',
  };
}

function renderActionSection(thread, actionModel) {
  if (actionModel.type === 'bugs') {
    return `
      <section class="section" id="${actionModel.sectionId}">
        ${sectionHeader('bug', actionModel.title, actionModel.description, 'bugs')}
        <div class="finding-list">
          ${thread.bugFindings.map((finding, index) => bugFindingCard(finding, index + 1)).join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="section" id="${actionModel.sectionId}">
      ${sectionHeader('flag', actionModel.title, actionModel.description, 'asks')}
      ${thread.primaryAsks.length > 0 ? `
        <div class="ask-list">
          ${thread.primaryAsks.map((ask, index) => askDetailCard(ask, index + 1)).join('')}
        </div>
      ` : emptyState('No primary asks were separated in this assessment. Review the voices and assessment sections for the actionable findings.')}
    </section>
  `;
}

function renderAboutPage(model, currentPath) {
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
        <p>We exported structured feedback threads from Discord, analyzed them with two different AI models, and produced one assessment for each thread. Those assessments are plugged into this static site so developers can browse the feedback by review lane, ask, sentiment, source voices, and dev notes. The content and code are available at <a href="${GITHUB_URL}">github.com/imajes/tdr-feedback</a>.</p>
        <div class="hero-actions">
          <a class="button primary" href="${TRELLO_URL}"><i data-lucide="external-link"></i>TDR Official Trello</a>
          <a class="button secondary" href="/data.json"><i data-lucide="database"></i>View data export</a>
          <a class="button secondary" href="${GITHUB_URL}"><i data-lucide="github"></i>View source</a>
        </div>
      </header>

      <section class="section">
        ${sectionHeader('workflow', 'How the assessments were produced', 'A compact chain from raw community discussion to reviewable site content.')}
        <div class="flow-grid" aria-label="Assessment production flow">
          ${flowCard('01', 'Discord export', 'Forum thread messages, authors, dates, reactions, attachments, and thread IDs were exported from the TDR Discord.')}
          ${flowCard('02', 'Model pass A', 'One AI model extracted candidate asks, sentiment, representative voices, and defect evidence from each thread.')}
          ${flowCard('03', 'Model pass B', 'A second model cross-checked the synthesis, tightened wording, and helped separate bugs from opinions.')}
          ${flowCard('04', 'Markdown assessments', 'Each thread assessment remains in /assessments as the editable source of truth for the site.')}
          ${flowCard('05', 'Static site', 'The generator turns the assessments into Cloudflare-ready HTML, CSS, JSON, sitemap, and headers.')}
        </div>
      </section>

      <section class="section" id="data-export">
        ${sectionHeader('database', 'Data export', 'The generated JSON file exposes the same site model used by the rendered pages.')}
        <article class="data-export-card">
          <div>
            <h2><code>/data.json</code></h2>
            <p>The export contains the review lanes, visible thread assessments, top priority asks, and aggregate site stats. It is useful for quick inspection, downstream analysis, or rebuilding the site in another presentation layer.</p>
            <a class="text-link" href="/data.json">Open JSON export</a>
          </div>
          <dl class="schema-list">
            <div><dt><code>buckets[]</code></dt><dd>Review lanes with route IDs, labels, icons, descriptions, and included thread records.</dd></div>
            <div><dt><code>threads[]</code></dt><dd>Published assessments with metrics, asks, bug findings, sentiment, source links, voices, and dev notes.</dd></div>
            <div><dt><code>topAsks[]</code></dt><dd>Cross-thread priority asks with source route, category, score, and thread-level signal metrics.</dd></div>
            <div><dt><code>stats</code></dt><dd>Total assessments, visible threads, participants, messages, screenshots, lanes, and build date.</dd></div>
          </dl>
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
      <a class="trello-link" href="${TRELLO_URL}"><span>TDR Official Trello</span><i data-lucide="external-link"></i></a>
    </nav>
  `;
}

function footer(model) {
  return `
    <footer class="site-footer">
      <div>
        <strong>TDR Community Feedback</strong>
      </div>
      <div class="footer-meta">
        <span>Last update ${escapeHtml(model.stats.lastUpdated)}</span>
        <a href="${TRELLO_URL}">TDR Official Trello</a>
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
        <span class="card-title-row"><strong>${escapeHtml(bucket.label)}</strong><em>${formatThreadCount(bucket.threads.length)}</em></span>
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
      <p>${renderInlineMarkdown(summaryPreview(thread.summary))}</p>
      <div class="thread-card-meta">
        <span>${threadSignalMeta(thread)}</span>
      </div>
    </a>
  `;
}

function askCard(ask, priority, options = {}) {
  const signalItems = prioritySignalItems(ask);
  const askText = options.preview ? priorityAskPreview(ask.ask) : ask.ask;
  return `
    <a class="ask-card overview-card" href="${ask.threadRoute}" title="${escapeAttribute(plainText(ask.ask))}" aria-label="${escapeAttribute(plainText(ask.ask))}">
      <span class="priority">#${String(priority).padStart(2, '0')}</span>
      <div class="ask-type-tab">${categoryBadge(ask.category, categoryAccent(ask.category))}</div>
      <div class="ask-heading">
        <p>${renderInlineMarkdown(askText)}</p>
      </div>
      <dl class="signal-bar">
        ${signalItems.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${renderInlineMarkdown(value)}</dd></div>`).join('')}
      </dl>
    </a>
  `;
}

function askDetailCard(ask, priority) {
  return `
    <article class="ask-card detail">
      <span class="priority">#${String(priority).padStart(2, '0')}</span>
      <div class="ask-type-tab">${categoryBadge(ask.category, categoryAccent(ask.category))}</div>
      <div class="ask-heading">
        <p>${renderInlineMarkdown(ask.ask)}</p>
      </div>
      <dl>
        <div><dt>Raised by</dt><dd class="people-line">${renderInlineMarkdown(ask.firstRaisedBy || 'Not specified')}</dd></div>
        <div><dt>Echoed by</dt><dd class="people-line">${renderInlineMarkdown(ask.echoedBy || 'No explicit echo captured')}</dd></div>
      </dl>
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

function quoteCard(comment, sentiment, index) {
  const authorLabel = comment.displayName || comment.handle || 'Community voice';
  const dateLabel = comment.date ? formatDate(parseDateOnly(comment.date), true) : '';
  const reactionLabel = comment.reactionTotal ? `${formatNumber(comment.reactionTotal)} reactions` : comment.reactionNote;
  const sourceLink = comment.messageUrl || '';
  const fallbackLink = sourceLink || comment.threadUrl || '';
  const sourceLabel = sourceLink ? 'Discord message' : 'Discord thread';

  return `
    <figure class="quote-card ${sentiment}">
      <figcaption class="voice-card-head">
        <span class="voice-index">Voice ${String(index).padStart(2, '0')}</span>
        ${fallbackLink ? `<a href="${escapeAttribute(fallbackLink)}"><i data-lucide="external-link"></i><span>${sourceLabel}</span></a>` : ''}
      </figcaption>
      <blockquote>${renderInlineMarkdown(comment.body || comment.quote)}</blockquote>
      <div class="voice-meta">
        <span class="voice-author">${renderInlineMarkdown(comment.handle && comment.displayName ? `${comment.handle} (${comment.displayName})` : authorLabel)}</span>
        ${dateLabel ? `<span>${escapeHtml(dateLabel)}</span>` : ''}
        ${reactionLabel ? `<span>${escapeHtml(reactionLabel)}</span>` : ''}
      </div>
      ${comment.note ? `
        <div class="voice-note">
          <span>Why it matters</span>
          <p>${renderInlineMarkdown(comment.note)}</p>
        </div>
      ` : ''}
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

function flowCard(step, title, body) {
  return `
    <article class="flow-card">
      <span>${escapeHtml(step)}</span>
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

function metricCard(value, label, sublabel) {
  return `
    <article class="metric-card">
      <strong>${formatNumber(value)}</strong>
      <span>${escapeHtml(label)}</span>
      <em>${escapeHtml(sublabel)}</em>
    </article>
  `;
}

function threadTocLink(icon, href, label, tone) {
  return `<a class="toc-${escapeAttribute(tone).replaceAll(' ', ' toc-')}" href="${escapeAttribute(href)}"><i data-lucide="${icon}"></i><span>${escapeHtml(label)}</span></a>`;
}

function sectionHeader(icon, title, description, tone = '') {
  const toneClass = String(tone)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `section-header-${part}`)
    .join(' ');
  return `
    <div class="section-header${toneClass ? ` ${escapeAttribute(toneClass)}` : ''}">
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
  return `<button class="badge neutral meta-chip" type="button" data-popover-title="Ask type" data-popover-content="${escapeAttribute(ASK_TYPE_HELP)}">${escapeHtml(compactAskTypeLabel(label))}</button>`;
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

function renderInlineParagraphs(markdown) {
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

function selectTopAsks(asks, limit = 5) {
  const selected = [];
  const seenThreads = new Set();

  for (const ask of asks.sort((left, right) => right.score - left.score)) {
    if (seenThreads.has(ask.threadSlug)) continue;
    seenThreads.add(ask.threadSlug);
    selected.push(ask);
    if (selected.length === limit) break;
  }

  return selected;
}

function prioritySignalItems(ask) {
  const items = [
    ['Participants', formatNumber(ask.threadParticipantCount ?? 0)],
    ['Reactions', formatNumber(ask.threadReactionTotal ?? 0)],
    ['Echoes', formatNumber(echoScore(ask))],
    ['Source', ask.threadTitle ?? 'Unlisted'],
  ];

  return items.filter(([, value]) => value !== '0' || items.length <= 2);
}

function threadSignalMeta(thread) {
  return [
    formatMessageCount(thread.messageCount),
    formatParticipantCount(thread.uniqueParticipants),
    formatAskCount(thread.primaryAsks.length),
  ].join(' &middot; ');
}

function summaryPreview(text) {
  const first = firstParagraph(text);
  const sentences = first.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((part) => part.trim()).filter(Boolean) ?? [first];
  return sentences.slice(0, 2).join(' ');
}

function priorityAskPreview(text) {
  const normalized = plainText(text).replace(/\s+/g, ' ').trim();
  const phrase = normalized
    .split(/\s+[—–-]\s+|\s+\(/)[0]
    .replace(/[.!?]+$/, '')
    .trim();

  if (phrase.length >= 32 && phrase.length < normalized.length) {
    return `${phrase}...`;
  }

  return normalized;
}

function firstParagraph(text) {
  return trimMarkdownParagraphs(text)[0] ?? '';
}

function displayThreadSourceName(thread) {
  return (thread.sourceThreadName || thread.sourceTitle || thread.title)
    .replace(/\bmaster thread\b/gi, 'primary thread');
}

function titleFromSlug(slug) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function routeSlugForThread(slug) {
  return slugify(HEADLINES[slug] ?? slug.replace(/-master-thread$/i, ''));
}

function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

function headlineForThread(slug, fallback) {
  return HEADLINES[slug] ?? fallback.replace(/\s+Master Thread$/i, '').trim();
}

function compactAskTypeLabel(label) {
  const value = String(label).toLowerCase();
  if (value.includes('multiple')) return 'Multiple asks';
  if (value.includes('bug')) return 'Bug report';
  if (value.includes('balance')) return 'Balance';
  if (value.includes('qol') || value.includes('quality')) return 'QoL';
  if (value.includes('new feature')) return 'New feature';
  if (value.includes('rework')) return 'Rework';
  return label;
}

function formatNumber(value) {
  if (typeof value === 'number') return new Intl.NumberFormat('en-US').format(value);
  return String(value);
}

function formatThreadCount(count) {
  return `${formatNumber(count)} ${count === 1 ? 'thread' : 'threads'}`;
}

function formatMessageCount(count) {
  return `${formatNumber(count)} ${count === 1 ? 'message' : 'messages'}`;
}

function formatParticipantCount(count) {
  return `${formatNumber(count)} ${count === 1 ? 'participant' : 'participants'}`;
}

function formatAskCount(count) {
  return `${formatNumber(count)} ${count === 1 ? 'ask' : 'asks'}`;
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
