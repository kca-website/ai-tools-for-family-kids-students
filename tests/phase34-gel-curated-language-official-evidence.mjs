import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const overrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const availability = require("../secondary-grounding-availability-2026-2027.js");
const pending = require("../gel-unmapped-dispositions-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

const cases = [
  {
    subject: "ekthesi-a-lykeiou",
    label: "Ισχυρισμός και τεκμηρίωση",
    work: "8547/2370",
    sourceCount: 1,
    terms: ["αποδεικτικό σου υλικό", "το επιχείρημα"]
  },
  {
    subject: "ekthesi-b-lykeiou",
    label: "Δομή κειμένου",
    work: "8547/2376",
    sourceCount: 2,
    terms: ["ανεστραμμένη πυραμίδα", "θεματική περίοδο"]
  }
];
function normalize(value) {
  return String(value || "").toLocaleLowerCase("el")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ");
}

for (const row of cases) {
  const original = inventory.get(row.subject)?.topicMappings?.filter(t => t.label === row.label) || [];
  assert.equal(original.length, 1);
  assert.equal(original[0].status, "needs-manual-review");
  const override = overrides.get(row.subject, row.label);
  assert.ok(override);
  assert.equal(override.sourceTopicId, original[0].topicId);
  assert.equal(override.work, row.work);
  assert.equal(override.granularity, "manual-curated-examples-not-exhaustive-unit");
  assert.equal(override.sources.length, row.sourceCount);
  assert.equal(availability.has(row.subject, row.label), true);
  assert.equal(pending.get(row.subject, row.label), null);
  assert.equal(endpoint._test.resolveGelInventoryTopic(row.subject, row.label)?.runtimeEligible, true);

  for (const purpose of ["", "audio"]) {
    const response = await endpoint.resolveOfficialSchoolbookSource(row.subject, row.label, { purpose });
    assert.equal(response.status, 200, JSON.stringify({ label: row.label, purpose, error: response.body?.error }));
    assert.equal(response.body?.grounded, true);
    assert.equal(response.body?.mappingStatus, "official-gel-manual-verified-html");
    assert.equal(response.body?.annualScopeVerified, false);
    assert.equal(response.body?.sourceCoverage, "curated-examples");
    assert.equal(response.body?.sourceUrls?.length, row.sourceCount);
    assert.ok(String(response.body?.text || "").length >= 800);
    for (const term of row.terms)
      assert.ok(normalize(response.body.text).includes(normalize(term)), row.label + ": missing " + term);
    if (purpose === "audio") assert.equal(response.body?.sourceCompleteness?.complete, true);
    console.log(JSON.stringify({
      label: row.label,
      purpose: purpose || "study",
      characters: response.body.text.length,
      sources: row.sourceCount,
      officialRetrieval: true
    }));
  }
}
assert.equal(pending.count, 36);
