// Routing, deep links (valid/invalid/empty/huge params), history, EL/EN switch.
import { test, expect, findTranslationLeaks, greekRatio, IS_PROD } from './fixtures.mjs';

test.describe('home + routing', () => {
  test('@smoke home renders 4 zones without runtime errors', async ({ page, qa }) => {
    const resp = await page.goto('/');
    expect(resp.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('button.zone-card')).toHaveCount(4);
    expect(qa.pageErrors, 'uncaught exceptions').toEqual([]);
    expect(qa.consoleErrors, 'console errors').toEqual([]);
  });

  test('@smoke choose age zone → deep link, back/forward', async ({ page, qa }) => {
    await page.goto('/');
    await page.locator('button.zone-card', { hasText: 'Δημοτικό' }).click();
    await expect(page).toHaveURL(/\/primary\/guardian\/tools$/);
    await expect(page.locator('#pathView')).toBeVisible();
    await page.locator('#viewTabQuiz').click();
    await expect(page).toHaveURL(/\/primary\/guardian\/quiz$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/primary\/guardian\/tools$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('button.zone-card').first()).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/\/primary\/guardian\/tools$/);
    expect(qa.pageErrors).toEqual([]);
  });

  test('refresh on a zone route keeps the route', async ({ page }) => {
    await page.goto('/primary/guardian/tools');
    await page.reload();
    await expect(page).toHaveURL(/\/primary\/guardian\/tools$/);
    await expect(page.locator('#pathView')).toBeVisible();
  });

  test('home → zone → refresh → browser Back shows the zone picker', async ({ page }) => {
    await page.goto('/');
    await page.locator('button.zone-card', { hasText: 'Δημοτικό' }).click();
    await page.reload();
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('button.zone-card').first()).toBeVisible();
  });

  for (const path of ['/index.html', '/about', '/guide', '/privacy-policy', '/nowhere/guardian/tools', '/en']) {
    test(`non-existent/extensionless URL ${path} shows readable content (not a blank page)`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(2500);
      await expect(page.locator('h1:visible').first()).toBeVisible();
    });
  }

  for (const [zone, label] of [['preschool', 'Νηπιαγωγείο'], ['middle', 'Γυμνάσιο'], ['high', 'Λύκειο']]) {
    test(`age zone card: ${zone}`, async ({ page, qa }) => {
      await page.goto('/');
      await page.locator('button.zone-card', { hasText: label }).click();
      await page.waitForLoadState('load');
      await expect(page.locator('h1:visible, h2:visible').first()).toBeVisible();
      expect(qa.pageErrors).toEqual([]);
    });
  }

  const deep = {
    valid_tutor_modes: '/primary/guardian/tutor?mode=challenge&grade=e&subject=istoria-e-dimotikou',
    unknown_mode: '/primary/guardian/tutor?mode=__nope__&grade=zzz&subject=__nope__',
    empty_params: '/primary/guardian/tutor?mode=&grade=&subject=&topicText=',
    xss_params: '/primary/guardian/tutor?mode=%3Cscript%3Ealert(1)%3C/script%3E&topicText=%22%3E%3Cimg%20src=x%20onerror=alert(1)%3E',
    huge_param: '/primary/guardian/tutor?topicText=' + 'A'.repeat(6000),
    unknown_view: '/primary/guardian/xyz',
    unknown_role: '/primary/robot/tools',
    preschool_student_tutor: '/preschool/student/tutor',
    primary_student_tutor_not_allowed: '/primary/student/tutor',
    trailing_slash: '/primary/guardian/tools/',
    double_slash: '//primary//guardian//tools',
    quiz_bad_gap: '/primary/guardian/quiz?gap=__nope__&quiz=__nope__&grade=zzz',
  };
  for (const [name, path] of Object.entries(deep)) {
    test(`deep link handled gracefully: ${name}`, async ({ page, qa }) => {
      let dialogSeen = false;
      page.on('dialog', async (d) => { dialogSeen = true; await d.dismiss(); });
      const resp = await page.goto(path.startsWith('//') ? '/' + path.replace(/^\/+/, '') : path);
      expect(resp.status(), 'HTTP status (soft-404 behaviour documented in REPORT F-03)').toBeLessThan(500);
      await page.waitForTimeout(600);
      await expect(page.locator('h1:visible, h2:visible').first()).toBeVisible();
      expect(dialogSeen, 'reflected XSS via query params').toBe(false);
      expect(qa.pageErrors).toEqual([]);
      const leaks = findTranslationLeaks(await page.locator('body').innerText());
      expect(leaks).toEqual([]);
    });
  }

  test('primary student cannot open AI tutor (age gate)', async ({ page }) => {
    await page.goto('/primary/student/tutor');
    await page.waitForTimeout(500);
    expect(await page.locator('#tutorInput').count(), 'AI Help textarea must not be available to primary-age students').toBe(0);
  });

  // FINDING F-03: unknown URLs return 200 + homepage and a self-referencing canonical (soft-404).
  test('unknown URL returns a real 404', async ({ page }) => {
    test.fail(!IS_PROD || true, 'FINDING F-03 soft-404: vercel.json catch-all "/(.*)" → "/" returns 200');
    const resp = await page.goto('/this-page-does-not-exist-' + Date.now());
    expect(resp.status()).toBe(404);
  });
  test('unknown URL is not self-canonical / is noindex', async ({ page }) => {
    test.fail(true, 'FINDING F-03: canonical is rewritten to the bogus URL (app.js updateDocumentTitle)');
    const p = '/this-page-does-not-exist-2';
    await page.goto(p);
    await page.waitForTimeout(500);
    const canonical = await page.evaluate(() => document.querySelector('link[rel=canonical]')?.href);
    const robots = await page.evaluate(() => document.querySelector('meta[name=robots]')?.content || '');
    expect(canonical?.endsWith(p) && !/noindex/.test(robots)).toBe(false);
  });
});

