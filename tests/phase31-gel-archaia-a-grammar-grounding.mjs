import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const inv = require("../gel-schoolbook-source-map-2026-2027.js");
const overrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

const subject = "archaia-a-lykeiou";
const pairs = [
  ["Παθητικός μέλλοντας και αόριστος", /παθητικ/i],
  ["Μέλλοντας ρημάτων σε -ίζω", /κομίζω|κομίζ/i]
];

for (const [label, expectText] of pairs) {
  const row = inv.get(subject);
  const item = row.topicMappings.find(t => t.label === label);
  assert.equal(item?.status, "needs-manual-review", "original auto inventory must stay unchanged");
  const override = overrides.get(subject, label);
  assert.equal(override?.work, "8547/283");
  assert.equal(override?.sourceTopicId, item.topicId);
  assert.match(override?.url, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/html\/8547\/2340\//);
  const resolved = endpoint._test.resolveGelInventoryTopic(subject, label);
  assert.equal(resolved?.runtimeEligible, true);
  assert.equal(resolved?.runtimeMode, "manual-html");

  for (const purpose of ["", "audio"]) {
    const result = await endpoint.resolveOfficialSchoolbookSource(subject, label, { purpose });
    assert.equal(result.status, 200,
      JSON.stringify({ label, purpose, error: result.body?.error, message: result.body?.message }));
    assert.equal(result.body?.grounded, true);
    assert.equal(result.body?.mappingStatus, "official-gel-manual-verified-html");
    assert.equal(result.body?.annualScopeVerified, false, "No unverified 2026-27 curriculum claim");
    assert.ok(String(result.body?.sourceUrl || "").includes("ebooks.edu.gr"));
    assert.match(result.body?.text || "", expectText);
    assert.equal(result.body?.sourceScopeApplied, true, "Exact numbered paragraphs must be selected");
    const isPassive = label === "Παθητικός μέλλοντας και αόριστος";
    assert.deepEqual(result.body?.sourceScopeParagraphs,
      isPassive ? ["§297", "§315–316"] : ["§295"]);
    assert.equal(result.body?.sourceUrls?.length, isPassive ? 2 : 1);
    assert.match(result.body?.text || "", isPassive ? /^\\[Official numbered grammar paragraph:.*\\n297\\./ : /^\\[Official numbered grammar paragraph:.*\\n295\\./);
    if (isPassive) {
      assert.match(result.body?.text || "", /315\\./);
      assert.match(result.body?.text || "", /316\\./);
      assert.doesNotMatch(result.body?.text || "", /298\\./);
      assert.doesNotMatch(result.body?.text || "", /317\\./);
      assert.ok(result.body?.text?.length < 5000);
    } else {
      assert.doesNotMatch(result.body?.text || "", /296\\./);
      assert.ok(result.body?.text?.length < 3000);
    }
    assert.ok(String(result.body?.text || "").length >= 800);
    if (purpose === "audio") assert.equal(result.body?.sourceCompleteness?.complete, true);
    console.log(JSON.stringify({ label, purpose:purpose||"study", length:result.body.text.length, passed:true }));
  }
}
const expected = new Set(pairs.map(p => p[0]));
const unsafe = overrides.entries.filter(e => e.subjectId === subject && expected.has(e.label));
assert.equal(unsafe.length, 2, "no duplicate override labels");
