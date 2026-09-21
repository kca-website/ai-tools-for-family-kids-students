import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
const rootUrl = new URL('../', import.meta.url);
const sectorModules = fs.readdirSync(rootUrl)
  .filter((name) => name.startsWith('special-education-sector-') && name.endsWith('-data.js'))
  .sort();
const files = [
  'special-education-curriculum-data.js',
  'special-education-learning-data.js',
  'special-education-quiz-data.js',
  'special-education-status.js',
  ...sectorModules,
  'special-education-special-gymnasium-data.js',
  'teacher-curriculum-special-lyceum-annual-2026-2027.js',
  'special-education-special-lyceum-data.js',
  'special-education-eneegyl-structure-data.js',
  'teacher-curriculum-eneegyl-chemistry-2026-2027.js',
  'special-education-support-tools-data.js',
  'special-education-assessment-policy.js',
  'special-education-tutor-context.js'
];

for (const file of files) {
  const code = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  vm.runInContext(code, context, { filename: file });
}

const C = context.window.SPECIAL_EDUCATION_CURRICULUM;
const L = context.window.SPECIAL_EDUCATION_LEARNING;
const Q = context.window.SPECIAL_EDUCATION_QUIZZES;
const S = context.window.SPECIAL_EDUCATION_STATUS;
const T = context.window.SPECIAL_EDUCATION_TUTOR_CONTEXT;
const A = context.window.SPECIAL_EDUCATION_ASSESSMENT_POLICY;
const SG = context.window.SPECIAL_GYMNASIUM_2026_2027;
const SL = context.window.SPECIAL_LYCEUM_2026_2027;
const SLA = context.window.AITOOLSKIDS_SPECIAL_LYCEUM_ANNUAL_2026_2027;
const EN = context.window.ENEEGYL_2026_2027_STRUCTURE;
const SUPPORT = context.window.SPECIAL_EDUCATION_SUPPORT_TOOLS;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(C?.schoolYear === '2026-2027', 'Missing/incorrect Special Education school year');
assert(C?.entries && L && Q && S?.rows && T?.build && A && SG && SL && EN && SUPPORT, 'Missing Special Education dataset, structure, tools or assessment policy');
assert(A.id === 'special-education-simple-v1', 'Unexpected Special Education assessment policy');
assert(A.maxQuestions === 3 && A.optionsPerQuestion === 2, 'Special Education assessment limits must be 3 questions / 2 options');

for (const [id, entry] of Object.entries(C.entries)) {
  if (entry.status === 'verified') {
    assert(entry.sourceUrl, `${id}: verified curriculum has no sourceUrl`);
    assert(entry.verificationDate, `${id}: verified curriculum has no verificationDate`);
    assert(entry.verificationBasis, `${id}: verified item has no verificationBasis`);
    const sourceBasisVerified = entry.annualInstructionsStatus === 'verified'
      || entry.currentExamSyllabusStatus === 'verified'
      || (entry.officialTimetableStatus === 'verified' && entry.adaptationResourceStatus === 'verified');
    assert(sourceBasisVerified, `${id}: verified item has no verified official source basis`);
    assert(Array.isArray(entry.officialAnchors) && entry.officialAnchors.length > 0, `${id}: verified curriculum has no official anchors`);
    if (entry.coverageStatus === 'partial' || entry.coverageStatus === 'support-skill') {
      assert(entry.verificationNote, `${id}: bounded coverage must explain its verification boundary`);
    }
  }
}

for (const [id, learning] of Object.entries(L)) {
  const entry = C.entries[id];
  assert(entry, `${id}: learning data points to missing curriculum`);
  assert(entry.status === 'verified', `${id}: learning data exists before curriculum verification`);
  assert(learning.curriculumId === id, `${id}: learning curriculumId mismatch`);
}