const LANG_PAGES = ['/', '/primary/guardian/tools', '/xartis-ylis.html', '/study.html', '/sign-language.html', '/special-education.html', '/guide.html', '/privacy-policy.html', '/about.html', '/methodology.html', '/school-ai-use.html', '/accessibility.html'];
// Pages whose visible text is mostly Greek DATA (official curriculum / ΕΝΓ concept names) – ratio is reported, not asserted.
const DATA_HEAVY = new Set(['/study.html', '/sign-language.html', '/special-education.html']);
// FINDING F-04: these pages (and the whole SPA) do not persist the EN choice; methodology/report-error/sign-language write aitools4kids_lang but the SPA ignores it.
const LANG_NOT_PERSISTED = new Set(['/', '/primary/guardian/tools', '/xartis-ylis.html', '/study.html', '/guide.html']);
const visibleTextOf = (page) => page.evaluate(() => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const out = [];
  while (w.nextNode()) { const n = w.currentNode; const el = n.parentElement; if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue; const t = n.textContent.trim(); if (t) out.push(t); }
  return out.join('\n');
});
const enButton = (page) => page.locator('#langEn, #enBtn, button[data-lang="en"], button:text-is("EN")').first();
test.describe('EL/EN switch', () => {
  for (const path of LANG_PAGES) {
    test(`${path}: EN keeps route, sets <html lang>, no i18n keys`, async ({ page, qa }) => {
      await page.goto(path);
      await page.waitForTimeout(500);
      const before = await page.evaluate(() => location.pathname + location.search);
      const btn = enButton(page);
      test.skip(await btn.count() === 0, 'no language switch on this page');
      await btn.click();
      await page.waitForTimeout(600);
      expect(await page.evaluate(() => location.pathname + location.search), 'route must not change').toBe(before);
      const text = await visibleTextOf(page);
      expect(findTranslationLeaks(text), 'raw translation keys / undefined').toEqual([]);
      const ratio = greekRatio(text);
      test.info().annotations.push({ type: 'greek-ratio-after-EN', description: ratio.toFixed(3) });
      if (!DATA_HEAVY.has(path)) expect(ratio, `Greek text left after switching to EN (${(ratio * 100).toFixed(0)}%)`).toBeLessThan(0.35);
      expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');
      expect(qa.pageErrors).toEqual([]);
    });
    test(`${path}: EN persists after reload`, async ({ page }) => {
      test.fail(LANG_NOT_PERSISTED.has(path), 'FINDING F-04: language choice is lost on reload / navigation');
      await page.goto(path);
      await page.waitForTimeout(500);
      const btn = enButton(page);
      test.skip(await btn.count() === 0, 'no language switch on this page');
      await btn.click();
      await page.waitForTimeout(400);
      await page.reload();
      await page.waitForTimeout(700);
      expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');
    });
  }
  test('EN chosen on home survives navigation to /study.html', async ({ page }) => {
    test.fail(true, 'FINDING F-04');
    await page.goto('/');
    await page.locator('#langEn').click();
    const link = page.locator('a[href="/study.html"]:visible').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForLoadState('load');
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');
  });
});
