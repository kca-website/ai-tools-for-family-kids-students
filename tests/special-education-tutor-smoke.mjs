import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function prepare(page,viewport){
  await page.setViewportSize(viewport);
  await page.route('**/_vercel/insights/script.js',(route)=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
  await page.route('**/api/tutor-assistant',(route)=>route.fulfill({
    status:200,
    contentType:'application/json',
    body:JSON.stringify({text:JSON.stringify({questions:[
      {q:'Ποια επιλογή ταιριάζει;',options:['Η πρώτη','Η δεύτερη'],correct:0,explanation:'Η πρώτη επιλογή ταιριάζει.'},
      {q:'Ποια απάντηση είναι σωστή;',options:['Η σωστή','Η λάθος'],correct:0,explanation:'Η πρώτη είναι η σωστή.'},
      {q:'Τι επιλέγουμε;',options:['Το σωστό','Το άλλο'],correct:0,explanation:'Επιλέγουμε το σωστό.'}
    ]})})
  }));
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render && window.AITutorRenderHost?.eventName,{timeout:30000});
  const globalSpecial=await page.evaluate(()=>({
    catalog:!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,
    eneegylStructure:!!window.ENEEGYL_2026_2027_STRUCTURE,
    heavyScripts:[...document.scripts].filter(s=>/special-education-(curriculum|learning|quiz|special-gymnasium|special-lyceum|tutor-catalog)/.test(s.src)).length
  }));
  assert.equal(globalSpecial.catalog,false,'Special Education catalog should not load on the homepage');
  assert.equal(globalSpecial.eneegylStructure,false,'ENEEGYL structure should not load on the homepage');
  assert.equal(globalSpecial.heavyScripts,0,'Heavy Special Education scripts should not load globally');
}

async function openSettingsIfNeeded(page,selector){
  const field=page.locator(selector);
  if(await field.isVisible()) return;
  const toggle=page.locator('#tutorMount .tutor-mobile-settings-toggle');
  if(await toggle.count()) await toggle.click();
  await page.waitForSelector(selector,{state:'visible',timeout:10000});
}

async function renderTutor(page,zoneId,roleId){
  await page.evaluate(({zoneId,roleId})=>{
    history.replaceState({},'',`/${zoneId}/${roleId}/tutor`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    const view=document.getElementById('tutorView');
    if(view) view.hidden=false;
    window.AITutor.render({zoneId,roleId,lang:'el'});
  },{zoneId,roleId});
  await page.waitForSelector('#tutorSchoolTrack',{state:'attached',timeout:15000});
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_SIMPLE_QUIZ,{timeout:15000});
  await openSettingsIfNeeded(page,'#tutorSchoolTrack');
}

async function selectTrack(page,value){
  await openSettingsIfNeeded(page,'#tutorSchoolTrack');
  await page.selectOption('#tutorSchoolTrack',value);
  const targetZone=value==='special-gymnasium'||value==='general-middle'?'middle':'high';
  await page.waitForFunction(({value,targetZone})=>{
    return location.pathname.startsWith(`/${targetZone}/`)
      && document.getElementById('tutorSchoolTrack')?.value===value;
  },{value,targetZone},{timeout:20000});
  await page.waitForTimeout(120);
}

async function selectOption(page,selector,value){
  await openSettingsIfNeeded(page,selector);
  await page.selectOption(selector,value);
  await page.waitForTimeout(260);
}

async function assertSimpleQuizButton(page,label){
  const button=page.locator('#tutorMount [data-study-tool="quiz"]');
  await button.waitFor({state:'attached',timeout:10000});
  assert.equal(await button.getAttribute('data-special-simple-quiz'),'1',`${label}: Special Education did not switch to simplified quiz adapter`);
  assert.match(await button.innerText(),/απλό quiz 3 ερωτήσεων|simple 3-question quiz/i,`${label}: simplified quiz button label missing`);
}

async function assertGeneralQuizButton(page,label){
  const button=page.locator('#tutorMount [data-study-tool="quiz"]');
  await button.waitFor({state:'attached',timeout:10000});
  assert.notEqual(await button.getAttribute('data-special-simple-quiz'),'1',`${label}: Special Education quiz adapter leaked into general school`);
}

