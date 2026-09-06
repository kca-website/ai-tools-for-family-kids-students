import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function openDeepLink(page,{startZone,expectedZone,role,track,grade,subject=''}){
  const params=new URLSearchParams({schoolTrack:track});
  if(grade) params.set('grade',grade);
  if(subject) params.set('subject',subject);
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render&&window.AITutorRenderHost?.eventName,{timeout:30000});
  assert.equal(await page.evaluate(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG),false,'special catalog should not be globally preloaded');

  await page.evaluate(({startZone,role,query})=>{
    history.replaceState({},'',`/${startZone}/${role}/tutor?${query}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    const view=document.getElementById('tutorView');
    if(view) view.hidden=false;
    window.AITutor.render({zoneId:startZone,roleId:role,lang:'el'});
  },{startZone,role,query:params.toString()});

  await page.waitForSelector('#tutorSchoolTrack',{state:'attached',timeout:15000});
  await page.waitForFunction(({track,grade,subject,expectedZone})=>{
    const okTrack=document.getElementById('tutorSchoolTrack')?.value===track;
    const okGrade=!grade||document.getElementById('tutorGrade')?.value===grade;
    const okSubject=!subject||document.getElementById('tutorSubject')?.value===subject;
    return location.pathname.startsWith(`/${expectedZone}/`)&&okTrack&&okGrade&&okSubject;
  },{track,grade,subject,expectedZone},{timeout:25000});
}

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const label=viewport.width<600?'mobile':'desktop';

    const sg=await browser.newPage({viewport});
    const sgErrors=[];
    sg.on('pageerror',(err)=>sgErrors.push(err.message));
    sg.on('console',(msg)=>{if(msg.type()==='error') sgErrors.push(msg.text());});
    await openDeepLink(sg,{startZone:'high',expectedZone:'middle',role:'student',track:'special-gymnasium',grade:'a',subject:'special-gym-a-language-comprehension'});
    assert.equal(await sg.inputValue('#tutorSchoolTrack'),'special-gymnasium',`${label}: Special Gymnasium track deep link failed`);
    assert.match(await sg.locator('#tutorContextBox').innerText(),/Γλωσσική Διδασκαλία|Ειδικό Γυμνάσιο/i,`${label}: Special Gymnasium context failed`);
    assert.deepEqual(sgErrors,[],`${label}: Special Gymnasium deep-link errors: ${sgErrors.join('\n')}`);
    await sg.close();

    const sl=await browser.newPage({viewport});
    const slErrors=[];
    sl.on('pageerror',(err)=>slErrors.push(err.message));
    sl.on('console',(msg)=>{if(msg.type()==='error') slErrors.push(msg.text());});
    await openDeepLink(sl,{startZone:'middle',expectedZone:'high',role:'guardian',track:'special-lyceum',grade:'b'});
    assert.equal(await sl.inputValue('#tutorSchoolTrack'),'special-lyceum',`${label}: Special Lyceum track deep link failed`);
    assert.equal(await sl.inputValue('#tutorGrade'),'b',`${label}: Special Lyceum grade deep link failed`);
    assert.ok(await sl.locator('#tutorSubject option').count()>0,`${label}: Special Lyceum subject menu missing`);
    assert.match(await sl.locator('#tutorContextBox').innerText(),/Ειδικό Λύκειο|Special Lyceum/i,`${label}: Special Lyceum context failed`);
    assert.deepEqual(slErrors,[],`${label}: Special Lyceum deep-link errors: ${slErrors.join('\n')}`);
    await sl.close();

    const en=await browser.newPage({viewport});
    const enErrors=[];
    en.on('pageerror',(err)=>enErrors.push(err.message));
    en.on('console',(msg)=>{if(msg.type()==='error') enErrors.push(msg.text());});
    await openDeepLink(en,{startZone:'middle',expectedZone:'high',role:'guardian',track:'eneegyl',grade:'b',subject:'eneegyl-b-economy-accounting-basics'});
    assert.equal(await en.inputValue('#tutorSchoolTrack'),'eneegyl',`${label}: ENEEGYL track deep link failed`);
    assert.equal(await en.inputValue('#tutorSubject'),'eneegyl-b-economy-accounting-basics',`${label}: ENEEGYL subject deep link failed`);
    assert.match(await en.locator('#tutorContextBox').innerText(),/Λογιστικ|ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./i,`${label}: ENEEGYL context failed`);
    assert.deepEqual(enErrors,[],`${label}: ENEEGYL deep-link errors: ${enErrors.join('\n')}`);
    await en.close();
  }

  console.log('Unified Special Education AI Help deep links passed on desktop/mobile.');
}finally{
  await browser.close();
}
