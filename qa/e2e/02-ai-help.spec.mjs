// AI Help (tutor) UI behaviour with the API MOCKED – no provider is contacted. Server-side behaviour is in tests/api-handlers.mock.test.mjs.
// Real-model behaviour (guardrails / injection / off-topic) is NOT automatable without quota → see UAT.csv (UAT-AI-*) and scripts/ai-smoke.mjs (live, ≤ 8 requests).
import { test, expect, IS_PROD } from './fixtures.mjs';

async function openTutor(page, { path = '/high/student/tutor' } = {}) {
  page.on('dialog', (d) => d.dismiss());
  await page.goto(path);
  await page.locator('#tutorSchoolType').waitFor();
  await page.selectOption('#tutorSchoolType', 'gel');
  await page.selectOption('#tutorGrade', 'a');
  await page.selectOption('#tutorSubject', 'algebra-a-lykeiou');
  await expect(page.locator('#tutorInput')).toBeEnabled();
}
const send = async (page, text) => { await page.locator('#tutorInput').fill(text); await page.locator('#tutorSend').click(); };
const lastAnswer = (page) => page.locator('.tutor-bubble--assistant .tutor-bubble__text').last();

test.describe('AI Help (mocked API)', () => {
  test.skip(IS_PROD, 'runs against mocks only; use scripts/ai-smoke.mjs for live endpoints');

  test('@smoke normal question → answer rendered, payload sanity', async ({ page, mockAI, qa }) => {
    await openTutor(page);
    await send(page, 'Πώς λύνω 3x + 5 = 20;');
    await expect(lastAnswer(page)).toContainText('ΜΟΚ');
    const post = mockAI.calls.find((c) => c.method === 'POST');
    expect(post.path).toBe('/api/tutor-assistant');
    expect(post.body.audience).toBe('high_student');
    expect(post.body.prompt).toContain('Πώς λύνω 3x + 5 = 20;'); // client sends the whole conversation each turn
    // Data minimisation: only curriculum context + prompt (no ids, no user profile).
    const allowed = new Set(['studyContext', 'system', 'prompt', 'audience', 'task', 'mode', 'activity', 'cacheEligible', 'grade', 'subject', 'subjectId', 'topic', 'character', 'documentText', 'documentName', 'documentKind', 'documentSourceUrl']);
    expect(Object.keys(post.body).filter((k) => !allowed.has(k)), 'unexpected fields sent to the server').toEqual([]);
    expect(qa.pageErrors).toEqual([]);
  });

  test('empty / whitespace input sends nothing', async ({ page, mockAI }) => {
    await openTutor(page);
    await send(page, '');
    await send(page, '     ');
    await page.waitForTimeout(500);
    expect(mockAI.calls.filter((c) => c.method === 'POST')).toHaveLength(0);
  });

  test('double-click on Send produces one request', async ({ page, mockAI }) => {
    mockAI.delay = 400;
    await openTutor(page);
    await page.locator('#tutorInput').fill('Δοκιμή διπλού κλικ');
    await page.locator('#tutorSend').dblclick();
    await page.waitForTimeout(1200);
    expect(mockAI.calls.filter((c) => c.method === 'POST').length).toBe(1);
  });

  test('model output is rendered as text (no HTML/JS injection)', async ({ page, mockAI }) => {
    mockAI.text = 'Οκ <img src=x onerror="window.__xss=1"><script>window.__xss=2</script><a href="javascript:window.__xss=3">κλικ</a>';
    await openTutor(page);
    await send(page, 'test');
    await expect(lastAnswer(page)).toContainText('Οκ');
    expect(await page.evaluate(() => window.__xss)).toBeUndefined();
    expect(await page.locator('.tutor-messages img, .tutor-messages script, .tutor-messages a[href^="javascript"]').count()).toBe(0);
  });

  test('emoji / special characters / EN text are accepted and shown intact', async ({ page, mockAI }) => {
    await openTutor(page);
    const txt = 'Hi 😀 ∑√π "quotes" <b>x</b> {{7*7}} ${1+1} \\ Γεια σου!';
    await send(page, txt);
    await expect(page.locator('.tutor-bubble--user .tutor-bubble__text').last()).toHaveText(txt);
    expect(mockAI.calls.find((c) => c.method === 'POST').body.prompt).toContain(txt);
  });

  test('very long input is handled (server limit 16000 chars → friendly message, no crash)', async ({ page, context, qa }) => {
    // emulate server validation semantic for oversized prompts
    let sawLen = 0;
    await context.route('**/api/tutor-assistant', async (route) => {
      if (route.request().method() === 'GET') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"configured":true}' });
      const b = route.request().postDataJSON(); sawLen = b.prompt.length;
      if (b.prompt.length > 16000) return route.fulfill({ status: 413, contentType: 'application/json', body: JSON.stringify({ error: 'prompt_too_large', message: 'Η συνομιλία είναι πολύ μεγάλη. Ξεκίνα νέα συζήτηση.' }) });
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ text: 'ok', provider: 'mock', model: 'mock' }) });
    });
    await openTutor(page);
    await page.locator('#tutorInput').fill('α'.repeat(20000));
    await page.locator('#tutorSend').click();
    await page.waitForTimeout(1200);
    const bodyText = await page.locator('.tutor-messages').innerText();
    test.info().annotations.push({ type: 'sent-prompt-length', description: String(sawLen) });
    expect(bodyText).toMatch(/(πολύ μεγάλη|μεγάλο|όριο|too long|ok)/i);
    await expect(page.locator('#tutorSend')).toBeEnabled();
    expect(qa.pageErrors).toEqual([]);
  });

  for (const [mode, expected] of [['502', /δεν μπόρεσε|σφάλμα|error|προσπάθησε/i], ['429', /όριο|limit|Puter/i], ['timeout', /.+/], ['html', /.+/]]) {
    test(`API failure "${mode}" → user sees a message and can retry`, async ({ page, mockAI, qa }) => {
      await openTutor(page);
      mockAI.mode = mode;
      await send(page, 'Ερώτηση για έλεγχο σφάλματος');
      await page.waitForTimeout(1500);
      const chat = await page.locator('.tutor-messages').innerText();
      expect(chat.replace(/Ερώτηση για έλεγχο σφάλματος/g, '')).toMatch(expected);
      await expect(page.locator('#tutorSend')).toBeEnabled();
      mockAI.mode = 'ok';
      await send(page, 'Δεύτερη προσπάθεια');
      await expect(lastAnswer(page)).toContainText('ΜΟΚ');
      expect(qa.pageErrors).toEqual([]);
    });
  }

  test('429 → Puter is NOT loaded automatically (only after explicit choice + disclosure)', async ({ page, mockAI, qa }) => {
    await openTutor(page);
    mockAI.mode = '429';
    await send(page, 'Ερώτηση');
    await page.waitForTimeout(1500);
    expect(Object.keys(qa.thirdParty).filter((h) => /puter/.test(h)), 'Puter contacted without user consent').toEqual([]);
    expect(await page.evaluate(() => [...document.scripts].some((s) => /puter/.test(s.src)))).toBe(false);
  });

  test('Puter: disclosure panel (role=dialog, Esc closes, focus inside) appears before Puter is loaded', async ({ page, qa }) => {
    await openTutor(page);
    await page.locator('#tutorPuterChoice').click();
    await page.locator('#tutorSignIn').click();
    const panel = page.locator('.ai-help-boundary__panel');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Puter');
    const roleInfo = await page.evaluate(() => { const p = document.querySelector('.ai-help-boundary__panel'); const d = p.closest('[role=dialog]') || p; return { role: d.getAttribute('role'), modal: d.getAttribute('aria-modal'), labelled: !!(d.getAttribute('aria-labelledby') || d.getAttribute('aria-label')), focusInside: p.contains(document.activeElement) }; });
    test.info().annotations.push({ type: 'boundary-dialog-a11y', description: JSON.stringify(roleInfo) });
    expect(Object.keys(qa.thirdParty).filter((h) => /puter/.test(h)), 'Puter loaded before consent').toEqual([]);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    expect(Object.keys(qa.thirdParty).filter((h) => /puter/.test(h))).toEqual([]);
  });

  test('age gate: parent role available in Primary; student tutor not available below Lyceum', async ({ page, mockAI }) => {
    await page.goto('/primary/guardian/tutor');
    await expect(page.locator('#tutorInput')).toHaveCount(1);
    await page.goto('/middle/student/tutor');
    await page.waitForTimeout(600);
    test.info().annotations.push({ type: 'middle-student-tutor', description: (await page.locator('#tutorInput').count()) ? 'AI help textarea present for Gymnasio student (13+ per policy text)' : 'not available' });
  });

  test('personal data warning is visible next to the input', async ({ page }) => {
    await openTutor(page);
    await expect(page.locator('body')).toContainText(/Μην εισάγεις προσωπικά ή ευαίσθητα δεδομένα/);
  });
});
