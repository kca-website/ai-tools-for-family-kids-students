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
  assert(!homeText.includes('♿'),`${label}: wheelchair icon must not represent Special Education`);
  assert(await page.locator('#spHome [data-branch]').count()===3,`${label}: expected three Special Education school choices`);
  assert(await page.locator('#spHome .sp-unified-ai').isVisible(),`${label}: unified AI Help entry missing`);

  await page.locator('[data-branch="special-gymnasium"]').click();
  await page.locator('#spSpecialGymnasium').waitFor({state:'visible'});
  const sgText=await page.locator('#spSpecialGymnasium').innerText();
  assert(!sgText.includes('34 ώρες/εβδομάδα'),`${label}: timetable-hour wall should not be visible`);
  assert(await page.locator('#spSpecialGymProfile [data-sg-grade]').count()===3,`${label}: Special Gymnasium needs A/B/C grade choices`);
  assert(await page.locator('#spSpecialGymProfile .sp-subject-card').count()===18,`${label}: Special Gymnasium A should show 18 subjects`);
  const firstAiHref=await page.locator('#spSpecialGymProfile .sp-action--ai').first().getAttribute('href');
  assert(firstAiHref?.includes('schoolTrack=special-gymnasium')&&firstAiHref.includes('grade=a'),`${label}: Special Gymnasium AI link missing context`);

  await page.locator('[data-open-sg-unit="special-gym-a-language-comprehension"][data-focus="quiz"]').click();
  await page.locator('#spSpecialGymUnitMount .sp-unit').waitFor({state:'visible'});
  assert((await page.locator('#spSpecialGymUnitMount').innerText()).includes('Μαθαίνω απλά'),`${label}: Special Gymnasium study flow missing`);
  await runDiagnostic(page,'#spSpecialGymUnitMount',3,`${label} Special Gym language`);

  await page.locator('#spSpecialGymnasium .sp-back').click();
  await page.locator('[data-branch="special-lyceum"]').click();
  await page.locator('#spSpecialLyceum').waitFor({state:'visible'});
  const slText=await page.locator('#spSpecialLyceum').innerText();
  assert(slText.includes('Ειδικό Λύκειο'),`${label}: Special Lyceum route missing`);
  assert(await page.locator('#spSpecialLyceumProfile [data-sl-grade]').count()===3,`${label}: Special Lyceum must expose A/B/C grades`);
  const slHref=await page.locator('#spSpecialLyceumProfile .sp-action--ai').first().getAttribute('href');
  assert(slHref?.includes('schoolTrack=special-lyceum')&&slHref.includes('grade=a'),`${label}: Special Lyceum AI deep link missing`);
  await page.locator('[data-sl-grade="c"]').click();
  assert((await page.locator('#spSpecialLyceumProfile').innerText()).includes('Γ΄ Λυκείου'),`${label}: Special Lyceum C selection failed`);

  await page.locator('#spSpecialLyceum .sp-back').click();
  await page.locator('[data-branch="eneegyl"]').click();
  await page.locator('#spEneegyl').waitFor({state:'visible'});
  assert(await page.locator('#spEneegylProfile [data-en-grade]').count()===2,`${label}: ENEEGYL should expose ready A/B choices`);
  assert(await page.locator('#spEneegylProfile .sp-subject-card').count()===1,`${label}: ENEEGYL A should show one ready route`);

  await page.locator('[data-en-grade="b"]').click();
  assert(await page.locator('#spEneegylProfile .sp-subject-card').count()===5,`${label}: ENEEGYL B should show five ready routes`);
  const accountingAi=await page.locator('#spEneegylProfile .sp-subject-card',{hasText:'Αρχές Λογιστικής'}).locator('.sp-action--ai').getAttribute('href');
  assert(accountingAi?.includes('schoolTrack=eneegyl')&&accountingAi.includes('subject=eneegyl-b-economy-accounting-basics'),`${label}: accounting AI link missing exact context`);
  await page.locator('[data-open-unit="eneegyl-b-economy-accounting-basics"][data-focus="quiz"]').click();
  await page.locator('#spUnitMount .sp-unit').waitFor({state:'visible'});
  assert((await page.locator('#spUnitMount').innerText()).includes('Ενεργητικό'),`${label}: accounting learning content missing`);
  await runDiagnostic(page,'#spUnitMount',2,`${label} accounting`);

  if(viewport.width<=600){
    const actionRects=await page.locator('.sp-content:not([hidden]) .sp-action:visible, #spHome .sp-unified-ai:visible').evaluateAll((els)=>els.map((el)=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};}));
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
  console.log('Special Education three-school action-first page smoke passed on desktop/mobile.');
}finally{
  await browser.close();
}
