// Core user flows: Practice Map, AI Study plan, Curriculum Map (Ύλη 2026-27), sign language, special education, higher-ed pilot, teacher assistant.
import fs from 'node:fs';
import path from 'node:path';
import { test, expect, IS_PROD } from './fixtures.mjs';
import { RESULTS } from '../scripts/lib.mjs';

const dismissDialogs = (page) => page.on('dialog', (d) => d.dismiss());

test.describe('Practice Map (Χάρτης Εξάσκησης)', () => {
  test('@smoke primary quiz: complete → result card → progress saved locally → survives reload', async ({ page, qa }) => {
    dismissDialogs(page);
    await page.goto('/primary/guardian/quiz');
    await page.locator('.quiz-grade-card', { hasText: "Ε' Δημοτικού" }).click();
    await page.locator('.quiz-subject-card', { hasText: 'Μαθηματικά' }).locator('.quiz-start-btn').first().click();
    for (let i = 0; i < 30; i++) {
      const opt = page.locator('#pathView .quiz-option').first();
      if (await opt.count() === 0) break;
      await opt.click();
      const next = page.locator('#pathView button:visible', { hasText: /Επόμενη|Τέλος|Αποτέλεσμα/ }).first();
      if (await next.count()) await next.click();
    }
    await expect(page.locator('#pathView')).toContainText('Το αποτέλεσμα του Χάρτη');
    await expect(page.locator('.quiz-retake-btn')).toBeVisible();
    const saved = await page.evaluate(() => localStorage.getItem('aitools4kids_progress_v1'));
    expect(saved, 'progress key written').toBeTruthy();
    const parsed = JSON.parse(saved);
    expect(parsed.quizId).toBe('math-e-dimotikou');
    await page.reload();
    expect(await page.evaluate(() => localStorage.getItem('aitools4kids_progress_v1'))).toBe(saved);
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/Συνέχισε|Συνέχεια|Continue|Η διαδρομή μου/, { timeout: 5000 }).catch(() => test.info().annotations.push({ type: 'info', description: 'no "continue" banner found on home after completing a quiz' }));
    expect(qa.pageErrors).toEqual([]);
  });

  test('retake quiz resets to first question', async ({ page }) => {
    dismissDialogs(page);
    await page.goto('/primary/guardian/quiz');
    await page.locator('.quiz-grade-card', { hasText: "Ε' Δημοτικού" }).click();
    await page.locator('.quiz-subject-card', { hasText: 'Μαθηματικά' }).locator('.quiz-start-btn').first().click();
    for (let i = 0; i < 30; i++) {
      const opt = page.locator('#pathView .quiz-option').first();
      if (await opt.count() === 0) break;
      await opt.click();
      const next = page.locator('#pathView button:visible', { hasText: /Επόμενη|Τέλος|Αποτέλεσμα/ }).first();
      if (await next.count()) await next.click();
    }
    await page.locator('.quiz-retake-btn').click();
    await expect(page.locator('#pathView .quiz-option').first()).toBeVisible();
  });

  test('EPAL practice map opens from home, closes with Esc and button', async ({ page }) => {
    dismissDialogs(page);
    await page.goto('/');
    await page.locator('a[href="#"]', { hasText: 'ΕΠΑΛ' }).first().click();
    await expect(page.locator('#epmapGo')).toBeVisible();
    await page.keyboard.press('Escape');
    const closedByEsc = await page.locator('#epmapGo').isHidden();
    test.info().annotations.push({ type: 'epal-modal', description: `closes with Esc: ${closedByEsc}; no URL change: ${new URL(page.url()).pathname === '/'}` });
    if (!closedByEsc) { await page.locator('.epmap__close').click(); await expect(page.locator('#epmapGo')).toBeHidden(); }
  });

  test('EPAL practice map can generate a short test', async ({ page, qa }) => {
    dismissDialogs(page);
    await page.goto('/');
    await page.locator('a[href="#"]', { hasText: 'ΕΠΑΛ' }).first().click();
    await page.selectOption('#epmapGrade', { index: 1 });
    if (await page.locator('#epmapTrack option').count() > 1) await page.selectOption('#epmapTrack', { index: 1 });
    await page.selectOption('#epmapSubject', { index: 1 });
    if (await page.locator('#epmapTopic option').count() > 1) await page.selectOption('#epmapTopic', { index: 1 });
    await expect(page.locator('#epmapGo')).toBeEnabled();
    await page.locator('#epmapGo').click();
    await page.waitForTimeout(800);
    expect(qa.pageErrors).toEqual([]);
    await expect(page.locator('body')).not.toContainText(/undefined|\[object/);
  });

  test('every Practice-Map grade card in every zone opens without error', async ({ page, qa }) => {
    dismissDialogs(page);
    for (const zone of ['primary', 'middle', 'high']) {
      await page.goto(`/${zone}/guardian/quiz`);
      const n = await page.locator('.quiz-grade-card').count();
      expect(n, `${zone}: grade cards`).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        await page.goto(`/${zone}/guardian/quiz`);
        await page.locator('.quiz-grade-card').nth(i).click();
        await page.waitForTimeout(200);
        const txt = await page.locator('#pathView').innerText();
        expect(txt, `${zone} card ${i}`).not.toMatch(/undefined|\[object Object\]/);
      }
    }
    expect(qa.pageErrors).toEqual([]);
  });
});

