import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});
const SPECIAL=new Set(['special-gymnasium','special-lyceum','eneegyl']);

async function openSettingsIfNeeded(page,selector){
  const field=page.locator(selector);
  if(await field.isVisible()) return;
  const toggle=page.locator('#tutorMount .tutor-mobile-settings-toggle');
  if(await toggle.count()) await toggle.click();
  await page.waitForSelector(selector,{state:'visible',timeout:10000});
}

async function renderTutor(page){
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render,{timeout:30000});
  await page.evaluate(()=>{
    history.replaceState({},'',`/middle/guardian/tutor`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    const view=document.getElementById('tutorView');
    if(view) view.hidden=false;
    window.AITutor.render({zoneId:'middle',roleId:'guardian',lang:'el'});
  });
  await page.waitForSelector('#tutorSchoolTrack',{state:'attached',timeout:15000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_SPECIAL_TUTOR_ACTIONS?.version===1,{timeout:15000});
  await openSettingsIfNeeded(page,'#tutorSchoolTrack');
}

async function selectTrack(page,value){
  await openSettingsIfNeeded(page,'#tutorSchoolTrack');
  await page.selectOption('#tutorSchoolTrack',value);
  const zone=value==='special-gymnasium'||value==='general-middle'?'middle':'high';
  await page.waitForFunction(({value,zone})=>location.pathname.startsWith(`/${zone}/`)&&document.getElementById('tutorSchoolTrack')?.value===value,{value,zone},{timeout:20000});
  await page.waitForTimeout(180);
}

async function choose(page,selector,value){
  await openSettingsIfNeeded(page,selector);
  await page.selectOption(selector,value);
  await page.waitForTimeout(220);
}

async function assertActions(page,label){
  const values=await page.locator('#tutorTopic option').evaluateAll((els)=>els.map((e)=>e.value));
  const texts=await page.locator('#tutorTopic option').evaluateAll((els)=>els.map((e)=>e.textContent.trim()));
  const actions=values.filter((v)=>v.includes('.action-'));
  assert.equal(actions.length,7,`${label}: expected exactly 7 common support actions, got ${actions.length}`);
  assert.ok(texts.some((x)=>/Εξήγησέ μου το απλά/i.test(x)),`${label}: simple explanation action missing`);
  assert.ok(texts.some((x)=>/βήμα-βήμα/i.test(x)),`${label}: step-by-step action missing`);
  assert.ok(texts.some((x)=>/χωρίς έτοιμη λύση/i.test(x)),`${label}: exercise-help action missing`);
  assert.ok(texts.some((x)=>/3 απλές ερωτήσεις/i.test(x)),`${label}: simplified understanding-check action missing`);
}

try{
  for(const [label,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]){
    const page=await browser.newPage({viewport});
    const errors=[];
    page.on('pageerror',(err)=>errors.push(err.message));
    page.on('console',(msg)=>{if(msg.type()==='error') errors.push(msg.text());});
    await renderTutor(page);

    await selectTrack(page,'special-gymnasium');
    await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,{timeout:20000});
    await choose(page,'#tutorGrade','a');
    const sgSubjects=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((e)=>e.value));
    const sgGeneric=sgSubjects.find((id)=>id.startsWith('special-gym-a-')&&!['special-gym-a-language-comprehension','special-gym-a-math-problem-reading'].includes(id));
    assert.ok(sgGeneric,`${label}: no structure-only Special Gymnasium subject found`);
    await choose(page,'#tutorSubject',sgGeneric);
    await assertActions(page,`${label} Special Gymnasium`);

    await selectTrack(page,'special-lyceum');
    await choose(page,'#tutorGrade','a');
    const slSubject=await page.locator('#tutorSubject').inputValue();
    assert.ok(slSubject.startsWith('special-lyceum-a-'),`${label}: Special Lyceum subject missing`);
    await assertActions(page,`${label} Special Lyceum`);

    await selectTrack(page,'eneegyl');
    await choose(page,'#tutorGrade','gym-a');
    const enSubject=await page.locator('#tutorSubject').inputValue();
    assert.ok(enSubject.startsWith('eneegyl-gym-a-'),`${label}: ENEEGYL Gymnasium subject missing`);
    await assertActions(page,`${label} ENEEGYL Gymnasium`);

    await choose(page,'#tutorGrade','lyc-a');
    const economics='eneegyl-lyc-a-economics';
    const enA=await page.locator('#tutorSubject option').evaluateAll((els)=>els.map((e)=>e.value));
    assert.ok(enA.includes(economics),`${label}: ENEEGYL A Lyceum Economics missing`);
    await choose(page,'#tutorSubject',economics);
    await assertActions(page,`${label} ENEEGYL A Lyceum`);

    const catalogCheck=await page.evaluate(()=>{
      const C=window.AITOOLSKIDS_TUTOR_CATALOG;
      let failures=[];
      for(const [zoneId,grades] of Object.entries(C?.zones||{})){
        for(const [gradeId,subjects] of Object.entries(grades||{})){
          for(const subject of subjects||[]){
            if(!subject?.specialEducation) continue;
            const count=(subject.topics||[]).filter((t)=>t.specialSupportAction).length;
            if(count!==7) failures.push(`${zoneId}/${gradeId}/${subject.id}:${count}`);
          }
        }
      }
      return failures;
    });
    assert.deepEqual(catalogCheck,[],`${label}: some Special Education subjects still have an incomplete common action menu`);

    await selectTrack(page,'general-middle');
    const generalTopicValues=await page.locator('#tutorTopic option').evaluateAll((els)=>els.map((e)=>e.value));
    assert.ok(generalTopicValues.every((v)=>!v.includes('.action-')),`${label}: Special Education actions leaked into General Gymnasium`);
    assert.ok(!SPECIAL.has(await page.inputValue('#tutorSchoolTrack')),`${label}: failed to return to general school`);

    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
    assert.ok(noOverflow,`${label}: horizontal overflow introduced`);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('Special Education AI Help action menu passed on desktop/mobile: 7 common actions per subject, no leakage to general school.');
}finally{
  await browser.close();
}
