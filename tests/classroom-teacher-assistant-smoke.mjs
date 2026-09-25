import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const page=await browser.newPage({viewport});
    await page.goto(`${BASE}/classroom.html`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForURL(/\/teacher-assistant\.html(?:\?.*)?$/,{timeout:10000});
    assert.match(await page.locator('h1').innerText(),/Εκπαιδευτικό υλικό|AI Teacher Assistant/i,'classroom redirect must land on Teacher Assistant');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert.ok(overflow<=1,`Teacher assistant redirect target horizontal overflow: ${overflow}`);
    await page.close();
  }

  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(`${BASE}/teacher-assistant.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('.task.active[data-task="lesson"]');
  assert.equal(await page.locator('script[src*="js.puter.com"]').count(),0,'Puter must not load before explicit consent/connect');
  assert.match(await page.locator('.privacy').innerText(),/Μην εισάγεις ονοματεπώνυμα/);
  assert.equal(await page.evaluate(()=>localStorage.length),0,'Teacher assistant must not create localStorage history');
  assert.equal(await page.evaluate(()=>sessionStorage.length),0,'Teacher assistant must not create sessionStorage history');

  await page.selectOption('#context','gel');
  await page.selectOption('#grade','a');
  const biologyOption=await page.locator('#subject option').evaluateAll((options)=>options.find(o=>/Βιολογία/.test(o.textContent||''))?.value||'');
  assert.ok(biologyOption,'Teacher Assistant GEL A Biology subject missing');
  await page.selectOption('#subject',biologyOption);
  await page.waitForTimeout(80);
  const biologyUnits=await page.locator('#unit option').allInnerTexts();
  assert.equal(biologyUnits.length,14,'Teacher Assistant GEL A Biology should expose 14 documented mapped topics');
  assert.match(await page.locator('#curriculumNote').innerText(),/αναλυτικό χάρτη/i,'Teacher Assistant must label GEL Biology topics as a documented navigation map');
  assert.ok(await page.locator('#curriculumNote a[href^="https://"]').count()>=1,'Teacher Assistant mapped curriculum must expose a source link');

  assert.equal(await page.locator('#groqBtn').count(),1,'Teacher Assistant must expose the account-free Groq generation route');
  assert.equal(await page.locator('.task[data-task="assessment"]').count(),1,'Teacher Assistant must expose the dedicated assessment-sheet task');
  await page.locator('.task[data-task="assessment"]').click();
  assert.equal(await page.locator('#assessmentOptions').isVisible(),true,'Assessment controls must appear when assessment task is selected');
  await page.selectOption('#assessmentKind','diagnostic');
  await page.selectOption('#assessmentDifficulty','mixed');
  await page.selectOption('#assessmentCount','8');
  await page.selectOption('#assessmentScale','20');
  const assessmentPrompt=await page.evaluate(()=>promptText());
  assert.match(assessmentPrompt,/Διαγνωστική αξιολόγηση/,'Assessment prompt must include selected assessment kind');
  assert.match(assessmentPrompt,/8 ερωτήσεις/,'Assessment prompt must include selected question count');
  assert.match(assessmentPrompt,/Φύλλο μαθητή/,'Assessment prompt must require a separate student sheet');
  assert.match(assessmentPrompt,/κλειδί απαντήσεων/,'Assessment prompt must require teacher answer key');
  assert.equal(await page.locator('#puterBtn').count(),1,'Teacher Assistant must expose Puter only as an explicit alternative');
  assert.equal(await page.locator('#teacherToolsDetails').count(),1,'Teacher Assistant must expose a collapsible specialised-tools section');
  assert.equal(await page.locator('#teacherToolsDetails').getAttribute('open'),null,'Specialised-tools section should be collapsed by default');
  assert.ok(await page.locator('#teacherToolsGrid .teacher-tool-card').count()>=2,'Teacher Assistant should render specialised tool recommendations');
  assert.match(await page.locator('#teacherToolsSummary').innerText(),/Βιολογία|Σχέδιο μαθήματος/,'Recommendations should react to task/subject context');
  const toolGuideHrefs=await page.locator('#teacherToolsGrid a').evaluateAll((links)=>links.map(a=>a.getAttribute('href')||''));
  assert.ok(toolGuideHrefs.every(h=>/^\/tools\/.+\.html$/.test(h)),'Teacher tool recommendations should route through local tool guide pages');
  assert.equal(await page.locator('script[src*="js.puter.com"]').count(),0,'Puter must remain unloaded until the user explicitly chooses it');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,`Teacher assistant mobile horizontal overflow: ${overflow}`);
  assert.deepEqual(errors,[],`Teacher assistant browser errors: ${errors.join('\n')}`);
  await page.close();

  console.log('Classroom teacher-job navigator + stateless AI Teacher Assistant smoke passed.');
}finally{
  await browser.close();
}
