import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function openPicker(page){
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC,{timeout:30000});
  assert.equal(await page.evaluate(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA),false,'Special Education diagnostic catalog was preloaded');
  assert.equal(await page.locator('script[src*="special-education-diagnostic-data.js"]').count(),0,'heavy diagnostic data script loaded before open');
  await page.locator('.zone-card[data-zone="primary"]').click();
  await page.locator('#viewTabQuiz').click();
  const entry=page.locator('#quizContent [data-special-education-diagnostic]');
  await entry.waitFor({state:'visible',timeout:10000});
  assert.match(await entry.innerText(),/διαθέσιμα σύντομα τεστ|available short tests/i,'Special Education entry is missing from the regular Tests view');
  await entry.click();
  await page.waitForSelector('#specialDiagnosticModal:not([hidden])',{timeout:10000});
}

async function reopenPicker(page){
  await page.evaluate(()=>window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC.open());
  await page.waitForSelector('#specialDiagnosticModal:not([hidden])',{timeout:10000});
}

async function chooseSchool(page,id){
  await page.click(`#spdiagSchools [data-school="${id}"]`);
  await page.waitForFunction((id)=>document.querySelector(`#spdiagSchools [data-school="${id}"]`)?.classList.contains('is-active'),id);
}

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const label=viewport.width<600?'mobile':'desktop';
    const page=await browser.newPage({viewport});
    await page.route('**/_vercel/insights/script.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
    await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({status:200,contentType:'application/javascript',body:'export const inject=()=>{};'}));
    await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({status:200,contentType:'text/css',body:''}));
    await page.route('https://fonts.gstatic.com/**',route=>route.fulfill({status:204,body:''}));
    const errors=[];
    page.on('pageerror',(err)=>errors.push(err.message));
    page.on('console',(msg)=>{if(msg.type()==='error') errors.push(msg.text());});

    await openPicker(page);

  await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA,{timeout:15000});
  assert.equal(await page.locator('#spdiagSchools .spdiag__school').count(),5,`${label}: expected five Special Education school types including Deaf/Hard of Hearing`);

  const integrity=await page.evaluate(()=>{
    const D=window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA;
    const failures=[];
    let subjects=0,ready=0;
    for(const schoolId of D.schoolOrder){
      const school=D.schools[schoolId];
      for(const gradeId of school.gradeOrder){
        const grade=school.grades[gradeId];
        for(const subject of grade.subjects||[]){
          subjects++;
          const quiz=D.quizForSelection(schoolId,gradeId,"",subject);
          if(!quiz)continue;ready++;
          if(quiz.questions.length!==3) failures.push(`${schoolId}/${gradeId}/${subject.id}:questions=${quiz.questions.length}`);
          quiz.questions.forEach((q,i)=>{if(q.options.length!==2)failures.push(`${schoolId}/${gradeId}/${subject.id}/q${i}:options=${q.options.length}`);});
        }
        for(const group of grade.groups||[])for(const subject of group.subjects||[]){
          subjects++;
          const quiz=D.quizForSelection(schoolId,gradeId,group.id,subject);
          if(!quiz)continue;ready++;
          if(quiz.questions.length!==3) failures.push(`${schoolId}/${gradeId}/${group.id}/${subject.id}:questions=${quiz.questions.length}`);
          quiz.questions.forEach((q,i)=>{if(q.options.length!==2)failures.push(`${schoolId}/${gradeId}/${group.id}/${subject.id}/q${i}:options=${q.options.length}`);});
        }
      }
    }
    return {failures,subjects,ready,declared:D.verifiedQuizCount,support:D.supportQuizCount,total:D.totalAvailableQuizCount,eneegylGrades:D.schools.eneegyl.gradeOrder};
  });
  assert.deepEqual(integrity.failures,[],`${label}: verified 3x2 quiz policy failed: ${integrity.failures.join(', ')}`);
  assert.ok(integrity.subjects>250,`${label}: diagnostic catalog looks incomplete (${integrity.subjects} subject entries)`);
  assert.equal(integrity.ready,136,`${label}: only reviewed or explicitly bounded support tests must be exposed`);
  assert.equal(integrity.declared,38,`${label}: declared verified quiz count is wrong`);
  assert.equal(integrity.support,59,`${label}: same-grade support quiz count is wrong`);
  assert.equal(integrity.total,136,`${label}: total available Special Education test count is wrong`);
    assert.deepEqual(integrity.eneegylGrades,['gym-a','gym-b','gym-c','gym-d','lyc-a','lyc-b','lyc-c','lyc-d'],`${label}: ENEEGYL must expose 8 grades`);

    await chooseSchool(page,'eneegyl');
    const grades=await page.locator('#spdiagGrade option').evaluateAll(els=>els.map(e=>e.value).filter(Boolean));
    assert.deepEqual(grades,['gym-a','gym-b','gym-c','gym-d','lyc-a','lyc-b','lyc-c','lyc-d'],`${label}: ENEEGYL grade selector wrong`);

    await page.selectOption('#spdiagGrade','lyc-a');
    await page.waitForTimeout(100);
    const aSubjects=await page.locator('#spdiagSubject option').evaluateAll(els=>els.map(e=>e.textContent.trim()));
    assert.ok(aSubjects.length>=21,`${label}: ENEEGYL A Lyceum still looks underfilled`);
    for(const expected of ['Αρχές Οικονομίας','Αγωγή Υγείας','Αρχές Μηχανολογίας','Γεωπονία και Αειφόρος Ανάπτυξη']){
      assert.ok(aSubjects.some(x=>x.startsWith(expected)),`${label}: ENEEGYL A Lyceum missing ${expected}`);
    }
    assert.ok(aSubjects.some(x=>x.startsWith('Νέα Ελληνικά')&&x.includes('τεστ υποστήριξης')),`${label}: ENEEGYL A Lyceum support test is not labelled honestly`);
    await page.selectOption('#spdiagSubject','new-greek');
    assert.equal(await page.locator('#spdiagStart').isEnabled(),true,`${label}: ENEEGYL A Lyceum Greek support test should start`);
    assert.match(await page.locator('#spdiagScope').innerText(),/ίδιου μαθήματος.*αντίστοιχης τάξης/i,`${label}: ENEEGYL support-test boundary message missing`);

    await page.selectOption('#spdiagGrade','lyc-b');
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#spdiagGroupWrap').isVisible(),true,`${label}: ENEEGYL B Lyceum sector selector missing`);
    await page.selectOption('#spdiagGroup','administration-economy');
    await page.waitForTimeout(100);
    assert.ok((await page.locator('#spdiagSubject option').allTextContents()).some(x=>x.startsWith('Αρχές Λογιστικής')),`${label}: ENEEGYL B Administration/Economy subjects missing`);

    await page.selectOption('#spdiagGrade','lyc-d');
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#spdiagGroupWrap').isVisible(),true,`${label}: ENEEGYL D Lyceum specialty selector missing`);
    const specialties=await page.locator('#spdiagGroup option').count();
    assert.ok(specialties>=25,`${label}: ENEEGYL D specialty list looks incomplete (${specialties})`);
    await page.selectOption('#spdiagGroup','it-apps');
    await page.waitForTimeout(100);
    assert.ok((await page.locator('#spdiagSubject option').allTextContents()).some(x=>x.startsWith('Προγραμματισμός Υπολογιστών')),`${label}: ENEEGYL D Informatics specialty subjects missing`);

    await page.selectOption('#spdiagSubject','programming');
    assert.equal(await page.locator('#spdiagStart').isDisabled(),true,`${label}: subject without a real quiz must stay disabled`);
    assert.match(await page.locator('#spdiagScope').innerText(),/δεν υπάρχει ακόμη επαληθευμένο τεστ/i,`${label}: honest unavailable message is missing`);

    await page.selectOption('#spdiagGrade','lyc-b');
    await page.selectOption('#spdiagGroup','health');
    await page.selectOption('#spdiagSubject','health-nutrition');
    assert.equal(await page.locator('#spdiagStart').isEnabled(),true,`${label}: verified Health and Nutrition quiz should start`);
    await page.click('#spdiagStart');
    await page.waitForSelector('#spdiagQuiz:not([hidden])');
    assert.equal(await page.locator('.spdiag__answer').count(),2,`${label}: quiz question must show two answers`);
    for(let i=0;i<3;i++){
      await page.locator('.spdiag__answer').first().click();
      await page.locator('.spdiag__next').click();
      if(i<2) await page.waitForTimeout(50);
    }
    await page.waitForSelector('.spdiag__result');
    assert.match(await page.locator('.spdiag__result').innerText(),/\/3/,`${label}: result score missing`);
    assert.ok((await page.locator('.spdiag__result').innerText()).includes('AI Βοήθεια'),`${label}: AI Help result action missing`);
    assert.ok(await page.locator('.spdiag__result .spdiag__tool').count()>=2,`${label}: Special Education tool recommendations missing`);

    await page.click('.spdiag__close');
    await reopenPicker(page);
    await chooseSchool(page,'special-gymnasium');
    await page.selectOption('#spdiagGrade','a');
    assert.ok(await page.locator('#spdiagSubject option').count()>=18,`${label}: Special Gymnasium A subjects incomplete`);
    await page.selectOption('#spdiagSubject','math');
    assert.equal(await page.locator('#spdiagStart').isEnabled(),true,`${label}: verified Special Gymnasium Maths support quiz must be available`);

    await page.click('.spdiag__close');
    await reopenPicker(page);
    await chooseSchool(page,'special-lyceum');
    await page.selectOption('#spdiagGrade','a');
    await page.selectOption('#spdiagSubject','new-greek');
    assert.equal(await page.locator('#spdiagStart').isEnabled(),true,`${label}: bounded Special Lyceum GEL-support quiz must be available`);
    assert.match(await page.locator('#spdiagScope').innerText(),/ίδιου μαθήματος.*αντίστοιχης τάξης|same subject/i,`${label}: Special Lyceum support boundary is not disclosed`);
    assert.match(await page.locator('#spdiagStart').innerText(),/τεστ υποστήριξης|support test/i,`${label}: Special Lyceum button must not label a GEL support mapping as a verified Special Lyceum test`);

    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
    assert.ok(noOverflow,`${label}: horizontal overflow introduced by Special Education diagnostic`);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('Special Education diagnostic passed on desktop/mobile with five school paths and no unrelated fallback questions.');
}finally{
  await browser.close();
}
