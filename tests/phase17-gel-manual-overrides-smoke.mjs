import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const overrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

assert.equal(overrides.schoolYear, "2026-2027");
assert.equal(overrides.count, 60);
assert.equal(overrides.entries.length, 60);

const keys = new Set();
let medium = 0;
let manual = 0;

for (const entry of overrides.entries) {
  const key = entry.subjectId + "\n" + entry.label;
  assert.equal(keys.has(key), false, "duplicate override: " + key);
  keys.add(key);

  const subject = inventory.get(entry.subjectId);
  assert.ok(subject, "unknown override subject " + entry.subjectId);

  const matches = (subject.topicMappings || []).filter((topic) => topic.label === entry.label);
  assert.equal(matches.length, 1, "override must target exactly one inventory topic: " + key);
  const source = matches[0];
  assert.equal(source.topicId, entry.sourceTopicId);
  assert.match(String(entry.url || ""), /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i);
  assert.ok(String(entry.heading || "").trim().length >= 2);

  if (entry.sourceStatus === "exact-html") {
    medium++;
    assert.equal(source.status, "exact-html");
    assert.equal(source.confidence, "medium");
    assert.equal(source.url, entry.url);
    assert.equal(source.heading, entry.heading);
  } else {
    manual++;
    assert.equal(entry.sourceStatus, "needs-manual-review");
    assert.equal(source.status, "needs-manual-review");
    const candidate = (source.candidates || []).find((row) =>
      row.url === entry.url && row.heading === entry.heading
    );
    assert.ok(candidate, "manual override must come from a recorded Phase 14 candidate: " + key);
  }

  const resolved = endpoint._test.resolveGelInventoryTopic(entry.subjectId, entry.label);
  assert.equal(resolved?.runtimeEligible, true, key);
  assert.equal(resolved?.runtimeMode, "manual-html", key);
  assert.equal(resolved?.manualOverride?.url, entry.url);
  assert.equal(resolved?.mapping?.confidence, "manual-verified");
}

assert.equal(medium, 14);
assert.equal(manual, 46);

// Live source audit: every unique official page must still load and contain
// the manually accepted official heading. Deduplicate page fetches so this
// remains polite to ebooks.edu.gr.
const byUrl = new Map();
for (const entry of overrides.entries) {
  const url = new URL(entry.url);
  url.hash = "";
  const clean = url.toString();
  if (!byUrl.has(clean)) byUrl.set(clean, []);
  byUrl.get(clean).push(entry);
}

const queue = [...byUrl.entries()];
const failures = [];
const results = [];
const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
  while (queue.length) {
    const [url, entries] = queue.shift();
    let response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "aitools4kids.gr Phase 17 manual grounding audit",
          "Accept": "text/html,application/xhtml+xml"
        },
        redirect: "follow"
      });
    } catch (error) {
      failures.push({ url, error: "fetch_failed:" + String(error?.message || error) });
      continue;
    }
    if (!response.ok) {
      failures.push({ url, error: "http_" + response.status });
      continue;
    }
    const html = await response.text();
    const text = normalize(html);
    if (text.length < 300) {
      failures.push({ url, error: "page_too_short" });
      continue;
    }
    for (const entry of entries) {
      const heading = normalize(entry.heading);
      if (!heading || !text.includes(heading)) {
        failures.push({
          url,
          subjectId: entry.subjectId,
          label: entry.label,
          heading: entry.heading,
          error: "verified_heading_not_found"
        });
      }
    }
    results.push({ url, topics: entries.length, chars: text.length });
  }
});
await Promise.all(workers);
assert.deepEqual(failures, []);

const representative = [
  ["mathimatika-a-lykeiou", "3.2 Εξισώσεις της μορφής x^ν = α"],
  ["geometria-a-lykeiou", "4.2 Παράλληλες ευθείες και τέμνουσα"],
  ["istoria-b-lykeiou", "Εμφάνιση και εξάπλωση του Ισλάμ"],
  ["pliroforiki-g-lykeiou", "Αναπαράσταση αλγορίθμων"],
  ["chimeia-g-lykeiou", "Ενθαλπία αντίδρασης"]
];

const liveEndpoint = [];
for (const [subjectId, label] of representative) {
  const result = await endpoint.resolveOfficialSchoolbookSource(subjectId, label);
  liveEndpoint.push({
    subjectId,
    label,
    ok: result.ok,
    status: result.status,
    mappingStatus: result.body?.mappingStatus,
    chars: String(result.body?.text || "").length
  });
  assert.equal(result.ok, true, subjectId + " / " + label + " => " + JSON.stringify(result.body));
  assert.equal(result.body?.mappingStatus, "official-gel-manual-verified-html");
  assert.equal(result.body?.mappingConfidence, "manual-verified");
  assert.ok(String(result.body?.text || "").length >= 500);
}

console.log("PHASE17_GEL_MANUAL_OVERRIDES=" + JSON.stringify({
  total: overrides.count,
  medium,
  manual,
  uniqueOfficialPages: byUrl.size,
  liveEndpoint
}, null, 2));
