import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/* Homepage cinematic scroll: scroll-linked scenes on "/" only, never on app routes,
   never under reduced motion, always fully revealed at the end of the page. */
const URL = 'http://127.0.0.1:4173/';
const html = readFileSync('index.html', 'utf8');
assert.match(html, /\/assets\/cinema\/home-cinema\.\d{8}\.css/, 'homepage must load the versioned cinema stylesheet');
assert.match(html, /\/assets\/cinema\/home-cinema\.\d{8}\.js/, 'homepage must load the versioned cinema script');

const browser = await chromium.launch({ headless: true });
async function open(options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/_vercel/**', (route) => route.fulfill({ status: 200, body: '' }));
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => window.AITOOLSKIDS_HOME_CINEMA?.enabled === true, null, { timeout: 10000 });
  return { context, page, errors };
}

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1366, height: 850 }]) {
    const { context, page, errors } = await open({ viewport });
    assert.equal(await page.locator('[data-cine]:not([data-cine-done])').count(), 0, 'nothing may be hidden before the first scroll');
    const midway = await page.evaluate(async () => {
      const H = document.documentElement.scrollHeight - innerHeight;
      scrollTo(0, 40); await new Promise((r) => setTimeout(r, 300));
      scrollTo(0, Math.round(H * 0.3)); await new Promise((r) => setTimeout(r, 900));
      return window.AITOOLSKIDS_HOME_CINEMA.scenes.map((s) => s.progress);
    });
    assert.ok(midway.some((p) => p < 1), 'scenes below the reading position must still be waiting to be revealed');
    const end = await page.evaluate(async () => {
      scrollTo(0, document.documentElement.scrollHeight); await new Promise((r) => setTimeout(r, 1200));
      return { min: Math.min(...window.AITOOLSKIDS_HOME_CINEMA.scenes.map((s) => s.progress)), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    assert.equal(end.min, 1, 'every scene must be fully revealed at the end of the page');
    assert.ok(end.overflow <= 0, 'cinematic layers must not create horizontal scrolling');
    assert.deepEqual(errors, []);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.route('**/_vercel/**', (route) => route.fulfill({ status: 200, body: '' }));
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => scrollTo(0, 1500));
    await page.waitForTimeout(500);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('cine-on')), false, 'reduced motion must keep the static page');
    assert.equal(await page.locator('[data-cine]').count(), 0);
    await context.close();
  }

  {
    const { context, page } = await open();
    await page.evaluate(() => { history.pushState({}, '', '/primary/guardian/tools'); dispatchEvent(new PopStateEvent('popstate')); });
    await page.waitForFunction(() => document.getElementById('zoneSelectView').hidden, null, { timeout: 15000 });
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('cine-on')), false, 'app routes must not carry homepage motion');
    assert.equal(await page.locator('[data-cine]').count(), 0);
    await context.close();
  }
  console.log('home cinema smoke: OK');
} finally {
  await browser.close();
}
