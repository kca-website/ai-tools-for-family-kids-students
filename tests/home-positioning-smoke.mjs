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
  await page.waitForSelector('.navigator-primary-action__button', { timeout: 10000 });

  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Βρες το σωστό AI εργαλείο για αυτό που θέλεις να κάνεις');
  assert.equal(
    (await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(),
    'Διάλεξε ηλικία ή ανάγκη. Θα σου δείξουμε ποια εργαλεία ταιριάζουν, πώς να τα χρησιμοποιήσεις σωστά και τι να προσέξεις — χωρίς να κάνουμε εμείς την εργασία.'
  );

  const flow = (await page.locator('.hero__learning-loop').innerText()).replace(/\s+/g, ' ').trim();
  for (const step of ['Τι θέλεις να κάνεις', 'Βρες τι ταιριάζει', 'Δες πώς χρησιμοποιείται', 'Προχώρα μόνος σου']) {
    assert.match(flow, new RegExp(step), `Missing navigator step: ${step}`);
  }

  assert.equal((await page.locator('.navigator-primary-action__button').innerText()).replace(/\s+/g, ' ').trim(), '🧰 Βρες το κατάλληλο AI εργαλείο');
  assert.equal(await page.locator('.navigator-primary-action__button').getAttribute('href'), '#chooseToolByZone');

  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Δεν ξέρεις τι χρειάζεσαι; Κάνε το Γρήγορο Τεστ');
  assert.equal(
    (await page.locator('.hero__quiz-cta-sub').innerText()).replace(/\s+/g, ' ').trim(),
    'Λίγες σύντομες ερωτήσεις για να εντοπίσεις πού χρειάζεται περισσότερη εξάσκηση. Χωρίς βαθμό και χωρίς διάγνωση.'
  );

  const homeOrder = await page.evaluate(() => {
    const primary = document.querySelector('.navigator-primary-action-wrap');
    const quiz = document.querySelector('.hero__quiz-cta-wrap');
    const zones = document.getElementById('zoneGrid');
    if (!primary || !quiz || !zones) return null;
    const primaryBeforeQuiz = !!(primary.compareDocumentPosition(quiz) & Node.DOCUMENT_POSITION_FOLLOWING);
    const quizBeforeZones = !!(quiz.compareDocumentPosition(zones) & Node.DOCUMENT_POSITION_FOLLOWING);
    return primaryBeforeQuiz && quizBeforeZones ? 'navigator-first' : 'wrong-order';
  });
  assert.equal(homeOrder, 'navigator-first', 'Primary tool discovery must appear before the Quick Check and age-zone cards');

  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'el-GR'), foldLabel('Δωρεάν AI Βοήθεια · προαιρετική', 'el-GR'));
  assert.match(await page.locator('#heroAiHelpTitle').innerText(), /Κόλλησες σε μια άσκηση/);
  assert.match(await page.locator('.hero__ai-help-copy > p').first().innerText(), /δική σου προσπάθεια/);

  assert.equal(await page.locator('#zoneGrid .zone-card').count(), 3, 'The three school-age zones must remain visible');
  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6, 'Six task-first routes must be visible');
  assert.ok(await page.locator('#navigatorNeeds a[href="/meleti-pdf-me-ai.html"]').count(), 'PDF study route must be exposed');
  assert.ok(await page.locator('#navigatorNeeds a[href="/erevna-me-piges-ai.html"]').count(), 'Source-based research route must be exposed');
  assert.ok(await page.locator('#navigatorNeeds a[href="/flashcards-epanalipsi-ai.html"]').count(), 'Flashcards route must be exposed');
  assert.ok(await page.locator('#navigatorNeeds a[href="/parousiasi-afisa-ai.html"]').count(), 'Presentation route must be exposed');
  assert.ok(await page.locator('#navigatorNeeds a[href="/anagnosi-agglika-ai.html"]').count(), 'Reading route must be exposed');
  assert.ok(await page.locator('#navigatorNeeds a[href="/dimiourgiko-ai-gia-mathites.html"]').count(), 'Creative route must be exposed');

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
  await page.waitForFunction(() => document.querySelector('.hero__title')?.textContent?.includes('Find the right AI tool'));

  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Find the right AI tool for what you need to do');
  assert.equal(
    (await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(),
    'Choose an age group or a task. We show which tools fit, how to use them well and what to watch out for — without doing the schoolwork for you.'
  );
  assert.match(await page.locator('.hero__learning-loop').innerText(), /What do you need\?/);
  assert.match(await page.locator('.hero__learning-loop').innerText(), /Continue on your own/);
  assert.match(await page.locator('.navigator-primary-action__button').innerText(), /Find the right AI tool/);
  assert.equal((await page.locator('.hero__quiz-cta-title').innerText()).trim(), 'Not sure what you need? Take the Quick Check');
  assert.equal(foldLabel(await page.locator('.hero__ai-help-badge').innerText(), 'en-US'), foldLabel('Free AI Help · optional', 'en-US'));
  assert.match(await page.locator('#heroAiHelpTitle').innerText(), /Stuck on an exercise/);
  assert.equal(await page.locator('#navigatorNeeds .navigator-needs-card').count(), 6);

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Navigator-first homepage hierarchy, optional AI Help, task routes and mobile smoke passed.');
} finally {
  await browser.close();
}
