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
assert.equal(M.mappedEntries.length,8);
for(const id of M.mappedEntries){
  assert.ok(C[id],`missing ${id}`);
  assert.equal(C[id].coverageStatus,'annual-instructions-verified');
  assert.equal(C[id].annualInstructionsStatus,'2026-27-verified');
  assert.ok(C[id].officialAnchors.length>0,`${id} has no selectable anchors`);
  assert.ok(C[id].sourceUrl.includes('minedu.gov.gr'),`${id} must retain official ministry source`);
}

assert.equal(C['teacher-annual-special-gym-a-physics'].officialAnchors.length,10);
assert.ok(C['teacher-annual-special-gym-a-physics'].officialAnchors.some(x=>x.includes('Πυκνότητας')));
assert.ok(C['teacher-annual-special-gym-a-physics'].officialAnchors.some(x=>x.includes('Γεννήτρια')));

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

const eco=C['teacher-extra-special-gym-c-economics'];
for(const wrong of ['Ακαθάριστο Εγχώριο Προϊόν','Πληθωρισμός','Αποταμίευση','χρηματοπιστωτικά']){
  assert.ok(!eco.officialAnchors.some(x=>x.includes(wrong)),`obsolete economics anchor survived: ${wrong}`);
}
assert.ok(eco.officialAnchors.includes('1.3 Στενότητα'));
assert.ok(eco.officialAnchors.includes('3.5 Επιχειρηματικότητα'));
assert.ok(eco.officialAnchors.some(x=>x.includes('μόνο Τέλειος Ανταγωνισμός')));
assert.ok(eco.excludedAnchors.some(x=>x.includes('Κεφάλαιο 5')));

console.log('Special Gymnasium annual 2026-2027 mapping smoke passed: 8 official mappings.');
