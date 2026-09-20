import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const code=fs.readFileSync(new URL('../teacher-curriculum-special-gym-annual-2026-2027.js', import.meta.url),'utf8');
const window={
  SPECIAL_EDUCATION_CURRICULUM:{entries:{
    'teacher-extra-special-gym-c-economics':{
      officialAnchors:['Ακαθάριστο Εγχώριο Προϊόν (ΑΕΠ)','Πληθωρισμός','Αποταμίευση','Απλά χρηματοπιστωτικά εργαλεία']
    }
  }}
};
const context=vm.createContext({window,document:{getElementById(){return null;}},console});
vm.runInContext(code,context,{filename:'teacher-curriculum-special-gym-annual-2026-2027.js'});

const C=window.SPECIAL_EDUCATION_CURRICULUM.entries;
const M=window.AITOOLSKIDS_SPECIAL_GYM_ANNUAL_2026_2027;
assert.equal(M.mappedEntries.length,17);
for(const id of M.mappedEntries){
  assert.ok(C[id],`missing ${id}`);
  assert.equal(C[id].coverageStatus,'annual-instructions-verified');
  assert.equal(C[id].annualInstructionsStatus,'2026-27-verified');
  assert.ok(C[id].officialAnchors.length>0,`${id} has no selectable anchors`);
  assert.ok(C[id].sourceUrl.includes('minedu.gov.gr'),`${id} must retain official ministry source`);
}

const mathA=C['teacher-annual-special-gym-a-math'];
assert.ok(mathA.officialAnchors.includes('7.5 Πολλαπλασιασμός ρητών αριθμών'));
assert.ok(mathA.officialAnchors.some(x=>x.includes('Γεωμετρία 2.3 Μεσοκάθετος')));
assert.ok(mathA.excludedAnchors.some(x=>x.includes('αδύνατη εξίσωση')));
assert.ok(mathA.excludedAnchors.some(x=>x.includes('ταυτότητα')));

const mathB=C['teacher-annual-special-gym-b-math'];
assert.ok(mathB.officialAnchors.includes('3.4 Η συνάρτηση y = α·x + β'));
assert.ok(mathB.officialAnchors.some(x=>x.includes('Πυθαγόρειο')));
assert.ok(mathB.excludedAnchors.some(x=>x.includes('α·x + β·y = γ')));
assert.ok(mathB.excludedAnchors.some(x=>x.includes('ομαδοποιημένης κατανομής')));
assert.equal(mathB.nonExamAnchors.length,3);

const mathC=C['teacher-annual-special-gym-c-math'];
assert.ok(mathC.officialAnchors.includes('3.3 Αλγεβρική επίλυση γραμμικού συστήματος'));
assert.ok(mathC.officialAnchors.some(x=>x.includes('Τριγωνομετρία 2.3')));
assert.ok(mathC.excludedAnchors.some(x=>x.includes('Διαφορά κύβων')));
assert.ok(mathC.excludedAnchors.some(x=>x.includes('Βασικοί κανόνες λογισμού')));

const physicsA=C['teacher-annual-special-gym-a-physics'];
assert.equal(physicsA.officialAnchors.length,10);
assert.ok(physicsA.officialAnchors.some(x=>x.includes('Πυκνότητας')));
assert.ok(physicsA.officialAnchors.some(x=>x.includes('Γεννήτρια')));

const physicsB=C['teacher-annual-special-gym-b-physics'];
assert.ok(physicsB.officialAnchors.some(x=>x.includes('Άνωση - Αρχή του Αρχιμήδη')));
assert.ok(physicsB.officialAnchors.some(x=>x.includes('Θερμική διαστολή')));
assert.ok(physicsB.excludedAnchors.some(x=>x.includes('4.6 Πλεύση')));
assert.ok(physicsB.excludedAnchors.some(x=>x.includes('5.6 Πηγές ενέργειας')));
assert.ok(!physicsB.officialAnchors.some(x=>x.includes('4.6 Πλεύση')));

