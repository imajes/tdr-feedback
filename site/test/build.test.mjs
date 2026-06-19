import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  BUCKETS,
  buildSiteModel,
  parseAssessmentMarkdown,
  routeForThread,
} from '../scripts/build.mjs';

const healingAssessment = `# Healing Is Too Strong

**Thread ID:** 1511728186470437016
**Total Messages:** 487 (excluding OP)
**Date Range:** 2026-06-03 -> 2026-06-17
**Unique Participants:** 26

---

## Ask Type
Balance Change / Multiple

## Summary
Players are debating whether healing itself is too strong or whether the underlying issue is uncapped Damage Reduction.

## Primary Asks

- **Ask:** Cap Damage Reduction at a hard ceiling (commonly cited: 50%)
  - **First raised by:** @maxstriker (MaxStriker)
  - **Echoed by:** @caelancromwell (Caelan), @ventz_arctic (Ventz)
  - **Category:** Balance

- **Ask:** Nerf or rework the Blitz OS
  - **First raised by:** @ventz_arctic (Ventz)
  - **Echoed by:** @rezorex (Rezo)
  - **Category:** Balance

## Volume & Loudness
- **Total reactions:** 71

## Sentiment
**Overall:** Mixed

The thread is split along player archetype lines.

## Key Comments

> "put a hard cap on DR% and everybody become killable" - @maxstriker (MaxStriker), 2026-06-03

Simplest, most actionable formulation of the central ask.

## Thread Assessment

The actual problems identified are uncapped DR, Blitz OS, and post-revive immunity.
`;

describe('assessment parsing', () => {
  it('extracts route-ready thread metadata from synthesis markdown', () => {
    const thread = parseAssessmentMarkdown('healing-is-too-strong.md', healingAssessment);

    assert.equal(thread.slug, 'healing-is-too-strong');
    assert.equal(thread.sourceTitle, 'Healing Is Too Strong');
    assert.equal(thread.title, 'Healing Pressure');
    assert.equal(thread.threadId, '1511728186470437016');
    assert.equal(thread.messageCount, 487);
    assert.equal(thread.uniqueParticipants, 26);
    assert.equal(thread.reactionTotal, 71);
    assert.equal(thread.askType, 'Balance Change / Multiple');
    assert.equal(thread.sentiment, 'mixed');
    assert.equal(thread.summary.startsWith('Players are debating'), true);
    assert.equal(thread.primaryAsks.length, 2);
    assert.deepEqual(thread.primaryAsks[0], {
      ask: 'Cap Damage Reduction at a hard ceiling (commonly cited: 50%)',
      firstRaisedBy: '@maxstriker (MaxStriker)',
      echoedBy: '@caelancromwell (Caelan), @ventz_arctic (Ventz)',
      category: 'Balance',
    });
    assert.equal(thread.keyComments.length, 1);
    assert.equal(thread.assessment.includes('uncapped DR'), true);
  });
});

describe('site model', () => {
  it('maps every documented thread slug to a bucket route', () => {
    const model = buildSiteModel([
      parseAssessmentMarkdown('healing-is-too-strong.md', healingAssessment),
    ]);

    assert.equal(BUCKETS.length, 7);
    assert.equal(routeForThread('healing-is-too-strong'), '/balance/healing-pressure/');
    assert.equal(routeForThread('add-loadouts-to-the-game'), '/features-qol/loadouts/');
    assert.equal(model.buckets.find((bucket) => bucket.id === 'balance').threads.length, 1);
    assert.equal(model.stats.totalThreads, 1);
    assert.equal(model.stats.totalAssessments, 1);
    assert.equal(model.stats.totalParticipants, 26);
    assert.equal(model.topAsks[0].threadSlug, 'healing-is-too-strong');
  });
});
