import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });

async function selectLabel(page, selector, label) {
  const labels = await page.locator(`${selector} option`).allInnerTexts();
  assert.ok(labels.includes(label), `${selector} does not contain ${label}; got ${labels.join(' | ')}`);
  await page.selectOption(selector, { label });
}

try {
  const map = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await map.goto(`${BASE}/xartis-ylis.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await map.waitForFunction(() => !!window.AITOOLSKIDS_OFFICIAL_ANNUAL_INSTRUCTIONS_2026_2027);

  await selectLabel(map, '#subject', 'Μαθηματικά');
  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Δημοσιευμένες / καταχωρισμένες');

  await map.getByRole('button', { name: 'Γυμνάσιο' }).click();
  await selectLabel(map, '#subject', 'Μαθηματικά');
  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Δημοσιευμένες / καταχωρισμένες');

  const resolverState = await map.evaluate(() => {
    const base = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    const annual = window.AITOOLSKIDS_OFFICIAL_ANNUAL_INSTRUCTIONS_2026_2027;
    const primary = annual.resolve(base.getByQuizId('math-a-dimotikou'));
    const middle = annual.resolve(base.getByQuizId('mathimatika-a-gymnasiou'));
    const highEntry = Object.values(base.byQuiz).find((e) => e.zone === 'high');
    const high = annual.resolve(highEntry);
    return { primary, middle, high, meta: annual.meta };
  });

  for (const record of [resolverState.primary, resolverState.middle]) {
    assert.equal(record.status, 'official-annual-guidance-published');
    assert.equal(record.directOfficialDocumentRecorded, true);
    assert.equal(record.exactTopicAlignment, false);
    assert.match(record.sourceUrl, /^https:\/\/www\.iep\.edu\.gr\//);
  }
  assert.equal(resolverState.high, null);
  assert.equal(resolverState.meta.schoolYear, '2026-2027');
  assert.match(resolverState.meta.policyEl, /δεν σημαίνει ότι κάθε topic anchor/i);

  await map.getByRole('button', { name: 'Λύκειο' }).click();
  await selectLabel(map, '#subject', 'Βιολογία');
  await map.selectOption('#course', 'biologia-a-lykeiou');
  await map.waitForTimeout(80);
  assert.match(await map.locator('#coverageBadge').innerText(), /αναλυτικός χάρτης/i, 'GEL A Biology curriculum map must show its documented-map status');
  assert.equal(await map.locator('#topicList .topic').count(), 14, 'GEL A Biology curriculum map must expose 14 documented mapped topics');
  assert.match(await map.locator('#topicList .topic').first().innerText(), /Αναλυτικός χάρτης οδηγίας/i, 'Mapped GEL topics must not be labelled as exact official sections');
  assert.ok(await map.locator('#sources a[href*="dide.ira.sch.gr"]').count() >= 1, 'GEL A Biology curriculum map must expose its 2026-27 guidance source');

  await map.getByRole('button', { name: 'EN' }).click();
  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Published / encoded');

  const storage = await map.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookie: document.cookie,
  }));
  assert.deepEqual(storage.local, []);
  assert.deepEqual(storage.session, []);
  assert.equal(storage.cookie, '');

  await map.close();
  console.log('Annual guidance source-awareness smoke passed for current curriculum-map architecture.');
} finally {
  await browser.close();
}
