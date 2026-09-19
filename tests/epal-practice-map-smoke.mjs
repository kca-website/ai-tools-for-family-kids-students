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
    let quizRequests=0;
    await page.route('**/api/tutor-assistant',async route=>{
      quizRequests+=1;
      const body=route.request().postDataJSON();
      assert.equal(body.task,'quiz',`${label}: EPAL short test must use the quiz task`);
      assert.equal(body.audience,'high_student',`${label}: EPAL short test audience is wrong`);
      assert.match(body.prompt,/Official mapped unit:/,`${label}: selected official unit missing from prompt`);
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({text:JSON.stringify({questions:[
        {q:'Ερώτηση 1',options:['Σωστό 1','Λάθος 1'],correct:0,explanation:'Εξήγηση 1'},
        {q:'Ερώτηση 2',options:['Λάθος 2','Σωστό 2'],correct:1,explanation:'Εξήγηση 2'},
        {q:'Ερώτηση 3',options:['Σωστό 3','Λάθος 3'],correct:0,explanation:'Εξήγηση 3'}
      ]})})});
    });
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
    assert.match(await page.locator('#epmapSource').innerText(),/επίσημη ύλη/i,`${label}: official mapping message missing`);
    const beforeUrl=page.url();
    await page.click('#epmapGo');
    await page.waitForSelector('#epmapQuiz:not([hidden]) .epmap__answer');
    assert.equal(page.url(),beforeUrl,`${label}: EPAL test must stay inline instead of redirecting to AI Help`);
    assert.equal(await page.locator('#epmapQuiz .epmap__answer').count(),2,`${label}: EPAL short test must show two choices`);
    for(let i=0;i<3;i++){
      await page.locator('#epmapQuiz .epmap__answer').first().click();
      assert.match(await page.locator('#epmapQuiz .epmap__feedback').innerText(),new RegExp(`Εξήγηση ${i+1}`),`${label}: answer explanation missing`);
      await page.locator('#epmapQuiz .epmap__next').click();
    }
    await page.waitForSelector('#epmapQuiz .epmap__result');
    assert.match(await page.locator('#epmapQuiz .epmap__score').innerText(),/^\d\/3$/,`${label}: EPAL score missing`);
    assert.ok(await page.locator('#epmapQuiz .epmap__tool').count()>=2,`${label}: EPAL tool recommendations missing`);
    assert.equal(quizRequests,1,`${label}: one short test should make exactly one AI request`);
    await page.locator('#epmapRetake').click();
    assert.equal(quizRequests,1,`${label}: retaking a cached short test must not use AI again`);

    await page.selectOption('#epmapGrade','c');
    assert.match(await page.locator('#epmapTrackLabel').innerText(),/Ειδικότητα/,`${label}: C EPAL specialty selector missing`);
    assert.ok(await page.locator('#epmapTrack option:not([value=""])').count()>=30,`${label}: C EPAL specialty list incomplete`);

    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('EPAL Practice Map passed on desktop/mobile with B-sector, C-specialty, inline 3x2 quiz, cache and tool recommendations.');
}finally{
  await browser.close();
}
