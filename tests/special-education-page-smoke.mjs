import { chromium } from 'playwright';

const base='http://127.0.0.1:4173/special-education.html';
const browser=await chromium.launch({headless:true});

function assert(condition,message){if(!condition) throw new Error(message);}

async function runDiagnostic(page,root,expectedOptions,label){
  const details=page.locator(`${root} [data-section="quiz"]`);
  if(!(await details.getAttribute('open'))) await details.locator('summary').click();
  await page.locator(`${root} [data-sp-quiz-start]`).click();
  assert(await page.locator(`${root} .sp-option`).count()===expectedOptions,`${label}: diagnostic did not render expected options`);
}

async function check(viewport,label){
  const page=await browser.newPage({viewport});
  const errors=[];
  page.on('pageerror',(err)=>errors.push(err.message));
  page.on('console',(msg)=>{if(msg.type()==='error') errors.push(msg.text());});
  await page.goto(base,{waitUntil:'networkidle'});

  assert((await page.title()).includes('Ειδική Εκπαίδευση'),`${label}: wrong page title`);
  const homeText=await page.locator('#spHome').innerText();
  assert(homeText.includes('Διάλεξε σχολείο, τάξη και μάθημα'),`${label}: action-first intro missing`);
  assert(!homeText.includes('Πρόοδος επαλήθευσης'),`${label}: verification tracker leaked into user-facing home`);

  await page.locator('[data-branch="special-gymnasium"]').click();
  await page.locator('#spSpecialGymnasium').waitFor({state:'visible'});
  let sgText=await page.locator('#spSpecialGymnasium').innerText();
  assert(!sgText.includes('34 ώρες/εβδομάδα'),`${label}: timetable-hour wall should not be visible`);
  assert(!sgText.includes('Τι είναι επαληθευμένο'),`${label}: verification prose should not dominate the route`);
  assert(await page.locator('#spSpecialGymProfile [data-sg-grade]').count()===3,`${label}: Special Gymnasium needs A/B/C grade choices`);
  assert(await page.locator('#spSpecialGymProfile .sp-subject-card').count()===18,`${label}: Special Gymnasium A should show its 18 subjects as cards`);

  const firstAiHref=await page.locator('#spSpecialGymProfile .sp-action--ai').first().getAttribute('href');
  assert(firstAiHref?.includes('/middle/student/tutor?') && firstAiHref.includes('schoolTrack=special-gymnasium') && firstAiHref.includes('grade=a'),`${label}: Special Gymnasium AI deep link missing track/grade`);
  assert(await page.locator('[data-open-sg-unit="special-gym-a-language-comprehension"]').count()===2,`${label}: language route should expose study and quick-test actions`);

  await page.locator('[data-open-sg-unit="special-gym-a-language-comprehension"][data-focus="quiz"]').click();
  await page.locator('#spSpecialGymUnitMount .sp-unit').waitFor({state:'visible'});
  const sgUnitText=await page.locator('#spSpecialGymUnitMount').innerText();
  assert(sgUnitText.includes('Μαθαίνω απλά') && sgUnitText.includes('Εξάσκηση') && sgUnitText.includes('Μικρό τεστ'),`${label}: learning/practice/test flow missing`);
  assert(!sgUnitText.includes('Επίσημη βάση'),`${label}: verbose official-basis step should be removed from main learning flow`);
  assert((await page.locator('#spSpecialGymUnitMount .sp-action--ai').first().getAttribute('href'))?.includes('subject=special-gym-a-language-comprehension'),`${label}: unit AI button is not preselected to language`);
  assert(!(await page.locator('#spSpecialGymUnitMount .sp-source-mini').getAttribute('open')),`${label}: source metadata should stay collapsed by default`);
  await runDiagnostic(page,'#spSpecialGymUnitMount',3,`${label} Special Gym language`);

  await page.locator('[data-sg-grade="b"]').click();
  assert(await page.locator('#spSpecialGymProfile .sp-subject-card').count()===19,`${label}: Special Gymnasium B should show 19 subjects`);
  assert(await page.locator('#spSpecialGymProfile [data-open-sg-unit]').count()===0,`${label}: B should not pretend to have mapped study units`);
  assert(await page.locator('#spSpecialGymProfile .sp-action--ai').count()===19,`${label}: every B subject needs a direct AI Help action`);

  let noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert(noOverflow,`${label}: horizontal overflow in Special Gymnasium route`);

  await page.locator('#spSpecialGymnasium .sp-back').click();
  await page.locator('[data-branch="eneegyl"]').click();
  await page.locator('#spEneegyl').waitFor({state:'visible'});

  assert(await page.locator('#spEneegylProfile [data-en-grade]').count()===2,`${label}: ENEEGYL should currently expose ready A/B choices`);
  assert(await page.locator('#spEneegylProfile .sp-subject-card').count()===1,`${label}: ENEEGYL A should show one ready learning route`);
  assert(await page.locator('.sp-source-card').count()===0,`${label}: old nine-source documentation grid should be removed from UX`);
  assert(!(await page.locator('#spEneegyl').innerText()).includes('9 επίσημες εγκύκλιοι'),`${label}: source-index prose should not dominate ENEEGYL route`);

  await page.locator('[data-en-grade="b"]').click();
  assert(await page.locator('#spEneegylProfile .sp-subject-card').count()===5,`${label}: ENEEGYL B should show five ready subject routes`);
  const accountingAi=await page.locator('#spEneegylProfile .sp-subject-card',{hasText:'Αρχές Λογιστικής'}).locator('.sp-action--ai').getAttribute('href');
  assert(accountingAi?.includes('schoolTrack=eneegyl') && accountingAi.includes('grade=b') && accountingAi.includes('subject=eneegyl-b-economy-accounting-basics'),`${label}: accounting AI deep link missing exact context`);

  await page.locator('[data-open-unit="eneegyl-b-economy-accounting-basics"][data-focus="quiz"]').click();
  await page.locator('#spUnitMount .sp-unit').waitFor({state:'visible'});
  const accountingText=await page.locator('#spUnitMount').innerText();
  assert(accountingText.includes('Ενεργητικό'),`${label}: accounting learning content missing`);
  assert(!accountingText.includes('Τι σημαίνει «επαληθευμένο» εδώ'),`${label}: verification explanation should be hidden from main learning UX`);
  await runDiagnostic(page,'#spUnitMount',2,`${label} accounting`);

  if(viewport.width<=600){
    const actionRects=await page.locator('.sp-content:not([hidden]) .sp-action:visible').evaluateAll((els)=>els.map((el)=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};}));
    assert(actionRects.every((r)=>r.left>=-1 && r.right<=viewport.width+1 && r.width>0),`${label}: action button escapes mobile viewport`);
  }

  noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert(noOverflow,`${label}: horizontal overflow after opening learning routes`);
  assert(errors.length===0,`${label}: browser errors: ${errors.join('\n')}`);
  await page.close();
}

try{
  await check({width:1280,height:900},'desktop');
  await check({width:390,height:844},'mobile');
  console.log('Special Education action-first page smoke passed on desktop/mobile.');
}finally{
  await browser.close();
}
