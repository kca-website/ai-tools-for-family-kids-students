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
  await page.waitForSelector('#pwaMobileLauncher', { state: 'visible', timeout: 10000 });
  await page.waitForFunction(() => document.body.classList.contains('pwa-standalone'), null, { timeout: 10000 });
  await page.waitForFunction(()=>document.querySelector('#specialEducationHomeFeature .se-home-title')?.textContent.includes('🏫'),null,{timeout:10000});
  await page.waitForFunction(()=>document.querySelector('#heroHelpSpecialEducation span[aria-hidden="true"]')?.textContent==='🏫',null,{timeout:10000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_SPECIAL_EDUCATION_ENTRY_ANALYTICS?.version===1,null,{timeout:10000});

  assert.equal((await page.textContent('#siteTitleText'))?.trim(), 'AI Tools 4 Kids', 'compact mobile site title was not restored');
  assert.equal(await page.locator('#pwaMobileLauncher [data-pwa-action="quiz"]').isVisible(), true, 'Quick test action is missing');
  assert.equal(await page.locator('#pwaMobileLauncher [data-pwa-action="tools"]').isVisible(), true, 'Find tool action is missing');
  assert.equal(await page.locator('#pwaMobileLauncher [data-pwa-action="help"]').isVisible(), true, 'AI Help action is missing');

  const labels = await page.locator('#pwaMobileLauncher .pwa-mobile-action').allTextContents();
  assert.deepEqual(labels.map((x) => x.trim()), ['🧭Γρήγορο τεστ', '🧰Βρες εργαλείο', '🤖AI Βοήθεια']);
  assert.equal(await page.locator('#zoneSelectView .hero__quiz-cta-wrap').isVisible(), true, 'installed mobile mode must retain the full diagnostic entry');
  assert.equal(await page.locator('#zoneSelectView .hero__ai-help').isVisible(), true, 'installed mobile mode must retain the full AI Help entry');

  const specialText=await page.locator('#specialEducationHomeFeature').innerText();
  assert.match(specialText,/Ειδικό Γυμνάσιο.*Ειδικό Λύκειο.*ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./s,'homepage Special Education card must name all three school types');
  assert.ok(specialText.includes('🏫'),'Special Education homepage card must use the neutral school icon');
  assert.ok(!specialText.includes('♿'),'wheelchair icon must not be used as the Special Education symbol');
  assert.match(await page.locator('#specialEducationHomeFeature .se-home-cta').getAttribute('href'),/^\/special-education\.html$/,'homepage Special Education link must use the production route');
  const specialHelpText=(await page.locator('#heroHelpSpecialEducation').innerText()).replace(/\s+/g,'').trim();
  assert.equal(specialHelpText,'🏫ΕιδικήΕκπαίδευση','AI Help Special Education action must use the same icon and label');

  const analytics=await page.evaluate(()=>{
    const calls=[];
    window.va=(...args)=>calls.push(args);
    const api=window.AITOOLSKIDS_SPECIAL_EDUCATION_ENTRY_ANALYTICS;
    const accepted=api.sources.map((source)=>api.track(source));
    const rejected=api.track('other');
    return {eventName:api.eventName,sources:api.sources,accepted,rejected,calls};
  });
  assert.equal(analytics.eventName,'Special Education Entry');
  assert.deepEqual(analytics.sources,['banner','ai_help','diagnostic']);
  assert.deepEqual(analytics.accepted,[true,true,true]);
  assert.equal(analytics.rejected,false,'analytics must reject arbitrary source values');
  assert.deepEqual(analytics.calls.map((call)=>call[0]),['event','event','event']);
  assert.deepEqual(analytics.calls.map((call)=>call[1]?.data?.source),['banner','ai_help','diagnostic']);
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

  console.log('Mobile PWA homepage parity + Special Education lazy-loading + entry analytics smoke passed.');
} finally {
  await browser.close();
}
