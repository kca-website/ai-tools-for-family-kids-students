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
assert.equal(M.mappedEntries.length,32);
assert.equal(M.publishedPending.length,20);
assert.ok(!M.publishedPending.some(x=>x.subjectId==='biology'),'Biology must no longer be pending after exact 2026-27 mapping');
assert.ok(M.publishedPending.some(x=>x.grade==='B'&&x.subjectId==='geography'));
assert.ok(M.publishedPending.some(x=>x.grade==='C'&&x.subjectId==='history'));
assert.ok(M.publishedPending.some(x=>x.grade==='A'&&x.subjectId==='music'&&x.sourceUrl.includes('minedu.gov.gr')));
assert.ok(M.publishedPending.some(x=>x.grade==='C'&&x.subjectId==='art'&&x.sourceUrl.includes('minedu.gov.gr')));
for(const id of M.mappedEntries){
  assert.ok(C[id],`missing ${id}`);
  assert.equal(C[id].coverageStatus,'annual-instructions-verified');
  assert.equal(C[id].annualInstructionsStatus,'2026-27-verified');
  assert.ok(C[id].officialAnchors.length>0,`${id} has no selectable anchors`);
  assert.ok(C[id].sourceUrl.includes('minedu.gov.gr'),`${id} must retain official ministry source`);
}

const ancientA=C['teacher-annual-special-gym-a-ancient-language'];
assert.ok(ancientA.officialAnchors.includes('Ενότητα 8 — δευτερόκλιτα επίθετα και δεικτική αντωνυμία'));
assert.ok(ancientA.officialAnchors.some(x=>x.startsWith('Προαιρετικό — Ενότητα 10')));
assert.ok(ancientA.excludedAnchors.some(x=>x.includes('Ενότητες 14-18')));

const ancientB=C['teacher-annual-special-gym-b-ancient-language'];
assert.ok(ancientB.officialAnchors.some(x=>x.startsWith('Ενότητα 8 — χρήση παράλληλου κειμένου')));
assert.ok(ancientB.excludedAnchors.includes('Ενότητα 1 — να μη διδαχθεί'));
assert.ok(ancientB.excludedAnchors.some(x=>x.includes('Ενότητες 17-18')));
assert.ok(!ancientB.officialAnchors.some(x=>x==='Ενότητα 1'));

const ancientC=C['teacher-annual-special-gym-c-ancient-language'];
assert.ok(ancientC.officialAnchors.some(x=>x.startsWith('Προαιρετικό — Ενότητα 1')));
assert.ok(ancientC.officialAnchors.some(x=>x.includes('Α΄ Βιβλίο, Κεφ. 13, 3-7')));
assert.ok(ancientC.officialAnchors.some(x=>x.includes('Ζ΄ Βιβλίο, Κεφ. 28-30')));
assert.ok(ancientC.excludedAnchors.includes('Ενότητα 12 — να μη διδαχθεί'));
assert.ok(ancientC.excludedAnchors.some(x=>x.includes('Β΄ Βιβλίο, Κεφ. 4, 9-11')));
assert.equal(ancientC.arrianPlannedHours,14);

const transA=C['teacher-annual-special-gym-a-ancient-translation'];
assert.ok(transA.officialAnchors.some(x=>x.includes('Οδύσσεια — α 26–108')));
assert.ok(transA.officialAnchors.some(x=>x.includes('Ηρόδοτος, Βιβλίο 6 — Ενότητα 11')));
assert.equal(transA.odysseyPlannedHours,36);
assert.equal(transA.herodotusPlannedHours,13);

const transB=C['teacher-annual-special-gym-b-ancient-translation'];
assert.ok(transB.officialAnchors.some(x=>x.includes('Ιλιάδα — Α 54–306')));
assert.ok(transB.officialAnchors.some(x=>x.includes('Αθήνα (επιλογή τουλάχιστον δύο κειμένων)')));
assert.equal(transB.iliadPlannedHours,35);
assert.equal(transB.ancientGreecePlannedHours,13);

const transC=C['teacher-annual-special-gym-c-ancient-translation'];
assert.ok(transC.officialAnchors.some(x=>x.includes('Πρόλογος 1–191')));
assert.ok(transC.officialAnchors.some(x=>x.includes('Στωική ηθική - απάθεια και αταραξία')));
assert.equal(transC.helenPlannedHours,35);
assert.equal(transC.philosophyPlannedHours,13);