const physicsC=C['teacher-annual-special-gym-c-physics'];
assert.ok(physicsC.officialAnchors.includes('3.6 Ενέργεια και ισχύς του ηλεκτρικού ρεύματος'));
assert.ok(physicsC.officialAnchors.some(x=>x.includes('5.3 Χαρακτηριστικά μεγέθη')));
assert.ok(physicsC.officialAnchors.some(x=>x.includes('8.3 Ανάλυση του φωτός')));
assert.ok(physicsC.excludedAnchors.some(x=>x.includes('3.4 Ηλεκτρική και μηχανική ενέργεια')));
assert.ok(physicsC.excludedAnchors.some(x=>x.includes('Νόμος της διάθλασης - Snell')));

assert.equal(C['teacher-annual-special-gym-a-pe'].officialAnchors.length,9);
assert.equal(C['teacher-annual-special-gym-b-pe'].officialAnchors.length,9);
assert.equal(C['teacher-annual-special-gym-c-pe'].officialAnchors.length,9);
assert.ok(C['teacher-annual-special-gym-b-pe'].officialAnchors.every(x=>!x.includes('ηλεκτρ')),'PE leaked Physics content');

assert.ok(C['teacher-annual-special-gym-b-chemistry'].officialAnchors.includes('2.11 Χημική εξίσωση'));
assert.ok(C['teacher-annual-special-gym-b-chemistry'].excludedAnchors.some(x=>x.includes('ιοντικών')));
assert.ok(C['teacher-annual-special-gym-c-chemistry'].officialAnchors.some(x=>x.includes('Εξουδετέρωση')));
assert.ok(C['teacher-annual-special-gym-c-chemistry'].officialAnchors.some(x=>x.includes('Πολυμερισμός')));

const civ=C['teacher-annual-special-gym-b-social-civic'];
assert.ok(civ.officialAnchors.some(x=>x==='1.2 Τι είναι κοινωνία'));
assert.ok(civ.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 1.1')));
assert.ok(civ.officialAnchors.some(x=>x.includes('6.5 Αθλητισμός και βία')));

const civC=C['teacher-annual-special-gym-c-social-civic'];
assert.ok(civC.officialAnchors.includes('8.3 Τι είναι Σύνταγμα'));
assert.ok(civC.officialAnchors.includes('10.1.1 Η σύνθεση της Βουλής'));
assert.ok(civC.officialAnchors.includes('12.3 Ατομικά Δικαιώματα'));
assert.ok(civC.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 9.5')));
assert.ok(civC.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 13.1')));
assert.ok(civC.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 14.2.5')));
assert.ok(civC.excludedAnchors.some(x=>x.includes('Κεφάλαιο 7')));
assert.ok(civC.excludedAnchors.some(x=>x.includes('Κεφάλαιο 11')));
assert.ok(!civC.officialAnchors.some(x=>x.includes('Κεφάλαιο 11')));

const expectedEnglishLevels={a:'A2-/B1-',b:'B1-/B1+',c:'B1+/B2-'};
for(const [grade,level] of Object.entries(expectedEnglishLevels)){
  const e=C[`teacher-annual-special-gym-${grade}-english`];
  assert.equal(e.expectedCefrLevel,level);
  assert.equal(e.anchorPolicy,'competency-framework-not-chapter-syllabus');
  assert.equal(e.officialAnchors.length,6);
  assert.ok(e.officialAnchors.includes('Κατανόηση γραπτού λόγου'));
  assert.ok(e.officialAnchors.includes('Προφορική διαμεσολάβηση'));
  assert.ok(e.officialAnchors.every(x=>!/^unit\s|^κεφ/i.test(x)),'English must not invent chapter/unit syllabus');
}

const eco=C['teacher-extra-special-gym-c-economics'];
for(const wrong of ['Ακαθάριστο Εγχώριο Προϊόν','Πληθωρισμός','Αποταμίευση','χρηματοπιστωτικά']){
  assert.ok(!eco.officialAnchors.some(x=>x.includes(wrong)),`obsolete economics anchor survived: ${wrong}`);
}
assert.ok(eco.officialAnchors.includes('1.3 Στενότητα'));
assert.ok(eco.officialAnchors.includes('3.5 Επιχειρηματικότητα'));
assert.ok(eco.officialAnchors.some(x=>x.includes('μόνο Τέλειος Ανταγωνισμός')));
assert.ok(eco.excludedAnchors.some(x=>x.includes('Κεφάλαιο 5')));

console.log('Special Gymnasium annual 2026-2027 mapping smoke passed: 17 official mappings.');
