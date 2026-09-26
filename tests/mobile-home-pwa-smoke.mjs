import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });

  await page.route('**/_vercel/insights/script.js', (route) => route.fulfill({status:200,contentType:'application/javascript',body:''}));

  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      if (query === '(display-mode: standalone)') {
        return {matches:true,media:query,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false;}};
      }
      return nativeMatchMedia(query);
    };
  });

  await page.goto(LOCAL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#homeV8Shell', { state: 'visible', timeout: 10000 });
  await page.waitForFunction(() => document.body.classList.contains('pwa-standalone'), null, { timeout: 10000 });
  await page.waitForSelector('#zoneGrid #specialSchoolZoneCard', {state:'visible',timeout:10000});
  await page.waitForSelector('#homeV8HelpersMount .home-v8-map', {state:'visible',timeout:10000});
  await page.waitForSelector('#homeV8HelpersMount .home-v8-ai', {state:'visible',timeout:10000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_SPECIAL_EDUCATION_ENTRY_ANALYTICS?.version===2,null,{timeout:10000});

  assert.equal((await page.textContent('#siteTitleText'))?.trim(), 'AI Tools 4 Kids', 'compact mobile site title was not restored');
  assert.equal(await page.locator('#pwaMobileLauncher').count(), 1, 'Legacy PWA launcher should still be created for compatibility');
  assert.equal(await page.locator('#pwaMobileLauncher').isVisible(), false, 'Legacy PWA launcher must stay hidden under homepage v8');
  assert.equal(await page.locator('#pwaMobileLauncher').evaluate((el)=>el.classList.contains('home-v8-legacy')), true, 'Legacy PWA launcher must be explicitly suppressed');

  assert.equal(await page.locator('#homeV8HelpersMount .home-v8-map a[href="/primary/guardian/quiz"]').count(), 1, 'Current Practice Map entry is missing');
  assert.equal(await page.locator('#homeV8HelpersMount .home-v8-ai a[href="/high/student/tutor"]').count(), 1, 'Current AI Help high-school entry is missing');
  assert.equal(await page.locator('#homeV8HelpersMount [data-special-education-diagnostic]').count(), 1, 'Current Special Education diagnostic entry is missing');
  assert.equal(await page.locator('#zoneSelectView .hero__quiz-cta-wrap').isVisible(), false, 'Legacy diagnostic entry should remain suppressed on homepage v8');
  assert.equal(await page.locator('#zoneSelectView .hero__ai-help').isVisible(), false, 'Legacy AI Help entry should remain suppressed on homepage v8');

  const specialText=(await page.locator('#specialSchoolZoneCard').textContent()) || '';
  assert.match(specialText,/Ειδικά σχολεία/,'integrated Special Education school card needs a clear label');
  assert.match(specialText,/Ειδικό Γυμνάσιο.*Ειδικό Λύκειο.*ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./s,'integrated Special Education card must name all three school types');
  assert.ok(specialText.includes('🏫'),'Special Education school card must use the neutral school icon');
  assert.ok(!specialText.includes('♿'),'wheelchair icon must not be used as the Special Education symbol');
  assert.match(await page.locator('#specialSchoolZoneCard').getAttribute('href'),/^\/special-education\.html$/,'Special Education school-grid link must use the production route');
  assert.equal(await page.locator('#specialEducationHomeFeature:visible').count(),0,'standalone Special Education bottom banner must not be visible');

  const specialMapText=(await page.locator('#homeV8HelpersMount [data-special-education-diagnostic]').innerText()).trim();
  assert.match(specialMapText,/Ειδικά σχολεία/,'Current Practice Map must retain a Special Education entry');
  const specialAiText=(await page.locator('#homeV8HelpersMount .home-v8-ai a').last().innerText()).trim();
  assert.match(specialAiText,/Ειδικά σχολεία/,'Current AI Help area must retain a Special Education entry');

  const analytics=await page.evaluate(()=>{
    const calls=[];
    window.va=(...args)=>calls.push(args);
    const api=window.AITOOLSKIDS_SPECIAL_EDUCATION_ENTRY_ANALYTICS;
    const accepted=api.sources.map((source)=>api.track(source));
    const rejected=api.track('other');
    return {eventName:api.eventName,sources:api.sources,accepted,rejected,calls};
  });
  assert.equal(analytics.eventName,'Special Education Entry');
  assert.deepEqual(analytics.sources,['school_grid','ai_help','diagnostic']);
  assert.deepEqual(analytics.accepted,[true,true,true]);
  assert.equal(analytics.rejected,false,'analytics must reject arbitrary source values');
  assert.deepEqual(analytics.calls.map((call)=>call[0]),['event','event','event']);
  assert.deepEqual(analytics.calls.map((call)=>call[1]?.data?.source),['school_grid','ai_help','diagnostic']);
  assert.ok(analytics.calls.every((call)=>Object.keys(call[1]?.data||{}).length===1),'analytics payload must contain only the source property');

  const globalSpecial=await page.evaluate(()=>({
    catalog:!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,
    heavy:[...document.scripts].filter(s=>/special-education-(curriculum|learning|quiz|special-gymnasium|special-lyceum|tutor-context|tutor-catalog)/.test(s.src)).map(s=>s.src)
  }));
  assert.equal(globalSpecial.catalog,false,'Special Education catalog must not preload on homepage');
  assert.deepEqual(globalSpecial.heavy,[],'Special Education datasets must not load on homepage');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `mobile homepage has horizontal overflow: ${overflow}px`);
  assert.deepEqual(errors, [], `mobile homepage browser errors:\n${errors.join('\n')}`);

  // A standalone PWA can be restored directly on an internal route with no
  // previous app history. The production host rewrites SPA routes to index.html;
  // reproduce that rewrite here because python's static server otherwise returns 404.
  const indexHtml=await (await page.request.get(LOCAL)).text();
  await page.evaluate(async()=>{for(const reg of await navigator.serviceWorker.getRegistrations())await reg.unregister();});
  await page.route('**/middle/guardian/tools',(route)=>route.fulfill({status:200,contentType:'text/html',body:indexHtml}));
  await page.goto(LOCAL + 'middle/guardian/tools', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => document.body.classList.contains('pwa-standalone'), null, { timeout: 10000 });
  await page.waitForSelector('#pathView:not([hidden])', { state: 'visible', timeout: 10000 });
  const restoredState=await page.evaluate(()=>history.state);
  assert.equal(restoredState?.__aitools4kidsPwaEntry,true,'direct standalone route must be marked as an internal PWA history entry');
  await page.goBack({waitUntil:'domcontentloaded',timeout:10000}).catch(()=>null);
  await page.waitForSelector('#zoneSelectView:not([hidden])', { state: 'visible', timeout: 10000 });
  assert.equal(new URL(page.url()).pathname,'/','Back from a directly restored standalone route must return to the app homepage');

  console.log('Mobile PWA homepage + integrated Special-school route + lazy-loading + analytics + back-navigation smoke passed.');
} finally {
  await browser.close();
}
