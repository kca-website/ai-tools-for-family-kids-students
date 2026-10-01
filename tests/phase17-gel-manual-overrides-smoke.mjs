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

function entrySources(entry) {
  if (Array.isArray(entry.sources) && entry.sources.length) return entry.sources;
  if (entry.url && entry.heading) {
    return [{ work: entry.work || null, url: entry.url, heading: entry.heading, candidateScore: entry.candidateScore ?? null }];
  }
  return [];
}

assert.equal(overrides.schoolYear, "2026-2027");
assert.equal(overrides.count, 166);
assert.equal(overrides.entries.length, 166);

const keys = new Set();
let medium = 0;
let manual = 0;
let multiSource = 0;
let discovered = 0;

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

  const sources = entrySources(entry);
  assert.ok(sources.length >= 1, "override must expose at least one official source: " + key);
  if (sources.length > 1) multiSource++;
  for (const row of sources) {
    assert.match(String(row.url || ""), /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i);
    assert.ok(String(row.heading || "").trim().length >= 2);
    assert.equal(row.work || entry.work, entry.work);
  }

  if (entry.sourceStatus === "exact-html") {
    medium++;
    assert.equal(source.status, "exact-html");
    assert.equal(source.confidence, "medium");
    assert.equal(sources.length, 1);
    assert.equal(source.url, sources[0].url);
    assert.equal(source.heading, sources[0].heading);
  } else {
    manual++;
    assert.equal(entry.sourceStatus, "needs-manual-review");
    assert.equal(source.status, "needs-manual-review");

    const verifiedBook = (subject.books || []).find((book) =>
      book.role === "primary" && book.work === entry.work && book.html?.url
    );
    assert.ok(verifiedBook, "manual override must target a verified official HTML book: " + key);

    if (entry.sourceOrigin === "manual-official-discovery") {
      discovered++;
      for (const row of sources) {
        assert.equal(
          endpoint._test.sameOfficialHtmlManifestation(row.url, verifiedBook.html.url),
          true,
          "discovered source must stay inside the verified book manifestation: " + key
        );
      }
    } else {
      for (const row of sources) {
        const candidate = (source.candidates || []).find((candidate) =>
          candidate.url === row.url && candidate.heading === row.heading
        );
        assert.ok(candidate, "candidate-backed override must come from a recorded Phase 14 candidate: " + key);
      }
    }
  }

  const resolved = endpoint._test.resolveGelInventoryTopic(entry.subjectId, entry.label);
  assert.equal(resolved?.runtimeEligible, true, key);
  assert.equal(resolved?.runtimeMode, "manual-html", key);
  assert.equal(resolved?.manualOverride?.label, entry.label);
  assert.equal(resolved?.manualSources?.length, sources.length);
  assert.equal(resolved?.mapping?.confidence, "manual-verified");
}

assert.equal(medium, 14);
assert.equal(manual, 152);
assert.equal(discovered, 37);
assert.equal(multiSource, 8);

// Live source audit: every unique official page must still load and contain
// every manually accepted official heading for that page.
const byUrl = new Map();
for (const entry of overrides.entries) {
  for (const source of entrySources(entry)) {
    const url = new URL(source.url);
    url.hash = "";
    const clean = url.toString();
    if (!byUrl.has(clean)) byUrl.set(clean, []);
    byUrl.get(clean).push({ entry, source });
  }
}

const queue = [...byUrl.entries()];
const failures = [];
const results = [];
const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
  while (queue.length) {
    const [url, rows] = queue.shift();
    let response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "aitools4kids.gr Phase 17-21 manual grounding audit",
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
    for (const { entry, source } of rows) {
      const heading = normalize(source.heading);
      if (!heading || !text.includes(heading)) {
        failures.push({
          url,
          subjectId: entry.subjectId,
          label: entry.label,
          heading: source.heading,
          error: "verified_heading_not_found"
        });
      }
    }
    results.push({ url, topics: rows.length, chars: text.length });
  }
});
await Promise.all(workers);
assert.deepEqual(failures, []);

const representative = [
  ["mathimatika-a-lykeiou", "3.2 Εξισώσεις της μορφής x^ν = α", 1],
  ["geometria-a-lykeiou", "4.2 Παράλληλες ευθείες και τέμνουσα", 1],
  ["biologia-b-lykeiou", "Εξέλιξη του ανθρώπου", 1],
  ["pliroforiki-g-lykeiou", "Δεδομένα και τύποι δεδομένων", 2],
  ["istoria-g-lykeiou", "Ψυχρός Πόλεμος", 2],
  ["chimeia-g-lykeiou", "Αρχή Le Chatelier", 1],
  ["istoria-b-lykeiou", "Σχίσμα των Εκκλησιών", 1],
  ["fysiki-b-lykeiou", "Αντιστρεπτές μεταβολές: έργο: θερμότητα: εσωτερική ενέργεια", 4],
  ["mathimatika-g-prosanatolismou", "Ασύμπτωτες και πλήρης μελέτη συνάρτησης", 2],
  ["fysiki-g-lykeiou", "Κίνηση φορτισμένων σωματιδίων σε μαγνητικό πεδίο", 1]
];

const liveEndpoint = [];
for (const [subjectId, label, expectedSources] of representative) {
  const result = await endpoint.resolveOfficialSchoolbookSource(subjectId, label);
  liveEndpoint.push({
    subjectId,
    label,
    ok: result.ok,
    status: result.status,
    mappingStatus: result.body?.mappingStatus,
    sourceCount: result.body?.sourceUrls?.length || 0,
    chars: String(result.body?.text || "").length
  });
  assert.equal(result.ok, true, subjectId + " / " + label + " => " + JSON.stringify(result.body));
  assert.equal(result.body?.mappingStatus, "official-gel-manual-verified-html");
  assert.equal(result.body?.mappingConfidence, "manual-verified");
  assert.equal(result.body?.sourceUrls?.length, expectedSources);
  assert.ok(String(result.body?.text || "").length >= 500);
}

console.log("PHASE17_21_GEL_MANUAL_OVERRIDES=" + JSON.stringify({
  total: overrides.count,
  medium,
  manual,
  discovered,
  multiSource,
  uniqueOfficialPages: byUrl.size,
  liveEndpoint
}, null, 2));
