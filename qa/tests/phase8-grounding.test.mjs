import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { REPO } from '../scripts/lib.mjs';

const require = createRequire(import.meta.url);
const tutor = require(path.join(REPO, 'api', 'tutor-assistant.js'));
const { groundingSignals, groundingRepairMessages } = tutor._phase8Test;

test('Grounding: Greek sentence starts do not create unsupported-name false positives', () => {
  const source = 'Ο Περικλής μίλησε στην Αθήνα το 431 π.Χ.';
  const answer = 'Διάβασε το κείμενο. Σκέψου τι είπε ο Περικλής στην Αθήνα το 431 π.Χ. Καλημέρα!';
  // The runtime intentionally checks factual numbers, not every capitalized word.
  // Source resolution and the mandatory grounding prompt still constrain names.
  assert.deepEqual(groundingSignals(answer, source), []);
  assert.ok(groundingSignals(answer.replace('431', '432'), source)
    .some(x => x.type === 'unsupported_number' && x.value === '432'));
});

test('Phase 8: catches unsupported factual numbers but ignores task counters', () => {
  const source = 'Το γεγονός έγινε το 1821 και ακολούθησε νέα φάση.';
  const answer = 'Ερώτηση 1 από 5. Το γεγονός έγινε το 1824.';
  const signals = groundingSignals(answer, source);
  assert.ok(signals.some(x => x.type === 'unsupported_number' && x.value === '1824'), JSON.stringify(signals));
  assert.ok(!signals.some(x => x.value === '1' || x.value === '5'), JSON.stringify(signals));
});

test('Phase 8: accepts names and numbers supported by the source', () => {
  const source = 'Ο Περικλής μίλησε στην Αθήνα το 431 π.Χ.';
  const answer = 'Ο Περικλής μίλησε στην Αθήνα το 431 π.Χ.';
  assert.deepEqual(groundingSignals(answer, source), []);
});

test('Phase 8: repair prompt explicitly forbids rejected unsupported tokens', () => {
  const messages = [{ role: 'system', content: 'base rules' }, { role: 'user', content: 'question' }];
  const repaired = groundingRepairMessages(messages, [{ type: 'unsupported_term', value: 'Μυτιληνιοί' }]);
  assert.match(repaired[0].content, /GROUNDING REPAIR/);
  assert.match(repaired[0].content, /Μυτιληνιοί/);
  assert.equal(repaired[1].content, 'question');
});
