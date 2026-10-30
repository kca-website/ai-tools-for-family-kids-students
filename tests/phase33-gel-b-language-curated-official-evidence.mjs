import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const inv = require("../gel-schoolbook-source-map-2026-2027.js");
const manual = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const av = require("../secondary-grounding-availability-2026-2027.js");
const pending = require("../gel-unmapped-dispositions-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");
const subject = "ekthesi-b-lykeiou";
const examples = [
 ["Κειμενικά είδη",3,["γεγονός και το σχόλιο", "Βιογραφικά είδη", "Βιβλιοκριτική"]],
 ["Συγκεκριμένα τεκμήρια",1,["τεκμηριωμένα","κριτική"]],
 ["Τροπικότητα και στάση συντάκτη",2,["γεγονός και το σχόλιο", "οπτική γωνία"]]
];
for (const [label,count,terms] of examples) {
  const source = inv.get(subject)?.topicMappings?.find(t => t.label === label);
  assert.equal(source?.status, "needs-manual-review");
  const o = manual.get(subject,label);
  assert.equal(o?.sourceTopicId,source.topicId);
  assert.equal(o?.work,"8547/2376");
  assert.equal(o?.sources?.length,count);
  assert.equal(o?.granularity,"manual-curated-examples-not-exhaustive-unit");
  assert.equal(av.has(subject,label),true);
  assert.equal(pending.get(subject,label),null);
  assert.equal(endpoint._test.resolveGelInventoryTopic(subject,label)?.runtimeEligible,true);
  for(const purpose of ["", "audio"]) {
    const r = await endpoint.resolveOfficialSchoolbookSource(subject,label,{purpose});
    assert.equal(r.status,200,JSON.stringify({label,purpose,error:r.body?.error,message:r.body?.message}));
    assert.equal(r.body?.grounded,true);
    assert.equal(r.body?.mappingStatus,"official-gel-manual-verified-html");
    assert.equal(r.body?.annualScopeVerified,false);
    assert.equal(r.body?.sourceCoverage,"curated-examples");
    assert.match(r.body?.sourceCoverageNote||"",/Δεν τεκμηριώνουν/);
    assert.equal(r.body?.sourceUrls?.length,count);
    assert.ok(String(r.body?.text||"").length>=800);
    const normalize = v => String(v||"").toLowerCase().normalize("NFD").split("").filter(ch => ch.charCodeAt(0) < 0x300 || ch.charCodeAt(0) > 0x36f).join("").replace(/ς/g,"σ");
    for(const term of terms)assert.ok(normalize(r.body?.text).includes(normalize(term)),label+" missing term "+term);
    if (purpose === "audio") assert.equal(r.body?.sourceCompleteness?.complete,true);
    console.log(JSON.stringify({topic:label,purpose:purpose||"study",chars:r.body.text.length,sourceCount:count,pass:true}));
  }
}
assert.equal(pending.count,38);
