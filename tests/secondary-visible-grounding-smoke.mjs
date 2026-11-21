import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const context = require('../study-context.js');
const availability = require('../secondary-grounding-availability-2026-2027.js');
const general = require('../general-education-book-sections-2026-2027.js');
const gel = require('../gel-schoolbook-source-map-2026-2027.js');
const overrides = require('../gel-schoolbook-manual-overrides-2026-2027.js');
const phase25 = require('../gel-schoolbook-manual-overrides-phase25-2026-2027.js');

assert.equal(
  context.isVerifiedOfficialTopic({
    status: 'official-book-section-grounded',
    sourceType: 'official-book-section',
    sourceUrl: 'https://ebooks.edu.gr/ebooks/v/html/example'
  }),
  true
);
assert.equal(
  context.isVerifiedOfficialTopic({
    status: 'exact-section-verified',
    sourceType: 'gap-alignment',
    sourceUrl: 'https://ebooks.edu.gr/example'
  }),
  true
);
assert.equal(
  context.isVerifiedOfficialTopic({
    status: 'official-book-section-verified',
    sourceType: 'official-section',
    sourceUrl: 'https://ebooks.edu.gr/book-homepage'
  }),
  false,
  'A book label/homepage must not make an unmapped section selectable.'
);

for (const subjectId of general.ids || []) {
  if (!/-gymnasiou$|-lykeiou$/i.test(subjectId)) continue;
  const row = general.get(subjectId);
  for (const label of row?.sections || []) {
    assert.equal(availability.has(subjectId, label), true, `${subjectId}: ${label}`);
  }
}

const manual = new Set(
  [...(overrides.entries || []), ...(phase25.entries || [])]
    .map((entry) => `${entry.subjectId}\n${entry.label}`)
);
for (const subject of Object.values(gel.all())) {
  for (const topic of subject.topicMappings || []) {
    const grounded =
      (topic.status === 'exact-html' && topic.confidence === 'high') ||
      topic.status === 'exact-pdf' ||
      manual.has(`${subject.subjectId}\n${topic.label}`);
    assert.equal(
      availability.has(subject.subjectId, topic.label),
      grounded,
      `${subject.subjectId}: ${topic.label}`
    );
  }
}

const html = fs.readFileSync(new URL('../study.html', import.meta.url), 'utf8');
assert.match(html, /secondary-grounding-availability-2026-2027\.js/);
assert.match(html, /rows=rows\.filter\(t=>isVerifiedOfficialTopic\(t,resolvedSubject\|\|s\)\)/);
assert.match(html, /rows\.filter\(s=>\(s\.topics\|\|\[\]\)\.some\(t=>isVerifiedOfficialTopic\(t,s\)\)\)/);
assert.match(html, /customTopicFields'\)\.classList\.toggle\('hidden',strictOfficial\)/);
assert.doesNotMatch(html, /if\(exactRows\.length\)rows=exactRows/);

// The committed manifest must be exactly what the builder produces from the
// current source tables; a stale manifest can expose units the 2026-27 guidance
// no longer includes (e.g. Physics G chapters 9-11 after the eight-unit scope).
const { output: rebuiltManifest } = await import('../scripts/build-secondary-grounding-availability.mjs');
assert.equal(
  fs.readFileSync(new URL('../secondary-grounding-availability-2026-2027.js', import.meta.url), 'utf8'),
  rebuiltManifest,
  'secondary-grounding-availability-2026-2027.js is stale: run node scripts/build-secondary-grounding-availability.mjs'
);
assert.deepEqual(
  availability.subjects['fysiki-g-gymnasiou'],
  [...general.get('fysiki-g-gymnasiou').sections].sort((a, b) => a.localeCompare(b, 'el')),
  'Physics G exposes exactly the eight 2026-27 taught units'
);

// Pinned totals: change them only together with a reviewed source-table change.
// 72 subjects / 1378 topics = de-duplicated union of overlapping sources: GEL exact-html/high (223), GEL exact-pdf (96),
// GEL manual overrides (332), GEL English PDF units (15), general secondary book
// sections (459), History A GEL (26) and Gymnasium page/PDF tables (246).
const subjectCount = Object.keys(availability.subjects).length;
const topicCount = Object.values(availability.subjects).reduce((sum, labels) => sum + labels.length, 0);
assert.equal(subjectCount, 72);
assert.equal(topicCount, 1378);

console.log(`Secondary visible-grounding policy passed: ${topicCount} verified options, zero pending options exposed.`);
