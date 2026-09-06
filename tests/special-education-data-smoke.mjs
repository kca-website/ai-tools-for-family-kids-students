import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({ window: {} });
const files = [
  'special-education-curriculum-data.js',
  'special-education-learning-data.js',
  'special-education-quiz-data.js',
  'special-education-status.js',
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(C?.schoolYear === '2026-2027', 'Missing/incorrect Special Education school year');
assert(C?.entries && L && Q && S?.rows && T?.build, 'Missing Special Education dataset');

for (const [id, entry] of Object.entries(C.entries)) {
  if (entry.status === 'verified') {
    assert(entry.sourceUrl, `${id}: verified curriculum has no sourceUrl`);
    assert(entry.verificationDate, `${id}: verified curriculum has no verificationDate`);
    assert(entry.verificationBasis, `${id}: verified curriculum has no verificationBasis`);
    const sourceBasisVerified = entry.annualInstructionsStatus === 'verified' || entry.currentExamSyllabusStatus === 'verified';
    assert(sourceBasisVerified, `${id}: verified curriculum has neither verified annual instructions nor verified current exam syllabus`);
    assert(Array.isArray(entry.officialAnchors) && entry.officialAnchors.length > 0, `${id}: verified curriculum has no official anchors`);
    if (entry.coverageStatus === 'partial') {
      assert(entry.verificationNote, `${id}: partial coverage must explain its verification boundary`);
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
  for (const [index, question] of quiz.questions.entries()) {
    assert(Array.isArray(question.options) && question.options.length >= 2, `${id}: question ${index + 1} has too few options`);
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
}

for (const source of C.sourceIndex) {
  const ids = Array.isArray(source.curriculumIds) ? source.curriculumIds : (source.curriculumId ? [source.curriculumId] : []);
  for (const id of ids) {
    assert(C.entries[id], `${source.id}: source index points to missing curriculum ${id}`);
  }
}

const indexed = C.sourceIndex.filter(x => x.status === 'source-indexed');
assert(indexed.length === 8, `Expected 8 indexed EN.E.E.GY.-L. source groups, got ${indexed.length}`);
assert(C.sourceIndex.filter(x => x.status === 'verified').length === 1, 'Only ZDD source group should be fully reviewed at annual-instructions level at this stage');

console.log(`Special Education data smoke test passed: ${Object.keys(C.entries).length} curriculum entries, ${Object.keys(L).length} learning units, ${indexed.length} indexed source groups.`);