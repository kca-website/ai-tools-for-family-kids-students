// v11 navigation smoke: one information architecture on every page type.
// Checks menu links, breadcrumbs, "you are here", the related-task bar with the
// shared level, Back/Forward, refresh/deep links, language switch, overflow at
// phone/tablet/desktop widths and axe (WCAG 2.2 AA) on representative pages.
import { chromium } from 'playwright';
import axe from 'axe-core';
import assert from 'node:assert/strict';
import { pickFinder } from './lib/home-finder.mjs';

const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const report = [];

const PAGES = [
  { path: '/study.html', key: 'study', crumbs: ['Αρχική', 'AI Μελέτη'], related: 'study' },
  { path: '/practice.html', key: 'practice', crumbs: ['Αρχική', 'Χάρτης Εξάσκησης'], related: 'practice' },
  { path: '/tools/ai-help.html', key: 'help', crumbs: ['Αρχική', 'AI Βοήθεια'], related: 'help' },
  { path: '/teacher-assistant.html', key: 'teacher', crumbs: ['Αρχική', 'Για εκπαιδευτικούς'] },
  { path: '/tools/', key: 'tools', crumbs: ['Αρχική', 'Κατάλογος AI εργαλείων'] },
  { path: '/tools/chatgpt.html', key: 'tools', crumbs: ['Αρχική', 'AI εργαλεία', /ChatGPT/] },
  { path: '/special-education.html', key: '', crumbs: ['Αρχική', 'Ειδική Εκπαίδευση'] },
  { path: '/special-education-parent-guide.html', key: '', crumbs: ['Αρχική', 'Ειδική Εκπαίδευση', /./] },
  { path: '/sign-language.html', key: '', crumbs: ['Αρχική', /Νοηματική/] },
  { path: '/xartis-ylis.html', key: 'study', crumbs: ['Αρχική', 'Χάρτης Ύλης 2026–27'] },
  { path: '/ai-gia-gymnasio.html', key: '', crumbs: ['Αρχική', 'Οδηγοί', /./] },
  { path: '/middle/guardian/quiz', key: 'practice', crumbs: ['Αρχική', 'Γυμνάσιο', 'Χάρτης Εξάσκησης'], related: 'practice', app: true },
  { path: '/high/student/tutor?schoolType=epal', key: 'help', crumbs: ['Αρχική', 'ΕΠΑΛ', 'AI Βοήθεια'], related: 'help', app: true }
];

function crumbMatches(actual, expected) {
  return expected instanceof RegExp ? expected.test(actual) : actual === expected;
}

