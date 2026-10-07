import {chromium} from 'playwright';
import axe from 'axe-core';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync} from 'node:fs';

const browser=await chromium.launch({headless:true});
const base='http://127.0.0.1:4173';
const report=[];
mkdirSync('docs/ux-evidence',{recursive:true});
try {
  for(const width of [320,375,390,768,1280]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('#homeV9FinderCta');
    await page.waitForFunction(()=>window.__aitools4kidsHeavyLoaded);
    await page.waitForLoadState('networkidle');
    assert.ok(await page.locator('#homeV9AllTools a').isVisible(), 'All AI tools remain discoverable');
    assert.ok(await page.locator('#homeV8HelpersMount a[href="/special-education.html"]').isVisible(), 'Special Education remains discoverable');
    assert.ok(await page.locator('#homeV8Eng a').isVisible(), 'GSL remains discoverable');
    assert.ok(await page.locator('#homeV9Finder [data-finder-role="university"]').isVisible());
    assert.ok(await page.locator('#homeV9Finder [data-finder-zone="epal"]').isVisible());
    const pick=async(kind,value)=>page.locator(`[data-finder-${kind}="${value}"]`).click();
    await pick('role','guardian');await pick('zone','primary');await pick('need','stuck');
    assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'),'/primary/guardian/tutor');
    await pick('role','student');await pick('zone','middle');
    assert.equal(await page.locator('.home-v9-finder__note').isVisible(),false,'General tool age warnings belong on tool cards, not the homepage');
    await pick('need','pdf');
    await page.locator('#homeV9FinderCta').click();
    await page.waitForSelector('#studyNotes');
    await page.waitForFunction(()=>window.AITOOLSKIDS_LEARNING_ACTIONS);
    assert.equal(await page.locator('#zone').inputValue(),'middle','Study retains selected level');
    await page.locator('#notesPaste').fill('Το νερό έχει τρεις φυσικές καταστάσεις: στερεή, υγρή και αέρια.');
    await page.locator('#usePastedNotes').click();
    assert.ok(await page.locator('#sourceModeNotice').isVisible(),'Source mode is activated by real notes');
    await page.goBack();await page.waitForSelector('#homeV9FinderCta');
    await pick('zone','epal');await pick('need','stuck');
    assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'),'/high/student/tutor?schoolType=epal');
    await pick('need','study');await page.locator('#homeV9FinderCta').click();
    await page.waitForFunction(()=>window.AITOOLSKIDS_LEARNING_ACTIONS);
    assert.equal(await page.locator('#zone').inputValue(),'high');
    assert.equal(await page.locator('#schoolType').inputValue(),'epal','Study preselects EPAL rather than GEL');
    await page.goBack();await page.waitForSelector('#homeV9FinderCta');
    await pick('role','student');await pick('zone','epal');
    await pick('need','practice');
    assert.ok(await page.locator('.home-v9-finder__extra[href*="mode=practice"]').isVisible(),'Known-unit practice remains directly available');
    await page.locator('#homeV9FinderCta').click();
    await page.waitForSelector('#epalPracticeMapModal');
    assert.ok(await page.locator('#epalPracticeMapModal').isVisible(),'EPAL practice opens diagnostic, not the default GEL route');
    await page.locator('.epmap__close').click();
    await pick('zone','high');await pick('need','organize');
    assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'),'/organosi-meletis-ai.html');
    await pick('need','study');await page.locator('#homeV9FinderCta').click();await page.waitForSelector('#zone');await page.waitForFunction(()=>window.AITOOLSKIDS_LEARNING_ACTIONS);
    assert.equal(await page.locator('#zone').inputValue(),'high');
    await page.goBack();await page.waitForSelector('#homeV9FinderCta');
    await pick('role','teacher');assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'),'/teacher-assistant.html');
    await pick('role','university');assert.equal(await page.locator('#homeV9FinderCta').getAttribute('href'),'/higher-education-pilot.html');
    await pick('role','guardian');await pick('zone','special');await pick('need','practice');
    assert.ok(await page.locator('#homeV9FinderCta[data-special-education-diagnostic]').count());
    await page.locator('#siteMenuToggle').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#siteMenuToggle').getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator('#siteMenuToggle').evaluate(el=>el===document.activeElement),true);
    await page.locator('#langEn').click();await page.waitForFunction(()=>document.documentElement.lang==='en');
    assert.match(await page.locator('#homeV9AllTools').innerText(),/AI tools/);
    await page.locator('#langEl').click();await page.waitForFunction(()=>document.documentElement.lang==='el');
    assert.ok(await page.locator('#homeV9Study .home-v8-helper-desc').isVisible(),'Study description stays visible on mobile');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(overflow<=1,`${width}: horizontal overflow ${overflow}`);
    // Language changes rebuild the homepage asynchronously. Measure the
    // controls after the Greek content and visible layout have both returned.
    await page.waitForFunction(()=>{const role=document.querySelector('#homeV9Finder [data-finder-role="guardian"]');return role?.textContent.includes('Γονιός') && [...document.querySelectorAll('#homeV9AllTools a, #homeV9Finder button')].every(el=>el.getBoundingClientRect().height>0);});
    const targets=await page.locator('#homeV9AllTools a, #homeV9Finder button').evaluateAll(els=>els.map(el=>({height:el.getBoundingClientRect().height,text:el.textContent})));
    assert.ok(targets.every(t=>t.height>=44),`${width}: touch targets ${JSON.stringify(targets.filter(t=>t.height<44))}`);
    await page.addScriptTag({content:axe.source});
    const scan=await page.evaluate(async()=>{const r=await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));});
    assert.deepEqual(scan,[],`${width}: accessibility violations: ${JSON.stringify(scan)}`);
    assert.deepEqual(errors,[],`${width}: runtime errors`);
    report.push({width,overflow,touchTargets:targets.length,axeViolations:scan.length,runtimeErrors:errors.length});
    if(width===390||width===1280){await pick('role','student');await pick('zone','middle');await pick('need','study');await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/ux-evidence/home-${width}.png`,fullPage:true});}
    await page.close();
  }
  writeFileSync('docs/ux-evidence/checks.json',JSON.stringify(report,null,2)+'\n');
  console.log('Intent-first journeys, PDF notes, EPAL diagnostic, language, focus, touch targets and axe checks passed at 5 viewport widths.');
}finally{await browser.close();}
