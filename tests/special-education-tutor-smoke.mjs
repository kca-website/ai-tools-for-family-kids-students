import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function prepare(page,viewport){
  await page.setViewportSize(viewport);
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render && window.AITutorRenderHost?.eventName,{timeout:30000});
  const globalSpecial=await page.evaluate(()=>({
    catalog:!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,
    heavyScripts:[...document.scripts].filter(s=>/special-education-(curriculum|learning|quiz|special-gymnasium|special-lyceum|tutor-catalog)/.test(s.src)).length
  }));
  assert.equal(globalSpecial.catalog,false,'Special Education catalog should not load on the homepage');
  assert.equal(globalSpecial.heavyScripts,0,'Heavy Special Education scripts should not load globally');
}

async function openSettingsIfNeeded(page,selector){
  const field=page.locator(selector);
  if(await field.isVisible()) return;
  const toggle=page.locator('#tutorMount .tutor-mobile-settings-toggle');
  if(await toggle.count()) await toggle.click();
  await page.waitForSelector(selector,{state:'visible',timeout:10000});
}

async function renderTutor(page,zoneId,roleId){
  await page.evaluate(({zoneId,roleId})=>{
    history.replaceState({},'',`/${zoneId}/${roleId}/tutor`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    const view=document.getElementById('tutorView');
    if(view) view.hidden=false;
    window.AITutor.render({zoneId,roleId,lang:'el'});
  },{zoneId,roleId});
  await page.waitForSelector('#tutorSchoolTrack',{state:'attached',timeout:15000});
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_SIMPLE_QUIZ,{timeout:15000});
  await openSettingsIfNeeded(page,'#tutorSchoolTrack');
}

async function selectTrack(page,value){
  await openSettingsIfNeeded(page,'#tutorSchoolTrack');
  await page.selectOption('#tutorSchoolTrack',value);
  const targetZone=value==='special-gymnasium'||value==='general-middle'?'middle':'high';
  await page.waitForFunction(({value,targetZone})=>{
    return location.pathname.startsWith(`/${targetZone}/`)
      && document.getElementById('tutorSchoolTrack')?.value===value;
  },{value,targetZone},{timeout:20000});
  await page.waitForTimeout(120);
}

async function selectOption(page,selector,value){
  await openSettingsIfNeeded(page,selector);
  await page.selectOption(selector,value);
  await page.waitForTimeout(220);
}

async function assertSimpleQuizButton(page,label){
  const button=page.locator('#tutorMount [data-study-tool="quiz"]');
  await button.waitFor({state:'attached',timeout:10000});
  assert.equal(await button.getAttribute('data-special-simple-quiz'),'1',`${label}: Special Education did not switch to simplified quiz adapter`);
  assert.match(await button.innerText(),/απλό quiz 3 ερωτήσεων|simple 3-question quiz/i,`${label}: simplified quiz button label missing`);
}

async function assertGeneralQuizButton(page,label){
  const button=page.locator('#tutorMount [data-study-tool="quiz"]');
  await button.waitFor({state:'attached',timeout:10000});
  assert.notEqual(await button.getAttribute('data-special-simple-quiz'),'1',`${label}: Special Education quiz adapter leaked into general school`);
}

