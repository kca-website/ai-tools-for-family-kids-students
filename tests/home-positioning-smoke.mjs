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

async function finderPick(page, kind, value) {
  await page.click(`#homeV9Finder [data-finder-${kind}="${value}"]`);
}

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
  for(const concept of ['δωρεάν','AI','μαθητ','γον','εκπαιδευτικ'])assert.ok(subtitle.includes(concept), 'Hero must communicate free AI learning and its audiences: '+concept);
  assert.equal((await page.locator('.hero__badges .badge--free').innerText()).trim(), 'Δωρεάν για όλους', 'Free-for-everyone positioning must stay above the fold');
  assert.ok(await page.locator('#heroGslBadge').count());
  assert.equal(await page.locator('.hero__badges + .hero__quiz-cta-wrap').count(), 1, 'Quiz picker belongs directly below the hero badges');
  assert.equal(await page.locator('#heroQuizCtaBtn').isVisible(), true);
  await page.click('#heroQuizCtaBtn');
  assert.equal(await page.locator('#heroQuizPicker').isVisible(), true);
  assert.ok(await page.locator('#heroQuizPickerGrid button').count() >= 3);
  await page.click('#heroQuizCtaBtn');

  // v10: "who are you" finder is the single entry to school levels; the zone grid stays only as a hidden fallback.
  const roles = await page.locator('#homeV9Finder [data-finder-role]').evaluateAll((els) => els.map((el) => el.dataset.finderRole));
  assert.deepEqual(roles, ['guardian', 'student', 'teacher', 'university'], 'Finder must offer parent, student, educator and university student');
  assert.equal(await page.locator('#zoneGrid').isVisible(), false, 'Zone grid must not be shown on the v10 homepage');
  assert.equal(await page.locator('#homeV8Needs').count(), 0, '"What do you want to do with AI" block must not be on the homepage');
  assert.equal(await page.locator('#homeV8HelpersMount .home-v8-map').count(), 0, 'Practice Map card moved into the finder');
  assert.equal(await page.locator('#homeV9Principle').isVisible(), false, 'Principle quote duplicates the title and is hidden');
  assert.equal(await page.locator('#homeVideoNew').isVisible(), false, 'Video promo lives in the educator tools');

  await finderPick(page, 'role', 'teacher');
  assert.equal(await page.locator('#homeV9Finder .home-v9-finder__step').count(), 1, 'Educators skip the school-level steps');
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/teacher-assistant.html', 'Educator role must open the educator tools');
  await finderPick(page, 'role', 'university');
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/higher-education-pilot.html', 'University role must open the university pilot');
  await finderPick(page, 'role', 'student');
  assert.equal(await page.locator('#homeV9Finder [data-finder-zone="preschool"]').count(), 0, 'Preschool is adult-led and not offered to students');
  await finderPick(page, 'zone', 'high');
  await finderPick(page, 'need', 'practice');
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/high/guardian/quiz', 'High school practice must open the GEL Practice Map');
  assert.equal(await page.locator('#homeV9Finder [data-epal-practice-map]').count(), 1, 'High school practice must also offer the EPAL Practice Map');
  await finderPick(page, 'zone', 'special');
  assert.equal(await page.locator('#homeV9FinderCta[data-special-education-diagnostic]').count(), 1, 'Special Education practice must open the diagnostic');
  await finderPick(page, 'role', 'guardian');
  await finderPick(page, 'zone', 'middle');
  await finderPick(page, 'need', 'tools');
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'), '/middle/guardian/tools');

  // Three ways to start: AI Help, AI Study, Educators. The Curriculum Map stands on its own.
  const ways = page.locator('#homeV8HelpersMount .home-v9-ways > section');
  assert.equal(await ways.count(), 3);
  assert.equal(await page.locator('#homeV8HelpersMount .home-v8-ai').count(), 1);
  assert.equal(await page.locator('#homeV9Study a[href="/study.html"]').count(), 1, 'Homepage must expose AI Study');
  assert.match(await page.locator('#homeV9Study').innerText(), /επίσημο σχολικό βιβλίο[\s\S]*Η κάλυψη σχολικών βιβλίων είναι επιλεκτική./, 'AI Study must keep the official-textbook coverage caveat');
  assert.equal(await page.locator('#homeV9Teacher a[href="/teacher-assistant.html"]').isVisible(), true, 'Educator card must be visible on mobile');
  assert.equal(await page.locator('#homeV8HelpersMount a[href="/xartis-ylis.html"]').count(), 0, 'Curriculum Map is not one of the three ways');
  assert.equal(await page.locator('#homeCurriculumStrip').count(), 0, 'Curriculum Map uses the discovery tile rather than a duplicate strip');
  assert.equal(await page.locator('#homeV9CurriculumTile a').getAttribute('href'), '/xartis-ylis.html');
  assert.equal(await page.locator('#homeV9More .home-v9-more__grid > *').count(), 4, 'Discovery includes all tools, curriculum, history characters and GSL');

  await page.click('#siteMenuToggle');
  assert.equal(await page.locator('#siteMenuPanel .site-menu-panel__teacher').isVisible(), true, 'Educators must be the first, visible menu entry on mobile');
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
  await page.waitForFunction(() => /University student/.test(document.querySelector('#homeV9Finder')?.textContent || ''));
  assert.equal((await page.locator('.hero__subtitle').innerText()).replace(/\s+/g, ' ').trim(), 'See in 2 minutes where the student or the parent could use a bit more practice, and which free AI tool fits exactly there. For parents, students 6 to 18, and educators.');
  await finderPick(page, 'role', 'teacher');
  assert.match(await page.locator('#homeV9FinderCta').innerText(), /Open the educator tools/);
  assert.match(await page.locator('#homeV9Teacher').innerText(), /For educators/);
  assert.match(await page.locator('#homeV9CurriculumTile').innerText(), /Find the unit you are studying/);
  assert.match(await page.locator('#homeV8Eng').innerText(), /167/, 'English homepage GSL block must show 167 concepts');
  assert.doesNotMatch(await page.locator('#homeV8Eng').innerText(), /153/, 'English homepage GSL block must not show stale 153 count');

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktop.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktop.waitForSelector('#homeV8Shell', { timeout: 10000 });
  await desktop.waitForFunction(() => document.documentElement.classList.contains('navigator-home-ready'));
  const heroWidth = await desktop.locator('#zoneSelectView .hero').evaluate((el) => el.getBoundingClientRect().width);
  assert.ok(heroWidth >= 1000 && heroWidth <= 1042, `desktop: homepage hero should use the wider ~1040px layout, got ${heroWidth}px`);
  assert.equal(await desktop.locator('#homeV8HelpersMount .home-v9-ways > section').count(), 3, 'desktop: three ways to start');
  assert.equal(await desktop.locator('#homeV9Trust').count(), 0, 'desktop: audit/tool-count strip belongs only in the footer');
  assert.equal(await desktop.locator('#siteHeaderSearch #homeGlobalSearchInput').count(), 1, 'desktop: site search should sit in the header');
  assert.equal(await desktop.locator('#homeV8HelpersMount .home-v8-ai').count(), 1);
  await desktop.close();

  assert.deepEqual(errors, [], `Homepage browser errors:\n${errors.join('\n')}`);
  console.log('Homepage v8 positioning smoke passed.');
} finally {
  await browser.close();
}

