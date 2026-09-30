// First-paint regression: the legacy static home (4 zone cards + old hero CTA) must never be visible before the new home is built.
// Samples every animation frame from document start (addInitScript) and checks the visible state of #zoneSelectView.
import { test, expect } from './fixtures.mjs';

const sampler = () => {
  window.__frames = [];
  const t0 = performance.now();
  const visible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };
  const snap = () => window.__frames.push({
    t: Math.round(performance.now() - t0),
    ready: document.documentElement.classList.contains('navigator-home-ready'),
    zoneVisible: visible(document.getElementById('zoneSelectView')),
    legacyHeroCta: visible(document.querySelector('.hero__quiz-cta')),
    zoneCards: [...document.querySelectorAll('button.zone-card')].filter(visible).length,
  });
  const loop = () => { snap(); if (performance.now() - t0 < 4000) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
};

test.describe('home first paint', () => {
  for (const [name, throttle] of [['normal', 1], ['CPU x4 (slow phone)', 4]]) {
    test(`@smoke the legacy home never flashes before the new home is ready (${name})`, async ({ page, context }) => {
      await page.addInitScript(sampler);
      if (throttle > 1) { const cdp = await context.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle }); }
      await page.goto('/');
      await expect(page.locator('html.navigator-home-ready')).toHaveCount(1, { timeout: 15_000 });
      await page.waitForTimeout(500);
      const frames = await page.evaluate(() => window.__frames);
      expect(frames.length).toBeGreaterThan(5);
      const early = frames.filter((f) => f.zoneVisible && !f.ready);
      expect(early, 'frames where the home was visible before navigator-home-ready (legacy home flash)').toEqual([]);
      expect(frames.filter((f) => f.legacyHeroCta), 'legacy hero CTA visible').toEqual([]);
      expect(frames.at(-1).zoneVisible).toBe(true);
      expect(frames.at(-1).zoneCards).toBeGreaterThanOrEqual(4);
    });
  }

  test('non-home paths are never hidden by the boot guard', async ({ page }) => {
    await page.goto('/primary/guardian/tools');
    expect(await page.evaluate(() => document.documentElement.classList.contains('navigator-home-booting'))).toBe(false);
    await expect(page.locator('#pathView')).toBeVisible();
  });

  test('the boot guard fails open even if the home script never runs', async ({ page }) => {
    await page.route('**/navigator-home.js', (r) => r.abort());
    await page.route('**/pwa.js', (r) => r.abort());
    await page.goto('/');
    await expect(page.locator('#zoneSelectView')).toBeVisible({ timeout: 8_000 });
  });
});
