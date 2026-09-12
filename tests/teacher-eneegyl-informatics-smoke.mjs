import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
function assert(condition,message){if(!condition)throw new Error(message);}

try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});

  await page.goto(`${BASE}/teacher-assistant.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#context');
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_ENEEGYL_INFORMATICS_2026_2027,{timeout:30000});

  await page.selectOption('#context','eneegyl');

  async function subjectLabels(gradeId){
    await page.selectOption('#grade',gradeId);
    await page.waitForTimeout(80);
    return (await page.locator('#subject option').allTextContents()).map(x=>x.trim());
  }
  async function selectSubjectByLabel(label){
    const value=await page.locator('#subject option').evaluateAll((opts,label)=>opts.find(o=>o.textContent.trim()===label)?.value||'',label);
    assert(value,`Missing ENEEGYL subject: ${label}`);
    await page.selectOption('#subject',value);
    await page.waitForTimeout(80);
    return value;
  }
  async function units(){return (await page.locator('#unit option').allTextContents()).map(x=>x.trim()).filter(Boolean);}

  let labels=await subjectLabels('lyc-b');
  for(const expected of ['Βασικά Θέματα Πληροφορικής','Λειτουργικά Συστήματα και Ασφάλεια Πληροφοριακών Συστημάτων','Τεχνικά Θέματα Πωλήσεων & Προδιαγραφών Υλικού και Λογισμικού']){
    assert(labels.includes(expected),`Β΄ ENEEGYL Informatics missing: ${expected}`);
  }
  await selectSubjectByLabel('Λειτουργικά Συστήματα και Ασφάλεια Πληροφοριακών Συστημάτων');
  let topicLabels=await units();
  assert(topicLabels.length>=1&&!topicLabels[0].startsWith('Δεν υπάρχει χαρτογραφημένη'),`Β΄ ENEEGYL OS/Security has no official unit guidance`);
  assert((await page.locator('#customUnitField').isHidden()),'Β΄ ENEEGYL official Informatics mapping unexpectedly asks for custom unit');

  labels=await subjectLabels('lyc-c');
  for(const expected of ['Αρχές Προγραμματισμού Υπολογιστών','Υλικό και Δίκτυα Υπολογιστών','Σχεδιασμός και Ανάπτυξη Ιστότοπων','Προγραμματισμός Υπολογιστών','Δίκτυα Υπολογιστών']){
    assert(labels.includes(expected),`Γ΄ ENEEGYL Informatics missing: ${expected}`);
  }
  await selectSubjectByLabel('Προγραμματισμός Υπολογιστών');
  topicLabels=await units();
  assert(topicLabels.length>=4,`Γ΄ ENEEGYL Programming expected >=4 official units, got ${topicLabels.length}`);
  assert(topicLabels.some(x=>x.includes('Κεφάλαιο 3')),`Γ΄ ENEEGYL Programming missing official Chapter 3`);
  let prompt=await page.evaluate(()=>promptText());
  assert(prompt.includes('ΕΝ.Ε.ΓΥ.-Λ.'),'Prompt missing ENEEGYL context');
  assert(prompt.includes('Προγραμματισμός Υπολογιστών'),'Prompt missing selected ENEEGYL Informatics subject');
  assert(prompt.includes('Κεφάλαιο 3'),'Prompt missing selected official ENEEGYL unit');

  labels=await subjectLabels('lyc-d');
  const appsProgramming=labels.find(x=>x.includes('Τεχνικός Εφαρμογών Πληροφορικής')&&x.includes('Προγραμματισμός Υπολογιστών (Θ)'));
  const appsNetworks=labels.find(x=>x.includes('Τεχνικός Εφαρμογών Πληροφορικής')&&x.includes('Δίκτυα Υπολογιστών (Θ)'));
  assert(appsProgramming,'Δ΄ ENEEGYL Applications specialty Programming theory missing');
  assert(appsNetworks,'Δ΄ ENEEGYL Applications specialty Networks theory missing');
  await selectSubjectByLabel(appsProgramming);
  topicLabels=await units();
  assert(topicLabels.length>=7,`Δ΄ ENEEGYL Panhellenic Programming expected >=7 official units, got ${topicLabels.length}`);
  assert(topicLabels.some(x=>x.includes('Αντικειμενοστρεφής Προγραμματισμός')),'Δ΄ ENEEGYL Programming missing official OOP chapter');

  const marker=await page.evaluate(()=>window.AITOOLSKIDS_ENEEGYL_INFORMATICS_2026_2027);
  assert(marker.protocol==='113150/Δ3',`Wrong ENEEGYL Informatics protocol: ${marker.protocol}`);
  assert(Array.isArray(marker.entries)&&marker.entries.length>=10,`ENEEGYL Informatics dataset looks incomplete: ${marker.entries?.length}`);
  assert(errors.length===0,`Page errors: ${errors.join(' | ')}`);
  console.log(`ENEEGYL Informatics 2026-27 smoke passed: ${marker.entries.length} verified curriculum entries active in teacher UI.`);
} finally {
  await browser.close();
}
