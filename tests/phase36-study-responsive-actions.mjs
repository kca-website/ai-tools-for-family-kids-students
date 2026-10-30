import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const html=readFileSync(new URL('../study.html',import.meta.url),'utf8');
assert.match(html,/id="studyActionChoices"/);
assert.doesNotMatch(html,/<summary[^>]*data-el="Περισσότερα"/);
assert.match(html,/const syncStudyActionChoices=/);
const browser=await chromium.launch({headless:true});
try {
  for(const [name,width,height,desktop] of [['desktop',1366,850,true],['tablet',768,1024,false],['mobile',390,844,false]]){
    const page=await browser.newPage({viewport:{width,height}});
    await page.goto('http://127.0.0.1:4173/study.html',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#studyActionChoices')&&window.matchMedia('(min-width: 801px)'));
    const panel=page.locator('#studyActionChoices'),trigger=panel.locator('summary');
    assert.equal(await panel.evaluate(el=>el.open),desktop,name+': unexpected starting disclosure state');
    assert.equal(await trigger.isVisible(),!desktop,name+': summary visibility');
    const listen=panel.locator('[data-action="audio"]'),quiz=panel.locator('[data-action="quiz"]'),pdf=panel.locator('#studyPdfChoice');
    for(const item of [listen,quiz,pdf])assert.equal(await item.isVisible(),desktop,name+': actions initially');
    if(!desktop){
      await trigger.click();
      assert.equal(await panel.evaluate(el=>el.open),true,name+': details open');
      for(const item of [listen,quiz,pdf])assert.equal(await item.isVisible(),true,name+': action after expand');
      await trigger.click();
      assert.equal(await panel.evaluate(el=>el.open),false,name+': details close');
      await page.locator('#enBtn').click();
      assert.match(await trigger.textContent(),/Choose an action/);
      await trigger.click();
      assert.equal(await listen.isVisible(),true,name+': localized actions');
    } else {
      assert.equal(await page.getByText('Περισσότερα',{exact:true}).count(),0);
      await page.setViewportSize({width:390,height:844});
      assert.equal(await panel.evaluate(el=>el.open),false,'desktop to mobile closes catalog');
      await page.setViewportSize({width:1366,height:850});
      assert.equal(await panel.evaluate(el=>el.open),true,'mobile to desktop restores all actions');
    }
    console.log('PHASE36_STUDY_ACTIONS_RESPONSIVE_OK',name);
    await page.close();
  }
}finally{await browser.close();}
