import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  const failed = [];

  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/Failed to load resource/i.test(text)) return;
    errors.push(`console: ${text}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && new URL(response.url()).origin === BASE) {
      failed.push(`${response.status()} ${response.url()}`);
    }
  });

  let lastAiPayload = null;
  let aiRequestCount = 0;
  await page.route('**/api/teacher-assistant', async (route) => {
    const request = route.request();
    aiRequestCount += 1;
    lastAiPayload = JSON.parse(request.postData() || '{}');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ text: '## Πλάνο μελέτης\n\n**Στόχος:** Κατανόηση\n\n- Βήμα 1\n- Βήμα 2\n\n| Στάδιο | Ενέργεια |\n|---|---|\n| 1 | Μελέτη |', model: 'gpt-oss-120b' }),
    });
  });

  await page.goto(`${BASE}/higher-education-pilot.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(100);
  assert.equal(aiRequestCount, requestsBeforeNeuro + 1, 'verified Neurobiology quiz did not call AI');
  assert.match(lastAiPayload.system, /SOURCE LOCK/);
  assert.match(lastAiPayload.system, /Κάθε ερώτηση quiz πρέπει να αντιστοιχεί άμεσα/);
  assert.match(lastAiPayload.prompt, /ΒΙΟ_ΝΕΥ · Νευροβιολογία/);
  assert.match(lastAiPayload.prompt, /Συναπτική διαβίβαση/);
  assert.match(lastAiPayload.prompt, /Νευροαπεικονιστικές τεχνικές PET, MRI και fMRI/);

  // An unverified course must not generate a course-specific quiz from title-only context.
  await page.selectOption('#heYear', '2');
  await page.selectOption('#heSemester', '3');
  const unverifiedValue = await page.locator('#heCourse option').filter({ hasText: 'Βιολογία Ζώων ΙΙ' }).getAttribute('value');
  assert.ok(unverifiedValue, 'unverified test course missing');
  await page.selectOption('#heCourse', unverifiedValue);
  assert.match(await page.locator('#heSyllabus').innerText(), /Δεν έχουμε ακόμη επαληθευμένο αναλυτικό περίγραμμα/i);
  await page.locator('[data-he-action="quiz"]').click();
  await page.locator('#heAiInput').fill('');
  const requestsBeforeBlocked = aiRequestCount;
  await page.locator('#heAiGroq').click();
  await page.waitForTimeout(80);
  assert.equal(aiRequestCount, requestsBeforeBlocked, 'unverified course generated AI material without student-provided source');
  assert.match(await page.locator('#heAiStatus').innerText(), /δεν έχουμε ακόμη επαληθευμένες θεματικές/i);

  const storage = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookie: document.cookie,
  }));
  assert.deepEqual(storage.local, []);
  assert.deepEqual(storage.session, []);
  assert.equal(storage.cookie, '');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Higher Education pilot has mobile horizontal overflow: ${overflow}px`);

  assert.deepEqual(failed, [], `same-origin failures: ${failed.join(', ')}`);
  assert.deepEqual(errors, [], `browser errors: ${errors.join('\n')}`);

  console.log('Higher Education hidden pilot smoke passed.');
} finally {
  await browser.close();
}
