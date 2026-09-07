import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173/classroom.html';
const PROD = 'https://www.aitools4kids.gr/classroom.html';
const browser = await chromium.launch({ headless: true });

async function assertSubjectCourseSync(url, label) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#workspace.visible', { timeout: 10000 });

    await page.selectOption('#subject', { label: 'Αγγλικά' });
    await page.waitForFunction(() => document.querySelector('#course')?.options.length > 0);

    const englishCount = await page.locator('#course option').count();
    if (englishCount > 1) await page.selectOption('#course', { index: 1 });

    await page.selectOption('#subject', { label: 'Ιστορία' });
    await page.waitForFunction(() => document.querySelector('#subject')?.selectedOptions?.[0]?.textContent?.trim() === 'Ιστορία');

    const selectedCourse = (await page.locator('#course option:checked').innerText()).trim();
    const allCourses = (await page.locator('#course option').allInnerTexts()).map((x) => x.trim());

    assert.ok(selectedCourse.startsWith('Ιστορία,'), `${label}: selected course did not follow subject change: ${selectedCourse}`);
    assert.ok(allCourses.length > 0, `${label}: History course list is empty`);
    assert.ok(allCourses.every((x) => x.startsWith('Ιστορία,')), `${label}: stale non-History courses remain: ${allCourses.join(' | ')}`);

    const current = new URL(page.url());
    assert.equal(current.searchParams.get('quiz'), await page.locator('#course').inputValue(), `${label}: URL quiz is not synced with selected History course`);
    assert.equal(current.searchParams.get('topic'), await page.locator('#topic').inputValue(), `${label}: URL topic is not synced with selected History topic`);

    console.log(`${label}: Αγγλικά → Ιστορία subject/course sync PASS (${selectedCourse})`);
  } finally {
    await page.close();
  }
}

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
  await page.close();

  await assertSubjectCourseSync(LOCAL, 'local merged code');
  await assertSubjectCourseSync(PROD, 'production');

  console.log('Classroom View privacy, routing, bilingual, mobile and subject/course sync smoke passed.');
} finally {
  await browser.close();
}
