import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const URL = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const foldLabel = (text, locale) => text.trim().normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale);

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  const sourceResponse = await page.request.get(URL);
  const sourceHtml = await sourceResponse.text();
  assert.match(sourceHtml, /<title>Μαθαίνω Έξυπνα με AI \| AI Εργαλεία για Μαθητές: Δημοτικό, Γυμνάσιο, Λύκειο<\/title>/);

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#zoneGrid .zone-card', { timeout: 10000 });

  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Μαθαίνω Έξυπνα με AI');
  assert.equal(
    (await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(),
    'Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18 αλλά και εκπαιδευτικούς.'
  );

  assert.match(await page.locator('[data-i18n="chooseZoneSubheading"]').innerText(), /κατάλληλα εργαλεία/);
  assert.equal(await page.locator('.hero__learning-loop').count(), 0, 'Homepage must not present itself as a standalone learning platform');

  const order = await page.evaluate(() => {
    const zones = document.getElementById('zoneGrid');
    const guided = document.querySelector('.home-guided-start');
    if (!zones || !guided) return null;
    return zones.compareDocumentPosition(guided) & Node.DOCUMENT_POSITION_FOLLOWING ? 'zones-first' : 'guided-first';
  });
  assert.equal(order, 'zones-first', 'Tool/age-zone discovery must come before guided Practice Map/AI Help');

  assert.match(await page.locator('#guidedStartHeading').innerText(), /Δεν ξέρεις από πού να ξεκινήσεις/);
  assert.match(await page.locator('.hero__quiz-cta-title').innerText(), /Χάρτης Εξάσκησης σε 2 λεπτά/);
  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'el-GR'), foldLabel('Κόλλησα εδώ', 'el-GR'));
  assert.match(await page.locator('#heroAiHelpTitle').innerText(), /Δείξε μου πώς να το μάθω/);
  assert.match(await page.locator('.hero__ai-help-copy > p').first().innerText(), /δική σου προσπάθεια/);

  assert.equal(await page.locator('#zoneGrid .zone-card').count(), 3, 'The three school-age zones must remain visible');
  assert.ok(await page.locator('#heroGslBadge').count(), 'GSL accessibility badge must remain on the homepage');
  assert.ok(await page.locator('#heroHelpSpecialEducation').count(), 'Special Education entry must remain on the homepage');
  assert.ok(await page.locator('#curriculumMapFeature').count(), 'Curriculum Map discovery entry must remain on the homepage');

  const badgeText = (await page.locator('.hero__badges').innerText()).replace(/\s+/g, ' ');
  for (const badge of ['Δωρεάν', 'Ανεξάρτητο', 'Δίγλωσσο']) {
    assert.match(badgeText, new RegExp(badge), `Homepage identity badge missing: ${badge}`);
  }

  const visibleHomepage = await page.locator('#zoneSelectView').innerText();
  assert.ok(!visibleHomepage.includes('—'), 'AI-style em dash must not return to visible homepage copy');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Homepage positioning introduces horizontal overflow on mobile: ${overflow}px`);

  await page.click('#langEn');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  assert.equal(
    (await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(),
    'See in 2 minutes where the student or the parent could use a bit more practice, and which free AI tool fits exactly there. For parents, students 6 to 18, and educators.'
  );
  assert.match(await page.locator('[data-i18n="chooseZoneSubheading"]').innerText(), /suitable tools/);
  assert.match(await page.locator('#guidedStartHeading').innerText(), /Not sure where to start/);
  assert.match(await page.locator('.hero__quiz-cta-title').innerText(), /Practice Map in 2 minutes/);
  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'en-US'), foldLabel('I’m stuck here', 'en-US'));
  assert.match(await page.locator('#heroAiHelpTitle').innerText(), /Show me how to learn it/);

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Homepage tools-first identity, original hero copy and mobile smoke passed.');
} finally {
  await browser.close();
}
