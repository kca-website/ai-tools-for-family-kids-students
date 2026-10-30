import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { rowsFromCurrentCatalog, summarize, verifyRetrieval, verifyStudy, verifyAudio } from '../scripts/phase27-gel-uat.mjs';
const require = createRequire(import.meta.url);
const manual = require('../gel-schoolbook-manual-overrides-2026-2027.js');
const rows = rowsFromCurrentCatalog();
const summary = summarize(rows);
assert.equal(rows.length, 672);
assert.equal(manual.entries.length, 309);
assert.deepEqual(summary.gates.mapping, { passed:629, failed:0, unverified:43 });
assert.deepEqual(summary.gates.retrieval, { passed:0, failed:0, unverified:672 });
assert.deepEqual(summary.gates.curriculum, { passed:0, failed:0, unverified:672 });
assert.equal(summary.completeFivePointUat, 0);
const pending = {};
for (const r of rows.filter(r => r.mapping.state === 'unverified'))
  pending[r.subjectId] = (pending[r.subjectId] || 0) + 1;
assert.deepEqual(pending, {
  'archaia-a-lykeiou':7, 'ekthesi-a-lykeiou':3,
  'archaia-b-lykeiou':8, 'ekthesi-b-lykeiou':12,
  'english-g-lykeiou':5, 'archaia-g-lykeiou':6, 'oikonomia-g-lykeiou':2
});
for (const [s, l] of [
  ['ekthesi-a-lykeiou','Επικοινωνιακή περίσταση και ύφος'],
  ['ekthesi-b-lykeiou','Επίσημο ύφος'],
  ['ekthesi-b-lykeiou','Δείκτες συνοχής και λογικές σχέσεις']
]) assert.equal(rows.find(r => r.subjectId === s && r.topic === l)?.mapping.state,
  'passed', 'Latest mapped official topics must remain eligible');
for (const [s, l] of [
  ['english-g-lykeiou','Αντεστραμμένη σύνταξη'],
  ['oikonomia-g-lykeiou','Διεθνές εμπόριο και οικονομικές σχέσεις'],
  ['archaia-b-lykeiou','Αδίδακτο πεζό κείμενο αττικής διαλέκτου']
]) assert.equal(rows.find(r => r.subjectId === s && r.topic === l)?.mapping.state,
  'unverified', 'Ambiguous/out-of-scope content must remain blocked');
const url = 'https://ebooks.edu.gr/ebooks/v/html/8547/2676/book/chapter.html';
assert.equal(verifyRetrieval(200, { grounded:true, text:'Επίσημο κείμενο. '.repeat(18), sourceUrl:url }).state,'passed');
assert.equal(verifyRetrieval(200, { grounded:true, text:'Επίσημο κείμενο. '.repeat(18), sourceUrl:'https://example.com' }).state,'failed');
assert.equal(verifyStudy(200, { groundingValidated:true, text:'Επαληθευμένη επίσημη επεξήγηση.' }).state,'passed');
assert.equal(verifyStudy(200, { groundingValidated:false, text:'Εξήγηση από μνήμη μοντέλου.' }).state,'failed');
assert.equal(verifyAudio(200, { verified:true, text:'Σύνοψη με πλήρη κάλυψη. '.repeat(12),
  verification:{ coverageRatio:1, units:3, unitsCovered:3 } }).state,'passed');
assert.equal(verifyAudio(200, { verified:true, text:'Μερική σύνοψη. '.repeat(16),
  verification:{ coverageRatio:.5, units:3, unitsCovered:2 } }).state,'failed');
console.log('PHASE27_GEL_UAT_CONTRACT_OK', JSON.stringify(summary.gates));
