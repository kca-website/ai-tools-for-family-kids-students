import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const catalog = require('../general-education-book-sections-2026-2027.js');
const endpoint = require('../api/schoolbook-source.js');

const math = catalog.get('math-d-dimotikou');
const english = catalog.get('english-c-dimotikou');
assert.equal(math.sections.length, 9);
assert.equal(english.sections.length, 11);
const mathPages = Object.values(math.groundedSections).flat();
assert.equal(mathPages.length, 56);
assert.equal(new Set(mathPages).size, 56, 'Each official Math D chapter belongs to exactly one curriculum group');

const results = [];
for (const [subject, topics] of [
  ['math-d-dimotikou', math.sections],
  ['english-c-dimotikou', english.sections],
  ['science-st-dimotikou', ['Αναπνευστικό σύστημα', 'Κυκλοφορικό σύστημα']]
]) {
  const queue = [...topics];
  await Promise.all(Array.from({ length: Math.min(3, topics.length) }, async () => {
    while (queue.length) {
      const topic = queue.shift();
      const result = await endpoint.resolveOfficialSchoolbookSource(subject, topic);
      assert.equal(result.ok, true, subject + ' / ' + topic + ' => ' + JSON.stringify(result.body));
      assert.equal(result.body.grounded, true);
      assert.equal(result.body.annualScopeVerified, false, 'Book grounding must not imply an annual syllabus verification');
      const expected = catalog.get(subject).groundedSections[topic];
      const urls = Array.isArray(expected) ? expected : [expected];
      assert.deepEqual(result.body.sourceUrls, urls);
      assert.ok(result.body.text.length >= 500);
      assert.ok(urls.every(url => endpoint._test.sameOfficialHtmlManifestation(url, catalog.get(subject).sourceUrl)));
      if (subject === 'english-c-dimotikou') {
        const heading = topic.replace(/^Unit \d+ — /, '').toLowerCase().replace(/[’']/g, '');
        const text = result.body.text.toLowerCase().replace(/[’']/g, '');
        assert.ok(text.includes(heading), topic + ' must contain its actual official-book title');
      }
      results.push({ subject, topic, pages: urls.length, chars: result.body.text.length });
    }
  }));
}
for (const [subject, topic] of [
  ['math-d-dimotikou', 'Α΄ Περίοδος · Δ΄ Ενότητα'],
  ['english-c-dimotikou', 'Unit 1 — In the Fairytale Forest'],
  ['english-c-dimotikou', 'Unit 99 — Nonexistent']
]) {
  const result = await endpoint.resolveOfficialSchoolbookSource(subject, topic);
  assert.equal(result.ok, false, 'Unknown or wrong-book labels stay blocked: ' + topic);
}
assert.deepEqual(endpoint._test.resolveExplicitSectionUrls({
  base: math.sourceUrl,
  sectionSources: { example: [mathPages[0], english.sourceUrl + 'index_01.html'] }
}, 'example'), [], 'A multi-page unit cannot cross into another book');
console.log('PENDING_PRIMARY_GROUNDING=' + JSON.stringify(results));
