import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const isSafeFallback=(topics=[])=>topics.length===1&&(
  topics[0].includes('Δούλεψε πάνω στο συγκεκριμένο κεφάλαιο')||
  topics[0].includes('Δεν υπάρχει χαρτογραφημένη ενότητα')
);

try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});

  await page.goto(`${BASE}/teacher-assistant.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITOOLSKIDS_TEACHER_CURRICULUM_AUDIT);

  const direct=await page.evaluate(()=>({
    physicsVsPe: window.subjectMatches({subject:'Φυσική'},{id:'pe',label:'Φυσική Αγωγή'}),
    physicsVsPhysics: window.subjectMatches({subject:'Φυσική'},{id:'physics',label:'Φυσική'}),
    economicsVsHome: window.subjectMatches({subject:'Οικονομικά'},{id:'home-economics',label:'Οικιακή Οικονομία'}),
    collisions: window.AITOOLSKIDS_TEACHER_CURRICULUM_AUDIT?.collisions||[]
  }));
  assert.equal(direct.physicsVsPe,false,'Physics must never match Physical Education');
  assert.equal(direct.physicsVsPhysics,true,'Physics must match Physics');
  assert.equal(direct.economicsVsHome,false,'Economics must never match Home Economics');
  assert.deepEqual(direct.collisions,[],'Strict bridge audit reported unknown subject identities');

  await page.selectOption('#context','specialGym');
  await page.selectOption('#grade','a');
  await page.selectOption('#subject','physics');
  const physicsTopics=await page.locator('#unit option').allTextContents();
  assert.ok(physicsTopics.length>0,'Special Gymnasium Physics should expose mapped topics or the explicit safe fallback');

  for(const subjectId of ['pe','biology','math','home-economics','history']){
    if(await page.locator(`#subject option[value="${subjectId}"]`).count()===0) continue;
    await page.selectOption('#subject',subjectId);
    const topics=await page.locator('#unit option').allTextContents();
    assert.ok(topics.length>0,`${subjectId} must expose mapped topics or the explicit safe fallback`);
    // Only compare topic lists when Physics really has a mapped list. A shared one-line
    // "use the exact chapter in front of you" fallback is deliberately generic and is
    // not evidence that one school subject inherited another subject's curriculum.
    if(!isSafeFallback(physicsTopics)){
      assert.notDeepEqual(topics,physicsTopics,`${subjectId} incorrectly received the complete Physics topic list`);
    }
  }

  const literatureOption=page.locator('#subject option').filter({hasText:'Νεοελληνική Λογοτεχνία'});
  assert.ok(await literatureOption.count(),'Special Gymnasium A must expose Modern Greek Literature');
  await page.selectOption('#subject',{label:'Νεοελληνική Λογοτεχνία'});
  const literatureTopics=await page.locator('#unit option').allTextContents();
  assert.ok(literatureTopics.length>=13,'Special Gymnasium A Literature should expose the verified annual selection framework');
  assert.ok(literatureTopics.some(x=>x.includes('Ο άνθρωπος και η φύση')),'Literature theme “Ο άνθρωπος και η φύση” missing');
  assert.ok(!literatureTopics.some(x=>x.includes('Δεν υπάρχει χαρτογραφημένη')),'Literature must not fall back to an empty custom-unit selector');
  const literatureNote=await page.locator('#curriculumNote').innerText();
  assert.match(literatureNote,/επαληθευμένες επιλογές μέσα στο επίσημο πλαίσιο 2026–27/i,'Literature must be labeled as an annual selection framework');
  assert.match(literatureNote,/δεν αποτελούν υποχρεωτική λίστα/i,'Literature UI must not imply every theme/text is compulsory');
  assert.ok(!/υποστηρικτικές επιλογές/i.test(literatureNote),'Annual Literature framework must take precedence over the textbook-only bridge');

  const literatureEntries=await page.evaluate(()=>Object.values(window.SPECIAL_EDUCATION_CURRICULUM?.entries||{}).filter(e=>
    e.schoolType==='special-gymnasium'&&e.grade==='A'&&e.subjectId==='literature'
  ));
  const annualLiterature=literatureEntries.find(e=>e.annualInstructionsStatus==='2026-27-verified');
  assert.equal(annualLiterature?.selectionFramework,true,'Annual Literature row must explicitly declare selection-framework semantics');
  assert.equal(annualLiterature?.selectionStatus,'teacher-selected-not-fixed-syllabus','A Literature must remain teacher-selected rather than a fixed syllabus');
  assert.ok(String(annualLiterature?.sourceUrl||'').includes('minedu.gov.gr'),'Annual Literature must retain the official ministry guidance source');
  assert.ok(String(annualLiterature?.textbookSourceUrl||'').includes('ebooks.edu.gr'),'Annual Literature must retain the official textbook navigation source');

  const literatureBridge=literatureEntries.find(e=>e.verificationBasis==='official-digital-textbook');
  const literatureSource=literatureBridge?.sourceUrl||literatureBridge?.referenceSourceUrl||'';
  assert.ok(literatureSource.includes('ebooks.edu.gr'),'Older Literature support bridge must remain traceable');

  await page.selectOption('#grade','b');
  await page.selectOption('#subject',{label:'Νεοελληνική Λογοτεχνία'});
  const literatureBNote=await page.locator('#curriculumNote').innerText();
  assert.match(literatureBNote,/δεν αποτελούν υποχρεωτική λίστα/i,'B Literature must preserve teacher selection');

  await page.selectOption('#grade','c');
  await page.selectOption('#subject',{label:'Νεοελληνική Λογοτεχνία'});
  const literatureCTopics=await page.locator('#unit option').allTextContents();
  assert.ok(literatureCTopics.some(x=>x.includes('Νεοελληνικός Διαφωτισμός')),'C Literature historical framework missing');
  assert.ok(literatureCTopics.some(x=>x.includes('Νέα Αθηναϊκή Σχολή')),'C Literature period missing');
  const literatureCMeta=await page.evaluate(()=>Object.values(window.SPECIAL_EDUCATION_CURRICULUM?.entries||{}).find(e=>
    e.schoolType==='special-gymnasium'&&e.grade==='C'&&e.subjectId==='literature'&&e.annualInstructionsStatus==='2026-27-verified'
  ));
  assert.equal(literatureCMeta?.anchorPolicy,'historical-literary-chronological-with-thematic-links','C Literature must retain historical-literary guidance');

  await page.selectOption('#grade','a');
  await page.selectOption('#subject','biology');
  const biologyNote=await page.locator('#curriculumNote').innerText();
  assert.match(biologyNote,/πραγματικές χαρτογραφημένες επιλογές από την τρέχουσα ύλη\/οδηγίες/i,'Biology A must now resolve through the exact annual mapping');
  assert.ok(!/section-level χαρτογράφηση δεν έχει ακόμη περαστεί/i.test(biologyNote),'Biology must no longer be marked pending');

  await page.selectOption('#subject','history');
  const historyNote=await page.locator('#curriculumNote').innerText();
  assert.match(historyNote,/επαληθευμένες επιλογές μέσα στο επίσημο πλαίσιο 2026–27/i,'History A status-aware annual framework must be active');
  assert.ok(!/section-level χαρτογράφηση δεν έχει ακόμη περαστεί/i.test(historyNote),'History must no longer be marked pending');

  await page.selectOption('#subject','informatics');
  const infoATopics=await page.locator('#unit option').allTextContents();
  assert.ok(infoATopics.includes('1. Ψηφιακός Κόσμος'),'A Informatics official topic missing');
  assert.ok(infoATopics.some(x=>x.startsWith('Προαιρετικό — 9. Προγραμματισμός Υπολογιστικών Συστημάτων')),'A Informatics optional status missing');
  const infoAPrompt=await page.evaluate(()=>window.promptText());
  assert.match(infoAPrompt,/προτείνουν να αποφεύγεται η χρήση εργαλείων ΤΝ από τους μαθητές/i,'A Informatics must enforce the official AI-use caution');
  assert.match(infoAPrompt,/Μην ζητήσεις ούτε προτείνεις εισαγωγή προσωπικών δεδομένων μαθητών/i,'Informatics prompt must protect student personal data');
  assert.match(infoAPrompt,/Μην σχεδιάσεις δραστηριότητα που προϋποθέτει προσωπικό λογαριασμό μαθητή/i,'Informatics prompt must not require a personal student AI account');

  await page.selectOption('#grade','b');
  await page.selectOption('#subject','informatics');
  const infoBTopics=await page.locator('#unit option').allTextContents();
  assert.ok(infoBTopics.includes('7. Τεχνητή Νοημοσύνη'),'B Informatics official AI unit missing');
  const infoBPrompt=await page.evaluate(()=>window.promptText());
  assert.match(infoBPrompt,/Οι μαθητές διατυπώνουν πρώτα δική τους απάντηση\/λύση/i,'B Informatics must use student-first critical comparison');

  await page.selectOption('#grade','a');
  await page.selectOption('#subject','math');
  const mathNote=await page.locator('#curriculumNote').innerText();
  assert.match(mathNote,/τρέχουσα ύλη\/οδηγίες/i,'Annual Mathematics mapping must be distinguished from support-only textbook references');
  assert.ok(!/υποστηρικτικές επιλογές/i.test(mathNote),'Verified annual Mathematics mapping must not be marked support-only');

  const specialPrompt=await page.evaluate(()=>window.promptText());
  assert.match(specialPrompt,/Καθολικού Σχεδιασμού για τη Μάθηση/,'Special-school teacher prompt must apply the official UDL/differentiation framework');
  assert.match(specialPrompt,/πολλαπλούς τρόπους αναπαράστασης/,'Special-school prompt must offer multiple representations');
  assert.match(specialPrompt,/Μην υποθέτεις διάγνωση/,'Special-school differentiation must not infer a diagnosis');

  await page.selectOption('#context','middle');
  const generalPrompt=await page.evaluate(()=>window.promptText());
  assert.ok(!/Επίσημες αρχές διαφοροποιημένης διδασκαλίας Ε\.Α\.Ε\./.test(generalPrompt),'E.A.E. differentiation block must not be injected into the general Gymnasium context');

  await page.selectOption('#context','specialGym');
  await page.selectOption('#grade','a');
  await page.selectOption('#subject','physics');

  const bridgeLeak=await page.evaluate(()=>{
    const entries=Object.values(window.SPECIAL_EDUCATION_CURRICULUM?.entries||{});
    const physics=entries.find(e=>e.schoolType==='special-gymnasium'&&e.grade==='A'&&e.subjectId==='physics'&&e.verificationBasis==='general-gymnasium-2026-27');
    const pe=entries.find(e=>e.schoolType==='special-gymnasium'&&e.grade==='A'&&e.subjectId==='pe'&&e.verificationBasis==='general-gymnasium-2026-27');
    if(!physics||!pe) return false;
    const p=new Set(physics.officialAnchors||[]);
    return (pe.officialAnchors||[]).length>0 && (pe.officialAnchors||[]).every(x=>p.has(x));
  });
  assert.equal(bridgeLeak,false,'Physical Education bridge must not be a copy of Physics');

  assert.deepEqual(errors,[],`Teacher curriculum browser errors: ${errors.join('\n')}`);
  await page.close();
  console.log('Strict special-school teacher curriculum mapping smoke passed.');
}finally{
  await browser.close();
}
