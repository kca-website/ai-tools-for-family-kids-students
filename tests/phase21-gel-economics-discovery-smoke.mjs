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

const phase21 = overrides.entries.filter((entry) => entry.discoveryPhase === 21);
assert.equal(phase21.length, 16);

const expectedSources = new Map([
  ["Παραγωγή και συντελεστές παραγωγής", 2],
  ["Δείκτης τιμών και πληθωρισμός", 2]
]);

const officialPages = new Map();
for (const entry of phase21) {
  assert.equal(entry.subjectId, "oikonomia-g-lykeiou");
  assert.equal(entry.sourceOrigin, "manual-official-discovery");
  assert.equal(entry.reviewPhase, 21);

  const subject = inventory.get(entry.subjectId);
  assert.ok(subject);
  const topic = (subject.topicMappings || []).find((row) => row.label === entry.label);
  assert.ok(topic, "unknown Economics topic: " + entry.label);
  assert.equal(topic.topicId, entry.sourceTopicId);
  assert.equal(topic.status, "needs-manual-review");
  assert.ok(!Array.isArray(topic.candidates) || topic.candidates.length === 0,
    "Phase 21 must be discovery of previously candidate-less topics: " + entry.label);

  const book = (subject.books || []).find((row) =>
    row.role === "primary" && row.work === entry.work && row.html?.url
  );
  assert.ok(book, "verified primary Economics HTML book missing");

  const rows = sources(entry);
  assert.equal(rows.length, expectedSources.get(entry.label) || 1);
  for (const source of rows) {
    assert.equal(endpoint._test.sameOfficialHtmlManifestation(source.url, book.html.url), true);
    const clean = new URL(source.url);
    clean.hash = "";
    const url = clean.toString();
    if (!officialPages.has(url)) officialPages.set(url, []);
    officialPages.get(url).push({entry, source});
  }

  const resolved = endpoint._test.resolveGelInventoryTopic(entry.subjectId, entry.label);
  assert.equal(resolved?.runtimeEligible, true, entry.label);
  assert.equal(resolved?.runtimeMode, "manual-html", entry.label);
  assert.equal(resolved?.manualSources?.length, rows.length, entry.label);
}

const failures = [];
const queue = [...officialPages.entries()];
const workers = Array.from({length: Math.min(5, queue.length)}, async () => {
  while (queue.length) {
    const [url, rows] = queue.shift();
    let response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "aitools4kids.gr Phase 21 Economics official discovery audit",
          "Accept": "text/html,application/xhtml+xml"
        },
        redirect: "follow"
      });
    } catch (error) {
      failures.push({url, error:"fetch_failed:" + String(error?.message || error)});
      continue;
    }
    if (!response.ok) {
      failures.push({url, error:"http_" + response.status});
      continue;
    }
    const text = normalize(await response.text());
    if (text.length < 300) {
      failures.push({url, error:"page_too_short"});
      continue;
    }
    for (const {entry, source} of rows) {
      if (!text.includes(normalize(source.heading))) {
        failures.push({
          url,
          label:entry.label,
          heading:source.heading,
          error:"verified_heading_not_found"
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
    sourceCount: result.body?.sourceUrls?.length || 0,
    chars: String(result.body?.text || "").length
  });
  assert.equal(result.ok, true, entry.label + " => " + JSON.stringify(result.body));
  assert.equal(result.body?.grounded, true);
  assert.equal(result.body?.mappingStatus, "official-gel-manual-verified-html");
  assert.equal(result.body?.mappingConfidence, "manual-verified");
  assert.equal(result.body?.sourceUrls?.length, expectedSources.get(entry.label) || 1);
  assert.ok(String(result.body?.text || "").length >= 500);
}

// Explicitly reviewed but not safely covered by the official chapter structure.
for (const label of [
  "Εισόδημα και σταυροειδής ελαστικότητα",
  "Διεθνές εμπόριο και οικονομικές σχέσεις"
]) {
  const resolved = endpoint._test.resolveGelInventoryTopic("oikonomia-g-lykeiou", label);
  assert.equal(resolved?.runtimeEligible, false, label + " must remain fail-closed");
}

console.log("PHASE21_GEL_ECONOMICS_DISCOVERY=" + JSON.stringify({
  activated: phase21.length,
  uniqueOfficialPages: officialPages.size,
  multiSourceTopics: phase21.filter((entry) => sources(entry).length > 1).length,
  endpointResults
}, null, 2));
