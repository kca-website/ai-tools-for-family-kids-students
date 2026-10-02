import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const backend = require('../api/schoolbook-source.js')._test;
const context = vm.createContext({ window: {}, console });
for (const file of ['quiz-data.js', 'learning-paths-data.js', 'curriculum-2026-2027-expansion.js', 'official-curriculum-data.js', 'general-education-book-sections-2026-2027.js', 'curriculum-resolver.js']) {
  vm.runInContext(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), context);
}
for (const [id, count] of [['physics-gymnasiou', 26], ['chimeia-b-gymnasiou', 19], ['biologia-b-gymnasiou', 13]]) {
  const topics = context.window.AITOOLSKIDS_CURRICULUM_RESOLVER.getTopics('middle', 'b', id);
  assert.equal(topics.length, count, id + ': only exact annual sections should be selectable');
  for (const topic of topics) {
    assert.equal(topic.status, 'official-book-section-grounded', topic.labelEl);
    assert.equal(topic.topicGroup, '', 'Exact sections must be the main choices');
    const urls = backend.resolveDirectSourceUrls(id, topic.labelEl);
    assert.ok(urls.includes(topic.sourceUrl), id + ': UI source must match endpoint source for ' + topic.labelEl);
  }
  console.log(id + ': all ' + count + ' selectable sections resolve to the endpoint sources');
}