for (const [id, quiz] of Object.entries(Q)) {
  const entry = C.entries[id];
  assert(entry, `${id}: quiz points to missing curriculum`);
  assert(entry.status === 'verified', `${id}: quiz exists before curriculum verification`);
  assert(L[id], `${id}: quiz exists without learning content`);
  assert(quiz.curriculumId === id, `${id}: quiz curriculumId mismatch`);
  assert(Array.isArray(quiz.questions) && quiz.questions.length > 0, `${id}: quiz has no questions`);
  if (A.isSpecialTrack(entry.schoolType)) {
    assert(quiz.assessmentProfile === A.id, `${id}: Special Education quiz missing simplified assessment profile`);
    assert(quiz.questions.length <= A.maxQuestions, `${id}: Special Education quiz exceeds ${A.maxQuestions} questions`);
  }
  for (const [index, question] of quiz.questions.entries()) {
    const expectedOptions = A.isSpecialTrack(entry.schoolType) ? A.optionsPerQuestion : 2;
    assert(Array.isArray(question.options) && question.options.length >= expectedOptions, `${id}: question ${index + 1} has too few options`);
    if (A.isSpecialTrack(entry.schoolType)) {
      assert(question.options.length === A.optionsPerQuestion, `${id}: Special Education question ${index + 1} must have exactly ${A.optionsPerQuestion} options`);
    }
    assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < question.options.length, `${id}: question ${index + 1} has invalid correctIndex`);
  }
}

for (const row of S.rows) {
  if (row.learning === 'verified') {
    const matching = Object.keys(L).some(id => row.scope.includes(C.entries[id]?.subject || '__never__'));
    assert(matching, `Status tracker marks learning verified without matching learning dataset: ${row.scope}`);
  }
}

for (const id of Object.keys(L)) {
  const studentContext = T.build(id, 'student');
  const parentContext = T.build(id, 'guardian');
  assert(studentContext?.curriculumId === id, `${id}: student tutor context could not be built`);
  assert(parentContext?.curriculumId === id, `${id}: parent tutor context could not be built`);
  assert(parentContext.systemGuidance.some(x => x.includes('γονιό') || x.includes('φροντιστή')), `${id}: parent tutor context lacks parent-specific guidance`);
  assert(studentContext.systemGuidance.some(x => x.includes('3 σύντομες ερωτήσεις') && x.includes('2 καθαρές επιλογές')), `${id}: tutor context lacks simplified quiz guidance`);
  if (C.entries[id]?.schoolType === 'eneegyl') {
    assert(studentContext.systemGuidance.some(x => x.includes('μη χαρτογραφημένα μαθήματα')), `${id}: EN.E.E.GY.-L. context lacks limited-catalog boundary`);
  }
}

for (const source of C.sourceIndex) {
  const ids = Array.isArray(source.curriculumIds) ? source.curriculumIds : (source.curriculumId ? [source.curriculumId] : []);
  for (const id of ids) {
    assert(C.entries[id], `${source.id}: source index points to missing curriculum ${id}`);
    assert(C.entries[id].status === 'verified', `${source.id}: source index exposes non-verified learning unit ${id}`);
  }
}

if (sectorModules.includes('special-education-sector-economy-data.js')) {
  const id = 'eneegyl-b-economy-accounting-basics';
  assert(C.entries[id]?.status === 'verified', 'Accounting sector module did not register verified curriculum');
  assert(L[id] && Q[id], 'Accounting sector module is missing learning or quiz data');
}

assert(SG.status === 'verified-structure', 'Special Gymnasium 2026-27 structure is not verified');
assert(SG.preliminary?.totalHours === 34, 'Special Gymnasium preliminary timetable total must be 34 hours');
for (const gradeId of ['a','b','c']) {
  const grade=SG.grades?.[gradeId];
  assert(grade?.totalHours === 34, `Special Gymnasium ${gradeId}: timetable total must be 34 hours`);
  const sum=(grade.subjects || []).reduce((total,row)=>total+Number(row.hours || 0),0);
  assert(sum === 34, `Special Gymnasium ${gradeId}: subject hours sum to ${sum}, expected 34`);
}
for (const id of ['special-gym-a-language-comprehension','special-gym-a-math-problem-reading']) {
  assert(C.entries[id]?.schoolType === 'special-gymnasium', `${id}: missing Special Gymnasium curriculum identity`);
  assert(C.entries[id]?.coverageStatus === 'support-skill', `${id}: must be marked as support-skill, not syllabus coverage`);
  assert(C.entries[id]?.officialTimetableStatus === 'verified', `${id}: timetable source not verified`);
  assert(C.entries[id]?.adaptationResourceStatus === 'verified', `${id}: adaptation source not verified`);
  assert(L[id] && Q[id], `${id}: missing learning or diagnostic`);
  assert(Q[id].questions.length === 3, `${id}: simplified Special Gymnasium quiz must have exactly 3 questions`);
  assert(Q[id].questions.every(q => q.options.length === 2), `${id}: simplified Special Gymnasium quiz must use 2 options per question`);
}

