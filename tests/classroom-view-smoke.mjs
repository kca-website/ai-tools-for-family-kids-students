import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173/classroom.html';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#workspace.visible', { timeout: 10000 });

  assert.equal(await page.locator('h1').innerText(), 'Για την τάξη');
  assert.ok((await page.locator('#course option').count()) > 0, 'course selector is empty');
  assert.ok((await page.locator('#topic option').count()) > 0, 'topic selector is empty');
  assert.match(await page.locator('#promptBox').innerText(), /Μην μου δώσεις έτοιμη τελική απάντηση/);
  assert.match(await page.locator('.privacy-note').innerText(), /χωρίς ονόματα ή αποτελέσματα μαθητών/i);
  assert.equal(await page.locator('#practiceLink').getAttribute('href'), '/primary/guardian/quiz');

  const current = new URL(page.url());
  assert.equal(current.searchParams.get('zone'), 'primary');
  assert.ok(current.searchParams.get('quiz'));
  assert.ok(current.searchParams.get('topic'));

  await page.getByRole('button', { name: 'Γυμνάσιο' }).click();
  await page.waitForFunction(() => new URL(location.href).searchParams.get('zone') === 'middle');
  assert.equal(await page.locator('#practiceLink').getAttribute('href'), '/middle/guardian/quiz');

  await page.getByRole('button', { name: 'EN' }).click();
  assert.equal(await page.locator('h1').innerText(), 'Classroom View');
  assert.match(await page.locator('#promptBox').innerText(), /Do not give me a finished answer/);
  assert.equal(new URL(page.url()).searchParams.get('lang'), 'en');

  const storage = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookie: document.cookie,
  }));
  assert.deepEqual(storage.local, [], 'Classroom View must not write localStorage');
  assert.deepEqual(storage.session, [], 'Classroom View must not write sessionStorage');
  assert.equal(storage.cookie, '', 'Classroom View must not set document cookies');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Classroom View has horizontal overflow on mobile: ${overflow}px`);
  assert.deepEqual(errors, [], `Classroom View browser errors:\n${errors.join('\n')}`);

  console.log('Classroom View privacy, routing, bilingual and mobile smoke passed.');
} finally {
  await browser.close();
}
