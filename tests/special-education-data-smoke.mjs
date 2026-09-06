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
  'special-education-special-lyceum-data.js',
  'special-education-eneegyl-structure-data.js',
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
assert(SL.sourceUrl?.includes('minedu.gov.gr'), 'Special Lyceum official Ministry source missing');
assert(Object.keys(SL.grades || {}).sort().join(',') === 'a,b,c', 'Special Lyceum must expose A/B/C Lyceum grades');
assert(/δεν|not/i.test(SL.scopeNoteEl + ' ' + SL.scopeNoteEn), 'Special Lyceum must state the no-invented-syllabus boundary');

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
assert(EN.grades['gym-d'].subjects.some(x => x.id === 'economics'), 'ENEEGYL D Gymnasium must include Economics');
assert(EN.grades['lyc-a'].subjects.length === 18, `ENEEGYL A Lyceum must expose 18 timetable choices/groups, got ${EN.grades['lyc-a'].subjects.length}`);
assert(EN.grades['lyc-a'].subjects.filter(x => x.type === 'elective').length === 7, 'ENEEGYL A Lyceum must expose seven offered electives');
assert(EN.grades['lyc-a'].subjects.some(x => x.id === 'creative-zone'), 'ENEEGYL A Lyceum must include Creative Activities Zone');
assert(EN.grades['lyc-b'].subjects.filter(x => x.type === 'sector-gateway').length === 8, 'ENEEGYL B Lyceum must expose eight sector gateways');
assert(EN.sourceUrls?.gymnasium?.includes('diavgeia.gov.gr') && EN.sourceUrls?.lyceum?.includes('diavgeia.gov.gr'), 'ENEEGYL current timetable sources missing');

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