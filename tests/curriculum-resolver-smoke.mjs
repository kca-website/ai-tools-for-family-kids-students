import { chromium } from 'playwright';
const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Third-party loads (fonts/CDNs) can fail behind proxies or offline; same-origin
  // failures still fail the test through the requestfailed/response listeners.
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  page.on('requestfailed',r=>{const h=new URL(r.url()).hostname;if(h==='127.0.0.1'||h==='localhost')errors.push(`request failed: ${r.url()}`);});
  page.on('response',r=>{const h=new URL(r.url()).hostname;if((h==='127.0.0.1'||h==='localhost')&&r.status()>=400)errors.push(`HTTP ${r.status()}: ${r.url()}`);});
  await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_CURRICULUM_RESOLVER,{timeout:30000});
  const audit=await page.evaluate(()=>{
    const r=window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    const primaryA=r.getSubjects('primary','a');
    const env=primaryA.filter(s=>(s.subjectLabelEl||'').startsWith('Μελέτη Περιβάλλοντος'));
    const mathA=r.getSubject('middle','a','mathimatika-a-gymnasiou');
    const englishD=r.getSubject('primary','d','english-d-dimotikou');
    const historyCPrimary=r.getSubject('primary','c','istoria-c-dimotikou');
    const mathCGym=r.getSubject('middle','c','mathimatika-g-gymnasiou');
    const physicsBGym=r.getSubject('middle','b','physics-gymnasiou');
    const physicsCGym=r.getSubject('middle','c','fysiki-g-gymnasiou');
    const languageCGym=r.getSubject('middle','c','glossa-gymnasiou');
    const chemistryCGym=r.getSubject('middle','c','chimeia-g-gymnasiou');
    const biologyBGym=r.getSubject('middle','b','biologia-b-gymnasiou');
    const biologyALyc=r.getSubject('high','a','biologia-a-lykeiou');
    const mathAPrimary=r.getSubject('primary','a','math-a-dimotikou');
    const languageAPrimary=r.getSubject('primary','a','glossa-a-dimotikou');
    const languageBPrimary=r.getSubject('primary','b','glossa-b-dimotikou');
    const mathBPrimary=r.getSubject('primary','b','math-b-dimotikou');
    const mathCPrimary=r.getSubject('primary','c','math-c-dimotikou');
    const mathDPrimary=r.getSubject('primary','d','math-d-dimotikou');
    const languageCPrimary=r.getSubject('primary','c','glossa-c-dimotikou');
    const historyDPrimary=r.getSubject('primary','d','istoria-d-dimotikou');
    const historyEPrimary=r.getSubject('primary','e','istoria-e-dimotikou');
    const languageDPrimary=r.getSubject('primary','d','glossa-d-dimotikou');
    const languageEPrimary=r.getSubject('primary','e','glossa-e-dimotikou');
    const mathEPrimary=r.getSubject('primary','e','math-e-dimotikou');
    const mathStPrimary=r.getSubject('primary','st','math-st-dimotikou');
    const scienceStPrimary=r.getSubject('primary','st','science-st-dimotikou');
    const englishAGym=r.getSubject('middle','a','english-a-gymnasiou');
    const englishBGym=r.getSubject('middle','b','english-b-gymnasiou');
    return {
      primaryAEnvironmentCount:env.length,
      environmentQuizId:env[0]?.quizId||'',
      environmentTopics:env[0]?.topics?.length||0,
      mathATopics:mathA?.topics?.map(t=>t.labelEl)||[],
      englishDTopics:englishD?.topics?.map(t=>t.labelEl)||[],
      historyCPrimaryMode:historyCPrimary?.topicMode||'',
      historyCPrimaryTopics:historyCPrimary?.topics?.map(t=>t.labelEl)||[],
      mathCGymMode:mathCGym?.topicMode||'',
      mathCGymTopics:mathCGym?.topics?.map(t=>t.labelEl)||[],
      physicsBGymMode:physicsBGym?.topicMode||'',
      physicsBGymTopics:physicsBGym?.topics?.map(t=>t.labelEl)||[],
      physicsCGymMode:physicsCGym?.topicMode||'',
      physicsCGymTopics:physicsCGym?.topics?.map(t=>t.labelEl)||[],
      languageCGymMode:languageCGym?.topicMode||'',
      languageCGymTopics:languageCGym?.topics?.map(t=>t.labelEl)||[],
      chemistryCGymMode:chemistryCGym?.topicMode||'',
      chemistryCGymTopics:chemistryCGym?.topics?.map(t=>t.labelEl)||[],
      biologyBGymMode:biologyBGym?.topicMode||'',
      biologyBGymTopics:biologyBGym?.topics?.map(t=>t.labelEl)||[],
      biologyALycMode:biologyALyc?.topicMode||'',
      biologyALycTopics:biologyALyc?.topics?.map(t=>t.labelEl)||[],
      mathAPrimaryMode:mathAPrimary?.topicMode||'',
      mathAPrimaryTopics:mathAPrimary?.topics?.map(t=>t.labelEl)||[],
      languageAPrimaryMode:languageAPrimary?.topicMode||'',
      languageAPrimaryTopics:languageAPrimary?.topics?.map(t=>t.labelEl)||[],
      languageBPrimaryMode:languageBPrimary?.topicMode||'',
      languageBPrimaryTopics:languageBPrimary?.topics?.map(t=>t.labelEl)||[],
      mathBPrimaryMode:mathBPrimary?.topicMode||'',
      mathBPrimaryTopics:mathBPrimary?.topics?.map(t=>t.labelEl)||[],
      mathCPrimaryMode:mathCPrimary?.topicMode||'',
      mathCPrimaryTopics:mathCPrimary?.topics?.map(t=>t.labelEl)||[],
      mathDPrimaryMode:mathDPrimary?.topicMode||'',
      mathDPrimaryTopics:mathDPrimary?.topics?.map(t=>t.labelEl)||[],
      languageCPrimaryMode:languageCPrimary?.topicMode||'',
      languageCPrimaryTopics:languageCPrimary?.topics?.map(t=>t.labelEl)||[],
      historyDPrimaryMode:historyDPrimary?.topicMode||'',
      historyDPrimaryTopics:historyDPrimary?.topics?.map(t=>t.labelEl)||[],
      historyEPrimaryMode:historyEPrimary?.topicMode||'',
      historyEPrimaryTopics:historyEPrimary?.topics?.map(t=>t.labelEl)||[],
      languageDPrimaryMode:languageDPrimary?.topicMode||'',
      languageDPrimaryTopics:languageDPrimary?.topics?.map(t=>t.labelEl)||[],
      languageEPrimaryMode:languageEPrimary?.topicMode||'',
      languageEPrimaryTopics:languageEPrimary?.topics?.map(t=>t.labelEl)||[],
      mathEPrimaryMode:mathEPrimary?.topicMode||'',
      mathEPrimaryTopics:mathEPrimary?.topics?.map(t=>t.labelEl)||[],
      mathStPrimaryMode:mathStPrimary?.topicMode||'',
      mathStPrimaryTopics:mathStPrimary?.topics?.map(t=>t.labelEl)||[],
      scienceStPrimaryMode:scienceStPrimary?.topicMode||'',
      scienceStPrimaryTopics:scienceStPrimary?.topics?.map(t=>t.labelEl)||[],
      englishAGymMode:englishAGym?.topicMode||'',
      englishAGymTopics:englishAGym?.topics?.map(t=>t.labelEl)||[],
      englishBGymMode:englishBGym?.topicMode||'',
      englishBGymTopics:englishBGym?.topics?.map(t=>t.labelEl)||[]
    };
  });
  if(audit.primaryAEnvironmentCount!==1) throw new Error('Environment Studies duplicate remains in Primary A');
  if(audit.environmentQuizId!=='environment-a-dimotikou') throw new Error('Environment Studies quiz alias not resolved');
  if(audit.environmentTopics<3) throw new Error('Environment Studies topics missing');
  // Math A Gymnasium follows selectionPolicy 'exact-current-diagnostic-topics':
  // it must resolve official book sections (Α.x.y codes) for the current diagnostic topics.
  // Book units are resolved either as the main list or, when 2026-27 annual guidance
  // topics take priority, as a second 'book units' group; the topic-count thresholds
  // below prove the book units are present.
  const BOOK_UNIT_MODES=new Set(['verified-annual','verified-official-sections','mapped-navigation']);
  if(!audit.mathATopics.some(x=>/^Α\.\d+\.\d+ — /.test(x))) throw new Error('Middle A mathematics official sections not resolved');
  if(audit.englishDTopics.length<3) throw new Error('Primary D English topic anchors not resolved');
  if(!BOOK_UNIT_MODES.has(audit.historyCPrimaryMode) || audit.historyCPrimaryTopics.length<10) throw new Error('Primary C History verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.mathCGymMode) || audit.mathCGymTopics.length<7) throw new Error('Middle C Mathematics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.physicsBGymMode) || audit.physicsBGymTopics.length<8) throw new Error('Middle B Physics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.physicsCGymMode) || audit.physicsCGymTopics.length<11) throw new Error('Middle C Physics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.languageCGymMode) || audit.languageCGymTopics.length<8) throw new Error('Middle C Language verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.chemistryCGymMode) || audit.chemistryCGymTopics.length<15) throw new Error('Middle C Chemistry verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.biologyBGymMode) || audit.biologyBGymTopics.length<7) throw new Error('Middle B Biology verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.biologyALycMode) || audit.biologyALycTopics.length<12) throw new Error('High A Biology verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.mathAPrimaryMode) || audit.mathAPrimaryTopics.length<9) throw new Error('Primary A Mathematics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.languageAPrimaryMode) || audit.languageAPrimaryTopics.length<10) throw new Error('Primary A Language verified book sections not resolved');
  if(audit.languageAPrimaryTopics.some(x=>/^[a-z0-9-]+\.[a-z0-9.-]+$/i.test(x))) throw new Error('Primary A Language leaked internal topic ids');
  if(!BOOK_UNIT_MODES.has(audit.languageBPrimaryMode) || audit.languageBPrimaryTopics.length<24) throw new Error('Primary B Language verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.mathBPrimaryMode) || audit.mathBPrimaryTopics.length<9) throw new Error('Primary B Mathematics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.mathCPrimaryMode) || audit.mathCPrimaryTopics.length<9) throw new Error('Primary C Mathematics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.mathDPrimaryMode) || audit.mathDPrimaryTopics.length<9) throw new Error('Primary D Mathematics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.languageCPrimaryMode) || audit.languageCPrimaryTopics.length<14) throw new Error('Primary C Language verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.historyDPrimaryMode) || audit.historyDPrimaryTopics.length<6) throw new Error('Primary D History verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.historyEPrimaryMode) || audit.historyEPrimaryTopics.length<7) throw new Error('Primary E History verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.languageDPrimaryMode) || audit.languageDPrimaryTopics.length<16) throw new Error('Primary D Language verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.languageEPrimaryMode) || audit.languageEPrimaryTopics.length<17) throw new Error('Primary E Language verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.mathEPrimaryMode) || audit.mathEPrimaryTopics.length<9) throw new Error('Primary E Mathematics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.mathStPrimaryMode) || audit.mathStPrimaryTopics.length<6) throw new Error('Primary ST Mathematics verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.scienceStPrimaryMode) || audit.scienceStPrimaryTopics.length<13) throw new Error('Primary ST Science verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.englishAGymMode) || audit.englishAGymTopics.length<9) throw new Error('Middle A English verified book sections not resolved');
  if(!BOOK_UNIT_MODES.has(audit.englishBGymMode) || audit.englishBGymTopics.length<8) throw new Error('Middle B English verified book sections not resolved');
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