try {
  // 1. Every link in the shared menu resolves locally (no broken IA entries).
  const probe = await browser.newPage();
  await probe.goto(BASE + '/study.html', { waitUntil: 'domcontentloaded' });
  await probe.waitForFunction(() => window.AITOOLSKIDS_IA?.version === 11);
  const hrefs = await probe.evaluate(() => [...new Set([...document.querySelectorAll('#chromeMenuPanel a[href], #chromeHeader .chrome-nav a[href]')].map((a) => a.getAttribute('href')))]);
  assert.ok(hrefs.length >= 18, `menu should expose the whole site, got ${hrefs.length}`);
  for (const href of hrefs) {
    const res = await probe.request.get(BASE + href);
    assert.equal(res.status(), 200, `menu link ${href} returned ${res.status()}`);
  }
  await probe.close();

  // 2. Page types: header, "you are here", breadcrumbs, related tasks, overflow.
  for (const width of [320, 360, 390, 430, 768, 1280]) {
    for (const spec of PAGES) {
      const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(BASE + spec.path, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => window.AITOOLSKIDS_IA?.version === 11, null, { timeout: 15000 });
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(spec.app ? 900 : 350);
      const bar = spec.app ? '#iaContext' : '#chromeContext';
      const crumbs = await page.locator(`${bar} .ia-crumbs li`).allInnerTexts();
      assert.equal(crumbs.length, spec.crumbs.length, `${width} ${spec.path}: breadcrumbs ${JSON.stringify(crumbs)}`);
      crumbs.forEach((text, i) => assert.ok(crumbMatches(text.trim(), spec.crumbs[i]), `${width} ${spec.path}: crumb ${i} = ${text}`));
      assert.equal(await page.locator(`${bar} .ia-crumbs a`).first().getAttribute('href'), '/', 'first crumb returns to the real homepage');
      const brand = spec.app ? 'header.site-header .site-title' : '#chromeHeader .chrome-brand';
      assert.equal(await page.locator(brand).getAttribute('href'), '/', 'brand link stays on the current deployment');
      if (spec.key) {
        const navSel = spec.app ? 'header.site-header .site-nav' : '#chromeHeader .chrome-nav';
        assert.equal(await page.locator(`${navSel} a[aria-current="page"]`).getAttribute('data-ia-key'), spec.key, `${spec.path}: primary nav marks the current section`);
      }
      if (spec.related) {
        assert.equal(await page.locator(`${bar} .ia-related a[aria-current="page"]`).getAttribute('data-ia-key'), spec.related, `${spec.path}: related-task bar marks the current task`);
        assert.equal(await page.locator(`${bar} .ia-related a`).count(), 4);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${width} ${spec.path}: horizontal overflow ${overflow}px`);
      const header = await page.evaluate((sel) => document.querySelector(sel)?.getBoundingClientRect().height || 0, spec.app ? 'header.site-header' : '#chromeHeader');
      assert.ok(header > 0 && header <= (spec.app ? 140 : 90), `${width} ${spec.path}: header height ${header}`);
      assert.deepEqual(errors, [], `${width} ${spec.path}: runtime errors`);
      if (width === 390 || width === 1280) {
        if (['/study.html', '/practice.html', '/tools/', '/teacher-assistant.html', '/middle/guardian/quiz'].includes(spec.path)) {
          await page.addScriptTag({ content: axe.source });
          const scan = await page.evaluate(async () => {
            const r = await axe.run({ include: [['#chromeHeader'], ['#chromeContext'], ['header.site-header'], ['#iaContext']].filter(([s]) => document.querySelector(s)), runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });
            return r.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }));
          });
          assert.deepEqual(scan, [], `${width} ${spec.path}: axe violations in navigation ${JSON.stringify(scan)}`);
        }
      }
      report.push({ width, path: spec.path, overflow });
      await page.close();
    }
  }

  // 3. Menu: open, focus, Escape returns focus, current page marked.
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(BASE + '/practice.html', { waitUntil: 'networkidle' });
    await page.click('#chromeMenuToggle');
    assert.equal(await page.locator('#chromeMenuPanel').isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement?.closest('#chromeMenuPanel') !== null), true, 'focus moves into the menu');
    assert.equal(await page.locator('#chromeMenuPanel a[aria-current="page"]').getAttribute('href'), '/practice.html');
    const fit = await page.evaluate(() => { const p = document.getElementById('chromeMenuPanel'); p.scrollTop = p.scrollHeight; const last = [...p.querySelectorAll('a')].pop().getBoundingClientRect(); return { last: last.bottom, vh: innerHeight }; });
    assert.ok(fit.last <= fit.vh + 1, `${width}: last menu item reachable ${JSON.stringify(fit)}`);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#chromeMenuPanel').isVisible(), false);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'chromeMenuToggle', 'Escape returns focus to the menu button');
    await page.close();
  }

  // 4. Journey: home → task → level → AI Study → related Practice (level kept) → Back/Forward → refresh.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await pickFinder(page, { need: 'study', zone: 'primary' });
  const scrollBefore = await page.evaluate(() => scrollY);
  await pickFinder(page, { zone: 'middle' });
  assert.ok(Math.abs((await page.evaluate(() => scrollY)) - scrollBefore) < 40, 'changing an option does not jump to the top');
  await page.click('#homeV9FinderCta');
  await page.waitForURL('**/study.html?zone=middle');
  await page.waitForSelector('#chromeContext .ia-related');
  assert.match(await page.locator('#chromeContext .ia-related__level').innerText(), /Γυμνάσιο/);
  assert.equal((await page.locator('#chromeContext .ia-related__title').textContent()).trim(), 'Συνέχισε στην ίδια βαθμίδα', 'the bar promises only what it carries: the level');
  await page.click('#chromeContext .ia-related a[data-ia-key="practice"]');
  await page.waitForURL('**/middle/guardian/quiz');
  await page.waitForSelector('#iaContext .ia-related a[aria-current="page"][data-ia-key="practice"]');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#iaContext .ia-crumbs');
  assert.match(await page.locator('#iaContext .ia-crumbs').innerText(), /Γυμνάσιο[\s\S]*Χάρτης Εξάσκησης/, 'refresh of an app route keeps its place');
  await page.goBack({ waitUntil: 'networkidle' });
  assert.equal(new URL(page.url()).pathname, '/study.html');
  await page.goBack({ waitUntil: 'networkidle' });
  assert.equal(new URL(page.url()).pathname, '/', 'Back returns to the homepage, never to another deployment');
  await page.waitForSelector('#homeV9FinderCta');
  assert.equal(await page.locator('#homeV9Finder [data-finder-zone="middle"]').getAttribute('aria-pressed'), 'true', 'homepage remembers the level in this tab');
  await page.goForward({ waitUntil: 'networkidle' });
  assert.equal(new URL(page.url()).pathname, '/study.html');
  // Change level from the related bar.
  await page.click('#chromeContext [data-ia-clear-level]');
  await page.waitForURL((u) => u.pathname === '/');
  await page.waitForSelector('#homeV9Finder [data-finder-need]');
  assert.equal(await page.locator('#homeV9Finder [data-finder-zone][aria-pressed="true"]').count(), 0, '"Change level" clears the remembered level');

  // 5. English: inner page navigation switches language and keeps working.
  await page.goto(BASE + '/study.html', { waitUntil: 'networkidle' });
  await page.locator('#chromeActions #enBtn').click();
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await page.waitForFunction(() => /AI Study/.test(document.querySelector('#chromeContext .ia-crumbs')?.textContent || ''));
  assert.match(await page.locator('#chromeHeader .chrome-nav').innerText(), /AI tools[\s\S]*Study[\s\S]*Practice[\s\S]*Homework help/);
  await page.click('#chromeMenuToggle');
  assert.match(await page.locator('#chromeMenuPanel').innerText(), /What do you want to do\?[\s\S]*Pathways for/i);
  await page.close();

  console.log(`Navigation v11 smoke passed: ${hrefs.length} menu links, ${report.length} page/width checks.`);
} finally {
  await browser.close();
}
