import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});
function collect(page,errors){page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:')) errors.push(m.text());});}
async function open(page,{zone,role,track,grade,subject='' }){
 const q=new URLSearchParams({schoolTrack:track}); if(grade)q.set('grade',grade);if(subject)q.set('subject',subject);
 await page.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
 await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.AITutor?.render&&window.AITutorRenderHost?.eventName,{timeout:30000});
 assert.equal(await page.evaluate(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG),false,'special catalog should be lazy');
 await page.evaluate(({zone,role,q})=>{
   history.replaceState({},'','/'+zone+'/'+role+'/tutor?'+q);
   window.dispatchEvent(new PopStateEvent('popstate'));
   document.getElementById('tutorView')?.removeAttribute('hidden');
   window.AITutor.render({zoneId:zone,roleId:role,lang:'el'});
 },{zone,role,q:q.toString()});
 await page.waitForSelector('#tutorSpecialSchoolContext',{state:'attached',timeout:20000});
 await page.waitForFunction(({grade,subject,zone})=>
   location.pathname.startsWith('/'+zone+'/')&&
   (!grade||document.getElementById('tutorGrade')?.value===grade)&&
   (!subject||document.getElementById('tutorSubject')?.value===subject)&&
   !!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,{grade,subject,zone},{timeout:25000});
 assert.equal(await page.locator('#tutorSchoolTrack').count(),0,'retired selector must stay absent');
}
try{
 for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
  const label=viewport.width<600?'mobile':'desktop';
  const sg=await browser.newPage({viewport});const e1=[];collect(sg,e1);
  await open(sg,{zone:'middle',role:'student',track:'special-gymnasium',grade:'a',subject:'special-gym-a-language-comprehension'});
  assert.match(await sg.locator('#tutorSpecialSchoolContext').innerText(),/Ειδικό Γυμνάσιο/i,label+': SG banner missing');
  assert.match(await sg.locator('#tutorContextBox').innerText(),/Γλωσσική Διδασκαλία|Ειδικό Γυμνάσιο/i,label+': SG context failed');
  assert.deepEqual(e1,[],label+': SG errors '+e1.join('\n'));await sg.close();

  const sl=await browser.newPage({viewport});const e2=[];collect(sl,e2);
  await open(sl,{zone:'high',role:'guardian',track:'special-lyceum',grade:'b'});
  assert.equal(await sl.inputValue('#tutorGrade'),'b',label+': SL grade failed');
  assert.match(await sl.locator('#tutorSpecialSchoolContext').innerText(),/Ειδικό Λύκειο/i,label+': SL banner missing');
  assert.ok(await sl.locator('#tutorSubject option').count()>0,label+': SL subjects missing');
  assert.deepEqual(e2,[],label+': SL errors '+e2.join('\n'));await sl.close();

  const en=await browser.newPage({viewport});const e3=[];collect(en,e3);
  await open(en,{zone:'high',role:'guardian',track:'eneegyl',grade:'lyc-b',subject:'eneegyl-b-economy-accounting-basics'});
  assert.equal(await en.inputValue('#tutorGrade'),'lyc-b',label+': ENEEGYL grade failed');
  assert.equal(await en.inputValue('#tutorSubject'),'eneegyl-b-economy-accounting-basics',label+': ENEEGYL subject failed');
  assert.match(await en.locator('#tutorContextBox').innerText(),/Λογιστικ|ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\./i,label+': ENEEGYL context failed');
  assert.deepEqual(e3,[],label+': ENEEGYL errors '+e3.join('\n'));await en.close();
 }
 console.log('Special Education deep links passed on desktop/mobile with dedicated-context UI.');
}finally{await browser.close();}
