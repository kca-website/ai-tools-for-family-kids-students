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
  await page.route('**/api/teacher-assistant', async (route) => {
    const request = route.request();
    lastAiPayload = JSON.parse(request.postData() || '{}');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ text: '## Πλάνο μελέτης\n\n**Στόχος:** Κατανόηση\n\n- Βήμα 1\n- Βήμα 2\n\n| Στάδιο | Ενέργεια |\n|---|---|\n| 1 | Μελέτη |', model: 'gpt-oss-120b' }),
    });
  });

  await page.goto(`${BASE}/higher-education-pilot.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll('#heInstitution option').length >= 5);

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

  const warnings = page.locator('.he-warning');
  assert.equal(await warnings.count(), 2, 'expected general and inline-AI guardrails');
  assert.match(await warnings.nth(0).innerText(), /Δεν προορίζεται για έτοιμη εργασία προς υποβολή/i);
  assert.match(await warnings.nth(1).innerText(), /Όχι έτοιμη εργασία/i);

  await page.locator('#heSearch').fill('Βιολογία Πατρών');
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#heInstitution').inputValue(), 'upatras');
  assert.equal(await page.locator('#heDepartment').inputValue(), 'upatras-biology');
  assert.equal(await page.locator('#heYear').inputValue(), '1');
  assert.equal(await page.locator('#heSemester').inputValue(), '1');
  assert.equal(await page.locator('#heCourse option').count(), 4, 'Patras Biology semester 1 must expose four required courses');
  assert.match(await page.locator('#heCourse option').first().innerText(), /ΒΙΟ_ΒΚΔ/);
  assert.ok((await page.locator('#heSyllabus li').count()) >= 5, 'verified syllabus topics missing for first Biology course');

  await page.selectOption('#heCourse', '1');
  assert.match(await page.locator('#heSyllabus').innerText(), /Συσχέτιση και παλινδρόμηση/i);

  const beforeAiUrl = page.url();
  await page.locator('[data-he-action="study-plan"]').click();
  assert.equal(await page.locator('[data-he-action="study-plan"]').getAttribute('aria-pressed'), 'true');
  await page.locator('#heAiInput').fill('Θέλω να οργανώσω τη μελέτη μου στη Βιοστατιστική');
  await page.locator('#heAiGroq').click();
  await page.waitForFunction(() => document.querySelector('#heAiOutput')?.classList.contains('visible'));
  assert.equal(page.url(), beforeAiUrl, 'inline AI must not navigate away from the university page');
  assert.match(await page.locator('#heAiOutput h3').innerText(), /Πλάνο μελέτης/);
  assert.equal(await page.locator('#heAiOutput').innerText().then((x) => x.includes('**')), false, 'raw bold markdown leaked into output');
  assert.equal(await page.locator('#heAiOutput').innerText().then((x) => x.includes('##')), false, 'raw heading markdown leaked into output');
  assert.equal(await page.locator('#heAiOutput strong').count(), 1, 'bold markdown was not rendered');
  assert.ok((await page.locator('#heAiOutput li').count()) >= 2, 'markdown list was not rendered');
  assert.equal(await page.locator('#heAiOutput .he-md-table').count(), 1, 'markdown table was not wrapped for mobile scrolling');
  assert.ok(lastAiPayload, 'inline AI did not call the shared server endpoint');
  assert.match(lastAiPayload.system, /AI Βοηθός Φοιτητή/);
  assert.equal(lastAiPayload.audience, 'university_student');

  assert.match(lastAiPayload.prompt, /Πανεπιστήμιο Πατρών/);
  assert.match(lastAiPayload.prompt, /Τμήμα Βιολογίας/);
  assert.match(lastAiPayload.prompt, /Πλάνο μελέτης/);
  assert.match(lastAiPayload.prompt, /Έτος: 1/);
  assert.match(lastAiPayload.prompt, /Εξάμηνο: 1/);
  assert.match(lastAiPayload.prompt, /Γενικά Μαθηματικά - Βιοστατιστική/);
  assert.match(lastAiPayload.prompt, /Συσχέτιση και παλινδρόμηση/);
  assert.match(lastAiPayload.prompt, /Θέλω να οργανώσω τη μελέτη μου στη Βιοστατιστική/);

  await page.locator('[data-he-action="feedback"]').click();
  assert.match(await page.locator('#heAiInput').getAttribute('placeholder'), /δική σου/i);

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
