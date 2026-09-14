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
  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Επίσημες οδηγίες 2026–27 δημοσιευμένες');
  assert.match(await map.locator('#scopeNote').innerText(), /όχι ότι κάθε topic anchor/i);
  const primaryAnnualHref = await map.locator('#sources a').filter({ hasText: 'ΙΕΠ · Οδηγίες Δημοτικού 2026–27' }).getAttribute('href');
  assert.equal(primaryAnnualHref, 'https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/');

  await selectLabel(map, '#subject', 'Αγγλικά');
  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Επίσημες οδηγίες 2026–27 δημοσιευμένες');
  assert.ok(await map.locator('#sources a').filter({ hasText: 'Ξένες Γλώσσες Δημοτικού' }).count(), 'Primary English annual source is missing');

  await map.getByRole('button', { name: 'Γυμνάσιο' }).click();
  await selectLabel(map, '#subject', 'Μαθηματικά');
  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Σχετική εγκύκλιος εντοπισμένη · επίσημη τεκμηρίωση εκκρεμεί');
  const studentAnnualNote = await map.locator('#scopeNote').innerText();
  assert.doesNotMatch(studentAnnualNote, /111798\/Δ2\/28-08-2026|63\/30-07-2026/, 'Student/Parent view should not show protocol or IEP act numbers');
  assert.equal(await map.locator('#sources a').filter({ hasText: 'Πηγή εντοπισμού εγκυκλίου' }).count(), 0, 'Student/Parent view should not expose the non-official discovery source');

  await map.getByRole('button', { name: 'Εκπαιδευτικός' }).click();
  const teacherAnnualNote = await map.locator('#scopeNote').innerText();
  assert.match(teacherAnnualNote, /111798\/Δ2\/28-08-2026/);
  assert.match(teacherAnnualNote, /63\/30-07-2026/);
  const teacherDiscovery = map.locator('#sources a').filter({ hasText: 'Πηγή εντοπισμού εγκυκλίου (μη επίσημη)' });
  assert.equal(await teacherDiscovery.count(), 1, 'Educator view should expose the discovery source');
  assert.equal(await teacherDiscovery.getAttribute('href'), 'https://edu.klimaka.gr/mathimata/gymnasiou/3032-odhgies-mathimatika-a-gymnasiou');

  // classroom.html no longer loads official-annual-instructions-2026-2027.js or renders an
  // annual-guidance banner (#annualWarning / .annual-source / .discovery-source) — the
  // "quick activity" redesign delegates all curriculum material, including annual guidance,
  // to xartis-ylis.html and teacher-assistant.html. The resolver-correctness and no-storage
  // checks below stay on xartis-ylis.html, the only page that still owns this data.
  const resolverState = await map.evaluate(() => {
    const base = window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    const annual = window.AITOOLSKIDS_OFFICIAL_ANNUAL_INSTRUCTIONS_2026_2027;
    const primary = annual.resolve(base.getByQuizId('math-a-dimotikou'));
    const middleMath = annual.resolve(base.getByQuizId('mathimatika-a-gymnasiou'));
    const high = annual.resolve(Object.values(base.byQuiz).find((e) => e.zone === 'high'));
    return { primary, middleMath, high };
  });
  assert.equal(resolverState.primary.status, 'official-annual-guidance-published');
  assert.equal(resolverState.primary.exactTopicAlignment, false);
  assert.equal(resolverState.middleMath.status, 'annual-circular-reference-found-direct-official-url-pending');
  assert.equal(resolverState.middleMath.directOfficialDocumentRecorded, false);
  assert.equal(resolverState.high, null);

  const storage = await map.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookie: document.cookie,
  }));
  assert.deepEqual(storage.local, []);
  assert.deepEqual(storage.session, []);
  assert.equal(storage.cookie, '');

  await map.close();
  console.log('Annual guidance source-awareness smoke passed.');
} finally {
  await browser.close();
}
