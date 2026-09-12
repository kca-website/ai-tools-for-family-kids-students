import { chromium } from 'playwright';

const BASE='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
function assert(condition,message){if(!condition)throw new Error(message);}

try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});

  await page.goto(`${BASE}/teacher-assistant.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#context');
  await page.waitForFunction(()=>!!window.AITOOLSKIDS_ENEEGYL_OFFICIAL_SECTORS_2026_2027,{timeout:30000});
  await page.selectOption('#context','eneegyl');

  async function chooseGrade(id){await page.selectOption('#grade',id);await page.waitForTimeout(100);}
  async function labels(){return (await page.locator('#subject option').allTextContents()).map(x=>x.trim());}
  async function chooseLabel(label){
    const value=await page.locator('#subject option').evaluateAll((opts,label)=>opts.find(o=>o.textContent.trim()===label)?.value||'',label);
    assert(value,`Missing subject: ${label}`);
    await page.selectOption('#subject',value);await page.waitForTimeout(100);return value;
  }
  async function units(){return (await page.locator('#unit option').allTextContents()).map(x=>x.trim()).filter(Boolean);}

  await chooseGrade('lyc-a');
  for(const expected of ['Αρχές Οικονομίας','Αγωγή Υγείας','Βασικές Αρχές Σύνθεσης','Ερευνητική Εργασία στην Τεχνολογία','Αρχές Μηχανολογίας','Γεωπονία και Αειφόρος Ανάπτυξη']){
    assert((await labels()).includes(expected),`Α΄ ENEEGYL missing official subject: ${expected}`);
  }
  await chooseLabel('Αρχές Οικονομίας');
  assert((await units()).some(x=>x.includes('Κεφάλαιο 9')), 'Α΄ Αρχές Οικονομίας missing official Chapter 9');
  await chooseLabel('Αγωγή Υγείας');
  assert((await units()).some(x=>x.includes('Περιβάλλον και Υγεία')), 'Α΄ Αγωγή Υγείας missing environment/health axis');
  await chooseLabel('Βασικές Αρχές Σύνθεσης');
  assert((await units()).some(x=>x.includes('Κεφάλαιο 5')), 'Α΄ Βασικές Αρχές Σύνθεσης missing Chapter 5');
  await chooseLabel('Αρχές Μηχανολογίας');
  assert((await units()).some(x=>x.includes('Ενότητα 6')), 'Α΄ Αρχές Μηχανολογίας missing Unit 6');
  await chooseLabel('Γεωπονία και Αειφόρος Ανάπτυξη');
  assert((await units()).some(x=>x.includes('Κεφάλαιο 10')), 'Α΄ Γεωπονία missing Chapter 10');

  await chooseGrade('lyc-b');
  let b=await labels();
  for(const expected of ['Εισαγωγή στην Εφοδιαστική (Logistics)','Κτιριακά Έργα και Δομικά Υλικά','Ελεύθερο Σχέδιο','Τεχνολογία Μηχανολογικών Κατασκευών – Εφαρμογές','Φυτική Παραγωγή']){
    assert(b.includes(expected),`Β΄ ENEEGYL missing official sector subject: ${expected}`);
  }
  await chooseLabel('Τοπογραφία');
  assert(await page.locator('#customUnitField').isVisible(),'Verified Τοπογραφία without encoded subunits must ask for the exact unit');
  const note=await page.locator('#curriculumNote').innerText();
  assert(note.includes('Επαληθευμένο μάθημα 2026–27'),`Exact-unit guard note missing: ${note}`);
  assert(note.includes('Επίσημη πηγή'),'Official source link missing for exact-unit subject');

  await chooseGrade('lyc-c');
  const c=await labels();
  for(const expected of ['Αρχές Οικονομικής Θεωρίας','Οικοδομική','Αρχές Σύνθεσης','Ανατομία-Φυσιολογία ΙΙ','Αρχές Αρχιτεκτονικής Τοπίου']){
    assert(c.includes(expected),`Γ΄ ENEEGYL missing official sector subject: ${expected}`);
  }

  await chooseGrade('lyc-d');
  const d=await labels();
  for(const token of [
    'Τεχνικός Οχημάτων · Μηχανές Εσωτερικής Καύσης II',
    'Βοηθός Νοσηλευτή · Νοσηλευτική II',
    'Τεχνικός Φυτικής Παραγωγής · Δενδροκομία – Αμπελουργία',
    'Τεχνικός Δομικών Έργων και Γεωπληροφορικής · Εφαρμογές Γεωπληροφορικής στα Τεχνικά Έργα',
    'Υπάλληλος Αποθήκης και Συστημάτων Εφοδιασμού · Εφαρμογές Εφοδιαστικής'
  ]) assert(d.includes(token),`Δ΄ ENEEGYL missing specialty subject: ${token}`);

  const marker=await page.evaluate(()=>window.AITOOLSKIDS_ENEEGYL_OFFICIAL_SECTORS_2026_2027);
  assert(marker.schoolYear==='2026-2027','Wrong ENEEGYL official-sector school year');
  assert(Array.isArray(marker.addedEntries)&&marker.addedEntries.length>=100,`Official ENEEGYL sector catalog unexpectedly small: ${marker.addedEntries?.length}`);
  assert(errors.length===0,`Page errors: ${errors.join(' | ')}`);
  console.log(`ENEEGYL official sectors smoke passed: ${marker.addedEntries.length} current official curriculum entries active.`);
} finally {
  await browser.close();
}
