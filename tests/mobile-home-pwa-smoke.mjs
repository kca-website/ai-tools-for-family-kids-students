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
  await page.waitForFunction(()=>document.querySelector('#specialEducationHomeFeature .se-home-title')?.textContent.includes('🎓'),null,{timeout:10000});

  assert.equal((await page.textContent('#siteTitleText'))?.trim(), 'AI Tools 4 Kids', 'compact mobile site title was not restored');
  assert.equal(await page.locator('#pwaMobileLauncher [data-pwa-action="quiz"]').isVisible(), true, 'Quick test action is missing');
  assert.equal(await page.locator('#pwaMobileLauncher [data-pwa-action="tools"]').isVisible(), true, 'Find tool action is missing');
  assert.equal(await page.locator('#pwaMobileLauncher [data-pwa-action="help"]').isVisible(), true, 'AI Help action is missing');

  const labels = await page.locator('#pwaMobileLauncher .pwa-mobile-action').allTextContents();
  assert.deepEqual(labels.map((x) => x.trim()), ['🧭Γρήγορο τεστ', '🧰Βρες εργαλείο', '🤖AI Βοήθεια']);
  assert.equal(await page.locator('#zoneSelectView .hero__quiz-cta-wrap').isVisible(), false, 'legacy large diagnostic CTA is still visible in installed mobile mode');
  assert.equal(await page.locator('#zoneSelectView .hero__ai-help').isVisible(), false, 'legacy large AI Help hero is still visible in installed mobile mode');

  const specialText=await page.locator('#specialEducationHomeFeature').innerText();
  assert.match(specialText,/Ειδικό Γυμνάσιο.*Ειδικό Λύκειο.*ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./s,'homepage Special Education card must name all three school types');
  assert.ok(!specialText.includes('♿'),'wheelchair icon must not be used as the Special Education symbol');
  assert.match(await page.locator('#specialEducationHomeFeature .se-home-cta').getAttribute('href'),/^\/special-education\.html$/,'homepage Special Education link must use the production route');

  const globalSpecial=await page.evaluate(()=>({
    catalog:!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,
    heavy:[...document.scripts].filter(s=>/special-education-(curriculum|learning|quiz|special-gymnasium|special-lyceum|tutor-context|tutor-catalog)/.test(s.src)).map(s=>s.src)
  }));
  assert.equal(globalSpecial.catalog,false,'Special Education catalog must not preload on homepage');
  assert.deepEqual(globalSpecial.heavy,[],'Special Education datasets must not load on homepage');

  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert.ok(overflow <= 1, `mobile homepage has horizontal overflow: ${overflow}px`);
  assert.deepEqual(errors, [], `mobile homepage browser errors:\n${errors.join('\n')}`);

  console.log('Mobile PWA homepage + Special Education lazy-loading smoke passed.');
} finally {
  await browser.close();
}
