// Home load performance contract: the home ("/") paints without the heavy curriculum/quiz/tutor data, which loads after a short idle window,
// and every path that needs the data (zone entry, quiz, tutor, EPAL modal, search, deep links) still works without flashing the legacy shell.
import fs from 'node:fs';
import path from 'node:path';
import { test, expect, openZoneFromHome } from './fixtures.mjs';
import { REPO } from '../scripts/lib.mjs';

const HEAVY_FILES = ['quiz-data.js', 'learning-paths-data.js', 'official-curriculum-data.js', 'gel-2026-2027-update.js', 'tutor.js', 'curriculum-resolver.js'];
const throttle = async (context, page, { rate = 4, kbps = 3000, latency = 100 } = {}) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency, downloadThroughput: (kbps * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
};

test.describe('home does not wait for the heavy data', () => {
  // Records the moment the new home is ready (observing `document`, which exists at init-script time).
  const markReady = () => {
    new MutationObserver(() => { if (!window.__readyAt && document.documentElement.classList.contains('navigator-home-ready')) window.__readyAt = performance.now(); })
      .observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
  };
  test('@smoke the heavy data is not needed for the first render, and loads right after it', async ({ page, qa }) => {
    await page.addInitScript(markReady);
    await page.goto('/');
    await expect(page.locator('html.navigator-home-ready')).toHaveCount(1, { timeout: 15_000 });
    await page.waitForFunction(() => window.__aitools4kidsHeavyLoaded === true, null, { timeout: 30_000 });
    const timing = await page.evaluate(() => ({ readyAt: window.__readyAt, res: performance.getEntriesByType('resource').filter((r) => /\.js$/.test(r.name)).map((r) => [new URL(r.name).pathname.slice(1), r.startTime, r.responseEnd]) }));
    for (const f of HEAVY_FILES) {
      const hit = timing.res.find(([n]) => n === f);
      expect(hit, `${f} was loaded`).toBeTruthy();
      expect(hit[1], `${f} should not start immediately on the home first paint`).toBeGreaterThanOrEqual(timing.readyAt + 650);
      expect(hit[2], `${f} finished loading after the home was ready`).toBeGreaterThanOrEqual(timing.readyAt);
    }
    expect(qa.pageErrors).toEqual([]);
  });

  test('the first render needs far less JavaScript than the full page (throttled phone)', async ({ page, context, qa }) => {
    await throttle(context, page);
    await page.addInitScript(markReady);
    const t0 = Date.now();
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForSelector('html.navigator-home-ready', { state: 'attached', timeout: 60_000 });
    const readyMs = Date.now() - t0;
    await page.waitForFunction(() => window.__readyAt > 0);
    const before = await page.evaluate(() => performance.getEntriesByType('resource').filter((r) => /\.js$/.test(r.name) && r.responseEnd <= window.__readyAt).map((r) => [new URL(r.name).pathname.slice(1), Math.round(r.decodedBodySize / 1024)]));
    const kb = before.reduce((a, [, k]) => a + k, 0);
    test.info().annotations.push({ type: 'home-ready', description: `${readyMs} ms, ${before.length} js files, ${kb} KB decoded before ready` });
    expect(kb, 'JS decoded before the home is ready (KB) – was ~3500').toBeLessThan(1400);
    expect(before.map(([f]) => f).filter((f) => HEAVY_FILES.includes(f)), 'heavy files loaded before ready').toEqual([]);
    expect(readyMs, 'time to new home (generous ceiling, wall-clock is noisy with parallel workers)').toBeLessThan(12_000);
    expect(qa.pageErrors).toEqual([]);
  });

  test('a skeleton (not the legacy home, not a blank page) is what shows while booting', async ({ page, context }) => {
    await throttle(context, page);
    await page.addInitScript(() => {
      const tick = () => {
        if (!document.body) return requestAnimationFrame(tick);
        const s = document.getElementById('homeBootSkeleton'); const z = document.getElementById('zoneSelectView');
        if (!s || !z) return requestAnimationFrame(tick);
        window.__firstFrame = { cls: document.documentElement.className, skeleton: getComputedStyle(s).display, zone: getComputedStyle(z).visibility };
      };
      requestAnimationFrame(tick);
    });
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForFunction(() => window.__firstFrame, null, { timeout: 30_000 });
    const early = await page.evaluate(() => window.__firstFrame);
    expect(early.cls).toContain('navigator-home-booting');
    expect(early.skeleton).toBe('block');
    expect(early.zone).toBe('hidden');
    await page.waitForSelector('html.navigator-home-ready', { state: 'attached', timeout: 60_000 });
    expect(await page.evaluate(() => getComputedStyle(document.getElementById('homeBootSkeleton')).display)).toBe('none');
  });

  test('rewritten SPA deep links never paint the legacy home before the requested route', async ({ page, context, qa }) => {
    await throttle(context, page, { rate: 4, kbps: 1800, latency: 120 });
    await page.addInitScript(() => {
      const tick = () => {
        if (!document.body) return requestAnimationFrame(tick);
        const s = document.getElementById('routeBootSkeleton');
        const z = document.getElementById('zoneSelectView');
        if (!s || !z) return requestAnimationFrame(tick);
        window.__routeFirstFrame = {
          cls: document.documentElement.className,
          skeleton: getComputedStyle(s).display,
          zone: getComputedStyle(z).visibility,
        };
      };
      requestAnimationFrame(tick);
    });

    for (const p of ['/high/student/tutor?schoolType=gel&grade=a&subject=istoria-a-lykeiou', '/primary/guardian/quiz', '/middle/guardian/tools']) {
      await page.goto(p, { waitUntil: 'commit' });
      await page.waitForFunction(() => window.__routeFirstFrame, null, { timeout: 30_000 });
      const early = await page.evaluate(() => window.__routeFirstFrame);
      expect(early.cls, p).toContain('navigator-route-booting');
      expect(early.skeleton, p).toBe('block');
      expect(early.zone, p).toBe('hidden');

      await page.waitForSelector('html.navigator-route-ready', { state: 'attached', timeout: 60_000 });
      expect(await page.evaluate(() => document.documentElement.classList.contains('navigator-route-booting')), p).toBe(false);
      expect(await page.evaluate(() => getComputedStyle(document.getElementById('routeBootSkeleton')).display), p).toBe('none');
    }
    expect(qa.pageErrors).toEqual([]);
  });

  test('skeleton never shows without JavaScript or on non-app routes', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(baseURL + '/');
    expect(await p.evaluate(() => getComputedStyle(document.getElementById('homeBootSkeleton')).display)).toBe('none');
    expect(await p.evaluate(() => getComputedStyle(document.getElementById('routeBootSkeleton')).display)).toBe('none');
    await p.goto(baseURL + '/study.html');
    expect(await p.evaluate(() => document.documentElement.classList.contains('navigator-route-booting'))).toBe(false);
    await ctx.close();
  });
});