assert(SL.status === 'verified-structure', 'Special Lyceum must be present as a verified current school structure');
assert(SL.schoolType === 'special-lyceum', 'Special Lyceum school identity is wrong');
assert(/iep\.edu\.gr|minedu\.gov\.gr/.test(SL.sourceUrl||''), 'Special Lyceum official IEP/Ministry source missing');
assert(SL.annualGuidanceStatus === 'published-guidance-source-indexed-section-mapping-in-progress', 'Special Lyceum must distinguish published guidance from completed section mapping');
assert((SL.annualGuidanceIndex||[]).length >= 10, 'Special Lyceum published 2026-27 guidance index looks incomplete');
for (const guide of (SL.annualGuidanceIndex||[])) {
  assert(/^https:\/\/(www\.)?iep\.edu\.gr\//.test(guide.sourceUrl||'') || /^https:\/\/dide\.ira\.sch\.gr\//.test(guide.sourceUrl||''),
    `Special Lyceum guidance index ${guide.key}: official published sourceUrl missing`);
  assert(/^2026-09-(20|21)$/.test(guide.verificationDate||''), `Special Lyceum guidance index ${guide.key}: verificationDate missing or stale`);
  assert(/^official-(iep-(annual-guidance-index|guidance-archive)|published-guidance-pdf)$/.test(guide.sourceType||''),
    `Special Lyceum guidance index ${guide.key}: provenance type missing`);
}
const ancientGuide=(SL.annualGuidanceIndex||[]).find(x=>x.key==='ancient');
assert(/%CE%91%CE%A1%CE%A7%CE%91%CE%99%CE%91_/.test(ancientGuide?.sourceUrl||''), 'Special Lyceum Ancient Greek must point to its official 2026-27 guidance archive');

