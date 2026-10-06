import assert from 'node:assert/strict';
import fs from 'node:fs';

const tutor = fs.readFileSync(new URL('../api/tutor-assistant.js', import.meta.url), 'utf8');
const summary = fs.readFileSync(new URL('../api/source-summary.js', import.meta.url), 'utf8');
const study = fs.readFileSync(new URL('../study.html', import.meta.url), 'utf8');
const schoolbook = fs.readFileSync(new URL('../api/schoolbook-source.js', import.meta.url), 'utf8');

assert.match(tutor, /resolveOfficialSchoolbookSource/);
// Official text is always re-resolved server-side (EPAL also passes its grade/sector/specialty context).
assert.match(tutor, /loadVerifiedOfficialSource\(subjectId, topic(?:, studyContext)?\)/);
assert.match(tutor, /rawDocumentText = verifiedOfficialSource\?\.text/);
assert.match(tutor, /officialSchoolbook = hasDocument && !!verifiedOfficialSource\?\.grounded/);
assert.match(tutor, /promptVersion: 'study-tutor-v5'/);
assert.match(tutor, /modelRoute: routingSignature\(aiStatus, routingProfile\)/);

const validationBlock = tutor.match(/if \(result\?\.ok && needsStructuredValidation[\s\S]{0,1200}?Structured result validation failed\./)?.[0] || '';
assert.ok(validationBlock, 'structured validation block must exist');
assert.doesNotMatch(validationBlock, /smartRoutingEnabled/, 'structured validation must run even with smart routing off');
assert.match(tutor, /data\.cards\.length === 8/);

assert.match(tutor, /\['quiz', 'truefalse'\][\s\S]{0,100}return 'quality'/);
assert.match(summary, /resolveOfficialSchoolbookSource/);
assert.match(summary, /official-schoolbook-source-v1/);
assert.match(summary, /promptVersion: 'verified-summary-v\d+(?:-[a-z]+)?'/);
assert.doesNotMatch(summary, /const \{ sourceText = ''/);
assert.match(study, /subjectId:selectedSubjectId\(\)/);
assert.doesNotMatch(study, /sourceText:sourceExcerpt\(source\?\.text/);
assert.match(schoolbook, /resolveOfficialSchoolbookSource/);

console.log('Study cache/source trust safety smoke passed.');
