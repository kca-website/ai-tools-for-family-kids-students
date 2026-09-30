// PHASE 10: SEO landing pages in a real browser: status/indexability, overflow at 320/375, axe, layout shift,
// link reachability and AI Help deep links (the subject <select> must really receive the linked value).
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures.mjs';
import { PROD } from '../scripts/lib.mjs';
import { LANDING } from '../../scripts/phase10/slugs.mjs';

const tutorLinks = new Map(); // href -> slug (collected while the pages are visited)

test.describe('phase 10 landing pages', () => {
  for (const slug of LANDING) {
    const url = `/${slug}.html`;

    test(`${slug}: 200, indexable, canonical, one H1 @smoke`, async ({ page, request }) => {
      const res = await request.get(url);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('text/html');
      expect(res.headers()['x-robots-tag'] || '').not.toMatch(/noindex/i);
      await page.goto(url);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.locator('link[rel=canonical]').getAttribute('href')).toBe(`${PROD}${url}`);
      expect((await page.locator('meta[name=robots]').getAttribute('content')) || '').not.toMatch(/noindex/i);
      expect((await page.title()).length).toBeGreaterThan(30);
    });

    test(`${slug}: no horizontal overflow at the project viewport and at 320px`, async ({ page }) => {
      await page.goto(url);
      await page.waitForTimeout(600);
      for (const width of [null, 320]) {
        if (width) await page.setViewportSize({ width, height: 700 });
        const over = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, wide: [...document.querySelectorAll('main *')].filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map((e) => e.tagName + '.' + e.className).slice(0, 5) }));
        expect(over.sw, `scrollWidth ${over.sw} > ${over.cw} (${over.wide.join(', ')})`).toBeLessThanOrEqual(over.cw);
      }
    });

    test(`${slug}: axe has no serious/critical violations; no layout shift; no runtime errors`, async ({ page, qa }, info) => {
      test.setTimeout(60_000);
      await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
      await page.goto(url);
      await page.waitForTimeout(1500);
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      const bad = res.violations.filter((v) => ['critical', 'serious'].includes(v.impact)).map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target?.join(' ')}`);
      info.annotations.push({ type: 'axe', description: res.violations.map((v) => `${v.impact}:${v.id}`).join(', ') || 'none' });
      expect(bad).toEqual([]);
      const cls = await page.evaluate(() => window.__cls);
      info.annotations.push({ type: 'cls', description: String(cls) });
      expect(cls, 'cumulative layout shift').toBeLessThan(0.02);
      expect(qa.pageErrors).toEqual([]);
      expect(qa.consoleErrors).toEqual([]);
      expect(qa.failedInternal).toEqual([]);
      expect(await page.locator('#chromeSkip').count(), 'shared skip link').toBe(1);
    });

    test(`${slug}: every internal CTA/link is reachable and FAQ is visible HTML`, async ({ page, request }) => {
      test.setTimeout(90_000);
      await page.goto(url);
      const hrefs = await page.$$eval('main a[href]', (as) => as.map((a) => a.getAttribute('href')));
      const internal = [...new Set(hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//')).map((h) => h.split('#')[0]).filter(Boolean))];
      expect(internal.length).toBeGreaterThan(5);
      const broken = [];
      for (const h of internal) {
        if (/\/tutor\?/.test(h)) { tutorLinks.set(h, slug); continue; } // verified by the deep-link test below
        const r = await request.get(h);
        if (r.status() !== 200 || !String(r.headers()['content-type']).includes('text/html')) broken.push(`${r.status()} ${h}`);
      }
      expect(broken).toEqual([]);
      const details = await page.locator('.faq details').count();
      if (details) expect(await page.locator('.faq summary').first().isVisible()).toBe(true);
    });
  }

  test('sitemap lists every landing page and robots.txt does not block them', async ({ request }) => {
    const sm = await (await request.get('/seo-sitemap.xml')).text();
    for (const slug of LANDING) expect(sm).toContain(`<loc>${PROD}/${slug}.html</loc>`);
    expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).not.toMatch(/Disallow:\s*\/(ai-|$)/);
  });

  test('AI Help deep links from the landing pages select the linked school type, grade and subject @nomobile', async ({ page }) => {
    test.setTimeout(480_000);
    // Collect all tutor links straight from the static HTML so this test does not depend on test order.
    const links = new Map();
    for (const slug of LANDING) {
      await page.goto(`/${slug}.html`);
      for (const h of await page.$$eval('main a[href*="/tutor?"]', (as) => as.map((a) => a.getAttribute('href')))) links.set(h, slug);
    }
    expect(links.size).toBeGreaterThan(30);
    const failures = [];
    for (const [href, slug] of links) {
      const u = new URL(href, 'http://x');
      await page.goto(href);
      const want = { grade: u.searchParams.get('grade'), subject: u.searchParams.get('subject'), schoolType: u.searchParams.get('schoolType') };
      try {
        await page.waitForFunction((w) => {
          const g = document.querySelector('#tutorGrade')?.value; const s = document.querySelector('#tutorSubject')?.value; const t = document.querySelector('#tutorSchoolType')?.value;
          return g === w.grade && (!w.subject || s === w.subject) && (!w.schoolType || t === w.schoolType);
        }, want, { timeout: 8000 });
      } catch {
        const got = await page.evaluate(() => ({ grade: document.querySelector('#tutorGrade')?.value, subject: document.querySelector('#tutorSubject')?.value, schoolType: document.querySelector('#tutorSchoolType')?.value }));
        failures.push(`${slug}: ${href} → got ${JSON.stringify(got)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});
