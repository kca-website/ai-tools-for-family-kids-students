import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { groundingSignals } = require('../api/tutor-assistant.js')._phase8Test;
assert.ok(groundingSignals('Οι νεφροί εκκρίνουν HCO₃⁻.', 'Το σώμα διατηρεί το pH.').some(x => x.type === 'unsupported_formula'));
assert.ok(groundingSignals('Το μόριο είναι H2O.', 'Το νερό έχει τύπο H₂O.').every(x => x.type !== 'unsupported_formula'));
assert.ok(groundingSignals('Το AI επιστρέφει JSON.', 'Εξήγηση ομοιόστασης.').every(x => x.type !== 'unsupported_formula'));
console.log('Unsupported schoolbook formula checks passed.');
