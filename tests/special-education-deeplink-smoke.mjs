import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function openDeepLink(page,{zone,role,track,grade,subject}){
  const params=new URLSearchParams({schoolTrack:track,grade,subject});
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.goto(`${LOCAL}?${params.toString()}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render && window.AITutorRenderHost?.eventName && window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,{timeout:30000});
  await page.evaluate(({zone,role,query})=>{
    history.replaceState({},'',`/${zone}/${role}/tutor?${query}`);
    const view=document.getElementById('tutorView');
    if(view) view.hidden=false;
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.AITutor.render({zoneId:zone,roleId:role,lang:'el'});
  },{zone,role,query:params.toString()});
  await page.waitForSelector('#tutorSchoolTrack',{state:'attached',timeout:10000});
  await page.waitForFunction(({track,grade,subject})=>{
    return document.getElementById('tutorSchoolTrack')?.value===track
      && document.getElementById('tutorGrade')?.value===grade
      && document.getElementById('tutorSubject')?.value===subject;
  },{track,grade,subject},{timeout:10000});
}

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const label=viewport.width<600?'mobile':'desktop';

    const sg=await browser.newPage({viewport});
    const sgErrors=[];
    sg.on('pageerror',(err)=>sgErrors.push(err.message));
    sg.on('console',(msg)=>{if(msg.type()==='error') sgErrors.push(msg.text());});
    await openDeepLink(sg,{zone:'middle',role:'student',track:'special-gymnasium',grade:'a',subject:'special-gym-a-language-comprehension'});
    assert.equal(await sg.inputValue('#tutorSchoolTrack'),'special-gymnasium',`${label}: Special Gymnasium track deep link failed`);
    assert.equal(await sg.inputValue('#tutorGrade'),'a',`${label}: Special Gymnasium grade deep link failed`);
    assert.equal(await sg.inputValue('#tutorSubject'),'special-gym-a-language-comprehension',`${label}: Special Gymnasium subject deep link failed`);
    assert.match(await sg.locator('#tutorContextBox').innerText(),/Γλωσσική Διδασκαλία|Ειδικό Γυμνάσιο/i,`${label}: Special Gymnasium context did not follow deep link`);
    assert.deepEqual(sgErrors,[],`${label}: Special Gymnasium deep-link browser errors: ${sgErrors.join('\n')}`);
    await sg.close();

    const en=await browser.newPage({viewport});
    const enErrors=[];
    en.on('pageerror',(err)=>enErrors.push(err.message));
    en.on('console',(msg)=>{if(msg.type()==='error') enErrors.push(msg.text());});
    await openDeepLink(en,{zone:'high',role:'guardian',track:'eneegyl',grade:'b',subject:'eneegyl-b-economy-accounting-basics'});
    assert.equal(await en.inputValue('#tutorSchoolTrack'),'eneegyl',`${label}: ENEEGYL track deep link failed`);
    assert.equal(await en.inputValue('#tutorGrade'),'b',`${label}: ENEEGYL grade deep link failed`);
    assert.equal(await en.inputValue('#tutorSubject'),'eneegyl-b-economy-accounting-basics',`${label}: ENEEGYL subject deep link failed`);
    assert.match(await en.locator('#tutorContextBox').innerText(),/Λογιστικ|ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./i,`${label}: ENEEGYL context did not follow deep link`);
    assert.deepEqual(enErrors,[],`${label}: ENEEGYL deep-link browser errors: ${enErrors.join('\n')}`);
    await en.close();
  }

  console.log('Special Education AI Help deep links passed on desktop/mobile.');
}finally{
  await browser.close();
}
