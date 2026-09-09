import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const URL = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const foldLabel = (text, locale) => text.trim().normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale);

const homepageSource = readFileSync('index.html', 'utf8');
assert.match(homepageSource, /<html lang="el" class="navigator-home-booting">/, 'homepage boot class must exist before first paint');
assert.match(homepageSource, /navigatorHomeFirstPaintGuard/, 'homepage must ship an inline first-paint guard');
assert.match(homepageSource, /navigator-home\.css[^>]*data-navigator-home="1"/, 'navigator CSS must load from the original head');

async function assertNeedsCollapse(page, label) {
  const toggle = page.locator('#navigatorNeedsToggle');
  const body = page.locator('#navigatorNeedsBody');

  assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `${label}: task routes should start collapsed`);
  assert.equal(await body.isHidden(), true, `${label}: collapsed task routes body should be hidden`);

  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true', `${label}: toggle should expand task routes`);
  assert.equal(await body.isVisible(), true, `${label}: task routes body should become visible`);

  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `${label}: second toggle should collapse task routes`);
  assert.equal(await body.isHidden(), true, `${label}: task routes body should hide again`);

  await page.click('#navigatorPrimaryCta');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true', `${label}: primary CTA should expand task routes`);
  assert.equal(await body.isVisible(), true, `${label}: primary CTA should reveal task routes`);
}

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#navigatorPrimaryCta', { timeout: 10000 });
  await page.waitForSelector('#specialSchoolZoneCard', { timeout: 10000 });
  await page.waitForSelector('#navigatorNeeds', { timeout: 10000 });
  await page.waitForFunction(() => document.documentElement.classList.contains('navigator-home-ready'));

  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('navigator-home-booting')), false);
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

  await assertNeedsCollapse(page, 'mobile');

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

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktop.waitForSelector('#navigatorNeeds', { timeout: 10000 });
  await desktop.waitForFunction(() => document.documentElement.classList.contains('navigator-home-ready'));
  const desktopToggle = desktop.locator('#navigatorNeedsToggle');
  const desktopBody = desktop.locator('#navigatorNeedsBody');
  assert.equal(await desktopToggle.getAttribute('aria-expanded'), 'true', 'desktop: task routes should start open');
  assert.equal(await desktopBody.isVisible(), true, 'desktop: task routes body should be visible');
  await desktop.close();

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Navigator-first homepage positioning smoke passed.');
} finally {
  await browser.close();
}
