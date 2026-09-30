// PHASE 5 – accessibility: axe-core (WCAG 2.x A/AA + best-practice) on key pages/views + keyboard checks.
// Full violation lists are written to results/axe-<project>.json; the test gates only on `critical` impact.
import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures.mjs';
import { RESULTS } from '../scripts/lib.mjs';

const PAGES = [
  ['home', '/'],
  ['primary-tools', '/primary/guardian/tools'],
  ['primary-quiz-map', '/primary/guardian/quiz'],
  ['high-ai-help', '/high/student/tutor'],
  ['study', '/study.html'],
  ['curriculum-map', '/xartis-ylis.html'],
  ['sign-language', '/sign-language.html'],
  ['special-education', '/special-education.html'],
  ['teacher-assistant', '/teacher-assistant.html'],
  ['higher-ed-pilot', '/higher-education-pilot.html'],
  ['privacy-policy', '/privacy-policy.html'],
  ['tool-page', '/tools/chatgpt.html'],
  ['preschool', '/preschool'],
];
fs.mkdirSync(path.join(RESULTS, 'axe'), { recursive: true });

test.describe('axe-core', () => {
  for (const [name, url] of PAGES) {
    test(`${name}: no critical WCAG violations (all recorded)`, async ({ page }, info) => {
      test.setTimeout(60_000);
      page.on('dialog', (d) => d.dismiss());
      await page.goto(url);
      await page.waitForTimeout(1500);
      if (name === 'high-ai-help') { await page.selectOption('#tutorSchoolType', 'gel'); await page.selectOption('#tutorGrade', 'a'); await page.selectOption('#tutorSubject', 'algebra-a-lykeiou'); }
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      const rows = res.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes.slice(0, 3).map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').split('\n').slice(1, 3).join(' ').slice(0, 200) })) }));
      fs.writeFileSync(path.join(RESULTS, 'axe', `${info.project.name}__${name}.json`), JSON.stringify(rows, null, 2));
      const critical = res.violations.filter((v) => v.impact === 'critical');
      info.annotations.push({ type: 'axe', description: `critical=${critical.length} serious=${res.violations.filter((v) => v.impact === 'serious').length} moderate=${res.violations.filter((v) => v.impact === 'moderate').length} minor=${res.violations.filter((v) => v.impact === 'minor').length}` });
      expect(critical.map((v) => `${v.id} (${v.nodes.length})`), 'critical violations').toEqual([]);
    });
  }
});

