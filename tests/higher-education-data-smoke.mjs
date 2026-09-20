import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read('higher-education-data.js'), sandbox, { filename: 'higher-education-data.js' });

const he = sandbox.window.AITOOLSKIDS_HIGHER_EDUCATION;
assert.ok(he, 'Higher Education dataset must expose window.AITOOLSKIDS_HIGHER_EDUCATION');
assert.ok(Object.keys(he.institutions).length >= 5, 'pilot must include at least 5 institutions');
assert.ok(he.departments['upatras-biology'], 'University of Patras Biology pilot is missing');
assert.equal(he.departments['upatras-biology'].nominalSemesters, 8);
const patrasBiology = he.departments['upatras-biology'];
assert.equal(patrasBiology.curriculumDisplay, 'year-semester-course-topic');
assert.equal(patrasBiology.courses.filter((course) => course.semester === 1).length, 4);
assert.equal(patrasBiology.courses.filter((course) => course.semester === 2).length, 4);
assert.ok(patrasBiology.courses.some((course) => course.code === 'ΒΙΟ_ΒΚΔ' && course.topics?.length >= 5));
assert.ok(patrasBiology.courses.some((course) => course.code === 'ΒΙΟ_ΓΜΒ' && course.topics?.includes('Συσχέτιση και παλινδρόμηση')));
assert.ok(!patrasBiology.courses.some((course) => course.titleEl === 'Βιολογία Κυττάρου Ι'), 'obsolete Patras Biology title must not return');
assert.ok(!patrasBiology.courses.some((course) => course.titleEl === 'Γενετική Ι'), 'obsolete Genetics I title must not return');


assert.equal(he.meta.status, 'pilot');
assert.match(he.meta.policyEl, /δεν δημιουργεί έτοιμη εργασία/i);

const dataSource = read('data.js');
const canonicalToolIds = new Set(
  [...dataSource.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map((m) => m[1])
);

for (const [taskId, task] of Object.entries(he.taskTypes)) {
  assert.ok(task.labelEl && task.labelEn, `task ${taskId} needs bilingual labels`);
  assert.ok(Array.isArray(task.preferredTools) && task.preferredTools.length > 0, `task ${taskId} has no tools`);
  for (const toolId of task.preferredTools) {
    assert.ok(canonicalToolIds.has(toolId), `task ${taskId} references unknown tool ${toolId}`);
  }
}

const seenDepartments = new Set();
for (const [institutionId, institution] of Object.entries(he.institutions)) {
  assert.equal(institution.id, institutionId);
  assert.ok(institution.nameEl && institution.nameEn);
  assert.ok(Array.isArray(institution.departments) && institution.departments.length > 0);
  for (const departmentId of institution.departments) {
    assert.ok(he.departments[departmentId], `institution ${institutionId} references missing department ${departmentId}`);
    assert.equal(he.departments[departmentId].institutionId, institutionId);
    assert.ok(!seenDepartments.has(departmentId), `department ${departmentId} attached more than once`);
    seenDepartments.add(departmentId);
  }
}

for (const [departmentId, department] of Object.entries(he.departments)) {
  assert.ok(seenDepartments.has(departmentId), `orphan department ${departmentId}`);
  assert.ok(department.departmentEl && department.departmentEn);
  assert.ok(['high','medium-high','medium','low'].includes(department.sourceConfidence), `${departmentId} sourceConfidence invalid`);
  assert.ok(/^pilot-/.test(department.coverageStatus), `${departmentId} coverageStatus must stay explicitly pilot`);
  assert.ok(Array.isArray(department.sources) && department.sources.length > 0, `${departmentId} needs official sources`);

  const courseKeys = new Set();
  for (const course of department.courses || []) {
    assert.ok(course.titleEl, `${departmentId} course missing title`);
    const key = `${course.code || ''}|${course.semester ?? ''}|${course.titleEl}`;
    assert.ok(!courseKeys.has(key), `${departmentId} duplicate course ${key}`);
    courseKeys.add(key);
    assert.ok(Array.isArray(course.tasks) && course.tasks.length > 0, `${departmentId}/${course.titleEl} has no task mapping`);
    for (const taskId of course.tasks) {
      assert.ok(he.taskTypes[taskId], `${departmentId}/${course.titleEl} references unknown task ${taskId}`);
    }
  }
}

for (const institution of Object.values(he.institutions)) {
  for (const alias of institution.legacyAliases || []) {
    assert.ok(alias.trim().length >= 4, 'legacy alias too short');
    assert.notEqual(alias.trim().toLowerCase(), institution.nameEl.trim().toLowerCase(), 'legacy alias duplicates current name');
  }
}

console.log('Higher Education canonical pilot data smoke passed.');
