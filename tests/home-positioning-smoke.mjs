import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const URL = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const foldLabel = (text, locale) => text.trim().normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale);

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#navigatorPrimaryCta', { timeout: 10000 });
  await page.waitForSelector('#specialSchoolZoneCard', { timeout: 10000 });
  await page.waitForSelector('#navigatorNeeds', { timeout: 10000 });

  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Μαθαίνω Έξυπνα με AI');
  assert.equal((await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(), 'Βρες το κατάλληλο AI εργαλείο για αυτό που θέλεις να κάνεις και δες πώς να το χρησιμοποιήσεις σωστά. Για γονείς, μαθητές 6 έως 18 και εκπαιδευτικούς.');
  assert.equal((await page.locator('#navigatorPrimaryCta strong').innerText()).trim(), 'Βρες το σωστό AI εργαλείο');
  assert.equal(await page.locator('#navigatorPrimaryCta').getAttribute('href'), '#navigatorNeeds');
  assert.equal(await page.locator('.hero #navigatorPrimaryCta').count(), 1);

  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Χάρτης Εξάσκησης · ξεκίνα εδώ');
  assert.equal(await page.locator('.hero .hero__quiz-cta-wrap').count(), 1);
  assert.equal(await page.locator('.hero .hero__ai-help').count(), 0, 'AI Help must not dominate the hero');
  assert.equal(await page.locator('.hero .hero__learning-loop').count(), 0, 'Learning loop must not dominate the hero');
  assert.equal(await page.locator('.navigator-secondary-ai').count(), 1);
  assert.equal(await page.locator('.navigator-secondary-loop').count(), 1);
  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'el-GR'), foldLabel('Κόλλησα εδώ', 'el-GR'));

  assert.equal(await page.locator('#zoneGrid .zone-card').count(), 4);
  assert.equal(await page.locator('#zoneGrid #specialSchoolZoneCard').count(), 1);
  assert.equal(await page.locator('#specialSchoolZoneCard').getAttribute('href'), '/special-education.html');
  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6);
  assert.ok(await page.locator('#navigatorNeeds a[href="/meleti-pdf-me-ai.html"]').count());
  assert.ok(await page.locator('#navigatorNeeds a[href="/erevna-me-piges-ai.html"]').count());
  assert.ok(await page.locator('#heroGslBadge').count());
  assert.ok(await page.locator('#heroHelpSpecialEducation').count());
  assert.ok(await page.locator('#curriculumMapFeature').count());

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Homepage positioning introduces horizontal overflow on mobile: ${overflow}px`);

  await page.click('#langEn');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await page.waitForFunction(() => document.querySelector('#navigatorPrimaryCta strong')?.textContent?.includes('Find the right AI tool'));
  assert.equal((await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(), 'Find the right AI tool for what you want to do and see how to use it properly. For parents, students 6 to 18, and educators.');
  assert.equal((await page.locator('#navigatorPrimaryCta strong').innerText()).trim(), 'Find the right AI tool');
  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Practice Map · start here');
  assert.match(await page.locator('#specialSchoolZoneCard').innerText(), /Special schools/);
  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6);
  assert.ok(await page.locator('#navigatorNeeds a[href="/en/study-pdf-with-ai.html"]').count());
  assert.ok(await page.locator('#navigatorNeeds a[href="/en/what-do-you-want-to-do-with-ai.html"]').count());

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Navigator-first homepage positioning smoke passed.');
} finally {
  await browser.close();
}