async function checkUnified(page,label){
  await renderTutor(page,'middle','guardian');
  const options=await page.locator('#tutorSchoolTrack option').evaluateAll((els)=>els.map((e)=>({value:e.value,text:e.textContent.trim(),disabled:e.disabled})));
  assert.deepEqual(options.map(x=>x.value),['general-middle','general-high','special-gymnasium','special-lyceum','eneegyl'],`${label}: unified school selector options are wrong`);
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'general-middle',`${label}: middle school should remain the initial default`);
  assert.ok(options.every(x=>!x.disabled),`${label}: every school type should be selectable from one AI Help`);
  await assertGeneralQuizButton(page,`${label} General Gymnasium`);

  assert.equal(await page.evaluate(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG),false,`${label}: special catalog loaded before selection`);
  await selectTrack(page,'special-gymnasium');
  await page.waitForFunction(()=>window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.hasVerifiedSpecialGymnasium,{timeout:20000});
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'special-gymnasium',`${label}: Special Gymnasium selection failed`);
  await assertSimpleQuizButton(page,`${label} Special Gymnasium`);
  assert.deepEqual((await page.locator('#tutorGrade option').evaluateAll(els=>els.map(e=>e.value))).sort(),['a','b','c'],`${label}: Special Gymnasium grades wrong`);
  await selectOption(page,'#tutorGrade','a');
  const sgSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(sgSubjects.includes('special-gym-a-language-comprehension')&&sgSubjects.includes('special-gym-a-math-problem-reading'),`${label}: Special Gymnasium detailed subjects missing`);

  await selectTrack(page,'special-lyceum');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'special-lyceum',`${label}: Special Lyceum selection failed`);
  await assertSimpleQuizButton(page,`${label} Special Lyceum`);
  assert.deepEqual((await page.locator('#tutorGrade option').evaluateAll(els=>els.map(e=>e.value))).sort(),['a','b','c'],`${label}: Special Lyceum grades wrong`);
  await selectOption(page,'#tutorGrade','a');
  const slSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(slSubjects.length>0,`${label}: Special Lyceum needs a usable subject menu`);
  assert.ok(slSubjects.every(id=>id.startsWith('special-lyceum-a-')),`${label}: Special Lyceum subject menu leaked another school type`);
  const slContext=await page.locator('#tutorContextBox').innerText();
  assert.match(slContext,/Ειδικό Λύκειο|Special Lyceum/i,`${label}: Special Lyceum context identity missing`);

  await selectTrack(page,'eneegyl');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'eneegyl',`${label}: ENEEGYL selection failed`);
  await assertSimpleQuizButton(page,`${label} ENEEGYL`);
  const enGrades=await page.locator('#tutorGrade option').evaluateAll(els=>els.map(e=>e.value));
  assert.deepEqual(enGrades.sort(),['a','b'],`${label}: ENEEGYL should expose verified A/B grades only`);
  await selectOption(page,'#tutorGrade','b');
  const enSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.equal(enSubjects.length,5,`${label}: expected five verified B ENEEGYL units`);
  assert.ok(enSubjects.includes('eneegyl-b-economy-accounting-basics'),`${label}: accounting missing from ENEEGYL`);

  await selectTrack(page,'special-gymnasium');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'special-gymnasium',`${label}: cross-zone return to Special Gymnasium failed`);
  await assertSimpleQuizButton(page,`${label} Special Gymnasium return`);
  await selectTrack(page,'general-high');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'general-high',`${label}: unified selector could not switch to General Lyceum`);
  await assertGeneralQuizButton(page,`${label} General Lyceum`);
  const generalHigh=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(generalHigh.length>0&&generalHigh.every(id=>!id.startsWith('special-')&&!id.startsWith('eneegyl-')),`${label}: special subjects leaked into General Lyceum`);

  assert.equal(await page.locator('#tutorMount').count(),1,`${label}: duplicate tutor mount created`);
  assert.equal(await page.locator('#tutorMount .tutor-flashcards').count(),1,`${label}: flashcards missing or duplicated`);
  assert.equal(await page.locator('#tutorMount .tutor-study-tools').count(),1,`${label}: study tools missing or duplicated`);

  const lazyState=await page.evaluate(()=>({
    catalog:!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,
    lyceum:!!window.SPECIAL_LYCEUM_2026_2027,
    simpleQuiz:!!window.AITOOLSKIDS_SPECIAL_SIMPLE_QUIZ,
    runtimeScripts:[...document.scripts].filter(s=>s.dataset.specialEducationRuntime).length
  }));
  assert.equal(lazyState.catalog,true,`${label}: special catalog missing after selection`);
  assert.equal(lazyState.lyceum,true,`${label}: Special Lyceum metadata was not lazy-loaded`);
  assert.equal(lazyState.simpleQuiz,true,`${label}: simplified Special Education quiz adapter missing`);
  assert.ok(lazyState.runtimeScripts>=8,`${label}: expected lazy Special Education runtime scripts`);
}

try{
  for(const [label,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]){
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',(err)=>errors.push(err.message));
    page.on('console',(msg)=>{if(msg.type()==='error') errors.push(msg.text());});
    await prepare(page,viewport);
    await checkUnified(page,label);
    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
    assert.ok(noOverflow,`${label}: horizontal overflow in unified AI Help`);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('Unified lazy-loaded Special Education AI Help with simplified quiz switching passed on desktop/mobile.');
}finally{
  await browser.close();
}
