import assert from 'node:assert/strict';
import sourcesModule from '../primary-schoolbook-complete-sources-2026-2027.js';

const sources = sourcesModule?.default || sourcesModule;
const entry = sources.get('glossa-b-gymnasiou', 'Αναφορικές λέξεις και συνοχή');

assert.ok(entry, 'B Gymnasium Greek learner-facing topic must have a verified official source bundle');
assert.deepEqual(entry.urls, [
  'https://ebooks.edu.gr/ebooks/v/html/8547/2298/Neoelliniki-Glossa_B-Gymnasiou_empl/en6_3.html',
  'https://ebooks.edu.gr/ebooks/v/html/8547/2298/Neoelliniki-Glossa_B-Gymnasiou_empl/en4_4.html'
]);
assert.ok(entry.urls.every((url) => url.startsWith('https://ebooks.edu.gr/ebooks/v/html/')), 'all bundle URLs must be official ebooks.edu.gr HTML sources');

console.log('B Gym Greek verified source bundle regression passed.');
