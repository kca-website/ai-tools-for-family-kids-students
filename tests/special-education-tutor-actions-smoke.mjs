import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function openSettings(page,selector){
  if(await page.locator(selector).isVisible()) return;
  const toggle=page.locator('#tutorMount .tutor-mobile-settings-toggle');
  if(await toggle.count()) await toggle.click();
  await page.waitForSelector(selector,{state:'visible',timeout:10000});
}
async function openSpecial(page,{track,zone,grade,subject='' }){
  const q=new URLSearchParams({schoolTrack:track,grade}); if(subject) q.set('subject',subject);
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render&&window.AITutorRenderHost?.eventName,{timeout:30000});
  await page.evaluate(({zone,q})=>{
    history.replaceState({},'','/'+zone+'/guardian/tutor?'+q);
    window.dispatchEvent(new PopStateEvent('popstate'));
    document.getElementById('tutorView')?.removeAttribute('hidden');
    window.AITutor.render({zoneId:zone,roleId:'guardian',lang:'el'});
  },{zone,q:q.toString()});
  await page.waitForSelector('#tutorSpecialSchoolContext',{state:'attached',timeout:20000});
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG&&window.AITOOLSKIDS_SPECIAL_TUTOR_ACTIONS?.version===1,{timeout:25000});
  await page.waitForFunction(({grade,subject})=>(!grade||document.getElementById('tutorGrade')?.value===grade)&&(!subject||document.getElementById('tutorSubject')?.value===subject),{grade,subject},{timeout:25000});
  await openSettings(page,'#tutorTopic');
}
async function choose(page,selector,value){await openSettings(page,selector);await page.selectOption(selector,value);await page.waitForTimeout(220);}
async function assertActions(page,label){
  const rows=await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})));
  const a=rows.filter(x=>x.value.includes('.action-'));
  assert.equal(a.length,7,label+': expected 7 support actions, got '+a.length);
  assert.ok(a.some(x=>/Εξήγησέ μου το απλά/i.test(x.text)),label+': simple explanation missing');
  assert.ok(a.some(x=>/βήμα-βήμα/i.test(x.text)),label+': step-by-step missing');
  assert.ok(a.some(x=>/χωρίς έτοιμη λύση/i.test(x.text)),label+': no-ready-solution action missing');
  assert.ok(a.some(x=>/3 απλές ερωτήσεις/i.test(x.text)),label+': simple check missing');
}

try{
 for(const [label,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport});
  await page.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
  const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:')) errors.push(m.text());});

  await openSpecial(page,{track:'special-gymnasium',zone:'middle',grade:'a'});
  const sg=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  const sgSubject=sg.find(id=>id.startsWith('special-gym-a-')); assert.ok(sgSubject,label+': Special Gymnasium subject missing');
  await choose(page,'#tutorSubject',sgSubject); await assertActions(page,label+' Special Gymnasium');

  await openSpecial(page,{track:'special-lyceum',zone:'high',grade:'a'}); await assertActions(page,label+' Special Lyceum');

  await openSpecial(page,{track:'eneegyl',zone:'high',grade:'gym-a'}); await assertActions(page,label+' ENEEGYL Gymnasium');
  await choose(page,'#tutorGrade','lyc-a');
  const en=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(en.includes('eneegyl-lyc-a-economics'),label+': ENEEGYL Economics missing');
  await choose(page,'#tutorSubject','eneegyl-lyc-a-economics'); await assertActions(page,label+' ENEEGYL A');

  const failures=await page.evaluate(()=>{
    const C=window.AITOOLSKIDS_TUTOR_CATALOG; const out=[];
    for(const [z,grades] of Object.entries(C?.zones||{})) for(const [g,subjects] of Object.entries(grades||{})) for(const s of subjects||[]){
      if(!s?.specialEducation) continue; const n=(s.topics||[]).filter(t=>t.specialSupportAction).length; if(n!==7) out.push(z+'/'+g+'/'+s.id+':'+n);
    }
    return out;
  });
  assert.deepEqual(failures,[],label+': incomplete action menus');
  assert.deepEqual(errors,[],label+': browser errors: '+errors.join('\n'));
  await page.close();
 }
 console.log('Special Education action menu passed on desktop/mobile with 7 actions per special subject.');
}finally{await browser.close();}
