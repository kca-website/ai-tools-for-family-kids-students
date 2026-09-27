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

  await page.locator('[data-zone="middle"]').click();
  const skillsSubject=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/Εργαστήρια Δεξιοτήτων/.test(o.textContent))?.value||'');
  assert.ok(skillsSubject,'Curriculum Map missing Skills Labs');
  await page.selectOption('#subject',skillsSubject);
  const courseValues=await page.locator('#course option').evaluateAll(opts=>opts.map(o=>o.value));
  assert.ok(courseValues.includes('ergastiria-dexiotiton-a-gym'),'Curriculum Map missing source-backed Skills Labs A course');
  await page.selectOption('#course','ergastiria-dexiotiton-a-gym');
  const mapTopics=compact(await page.locator('#topicPick option').allTextContents());
  console.log('CURRICULUM_MAP_SKILLS_TOPICS',JSON.stringify(mapTopics));
  assert.equal(mapTopics.length,4,'Curriculum Map must expose four verified Skills Labs framework themes');
  assert.ok(mapTopics.some(x=>/Ζω Καλύτερα/.test(x)));
  assert.ok(mapTopics.some(x=>/Φροντίζω το Περιβάλλον/.test(x)));
  assert.ok(mapTopics.some(x=>/Ενδιαφέρομαι και Ενεργώ/.test(x)));
  assert.ok(mapTopics.some(x=>/Δημιουργώ και Καινοτομώ/.test(x)));
  assert.match(await page.locator('#sources').innerText(),/Επίσημες|ΙΕΠ/i,'Curriculum Map must expose official provenance');

  await page.goto(BASE+'/teacher-assistant.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.selectOption('#context','middle');
  await page.selectOption('#grade','a');
  const teacherSkills=await page.locator('#subject option').evaluateAll(opts=>opts.find(o=>/Εργαστήρια Δεξιοτήτων/.test(o.textContent))?.value||'');
  assert.ok(teacherSkills,'Teacher material flow missing Skills Labs');
  await page.selectOption('#subject',teacherSkills);
  const units=compact(await page.locator('#unit option').allTextContents());
  assert.equal(units.length,4,'Teacher material flow must reuse the four verified framework themes');
  assert.match(await page.locator('#curriculumNote').innerText(),/επίσημο πλαίσιο 2026.?27/i,'Teacher flow must label framework scope honestly');

  await page.goto(BASE+'/middle/guardian/quiz',{waitUntil:'domcontentloaded',timeout:60000});
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

  assert.deepEqual(errors,[],'Browser errors: '+errors.join('\n'));
  console.log('Curriculum parity smoke passed: verified IEP framework is shared by Curriculum Map, AI Help and Teacher material flow.');
} finally {
  await browser.close();
}
