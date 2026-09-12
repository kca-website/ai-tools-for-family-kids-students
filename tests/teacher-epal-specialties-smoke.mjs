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
  await page.waitForFunction(()=>window.AITOOLSKIDS_EPAL_C_FINAL_SECTORS_2026_2027&&window.AITOOLSKIDS_EPAL_PANHELLENIC_2027,{timeout:30000});

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
    await page.waitForTimeout(100);
    const labels=(await page.locator('#subject option').allTextContents()).map(x=>x.trim());
    for(const expected of expectedSubjects){
      assert(labels.includes(expected),`Specialty ${id} missing subject: ${expected}\nActual: ${labels.join(' | ')}`);
    }
    assert(!labels.some(x=>x.includes('Τεχνολογικά / Επαγγελματικά μαθήματα')),`Specialty ${id} fell back to generic EPAL subject`);
    return labels;
  };

  const checkUnits=async(subjectLabel,expectedUnits)=>{
    await page.selectOption('#subject',{label:subjectLabel});
    await page.waitForTimeout(60);
    const units=(await page.locator('#unit option').allTextContents()).map(x=>x.trim());
    for(const expected of expectedUnits){
      assert(units.includes(expected),`${subjectLabel} missing official mapped unit: ${expected}\nActual: ${units.join(' | ')}`);
    }
    const note=await page.locator('#curriculumNote').innerText();
    assert(note.includes('Πανελλαδικών 2027'),`${subjectLabel} should show official 2027 Panhellenic source note`);
  };

  await choose('info-apps',['Προγραμματισμός Υπολογιστών','Σχεδιασμός και Ανάπτυξη Διαδικτυακών Εφαρμογών']);
  await checkUnits('Προγραμματισμός Υπολογιστών',['Κεφάλαιο 3 — Βασικά στοιχεία γλώσσας προγραμματισμού','Κεφάλαιο 11 — Αντικειμενοστρεφής Προγραμματισμός']);

  await choose('structures-geoinfo',['Αρχιτεκτονικό Σχέδιο','Οικοδομική','Εφαρμογές Γεωπληροφορικής στα Τεχνικά Έργα']);
  await checkUnits('Αρχιτεκτονικό Σχέδιο',['Κεφάλαιο 6 — Αρχιτεκτονική μελέτη επαγγελματικού χώρου (κατάστημα σε δύο επίπεδα)','Κεφάλαιο 7 — Αρχιτεκτονική μελέτη πολυώροφου κτιρίου']);
  await checkUnits('Οικοδομική',['Κεφάλαιο 1 — Τοιχοποιίες','Κεφάλαιο 8 — Κλίμακες']);

  await choose('admin-office',['Αρχές Οικονομικής Θεωρίας','Αρχές Οργάνωσης και Διοίκησης']);
  await checkUnits('Αρχές Οικονομικής Θεωρίας',['Κεφάλαιο 1 — Βασικές οικονομικές έννοιες','Κεφάλαιο 10 — Τα δημόσια οικονομικά']);

  await choose('maritime-master',['Ναυσιπλοΐα ΙΙ','Ναυτικό Δίκαιο - Διεθνείς Κανονισμοί στη Ναυτιλία - Εφαρμογές']);
  await checkUnits('Ναυσιπλοΐα ΙΙ',['Κεφάλαιο 7 — Ναυτική κοσμογραφία','Κεφάλαιο 11 — Παλίρροιες']);
  await checkUnits('Ναυτικό Δίκαιο - Διεθνείς Κανονισμοί στη Ναυτιλία - Εφαρμογές',['Στοιχεία Ναυτικού Δικαίου — Κεφάλαιο 1: Ναυτικό δίκαιο','Διεθνείς Κανονισμοί — Κεφάλαιο 8: BWM — διαχείριση έρματος']);
  let prompt=await page.evaluate(()=>promptText());
  assert(prompt.includes('Ειδικότητα ΕΠΑΛ: Πλοίαρχος Εμπορικού Ναυτικού'),'Prompt missing selected maritime specialty');
  assert(prompt.includes('Τομέας ΕΠΑΛ: Ναυτιλιακών Επαγγελμάτων'),'Prompt missing selected maritime sector');

  await choose('maritime-engineer',['Ναυτικές Μηχανές','Βοηθητικές Εγκαταστάσεις Πλοίου','Τήρηση Φυλακής Μηχανοστασίου']);
  await checkUnits('Ναυτικές Μηχανές',['Τόμος Α΄ — Κεφάλαιο 1: Κατάταξη και στοιχειώδης περιγραφή λειτουργίας των εμβολοφόρων ΜΕΚ','Τόμος Β΄ — Κεφάλαιο 12: Ισχύς, απόδοση και διαγράμματα']);
  prompt=await page.evaluate(()=>promptText());
  assert(prompt.includes('Ειδικότητα ΕΠΑΛ: Μηχανικός Εμπορικού Ναυτικού'),'Prompt missing marine engineer specialty');

  await choose('elec-installations',['Ηλεκτρικές Μηχανές']);
  await checkUnits('Ηλεκτρικές Μηχανές',['Κεφάλαιο 2 — Ηλεκτρικές μηχανές συνεχούς ρεύματος (Σ.Ρ.)','Κεφάλαιο 5 — Μονοφασικοί κινητήρες']);

  await page.selectOption('#grade','b');
  await page.waitForTimeout(100);
  const fieldHidden=await page.locator('#epalSpecialtyField').evaluate(el=>el.hidden);
  assert(fieldHidden,'Specialty selector should be hidden outside Γ΄ ΕΠΑΛ');
  const bSubjects=(await page.locator('#subject option').allTextContents()).map(x=>x.trim());
  assert(bSubjects.some(x=>x.includes('Υγείας - Πρόνοιας - Ευεξίας · Ανατομία-Φυσιολογία I')),'Β΄ ΕΠΑΛ Health sector expansion not active');
  assert(!bSubjects.includes('Τεχνολογικά / Επαγγελματικά μαθήματα'),'Β΄ ΕΠΑΛ still exposes the old generic professional-subject placeholder');

  assert(errors.length===0,`Page errors: ${errors.join(' | ')}`);
  console.log(`Γ΄ ΕΠΑΛ specialty smoke passed: ${specialtyCount} specialties plus official 2027 Panhellenic chapter mappings verified in UI and prompt.`);
} finally {
  await browser.close();
}
