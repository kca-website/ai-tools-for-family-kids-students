import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../study.html',import.meta.url),'utf8');
assert.match(html,/function ensureGelPracticeSource/);
assert.match(html,/if\(!ensureGelPracticeSource\(\)\)return/);
const browser=await chromium.launch({headless:true});
try{
  for(const [device,width,height] of [['desktop',1366,850],['mobile',390,844]]){
    const page=await browser.newPage({viewport:{width,height}});
    let apiCalls=0, payload=null;
    await page.route('**/api/tutor-assistant',async route=>{
      apiCalls++;payload=route.request().postDataJSON();
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({text:'Πρόβα πάνω αποκλειστικά στο κείμενο του μαθητή.',sourceKind:'user_upload',sourceMode:'user_document',provider:'test',model:'mock'})});
    });
    await page.route('**/api/schoolbook-source**',async route=>{
      throw Error('No official source fetch allowed for an unverified practice skill without notes');
    });
    await page.goto('http://127.0.0.1:4173/study.html',{waitUntil:'domcontentloaded'});
    await page.selectOption('#zone','high');
    await page.selectOption('#grade','b');
    await page.selectOption('#subject','archaia-b-lykeiou');
    await page.selectOption('#gelPracticeTopic',{label:'Αδίδακτο πεζό κείμενο αττικής διαλέκτου'});
    assert.equal(await page.locator('#gelPracticeSourcePrompt').isVisible(),true);
    if(device==='mobile')await page.locator('#studyActionChoices summary').click();
    await page.locator('[data-action="explain"]').click();
    assert.equal(apiCalls,0,device+': must not submit without learner material');
    assert.equal(await page.locator('#aiWorkspace').isVisible(),false);
    assert.equal(await page.locator('#notesPaste').evaluate(el=>el===document.activeElement),true);
    await page.locator('#notesPaste').fill('Ο μαθητής διάβασε το αρχαίο χωρίο και κατέγραψε τις βασικές γραμματικές μορφές.');
    await page.locator('[data-action="explain"]').click();
    await page.waitForFunction(()=>document.querySelector('#aiOutput')?.textContent?.includes('Πρόβα πάνω αποκλειστικά'));
    assert.equal(apiCalls,1);
    assert.equal(payload?.documentKind,'user_upload');
    assert.equal(payload?.topic,'Αδίδακτο πεζό κείμενο αττικής διαλέκτου');
    assert.match(payload?.documentText||'',/Ο μαθητής διάβασε/);
    assert.equal(payload?.studyContext?.sourcePolicy,'attachment_override');
    assert.equal(await page.locator('#gelPracticeSourcePrompt').isVisible(),false);
    await page.selectOption('#subject','biologia-b-lykeiou');
    assert.equal(await page.locator('#topicCustom').inputValue(),'','stale Ancient practice must not carry into Biology');
    assert.equal(await page.locator('#gelPracticeSourcePrompt').isVisible(),false);
    console.log('PHASE39_GEL_OWN_TEXT_GUARD_OK',device);
    await page.close();
  }
}finally{await browser.close();}
