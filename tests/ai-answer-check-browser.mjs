import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.AITOOLSKIDS_TEST_BASE || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const answer = 'Το αναπνευστικό σύστημα προσλαμβάνει οξυγόνο. <img src=x onerror=alert(1)>';
    let posted = null;
    await page.route('**/api/check-ai-answer', async route => {
      posted = route.request().postDataJSON();
      await route.fulfill({ json: { claims: [
        { id: 'c1', claim: answer, status: 'supported', evidence: 'Το αναπνευστικό σύστημα προσλαμβάνει οξυγόνο.', explanation: 'Το βιβλίο το αναφέρει.' },
        { id: 'c2', claim: 'Ισχυρισμός εκτός ενότητας', status: 'not_supported', evidence: '', explanation: 'Δεν υπάρχει εδώ.' },
        { id: 'c3', claim: 'Λανθασμένος ισχυρισμός', status: 'contradicted', evidence: 'Επίσημο απόσπασμα αντίθετο με τον ισχυρισμό.', explanation: 'Η πηγή αναφέρει το αντίθετο.' }
      ], source: { title: 'Βιολογία Β΄', topic: 'Αναπνευστικό σύστημα', url: 'https://ebooks.edu.gr/test' }, notice: 'Έλεγχος μόνο της επιλεγμένης ενότητας.' } });
    });
    await page.goto(base + '/study.html', { waitUntil: 'networkidle' });
    await page.locator('#topicPick').selectOption({ index: 1 });
    await page.locator('#answerCheck summary').click();
    await page.locator('#answerCheckText').fill(answer);
    await page.locator('#answerCheckSubmit').click();
    await page.waitForFunction(() => !document.getElementById('answerCheckResults').hidden);
    assert.equal(typeof posted.subjectId, 'string');
    assert.ok(posted.subjectId && posted.topic);
    assert.equal(posted.answer, answer);
    assert.equal(posted.documentText, undefined);
    assert.equal(await page.locator('#answerCheckResults .answer-check__claim').count(), 3);
    assert.equal(await page.locator('#answerCheckResults img').count(), 0);
    assert.equal(await page.locator('#answerCheckResults blockquote').count(), 2);
    assert.match(await page.locator('#answerCheckResults').innerText(), /Δεν τεκμηριώνεται/);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false, 'page must fit mobile viewport');
    await page.locator('#answerCheckText').fill(answer + ' Αλλαγή.');
    assert.equal(await page.locator('#answerCheckResults').isVisible(), false, 'old verdict cleared after edits');
    await page.route('**/api/check-ai-answer', route => route.fulfill({ status: 422, json: { error: 'official_source_required', message: 'Δεν είναι διαθέσιμη επαληθευμένη επίσημη πηγή.' } }));
    await page.locator('#answerCheckSubmit').click();
    await page.waitForFunction(() => document.getElementById('answerCheckStatus').textContent.includes('Δεν είναι διαθέσιμη'));
    assert.equal(await page.locator('#answerCheckResults').isVisible(), false);
    await page.locator('#enBtn').click();
    assert.match(await page.locator('#answerCheck summary').innerText(), /Check an AI answer/);
    await page.close();
    console.log('AI answer check browser flow passed at ' + width + 'px; runtime errors: ' + errors.length);
    assert.deepEqual(errors, []);
  }
} finally { await browser.close(); }
