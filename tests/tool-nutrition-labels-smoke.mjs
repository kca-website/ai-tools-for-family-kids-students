import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const LOCAL = 'http://127.0.0.1:4173/';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('**/_vercel/insights/script.js', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: '',
  }));

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.zone-card[data-zone="primary"]');
  await page.click('.zone-card[data-zone="primary"]');
  await page.waitForSelector('.tool-card');

  const facts = page.locator('.tool-card__nutrition');
  assert.ok(await facts.count() > 0, 'Tool Nutrition Labels should render on tool cards');

  const first = facts.first();
  const summary = (await first.locator('summary').textContent())?.trim() || '';
  assert.match(summary, /Στοιχεία εργαλείου|Tool facts/, 'Nutrition label needs a clear summary');

  await first.locator('summary').click();
  const labels = await first.locator('.tool-card__nutrition-key').allTextContents();
  const normalized = labels.map((value) => value.trim());
  for (const expected of ['Ηλικία', 'Ελληνικά', 'Κόστος', 'Λογαριασμός', 'Προσβασιμότητα', 'Έλεγχος']) {
    assert.ok(normalized.includes(expected), `Missing nutrition field: ${expected}`);
  }

  const text = (await first.textContent()) || '';
  assert.ok(!/undefined|null/.test(text), 'Nutrition label must not leak undefined/null values');

  const box = await first.boundingBox();
  assert.ok(box && box.width <= 390, 'Nutrition label must fit the mobile viewport');

  if (pageErrors.length) {
    throw new Error(`Page errors during nutrition-label smoke:\n${pageErrors.join('\n')}`);
  }

  console.log('Tool Nutrition Labels mobile smoke passed.');
} finally {
  await browser.close();
}
