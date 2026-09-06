import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function prepare(page,viewport){
  await page.setViewportSize(viewport);
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render && window.AITutorRenderHost?.eventName
    && window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.hasVerifiedEneegyl
    && window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.hasVerifiedSpecialGymnasium,{timeout:30000});
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
  assert.ok(initialSubjects.length>0,`${label}: generic high-school subjects disappeared`);
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
    const exposed=window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.exposed || [];
    return {
      schoolType:s?.schoolType,
      coverage:s?.curriculum?.coverageStatus,
      examStatus:s?.curriculum?.currentExamSyllabusStatus,
      teachingStatus:s?.curriculum?.teachingInstructionsStatus,
      source:s?.curriculum?.annualInstructionsUrl,
      eneegylCount:exposed.filter(x=>x.schoolType==='eneegyl').length
    };
  });
  assert.equal(catalogState.schoolType,'eneegyl',`${label}: accounting subject lost ENEEGYL identity`);
  assert.equal(catalogState.coverage,'current-exam-syllabus-verified-partial',`${label}: accounting coverage boundary wrong`);
  assert.equal(catalogState.examStatus,'2026-27-verified',`${label}: current exam syllabus is not marked verified`);
  assert.notEqual(catalogState.teachingStatus,'verified',`${label}: teaching instructions were incorrectly promoted to verified`);
  assert.match(catalogState.source,/minedu\.gov\.gr/,`${label}: official current source missing`);
  assert.equal(catalogState.eneegylCount,6,`${label}: ENEEGYL exposed-unit count changed unexpectedly`);

  assert.equal(await page.locator('#tutorMount .tutor-flashcards').count(),1,`${label}: flashcards missing/duplicated after ENEEGYL selection`);
  assert.equal(await page.locator('#tutorMount .tutor-study-tools').count(),1,`${label}: study tools missing/duplicated after ENEEGYL selection`);

  await selectTutorOption(page,'#tutorSchoolTrack','general');
  const restoredSubjects=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.ok(restoredSubjects.length>0 && restoredSubjects.every((id)=>!id.startsWith('eneegyl-')),`${label}: switching back to general high school did not restore generic-only subjects`);
}

async function checkSpecialGym(page,label){
  await renderTutor(page,'middle','guardian');
  const options=await page.locator('#tutorSchoolTrack option').evaluateAll((els)=>els.map((el)=>({value:el.value,text:el.textContent.trim(),disabled:el.disabled})));
  const special=options.find((x)=>x.value==='special-gymnasium');
  assert.ok(special,`${label}: Special Gymnasium track missing`);
  assert.equal(special.disabled,false,`${label}: Special Gymnasium should be selectable after verified structure was added`);
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'general',`${label}: general middle school must remain default`);

  const generalSubjects=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.ok(generalSubjects.every((id)=>!id.startsWith('special-gym-')),`${label}: Special Gymnasium subjects leaked into general mode`);

  await selectTutorOption(page,'#tutorSchoolTrack','special-gymnasium');
  const grades=await page.locator('#tutorGrade option').evaluateAll((els)=>els.map((el)=>({value:el.value,text:el.textContent.trim()})));
  assert.deepEqual(grades.map(x=>x.value).sort(),['a','b','c'],`${label}: Special Gymnasium must expose A/B/C grades`);
  assert.ok(grades.some(x=>x.value==='a' && /Α΄ Γυμνασίου/.test(x.text)),`${label}: Special Gymnasium grade labels are not explicit`);

  await selectTutorOption(page,'#tutorGrade','a');
  const aSubjects=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.equal(aSubjects.length,18,`${label}: expected 18 official A Special Gymnasium subjects`);
  for(const id of ['special-gym-a-language-comprehension','special-gym-a-math-problem-reading','special-gym-a-physics','special-gym-a-history']) {
    assert.ok(aSubjects.includes(id),`${label}: Special Gymnasium A missing ${id}`);
  }

  await selectTutorOption(page,'#tutorSubject','special-gym-a-language-comprehension');
  assert.ok(await page.locator('#tutorTopic option').count()>=4,`${label}: detailed Special Gymnasium language topics missing`);
  let context=await page.locator('#tutorContextBox').innerText();
  assert.match(context,/Ειδικό Γυμνάσιο/i,`${label}: Special Gymnasium identity missing from detailed context`);
  assert.match(context,/2026.?27/,`${label}: Special Gymnasium school year missing`);
  assert.match(context,/προσαρμογ/i,`${label}: adaptation basis missing from detailed context`);

  await selectTutorOption(page,'#tutorSubject','special-gym-a-physics');
  assert.equal(await page.locator('#tutorTopic option').count(),1,`${label}: structure-only subject should expose one safe generic topic`);
  context=await page.locator('#tutorContextBox').innerText();
  assert.match(context,/Ειδικό Γυμνάσιο/i,`${label}: Special Gymnasium identity missing from structure-only context`);
  assert.match(context,/δεν έχει δηλωθεί|χωρίς δήλωση|συγκεκριμένο.*άσκηση/i,`${label}: structure-only scope warning missing`);

  await selectTutorOption(page,'#tutorGrade','b');
  assert.equal(await page.locator('#tutorSubject option').count(),19,`${label}: expected 19 official B Special Gymnasium subjects`);
  await selectTutorOption(page,'#tutorGrade','c');
  assert.equal(await page.locator('#tutorSubject option').count(),19,`${label}: expected 19 official C Special Gymnasium subjects`);

  const catalogState=await page.evaluate(()=>{
    const exposed=window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.exposed || [];
    const shell=window.AITOOLSKIDS_TUTOR_CATALOG.getSubject('middle','a','special-gym-a-physics');
    return {
      specialGymCount:exposed.filter(x=>x.schoolType==='special-gymnasium').length,
      shellCoverage:shell?.curriculum?.coverageStatus,
      shellTimetable:shell?.curriculum?.officialTimetableStatus,
      shellStructureOnly:!!shell?.structureOnly
    };
  });
  assert.equal(catalogState.specialGymCount,56,`${label}: expected 56 Special Gymnasium tutor subjects across A/B/C`);
  assert.equal(catalogState.shellCoverage,'official-timetable-verified-structure',`${label}: structure-only coverage marker wrong`);
  assert.equal(catalogState.shellTimetable,'2026-27-verified',`${label}: timetable verification missing`);
  assert.equal(catalogState.shellStructureOnly,true,`${label}: generic subject is not marked structure-only`);

  assert.equal(await page.locator('#tutorMount .tutor-flashcards').count(),1,`${label}: flashcards missing/duplicated after Special Gymnasium selection`);
  assert.equal(await page.locator('#tutorMount .tutor-study-tools').count(),1,`${label}: study tools missing/duplicated after Special Gymnasium selection`);

  await selectTutorOption(page,'#tutorSchoolTrack','general');
  const restored=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((el)=>el.value));
  assert.ok(restored.length>0 && restored.every((id)=>!id.startsWith('special-gym-')),`${label}: switching back to general middle school did not restore generic-only subjects`);
}

try{
  for(const [label,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]){
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',(err)=>errors.push(err.message));
    page.on('console',(msg)=>{if(msg.type()==='error') errors.push(msg.text());});
    await prepare(page,viewport);
    await checkHigh(page,label);
    await checkSpecialGym(page,label);
    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
    assert.ok(noOverflow,`${label}: horizontal overflow in AI Tutor`);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('Special Education AI Tutor smoke passed for ENEEGYL and Special Gymnasium on desktop/mobile.');
}finally{
  await browser.close();
}
