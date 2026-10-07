import {chromium} from 'playwright';
import axe from 'axe-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try{
 for(const width of [320,390,1280]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/');await page.waitForSelector('#homeV9FinderCta');
  assert.equal(await page.locator('.home-v9-finder__note').isVisible(),false);
  if(width<600)await page.locator('#siteMenuToggle').click();
  await page.locator('a[href="/tools/ai-help.html"]:visible').first().click();await page.waitForURL('**/tools/ai-help.html');
  await page.waitForSelector('[data-help-zone="middle"]');
  assert.equal(await page.locator('[data-help-zone="primary"]').getAttribute('href'),'/primary/guardian/tutor');
  assert.equal(await page.locator('[data-help-zone="middle"]').getAttribute('href'),'/middle/student/tutor');
  await page.locator('input[value="guardian"]').check();
  assert.equal(await page.locator('[data-help-zone="middle"]').getAttribute('href'),'/middle/guardian/tutor');
  assert.equal(await page.locator('[data-help-zone="epal"]').getAttribute('href'),'/high/guardian/tutor?schoolType=epal');
  await page.locator('[data-language="en"]').click();assert.match(await page.locator('h1').innerText(),/AI Help/);
  await page.locator('[data-language="el"]').click();
  assert.ok(await page.locator('.links a[href="/special-education.html"]').isVisible());
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.ok(overflow<=1);
  await page.addScriptTag({content:axe.source});const violations=await page.evaluate(async()=>{const r=await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}));});assert.deepEqual(violations,[]);
  await page.screenshot({path:`docs/ux-evidence/ai-help-${width}.png`,fullPage:true});
  await page.locator('[data-help-zone="epal"]').click();await page.waitForURL('**/high/guardian/tutor?schoolType=epal');
  await page.goto('http://127.0.0.1:4173/#open-tools');
  await page.waitForSelector('#homeV9FinderCta');
  await page.locator('#homeV9Finder [data-finder-role="guardian"]').click();
  await page.locator('#homeV9Finder [data-finder-zone="high"]').click();
  assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'),'/high/guardian/tools');
  await page.locator('#homeV9FinderCta').click();
  await page.waitForURL(url=>url.pathname==='/high/guardian/tools');console.log('tools URL',page.url());
  assert.deepEqual(errors,[]);console.log(JSON.stringify({width,overflow,axeViolations:violations.length,runtimeErrors:errors.length}));await page.close();
 }
}finally{await browser.close();}