async function checkUnified(page,label){
  await renderTutor(page,'middle','guardian');
  const options=await page.locator('#tutorSchoolTrack option').evaluateAll((els)=>els.map((e)=>({value:e.value,text:e.textContent.trim(),disabled:e.disabled})));
  assert.deepEqual(options.map(x=>x.value),['general-middle','general-high','special-gymnasium','special-lyceum','eneegyl'],`${label}: unified school selector options are wrong`);
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'general-middle',`${label}: middle school should remain the initial default`);
  assert.ok(options.every(x=>!x.disabled),`${label}: every school type should be selectable from one AI Help`);
  await assertGeneralQuizButton(page,`${label} General Gymnasium`);

  assert.equal(await page.evaluate(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG),false,`${label}: special catalog loaded before selection`);
  await selectOption(page,'#tutorGrade','lyc-d');
  const dSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(dSubjects.includes('eneegyl-lyc-d-math-2026-27'),`${label}: exact D Lyceum Mathematics mapping missing`);
  await selectOption(page,'#tutorSubject','eneegyl-lyc-d-math-2026-27');
  const enMathDTopics=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(enMathDTopics.length,7,`${label}: ENEEGYL D Mathematics must expose 7 taught/exam anchors`);
  const enMathDContext=await page.locator('#tutorContextBox').innerText();
  assert.match(enMathDContext,/Διδακτέα-εξεταστέα ύλη 2026–27/i,`${label}: ENEEGYL D Mathematics must be labelled taught/exam syllabus`);

  await selectTrack(page,'special-gymnasium');
  await page.waitForFunction(()=>window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.hasVerifiedSpecialGymnasium,{timeout:20000});
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'special-gymnasium',`${label}: Special Gymnasium selection failed`);
  await assertSimpleQuizButton(page,`${label} Special Gymnasium`);
  assert.deepEqual((await page.locator('#tutorGrade option').evaluateAll(els=>els.map(e=>e.value))).sort(),['a','b','c'],`${label}: Special Gymnasium grades wrong`);
  await selectOption(page,'#tutorGrade','a');
  const sgSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(sgSubjects.includes('special-gym-a-language-comprehension')&&sgSubjects.includes('special-gym-a-math-problem-reading'),`${label}: Special Gymnasium detailed subjects missing`);
  assert.ok(sgSubjects.includes('special-gym-a-biology'),`${label}: Special Gymnasium A Biology annual mapping missing from subject menu`);
  await selectOption(page,'#tutorSubject','special-gym-a-biology');
  const bioAOptions=await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})));
  const bioASections=bioAOptions.filter(x=>!x.value.includes('.action-'));
  const bioAActions=bioAOptions.filter(x=>x.value.includes('.action-'));
  assert.equal(bioASections.length,14,`${label}: A Biology should expose exactly 12 core + 2 optional mapped sections`);
  assert.equal(bioAActions.length,7,`${label}: A Biology should retain the 7 Special Education support actions separately from curriculum sections`);
  assert.ok(bioASections.some(x=>x.text==='1.1 Τα χαρακτηριστικά των οργανισμών'),`${label}: A Biology 1.1 missing`);
  assert.ok(bioASections.some(x=>x.text.startsWith('Προαιρετικό — 1.4 Αλληλεπιδράσεις και προσαρμογές')),`${label}: A Biology optional 1.4 status missing`);

  await selectOption(page,'#tutorGrade','b');
  await selectOption(page,'#tutorSubject','special-gym-b-biology');
  const bioBOptions=await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})));
  const bioBSections=bioBOptions.filter(x=>!x.value.includes('.action-'));
  const bioBActions=bioBOptions.filter(x=>x.value.includes('.action-'));
  assert.equal(bioBSections.length,14,`${label}: B Biology should expose exactly 13 core + 1 optional mapped sections`);
  assert.equal(bioBActions.length,7,`${label}: B Biology should retain the 7 Special Education support actions`);
  assert.ok(bioBSections.some(x=>x.text==='Βιολογία Α΄ — 6.4 Η αναπαραγωγή στον άνθρωπο'),`${label}: B Biology reproduction mapping missing`);
  assert.ok(bioBSections.some(x=>x.text.startsWith('Προαιρετικό — Βιολογία Β΄-Γ΄ — 1.2 Κύτταρο')),`${label}: B Biology optional cell unit missing`);

  await selectOption(page,'#tutorGrade','c');
  await selectOption(page,'#tutorSubject','special-gym-c-biology');
  const bioCOptions=await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})));
  const bioCSections=bioCOptions.filter(x=>!x.value.includes('.action-'));
  const bioCActions=bioCOptions.filter(x=>x.value.includes('.action-'));
  assert.equal(bioCSections.length,12,`${label}: C Biology should expose exactly 12 mapped sections`);
  assert.equal(bioCActions.length,7,`${label}: C Biology should retain the 7 Special Education support actions`);
  assert.ok(bioCSections.some(x=>x.text==='5.5 Κληρονομικότητα'),`${label}: C Biology inheritance mapping missing`);
  assert.ok(bioCSections.some(x=>x.text==='7.2 Η εξέλιξη του ανθρώπου'),`${label}: C Biology human evolution mapping missing`);

  await selectOption(page,'#tutorGrade','a');
  assert.equal(await page.evaluate(()=>window.AITutor.getProvider()),'groq',`${label}: GPT-OSS/Groq should be the default provider`);
  await page.locator('#tutorMount [data-special-simple-quiz="1"]').click();
  await page.waitForSelector('#tutorMount .tutor-study-tools__result[data-type="quiz-special-simple"]',{timeout:10000});
  assert.equal(await page.locator('#tutorMount .study-quiz__question').count(),1,`${label}: Special Education quiz was not rendered inline`);
  assert.equal(await page.locator('script[src*="js.puter.com"]').count(),0,`${label}: inline Groq quiz unexpectedly loaded Puter`);

  await selectTrack(page,'special-lyceum');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'special-lyceum',`${label}: Special Lyceum selection failed`);
  await assertSimpleQuizButton(page,`${label} Special Lyceum`);
  assert.deepEqual((await page.locator('#tutorGrade option').evaluateAll(els=>els.map(e=>e.value))).sort(),['a','b','c'],`${label}: Special Lyceum grades wrong`);
  await selectOption(page,'#tutorGrade','a');
  const slSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(slSubjects.length>0,`${label}: Special Lyceum needs a usable subject menu`);
  assert.ok(slSubjects.every(id=>id.startsWith('special-lyceum-a-')),`${label}: Special Lyceum subject menu leaked another school type`);
  const slInformatics=slSubjects.find(id=>id.includes('pliroforiki-a-lykeiou'));
  assert.ok(slInformatics,`${label}: Special Lyceum A exact Informatics mapping missing`);
  await selectOption(page,'#tutorSubject',slInformatics);
  const slInfoTopics=await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})).filter(x=>x.text));
  const slInfoSections=slInfoTopics.filter(x=>!x.value.includes('.action-'));
  assert.equal(slInfoSections.length,20,`${label}: Special Lyceum A Informatics must expose 20 official sections: ${JSON.stringify(slInfoTopics)}`);
  assert.ok(slInfoSections.some(x=>x.text.includes('7.1 Προγραμματισμός εφαρμογών για φορητές συσκευές')),`${label}: Special Lyceum A Informatics 7.1 missing`);
  assert.ok(slInfoSections.some(x=>x.text.includes('16.4 Ιδιωτικότητα και προσωπικά δεδομένα')),`${label}: Special Lyceum A Informatics 16.4 missing`);
  const slContext=await page.locator('#tutorContextBox').innerText();
  assert.match(slContext,/Ειδικό Λύκειο|Special Lyceum/i,`${label}: Special Lyceum context identity missing`);

  await selectOption(page,'#tutorGrade','b');
  const slBSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  const slInfoB=slBSubjects.find(id=>id.includes('pliroforiki-b-lykeiou'));
  assert.ok(slInfoB,`${label}: Special Lyceum B exact Informatics mapping missing`);
  await selectOption(page,'#tutorSubject',slInfoB);
  const slInfoBSections=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(slInfoBSections.length,8,`${label}: Special Lyceum B Informatics must expose 8 source-bounded units`);
  assert.ok(slInfoBSections.some(x=>x.text.includes('2.2 Αλγόριθμοι')),`${label}: Special Lyceum B algorithms unit missing`);

  await selectOption(page,'#tutorGrade','c');
  const slCSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  const slInfoC=slCSubjects.find(id=>id.includes('pliroforiki-g-lykeiou'));
  assert.ok(slInfoC,`${label}: Special Lyceum C exact Informatics mapping missing`);
  await selectOption(page,'#tutorSubject',slInfoC);
  const slInfoCSections=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(slInfoCSections.length,20,`${label}: Special Lyceum C Informatics must expose 20 source-bounded teaching groups`);
  assert.ok(slInfoCSections.some(x=>x.text.includes('Αντικειμενοστραφής προγραμματισμός')),`${label}: Special Lyceum C OOP teaching group missing`);

  await selectOption(page,'#tutorGrade','b');
  const slLatinB=slBSubjects.find(id=>id.includes('latinika-b-lykeiou'));
  assert.ok(slLatinB,`${label}: Special Lyceum B Latin exact route missing`);
  await selectOption(page,'#tutorSubject',slLatinB);
  const slLatinBTopics=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(slLatinBTopics.length,15,`${label}: Special Lyceum B Latin must expose Units I-XV`);
  assert.ok(slLatinBTopics[0].text.startsWith('Ενότητα I'),`${label}: Special Lyceum B Latin first unit wrong`);
  assert.ok(slLatinBTopics.at(-1).text.startsWith('Ενότητα XV'),`${label}: Special Lyceum B Latin final unit wrong`);

  await selectOption(page,'#tutorGrade','c');
  const slLatinC=slCSubjects.find(id=>id.includes('latinika-g-lykeiou'));
  assert.ok(slLatinC,`${label}: Special Lyceum C Latin exact route missing`);
  await selectOption(page,'#tutorSubject',slLatinC);
  const slLatinCTopics=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(slLatinCTopics.length,35,`${label}: Special Lyceum C Latin must expose Lessons 16-50`);
  assert.ok(slLatinCTopics[0].text.startsWith('Μάθημα 16'),`${label}: Special Lyceum C Latin first lesson wrong`);
  assert.ok(slLatinCTopics.at(-1).text.startsWith('Μάθημα 50'),`${label}: Special Lyceum C Latin final lesson wrong`);

  await selectOption(page,'#tutorGrade','a');
  const slHistoryA=slSubjects.find(id=>id.includes('istoria-a-lykeiou'));
  assert.ok(slHistoryA,`${label}: Special Lyceum A History framework route missing`);
  await selectOption(page,'#tutorSubject',slHistoryA);
  const slHistoryContext=await page.locator('#tutorContextBox').innerText();
  assert.match(slHistoryContext,/επίσημο πλαίσιο 2026–27/i,`${label}: Special Lyceum History must be labelled as framework, not exact syllabus`);
  assert.match(slHistoryContext,/Δεν τεκμηριώνει κλειστή section-level ετήσια λίστα κεφαλαίων/i,`${label}: Special Lyceum History scope boundary missing`);

  await selectOption(page,'#tutorGrade','a');
  const slBiology=slSubjects.find(id=>id.includes('biologia-a-lykeiou'));
  assert.ok(slBiology,`${label}: Special Lyceum A Biology exact route missing`);
  await selectOption(page,'#tutorSubject',slBiology);
  const slBiologyTopics=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(slBiologyTopics.length,13,`${label}: Special Lyceum A Biology must expose 13 exact official sections`);
  assert.ok(slBiologyTopics.some(x=>x.text.includes('Κυκλοφορικό Σύστημα — Αίμα')),`${label}: Special Lyceum A Biology blood section missing`);
  const slBiologyContext=await page.locator('#tutorContextBox').innerText();
  assert.match(slBiologyContext,/Ειδικό Λύκειο · Ύλη 2026–27/i,`${label}: Special Lyceum A Biology must be labelled exact 2026-27 curriculum`);
  assert.match(slBiologyContext,/Βιολογία Α΄ Λυκείου Ε\.Α\.Ε\./i,`${label}: Special Lyceum A Biology source label must name the exact guidance`);
  assert.ok(await page.locator('#tutorContextBox a[href*="dide.ira.sch.gr"]').count()>=1,`${label}: Special Lyceum A Biology direct official guidance link missing`);

  await selectTrack(page,'eneegyl');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'eneegyl',`${label}: ENEEGYL selection failed`);
  await assertSimpleQuizButton(page,`${label} ENEEGYL`);
  const enRuntime=await page.evaluate(()=>({
    totalGrades:window.ENEEGYL_2026_2027_STRUCTURE?.totalGrades,
    catalogGrades:window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG?.eneegylGradeCount
  }));
  assert.equal(enRuntime.totalGrades,8,`${label}: ENEEGYL official structure did not load as eight grades`);
  assert.equal(enRuntime.catalogGrades,8,`${label}: ENEEGYL tutor catalog did not register eight grades`);

  const enGrades=await page.locator('#tutorGrade option').evaluateAll(els=>els.map(e=>e.value));
  assert.deepEqual(enGrades,['gym-a','gym-b','gym-c','gym-d','lyc-a','lyc-b','lyc-c','lyc-d'],`${label}: ENEEGYL grades must be ordered 4 Gymnasium + 4 Lyceum`);

  await selectOption(page,'#tutorGrade','gym-d');
  const gymDSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(gymDSubjects.includes('eneegyl-gym-d-economics'),`${label}: ENEEGYL D Gymnasium Economics missing from AI Help`);
  await selectOption(page,'#tutorSubject','eneegyl-gym-d-economics');
  const gymDContext=await page.locator('#tutorContextBox').innerText();
  assert.match(gymDContext,/Δ΄ Γυμνασίου/i,`${label}: ENEEGYL Gymnasium grade identity was lost inside high-route tutor`);
  assert.match(gymDContext,/ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\.|EN\.E\.E\.GY/i,`${label}: ENEEGYL school identity missing from Gymnasium tutor context`);
  assert.doesNotMatch(gymDContext,/Γενικό Λύκειο/i,`${label}: General Lyceum framing leaked into ENEEGYL Gymnasium context`);

  await selectOption(page,'#tutorGrade','lyc-a');
  const aSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(aSubjects.length>=18,`${label}: ENEEGYL A Lyceum should be substantially enriched`);
  assert.ok(aSubjects.includes('eneegyl-a-zdd'),`${label}: mapped A Lyceum ZDD route missing`);
  assert.ok(aSubjects.includes('eneegyl-lyc-a-economics'),`${label}: A Lyceum Principles of Economy missing`);
  assert.ok(aSubjects.includes('eneegyl-lyc-a-health'),`${label}: A Lyceum Health elective missing`);
  assert.ok(aSubjects.includes('eneegyl-lyc-a-math-2026-27'),`${label}: exact A Lyceum Mathematics mapping missing`);
  await selectOption(page,'#tutorSubject','eneegyl-lyc-a-math-2026-27');
  const enMathATopics=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(enMathATopics.length,38,`${label}: ENEEGYL A Mathematics must expose 38 exact exam-scope anchors`);
  const enMathAContext=await page.locator('#tutorContextBox').innerText();
  assert.match(enMathAContext,/ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\. · Εξεταστέα ύλη 2026–27/i,`${label}: ENEEGYL A Mathematics must be labelled exam syllabus`);
  assert.ok(await page.locator('#tutorContextBox a[href*="iep.edu.gr"]').count()>=1,`${label}: ENEEGYL A Mathematics official archive link missing`);

  assert.ok(aSubjects.includes('eneegyl-lyc-a-chemistry-2026-27'),`${label}: exact A Lyceum Chemistry mapping missing`);
  await selectOption(page,'#tutorSubject','eneegyl-lyc-a-chemistry-2026-27');
  const enChemATopics=(await page.locator('#tutorTopic option').evaluateAll(els=>els.map(e=>({value:e.value,text:e.textContent.trim()})))).filter(x=>!x.value.includes('.action-'));
  assert.equal(enChemATopics.length,9,`${label}: ENEEGYL A Chemistry must expose 9 exact official sections`);
  assert.ok(enChemATopics.some(x=>x.text.startsWith('3.5 Χημικές αντιδράσεις')),`${label}: ENEEGYL A Chemistry reaction scope missing`);
  const enChemAContext=await page.locator('#tutorContextBox').innerText();
  assert.match(enChemAContext,/ΕΝ\.Ε\.Ε\.ΓΥ\.-Λ\. · Ύλη 2026–27/i,`${label}: ENEEGYL A Chemistry must be labelled exact annual curriculum`);
  assert.ok(await page.locator('#tutorContextBox a[href*="esos.gr"]').count()>=1,`${label}: ENEEGYL A Chemistry source PDF missing`);

  await selectOption(page,'#tutorGrade','lyc-b');
  const bSubjects=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(bSubjects.length>5,`${label}: ENEEGYL B Lyceum must expose structure plus mapped routes, not only five units`);
  assert.ok(bSubjects.includes('eneegyl-b-economy-accounting-basics'),`${label}: accounting mapped route missing from B Lyceum`);
  assert.ok(bSubjects.some(id=>id.startsWith('eneegyl-lyc-b-b-sector-')),`${label}: B Lyceum sector gateways missing`);
  await assertSimpleQuizButton(page,`${label} ENEEGYL B Lyceum`);

  await selectTrack(page,'special-gymnasium');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'special-gymnasium',`${label}: cross-zone return to Special Gymnasium failed`);
  await assertSimpleQuizButton(page,`${label} Special Gymnasium return`);
  await selectTrack(page,'general-high');
  assert.equal(await page.inputValue('#tutorSchoolTrack'),'general-high',`${label}: unified selector could not switch to General Lyceum`);
  await assertGeneralQuizButton(page,`${label} General Lyceum`);
  const generalHigh=await page.locator('#tutorSubject option').evaluateAll(els=>els.map(e=>e.value));
  assert.ok(generalHigh.length>0&&generalHigh.every(id=>!id.startsWith('special-')&&!id.startsWith('eneegyl-')),`${label}: special subjects leaked into General Lyceum`);

  assert.equal(await page.locator('#tutorMount').count(),1,`${label}: duplicate tutor mount created`);
  assert.equal(await page.locator('#tutorMount .tutor-flashcards').count(),1,`${label}: flashcards missing or duplicated`);
  assert.equal(await page.locator('#tutorMount .tutor-study-tools').count(),1,`${label}: study tools missing or duplicated`);

  const lazyState=await page.evaluate(()=>({
    catalog:!!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG,
    lyceum:!!window.SPECIAL_LYCEUM_2026_2027,
    eneegylStructure:!!window.ENEEGYL_2026_2027_STRUCTURE,
    simpleQuiz:!!window.AITOOLSKIDS_SPECIAL_SIMPLE_QUIZ,
    runtimeScripts:[...document.scripts].filter(s=>s.dataset.specialEducationRuntime).length,
    annualMapLoaded:[...document.scripts].some(s=>/teacher-curriculum-special-gym-annual-2026-2027\.js/.test(s.src)),
    annualMapVersion:window.AITOOLSKIDS_SPECIAL_GYM_ANNUAL_2026_2027?.version||''
  }));
  assert.equal(lazyState.catalog,true,`${label}: special catalog missing after selection`);
  assert.equal(lazyState.lyceum,true,`${label}: Special Lyceum metadata was not lazy-loaded`);
  assert.equal(lazyState.eneegylStructure,true,`${label}: ENEEGYL structure missing after Special Education selection`);
  assert.equal(lazyState.simpleQuiz,true,`${label}: simplified Special Education quiz adapter missing`);
  assert.ok(lazyState.runtimeScripts>=9,`${label}: expected lazy Special Education runtime scripts including annual mapping`);
  assert.equal(lazyState.annualMapLoaded,true,`${label}: annual Special Gymnasium map was not lazy-loaded`);
  assert.equal(lazyState.annualMapVersion,'1.14.0',`${label}: wrong annual Special Gymnasium mapping version`);
}

try{
  for(const [label,viewport] of [['desktop',{width:1280,height:900}],['mobile',{width:390,height:844}]]){
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',(err)=>errors.push(err.message));
    page.on('console',(msg)=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load resource:')) errors.push(msg.text());});
    page.on('requestfailed',(request)=>{if(request.url().startsWith(LOCAL)) errors.push(`request failed ${request.url()}: ${request.failure()?.errorText||'unknown error'}`);});
    page.on('response',(response)=>{if(response.status()>=400&&response.url().startsWith(LOCAL)) errors.push(`${response.status()} ${response.url()}`);});
    await prepare(page,viewport);
    await checkUnified(page,label);
    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
    assert.ok(noOverflow,`${label}: horizontal overflow in unified AI Help`);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('Unified lazy-loaded Special Education AI Help passed with ENEEGYL 8-grade structure and simplified quiz switching on desktop/mobile.');
}finally{
  await browser.close();
}
