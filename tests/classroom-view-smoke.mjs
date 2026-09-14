import { chromium } from 'playwright';
import assert from 'node:assert/strict';

// classroom.html was rebuilt as a small "quick activity" tool (zone/grade/subject/topic
// pickers driving a 3-step in-class prompt) that replaced an older bilingual "Classroom
// View" page (#course, #promptBox, ?zone=&lang= routing). This smoke test targets the
// current markup and JS in classroom.html.
const LOCAL = 'http://127.0.0.1:4173/classroom.html';
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => (document.getElementById('subject')?.options.length || 0) > 0, { timeout: 10000 });

  assert.equal(await page.locator('h1').innerText(), 'Για την τάξη');
  assert.equal(await page.locator('#zone').inputValue(), 'middle', 'Classroom quick activity should default to Γυμνάσιο');
  assert.ok((await page.locator('#grade option').count()) > 0, 'grade selector is empty');
  assert.ok((await page.locator('#subject option').count()) > 0, 'subject selector is empty');
  assert.ok((await page.locator('#topic option').count()) > 0, 'topic selector is empty');

  const initialTopic = await page.locator('#topic').inputValue();
  assert.match(await page.locator('#prompt').innerText(), new RegExp(`«${initialTopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}»`));
  assert.match(await page.locator('#prompt').innerText(), /Μην δώσεις έτοιμη απάντηση/);
  assert.ok((await page.locator('#step1').innerText()).length > 0, 'step 1 guidance text is empty');
  assert.ok((await page.locator('#step3').innerText()).length > 0, 'step 3 guidance text is empty');

  await page.selectOption('#zone', 'primary');
  await page.waitForFunction(() => document.getElementById('grade')?.options[0]?.textContent.includes('Δημοτικού'));
  assert.ok((await page.locator('#subject option').count()) > 0, 'primary subject selector is empty after zone switch');

  await page.click('#copyPrompt');
  await page.waitForFunction(() => (document.getElementById('status')?.textContent || '').length > 0, { timeout: 5000 });
  assert.match(await page.locator('#status').innerText(), /αντιγράφηκε/i);

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  assert.equal(clipboardText, await page.locator('#prompt').innerText(), 'Copy button did not copy the current prompt');

  assert.ok(await page.locator('a.cta[href="/teacher-assistant.html"]').count(), 'Link to the full AI Βοηθός is missing');
  assert.ok(await page.locator('a.cta.secondary[href="#quick"]').count(), 'Quick-activity anchor link is missing');

  const storage = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookie: document.cookie,
  }));
  assert.deepEqual(storage.local, [], 'Classroom quick activity must not write localStorage');
  assert.deepEqual(storage.session, [], 'Classroom quick activity must not write sessionStorage');
  assert.equal(storage.cookie, '', 'Classroom quick activity must not set document cookies');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Classroom quick activity has horizontal overflow on mobile: ${overflow}px`);
  assert.deepEqual(errors, [], `Classroom quick activity browser errors:\n${errors.join('\n')}`);

  console.log('Classroom quick activity privacy, defaults and mobile smoke passed.');
} finally {
  await browser.close();
}
