import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const paths = ['../ai-provider-router.js', '../study-runtime-cache.js', '../api/schoolbook-source.js', '../api/source-summary.js'].map(p => require.resolve(p));
const saved = paths.map(p => require.cache[p]);
const sentence = 'Η ομοιόσταση διατηρεί το εσωτερικό περιβάλλον σχεδόν αμετάβλητο.';
const claims = [
  { claim: sentence, evidence: sentence },
  { claim: 'Απαιτείται ενέργεια για την ομοιόσταση.', evidence: 'Απαιτείται ενέργεια για την ομοιόσταση.' },
  { claim: 'Διάφορα όργανα συνεργάζονται.', evidence: 'Διάφορα όργανα συνεργάζονται.' },
  { claim: 'Οι νεφροί παράγουν έναν αυθαίρετο μηχανισμό.', evidence: sentence },
];
const source = (sentence + ' Απαιτείται ενέργεια για την ομοιόσταση. Διάφορα όργανα συνεργάζονται. ').repeat(5);
let calls = 0;
require.cache[paths[0]] = { exports: {
  getAiStatus: () => ({ configured: true, providers: [] }),
  generateChat: async () => ({ ok: true, text: JSON.stringify(++calls === 1 ? { claims } : { results: claims.map((_, i) => ({ id: i + 1, keep: i < 3 })) }), usage: {} }),
}};
require.cache[paths[1]] = { exports: {
  getStudyCache: async parts => parts.kind === 'official-schoolbook-source-v1' ? { grounded: true, text: source, bookTitle: 'Βιολογία' } : null,
  setStudyCache: async () => {},
}};
require.cache[paths[2]] = { exports: { resolveOfficialSchoolbookSource: async () => { throw new Error('Unexpected network'); } } };
delete require.cache[paths[3]];
try {
  const handler = require('../api/source-summary.js');
  let status, body;
  const res = { setHeader() {}, status(value) { status = value; return this; }, json(value) { body = value; return value; } };
  await handler({ method: 'POST', headers: {}, body: { subjectId: 'biology', topic: 'Ομοιόσταση', activity: 'explain' } }, res);
  assert.equal(status, 200);
  assert.equal(calls, 1);
  assert.equal(body.verified, true);
  assert.equal(body.verification.approved, 3);
  assert.doesNotMatch(body.text, /αυθαίρετο/);
  assert.match(body.text, /Εξήγηση/);
  const html = fs.readFileSync(new URL('../study.html', import.meta.url), 'utf8');
  assert.match(html, /action==='audio'\|\|action==='explain'/);
  assert.match(html, /verifiedOfficialSummary\(officialSource,action\)/);
} finally {
  paths.forEach((p, i) => { if (saved[i]) require.cache[p] = saved[i]; else delete require.cache[p]; });
}
console.log('Verified explanation: rejected claims excluded, self-check and safe routing passed.');
