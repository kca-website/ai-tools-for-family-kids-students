import { chromium } from 'playwright';
const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_CURRICULUM_RESOLVER,{timeout:30000});
  const audit=await page.evaluate(()=>{
    const r=window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    const primaryA=r.getSubjects('primary','a');
    const env=primaryA.filter(s=>(s.subjectLabelEl||'').startsWith('Μελέτη Περιβάλλοντος'));
    const mathA=r.getSubject('middle','a','math-a-gymnasiou');
    const englishD=r.getSubject('primary','d','english-d-dimotikou');
    return {primaryAEnvironmentCount:env.length,environmentQuizId:env[0]?.quizId||'',environmentTopics:env[0]?.topics?.length||0,mathATopics:mathA?.topics?.map(t=>t.labelEl)||[],englishDTopics:englishD?.topics?.map(t=>t.labelEl)||[]};
  });
  if(audit.primaryAEnvironmentCount!==1) throw new Error('Environment Studies duplicate remains in Primary A');
  if(audit.environmentQuizId!=='environment-a-dimotikou') throw new Error('Environment Studies quiz alias not resolved');
  if(audit.environmentTopics<3) throw new Error('Environment Studies topics missing');
  if(!audit.mathATopics.some(x=>/Φυσικοί αριθμοί/.test(x))) throw new Error('Middle A mathematics official sections not resolved');
  if(audit.englishDTopics.length<3) throw new Error('Primary D English topic anchors not resolved');
  const highA=await page.evaluate(()=>window.AITOOLSKIDS_CURRICULUM_RESOLVER.getSubjects('high','a').map(s=>s.quizId||s.id));
  if(new Set(highA).size!==highA.length) throw new Error('Duplicate High School course identity remains');

  await page.goto(BASE+'/teacher-assistant.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.selectOption('#context','middle');
  await page.selectOption('#grade','a');
  const mathOption=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/Μαθηματικά/.test(o.textContent))?.value||'');
  if(!mathOption) throw new Error('Teacher Assistant missing Middle A mathematics');
  await page.selectOption('#subject',mathOption);
  const units=(await page.locator('#unit option').allTextContents()).map(x=>x.trim());
  if(units.some(x=>x.startsWith('Δεν υπάρχει χαρτογραφημένη ενότητα'))) throw new Error('Teacher Assistant still reports Middle A mathematics unmapped');
  if(errors.length) throw new Error(errors.join('\n'));
  console.log(JSON.stringify(audit,null,2));
} finally { await browser.close(); }