const biologyGuide=(SL.annualGuidanceIndex||[]).find(x=>x.key==='biology');
assert(/%CE%92%CE%99%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91-/.test(biologyGuide?.sourceUrl||''), 'Special Lyceum Biology must point to a direct official 2026-27 guidance PDF');
assert(['a','b','c'].every(g=>/^https:\/\/dide\.ira\.sch\.gr\//.test(biologyGuide?.sourceUrlsByGrade?.[g]||'')),
  'Special Lyceum Biology must have a direct grade-specific official PDF for A/B/C');
assert(Object.keys(SL.grades || {}).sort().join(',') === 'a,b,c', 'Special Lyceum must expose A/B/C Lyceum grades');
assert(/δεν|not/i.test(SL.scopeNoteEl + ' ' + SL.scopeNoteEn), 'Special Lyceum must state the no-invented-syllabus boundary');
const slInfoA=SLA.entries['a|informatics'];
assert(slInfoA.coverageStatus === 'exact', 'Special Lyceum A Informatics must be an exact annual mapping');
assert(slInfoA.officialAnchors.length === 20, `Special Lyceum A Informatics must expose 20 official sections, got ${slInfoA.officialAnchors.length}`);
assert(slInfoA.officialAnchors.includes('7.1 Προγραμματισμός εφαρμογών για φορητές συσκευές'), 'Special Lyceum A Informatics section 7.1 missing');
assert(slInfoA.officialAnchors.includes('16.4 Ιδιωτικότητα και προσωπικά δεδομένα στο Διαδίκτυο'), 'Special Lyceum A Informatics section 16.4 missing');

const slInfoB=SLA.entries['b|informatics'];
assert(slInfoB?.coverageStatus === 'exact', 'Special Lyceum B Informatics must be an exact annual mapping');
assert(slInfoB.officialAnchors.length === 8, `Special Lyceum B Informatics must expose 8 source-bounded teaching units, got ${slInfoB.officialAnchors.length}`);
assert(slInfoB.officialAnchors.some(x=>x.startsWith('2.2 Αλγόριθμοι')), 'Special Lyceum B Informatics algorithms unit missing');
assert(slInfoB.officialAnchors.some(x=>x.includes('εκτός 2.2.2')), 'Special Lyceum B Informatics exclusions must remain explicit');

const slInfoC=SLA.entries['c|informatics'];
assert(slInfoC?.coverageStatus === 'exact', 'Special Lyceum C Informatics must be an exact annual mapping');
assert(slInfoC.officialAnchors.length === 20, `Special Lyceum C Informatics must expose 20 source-bounded teaching groups, got ${slInfoC.officialAnchors.length}`);
assert(slInfoC.officialAnchors.some(x=>x.includes('Δομή επιλογής')), 'Special Lyceum C Informatics selection structure missing');
assert(slInfoC.officialAnchors.some(x=>x.includes('Αντικειμενοστραφής προγραμματισμός')), 'Special Lyceum C Informatics OOP group missing');

const slLatinB=SLA.entries['b|latin'];
assert(slLatinB?.coverageStatus === 'exact', 'Special Lyceum B Latin must be exact annual mapping');
assert(slLatinB.officialAnchors.length === 15, `Special Lyceum B Latin must expose 15 official units, got ${slLatinB.officialAnchors.length}`);
assert(slLatinB.officialAnchors[0].startsWith('Ενότητα I'), 'Special Lyceum B Latin must begin with Unit I');
assert(slLatinB.officialAnchors.at(-1).startsWith('Ενότητα XV'), 'Special Lyceum B Latin must end with Unit XV');

const slLatinC=SLA.entries['c|latin'];
assert(slLatinC?.coverageStatus === 'exact', 'Special Lyceum C Latin must be exact annual mapping');
assert(slLatinC.officialAnchors.length === 35, `Special Lyceum C Latin must expose Lessons 16–50, got ${slLatinC.officialAnchors.length}`);
assert(slLatinC.officialAnchors[0].startsWith('Μάθημα 16'), 'Special Lyceum C Latin must begin with Lesson 16');
assert(slLatinC.officialAnchors.at(-1).startsWith('Μάθημα 50'), 'Special Lyceum C Latin must end with Lesson 50');

for (const grade of ['a','b','c']) {
  const h=SLA.entries[`${grade}|history`];
  assert(h?.frameworkOnly === true && h?.coverageStatus === 'framework',
    `Special Lyceum ${grade.toUpperCase()} History must remain a documented framework, not fabricated chapter scope`);
  assert(h.officialAnchors.length === 6, `Special Lyceum ${grade.toUpperCase()} History framework should expose six methodological anchors`);
}
assert(/δεν.*κλειστή section-level/i.test(SLA.entries['a|history'].verificationNote||''), 'History A boundary note must reject a fabricated closed syllabus');
assert(/Σύμβαση της Λοζάνης/.test(SLA.entries['c|history'].verificationNote||''), 'History C note must preserve the distinction between an example lesson and annual syllabus');

const slLangA=SLA.entries['a|language'];
assert(slLangA?.frameworkOnly === true && slLangA?.coverageStatus === 'framework', 'Special Lyceum A Modern Greek must be a verified framework, not exact chapter scope');
assert(slLangA.officialAnchors.length === 8, `Special Lyceum A Modern Greek framework must expose 8 official process anchors, got ${slLangA.officialAnchors.length}`);
assert(slLangA.officialAnchors.some(x=>x.includes('Α3 Κριτικός στοχασμός')), 'Special Lyceum A Modern Greek critical-reading framework missing');

const slLangB=SLA.entries['b|language'];
assert(slLangB?.frameworkOnly === true && slLangB?.coverageStatus === 'framework', 'Special Lyceum B Modern Greek must be a verified framework');
assert(/ελεύθερη επιλογή κειμένων/.test(slLangB.verificationNote||''), 'Special Lyceum B Modern Greek must preserve the open-text-selection boundary');

const slLangC=SLA.entries['c|language'];
assert(slLangC?.frameworkOnly === true && slLangC?.coverageStatus === 'framework', 'Special Lyceum C Modern Greek must be a verified assessment framework');
assert(slLangC.officialAnchors.length === 4, `Special Lyceum C Modern Greek must expose four documented task types, got ${slLangC.officialAnchors.length}`);
assert(slLangC.officialAnchors.some(x=>x.startsWith('Θέμα Γ')), 'Special Lyceum C Modern Greek interpretive-comment framework missing');

const slBioA=SLA.entries['a|biology'];
assert(slBioA?.coverageStatus === 'exact', 'Special Lyceum A Biology must be an exact annual mapping');
assert(slBioA.officialAnchors.length === 13, `Special Lyceum A Biology must expose 13 exact source-bounded sections, got ${slBioA.officialAnchors.length}`);
assert(slBioA.officialAnchors.some(x=>x.includes('Κεφάλαιο 3: Κυκλοφορικό Σύστημα — Αίμα')), 'Special Lyceum A Biology blood section missing');
assert(slBioA.officialAnchors.some(x=>x.includes('εκτός «Αυλάκωση»')), 'Special Lyceum A Biology embryo exclusions must remain explicit');

const slBioB=SLA.entries['b|biology'];
assert(slBioB?.coverageStatus === 'exact', 'Special Lyceum B Biology must be an exact annual mapping');
assert(slBioB.officialAnchors.length === 32, `Special Lyceum B Biology must expose 32 exact source-bounded sections, got ${slBioB.officialAnchors.length}`);
assert(slBioB.officialAnchors.some(x=>x.includes('1.3.2 Μηχανισμοί ειδικής άμυνας')), 'Special Lyceum B Biology immunity section missing');
assert(slBioB.officialAnchors.some(x=>x.includes('μόνο εισαγωγή')), 'Special Lyceum B Biology pollution scope boundary missing');

const slBioC=SLA.entries['c|biology'];
assert(slBioC?.coverageStatus === 'exact', 'Special Lyceum C Biology must be an exact annual mapping');
assert(slBioC.officialAnchors.length === 16, `Special Lyceum C Biology must expose 16 exact source-bounded sections, got ${slBioC.officialAnchors.length}`);
assert(slBioC.officialAnchors.some(x=>x.includes('Κεφάλαιο 4: Τεχνολογία του ανασυνδυασμένου DNA')), 'Special Lyceum C Biology recombinant DNA chapter missing');
assert(slBioC.officialAnchors.some(x=>x.includes('εκτός της παραγράφου για την παραγωγή πενικιλίνης')), 'Special Lyceum C Biology biotechnology exclusion missing');

assert(EN.schoolType === 'eneegyl', 'ENEEGYL structure identity is wrong');
assert(EN.totalGrades === 8, `ENEEGYL must have 8 grades, got ${EN.totalGrades}`);
assert(EN.gradeOrder?.join(',') === 'gym-a,gym-b,gym-c,gym-d,lyc-a,lyc-b,lyc-c,lyc-d', 'ENEEGYL grade order must be 4 Gymnasium + 4 Lyceum');
assert(Object.keys(EN.grades || {}).length === 8, 'ENEEGYL grade registry must contain exactly 8 grades');
for (const id of ['gym-a','gym-b','gym-c','gym-d']) {
  assert(EN.grades[id]?.level === 'gymnasium', `${id}: must be an ENEEGYL Gymnasium grade`);
  assert((EN.grades[id]?.subjects || []).length >= 18, `${id}: ENEEGYL Gymnasium subject structure looks incomplete`);
}
for (const id of ['lyc-a','lyc-b','lyc-c','lyc-d']) {
  assert(EN.grades[id]?.level === 'lyceum', `${id}: must be an ENEEGYL Lyceum grade`);
}
const enChemA=C.entries['eneegyl-lyc-a-chemistry-2026-27'];
assert(enChemA?.coverageStatus === 'annual-instructions-verified', 'ENEEGYL A Lyceum Chemistry exact annual mapping missing');
assert(enChemA.officialAnchors.length === 9, `ENEEGYL A Chemistry must expose 9 source-bounded sections, got ${enChemA.officialAnchors.length}`);
assert(enChemA.officialAnchors.some(x=>x.startsWith('3.5 Χημικές αντιδράσεις')), 'ENEEGYL A Chemistry reaction scope missing');

const enChemB=C.entries['eneegyl-lyc-b-chemistry-2026-27'];
assert(enChemB?.coverageStatus === 'annual-instructions-verified', 'ENEEGYL B Lyceum Chemistry exact annual mapping missing');
assert(enChemB.officialAnchors.length === 12, `ENEEGYL B Chemistry must expose 12 source-bounded sections, got ${enChemB.officialAnchors.length}`);
assert(enChemB.officialAnchors.some(x=>x.includes('εκτός μη καθαρών ουσιών')), 'ENEEGYL B Chemistry stoichiometry exclusions must remain explicit');

const enChemC=C.entries['eneegyl-lyc-c-chemistry-2026-27'];
assert(enChemC?.coverageStatus === 'annual-instructions-verified', 'ENEEGYL C Lyceum Chemistry exact annual mapping missing');
assert(enChemC.officialAnchors.length === 15, `ENEEGYL C Chemistry must expose 15 source-bounded sections, got ${enChemC.officialAnchors.length}`);
assert(enChemC.officialAnchors.some(x=>x.includes('Βιοχημεία 3.3')), 'ENEEGYL C Chemistry biochemistry enzyme section missing');

assert(EN.grades['gym-d'].subjects.some(x => x.id === 'economics'), 'ENEEGYL D Gymnasium must include Economics');
assert(EN.grades['lyc-a'].subjects.length === 18, `ENEEGYL A Lyceum must expose 18 timetable choices/groups, got ${EN.grades['lyc-a'].subjects.length}`);
assert(EN.grades['lyc-a'].subjects.filter(x => x.type === 'elective').length === 7, 'ENEEGYL A Lyceum must expose seven offered electives');
assert(EN.grades['lyc-a'].subjects.some(x => x.id === 'creative-zone'), 'ENEEGYL A Lyceum must include Creative Activities Zone');
assert(EN.grades['lyc-b'].subjects.filter(x => x.type === 'sector-gateway').length === 8, 'ENEEGYL B Lyceum must expose eight sector gateways');
assert(EN.sourceUrls?.gymnasium?.includes('diavgeia.gov.gr') && EN.sourceUrls?.lyceum?.includes('diavgeia.gov.gr'), 'ENEEGYL current timetable sources missing');
assert(/MAT|%CE%9C%CE%91%CE%98%CE%97%CE%9C%CE%91%CE%A4%CE%99%CE%9A%CE%91/i.test(EN.sourceUrls?.annualSubjects?.lyceumMath||''), 'ENEEGYL Lyceum Mathematics annual source archive missing');
assert(/%CE%A6%CE%A5%CE%A3%CE%99%CE%9A%CE%97/i.test(EN.sourceUrls?.annualSubjects?.lyceumPhysics||''), 'ENEEGYL Lyceum Physics annual source archive missing');
assert(/%CE%A7%CE%97%CE%9C%CE%95%CE%99%CE%91/i.test(EN.sourceUrls?.annualSubjects?.lyceumChemistry||''), 'ENEEGYL Lyceum Chemistry annual source archive missing');
assert(EN.grades['lyc-a'].subjects.find(x=>x.id==='math')?.annualSourceUrl === EN.sourceUrls.annualSubjects.lyceumMath, 'ENEEGYL A Lyceum Mathematics must carry its subject-specific annual source');
assert(EN.grades['lyc-d'].subjects.find(x=>x.id==='physics')?.annualSourceUrl === EN.sourceUrls.annualSubjects.lyceumPhysics, 'ENEEGYL D Lyceum Physics must carry its subject-specific annual source');

assert(Array.isArray(SUPPORT.items) && SUPPORT.items.length >= 6, 'Special Education support tools need at least six curated options');
const supportIds=SUPPORT.items.map(x => x.id);
assert(new Set(supportIds).size === supportIds.length, 'Support tool ids must be unique');
for (const id of ['immersive-reader','google-docs-voice','desmos','geogebra','canva-education','autodraw']) {
  const tool=SUPPORT.items.find(x => x.id === id);
  assert(tool?.url && tool?.sourceUrl && tool?.task && tool?.bestFor, `${id}: incomplete support-tool metadata`);
}

const indexed = C.sourceIndex.filter(x => x.status === 'source-indexed');
assert(indexed.length === 8, `Expected 8 indexed EN.E.E.GY.-L. source groups, got ${indexed.length}`);
assert(C.sourceIndex.filter(x => x.status === 'verified').length === 1, 'Only ZDD source group should be fully reviewed at annual-instructions level at this stage');

console.log(`Special Education data smoke test passed: ${Object.keys(C.entries).length} detailed entries, ENEEGYL 8-grade structure, ${SUPPORT.items.length} support tools, simplified assessment policy enforced.`);
