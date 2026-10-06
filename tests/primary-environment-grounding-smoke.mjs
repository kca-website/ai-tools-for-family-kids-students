import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// Μελέτη Περιβάλλοντος Α΄–Δ΄: AI Study shows the official book chapters (not generic topic
// anchors), and each one resolves to its own official ebooks.edu.gr page.
const require = createRequire(import.meta.url);
const ENV = require("../primary-environment-sections-2026-2027.js");
const tutor = fs.readFileSync(new URL("../september-2026-primary-tutor.js", import.meta.url), "utf8");
const api = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");

const expected = { a: 21, b: 17, c: 43, d: 47 };
const scienceBlock = tutor.slice(tutor.indexOf("const SCIENCE = {"), tutor.indexOf("};", tutor.indexOf("const SCIENCE = {")));
for (const [grade, count] of Object.entries(expected)) {
  const labels = ENV.labels(grade);
  assert.equal(labels.length, count, `${grade}: chapter count`);
  assert.equal(new Set(labels).size, count, `${grade}: unique labels`);
  const row = scienceBlock.match(new RegExp(`^    ${grade}:(\\[.*\\]),$`, "m"));
  assert.ok(row, `${grade}: SCIENCE row`);
  assert.deepEqual(JSON.parse(row[1]).map((r) => r[0]), labels, `${grade}: AI Study topics are the book chapters`);
  const base = ENV.grades[grade].base;
  assert.match(base, /^https:\/\/ebooks\.edu\.gr\/ebooks\/v\/html\/8547\/\d+\/Meleti-Perivallontos_[ABGD]-Dimotikou_html-(?:apli|empl)\/$/);
  const files = new Set();
  for (const label of labels) {
    for (const id of [`science-${grade}-dimotikou`, `environment-${grade}-dimotikou`]) {
      const unit = ENV.get(id, label);
      assert.ok(unit, `${id}: ${label}`);
      assert.ok(unit.url.startsWith(base));
    }
    files.add(ENV.get(`science-${grade}-dimotikou`, label).file);
  }
  assert.equal(files.size, count, `${grade}: one official page per chapter`);
  assert.match(api, new RegExp(`"science-${grade}-dimotikou": "environment-${grade}-dimotikou"`));
}
assert.equal(ENV.get("science-a-dimotikou", "Ζωντανό και μη ζωντανό"), null, "generic anchors are not book chapters");
assert.doesNotMatch(scienceBlock, /Ζωντανό και μη ζωντανό/);
assert.match(api, /const unit = PRIMARY_ENVIRONMENT\.get\(subject, topic\);/);

console.log("Primary Environment Studies grounding smoke passed: 128 official chapters for Α΄–Δ΄.");
