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
  await page.waitForSelector('#zoneGrid .zone-card', { timeout: 10000 });

  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Μαθαίνω Έξυπνα με AI');
  assert.match(await page.locator('.hero__subtitle').innerText(), /επόμενο σωστό βήμα/);

  const flow = (await page.locator('.hero__learning-loop').innerText()).replace(/\s+/g, ' ').trim();
  for (const step of ['Δυσκολία', 'Εντοπισμός', 'Εξάσκηση', 'Καθοδήγηση', 'Ξαναδοκιμή']) {
    assert.match(flow, new RegExp(step), `Missing learning-loop step: ${step}`);
  }

  assert.match(await page.locator('.hero__quiz-cta-title').innerText(), /Χάρτης Εξάσκησης/);
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

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Homepage positioning introduces horizontal overflow on mobile: ${overflow}px`);

  await page.click('#langEn');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  assert.match(await page.locator('.hero__subtitle').innerText(), /next right step/);
  assert.match(await page.locator('.hero__learning-loop').innerText(), /Difficulty/);
  assert.match(await page.locator('.hero__learning-loop').innerText(), /Try again/);
  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'en-US'), foldLabel('I’m stuck here', 'en-US'));
  assert.match(await page.locator('#heroAiHelpTitle').innerText(), /Show me how to learn it/);

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Homepage learning-map positioning, identity-preservation and mobile smoke passed.');
} finally {
  await browser.close();
}
