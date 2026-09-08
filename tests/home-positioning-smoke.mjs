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
  await page.waitForSelector('#specialSchoolZoneCard', { timeout: 10000 });
  await page.waitForSelector('#navigatorNeeds', { timeout: 10000 });

  // The agreed top hero is a source-of-truth contract. Homepage extensions must not rewrite it.
  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Μαθαίνω Έξυπνα με AI');
  assert.equal(
    (await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(),
    'Δες σε 2 λεπτά πού χρειάζεται λίγη παραπάνω εξάσκηση ο μαθητής ή ο γονιός και ποιο δωρεάν AI εργαλείο ταιριάζει ακριβώς εκεί. Για γονείς, μαθητές 6 έως 18 αλλά και εκπαιδευτικούς.'
  );

  const flow = (await page.locator('.hero__learning-loop').innerText()).replace(/\s+/g, ' ').trim();
  for (const step of ['Δυσκολία', 'Εντοπισμός', 'Εξάσκηση', 'Καθοδήγηση', 'Ξαναδοκιμή']) {
    assert.match(flow, new RegExp(step), `Missing agreed learning-loop step: ${step}`);
  }

  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Χάρτης Εξάσκησης · ξεκίνα εδώ');
  assert.equal(
    (await page.locator('.hero__quiz-cta-sub').innerText()).replace(/\s+/g, ' ').trim(),
    'Λίγες σύντομες ερωτήσεις για να δεις ποια σημεία αξίζει να δουλέψεις περισσότερο και να πας στο επόμενο Μονοπάτι Μάθησης. Χωρίς βαθμό και χωρίς διάγνωση.'
  );

  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'el-GR'), foldLabel('Κόλλησα εδώ', 'el-GR'));
  assert.match(await page.locator('#heroAiHelpTitle').innerText(), /Δείξε μου πώς να το μάθω/);

  // Primary/Middle/High plus one integrated Special-schools route in the SAME grid.
  assert.equal(await page.locator('#zoneGrid .zone-card').count(), 4, 'School routes must include the three age zones plus Special schools');
  assert.equal(await page.locator('#zoneGrid #specialSchoolZoneCard').count(), 1, 'Special schools must be inside the school-zone grid');
  assert.equal(await page.locator('#specialSchoolZoneCard').getAttribute('href'), '/special-education.html');
  const specialText=(await page.locator('#specialSchoolZoneCard').innerText()).replace(/\s+/g,' ').trim();
  assert.match(specialText,/Ειδικά σχολεία/);
  assert.match(specialText,/Ειδικό Γυμνάσιο/);
  assert.match(specialText,/Ειδικό Λύκειο/);
  assert.match(specialText,/ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./);

  // The old standalone Special Education banner must not remain below the school routes.
  assert.equal(await page.locator('#specialEducationHomeFeature:visible').count(), 0, 'Special Education must not appear as a separate bottom banner');

  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6, 'Six task-first routes must remain available');
  assert.ok(await page.locator('#navigatorNeeds a[href="/meleti-pdf-me-ai.html"]').count(), 'PDF study route must remain exposed');
  assert.ok(await page.locator('#navigatorNeeds a[href="/erevna-me-piges-ai.html"]').count(), 'Source-based research route must remain exposed');

  assert.ok(await page.locator('#heroGslBadge').count(), 'GSL accessibility badge must remain on the homepage');
  assert.ok(await page.locator('#heroHelpSpecialEducation').count(), 'Special Education AI Help entry must remain available');
  assert.ok(await page.locator('#curriculumMapFeature').count(), 'Curriculum Map discovery entry must remain on the homepage');

  const badgeText = (await page.locator('.hero__badges').innerText()).replace(/\s+/g, ' ');
  for (const badge of ['Δωρεάν', 'Ανεξάρτητο', 'Δίγλωσσο']) {
    assert.match(badgeText, new RegExp(badge), `Homepage identity badge missing: ${badge}`);
  }

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Homepage positioning introduces horizontal overflow on mobile: ${overflow}px`);

  await page.click('#langEn');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await page.waitForFunction(() => document.querySelector('#specialSchoolZoneCard .zone-card__label')?.textContent?.includes('Special schools'));

  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Learn Smarter with AI');
  assert.equal(
    (await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(),
    'See in 2 minutes where the student or the parent could use a bit more practice, and which free AI tool fits exactly there. For parents, students 6 to 18, and educators.'
  );
  assert.match(await page.locator('.hero__learning-loop').innerText(), /Difficulty/);
  assert.match(await page.locator('.hero__learning-loop').innerText(), /Try again/);
  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Practice Map · start here');
  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'en-US'), foldLabel('I’m stuck here', 'en-US'));
  assert.match(await page.locator('#heroAiHelpTitle').innerText(), /Show me how to learn it/);
  assert.match(await page.locator('#specialSchoolZoneCard').innerText(), /Special schools/);
  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6);
  assert.ok(await page.locator('#navigatorNeeds a[href="/en/study-pdf-with-ai.html"]').count(), 'English PDF route must stay in English');
  assert.ok(await page.locator('#navigatorNeeds a[href="/en/what-do-you-want-to-do-with-ai.html"]').count(), 'English all-routes link must stay in English');

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Agreed hero copy, integrated Special-school route, task routes and mobile homepage smoke passed.');
} finally {
  await browser.close();
}
