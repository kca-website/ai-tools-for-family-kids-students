// Captures the exact /api/tutor-assistant request bodies that AI Study (study.html) sends,
// so the benchmark replays production prompts instead of a hand-written copy.
// No AI provider is called: both APIs are stubbed in the browser.
//
// Usage (needs a local static server on :4173 and Playwright):
//   python3 -m http.server 4173 --bind 127.0.0.1 &
//   node benchmark/capture.mjs            -> writes benchmark/fixtures.json
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BENCH_BASE_URL || 'http://127.0.0.1:4173';
const OUT = new URL('./fixtures.json', import.meta.url);
const ACTIONS = ['flashcards', 'plan', 'explain', 'quiz'];
const TOPICS_PER_SUBJECT = Number(process.env.BENCH_TOPICS_PER_SUBJECT || 5);

const SUBJECTS = [
  { key: 'iliada', zone: 'middle', grade: 'b', subjectId: 'iliada-b-gymnasiou' },
  { key: 'biologia', zone: 'middle', grade: 'b', subjectId: 'biologia-b-gymnasiou' },
  { key: 'mathimatika', zone: 'middle', grade: 'b', subjectId: 'mathimatika-b-gymnasiou' },
  { key: 'glossa', zone: 'middle', grade: 'a', subjectId: 'glossa-a-gymnasiou' },
];

// Placeholder text only: the server ignores client text for official sources
// and re-resolves the real ebooks.edu.gr section from subjectId + topic.
const STUB_SOURCE = {
  grounded: true,
  text: 'Απόσπασμα επίσημου σχολικού βιβλίου (placeholder για την καταγραφή του αιτήματος).',
  bookTitle: 'Επίσημο σχολικό βιβλίο',
  sourceUrl: 'https://ebooks.edu.gr/',
};

async function openStudy(browser) {
  const page = await browser.newPage();
  await page.route(/^https:\/\/(fonts|cdn)\./, r => r.fulfill({ status: 200, body: '' }));
  await page.route('**/api/schoolbook-source**', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(STUB_SOURCE) }));
  await page.goto(BASE + '/study.html', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  return page;
}

async function select(page, subject, topicValue) {
  await page.selectOption('#zone', subject.zone);
  await page.selectOption('#grade', subject.grade);
  await page.selectOption('#subject', subject.subjectId);
  if (topicValue !== undefined) await page.selectOption('#topicPick', topicValue);
}

const browser = await chromium.launch();
const fixtures = [];
for (const subject of SUBJECTS) {
  const probe = await openStudy(browser);
  await select(probe, subject);
  const topics = await probe.evaluate(() => [...document.getElementById('topicPick').options]
    .map(o => ({ value: o.value, label: (o.dataset.label || o.textContent || '').trim() }))
    .filter(o => o.value && !/^Κεφάλαιο\s+\d+\s+—/i.test(o.label)));
  await probe.close();
  if (!topics.length) throw new Error('No topics for ' + subject.subjectId);

  for (const topic of topics.slice(0, TOPICS_PER_SUBJECT)) {
    for (const action of ACTIONS) {
      const page = await openStudy(browser);
      let payload = null;
      await page.route('**/api/tutor-assistant', async r => {
        if (!payload && r.request().method() === 'POST') payload = JSON.parse(r.request().postData() || '{}');
        await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: '{"cards":[]}' }) });
      });
      await select(page, subject, topic.value);
      await page.click(`.study-action[data-action="${action}"]`);
      for (let i = 0; i < 40 && !payload; i++) await page.waitForTimeout(100);
      await page.close();
      if (!payload) throw new Error(`No request captured for ${subject.subjectId} / ${topic.value} / ${action}`);
      fixtures.push({
        caseId: `${subject.key}:${topic.value.split('.').pop()}:${action}`,
        subject: subject.key,
        subjectId: subject.subjectId,
        topicValue: topic.value,
        topicLabel: topic.label,
        action,
        payload,
      });
      process.stdout.write('.');
    }
  }
}
await browser.close();
fs.writeFileSync(OUT, JSON.stringify({ capturedAt: new Date().toISOString(), fixtures }, null, 2) + '\n');
console.log(`\n${fixtures.length} fixtures -> ${OUT.pathname}`);
