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
  await page.waitForFunction(()=>window.AITOOLSKIDS_EPAL_C_FINAL_SECTORS_2026_2027,{timeout:30000});

  await page.selectOption('#context','epal');
  await page.selectOption('#grade','c');
  await page.waitForFunction(()=>{
    const f=document.getElementById('epalSpecialtyField');
    const s=document.getElementById('epalSpecialty');
    return f&&!f.hidden&&s&&s.options.length>=35;
  },{timeout:10000});

  const specialtyCount=await page.locator('#epalSpecialty option').count();
  assert(specialtyCount>=35,`Expected >=35 Γ΄ ΕΠΑΛ specialties, got ${specialtyCount}`);

  const choose=async(id,expectedSubjects)=>{
    await page.selectOption('#epalSpecialty',id);
    await page.waitForTimeout(80);
    const labels=(await page.locator('#subject option').allTextContents()).map(x=>x.trim());
    for(const expected of expectedSubjects){
      assert(labels.includes(expected),`Specialty ${id} missing subject: ${expected}\nActual: ${labels.join(' | ')}`);
    }
    assert(!labels.some(x=>x.includes('Τεχνολογικά / Επαγγελματικά μαθήματα')),`Specialty ${id} fell back to generic EPAL subject`);
    return labels;
  };

  await choose('info-apps',['Προγραμματισμός Υπολογιστών','Σχεδιασμός και Ανάπτυξη Διαδικτυακών Εφαρμογών']);
  await choose('structures-geoinfo',['Αρχιτεκτονικό Σχέδιο','Οικοδομική','Εφαρμογές Γεωπληροφορικής στα Τεχνικά Έργα']);
  await choose('maritime-master',['Ναυσιπλοΐα ΙΙ','Ναυτικό Δίκαιο - Διεθνείς Κανονισμοί στη Ναυτιλία - Εφαρμογές']);
  let prompt=await page.evaluate(()=>promptText());
  assert(prompt.includes('Ειδικότητα ΕΠΑΛ: Πλοίαρχος Εμπορικού Ναυτικού'),'Prompt missing selected maritime specialty');
  assert(prompt.includes('Τομέας ΕΠΑΛ: Ναυτιλιακών Επαγγελμάτων'),'Prompt missing selected maritime sector');

  await choose('maritime-engineer',['Ναυτικές Μηχανές','Βοηθητικές Εγκαταστάσεις Πλοίου','Τήρηση Φυλακής Μηχανοστασίου']);
  prompt=await page.evaluate(()=>promptText());
  assert(prompt.includes('Ειδικότητα ΕΠΑΛ: Μηχανικός Εμπορικού Ναυτικού'),'Prompt missing marine engineer specialty');

  await page.selectOption('#grade','b');
  await page.waitForTimeout(100);
  const fieldHidden=await page.locator('#epalSpecialtyField').evaluate(el=>el.hidden);
  assert(fieldHidden,'Specialty selector should be hidden outside Γ΄ ΕΠΑΛ');
  const bSubjects=(await page.locator('#subject option').allTextContents()).map(x=>x.trim());
  assert(bSubjects.some(x=>x.includes('Υγείας - Πρόνοιας - Ευεξίας · Ανατομία-Φυσιολογία I')),'Β΄ ΕΠΑΛ Health sector expansion not active');
  assert(!bSubjects.includes('Τεχνολογικά / Επαγγελματικά μαθήματα'),'Β΄ ΕΠΑΛ still exposes the old generic professional-subject placeholder');

  assert(errors.length===0,`Page errors: ${errors.join(' | ')}`);
  console.log(`Γ΄ ΕΠΑΛ specialty smoke passed: ${specialtyCount} specialties, structures + maritime + existing sectors verified in UI and prompt.`);
} finally {
  await browser.close();
}
