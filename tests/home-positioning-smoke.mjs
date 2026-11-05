import { pickFinder } from './lib/home-finder.mjs';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const URL = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });

const homepageSource = readFileSync('index.html', 'utf8');
assert.doesNotMatch(homepageSource, /<html[^>]*(navigator-home-booting|navigator-route-booting)/, 'boot classes must be added at runtime, never baked into the static html element');
assert.match(homepageSource, /navigatorHomeFirstPaintGuard/, 'homepage must ship an inline first-paint guard');
assert.match(homepageSource, /navigator-route-booting/, 'rewritten app routes must ship a first-paint guard against legacy-shell flashes');
assert.match(homepageSource, /routeBootSkeleton/, 'rewritten app routes must have a neutral boot cover');
assert.match(homepageSource, /navigator-home\.css[^>]*data-navigator-home="1"/, 'navigator CSS must load from the original head');
assert.match(homepageSource, /id="homeV8Eng"[\s\S]*?167 σχολικές έννοιες[\s\S]*?Δες τις 167 έννοιες/, 'raw homepage HTML must expose the canonical GSL count to crawlers before JavaScript runs');
assert.doesNotMatch(homepageSource, /153 σχολικές έννοιες|Δες τις 153 έννοιες/, 'raw homepage HTML must not expose the stale GSL count');


