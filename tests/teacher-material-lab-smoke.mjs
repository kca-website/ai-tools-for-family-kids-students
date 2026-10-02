import fs from "node:fs";
import assert from "node:assert/strict";
const html=fs.readFileSync(new URL("../teacher-assistant.html",import.meta.url),"utf8");
const js=fs.readFileSync(new URL("../teacher-material-lab.js",import.meta.url),"utf8");
const css=fs.readFileSync(new URL("../teacher-material-lab.css",import.meta.url),"utf8");
assert.match(html,/teacher-material-lab\.css/);
assert.match(html,/teacher-material-lab\.js/);
assert.match(js,/aitools4kids_teacher_materials_v1/);
assert.match(js,/AI εκτίμηση — χρειάζεται κρίση εκπαιδευτικού/);
assert.match(js,/Δεν υπάρχουν αυτή τη στιγμή τεκμηριωμένες παρανοήσεις/);
// Annual mapping flag (formerly annualScopeVerified).
assert.match(js,/s\.annualMapped/);
assert.match(js,/exact-verified-annual-mapping/);
assert.match(js,/exact-section-verified/);
assert.match(js,/related-section-verified/);
assert.match(js,/aitools4kids-materials-v1\.json/);
// Eligible tasks are now a list (worksheet, assessment, lesson, activity); asserted below.
assert.match(css,/\.teacher-material-lab/);
console.log("teacher material lab smoke: ok");

assert.match(js,/Ακριβής \/ επαληθευμένη ετήσια αντιστοίχιση/);
assert.match(js,/Δημοσιευμένες ετήσιες οδηγίες — αναλυτικός χάρτης πλοήγησης/);
assert.match(js,/Μερική χαρτογράφηση/);
assert.match(js,/Επίσημη δομή \/ υποστηρικτική γέφυρα/);
assert.match(js,/Πηγή καταχωρισμένη — εκκρεμεί χαρτογράφηση ενοτήτων/);
assert.match(js,/sourceQuizId/);
assert.match(css,/\.result-actions,#classQrPanel/);

assert.match(js,/\["worksheet","assessment","lesson","activity"\]/);
assert.match(js,/AITOOLSKIDS_MISCONCEPTION_EVIDENCE/);
assert.match(js,/Παιδαγωγική τεκμηρίωση/);
