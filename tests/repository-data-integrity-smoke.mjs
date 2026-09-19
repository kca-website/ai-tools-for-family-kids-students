import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const data = read('data.js');
const overrides = read('site-integrity-overrides.js');

for (const id of ['ai-help','phet','google-arts-culture','gemini-education','notebooklm']) {
  const pattern = new RegExp(`["']${id}["']\\s*:\\s*\\{`, 'g');
  const matches = data.match(pattern) || [];
  assert.equal(matches.length, 1, `${id} must have exactly one canonical TOOLS declaration in data.js`);
}

assert.match(data, /id:\s*"learning-tool"/, 'learning-tool category must be canonical in data.js');
assert.doesNotMatch(overrides, /function\s+setTool\s*\(/, 'runtime overrides must not own canonical tool creation');
assert.doesNotMatch(overrides, /function\s+addCategory\s*\(/, 'runtime overrides must not own canonical category creation');
assert.doesNotMatch(overrides, /setTool\("(?:ai-help|phet|google-arts-culture|gemini-education)"/, 'canonical tools must not be recreated at runtime');

const notebookDecls = data.match(/["']notebooklm["']\s*:\s*\{/g) || [];
assert.equal(notebookDecls.length, 1, 'Gemini Notebook / NotebookLM must not have duplicate canonical declarations');

console.log('Repository data integrity smoke passed.');
