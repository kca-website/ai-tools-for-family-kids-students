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
  assert.match(await map.locator('#scopeNote').innerText(), /δεν.*κάθε topic anchor/i);
  const primaryAnnualHref = await map.locator('#sources a').filter({ hasText: 'ΙΕΠ · Οδηγίες Δημοτικού 2026–27' }).getAttribute('href');
  assert.equal(primaryAnnualHref, 'https://www.iep.edu.gr/yli-kai-odigies-didaskalias-mathimaton-protovathmias-gia-to-scholiko-etos-2026-2027/');

  await selectLabel(map, '#subject', 'Αγγλικά');
  assert.equal((await map.locator('#annualStatus').innerText()).trim(), 'Επίσημες οδηγίες 2026–27 δημοσιευμένες');
  assert.ok(await map.locator('#sources a').filter({ hasText: 'Ξένες Γλώσσες Δημοτικού' }).count(), 'Primary English annual source is missing');

  const classroom = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await classroom.goto(`${BASE}/classroom.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await classroom.waitForSelector('#workspace.visible', { timeout: 10000 });
  await selectLabel(classroom, '#subject', 'Μαθηματικά');
  const primaryInfo = classroom.locator('#annualWarning');
  assert.equal(await primaryInfo.getAttribute('hidden'), null, 'Primary annual guidance should be visible');
  assert.ok((await primaryInfo.getAttribute('class') || '').includes('verified'), 'Primary annual guidance should use verified styling');
  assert.match(await primaryInfo.innerText(), /Ετήσιες οδηγίες 2026–27 δημοσιευμένες/);
  assert.ok(await classroom.locator('.annual-source').count(), 'Classroom annual source link is missing');

  await classroom.getByRole('button', { name: 'Γυμνάσιο' }).click();
  await selectLabel(classroom, '#subject', 'Μαθηματικά');
  const middleInfo = classroom.locator('#annualWarning');
  assert.equal(await middleInfo.getAttribute('hidden'), null, 'Middle Mathematics annual reference should be visible');
  assert.ok(!(await middleInfo.getAttribute('class') || '').includes('verified'), 'Pending Middle reference must not use verified styling');
  const middleText = await middleInfo.innerText();
  assert.match(middleText, /111798\/Δ2\/28-08-2026/);
  assert.match(middleText, /άμεσο URL του επίσημου συνημμένου/i);
  assert.doesNotMatch(middleText, /ακριβής.*αντιστοίχιση|exact annual alignment verified/i);

  const resolverState = await classroom.evaluate(() => {
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

  const storage = await classroom.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookie: document.cookie,
  }));
  assert.deepEqual(storage.local, []);
  assert.deepEqual(storage.session, []);
  assert.equal(storage.cookie, '');

  await map.close();
  await classroom.close();
  console.log('Annual guidance source-awareness smoke passed.');
} finally {
  await browser.close();
}
