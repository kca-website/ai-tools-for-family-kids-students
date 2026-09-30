import assert from "node:assert/strict";
import fs from "node:fs";

const studyTools = fs.readFileSync(new URL("../tutor-study-tools.js", import.meta.url), "utf8");
const tutorApi = fs.readFileSync(new URL("../api/tutor-assistant.js", import.meta.url), "utf8");
const tutor = fs.readFileSync(new URL("../tutor.js", import.meta.url), "utf8");

assert.match(studyTools, /studyContext:\s*window\.AITutor\?\.getStudyContext\?\.\(\)\s*\|\|\s*null/);
assert.match(studyTools, /async function loadOfficialStudySource\(c\)/);
assert.match(studyTools, /\/api\/schoolbook-source\?subject=/);
assert.match(studyTools, /c\.studyContext\?\.sourcePolicy\s*===\s*"official_required"/);
assert.match(studyTools, /documentKind:\s*officialSource\?\.grounded\s*\?\s*"official_schoolbook"\s*:\s*""/);
assert.match(studyTools, /subjectId:\s*c\?\.subjectId\s*\|\|\s*""/);
assert.match(studyTools, /topic:\s*c\?\.topic\s*\|\|\s*""/);
assert.match(studyTools, /audience:\s*officialSource\s*\?\s*"study_user"/);
assert.match(studyTools, /OFFICIAL SCHOOLBOOK SOURCE — SOURCE FIRST/);

assert.match(tutor, /fetchTutorOfficialSource/);
assert.match(tutor, /verifiedSection\s*=\s*\/exact-section-verified\|related-section-verified\|official-book-section-verified\//);
assert.match(tutor, /requiresOfficial:\s*!!exactOfficial\s*\|\|\s*verifiedSection/);
assert.match(tutor, /sharedStudyContext\?\.sourcePolicy\s*===\s*"official_required"/);
assert.match(tutor, /subjectId:\s*getCurrentQuiz\(\)\?\.id\s*\|\|\s*getCatalogSubject\(\)\?\.quizId/);

assert.match(tutorApi, /resolveOfficialSchoolbookSource/);
assert.match(tutorApi, /studyContext\s*=\s*null/);
assert.match(tutorApi, /officialSourceRequired\s*=\s*requestedSourcePolicy\s*===\s*'official_required'/);
assert.match(tutorApi, /officialSourceRequired\s*&&\s*documentKind\s*!==\s*'official_schoolbook'/);
assert.match(tutorApi, /official_source_identity_required/);
assert.match(tutorApi, /grounding_validation_failed/);
assert.match(tutorApi, /groundingRepairMessages/);

console.log("Phase 11 study-tools grounding contract passed.");
