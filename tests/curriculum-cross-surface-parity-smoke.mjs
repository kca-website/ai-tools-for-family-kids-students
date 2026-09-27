import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

function compact(values){ return values.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean); }

try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{ if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:')) errors.push(m.text()); });

  await page.goto(BASE+'/xartis-ylis.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_CURRICULUM_RESOLVER,{timeout:30000});
  const resolved=await page.evaluate(()=>{
    const r=window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    const rows=['a','b','c'].map(g=>r.getSubjects('middle',g).find(s=>/Εργαστήρια Δεξιοτήτων/.test(s.subjectLabelEl||'')));
    return rows.map(s=>({id:s?.id||'',mode:s?.topicMode||'',topics:(s?.topics||[]).map(t=>t.labelEl||''),source:s?.curriculum?.annualInstructionsUrl||s?.curriculum?.catalogUrl||''}));
  });
  for(const row of resolved){
    assert.ok(row.id,'Skills Labs missing from resolver');
    assert.equal(row.mode,'verified-framework','Skills Labs must stay an official framework, not exact annual syllabus');
    assert.equal(row.topics.length,4,'Skills Labs must expose the four official IEP thematic cycles');
    assert.match(row.source,/iep\.edu\.gr/i,'Skills Labs source must be IEP');
  }

  const informaticsResolved=await page.evaluate(()=>{
    const r=window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    return ['a','b','c'].map(g=>{
      const s=r.getSubject('middle',g,'pliroforiki-'+g+'-gymnasiou');
      return {grade:g,mode:s?.topicMode||'',topics:(s?.topics||[]).map(t=>({label:t.labelEl||'',status:t.status||'',source:t.sourceUrl||''})),source:s?.curriculum?.annualInstructionsUrl||''};
    });
  });
  for(const row of informaticsResolved){
    assert.equal(row.mode,'verified-official-sections','Middle-school Informatics must expose verified official sections');
    assert.equal(row.topics.length,5,'Each Middle-school Informatics grade must expose five verified official section anchors');
    assert.ok(row.topics.every(t=>/related-section-verified/.test(t.status)),'Informatics topic anchors must stay explicitly section-verified');
    assert.ok(row.topics.every(t=>/iep\.edu\.gr/i.test(t.source)),'Informatics topic anchors must point to IEP material');
    assert.match(row.source,/iep\.edu\.gr\/yli-kai-odigies-didaskalias-gymnasiou/i,'Informatics must retain the official 2026–27 annual guidance hub');
  }
  assert.ok(informaticsResolved[0].topics.some(t=>/Βασικές Έννοιες Πληροφορικής/.test(t.label)));
  assert.ok(informaticsResolved[1].topics.some(t=>/Ψηφιακός Κόσμος/.test(t.label)));
  assert.ok(informaticsResolved[2].topics.some(t=>/Πρόβλημα – Αλγόριθμος/.test(t.label)));

  const peResolved=await page.evaluate(()=>{
    const r=window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    return ['a','b','c'].map(g=>{
      const s=r.getSubject('middle',g,'fysiki-agogi-'+g+'-gymnasiou');
      return {grade:g,mode:s?.topicMode||'',topics:(s?.topics||[]).map(t=>({label:t.labelEl||'',status:t.status||'',source:t.sourceUrl||''})),source:s?.curriculum?.annualInstructionsUrl||''};
    });
  });
  const peExpected={a:/Η Ιστορία του Αθλητισμού/,b:/Η Αξία της Διά Βίου Άσκησης/,c:/Ειδικά Θέματα/};
  for(const row of peResolved){
    assert.equal(row.mode,'verified-official-sections','Middle-school PE must expose verified official-book sections');
    assert.equal(row.topics.length,2,'Each Middle-school PE grade must expose the two official-book chapters assigned to that grade');
    assert.ok(row.topics.every(t=>/related-section-verified/.test(t.status)),'PE section anchors must stay explicitly section-verified');
    assert.ok(row.topics.every(t=>/ebooks\.edu\.gr/i.test(t.source)),'PE section anchors must point to the official Interactive School Book');
    assert.match(row.source,/iep\.edu\.gr\/yli-kai-odigies-didaskalias-gymnasiou/i,'PE must retain the official 2026–27 annual guidance hub');
    assert.ok(row.topics.some(t=>peExpected[row.grade].test(t.label)),'PE grade must expose its verified official chapter focus');
  }

  const gelInformatics=await page.evaluate(()=>{
    const r=window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    return ['a','b'].map(g=>{
      const s=r.getSubject('high',g,'pliroforiki-'+g+'-lykeiou');
      return {grade:g,mode:s?.topicMode||'',topics:(s?.topics||[]).map(t=>({label:t.labelEl||'',status:t.status||'',source:t.sourceUrl||''})),annual:s?.curriculum?.annualInstructionsUrl||'',catalog:s?.curriculum?.catalogUrl||''};
    });
  });
  assert.equal(gelInformatics[0].mode,'verified-official-sections','GEL A Informatics must expose official-book verified sections');
  assert.equal(gelInformatics[0].topics.length,16,'GEL A Informatics must expose all 16 official-book chapters');
  assert.ok(gelInformatics[0].topics.some(t=>/Κεφάλαιο 16 — Ασφάλεια και Προστασία στο Διαδίκτυο/.test(t.label)));
  assert.equal(gelInformatics[1].mode,'verified-official-sections','GEL B Informatics must expose official-book verified sections');
  assert.equal(gelInformatics[1].topics.length,8,'GEL B Informatics must expose the eight official-book sections');
  assert.ok(gelInformatics[1].topics.some(t=>/3\.4 Τεχνητή Νοημοσύνη/.test(t.label)));
  for(const row of gelInformatics){
    assert.ok(row.topics.every(t=>t.status==='related-section-verified'),'GEL Informatics official-book topics must remain explicitly section-verified');
    assert.ok(row.topics.every(t=>/ebooks\.edu\.gr/.test(t.source)),'GEL Informatics topics must point to official school books');
    assert.match(row.annual,/iep\.edu\.gr\/yli-kai-odigies-didaskalias-genikou-lykeiou/i,'GEL Informatics must retain the current 2026–27 IEP guidance');
    assert.match(row.catalog,/ebooks\.edu\.gr/i,'GEL Informatics catalog source must be the official school book');
  }

  await page.locator('[data-zone="middle"]').click();
  const skillsSubject=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/Εργαστήρια Δεξιοτήτων/.test(o.textContent))?.value||'');
  assert.ok(skillsSubject,'Curriculum Map missing Skills Labs');
  await page.selectOption('#subject',skillsSubject);
  const courseValues=await page.locator('#course option').evaluateAll(opts=>opts.map(o=>o.value));
  assert.ok(courseValues.includes('ergastiria-dexiotiton-a-gym'),'Curriculum Map missing source-backed Skills Labs A course');
  await page.selectOption('#course','ergastiria-dexiotiton-a-gym');
  const mapTopics=compact(await page.locator('#topicPick option').allTextContents());
  assert.equal(mapTopics.length,4,'Curriculum Map must expose four verified Skills Labs framework themes');
  assert.ok(mapTopics.some(x=>/Ζω Καλύτερα/.test(x)));
  assert.ok(mapTopics.some(x=>/Φροντίζω το Περιβάλλον/.test(x)));
  assert.ok(mapTopics.some(x=>/Ενδιαφέρομαι και Ενεργώ/.test(x)));
  assert.ok(mapTopics.some(x=>/Δημιουργώ και Καινοτομώ/.test(x)));
  assert.match(await page.locator('#sources').innerText(),/Επίσημες|ΙΕΠ/i,'Curriculum Map must expose official provenance');

  const informaticsSubject=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/Πληροφορική/.test(o.textContent))?.value||'');
  assert.ok(informaticsSubject,'Curriculum Map missing Informatics');
  await page.selectOption('#subject',informaticsSubject);
  const informaticsCourses=await page.locator('#course option').evaluateAll(opts=>opts.map(o=>o.value));
  assert.ok(informaticsCourses.includes('pliroforiki-a-gymnasiou'),'Curriculum Map missing verified Informatics A course');
  await page.selectOption('#course','pliroforiki-a-gymnasiou');
  const informaticsMapTopics=compact(await page.locator('#topicPick option').allTextContents());
  assert.equal(informaticsMapTopics.length,5,'Curriculum Map must expose five verified Informatics A section anchors');
  assert.ok(informaticsMapTopics.some(x=>/Κίνδυνοι στο Διαδίκτυο/.test(x)));
  assert.match(await page.locator('#sources').innerText(),/ΙΕΠ/i,'Curriculum Map Informatics must expose IEP provenance');

  const peSubject=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/Φυσική Αγωγή/.test(o.textContent))?.value||'');
  assert.ok(peSubject,'Curriculum Map missing Physical Education');
  await page.selectOption('#subject',peSubject);
  const peCourses=await page.locator('#course option').evaluateAll(opts=>opts.map(o=>o.value));
  assert.ok(peCourses.includes('fysiki-agogi-a-gymnasiou'),'Curriculum Map missing verified PE A course');
  await page.selectOption('#course','fysiki-agogi-a-gymnasiou');
  const peMapTopics=compact(await page.locator('#topicPick option').allTextContents());
  assert.equal(peMapTopics.length,2,'Curriculum Map must expose the two official PE A chapters');
  assert.ok(peMapTopics.some(x=>/Η Ιστορία του Αθλητισμού/.test(x)));

  await page.goto(BASE+'/teacher-assistant.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.selectOption('#context','middle');
  await page.selectOption('#grade','a');
  const teacherSkills=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/Εργαστήρια Δεξιοτήτων/.test(o.textContent))?.value||'');
  assert.ok(teacherSkills,'Teacher material flow missing Skills Labs');
  await page.selectOption('#subject',teacherSkills);
  const units=compact(await page.locator('#unit option').allTextContents());
  assert.equal(units.length,4,'Teacher material flow must reuse the four verified framework themes');
  assert.match(await page.locator('#curriculumNote').innerText(),/επίσημο πλαίσιο 2026.?27/i,'Teacher flow must label framework scope honestly');

  const teacherInformatics=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/^Πληροφορική/.test((o.textContent||'').trim()))?.value||'');
  assert.ok(teacherInformatics,'Teacher material flow missing Informatics');
  await page.selectOption('#subject',teacherInformatics);
  const informaticsTeacherUnits=compact(await page.locator('#unit option').allTextContents());
  assert.equal(informaticsTeacherUnits.length,5,'Teacher material flow must reuse five verified Informatics A section anchors');
  assert.ok(informaticsTeacherUnits.some(x=>/Βασικές Έννοιες Πληροφορικής/.test(x)));

  await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>!!window.AITutor?.render,{timeout:30000});
  await page.evaluate(()=>{
    history.replaceState({},'','/middle/guardian/quiz');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForSelector('.quiz-grade-card[data-grade-id="a"]',{state:'visible',timeout:20000});
  await page.locator('.quiz-grade-card[data-grade-id="a"]').click();
  await page.waitForSelector('.quiz-subject-grid',{state:'visible',timeout:10000});
  const practiceSkills=page.locator('.quiz-subject-card--curriculum').filter({hasText:'Εργαστήρια Δεξιοτήτων'});
  assert.equal(await practiceSkills.count(),1,'Practice Map must include source-backed Skills Labs even without a fixed quiz');
  await practiceSkills.locator('.quiz-curriculum-browse-btn').click();
  const practiceTopics=compact(await page.locator('.quiz-curriculum-topic-btn .quiz-topic-card__label').allTextContents());
  assert.equal(practiceTopics.length,4,'Practice Map must expose the four verified IEP framework themes');
  assert.match(await page.locator('#quizContent').innerText(),/Επίσημο πλαίσιο ΙΕΠ/i,'Practice Map must label framework scope honestly');
  assert.ok(await page.locator('#quizContent a[href*="iep.edu.gr"]').count()>0,'Practice Map must link to the official IEP source');

  document.getElementById('quizCurriculumBackBtn')?.click();
  await page.waitForSelector('.quiz-subject-grid',{state:'visible',timeout:10000});
  const practiceInformatics=page.locator('.quiz-subject-card--curriculum').filter({hasText:'Πληροφορική'});
  assert.equal(await practiceInformatics.count(),1,'Practice Map must include source-backed Informatics');
  await practiceInformatics.locator('.quiz-curriculum-browse-btn').click();
  const practiceInformaticsTopics=compact(await page.locator('.quiz-curriculum-topic-btn .quiz-topic-card__label').allTextContents());
  assert.equal(practiceInformaticsTopics.length,5,'Practice Map must expose five verified Informatics section anchors');
  assert.ok(practiceInformaticsTopics.some(x=>/Επεξεργασία Κειμένου/.test(x)));

  await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.AITutor?.render,{timeout:30000});
  await page.evaluate(()=>{
    history.replaceState({},'','/middle/guardian/tutor');
    document.getElementById('tutorView')?.removeAttribute('hidden');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.AITutor.render({zoneId:'middle',roleId:'guardian',lang:'el'});
  });
  await page.waitForSelector('#tutorGrade',{timeout:15000});
  await page.selectOption('#tutorGrade','a');
  const tutorSkills=await page.locator('#tutorSubject option').evaluateAll(opts=>opts.find(o=>/Εργαστήρια Δεξιοτήτων/.test(o.textContent))?.value||'');
  assert.ok(tutorSkills,'AI Help missing Skills Labs');
  await page.selectOption('#tutorSubject',tutorSkills);
  const tutorTopics=compact(await page.locator('#tutorTopic option').allTextContents());
  assert.equal(tutorTopics.length,4,'AI Help must reuse the four verified framework themes');

  const tutorInformatics=await page.locator('#tutorSubject option').evaluateAll(opts=>opts.find(o=>/^Πληροφορική/.test((o.textContent||'').trim()))?.value||'');
  assert.ok(tutorInformatics,'AI Help missing Informatics');
  await page.selectOption('#tutorSubject',tutorInformatics);
  const tutorInformaticsTopics=compact(await page.locator('#tutorTopic option').allTextContents());
  assert.equal(tutorInformaticsTopics.length,5,'AI Help must reuse five verified Informatics A section anchors');
  assert.ok(tutorInformaticsTopics.some(x=>/Το Υλικό του Υπολογιστή/.test(x)));

  assert.deepEqual(errors,[],'Browser errors: '+errors.join('\n'));
  console.log('Curriculum parity smoke passed: verified IEP framework is shared by Curriculum Map, AI Help and Teacher material flow.');
} finally {
  await browser.close();
}
