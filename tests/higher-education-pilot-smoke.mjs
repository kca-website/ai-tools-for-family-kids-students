import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => {
    window.__printCalls = 0;
    window.print = () => { window.__printCalls += 1; };
  });
  const errors = [];
  const failed = [];
  let lastAiPayload = null;
  let aiRequestCount = 0;

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

  await page.route('**/api/teacher-assistant', async (route) => {
    const request = route.request();
    aiRequestCount += 1;
    lastAiPayload = JSON.parse(request.postData() || '{}');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        text: '## Πλάνο μελέτης\n\n**Στόχος:** Κατανόηση\n\n- Βήμα 1\n- Βήμα 2\n\n| Στάδιο | Ενέργεια |\n|---|---|\n| 1 | Μελέτη |',
        model: 'gpt-oss-120b'
      }),
    });
  });

  await page.goto(`${BASE}/higher-education-pilot.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll('#heInstitution option').length >= 5);

  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,nofollow');
  assert.ok((await page.locator('#heInstitution option').count()) >= 5, 'pilot institutions missing');
  assert.ok((await page.locator('#heCourse option').count()) >= 1, 'initial course list missing');
  assert.equal(await page.locator('#heTask').count(), 0, 'duplicate top-level goal selector must not exist');


  // Legacy aliases still resolve to current institutions.
  await page.locator('#heSearch').fill('ΤΕΙ Κρήτης');
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#heInstitution').inputValue(), 'hmu');
  assert.equal(await page.locator('#heDepartment').inputValue(), 'hmu-ece');
  assert.match(await page.locator('#heSearchHint').innerText(), /σημερινή οντότητα/i);

  await page.locator('#heSearch').fill('ΤΕΙ Αθήνας');
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#heInstitution').inputValue(), 'uniwa');
  assert.equal(await page.locator('#heDepartment').inputValue(), 'uniwa-ice');

  // Patras Biology structured flow.
  await page.locator('#heSearch').fill('Βιολογία Πατρών');
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#heInstitution').inputValue(), 'upatras');
  assert.equal(await page.locator('#heDepartment').inputValue(), 'upatras-biology');
  assert.equal(await page.locator('#heYear').inputValue(), '1');
  assert.equal(await page.locator('#heSemester').inputValue(), '1');
  assert.equal(await page.locator('#heCourse option').count(), 4, 'semester 1 must expose four required courses');
  assert.match(await page.locator('#heCourse option').first().innerText(), /ΒΙΟ_ΒΚΔ/);
  const syllabusDetails = page.locator('#heSyllabus details');
  assert.equal(await syllabusDetails.getAttribute('open'), null, 'verified topics must be collapsed by default');
  assert.match(await page.locator('#heSyllabus summary').innerText(), /επαληθευμένες θεματικές/i);
  assert.match(await page.locator('#heSyllabus summary').innerText(), /Περίγραμμα 2021-2022/i);
  await page.locator('#heSyllabus summary').click();
  assert.notEqual(await syllabusDetails.getAttribute('open'), null, 'syllabus summary did not expand');
  assert.match(await page.locator('#heSyllabus').innerText(), /Source-locked/i);
  await page.locator('#heSyllabus summary').click();
  assert.equal(await syllabusDetails.getAttribute('open'), null, 'syllabus summary did not collapse');

  // Verified Biostatistics course passes official topics to AI and rich output renders correctly.
  await page.selectOption('#heCourse', '1');
  assert.equal(await page.locator('#heSyllabus details').getAttribute('open'), null, 'course-change syllabus must remain collapsed by default');
  await page.locator('#heSyllabus summary').click();
  assert.match(await page.locator('#heSyllabus').innerText(), /Συσχέτιση και παλινδρόμηση/i);
  const beforeAiUrl = page.url();
  await page.locator('[data-he-action="study-plan"]').click();
  await page.locator('#heAiInput').fill('Θέλω να οργανώσω τη μελέτη μου στη Βιοστατιστική');
  const beforeStudy = aiRequestCount;
  await page.locator('#heAiGroq').click();
  await page.waitForTimeout(100);
  assert.equal(aiRequestCount, beforeStudy + 1, 'verified Biostatistics request was not sent');
  assert.equal(page.url(), beforeAiUrl, 'inline AI must not navigate away');
  assert.match(await page.locator('#heAiOutput h3').innerText(), /Πλάνο μελέτης/);
  assert.equal((await page.locator('#heAiOutput').innerText()).includes('**'), false, 'raw bold markdown leaked');
  assert.equal((await page.locator('#heAiOutput').innerText()).includes('##'), false, 'raw heading markdown leaked');
  assert.equal(await page.locator('#heAiOutput strong').count(), 1);
  assert.ok((await page.locator('#heAiOutput li').count()) >= 2);
  assert.equal(await page.locator('#heAiOutput .he-md-table').count(), 1);
  assert.equal(await page.locator('#hePrintActions').evaluate((el) => el.classList.contains('visible')), true, 'print/PDF action must appear after AI output');
  assert.match(await page.locator('#hePrintAi').innerText(), /Εκτύπωση \/ PDF/);
  await page.locator('#hePrintAi').click();
  assert.equal(await page.evaluate(() => window.__printCalls), 1, 'print action did not call window.print');
  assert.match(await page.locator('#hePrintArea').innerText(), /Γενικά Μαθηματικά - Βιοστατιστική/);
  assert.match(await page.locator('#hePrintArea').innerText(), /1ο έτος/);
  assert.match(await page.locator('#hePrintArea').innerText(), /1ο εξάμηνο/);
  assert.match(await page.locator('#hePrintArea').innerText(), /Πλάνο μελέτης/);
  assert.match(await page.locator('#hePrintArea').innerText(), /Βήμα 1/);
  assert.equal(lastAiPayload.audience, 'university_student');
  assert.match(lastAiPayload.system, /SOURCE LOCK/);
  assert.match(lastAiPayload.prompt, /ΒΙΟ_ΓΜΒ · Γενικά Μαθηματικά - Βιοστατιστική/);
  assert.match(lastAiPayload.prompt, /Συσχέτιση και παλινδρόμηση/);
  assert.match(lastAiPayload.prompt, /Επίσημη πηγή περιγράμματος/);

  // Neurobiology must use the official topic whitelist.
  await page.selectOption('#heYear', '4');
  await page.selectOption('#heSemester', '7');
  const neuroOption = page.locator('#heCourse option').filter({ hasText: 'Νευροβιολογία' });
  const neuroValue = await neuroOption.getAttribute('value');
  assert.ok(neuroValue, 'Neurobiology option missing from semester 7');
  await page.selectOption('#heCourse', neuroValue);
  assert.equal(await page.locator('#heSyllabus details').getAttribute('open'), null, 'Neurobiology syllabus must be collapsed by default');
  await page.locator('#heSyllabus summary').click();
  assert.match(await page.locator('#heSyllabus').innerText(), /Συναπτική διαβίβαση/i);
  assert.match(await page.locator('#heSyllabus').innerText(), /Νευροαπεικονιστικές τεχνικές/i);
  assert.match(await page.locator('#heSyllabus').innerText(), /Source-locked/i);

  await page.locator('[data-he-action="quiz"]').click();
  await page.locator('#heAiInput').fill('');
  const beforeNeuro = aiRequestCount;
  await page.locator('#heAiGroq').click();
  await page.waitForTimeout(100);
  assert.equal(aiRequestCount, beforeNeuro + 1, 'verified Neurobiology quiz did not call AI');
  assert.match(lastAiPayload.system, /Κάθε ερώτηση quiz πρέπει να αντιστοιχεί άμεσα/);
  assert.match(lastAiPayload.prompt, /ΒΙΟ_ΝΕΥ · Νευροβιολογία/);
  assert.match(lastAiPayload.prompt, /Στόχος που επέλεξε: Να κάνω εξάσκηση/);
  assert.match(await page.locator('#heResult').innerText(), /Στόχος: Να κάνω εξάσκηση/);

  assert.match(lastAiPayload.prompt, /Συναπτική διαβίβαση/);
  assert.match(lastAiPayload.prompt, /Νευροαπεικονιστικές τεχνικές PET, MRI και fMRI/);

  // Unverified course: no title-only quiz generation.
  await page.selectOption('#heYear', '2');
  await page.selectOption('#heSemester', '3');
  const unverifiedOption = page.locator('#heCourse option').filter({ hasText: 'Βιολογία Ζώων ΙΙ' });
  const unverifiedValue = await unverifiedOption.getAttribute('value');
  assert.ok(unverifiedValue, 'unverified fixture course missing');
  await page.selectOption('#heCourse', unverifiedValue);
  assert.equal(await page.locator('#heSyllabus details').getAttribute('open'), null, 'unverified syllabus notice must also stay collapsed');
  await page.locator('#heSyllabus summary').click();
  assert.match(await page.locator('#heSyllabus').innerText(), /Δεν έχουμε ακόμη επαληθευμένο αναλυτικό περίγραμμα/i);

  await page.locator('[data-he-action="quiz"]').click();
  await page.locator('#heAiInput').fill('');
  const beforeBlocked = aiRequestCount;
  await page.locator('#heAiGroq').click();
  await page.waitForTimeout(80);
  assert.equal(aiRequestCount, beforeBlocked, 'unverified title-only quiz should be blocked');
  assert.match(await page.locator('#heAiStatus').innerText(), /δεν έχουμε ακόμη επαληθευμένες θεματικές/i);

  // The same unverified course is allowed when the student supplies source material.
  await page.locator('#heAiInput').fill('Σημειώσεις μαθήματος: Δευτεροστόμια, Εχινόδερμα, Χορδωτά.');
  const beforeMaterial = aiRequestCount;
  await page.locator('#heAiGroq').click();
  await page.waitForTimeout(100);
  assert.equal(aiRequestCount, beforeMaterial + 1, 'student-provided material should unlock generation');
  assert.match(lastAiPayload.system, /Χρησιμοποίησε μόνο το υλικό που έδωσε ο φοιτητής/i);
  assert.match(lastAiPayload.prompt, /Δευτεροστόμια, Εχινόδερμα, Χορδωτά/);
  assert.match(lastAiPayload.prompt, /course-only-current-program/);

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

  console.log('Higher Education structured source-lock pilot smoke passed.');
} finally {
  await browser.close();
}
