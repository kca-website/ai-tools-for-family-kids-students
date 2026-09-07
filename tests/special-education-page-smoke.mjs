import { chromium } from 'playwright';

const base='http://127.0.0.1:4173/special-education.html';
const browser=await chromium.launch({headless:true});

function assert(condition,message){if(!condition) throw new Error(message);}

async function runDiagnostic(page,root,expectedOptions,label){
  const details=page.locator(`${root} [data-section="quiz"]`);
  if(!(await details.evaluate((el)=>el.open))) await details.locator('summary').click();
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
  assert(homeText.includes('Ειδικό Γυμνάσιο')&&homeText.includes('Ειδικό Λύκειο')&&homeText.includes('ΕΝ.Ε.Ε.ΓΥ.-Λ.'),`${label}: all three school types must be visible`);
  assert(homeText.includes('8 τάξεις')&&homeText.includes('4 Γυμνασίου + 4 Λυκείου'),`${label}: ENEEGYL eight-grade structure missing from home`);
  assert(!homeText.includes('♿'),`${label}: wheelchair icon must not represent Special Education`);
  assert(await page.locator('#spHome [data-branch]').count()===3,`${label}: expected three Special Education school choices`);
  assert(await page.locator('#spHome .sp-unified-ai').isVisible(),`${label}: unified AI Help entry missing`);

  const supportText=await page.locator('#spSupportTools').innerText();
  assert(await page.locator('#spSupportTools .sp-tool-card').count()>=6,`${label}: support-tool recommendations missing`);
  assert(/Immersive Reader/i.test(supportText)&&supportText.includes('Φωνητική πληκτρολόγηση')&&supportText.includes('Desmos'),`${label}: key support tools missing`);

  await page.locator('[data-branch="special-gymnasium"]').click();
  await page.locator('#spSpecialGymnasium').waitFor({state:'visible'});
  const sgText=await page.locator('#spSpecialGymnasium').innerText();
  assert(!sgText.includes('34 ώρες/εβδομάδα'),`${label}: timetable-hour wall should not be visible`);
  assert(sgText.includes('3 σύντομες ερωτήσεις')&&sgText.includes('2 καθαρές επιλογές'),`${label}: Special Gymnasium simplified-test note missing`);
  assert(await page.locator('#spSpecialGymProfile [data-sg-grade]').count()===3,`${label}: Special Gymnasium needs A/B/C grade choices`);
  assert(await page.locator('#spSpecialGymProfile .sp-subject-card').count()===18,`${label}: Special Gymnasium A should show 18 subjects`);
  const firstAiHref=await page.locator('#spSpecialGymProfile .sp-action--ai').first().getAttribute('href');
  assert(firstAiHref?.includes('schoolTrack=special-gymnasium')&&firstAiHref.includes('grade=a'),`${label}: Special Gymnasium AI link missing context`);

  await page.locator('[data-open-sg-unit="special-gym-a-language-comprehension"][data-focus="quiz"]').click();
  await page.locator('#spSpecialGymUnitMount .sp-unit').waitFor({state:'visible'});
  assert((await page.locator('#spSpecialGymUnitMount').innerText()).includes('Μαθαίνω απλά'),`${label}: Special Gymnasium study flow missing`);
  await runDiagnostic(page,'#spSpecialGymUnitMount',2,`${label} Special Gym A language`);

  for(const grade of [
    {id:'b',labelEl:'Β΄ Γυμνασίου',language:'special-gym-b-language-comprehension'},
    {id:'c',labelEl:'Γ΄ Γυμνασίου',language:'special-gym-c-language-comprehension'}
  ]){
    await page.locator(`[data-sg-grade="${grade.id}"]`).click();
    assert((await page.locator('#spSpecialGymProfile').innerText()).includes(grade.labelEl),`${label}: Special Gymnasium ${grade.id.toUpperCase()} selection failed`);
    assert(await page.locator(`#spSpecialGymProfile [data-open-sg-unit^="special-gym-${grade.id}-"][data-focus="quiz"]`).count()===2,`${label}: Special Gymnasium ${grade.id.toUpperCase()} must expose Language + Math micro quizzes`);
    await page.locator(`[data-open-sg-unit="${grade.language}"][data-focus="quiz"]`).click();
    await page.locator('#spSpecialGymUnitMount .sp-unit').waitFor({state:'visible'});
    await runDiagnostic(page,'#spSpecialGymUnitMount',2,`${label} Special Gym ${grade.id.toUpperCase()} language`);
  }

  await page.locator('#spSpecialGymnasium .sp-back').click();
  await page.locator('[data-branch="special-lyceum"]').click();
  await page.locator('#spSpecialLyceum').waitFor({state:'visible'});
  const slText=await page.locator('#spSpecialLyceum').innerText();
  assert(slText.includes('Ειδικό Λύκειο'),`${label}: Special Lyceum route missing`);
  assert(slText.includes('δεν χρησιμοποιούμε το απαιτητικό exam-level quiz'),`${label}: Special Lyceum simplified quiz boundary missing`);
  assert(await page.locator('#spSpecialLyceumProfile [data-sl-grade]').count()===3,`${label}: Special Lyceum must expose A/B/C grades`);
  const slHref=await page.locator('#spSpecialLyceumProfile .sp-action--ai').first().getAttribute('href');
  assert(slHref?.includes('schoolTrack=special-lyceum')&&slHref.includes('grade=a'),`${label}: Special Lyceum AI deep link missing`);
  await page.locator('[data-sl-grade="c"]').click();
  assert((await page.locator('#spSpecialLyceumProfile').innerText()).includes('Γ΄ Λυκείου'),`${label}: Special Lyceum C selection failed`);

  await page.locator('#spSpecialLyceum .sp-back').click();
  await page.locator('[data-branch="eneegyl"]').click();
  await page.locator('#spEneegyl').waitFor({state:'visible'});
  const enText=await page.locator('#spEneegyl').innerText();
  assert(enText.includes('Α΄, Β΄, Γ΄, Δ΄ Γυμνασίου')&&enText.includes('Α΄, Β΄, Γ΄, Δ΄ Λυκείου'),`${label}: ENEEGYL 4+4 structure explanation missing`);
  assert(enText.includes('Σχολική δομή ≠ πλήρης χαρτογράφηση ύλης'),`${label}: ENEEGYL structure-vs-content boundary missing`);
  assert(enText.includes('3 σύντομες ερωτήσεις')&&enText.includes('2 επιλογές'),`${label}: ENEEGYL simplified-test note missing`);
  assert(await page.locator('#spEneegylProfile [data-en-grade]').count()===8,`${label}: ENEEGYL must expose eight grade choices`);

  assert(await page.locator('#spEneegylProfile [data-en-structure-subject]').count()>=18,`${label}: ENEEGYL A Gymnasium subject structure incomplete`);
  assert((await page.locator('#spEneegylProfile').innerText()).includes('Οικιακή Οικονομία'),`${label}: ENEEGYL A Gymnasium expected subject missing`);

  await page.locator('[data-en-grade="gym-d"]').click();
  assert((await page.locator('#spEneegylProfile').innerText()).includes('Οικονομικά'),`${label}: ENEEGYL D Gymnasium Economics missing`);

  await page.locator('[data-en-grade="lyc-a"]').click();
  assert(await page.locator('#spEneegylProfile [data-en-structure-subject]').count()===18,`${label}: ENEEGYL A Lyceum should expose 18 timetable subject choices/groups`);
  const aLyceumText=await page.locator('#spEneegylProfile').innerText();
  assert(aLyceumText.includes('Αγωγή Υγείας')&&aLyceumText.includes('Αρχές Οικονομίας')&&aLyceumText.includes('Ερευνητική Εργασία στην Τεχνολογία'),`${label}: ENEEGYL A Lyceum enrichment incomplete`);
  assert(await page.locator('[data-en-structure-subject="creative-zone"] .sp-ready-pill').count()===1,`${label}: mapped A Lyceum ZDD route should be marked ready`);
  const zddAi=await page.locator('[data-en-structure-subject="creative-zone"] .sp-action--ai').getAttribute('href');
  assert(zddAi?.includes('grade=lyc-a')&&zddAi.includes('subject=eneegyl-a-zdd'),`${label}: ENEEGYL A Lyceum mapped AI link wrong`);

  await page.locator('[data-en-grade="lyc-b"]').click();
  assert(await page.locator('#spEneegylProfile [data-en-ready-unit]').count()===5,`${label}: ENEEGYL B Lyceum should retain five ready mapped routes`);
  const accountingCard=page.locator('#spEneegylProfile [data-en-ready-unit="eneegyl-b-economy-accounting-basics"]');
  const accountingAi=await accountingCard.locator('.sp-action--ai').getAttribute('href');
  assert(accountingAi?.includes('schoolTrack=eneegyl')&&accountingAi.includes('grade=lyc-b')&&accountingAi.includes('subject=eneegyl-b-economy-accounting-basics'),`${label}: accounting AI link missing exact ENEEGYL context`);
  await accountingCard.locator('[data-open-unit="eneegyl-b-economy-accounting-basics"][data-focus="quiz"]').click();
  await page.locator('#spUnitMount .sp-unit').waitFor({state:'visible'});
  assert((await page.locator('#spUnitMount').innerText()).includes('Ενεργητικό'),`${label}: accounting learning content missing`);
  await runDiagnostic(page,'#spUnitMount',2,`${label} accounting`);

  if(viewport.width<=600){
    const actionRects=await page.locator('.sp-content:not([hidden]) .sp-action:visible, #spHome .sp-unified-ai:visible, .sp-tool-card a:visible').evaluateAll((els)=>els.map((el)=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};}));
    assert(actionRects.every((r)=>r.left>=-1&&r.right<=viewport.width+1&&r.width>0),`${label}: action button escapes mobile viewport`);
  }
  const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert(noOverflow,`${label}: horizontal overflow`);
  assert(errors.length===0,`${label}: browser errors: ${errors.join('\n')}`);
  await page.close();
}

try{
  await check({width:1280,height:900},'desktop');
  await check({width:390,height:844},'mobile');
  console.log('Special Education eight-grade ENEEGYL + support-tools page smoke passed on desktop/mobile.');
}finally{
  await browser.close();
}
