import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/Failed to load resource/i.test(text)) return;
    errors.push(`console: ${text}`);
  });

  await page.goto(`${LOCAL}/classroom.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForURL(/\/teacher-assistant\.html(?:[?#].*)?$/, { timeout: 10000 });
  assert.match(page.url(), /\/teacher-assistant\.html(?:[?#].*)?$/, 'classroom.html must redirect to the current teacher assistant');

  await page.waitForSelector('#builder', { state: 'visible', timeout: 10000 });
  assert.equal((await page.locator('h1').innerText()).trim(), 'Εκπαιδευτικό υλικό');
  assert.ok((await page.locator('#context option').count()) > 0, 'context selector is empty');
  assert.ok((await page.locator('#grade option').count()) > 0, 'grade selector is empty');
  assert.ok((await page.locator('#subject option').count()) > 0, 'subject selector is empty');
  assert.ok((await page.locator('#unit option').count()) > 0, 'unit selector is empty');
  assert.match(await page.locator('.privacy').innerText(), /Μην εισάγεις ονοματεπώνυμα|προσωπικά\/ευαίσθητα δεδομένα μαθητών/i);
  assert.ok(await page.locator('#groqBtn').isVisible(), 'Groq generation action is missing');
  assert.ok(await page.locator('#puterBtn').isVisible(), 'Puter generation action is missing');
  assert.ok(await page.locator('#quick').count() === 1, 'quick classroom activity section is missing');

  const storage = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookie: document.cookie,
  }));
  assert.deepEqual(storage.local, [], 'Teacher Assistant must not write localStorage on initial load');
  assert.deepEqual(storage.session, [], 'Teacher Assistant must not write sessionStorage on initial load');
  assert.equal(storage.cookie, '', 'Teacher Assistant must not set document cookies on initial load');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Teacher Assistant has horizontal overflow on mobile: ${overflow}px`);
  assert.deepEqual(errors, [], `Teacher Assistant browser errors:\n${errors.join('\n')}`);

  console.log('Classroom redirect + Teacher Assistant privacy, curriculum selectors and mobile smoke passed.');
} finally {
  await browser.close();
}
