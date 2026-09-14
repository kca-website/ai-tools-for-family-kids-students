import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const URL = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });

const homepageSource = readFileSync('index.html', 'utf8');
assert.match(homepageSource, /<html lang="el" class="navigator-home-booting">/, 'homepage boot class must exist before first paint');
assert.match(homepageSource, /navigatorHomeFirstPaintGuard/, 'homepage must ship an inline first-paint guard');
assert.match(homepageSource, /navigator-home\.css[^>]*data-navigator-home="1"/, 'navigator CSS must load from the original head');

async function assertNeedsToggle(page, label) {
  const toggle = page.locator('#homeV8NeedsToggle');
  const body = page.locator('#homeV8NeedsBody');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `${label}: task routes should start collapsed`);
  assert.equal(await body.isHidden(), true, `${label}: collapsed task routes body should be hidden`);
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true', `${label}: toggle should expand task routes`);
  assert.equal(await body.isVisible(), true, `${label}: task routes body should become visible`);
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false', `${label}: second toggle should collapse task routes`);
  assert.equal(await body.isHidden(), true, `${label}: task routes body should hide again`);
}

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#homeV8Shell', { timeout: 10000 });
  await page.waitForSelector('#specialSchoolZoneCard', { timeout: 10000 });
  await page.waitForSelector('#homeV8Needs', { timeout: 10000 });
  await page.waitForFunction(() => document.documentElement.classList.contains('navigator-home-ready'));

  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('navigator-home-booting')), false);
  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Μαθαίνω Έξυπνα με AI');
  assert.equal((await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(), 'Βρες το κατάλληλο AI εργαλείο για αυτό που θέλεις να κάνεις και δες πώς να το χρησιμοποιήσεις σωστά. Για γονείς, μαθητές 6 έως 18 και εκπαιδευτικούς.');

  assert.equal(await page.locator('#homeV8Shell #zoneGrid .zone-card').count(), 4);
  assert.equal(await page.locator('#homeV8Shell #specialSchoolZoneCard').count(), 1);
  assert.equal(await page.locator('#specialSchoolZoneCard').getAttribute('href'), '/special-education.html');
  assert.equal(await page.locator('#homeV8HelpersMount .home-v8-map').count(), 1);
  assert.equal(await page.locator('#homeV8HelpersMount .home-v8-ai').count(), 1);
  assert.ok(await page.locator('#homeV8EducatorHint a[href="/teacher-assistant.html"]').count(), 'Teacher assistant link missing');
  assert.equal(await page.locator('#homeV8Needs .home-v8-needs-card').count(), 6);
  assert.ok(await page.locator('#homeV8Needs a[href="/meleti-pdf-me-ai.html"]').count());
  assert.ok(await page.locator('#homeV8Needs a[href="/erevna-me-piges-ai.html"]').count());
  assert.ok(await page.locator('#heroGslBadge').count());

  await assertNeedsToggle(page, 'mobile');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Homepage positioning introduces horizontal overflow on mobile: ${overflow}px`);

  await page.click('#langEn');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await page.waitForFunction(() => document.querySelector('#specialSchoolZoneCard')?.textContent?.includes('Special schools'));
  assert.equal((await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(), 'Find the right AI tool for what you want to do and see how to use it properly. For parents, students 6 to 18, and educators.');
  assert.match(await page.locator('#specialSchoolZoneCard').innerText(), /Special schools/);
  assert.equal(await page.locator('#homeV8Needs .home-v8-needs-card').count(), 6);
  assert.ok(await page.locator('#homeV8Needs a[href="/en/study-pdf-with-ai.html"]').count());
  assert.ok(await page.locator('#homeV8Needs a[href="/en/research-with-sources-ai.html"]').count());

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktop.waitForSelector('#homeV8Shell', { timeout: 10000 });
  await desktop.waitForFunction(() => document.documentElement.classList.contains('navigator-home-ready'));
  const heroWidth = await desktop.locator('#zoneSelectView .hero').evaluate((el) => el.getBoundingClientRect().width);
  assert.ok(heroWidth >= 1000 && heroWidth <= 1042, `desktop: homepage hero should use the wider ~1040px layout, got ${heroWidth}px`);
  assert.equal(await desktop.locator('#homeV8Shell #zoneGrid .zone-card').count(), 4);
  assert.equal(await desktop.locator('#homeV8HelpersMount .home-v8-map').count(), 1);
  assert.equal(await desktop.locator('#homeV8HelpersMount .home-v8-ai').count(), 1);
  await desktop.close();

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Homepage v8 positioning smoke passed.');
} finally {
  await browser.close();
}
