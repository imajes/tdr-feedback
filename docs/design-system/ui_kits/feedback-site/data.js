// Fake consolidated-feedback data for The Division: Resurgence community site.
// Content is illustrative, written in the system's data-forward voice.
window.FEEDBACK_DATA = {
  trello: 'https://trello.com/b/tdr-community',
  buckets: [
    { id: 'specs',    label: 'Specs',       icon: 'cpu',        threads: 6, asks: 9,  net: 'mixed',    blurb: 'Performance, device support, frame-rate and build targets.' },
    { id: 'balance',  label: 'Balance',     icon: 'scale',      threads: 7, asks: 14, net: 'negative', blurb: 'TTK, weapon tuning, skill cooldowns and PvP fairness.' },
    { id: 'features', label: 'Features',    icon: 'sparkles',   threads: 7, asks: 11, net: 'positive', blurb: 'Requested systems: stash, social, endgame, QoL.' },
    { id: 'bugs',     label: 'Bug Reports', icon: 'bug',        threads: 5, asks: 8,  net: 'negative', blurb: 'Reproducible defects, crashes and progression blockers.' },
  ],
  metrics: [
    { icon: 'messages-square', value: '25', label: 'Threads', sub: 'across 4 buckets', accent: 'var(--color-accent)' },
    { icon: 'flag',            value: '42', label: 'Open asks', sub: 'consolidated', accent: 'var(--color-blue)' },
    { icon: 'users',           value: '1.3k', label: 'Players cited', sub: 'unique authors', accent: 'var(--color-positive)' },
    { icon: 'trending-up',     value: '54%', label: 'Net positive', sub: 'feature requests', accent: 'var(--color-positive)' },
  ],
  topAsks: [
    { priority: 1, ask: 'Add a stash search and tag filter — players can\'t locate gear across 200+ slots.', category: 'features', sentiment: 'positive', mentions: 64, raisedBy: '18 threads' },
    { priority: 2, ask: 'Normalise time-to-kill at range; burst weapons feel inconsistent past 25m.', category: 'balance', sentiment: 'negative', mentions: 51, raisedBy: 'Ghost_Recon +40' },
    { priority: 3, ask: 'Ship a 120fps target for flagship devices; cap feels dated on high-end hardware.', category: 'specs', sentiment: 'mixed', mentions: 38, raisedBy: '12 players' },
    { priority: 4, ask: 'Fix the Dark Zone extraction crash that wipes loadouts on disconnect.', category: 'bugs', sentiment: 'negative', mentions: 33, raisedBy: 'Echo_7 +29' },
    { priority: 5, ask: 'Add cross-progression between mobile and PC builds.', category: 'features', sentiment: 'positive', mentions: 47, raisedBy: '21 players' },
  ],
  threads: {
    balance: [
      {
        id: 'THREAD-014', title: 'TTK feels inconsistent at range', sentiment: 'negative', mentions: 51, replies: 212,
        summary: 'Burst and DMR archetypes drop close-range targets instantly but chip at distance, making mid-range gunfights feel unreliable.',
        asks: [
          { ask: 'Normalise damage falloff curves across burst weapons.', category: 'balance', sentiment: 'negative', mentions: 51, raisedBy: 'Ghost_Recon +40' },
          { ask: 'Surface per-weapon falloff ranges in the stat sheet.', category: 'balance', sentiment: 'positive', mentions: 22, raisedBy: '9 players' },
        ],
        quotes: [
          { username: 'Ghost_Recon', time: 'Mar 14 · 2:08 PM', tone: 'negative', text: 'The same three-round burst that one-shots up close barely tickles at 30m. I can\'t read my own damage anymore.' },
          { username: 'Tango_Down', time: 'Mar 14 · 4:51 PM', tone: 'neutral', text: 'It\'s not all guns — ARs feel fine. It\'s specifically the burst rifles and marksman builds that fall off a cliff.' },
          { username: 'Maelstrom', time: 'Mar 15 · 9:02 AM', tone: 'positive', text: 'If they just showed the falloff numbers in the stat screen half these threads would disappear. Give us the data.' },
        ],
      },
      {
        id: 'THREAD-018', title: 'Skill cooldowns punish aggressive play', sentiment: 'mixed', mentions: 29, replies: 98,
        summary: 'Cooldowns on mobility and healing skills are seen as too long for the pace of Dark Zone engagements.',
        asks: [
          { ask: 'Reduce mobility-skill cooldowns by ~15% in PvP zones.', category: 'balance', sentiment: 'mixed', mentions: 29, raisedBy: '14 players' },
        ],
        quotes: [
          { username: 'Sable_9', time: 'Mar 12 · 7:20 PM', tone: 'negative', text: 'By the time my pulse is back up the fight is already over. Cooldowns are tuned for a slower game than the one we\'re playing.' },
          { username: 'DevWatch', time: 'Mar 13 · 11:14 AM', tone: 'neutral', text: 'Careful — shorter cooldowns means more skill spam. I\'d rather see cost reductions than blanket cuts.' },
        ],
      },
    ],
    features: [
      {
        id: 'THREAD-007', title: 'Stash management is unworkable at scale', sentiment: 'positive', mentions: 64, replies: 340,
        summary: 'The community broadly agrees the stash needs search, tagging and loadout locking. High engagement, constructive tone.',
        asks: [
          { ask: 'Add stash search and tag filters.', category: 'features', sentiment: 'positive', mentions: 64, raisedBy: '18 threads' },
          { ask: 'Let players lock items to prevent accidental dismantle.', category: 'features', sentiment: 'positive', mentions: 31, raisedBy: '11 players' },
        ],
        quotes: [
          { username: 'Quartermaster', time: 'Mar 10 · 1:33 PM', tone: 'positive', text: 'Give me a search bar and a "favourite" tag and I\'ll forgive almost everything else this season. It\'s the #1 quality-of-life ask.' },
          { username: 'Loot_Goblin', time: 'Mar 11 · 8:47 AM', tone: 'neutral', text: 'Honestly even just letting me lock items so I stop shredding my god-roll by mistake would be huge.' },
        ],
      },
    ],
    specs: [
      {
        id: 'THREAD-021', title: '120fps support on flagship devices', sentiment: 'mixed', mentions: 38, replies: 121,
        summary: 'High-end users want an unlocked frame-rate target; others worry about battery and thermals.',
        asks: [
          { ask: 'Add an optional 120fps performance mode.', category: 'specs', sentiment: 'mixed', mentions: 38, raisedBy: '12 players' },
        ],
        quotes: [
          { username: 'FrameChaser', time: 'Mar 9 · 6:02 PM', tone: 'positive', text: 'My phone can push 120 in every other shooter. Capping at 60 in 2026 feels like leaving performance on the table.' },
          { username: 'BatterySaver', time: 'Mar 9 · 9:15 PM', tone: 'negative', text: 'Please make it optional. I already get two hours before my phone is a hand-warmer.' },
        ],
      },
    ],
    bugs: [
      {
        id: 'THREAD-003', title: 'Dark Zone extraction crash wipes loadout', sentiment: 'negative', mentions: 33, replies: 156,
        summary: 'A reproducible crash on extraction-helicopter disconnect that occasionally resets equipped gear. High severity.',
        asks: [
          { ask: 'Fix the extraction-disconnect crash and add loadout recovery.', category: 'bugs', sentiment: 'negative', mentions: 33, raisedBy: 'Echo_7 +29' },
        ],
        quotes: [
          { username: 'Echo_7', time: 'Mar 8 · 3:41 PM', tone: 'negative', text: 'Lost a full extraction and my equipped mask to a disconnect. Repro: extract during a host migration. Happens ~1 in 5 for my squad.' },
          { username: 'PatchNotes', time: 'Mar 8 · 5:09 PM', tone: 'neutral', text: 'Confirmed on Android 14, mid-tier device. Logs attached in the original post. This one needs to jump the queue.' },
        ],
      },
    ],
  },
};
