import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/primary/student/quiz';
const browser=await chromium.launch({headless:true});

try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',(err)=>errors.push(`pageerror: ${err.message}`));
  page.on('console',(msg)=>{if(msg.type()==='error') errors.push(`console: ${msg.text()}`);});
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));

  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('.quiz-grade-card[data-grade-id="a"]',{state:'visible',timeout:10000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_PRIMARY_SIMPLE_QUIZ?.version>=3,null,{timeout:10000});

  const runtime=await page.evaluate(()=>window.AITOOLSKIDS_PRIMARY_SIMPLE_QUIZ);
  assert.deepEqual(runtime.grades,['a','b']);
  assert.equal(runtime.questionsPerSession,3);
  assert.equal(runtime.choicesPerQuestion,2);

  await page.locator('.quiz-grade-card[data-grade-id="a"]').click();
  await page.waitForSelector('.primary-simple-start',{state:'visible',timeout:10000});
  assert.ok(await page.locator('.primary-simple-start').count()>0,'A Primary must expose Simple mode');

  await page.locator('.primary-simple-start').first().click();
  await page.waitForSelector('#primarySimpleQuizModal',{state:'visible',timeout:10000});
  assert.equal(await page.locator('#primarySimpleQuizModal .psq__answer').count(),2,'Simple mode must show exactly two choices');
  assert.match((await page.locator('#primarySimpleQuizModal .psq__progress').innerText()).trim(),/1\s+(από|of)\s+3/,'Simple mode must start a three-question session');

  for(let step=1;step<=3;step+=1){
    await page.locator('#primarySimpleQuizModal .psq__answer').first().click();
    await page.locator('#primarySimpleQuizModal .psq__next').click();
    if(step<3){
      assert.equal(await page.locator('#primarySimpleQuizModal .psq__answer').count(),2,`Question ${step+1} must still have two choices`);
    }
  }

  await page.waitForSelector('#primarySimpleQuizModal .psq__result',{state:'visible',timeout:5000});
  assert.match((await page.locator('#primarySimpleQuizModal .psq__score').innerText()).trim(),/^\d\/3$/,'Simple mode result must be out of three');
  assert.match(await page.locator('#primarySimpleQuizModal .psq__result').innerText(),/(δεν είναι βαθμός ούτε διάγνωση|not a grade or diagnosis)/i,'Result must explicitly avoid diagnostic/grade framing');
  await page.locator('#primarySimpleQuizModal .psq__done').click();

  await page.locator('#quizBackToGradesBtn').click();
  await page.locator('.quiz-grade-card[data-grade-id="b"]').click();
  await page.waitForSelector('.primary-simple-start',{state:'visible',timeout:10000});
  assert.ok(await page.locator('.primary-simple-start').count()>0,'B Primary must expose Simple mode');

  await page.locator('#quizBackToGradesBtn').click();
  const laterGrade=page.locator('.quiz-grade-card[data-grade-id="c"]');
  if(await laterGrade.count()){
    await laterGrade.click();
    await page.waitForTimeout(50);
    assert.equal(await page.locator('.primary-simple-start').count(),0,'Simple mode must not appear from C Primary onward');
  }

  const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));
  assert.ok(overflow<=1,`mobile Primary quiz has horizontal overflow: ${overflow}px`);
  assert.deepEqual(errors,[],`Primary simple quiz browser errors:\n${errors.join('\n')}`);
  console.log('Early Primary simple quiz smoke passed.');
}finally{
  await browser.close();
}