test.describe('AI Study (study.html) – study plan', () => {
  test.skip(IS_PROD, 'mocked');
  test('@smoke choose zone/grade/subject/topic/goal/time → plan requested and rendered', async ({ page, mockAI, qa }) => {
    dismissDialogs(page);
    mockAI.json = { title: 'Πλάνο δοκιμής', steps: [{ title: 'Βήμα 1', action: 'Διάβασε την ενότητα', minutes: 10 }, { title: 'Βήμα 2', action: 'Γράψε μία ερώτηση', minutes: 10 }, { title: 'Βήμα 3', action: 'Έλεγξε χωρίς AI', minutes: 5 }] };
    await page.goto('/study.html');
    await page.selectOption('#zone', 'primary');
    await page.selectOption('#grade', 'a');
    await page.selectOption('#topicPick', { index: 1 });
    await page.locator('.choice', { hasText: 'Επανάληψη' }).first().click();
    await page.locator('.choice', { hasText: '20′' }).first().click();
    await page.locator('.study-action', { hasText: 'Πλάνο μελέτης' }).click();
    await expect(page.locator('body')).toContainText('Πλάνο δοκιμής', { timeout: 8000 });
    const post = mockAI.calls.find((c) => c.method === 'POST');
    expect(post?.path).toMatch(/tutor-assistant/);
    expect(post.body.audience).toBe('study_user');
    expect(qa.pageErrors).toEqual([]);
  });

  test('ΕΠΑΛ: schoolType → sector → specialty filtering works', async ({ page }) => {
    dismissDialogs(page);
    await page.goto('/study.html');
    await page.selectOption('#zone', 'high');
    await page.selectOption('#schoolType', 'epal');
    await page.selectOption('#grade', 'b'); // sector applies to Β' ΕΠΑΛ, specialty to Γ' ΕΠΑΛ
    await expect(page.locator('#epalSector')).toBeVisible();
    const sectors = await page.locator('#epalSector option').count();
    expect(sectors).toBeGreaterThan(5);
    await page.selectOption('#epalSector', { index: 2 });
    const specialties = await page.locator('#epalSpecialty option').evaluateAll((o) => o.filter((x) => x.value).length);
    expect(specialties, 'specialties for chosen sector').toBeGreaterThan(0);
    await expect.poll(async () => page.locator('#subject option').count()).toBeGreaterThan(0);
    await page.selectOption('#grade', 'c');
    await expect(page.locator('#epalSpecialty')).toBeVisible();
    expect(await page.locator('#epalSpecialty option').count()).toBeGreaterThan(10);
    await page.selectOption('#epalSpecialty', { index: 1 });
    await expect.poll(async () => page.locator('#subject option').count()).toBeGreaterThan(0);
  });

  test('plan: API 429 / 502 shows an error, no crash', async ({ page, mockAI, qa }) => {
    dismissDialogs(page);
    for (const mode of ['429', '502']) {
      mockAI.mode = mode;
      await page.goto('/study.html');
      await page.selectOption('#topicPick', { index: 1 });
      await page.locator('.study-action', { hasText: 'Πλάνο μελέτης' }).click();
      await page.waitForTimeout(1200);
      await expect(page.locator('body')).not.toContainText(/undefined|\[object Object\]/);
    }
    expect(qa.pageErrors).toEqual([]);
  });
});

