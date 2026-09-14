import { chromium } from 'playwright';
import assert from 'node:assert/strict';

// classroom.html and teacher-assistant.html were both rebuilt: classroom.html dropped its
// in-page #teacherTools job grid in favour of a single link out to teacher-assistant.html,
// and teacher-assistant.html itself became a context/grade/subject/unit-driven generator
// with six task buttons (lesson/worksheet/quiz/activity/explain/noai) instead of the old
// ?task= deep-linked MagicSchool/Brisk recommendation cards. This smoke test targets that
// current design.
const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });

try {
  const classroom = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await classroom.goto(`${BASE}/classroom.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const assistantLink = classroom.locator('a.cta[href="/teacher-assistant.html"]');
  assert.ok(await assistantLink.count(), 'Classroom must link to the AI Teacher Assistant');
  await classroom.close();

  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

    await page.goto(`${BASE}/teacher-assistant.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => (document.getElementById('subject')?.options.length || 0) > 0);

    assert.match(await page.locator('.privacy').innerText(), /Μην εισάγεις ονοματεπώνυμα/);
    assert.equal(await page.locator('.task').count(), 6, 'Teacher Assistant must expose six task buttons');
    const expectedTasks = ['lesson', 'worksheet', 'quiz', 'activity', 'explain', 'noai'];
    for (const task of expectedTasks) {
      assert.ok(await page.locator(`.task[data-task="${task}"]`).count(), `Missing teacher task: ${task}`);
    }
    assert.equal(await page.locator('.task.active').getAttribute('data-task'), 'lesson', 'Lesson plan should be the default active task');

    await page.click('.task[data-task="quiz"]');
    assert.equal(await page.locator('.task.active').getAttribute('data-task'), 'quiz', 'Clicking a task must activate it');

    assert.ok((await page.locator('#context option').count()) > 0, 'context selector is empty');
    assert.ok((await page.locator('#grade option').count()) > 0, 'grade selector is empty');
    assert.ok((await page.locator('#unit option').count()) > 0, 'unit selector is empty');

    assert.equal(await page.locator('script[src*="js.puter.com"]').count(), 0, 'Puter must not load before the user explicitly chooses it');
    assert.ok(await page.locator('#groqBtn').count(), 'Groq generation button missing');
    assert.ok(await page.locator('#puterBtn').count(), 'Puter generation button missing');

    const storage = await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    }));
    assert.deepEqual(storage.local, [], 'Teacher Assistant must not create localStorage history');
    assert.deepEqual(storage.session, [], 'Teacher Assistant must not create sessionStorage history');

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 1, `Teacher Assistant horizontal overflow: ${overflow}`);
    assert.deepEqual(errors, [], `Teacher Assistant browser errors: ${errors.join('\n')}`);
    await page.close();
  }

  console.log('Classroom → AI Teacher Assistant link, six task buttons and Puter-consent smoke passed.');
} finally {
  await browser.close();
}
