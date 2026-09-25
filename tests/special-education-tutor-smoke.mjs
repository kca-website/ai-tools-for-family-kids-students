import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function prepare(page,viewport){
  await page.setViewportSize(viewport);
  await page.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render&&window.AITutorRenderHost?.eventName,{timeout:30000});
  const initial=await page.evaluate(()=>({
    catalog:!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,
    structure:!!window.ENEEGYL_2026_2027_STRUCTURE,
    heavy:[...document.scripts].filter(s=>/special-education-(curriculum|learning|quiz|special-gymnasium|special-lyceum|tutor-catalog)/.test(s.src)).length
  }));
  assert.equal(initial.catalog,false,'Special Education catalog must stay lazy on homepage');
  assert.equal(initial.structure,false,'ENEEGYL structure must stay lazy on homepage');
  assert.equal(initial.heavy,0,'Heavy Special Education scripts must stay lazy on homepage');
}

async function openSettingsIfNeeded(page,selector){
  const field=page.locator(selector);
  if(await field.isVisible()) return;
  const toggle=page.locator('#tutorMount .tutor-mobile-settings-toggle');
  if(await toggle.count()) await toggle.click();
  await page.waitForSelector(selector,{state:'visible',timeout:10000});
}

async function openGeneral(page,zone='middle',role='guardian'){
  await page.evaluate(({zone,role})=>{
    history.replaceState({},'','/'+zone+'/'+role+'/tutor');
    window.dispatchEvent(new PopStateEvent('popstate'));
    document.getElementById('tutorView')?.removeAttribute('hidden');
    window.AITutor.render({zoneId:zone,roleId:role,lang:'el'});
  },{zone,role});
  await page.waitForSelector('#tutorGrade',{state:'attached',timeout:15000});
  assert.equal(await page.locator('#tutorSchoolTrack').count(),0,'General tutor must not expose retired school selector');
  assert.equal(await page.locator('#tutorSpecialSchoolContext').count(),0,'General tutor must not show Special Education context');
  assert.equal(await page.evaluate(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG),false,'General tutor must not load Special Education catalog');
}

async function openSpecial(page,{track,zone,role='guardian',grade,subject='' }){
  const query=new URLSearchParams({schoolTrack:track});
  if(grade) query.set('grade',grade);
  if(subject) query.set('subject',subject);
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render&&window.AITutorRenderHost?.eventName,{timeout:30000});
  await page.evaluate(({zone,role,query})=>{
    history.replaceState({},'','/'+zone+'/'+role+'/tutor?'+query);
    window.dispatchEvent(new PopStateEvent('popstate'));
    document.getElementById('tutorView')?.removeAttribute('hidden');
    window.AITutor.render({zoneId:zone,roleId:role,lang:'el'});
  },{zone,role,query:query.toString()});
  await page.waitForSelector('#tutorSpecialSchoolContext',{state:'attached',timeout:20000});
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,{timeout:25000});
  await page.waitForFunction(({grade,subject})=>
    (!grade||document.getElementById('tutorGrade')?.value===grade)&&
    (!subject||document.getElementById('tutorSubject')?.value===subject),
    {grade,subject},{timeout:25000});
  await openSettingsIfNeeded(page,'#tutorGrade');
  assert.equal(await page.locator('#tutorSchoolTrack').count(),0,'Special deep-link flow must not restore retired selector');
}

async function assertSimpleQuiz(page,label){
  const b=page.locator('#tutorMount [data-study-tool="quiz"]');
  await b.waitFor({state:'attached',timeout:10000});
  assert.equal(await b.getAttribute('data-special-simple-quiz'),'1',label+': simplified quiz adapter missing');
}

try{
  for(const [label,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]){
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:')) errors.push(m.text());});
    await prepare(page,viewport);

    await openGeneral(page);
    const generalQuiz=page.locator('#tutorMount [data-study-tool="quiz"]');
    await generalQuiz.waitFor({state:'attached',timeout:10000});
    assert.notEqual(await generalQuiz.getAttribute('data-special-simple-quiz'),'1',label+': Special Education quiz leaked into general tutor');

    await openSpecial(page,{track:'special-gymnasium',zone:'middle',grade:'a',subject:'special-gym-a-biology'});
    assert.match(await page.locator('#tutorSpecialSchoolContext').innerText(),/Ειδικό Γυμνάσιο/i,label+': Special Gymnasium banner missing');
    await assertSimpleQuiz(page,label+' Special Gymnasium');
    const bio=await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})));
    assert.equal(bio.filter(x=>!x.value.includes('.action-')).length,14,label+': Biology A mapped sections changed');
    assert.equal(bio.filter(x=>x.value.includes('.action-')).length,7,label+': Biology A support actions changed');

    await openSpecial(page,{track:'special-lyceum',zone:'high',grade:'a'});
    assert.match(await page.locator('#tutorSpecialSchoolContext').innerText(),/Ειδικό Λύκειο/i,label+': Special Lyceum banner missing');
    await assertSimpleQuiz(page,label+' Special Lyceum');
    const sl=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
    assert.ok(sl.length>0&&sl.every(id=>id.startsWith('special-lyceum-a-')),label+': Special Lyceum subject isolation failed');

    await openSpecial(page,{track:'eneegyl',zone:'high',grade:'gym-d',subject:'eneegyl-gym-d-economics'});
    assert.match(await page.locator('#tutorSpecialSchoolContext').innerText(),/ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./i,label+': ENEEGYL banner missing');
    await assertSimpleQuiz(page,label+' ENEEGYL');
    const grades=await page.locator('#tutorGrade option').evaluateAll(els=>els.map(e=>e.value));
    assert.deepEqual(grades,['gym-a','gym-b','gym-c','gym-d','lyc-a','lyc-b','lyc-c','lyc-d'],label+': ENEEGYL grade order changed');
    const ctx=await page.locator('#tutorContextBox').innerText();
    assert.match(ctx,/Δ΄ Γυμνασίου/i,label+': ENEEGYL grade identity missing');
    assert.doesNotMatch(ctx,/Γενικό Λύκειο/i,label+': General Lyceum framing leaked into ENEEGYL');

    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
    assert.ok(noOverflow,label+': horizontal overflow');
    assert.deepEqual(errors,[],label+': browser errors: '+errors.join('\n'));
    await page.close();
  }
  console.log('Special Education AI Help passed on desktop/mobile with clean general tutor and lazy dedicated deep-link contexts.');
}finally{await browser.close();}