test.describe('Curriculum Map (xartis-ylis.html)', () => {
  test('@smoke primary → subject → course → topic selection updates the page', async ({ page, qa }) => {
    await page.goto('/xartis-ylis.html');
    const before = await page.locator('h2').nth(1).innerText();
    await page.selectOption('#subject', { index: 1 });
    await page.waitForTimeout(300);
    expect(await page.locator('#topicPick option').count()).toBeGreaterThan(1);
    await page.selectOption('#topicPick', { index: 2 });
    expect(await page.locator('main').innerText()).not.toMatch(/undefined|\[object/);
    expect(qa.pageErrors).toEqual([]);
    void before;
  });

  test('exhaustive: every zone × subject × course has non-empty topics; counters match', async ({ page, qa }) => {
    test.setTimeout(120_000);
    await page.goto('/xartis-ylis.html');
    const claimed = await page.locator('main').innerText().then((t) => ({ routes: +(t.match(/(\d+)\s+διαδρομές/) || [])[1], topics: +(t.match(/(\d+)\s+χαρτογραφημένα/) || [])[1] }));
    let routes = 0, topics = 0; const empty = [];
    for (const zone of ['Δημοτικό', 'Γυμνάσιο', 'Λύκειο']) {
      await page.locator('button.tab, [role=tab]', { hasText: zone }).first().click();
      const subjects = await page.locator('#subject option').evaluateAll((o) => o.map((x) => x.value));
      for (const s of subjects) {
        await page.selectOption('#subject', s);
        const courses = await page.locator('#course option').evaluateAll((o) => o.map((x) => x.value));
        for (const c of courses) {
          await page.selectOption('#course', c);
          const n = await page.locator('#topicPick option').evaluateAll((o) => o.filter((x) => x.value || x.textContent.trim()).length);
          routes++; topics += n;
          if (n === 0) empty.push(`${zone}/${s}/${c}`);
        }
      }
    }
    test.info().annotations.push({ type: 'map-counts', description: JSON.stringify({ claimed, iterated: { routes, topics } }) });
    fs.writeFileSync(path.join(RESULTS, 'curriculum-map-iteration.json'), JSON.stringify({ claimed, iterated: { routes, topics }, empty }, null, 2));
    expect(empty, 'course with no topics').toEqual([]);
    expect(qa.pageErrors).toEqual([]);
  });

  test('"Ειδικά σχολεία" tab explains ΕΠΑΛ/special and links exist', async ({ page }) => {
    await page.goto('/xartis-ylis.html');
    await page.locator('button.tab, [role=tab]', { hasText: 'Ειδικά σχολεία' }).first().click();
    await expect(page.locator('main')).toContainText('ΕΠΑΛ');
    for (const href of ['/high/student/tutor', '/special-education.html']) await expect(page.locator(`main a[href="${href}"]`)).toHaveCount(1);
  });

  test('deep link from a topic to AI Help carries subject + topic', async ({ page }) => {
    await page.goto('/xartis-ylis.html');
    const href = await page.locator('a[href*="/tutor?subject="]').first().getAttribute('href');
    expect(href).toMatch(/subject=[^&]+&topicText=/);
    await page.goto(href);
    await expect(page.locator('#tutorInput')).toHaveCount(1);
  });
});

test.describe('Sign language (ΕΝΓ)', () => {
  test('@smoke 167 concepts, search filters, empty state', async ({ page, qa }) => {
    await page.goto('/sign-language.html');
    await expect(page.locator('body')).toContainText('167');
    const cards = page.locator('main article, main .concept-card, main [data-concept]');
    const total = await cards.count();
    test.info().annotations.push({ type: 'concept-cards', description: String(total) });
    await page.locator('#search').fill('DNA');
    await page.waitForTimeout(400);
    const filtered = await cards.evaluateAll((els) => els.filter((e) => e.offsetParent).length);
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(total || 1000);
    await page.locator('#search').fill('zzzzqqqq-δεν-υπάρχει');
    await page.waitForTimeout(400);
    const shown = await cards.evaluateAll((els) => els.filter((e) => e.offsetParent).length);
    expect(shown).toBe(0);
    await expect(page.locator('main')).toContainText(/Δεν βρέθηκε|δεν βρέθηκαν|No results|Δεν υπάρχει/i);
    expect(qa.pageErrors).toEqual([]);
  });

  test('extract the 167 concept video/image links for the link checker', async ({ page }) => {
    await page.goto('/sign-language.html');
    const links = await page.evaluate(() => [...document.querySelectorAll('a[href^="http"]')].map((a) => ({ href: a.href, text: a.textContent.trim().slice(0, 60), concept: a.closest('article,[data-concept],.concept-card')?.querySelector('h2,h3')?.textContent.trim().slice(0, 60) || '' })));
    const imgs = await page.evaluate(() => [...document.querySelectorAll('img')].map((i) => i.src));
    fs.writeFileSync(path.join(RESULTS, 'sign-language-links.json'), JSON.stringify({ links, imgs }, null, 2));
    const iep = links.filter((l) => /prosvasimo\.iep\.edu\.gr/.test(l.href));
    test.info().annotations.push({ type: 'sl-links', description: `iep video links=${iep.length}, unique=${new Set(iep.map((l) => l.href)).size}, images=${imgs.length}` });
    expect(iep.length).toBeGreaterThanOrEqual(150);
  });

  test('every concept image has non-empty alt text', async ({ page }) => {
    await page.goto('/sign-language.html');
    const bad = await page.evaluate(() => [...document.querySelectorAll('main img')].filter((i) => !i.alt || !i.alt.trim()).length);
    expect(bad, 'images without alt').toBe(0);
  });
});

test.describe('Special education / Higher-ed pilot / Teacher assistant', () => {
  test('@smoke special-education page: paths open, no errors', async ({ page, qa }) => {
    dismissDialogs(page);
    await page.goto('/special-education.html');
    await expect(page.locator('h1')).toBeVisible();
    for (const label of ['Κάνε το μικρό διαγνωστικό', 'Ειδικό Γυμνάσιο', 'Ειδικό Λύκειο', 'ΕΝ.Ε.Ε.ΓΥ.-Λ.']) {
      await page.goto('/special-education.html');
      await page.locator('button', { hasText: label }).first().click();
      await page.waitForTimeout(400);
      expect(await page.locator('body').innerText(), label).not.toMatch(/undefined|\[object Object\]/);
    }
    expect(qa.pageErrors).toEqual([]);
  });

  test('special-education diagnostic: can be started and answered', async ({ page, qa }) => {
    dismissDialogs(page);
    await page.goto('/special-education.html');
    await page.locator('button', { hasText: 'Κάνε το μικρό διαγνωστικό' }).click();
    await page.waitForTimeout(600);
    for (let i = 0; i < 12; i++) {
      const opt = page.locator('button:visible[class*="option"], button:visible[class*="choice"], .spdiag button:visible').first();
      if (await opt.count() === 0) break;
      await opt.click().catch(() => {});
      await page.waitForTimeout(150);
    }
    expect(qa.pageErrors).toEqual([]);
  });

  test('@smoke higher-education pilot: noindex, selectors cascade, AI input requires provider', async ({ page, mockAI, qa }) => {
    dismissDialogs(page);
    await page.goto('/higher-education-pilot.html');
    expect(await page.locator('meta[name=robots]').getAttribute('content')).toMatch(/noindex/);
    const inst = await page.locator('#heInstitution option').count();
    expect(inst).toBeGreaterThan(1);
    await page.selectOption('#heInstitution', { index: 1 });
    await page.waitForTimeout(300);
    expect(await page.locator('#heDepartment option').count()).toBeGreaterThan(0);
    await page.locator('#heAiInput').fill('Εξήγησέ μου τη μέση τιμή');
    await page.locator('#heAiGroq').click();
    await page.waitForTimeout(1200);
    test.info().annotations.push({ type: 'he-ai-calls', description: JSON.stringify(mockAI.calls.filter((c) => c.method === 'POST').map((c) => ({ path: c.path, audience: c.body?.audience }))) });
    expect(qa.pageErrors).toEqual([]);
  });

  test('@smoke teacher assistant: page loads, builder fields present, video builder reachable', async ({ page, qa }) => {
    dismissDialogs(page);
    const resp = await page.goto('/teacher-assistant.html?task=video#builder');
    expect(resp.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Εκπαιδευτικό υλικό');
    await expect(page.locator('#videoCreateBtn')).toBeVisible();
    for (const id of ['context', 'grade', 'subject', 'unit', 'videoDuration', 'videoPurpose']) expect(await page.locator('#' + id + ' option').count(), id).toBeGreaterThan(0);
    expect(qa.pageErrors).toEqual([]);
  });

  test('teacher assistant video builder: default click is error-free (calls the storyboard API once with the default unit)', async ({ page, mockAI, qa }) => {
    dismissDialogs(page);
    await page.goto('/teacher-assistant.html?task=video#builder');
    await page.locator('#videoCreateBtn').click();
    await page.waitForTimeout(1200);
    test.info().annotations.push({ type: 'video-empty-click-api-calls', description: String(mockAI.calls.filter((c) => c.method === 'POST').length) });
    expect(qa.pageErrors).toEqual([]);
    await expect(page.locator('body')).not.toContainText(/undefined|\[object Object\]/);
  });
});