const bioA=C['teacher-annual-special-gym-a-biology'];
assert.equal(bioA.plannedHours,25);
assert.ok(bioA.officialAnchors.includes('1.1 Τα χαρακτηριστικά των οργανισμών'));
assert.ok(bioA.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 1.4')));
assert.ok(bioA.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 2.3')));
assert.ok(!bioA.officialAnchors.some(x=>x.includes('5.1 Στήριξη')),'A Biology must stop before the B-year carry-over chapters');

const bioB=C['teacher-annual-special-gym-b-biology'];
assert.equal(bioB.plannedHours,25);
assert.ok(bioB.officialAnchors.includes('Βιολογία Α΄ — 5.4 Το μυοσκελετικό σύστημα του ανθρώπου'));
assert.ok(bioB.officialAnchors.includes('Βιολογία Α΄ — 6.4 Η αναπαραγωγή στον άνθρωπο'));
assert.ok(bioB.officialAnchors.includes('Βιολογία Β΄-Γ΄ — 4.4 Τρόπος ζωής και ασθένειες'));
assert.ok(bioB.officialAnchors.some(x=>x.startsWith('Προαιρετικό — Βιολογία Β΄-Γ΄ — 1.2')));

const bioC=C['teacher-annual-special-gym-c-biology'];
assert.equal(bioC.plannedHours,25);
assert.ok(bioC.officialAnchors.includes('5.2 Η ροή της γενετικής πληροφορίας'));
assert.ok(bioC.officialAnchors.includes('5.5 Κληρονομικότητα'));
assert.ok(bioC.officialAnchors.includes('7.2 Η εξέλιξη του ανθρώπου'));
assert.ok(!bioC.officialAnchors.some(x=>/^3\./.test(x)),'C Biology must not invent omitted chapter 3 sections');

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

const langA=C['teacher-annual-special-gym-a-language'];
assert.ok(langA.officialAnchors.includes('1η Ενότητα — Οι πρώτες μέρες σε ένα νέο σχολείο'));
assert.ok(langA.officialAnchors.includes('6η Ενότητα — Οι δημιουργικές δραστηριότητες στη ζωή μου'));
assert.ok(langA.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 8η Ενότητα')));
assert.ok(langA.officialAnchors.some(x=>x.startsWith('Προαιρετικό — 9η Ενότητα')));
assert.equal(langA.anchorPolicy,'official-basic-and-supplementary-units-flexible-order');

const langB=C['teacher-annual-special-gym-b-language'];
assert.equal(langB.anchorPolicy,'target-oriented-flexible-thematic-framework');
assert.equal(langB.officialAnchors.length,7);
assert.ok(langB.officialAnchors.includes('Θεματικός άξονας — Οικογένεια'));
assert.ok(langB.officialAnchors.includes('Θεματικός άξονας — Σύγχρονα κοινωνικά προβλήματα'));
assert.ok(langB.officialAnchors.every(x=>x.startsWith('Θεματικός άξονας — ')));
assert.ok(langB.languageSkills.includes('Περίληψη κειμένου - Πλαγιότιτλοι'));

const langC=C['teacher-annual-special-gym-c-language'];
assert.equal(langC.officialAnchors.length,6);
assert.equal(langC.approximateProgramHours,50);
assert.ok(langC.officialAnchors.includes('3η Ενότητα — Είμαστε όλοι ίδιοι. Είμαστε όλοι διαφορετικοί'));
assert.ok(langC.officialAnchors.includes('2η Ενότητα — Γλώσσα - Γλώσσες και πολιτισμοί του κόσμου'));
assert.ok(langC.officialAnchors.includes('1η Ενότητα — Η Ελλάδα στον κόσμο'));
assert.ok(langC.officialAnchors.includes('4η Ενότητα — Ενωμένη Ευρώπη και Ευρωπαίοι πολίτες'));
assert.ok(langC.officialAnchors.includes('5η Ενότητα — Ειρήνη - Πόλεμος'));
assert.ok(langC.officialAnchors.includes('6η Ενότητα — Ενεργοί πολίτες για την υπεράσπιση οικουμενικών αξιών'));

const litA=C['teacher-annual-special-gym-a-literature'];
assert.equal(litA.selectionFramework,true);
assert.equal(litA.selectionStatus,'teacher-selected-not-fixed-syllabus');
assert.equal(litA.weeklyHours,2);
assert.equal(litA.officialAnchors.length,13);
assert.ok(litA.officialAnchors.includes('Ο άνθρωπος και η φύση • Πόλη – Ύπαιθρος'));
assert.ok(litA.officialAnchors.includes('Οι φίλοι μας τα ζώα'));
assert.ok(litA.textbookSourceUrl.includes('ebooks.edu.gr'));

const litB=C['teacher-annual-special-gym-b-literature'];
assert.equal(litB.selectionFramework,true);
assert.equal(litB.selectionStatus,'teacher-selected-not-fixed-syllabus');
assert.equal(litB.officialAnchors.length,13);
assert.ok(litB.officialAnchors.includes('Οικογενειακές σχέσεις'));

const litC=C['teacher-annual-special-gym-c-literature'];
assert.equal(litC.selectionFramework,true);
assert.equal(litC.selectionStatus,'teacher-selected-historical-literary-framework');
assert.equal(litC.anchorPolicy,'historical-literary-chronological-with-thematic-links');
assert.ok(litC.officialAnchors.includes('Δημοτικά τραγούδια'));
assert.ok(litC.officialAnchors.includes('Νεοελληνικός Διαφωτισμός'));
assert.ok(litC.officialAnchors.some(x=>x.includes('Νέα Αθηναϊκή Σχολή')));
assert.ok(litC.officialAnchors.some(x=>x.includes('Δεύτερη μεταπολεμική γενιά')));

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

console.log('Special Gymnasium annual 2026-2027 mapping smoke passed: 32 official mappings.');