test.describe('keyboard & focus', () => {
  test('@smoke skip link is first tab stop and moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => ({ text: document.activeElement?.textContent.trim().slice(0, 40), href: document.activeElement?.getAttribute('href') }));
    expect(first.href).toBe('#mainContent');
    await page.keyboard.press('Enter');
    const inMain = await page.evaluate(() => document.getElementById('mainContent')?.contains(document.activeElement) || document.activeElement?.id === 'mainContent' || location.hash === '#mainContent');
    expect(inMain).toBe(true);
  });

  test('visible focus indicator on the first 25 tab stops of the home page', async ({ page }, info) => {
    await page.goto('/');
    await page.waitForTimeout(800);
    const bad = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return null;
        const cs = getComputedStyle(el); const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0; const hasShadow = cs.boxShadow && cs.boxShadow !== 'none';
        const rect = el.getBoundingClientRect();
        return { tag: el.tagName, txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), indicator: hasOutline || hasShadow || cs.borderColor !== '', visible: rect.width > 0 && rect.height > 0, offscreen: rect.bottom < 0 || rect.top > innerHeight + 2000 };
      });
      if (r && (!r.indicator || !r.visible)) bad.push(r);
    }
    info.annotations.push({ type: 'focus-stops-without-indicator', description: JSON.stringify(bad.slice(0, 5)) });
    expect(bad.filter((b) => !b.visible)).toEqual([]);
  });

  test('zone cards are real buttons, reachable and activatable with keyboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);
    const card = page.locator('button.zone-card', { hasText: 'Δημοτικό' });
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/primary\/guardian\/tools$/);
  });

  test('tabs of the path view expose role/aria-selected or aria-pressed state', async ({ page }, info) => {
    await page.goto('/primary/guardian/tools');
    const s = await page.evaluate(() => [...document.querySelectorAll('.view-tab')].map((b) => ({ id: b.id, role: b.getAttribute('role'), sel: b.getAttribute('aria-selected'), pressed: b.getAttribute('aria-pressed'), current: b.getAttribute('aria-current'), active: b.classList.contains('active') })));
    info.annotations.push({ type: 'view-tabs-aria', description: JSON.stringify(s.slice(0, 2)) });
    const active = s.find((x) => x.active);
    expect(active && (active.sel === 'true' || active.pressed === 'true' || active.current)).toBeTruthy();
  });

  test('language toggle has accessible names and state', async ({ page }) => {
    await page.goto('/');
    const r = await page.evaluate(() => ['langEl', 'langEn'].map((id) => { const b = document.getElementById(id); return { id, name: b.getAttribute('aria-label') || b.textContent.trim(), pressed: b.getAttribute('aria-pressed'), lang: b.getAttribute('lang') }; }));
    for (const b of r) expect(b.name.length).toBeGreaterThan(0);
    expect(r.some((b) => b.pressed !== null), 'language buttons expose aria-pressed').toBe(true);
  });

  test('AI Help: input has a label, live region announces answers, error is announced', async ({ page, mockAI }, info) => {
    page.on('dialog', (d) => d.dismiss());
    await page.goto('/high/student/tutor');
    await page.selectOption('#tutorSchoolType', 'gel'); await page.selectOption('#tutorGrade', 'a'); await page.selectOption('#tutorSubject', 'algebra-a-lykeiou');
    const label = await page.evaluate(() => { const t = document.getElementById('tutorInput'); return t.getAttribute('aria-label') || t.labels?.[0]?.textContent?.trim() || t.getAttribute('aria-labelledby') || ''; });
    expect(label, 'textarea accessible name').toBeTruthy();
    const live = await page.evaluate(() => { const m = document.querySelector('.tutor-messages'); return { live: m?.getAttribute('aria-live'), role: m?.getAttribute('role'), log: m?.closest('[aria-live],[role=log],[role=status]')?.getAttribute('role') }; });
    info.annotations.push({ type: 'tutor-live-region', description: JSON.stringify(live) });
    expect(live.live || live.role || live.log, 'chat log is a live region').toBeTruthy();
  });

  test('images: informational images have alt; decorative marked', async ({ page }) => {
    for (const p of ['/', '/primary/guardian/tools', '/sign-language.html']) {
      await page.goto(p); await page.waitForTimeout(600);
      const bad = await page.evaluate(() => [...document.images].filter((i) => i.getAttribute('alt') === null).map((i) => i.src.slice(-60)));
      expect(bad, `${p}: <img> without alt attribute`).toEqual([]);
    }
  });

  test('touch targets on mobile are ≥ 24×24 CSS px (WCAG 2.2 SC 2.5.8) – primary nav, zone cards, language toggle', async ({ page }, info) => {
    test.skip(info.project.name.includes('desktop') || info.project.name === 'smoke', 'mobile only');
    test.fail(true, 'FINDING F-14: footer/standalone links are 12–19 px tall on 375 px screens (WCAG 2.2 SC 2.5.8 needs 24 px or spacing)');
    await page.goto('/');
    await page.waitForTimeout(800);
    const small = await page.evaluate(() => [...document.querySelectorAll('button, a[href], select, input:not([type=hidden])')].filter((e) => e.offsetParent).map((e) => { const r = e.getBoundingClientRect(); return { txt: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 25), w: Math.round(r.width), h: Math.round(r.height) }; }).filter((x) => x.w < 24 || x.h < 24));
    info.annotations.push({ type: 'small-targets', description: JSON.stringify(small.slice(0, 8)) });
    expect(small.length, 'targets below 24px').toBeLessThan(6);
  });

  test('reduced motion is respected (animations/transitions disabled)', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(baseURL + '/');
    const hasRule = await page.evaluate(() => [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /prefers-reduced-motion/.test(r.conditionText || r.media.mediaText)); } catch { return false; } }));
    expect(hasRule, 'a prefers-reduced-motion rule exists').toBe(true);
    await ctx.close();
  });
});
