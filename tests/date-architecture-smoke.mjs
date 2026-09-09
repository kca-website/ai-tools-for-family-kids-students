import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const meta = read('site-meta.js');
const index = read('index.html');
const app = read('app.js');
const gel = read('gel-2026-2027-update.js');
const pwa = read('pwa.js');
const postfix = read('site-postfix.js');
const audit = read('september-2026-tool-audit.js');
const report = read('report-link.js');

assert.match(meta, /toolCatalogAuditDate:\s*"2026-09-05"/);
assert.match(meta, /Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων/);
assert.ok(index.indexOf('/site-meta.js') < index.indexOf('/data.js'));
assert.match(app, /AITOOLSKIDS_SITE_META\?\.toolCatalogAuditLabelEl/);
assert.match(postfix, /AITOOLSKIDS_SITE_META/);
for (const [name, text] of [['gel', gel], ['pwa', pwa]]) {
  assert.doesNotMatch(text, /detachLegacyFooterDateGuard|syncLastCheckedDate|installDateGuard|auditDateText|data-footer-audit-date/, `${name} still owns legacy footer-date patching`);
}
assert.doesNotMatch(audit, /Object\.keys\(TOOLS\)\.forEach\(\(id\) => patch\(id, \{\}\)\)/);
assert.match(report, /lastReviewed:"2026-09-09"/);
assert.doesNotMatch(postfix, /Tool information last checked: 5 September 2026|Τελευταίος έλεγχος στοιχείων εργαλείων: 5 Σεπτεμβρίου 2026/);
console.log('Date architecture smoke passed.');
