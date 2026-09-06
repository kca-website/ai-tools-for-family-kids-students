import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const LOCAL='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});

async function openPicker(page){
  await page.goto(LOCAL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#heroQuizCtaBtn',{state:'visible',timeout:30000});
  await page.click('#heroQuizCtaBtn');
  await page.waitForSelector('#heroQuizPicker:not([hidden])',{timeout:10000});
  await page.waitForSelector('[data-special-education-diagnostic-entry="1"]',{state:'visible',timeout:10000});
}

async function chooseSchool(page,id){
  await page.click(`#spdiagSchools [data-school="${id}"]`);
  await page.waitForFunction((id)=>document.querySelector(`#spdiagSchools [data-school="${id}"]`)?.classList.contains('is-active'),id);
}

try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
    const label=viewport.width<600?'mobile':'desktop';
    const page=await browser.newPage({viewport});
    const errors=[];
    page.on('pageerror',(err)=>errors.push(err.message));
    page.on('console',(msg)=>{if(msg.type()==='error') errors.push(msg.text());});

    await openPicker(page);

    const normalButtons=await page.locator('#heroQuizPickerGrid .hero__quiz-picker-btn:not([data-special-education-diagnostic-entry])').count();
    assert.equal(normalButtons,3,`${label}: normal Primary/Middle/High diagnostic entries changed`);
    assert.equal(await page.evaluate(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA),false,`${label}: Special Education diagnostic catalog was preloaded`);
    assert.equal(await page.locator('script[src*="special-education-diagnostic-data.js"]').count(),0,`${label}: heavy diagnostic data script loaded before click`);

    await page.click('[data-special-education-diagnostic-entry="1"]');
    await page.waitForSelector('#specialDiagnosticModal:not([hidden])',{timeout:10000});
    await page.waitForFunction(()=>!!window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA,{timeout:15000});
    assert.equal(await page.locator('#spdiagSchools .spdiag__school').count(),3,`${label}: expected three Special Education school types`);

    const integrity=await page.evaluate(()=>{
      const D=window.AITOOLSKIDS_SPECIAL_EDUCATION_DIAGNOSTIC_DATA;
      const failures=[];
      let subjects=0;
      for(const schoolId of D.schoolOrder){
        const school=D.schools[schoolId];
        for(const gradeId of school.gradeOrder){
          const grade=school.grades[gradeId];
          const pools=[...(grade.subjects||[])];
          for(const g of grade.groups||[]) pools.push(...(g.subjects||[]));
          for(const subject of pools){
            subjects++;
            const quiz=D.quizForSubject(subject);
            if(quiz.questions.length!==3) failures.push(`${schoolId}/${gradeId}/${subject.id}:questions=${quiz.questions.length}`);
            quiz.questions.forEach((q,i)=>{if(q.options.length!==2)failures.push(`${schoolId}/${gradeId}/${subject.id}/q${i}:options=${q.options.length}`);});
          }
        }
      }
      return {failures,subjects,eneegylGrades:D.schools.eneegyl.gradeOrder};
    });
    assert.deepEqual(integrity.failures,[],`${label}: simplified 3x2 quiz policy failed: ${integrity.failures.join(', ')}`);
    assert.ok(integrity.subjects>250,`${label}: diagnostic catalog looks incomplete (${integrity.subjects} subject entries)`);
    assert.deepEqual(integrity.eneegylGrades,['gym-a','gym-b','gym-c','gym-d','lyc-a','lyc-b','lyc-c','lyc-d'],`${label}: ENEEGYL must expose 8 grades`);

    await chooseSchool(page,'eneegyl');
    const grades=await page.locator('#spdiagGrade option').evaluateAll(els=>els.map(e=>e.value).filter(Boolean));
    assert.deepEqual(grades,['gym-a','gym-b','gym-c','gym-d','lyc-a','lyc-b','lyc-c','lyc-d'],`${label}: ENEEGYL grade selector wrong`);

    await page.selectOption('#spdiagGrade','lyc-a');
    await page.waitForTimeout(100);
    const aSubjects=await page.locator('#spdiagSubject option').evaluateAll(els=>els.map(e=>e.textContent.trim()));
    assert.ok(aSubjects.length>=21,`${label}: ENEEGYL A Lyceum still looks underfilled`);
    for(const expected of ['Αρχές Οικονομίας','Αγωγή Υγείας','Αρχές Μηχανολογίας','Γεωπονία και Αειφόρος Ανάπτυξη']){
      assert.ok(aSubjects.includes(expected),`${label}: ENEEGYL A Lyceum missing ${expected}`);
    }

    await page.selectOption('#spdiagGrade','lyc-b');
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#spdiagGroupWrap').isVisible(),true,`${label}: ENEEGYL B Lyceum sector selector missing`);
    await page.selectOption('#spdiagGroup','administration-economy');
    await page.waitForTimeout(100);
    assert.ok((await page.locator('#spdiagSubject option').allTextContents()).includes('Αρχές Λογιστικής'),`${label}: ENEEGYL B Administration/Economy subjects missing`);

    await page.selectOption('#spdiagGrade','lyc-d');
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#spdiagGroupWrap').isVisible(),true,`${label}: ENEEGYL D Lyceum specialty selector missing`);
    const specialties=await page.locator('#spdiagGroup option').count();
    assert.ok(specialties>=25,`${label}: ENEEGYL D specialty list looks incomplete (${specialties})`);
    await page.selectOption('#spdiagGroup','it-apps');
    await page.waitForTimeout(100);
    assert.ok((await page.locator('#spdiagSubject option').allTextContents()).includes('Προγραμματισμός Υπολογιστών'),`${label}: ENEEGYL D Informatics specialty subjects missing`);

    await page.selectOption('#spdiagSubject','programming');
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

    await page.click('.spdiag__close');
    await page.click('#heroQuizCtaBtn');
    await page.waitForSelector('[data-special-education-diagnostic-entry="1"]',{state:'visible'});
    await page.click('[data-special-education-diagnostic-entry="1"]');
    await chooseSchool(page,'special-gymnasium');
    await page.selectOption('#spdiagGrade','a');
    assert.ok(await page.locator('#spdiagSubject option').count()>=18,`${label}: Special Gymnasium A subjects incomplete`);

    await chooseSchool(page,'special-lyceum');
    await page.selectOption('#spdiagGrade','a');
    assert.ok(await page.locator('#spdiagSubject option').count()>=14,`${label}: Special Lyceum A subjects incomplete`);

    const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
    assert.ok(noOverflow,`${label}: horizontal overflow introduced by Special Education diagnostic`);
    assert.deepEqual(errors,[],`${label}: browser errors: ${errors.join('\n')}`);
    await page.close();
  }
  console.log('Special Education homepage diagnostic passed on desktop/mobile with lazy data, 8-grade ENEEGYL and 3x2 simplified quizzes.');
}finally{
  await browser.close();
}
