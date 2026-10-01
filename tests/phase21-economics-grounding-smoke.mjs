import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const inventory = require("../gel-schoolbook-source-map-2026-2027.js");
const overrides = require("../gel-schoolbook-manual-overrides-2026-2027.js");
const endpoint = require("../api/schoolbook-source.js");

function sources(entry) {
  return Array.isArray(entry.sources) && entry.sources.length
    ? entry.sources
    : [{ work: entry.work, url: entry.url, heading: entry.heading }];
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

const phase21 = overrides.entries.filter((entry) => entry.reviewPhase === 21);
assert.equal(phase21.length, 16);

const expected = new Map([
  ["Βασικό οικονομικό πρόβλημα και σπανιότητα", 1],
  ["Παραγωγικές δυνατότητες και κόστος ευκαιρίας", 1],
  ["Καταμερισμός έργων, χρήμα και οικονομικό κύκλωμα", 1],
  ["Ζήτηση και νόμος ζήτησης", 1],
  ["Ατομική και αγοραία ζήτηση", 1],
  ["Ελαστικότητα ζήτησης ως προς την τιμή", 1],
  ["Παραγωγή και συντελεστές παραγωγής", 1],
  ["Βραχυχρόνια συνάρτηση παραγωγής", 1],
  ["Κόστος παραγωγής", 1],
  ["Προσφορά και νόμος προσφοράς", 1],
  ["Ελαστικότητα προσφοράς", 1],
  ["Ισορροπία αγοράς", 1],
  ["Κρατική παρέμβαση στις τιμές", 1],
  ["Πραγματικό και ονομαστικό ΑΕΠ", 1],
  ["Δείκτης τιμών και πληθωρισμός", 2],
  ["Ανεργία", 1]
]);

const pageMap = new Map();
for (const entry of phase21) {
  assert.equal(entry.subjectId, "oikonomia-g-lykeiou");
  assert.equal(entry.sourceOrigin, "manual-official-discovery");
  assert.equal(entry.discoveryPhase, 21);
  assert.equal(entry.work, "8547/2392");
  assert.ok(expected.has(entry.label), "unexpected Phase 21 label: " + entry.label);

  const subject = inventory.get(entry.subjectId);
  const topic = (subject?.topicMappings || []).find((row) => row.label === entry.label);
  assert.ok(topic, "unknown economics topic: " + entry.label);
  assert.equal(topic.topicId, entry.sourceTopicId);
  assert.equal(topic.status, "needs-manual-review");

  const primaryBook = (subject.books || []).find((book) =>
    book.role === "primary" && book.work === entry.work && book.html?.url
  );
  assert.ok(primaryBook, "verified primary Economics HTML book missing");

  const rows = sources(entry);
  assert.equal(rows.length, expected.get(entry.label));

  for (const row of rows) {
    assert.equal(
      endpoint._test.sameOfficialHtmlManifestation(row.url, primaryBook.html.url),
      true,
      "source must remain inside verified Economics manifestation: " + entry.label
    );
    const clean = new URL(row.url);
    clean.hash = "";
    const url = clean.toString();
    if (!pageMap.has(url)) pageMap.set(url, []);
    pageMap.get(url).push({ entry, row });
  }

  const resolved = endpoint._test.resolveGelInventoryTopic(entry.subjectId, entry.label);
  assert.equal(resolved?.runtimeEligible, true, entry.label);
  assert.equal(resolved?.runtimeMode, "manual-html", entry.label);
  assert.equal(resolved?.manualSources?.length, rows.length, entry.label);
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
          "User-Agent": "aitools4kids.gr Phase 21 Economics grounding audit",
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
for (const entry of phase21) {
  const result = await endpoint.resolveOfficialSchoolbookSource(entry.subjectId, entry.label);
  endpointResults.push({
    label: entry.label,
    ok: result.ok,
    sources: result.body?.sourceUrls?.length || 0,
    chars: String(result.body?.text || "").length
  });
  assert.equal(result.ok, true, entry.label + " => " + JSON.stringify(result.body));
  assert.equal(result.body?.grounded, true);
  assert.equal(result.body?.mappingStatus, "official-gel-manual-verified-html");
  assert.equal(result.body?.mappingConfidence, "manual-verified");
  assert.equal(result.body?.sourceUrls?.length, expected.get(entry.label));
  assert.ok(String(result.body?.text || "").length >= 500);
}

// These two learner-facing aggregate labels are not fully covered by a safe
// current HTML source in the verified primary manifestation, so they stay blocked.
for (const label of [
  "Εισόδημα και σταυροειδής ελαστικότητα",
  "Διεθνές εμπόριο και οικονομικές σχέσεις"
]) {
  const resolved = endpoint._test.resolveGelInventoryTopic("oikonomia-g-lykeiou", label);
  assert.equal(resolved?.runtimeEligible, false, label + " must remain fail-closed");
}

console.log("PHASE21_ECONOMICS_GROUNDING=" + JSON.stringify({
  activated: phase21.length,
  uniqueOfficialPages: pageMap.size,
  endpointResults,
  keptBlocked: [
    "Εισόδημα και σταυροειδής ελαστικότητα",
    "Διεθνές εμπόριο και οικονομικές σχέσεις"
  ]
}, null, 2));
