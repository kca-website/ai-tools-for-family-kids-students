import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function prepare(page,viewport){
  await page.setViewportSize(viewport);
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render && window.AITutorRenderHost?.eventName && window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.hasVerifiedEneegyl,{timeout:30000});
}

async function openSettingsIfNeeded(page,selector){
  const field=page.locator(selector);
  if(await field.isVisible()) return;
  const toggle=page.locator('#tutorMount .tutor-mobile-settings-toggle');
  if(await toggle.count()) await toggle.click();
  await page.waitForSelector(selector,{state:'visible',timeout:10000});
}

async function selectTutorOption(page,selector,value){
  await openSettingsIfNeeded(page,selector);
  await page.selectOption(selector,value);
  await page.waitForTimeout(180);
}

async function renderTutor(page,zoneId,roleId){
  await page.evaluate(({zoneId,roleId})=>{
    history.replaceState({},'',`/${zoneId}/${roleId}/tutor`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    const view=document.getElementById('tutorView');
    if(view) view.hidden=false;
    window.AITutor.render({zoneId,roleId,lang:'el'});
  },{zoneId,roleId});
  await page.waitForSelector('#tutorSchoolTrack',{state:'attached',timeout:10000});
  await openSettingsIfNeeded(page,'#tutorSchoolTrack');
  await page.waitForTimeout(150);
}

async function checkHigh(page,label){
  await renderTutor(page,'high','student');

  const trackOptions=await page.locator('#tutorSchoolTrack option').evaluateAll((els)=>els.map((el)=>({value:el.value,text:el.textContent.trim(),disabled:el.disabled})));
  assert.ok(trackOptions.some((x)=>x.value==='general' && !x.disabled),`${label}: general school track missing`);
  assert.ok(trackOptions.some((x)=>x.value==='eneegyl' && !x.disabled),`${label}: ENEEGYL school track missing`);
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'general',`${label}: general school should remain the safe default`);

  const initialSubjects=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.ok(initialSubjects.length>0,`${label}: generic subjects disappeared`);
  assert.ok(initialSubjects.every((id)=>!id.startsWith('eneegyl-')),`${label}: ENEEGYL subjects leaked into general-school mode`);

  await selectTutorOption(page,'#tutorSchoolTrack','eneegyl');
  const specialGrades=await page.locator('#tutorGrade option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.deepEqual(specialGrades.sort(),['a','b'],`${label}: ENEEGYL should currently expose only verified A/B Lyceum grades`);

  await selectTutorOption(page,'#tutorGrade','b');
  const bSubjects=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.equal(bSubjects.length,5,`${label}: expected five verified B ENEEGYL units`);
  for(const id of [
    'eneegyl-b-health-nutrition',
    'eneegyl-b-mechanics-thermo-basics',
    'eneegyl-b-structures-topography-basics',
    'eneegyl-b-agriculture-plant-basics',
    'eneegyl-b-economy-accounting-basics'
  ]) assert.ok(bSubjects.includes(id),`${label}: missing ${id}`);

  await selectTutorOption(page,'#tutorSubject','eneegyl-b-economy-accounting-basics');
  const topicCount=await page.locator('#tutorTopic option').count();
  assert.ok(topicCount>=3,`${label}: accounting tutor topics missing`);
  const context=await page.locator('#tutorContextBox').innerText();
  assert.match(context,/ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./,`${label}: school identity missing from tutor context`);
  assert.match(context,/2026.?27/,`${label}: school year missing from tutor context`);
  assert.match(context,/εξεταστέα ύλη/i,`${label}: current exam-syllabus verification basis missing from tutor context`);

  const catalogState=await page.evaluate(()=>{
    const s=window.AITOOLSKIDS_TUTOR_CATALOG.getSubject('high','b','eneegyl-b-economy-accounting-basics');
    return {
      schoolType:s?.schoolType,
      coverage:s?.curriculum?.coverageStatus,
      examStatus:s?.curriculum?.currentExamSyllabusStatus,
      teachingStatus:s?.curriculum?.teachingInstructionsStatus,
      source:s?.curriculum?.annualInstructionsUrl,
      specialCount:window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.exposed?.length || 0
    };
  });
  assert.equal(catalogState.schoolType,'eneegyl',`${label}: accounting subject lost ENEEGYL identity`);
  assert.equal(catalogState.coverage,'current-exam-syllabus-verified-partial',`${label}: accounting coverage boundary wrong`);
  assert.equal(catalogState.examStatus,'2026-27-verified',`${label}: current exam syllabus is not marked verified`);
  assert.notEqual(catalogState.teachingStatus,'verified',`${label}: teaching instructions were incorrectly promoted to verified`);
  assert.match(catalogState.source,/minedu\.gov\.gr/,`${label}: official current source missing`);
  assert.equal(catalogState.specialCount,6,`${label}: expected six verified Special Education tutor units`);

  assert.equal(await page.locator('#tutorMount .tutor-flashcards').count(),1,`${label}: flashcards missing/duplicated after special track selection`);
  assert.equal(await page.locator('#tutorMount .tutor-study-tools').count(),1,`${label}: study tools missing/duplicated after special track selection`);

  await selectTutorOption(page,'#tutorSchoolTrack','general');
  const restoredSubjects=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.ok(restoredSubjects.length>0 && restoredSubjects.every((id)=>!id.startsWith('eneegyl-')),`${label}: switching back to general school did not restore generic-only subjects`);

  const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert.ok(noOverflow,`${label}: horizontal overflow in AI Tutor`);
}

async function checkSpecialGymPending(page,label){
  await renderTutor(page,'middle','guardian');
  const options=await page.locator('#tutorSchoolTrack option').evaluateAll((els)=>els.map((el)=>({value:el.value,text:el.textContent.trim(),disabled:el.disabled})));
  const pending=options.find((x)=>x.value==='special-gymnasium');
  assert.ok(pending,`${label}: Special Gymnasium track placeholder missing`);
  assert.equal(pending.disabled,true,`${label}: Special Gymnasium became selectable before verified content exists`);
  assert.match(pending.text,/επαλήθευση/i,`${label}: Special Gymnasium pending state is not explained`);
}

try{
  for(const [label,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]){
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',(err)=>errors.push(err.message));
    page.on('console',(msg)=>{if(msg.type()==='error') errors.push(msg.text());});
    await prepare(page,viewport);
    await checkHigh(page,label);
    await checkSpecialGymPending(page,label);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('Special Education AI Tutor smoke passed on desktop and mobile.');
}finally{
  await browser.close();
}
