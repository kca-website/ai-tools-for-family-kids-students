import fs from 'node:fs';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../api/teacher-assistant.js', import.meta.url), 'utf8');

assert.match(source, /audience\s*=\s*['"]teacher['"]/);
assert.match(source, /audience\s*===\s*['"]university_student['"]/);
assert.match(source, /universityTerminologyGuard/);
assert.match(source, /Μην επινοείς όρους, βιβλιογραφικές αναφορές, DOI/);
assert.match(source, /Μην παραδίδεις ολοκληρωμένο κείμενο προς υποβολή/);
assert.match(source, /schoolTerminologyGuard/);

console.log('Higher Education shared AI endpoint contract smoke passed.');
