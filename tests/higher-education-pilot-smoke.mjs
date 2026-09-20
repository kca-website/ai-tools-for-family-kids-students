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

  await page.goto(`${BASE}/higher-education-pilot.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#heInstitution option');

  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,nofollow');
  assert.ok((await page.locator('#heInstitution option').count()) >= 4, 'pilot institutions missing');
  assert.ok((await page.locator('#heDepartment option').count()) >= 1, 'pilot department missing');
  assert.ok((await page.locator('#heCourse option').count()) >= 1, 'pilot courses missing');
  assert.ok((await page.locator('#heTask option').count()) >= 1, 'task mappings missing');
  assert.ok((await page.locator('.he-tool').count()) >= 1, 'tool recommendations missing');

  await page.locator('#heSearch').fill('ΤΕΙ Κρήτης');
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#heInstitution').inputValue(), 'hmu');
  assert.equal(await page.locator('#heDepartment').inputValue(), 'hmu-ece');
  assert.match(await page.locator('#heSearchHint').innerText(), /σημερινή οντότητα/i);

  await page.locator('#heSearch').fill('ΤΕΙ Αθήνας');
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#heInstitution').inputValue(), 'uniwa');
  assert.equal(await page.locator('#heDepartment').inputValue(), 'uniwa-ice');

  const policyText = await page.locator('.he-warning').innerText();
  assert.match(policyText, /Δεν προορίζεται για έτοιμη εργασία προς υποβολή/i);

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