try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.stack || String(error)));
  page.on('response', response => {if(response.status()===200 && response.request().resourceType()==='script' && (response.headers()['content-type']||'').includes('text/html')) errors.push('Script received HTML: '+response.url());});

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#homeV8Shell', { timeout: 10000 });
  await page.waitForFunction(() => document.documentElement.classList.contains('navigator-home-ready'));
  await page.waitForLoadState('networkidle');

  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('navigator-home-booting')), false);
  assert.equal((await page.locator('.hero__title').innerText()).trim(), 'Μαθαίνω Έξυπνα με AI');
  const subtitle=(await page.locator('.hero__subtitle').innerText()).replace(/\s+/g,' ').trim();
  for(const concept of ['δωρεάν','ai','μαθητ','γον','εκπαιδευτικ'])assert.ok(subtitle.toLowerCase().includes(concept), 'Hero must communicate free AI learning and its audiences: '+concept);
  assert.equal((await page.locator('.hero__badges .badge--free').innerText()).trim(), 'Δωρεάν', 'Free positioning must stay above the fold');
  const identity=(await page.locator('.hero__badges').innerText()).replace(/\s+/g,' ');
  for(const word of ['Δωρεάν','Ανεξάρτητο','Ελληνικά / English','Χωρίς cookies'])assert.ok(identity.includes(word),'Discreet identity line must include: '+word);

  // v11: one clear question with six task tiles; the legacy blocks stay hidden.
  assert.equal((await page.locator('#homeV8FinderTitle').innerText()).trim(), 'Τι θέλεις να κάνεις σήμερα;');
  const needs = await page.locator('#homeV9Finder [data-finder-need]').evaluateAll((els) => els.map((el) => el.dataset.finderNeed));
  assert.deepEqual(needs, ['study', 'practice', 'stuck', 'organize', 'teacher', 'tools'], 'Homepage must offer the six core tasks');
  assert.equal(await page.locator('#homeV9FinderCta').count(), 0, 'No destination is shown before a task is chosen (progressive disclosure)');
  for (const legacy of ['#zoneGrid', '#homeV9Principle', '#homeVideoNew', '.hero__quiz-cta-wrap', '.hero__ai-help'])
    assert.equal(await page.locator(`#zoneSelectView ${legacy}, ${legacy}`).first().isVisible().catch(() => false), false, `${legacy} must stay hidden`);
  assert.equal(await page.locator('#homeV8Needs').count(), 0);
  assert.equal(await page.locator('#homeAiPathsPromo:visible').count(), 0, 'AI Paths promo now lives in "Learn another way"');

  // Routing contract (unchanged from the previous finder whenever a level is chosen).
  await pickFinder(page, { need: 'teacher' });
  assert.equal(await page.locator('#homeV9Finder [data-finder-zone]').count(), 0, 'Educators are not asked for a school level');
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/teacher-assistant.html');
  assert.equal(await page.locator('#homeV11Step a[href="/teacher-assistant.html?task=worksheet#builder"]').count(), 1, 'Educator shortcuts stay one click away');
  await pickFinder(page, { need: 'study' });
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/study.html', 'Study works without a level');
  assert.match(await page.locator('#homeV11Step').innerText(), /επίσημο σχολικό βιβλίο[\s\S]*Η κάλυψη σχολικών βιβλίων είναι επιλεκτική./, 'AI Study must keep the official-textbook coverage caveat');
  await pickFinder(page, { zone: 'high' });
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/study.html?zone=high');
  await pickFinder(page, { need: 'practice' });
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/high/guardian/quiz', 'High school practice must open the GEL Practice Map');
  assert.equal(await page.locator('#homeV9Finder [data-epal-practice-map]').count(), 1, 'High school practice must also offer the EPAL Practice Map');
  await pickFinder(page, { zone: 'special' });
  assert.equal(await page.locator('#homeV9FinderCta[data-special-education-diagnostic]').count(), 1, 'Special Education practice must open the diagnostic');
  await pickFinder(page, { need: 'tools', zone: 'middle', role: 'guardian' });
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/middle/guardian/tools');
  await pickFinder(page, { zone: '' });
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/tools/', 'Tools work without a level');
  await pickFinder(page, { need: 'organize' });
  assert.equal(await page.locator('#homeV9Finder [data-finder-zone]').count(), 0, 'Study planning needs no level');
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/organosi-meletis-ai.html');

  // Pathways and discovery: every audience and feature stays reachable.
  const paths = await page.locator('#homeV11Paths a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
  for (const href of ['/ai-gia-goneis.html', '/preschool', '/high/student/tutor?schoolType=epal', '/special-education.html', '/sign-language.html', '/higher-education-pilot.html'])
    assert.ok(paths.includes(href), 'Pathway missing: ' + href);
  assert.equal(await page.locator('#homeV9CurriculumTile').getAttribute('href'), '/xartis-ylis.html');
  assert.equal(await page.locator('#homeV9More .home-v9-more__grid > *').count(), 5, 'Discovery includes curriculum, history characters, Play & Learn, AI Paths and all tools');
  for (const href of ['/history-characters.html', '/play/', '/ai-scenarios.html', '/tools/'])
    assert.equal(await page.locator(`#homeV9More a[href="${href}"]`).count(), 1, 'Discovery link missing: ' + href);

  await page.click('#siteMenuToggle');
  for (const href of ['/', '/study.html', '/practice.html', '/tools/ai-help.html', '/teacher-assistant.html', '/special-education.html', '/sign-language.html', '/xartis-ylis.html', '/higher-education-pilot.html'])
    assert.equal(await page.locator(`#siteMenuPanel a[href="${href}"]`).count() >= 1, true, 'Menu must link ' + href);
  assert.equal(await page.locator('#siteMenuPanel a[href="/"][aria-current="page"]').count(), 1, 'Menu marks the homepage as current');
  const menuFit = await page.evaluate(() => {
    const panel = document.getElementById('siteMenuPanel');
    panel.scrollTop = panel.scrollHeight;
    const last = [...panel.querySelectorAll('a[href]')].pop().getBoundingClientRect();
    return { panelBottom: panel.getBoundingClientRect().bottom, lastBottom: last.bottom, viewport: window.innerHeight };
  });
  assert.ok(menuFit.panelBottom <= menuFit.viewport + 1, `Mobile menu must fit the visible viewport: ${JSON.stringify(menuFit)}`);
  assert.ok(menuFit.lastBottom <= menuFit.viewport + 1, `Last mobile menu entry must be reachable: ${JSON.stringify(menuFit)}`);
  await page.click('#siteMenuToggle');

  await page.waitForSelector('#homeGlobalSearchInput', { state: 'visible', timeout: 10000 });
  const globalSearch = page.locator('#homeGlobalSearchInput');
  await globalSearch.fill('κλάσματα');
  await page.waitForSelector('#homeGlobalSearchResults .home-global-search__item', { timeout: 10000 });
  assert.match(await page.locator('#homeGlobalSearchResults').innerText(), /κλάσμα/i, 'global search should find curriculum/learning results');
  await globalSearch.fill('ηφαίστειο');
  await page.waitForFunction(() => [...document.querySelectorAll('#homeGlobalSearchResults a')].some(a => /sign-language\.html\?q=/.test(a.getAttribute('href') || '')));
  assert.ok(await page.locator('#homeGlobalSearchResults a[href*="/sign-language.html?q="]').count(), 'global search should deep-link GSL concepts');
  await globalSearch.fill('Πανεπιστήμιο Πατρών');
  await page.waitForFunction(() => [...document.querySelectorAll('#homeGlobalSearchResults a')].some(a => /higher-education-pilot\.html/.test(a.getAttribute('href') || '')), null, { timeout: 10000 });
  assert.match(await page.locator('#homeGlobalSearchResults').innerText(), /Πανεπιστήμιο Πατρών/i, 'global search should lazy-load university results');
  await globalSearch.fill('');

  assert.equal(await page.evaluate(() => window.AITOOLSKIDS_SITE_META?.signLanguageConceptCount), 167, 'canonical GSL concept count must be 167');
  assert.match(await page.locator('#homeV8Eng').innerText(), /167/, 'Greek homepage GSL block must show 167 concepts');
  assert.doesNotMatch(await page.locator('#homeV8Eng').innerText(), /153/, 'Greek homepage GSL block must not show stale 153 count');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `Homepage positioning introduces horizontal overflow on mobile: ${overflow}px`);

  await page.click('#langEn');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  await page.waitForFunction(() => /What do you want to do today/.test(document.querySelector('#homeV9Finder')?.textContent || ''));
  const englishSubtitle = (await page.locator('.hero__subtitle').innerText()).toLowerCase();
  for (const concept of ['free', 'ai', 'student', 'parent', 'educator']) assert.ok(englishSubtitle.includes(concept), 'English hero must communicate its purpose and audiences: '+concept);
  await pickFinder(page, { need: 'teacher' });
  assert.match(await page.locator('#homeV9FinderCta').innerText(), /Open the educator tools/);
  assert.match(await page.locator('#homeV11Paths').innerText(), /Special Education/);
  assert.match(await page.locator('#homeV9CurriculumTile').innerText(), /Find the unit you are studying/);
  assert.match(await page.locator('#homeV8Eng').innerText(), /167/, 'English homepage GSL block must show 167 concepts');
  assert.doesNotMatch(await page.locator('#homeV8Eng').innerText(), /153/, 'English homepage GSL block must not show stale 153 count');

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktop.waitForSelector('#homeV8Shell', { timeout: 10000 });
  await desktop.waitForFunction(() => document.documentElement.classList.contains('navigator-home-ready'));
  const heroWidth = await desktop.locator('#zoneSelectView .hero').evaluate((el) => el.getBoundingClientRect().width);
  assert.ok(heroWidth >= 1000 && heroWidth <= 1162, `desktop: homepage hero should use the wide layout, got ${heroWidth}px`);
  assert.equal(await desktop.locator('#homeV9Finder [data-finder-need]').count(), 6, 'desktop: six tasks');
  assert.equal(await desktop.locator('header.site-header .site-nav a[data-ia-key]').count(), 5, 'desktop: task-first primary nav');
  assert.equal(await desktop.locator('#homeV9Trust').count(), 0, 'desktop: audit/tool-count strip belongs only in the footer');
  assert.equal(await desktop.locator('#siteHeaderSearch #homeGlobalSearchInput').count(), 1, 'desktop: site search should sit in the header');
  await desktop.close();

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Homepage v8 positioning smoke passed.');
} finally {
  await browser.close();
}