test.describe('anything that needs the data still works from the home', () => {
  test('@smoke click a zone immediately (data not yet loaded) → tools view renders, then a quiz can be completed', async ({ page, context, qa }) => {
    page.on('dialog', (d) => d.dismiss());
    await throttle(context, page, { rate: 2, kbps: 4000, latency: 80 });
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForSelector('html.navigator-home-ready', { state: 'attached', timeout: 60_000 });
    const heavyAtClick = await page.evaluate(() => window.__aitools4kidsHeavyLoaded === true);
    await openZoneFromHome(page, 'primary');
    await expect(page).toHaveURL(/\/primary\/guardian\/tools$/, { timeout: 30_000 });
    await expect(page.locator('#pathView')).toBeVisible();
    test.info().annotations.push({ type: 'heavy-loaded-at-click', description: String(heavyAtClick) });
    await page.locator('#viewTabQuiz').click();
    await page.locator('.quiz-grade-card', { hasText: "Ε' Δημοτικού" }).click();
    await page.locator('.quiz-subject-card', { hasText: 'Μαθηματικά' }).locator('.quiz-start-btn').first().click();
    await expect(page.locator('#pathView .quiz-option').first()).toBeVisible();
    expect(qa.pageErrors).toEqual([]);
  });

  test('home → Lyceum student → AI Help is fully wired (tutor + its tools)', async ({ page, qa }) => {
    page.on('dialog', (d) => d.dismiss());
    await page.goto('/');
    await page.waitForFunction(() => window.__aitools4kidsHeavyLoaded === true, null, { timeout: 30_000 });
    await page.goto('/high/student/tutor');
    await page.selectOption('#tutorSchoolType', 'gel');
    await page.selectOption('#tutorGrade', 'a');
    await page.selectOption('#tutorSubject', 'algebra-a-lykeiou');
    await expect(page.locator('#tutorInput')).toBeEnabled();
    expect(qa.pageErrors).toEqual([]);
  });

  test('home → SPA link to the AI Help works and has the same tools as a deep link', async ({ page, qa }) => {
    page.on('dialog', (d) => d.dismiss());
    await page.goto('/');
    await page.locator('a[href="/primary/guardian/tutor"]').first().click();
    await expect(page).toHaveURL(/\/primary\/guardian\/tutor$/);
    await expect(page.locator('#tutorInput')).toHaveCount(1);
    const viaHome = await page.locator('.tutor-flashcards__btn, .tutor-study-tools__btn').count();
    await page.goto('/primary/guardian/tutor');
    await expect(page.locator('#tutorInput')).toHaveCount(1);
    const viaDeep = await page.locator('.tutor-flashcards__btn, .tutor-study-tools__btn').count();
    expect(viaHome, 'tutor tool buttons via home vs via deep link').toBe(viaDeep);
    expect(qa.pageErrors).toEqual([]);
  });

  test('EPAL practice map opens from the home right away and can generate a test', async ({ page, qa }) => {
    page.on('dialog', (d) => d.dismiss());
    await page.goto('/');
    await page.locator('a[href="#"]', { hasText: 'ΕΠΑΛ' }).first().click();
    await expect(page.locator('#epmapGo')).toBeVisible({ timeout: 30_000 });
    await page.selectOption('#epmapGrade', { index: 1 });
    if (await page.locator('#epmapTrack option').count() > 1) await page.selectOption('#epmapTrack', { index: 1 });
    await page.selectOption('#epmapSubject', { index: 1 });
    if (await page.locator('#epmapTopic option').count() > 1) await page.selectOption('#epmapTopic', { index: 1 });
    await expect(page.locator('#epmapGo')).toBeEnabled();
    expect(qa.pageErrors).toEqual([]);
  });

  test('returning user with saved progress: no errors on the home, and the "continue" banner appears once the data has loaded', async ({ page, qa }) => {
    await page.addInitScript(() => { try { localStorage.setItem('aitools4kids_progress_v1', JSON.stringify({ zoneId: 'primary', quizId: 'math-e-dimotikou', gapTagIds: [], savedAt: Date.now() })); } catch {} });
    await page.goto('/');
    await page.waitForFunction(() => window.__aitools4kidsHeavyLoaded === true, null, { timeout: 30_000 });
    await expect(page.locator('#continueProgressBanner')).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('#continueProgressBanner')).toContainText(/Συνέχισε|Continue/);
    expect(qa.pageErrors, 'QUIZZES must never be read before it exists').toEqual([]);
    await page.locator('#continueProgressBtn').click();
    await expect(page).toHaveURL(/\/primary\/guardian\/quiz/);
  });

  test('home search finds curriculum entries once the data has loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.__aitools4kidsHeavyLoaded === true, null, { timeout: 30_000 });
    await page.locator('#homeGlobalSearchInput').fill('κλάσματα');
    await expect(page.locator('#homeGlobalSearchResults')).not.toBeEmpty({ timeout: 8_000 });
    expect((await page.locator('#homeGlobalSearchResults').innerText()).length).toBeGreaterThan(20);
  });

  test('deep links keep the original loading order: data is available when app.js starts', async ({ page, qa }) => {
    for (const p of ['/primary/guardian/quiz', '/high/student/tutor', '/middle/guardian/tools']) {
      await page.goto(p);
      expect(await page.evaluate(() => typeof QUIZZES !== 'undefined' && typeof LEARNING_PATHS !== 'undefined' && !!window.AITutor), p).toBe(true);
    }
    expect(qa.pageErrors).toEqual([]);
  });

  test('language switch on the home before the data is loaded does not lose anything', async ({ page, context }) => {
    await throttle(context, page, { rate: 2, kbps: 4000, latency: 80 });
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForSelector('html.navigator-home-ready', { state: 'attached', timeout: 60_000 });
    await page.locator('#langEn').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe('loader configuration stays in sync', () => {
  const html = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
  const pwa = fs.readFileSync(path.join(REPO, 'pwa.js'), 'utf8');
  const arr = (name) => JSON.parse(html.match(new RegExp(`var ${name}=(\\[.*?\\]);`, 's'))[1]);

  test('every file in the loader exists', async () => {
    for (const f of arr('HEAVY')) expect(fs.existsSync(path.join(REPO, f)), f).toBe(true);
    for (const [, f] of arr('LATE')) expect(fs.existsSync(path.join(REPO, f)), f).toBe(true);
  });

  test('LATE list = pwa.js RUNTIME_SCRIPTS minus the scripts the home needs immediately', async () => {
    const rt = [...pwa.split('const RUNTIME_SCRIPTS=[')[1].split('];')[0].matchAll(/\{id:"([^"]+)",src:"([^"]+)"\}/g)].map((m) => [m[1], m[2]]);
    const EARLY = new Set(['pwa-core', 'navigator-home', 'home-search', 'special-education-entry-analytics']);
    expect(arr('LATE')).toEqual(rt.filter(([id]) => !EARLY.has(id)));
  });

  test('no heavy script is still a static <script> tag (would defeat the split) and each is loaded exactly once on other routes', async () => {
    for (const f of arr('HEAVY')) expect(html.includes(`<script defer src="${f}"></script>`), `${f} still static`).toBe(false);
  });

  test('pwa.js skips the deferred runtime scripts on the home only', async () => {
    expect(pwa).toMatch(/isHomepage\(\) && Array\.isArray\(window\.__aitools4kidsHomeLate\)/);
  });
});
