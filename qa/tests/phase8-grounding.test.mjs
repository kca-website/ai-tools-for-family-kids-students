import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { REPO } from '../scripts/lib.mjs';

const require = createRequire(import.meta.url);
const tutor = require(path.join(REPO, 'api', 'tutor-assistant.js'));
const { groundingSignals, groundingRepairMessages } = tutor._phase8Test;

test('Phase 8: catches a new unsupported Greek proper name', () => {
  const source = 'Οι Μήλιοι συζήτησαν με τους Αθηναίους για την τύχη της Μήλου.';
  const answer = 'Οι Μυτιληνιοί συζήτησαν με τους Αθηναίους.';
  const signals = groundingSignals(answer, source);
  assert.ok(signals.some(x => x.value === 'Μυτιληνιοί'), JSON.stringify(signals));
  assert.ok(!signals.some(x => x.value === 'Αθηναίους'), JSON.stringify(signals));
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
