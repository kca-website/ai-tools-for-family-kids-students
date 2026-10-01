import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const overrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

function sources(entry) {
  return Array.isArray(entry.sources) && entry.sources.length
    ? entry.sources
    : [{ work: entry.work, url: entry.url, heading: entry.heading, candidateScore: entry.candidateScore ?? null }];
}

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

const phase20 = overrides.entries.filter((entry) => entry.reviewPhase === 20);
assert.equal(phase20.length, 5);

const expected = new Map([
  ["fysiki-b-lykeiou\nΚεφάλαιο 2: Διατήρηση ορμής και κρούσεις", { sources: 1, origin: "candidate" }],
  ["fysiki-b-lykeiou\nΚεφάλαιο 4: Θερμοδυναμική / 1ος θερμοδυναμικός νόμος", { sources: 1, origin: "candidate" }],
  ["biologia-g-lykeiou\nΓενετικά τροποποιημένοι οργανισμοί", { sources: 1, origin: "discovery" }],
  ["biologia-g-lykeiou\nΒιοηθικές διαστάσεις της γενετικής τεχνολογίας", { sources: 1, origin: "discovery" }],
  ["istoria-g-prosanatolismou\nΒενιζελική οικονομική πολιτική και προσφυγική αποκατάσταση", { sources: 2, origin: "discovery" }]
]);

const pageMap = new Map();
for (const entry of phase20) {
  const key = entry.subjectId + "\n" + entry.label;
  const contract = expected.get(key);
  assert.ok(contract, "unexpected Phase 20 override: " + key);

  const subject = inventory.get(entry.subjectId);
  assert.ok(subject, "unknown subject: " + entry.subjectId);
  const topic = (subject.topicMappings || []).find((row) => row.label === entry.label);
  assert.ok(topic, "unknown topic: " + key);
  assert.equal(topic.topicId, entry.sourceTopicId);
  assert.equal(topic.status, "needs-manual-review");

  const rows = sources(entry);
  assert.equal(rows.length, contract.sources);

  const verifiedBook = (subject.books || []).find((book) =>
    book.role === "primary" && book.work === entry.work && book.html?.url
  );
  assert.ok(verifiedBook, "verified primary HTML book missing: " + key);

  if (contract.origin === "candidate") {
    assert.notEqual(entry.sourceOrigin, "manual-official-discovery");
    for (const row of rows) {
      const candidate = (topic.candidates || []).find((candidate) =>
        candidate.url === row.url && candidate.heading === row.heading
      );
      assert.ok(candidate, "candidate-backed Phase 20 mapping must match recorded candidate: " + key);
    }
  } else {
    assert.equal(entry.sourceOrigin, "manual-official-discovery");
    assert.equal(entry.discoveryPhase, 20);
    for (const row of rows) {
      assert.equal(
        endpoint._test.sameOfficialHtmlManifestation(row.url, verifiedBook.html.url),
        true,
        "discovered source must remain in verified official manifestation: " + key
      );
    }
  }

  for (const row of rows) {
    const clean = new URL(row.url);
    clean.hash = "";
    const url = clean.toString();
    if (!pageMap.has(url)) pageMap.set(url, []);
    pageMap.get(url).push({ entry, row });
  }

  const resolved = endpoint._test.resolveGelInventoryTopic(entry.subjectId, entry.label);
  assert.equal(resolved?.runtimeEligible, true, key);
  assert.equal(resolved?.runtimeMode, "manual-html", key);
  assert.equal(resolved?.manualSources?.length, contract.sources, key);
}

const failures = [];
const queue = [...pageMap.entries()];
const workers = Array.from({ length: Math.min(5, queue.length) }, async () => {
  while (queue.length) {
    const [url, rows] = queue.shift();
    let response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "aitools4kids.gr Phase 20 final safe candidate audit",
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
    const text = normalize(await response.text());
    if (text.length < 300) {
      failures.push({ url, error: "page_too_short" });
      continue;
    }
    for (const { entry, row } of rows) {
      if (!text.includes(normalize(row.heading))) {
        failures.push({
          url,
          subjectId: entry.subjectId,
          label: entry.label,
          heading: row.heading,
          error: "verified_heading_not_found"
        });
      }
    }
  }
});
await Promise.all(workers);
assert.deepEqual(failures, []);

const endpointResults = [];
for (const entry of phase20) {
  const result = await endpoint.resolveOfficialSchoolbookSource(entry.subjectId, entry.label);
  endpointResults.push({
    subjectId: entry.subjectId,
    label: entry.label,
    ok: result.ok,
    sources: result.body?.sourceUrls?.length || 0,
    chars: String(result.body?.text || "").length
  });
  assert.equal(result.ok, true, entry.subjectId + " / " + entry.label + " => " + JSON.stringify(result.body));
  assert.equal(result.body?.grounded, true);
  assert.equal(result.body?.mappingStatus, "official-gel-manual-verified-html");
  assert.equal(result.body?.mappingConfidence, "manual-verified");
  assert.equal(result.body?.sourceUrls?.length, expected.get(entry.subjectId + "\n" + entry.label).sources);
  assert.ok(String(result.body?.text || "").length >= 500);
}

// These six candidate-backed topics were explicitly reviewed in Phase 20 and
// remain blocked because the recorded candidates do not safely cover the learner-facing label.
for (const [subjectId, label] of [
  ["archaia-b-lykeiou", "Αδίδακτο πεζό κείμενο αττικής διαλέκτου"],
  ["latinika-b-lykeiou", "Κείμενα και λεξιλόγιο των διδακτικών ενοτήτων"],
  ["ekthesi-b-lykeiou", "Ισορροπία δοκιμίου"],
  ["ekthesi-b-lykeiou", "Κειμενικά είδη"],
  ["latinika-g-lykeiou", "Λεξιλόγιο και ετυμολογικές σχέσεις"],
  ["mathimatika-g-prosanatolismou", "Παράγωγος σύνθετης και αντίστροφης συνάρτησης"]
]) {
  const resolved = endpoint._test.resolveGelInventoryTopic(subjectId, label);
  assert.equal(resolved?.runtimeEligible, false, subjectId + " / " + label + " must remain fail-closed");
}

console.log("PHASE20_GEL_FINAL_SAFE_CANDIDATES=" + JSON.stringify({
  activated: phase20.length,
  candidateBacked: phase20.filter((entry) => entry.sourceOrigin !== "manual-official-discovery").length,
  newlyDiscovered: phase20.filter((entry) => entry.discoveryPhase === 20).length,
  uniqueOfficialPages: pageMap.size,
  endpointResults
}, null, 2));
