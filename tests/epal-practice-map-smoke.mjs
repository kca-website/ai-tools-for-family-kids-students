import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const label=viewport.width<600?'mobile':'desktop';
    const page=await browser.newPage({viewport});
    await page.route('**/_vercel/insights/script.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
    await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'application/javascript',body:'export const inject=()=>{};'}));
    await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
    await page.route('https://fonts.gstatic.com/**',route=>route.fulfill({status:204,body:''}));
    const errors=[];page.on('pageerror',err=>errors.push(err.message));page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});

    await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>!!window.AITOOLSKIDS_EPAL_PRACTICE_MAP&&!!window.AITOOLSKIDS_EPAL_STUDENT_CATALOG,{timeout:30000});
    assert.equal(await page.locator('[data-epal-practice-map]').count(),1,`${label}: homepage EPAL Practice Map entry missing`);
    await page.click('[data-epal-practice-map]');
    await page.waitForSelector('#epalPracticeMapModal:not([hidden])');

    await page.selectOption('#epmapGrade','b');
    assert.equal(await page.locator('#epmapTrackWrap').isVisible(),true,`${label}: B EPAL sector selector missing`);
    const informaticsSector=await page.evaluate(()=>window.AITOOLSKIDS_EPAL_STUDENT_CATALOG.getSectors().find(x=>/Πληροφορικής/.test(x.label))?.id||'');
    assert.ok(informaticsSector,`${label}: Informatics sector not found`);
    await page.selectOption('#epmapTrack',informaticsSector);
    const bSubjects=await page.locator('#epmapSubject option:not([value=""])').count();
    assert.ok(bSubjects>0,`${label}: B EPAL has no officially mapped subjects`);
    await page.locator('#epmapSubject option:not([value=""])').first().evaluate(el=>el.parentElement.value=el.value);
    await page.locator('#epmapSubject').dispatchEvent('change');
    assert.ok(await page.locator('#epmapTopic option:not([value=""])').count()>0,`${label}: official unit selector empty`);
    await page.locator('#epmapTopic option:not([value=""])').first().evaluate(el=>el.parentElement.value=el.value);
    await page.locator('#epmapTopic').dispatchEvent('change');
    const quizHref=await page.locator('#epmapGo').getAttribute('href');
    assert.match(quizHref,/schoolType=epal/,`${label}: quiz link does not preserve EPAL mode`);
    assert.match(quizHref,/grade=b/,`${label}: quiz link does not preserve B EPAL`);
    assert.match(quizHref,/sector=/,`${label}: quiz link does not preserve sector`);
    assert.match(await page.locator('#epmapSource').innerText(),/επίσημη ύλη/i,`${label}: official mapping message missing`);

    await page.selectOption('#epmapGrade','c');
    assert.match(await page.locator('#epmapTrackLabel').innerText(),/Ειδικότητα/,`${label}: C EPAL specialty selector missing`);
    assert.ok(await page.locator('#epmapTrack option:not([value=""])').count()>=30,`${label}: C EPAL specialty list incomplete`);

    await page.goto(new URL(quizHref,LOCAL).href,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForSelector('#tutorSchoolType');
    assert.equal(await page.locator('#tutorSchoolType').inputValue(),'epal',`${label}: tutor did not keep EPAL mode`);
    assert.equal(await page.locator('#tutorGrade').inputValue(),'b',`${label}: tutor did not keep grade`);
    assert.equal(await page.locator('#tutorSector').inputValue(),informaticsSector,`${label}: tutor did not keep sector`);
    assert.ok(await page.locator('#tutorSubject').inputValue(),`${label}: tutor subject was not preselected`);
    assert.ok(await page.locator('#tutorTopic').inputValue(),`${label}: tutor official topic was not preselected`);
    assert.equal(await page.locator('[data-study-tool="quiz"]').count(),1,`${label}: AI quiz action missing`);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('EPAL Practice Map passed on desktop/mobile with B-sector, C-specialty and official-unit tutor handoff.');
}finally{
  await browser.close();
}
