import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/study.html');
    await page.selectOption('#zone', 'high');
    await page.selectOption('#grade', 'a');
    await page.selectOption('#subject', 'algebra-a-lykeiou');
    const topic = await page.locator('#topicPick option').evaluateAll(options => options.find(o => o.value)?.value);
    assert.ok(topic);
    await page.selectOption('#topicPick', topic);
    await page.waitForTimeout(100);
    await page.reload();
    assert.equal(await page.inputValue('#zone'), 'high');
    assert.equal(await page.inputValue('#grade'), 'a');
    assert.equal(await page.inputValue('#subject'), 'algebra-a-lykeiou');
    assert.equal(await page.inputValue('#topicPick'), topic);
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => {
      history.replaceState({}, '', '/high/student/tutor');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await page.waitForSelector('#tutorMount [id="tutorGrade"]', { state: 'attached' });
    assert.equal(await page.inputValue('#tutorGrade'), 'a');
    assert.equal(await page.inputValue('#tutorTopic'), topic);
    await page.goto('http://127.0.0.1:4173/study.html?zone=primary&grade=e&subject=math-e-dimotikou');
    assert.equal(await page.inputValue('#zone'), 'primary');
    assert.equal(await page.inputValue('#grade'), 'e');
    assert.equal(await page.inputValue('#subject'), 'math-e-dimotikou');
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('Study selection survives reload and Study → AI Help navigation; explicit links take precedence on mobile and desktop.');
} finally { await browser.close(); }
