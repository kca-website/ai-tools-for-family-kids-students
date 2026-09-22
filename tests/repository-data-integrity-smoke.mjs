import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const data = read('data.js');
const overridePath = new URL('../site-integrity-overrides.js', import.meta.url);
assert.equal(fs.existsSync(overridePath), false, 'obsolete site-integrity-overrides.js must not exist');


for (const id of ['ai-help','phet','google-arts-culture','gemini-education','notebooklm']) {
  const pattern = new RegExp(`["']${id}["']\\s*:\\s*\\{`, 'g');
  const matches = data.match(pattern) || [];
  assert.equal(matches.length, 1, `${id} must have exactly one canonical TOOLS declaration in data.js`);
}

assert.match(data, /id:\s*"learning-tool"/, 'learning-tool category must be canonical in data.js');
const notebookDecls = data.match(/["']notebooklm["']\s*:\s*\{/g) || [];
assert.equal(notebookDecls.length, 1, 'Gemini Notebook / NotebookLM must not have duplicate canonical declarations');


const aiHelpPathRefs = data.match(/toolId:\s*["']ai-help["']/g) || [];
assert.equal(aiHelpPathRefs.length, 6, 'AI Help must be canonical in all 6 zone/role PATHS');

const curriculum = read('curriculum-data.js');
const curriculumToolArrays = curriculum.match(/toolIds:\s*\[[^\]]*\]/g) || [];
assert.ok(curriculumToolArrays.length > 0, 'curriculum tool arrays must exist');
for (const row of curriculumToolArrays) {
  const ids = row.match(/["']([^"']+)["']/g) || [];
  const aiHelpCount = ids.filter((id) => id === '"ai-help"' || id === "'ai-help'").length;
  assert.equal(aiHelpCount, 1, 'AI Help must appear exactly once in every canonical curriculum subject');
}


const accessibility = read('accessibility-data.js');

const toolMinAge = new Map();
for (const match of data.matchAll(/"([^"]+)":\s*\{[\s\S]{0,700}?minAge:\s*(\d+)/g)) {
  toolMinAge.set(match[1], Number(match[2]));
}

const zones = { primary: 12, middle: 15, high: 18 };
const subjects = ['language','math','science','history','foreign-language'];
const needs = ['understand','practice','hint','check','revise','research'];

function zoneBlock(zone) {
  const order = ['primary','middle','high'];
  const start = curriculum.indexOf(`  ${zone}: {`, curriculum.indexOf('const CURRICULUM'));
  assert.ok(start >= 0, `Missing curriculum zone: ${zone}`);
  const idx = order.indexOf(zone);
  const end = idx < order.length - 1
    ? curriculum.indexOf(`  ${order[idx + 1]}: {`, start)
    : curriculum.indexOf('\n};', start);
  return curriculum.slice(start, end);
}

function curriculumIds(zone, subject) {
  const block = zoneBlock(zone);
  const key = subject.includes('-') ? `"${subject}"` : subject;
  const match = block.match(new RegExp(`${key}: \\\\{toolIds: \\\\[([^\\\\]]*)\\\\]`));
  assert.ok(match, `Missing curriculum subject mapping: ${zone}/${subject}`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function needIds(subject, need) {
  const key = subject.includes('-') ? `"${subject}"` : subject;
  const start = curriculum.indexOf(`${key}: {`, curriculum.indexOf('const NEED_TOOL_MAP'));
  assert.ok(start >= 0, `Missing NEED_TOOL_MAP subject: ${subject}`);
  const end = curriculum.indexOf('\n  },', start);
  const block = curriculum.slice(start, end);
  const match = block.match(new RegExp(`${need}: \\\\[([^\\\\]]*)\\\\]`));
  assert.ok(match, `Missing NEED_TOOL_MAP need: ${subject}/${need}`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

for (const [zone, maxAge] of Object.entries(zones)) {
  for (const subject of subjects) {
    const subjectIds = curriculumIds(zone, subject);
    for (const need of needs) {
      const allowed = new Set(needIds(subject, need));
      const ageAppropriate = subjectIds.filter((id) => {
        if (!allowed.has(id)) return false;
        const minAge = toolMinAge.get(id);
        return minAge === undefined || minAge <= maxAge;
      });
      assert.ok(
        ageAppropriate.length > 0,
        `No age-appropriate tool for student path: ${zone}/${subject}/${need}`
      );
    }

    for (const id of subjectIds) {
      assert.match(
        accessibility,
        new RegExp(`["']${id}["']\\\\s*:\\\\s*\\\\{`),
        `Curriculum tool ${id} is missing from accessibility-data.js`
      );
    }
  }
}

assert.doesNotMatch(
  curriculum,
  /listening\/speaking practice with Erla|εξάσκηση ακρόασης\/ομιλίας με το Erla/,
  'Foreign-language curriculum copy must not reference Erla unless it is actually mapped there'
);

console.log('Repository data integrity smoke passed.');
