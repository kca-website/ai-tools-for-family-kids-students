import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Phase 22: CSV review of the Lyceum (ΓΕΛ) topics. Topic lists were aligned with the official book chapters /
// ΦΕΚ Β΄ 4210/13.07.2026 / ΙΕΠ guidance, and 146 additional topics were grounded through reviewed manual overrides.
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
    .replace(/[̀-ͯ]/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const phase22 = overrides.entries.filter((entry) => entry.reviewPhase === 22);
assert.equal(phase22.length, 146);

const bySubject = {};
const pageMap = new Map();
for (const entry of phase22) {
  assert.equal(entry.sourceOrigin, "manual-official-discovery");
  assert.equal(entry.discoveryPhase, 22);
  assert.equal(entry.reviewedBy, "claude-ai-review");
  assert.ok(String(entry.reviewBasis || "").length > 20, "review basis required: " + entry.label);
  bySubject[entry.subjectId] = (bySubject[entry.subjectId] || 0) + 1;

  const subject = inventory.get(entry.subjectId);
  assert.ok(subject, "unknown subject " + entry.subjectId);
  const matches = (subject.topicMappings || []).filter((row) => row.label === entry.label);
  assert.equal(matches.length, 1, "override must target exactly one inventory topic: " + entry.label);
  assert.equal(matches[0].topicId, entry.sourceTopicId);
  assert.equal(matches[0].status, "needs-manual-review");

  const primary = (subject.books || []).find((book) => book.role === "primary" && book.work === entry.work && book.html?.url);
  assert.ok(primary, "verified primary HTML book missing: " + entry.subjectId + " / " + entry.label);
  const rows = sources(entry);
  assert.ok(rows.length >= 1);
  for (const row of rows) {
    assert.equal(
      endpoint._test.sameOfficialHtmlManifestation(row.url, primary.html.url),
      true,
      "source must stay inside the verified primary book: " + entry.subjectId + " / " + entry.label
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

// Topics that are not part of the official 2026-27 syllabus/book chapters were removed from the site lists.
const removed = [
  ["neoelliniki-b-lykeiou", "Ελεύθερος χρόνος και ψυχαγωγία"],
  ["ekthesi-b-lykeiou", "Ελεύθερος χρόνος και ψυχαγωγία"],
  ["ekthesi-b-lykeiou", "Επιστήμη και τεχνολογία"],
  ["archaia-a-lykeiou", "Θεματικός άξονας: δύναμη και δίκαιο: ηθική του πολέμου"],
  ["istoria-g-lykeiou", "Εθνικά και φιλελεύθερα κινήματα"],
  ["istoria-g-lykeiou", "Αποαποικιοποίηση"],
  ["fysiki-g-lykeiou", "Σύνθεση ταλαντώσεων"],
  ["chimeia-g-lykeiou", "Ηλεκτρόλυση και εφαρμογές"],
  ["chimeia-g-lykeiou", "Γινόμενο διαλυτότητας"],
  ["filosofia-b-lykeiou", "Σκεπτικισμός και όρια της γνώσης"]
];
for (const [subjectId, label] of removed) {
  const subject = inventory.get(subjectId);
  if (!subject) continue; // alias subject ids are not inventory ids
  assert.equal((subject.topicMappings || []).some((row) => row.label === label), false, subjectId + " must not list " + label);
}

// Latin lessons now follow the book chapters one-to-one and are runtime-grounded.
const latinB = inventory.get("latinika-b-lykeiou");
assert.equal(latinB.topicMappings.length, 16);
const latinG = inventory.get("latinika-g-lykeiou");
assert.equal(latinG.topicMappings.length, 37);
for (const subject of [latinB, latinG]) {
  for (const topic of subject.topicMappings) {
    const resolved = endpoint._test.resolveGelInventoryTopic(subject.subjectId, topic.label);
    assert.equal(resolved?.runtimeEligible, true, subject.subjectId + " / " + topic.label);
  }
}
const philosophy = inventory.get("filosofia-b-lykeiou");
assert.equal(philosophy.topicMappings.length, 6);
for (const topic of philosophy.topicMappings) {
  assert.equal(endpoint._test.resolveGelInventoryTopic("filosofia-b-lykeiou", topic.label)?.runtimeEligible, true, topic.label);
}

// Live audit: every unique official page must load and contain every accepted heading.
const failures = [];
const queue = [...pageMap.entries()];
const workers = Array.from({ length: Math.min(6, queue.length) }, async () => {
  while (queue.length) {
    const [url, rows] = queue.shift();
    let response;
    try {
      response = await fetch(url, { headers: { "User-Agent": "aitools4kids.gr Phase 22 CSV review audit", Accept: "text/html" }, redirect: "follow" });
    } catch (error) {
      failures.push({ url, error: "fetch_failed:" + String(error?.message || error) });
      continue;
    }
    if (!response.ok) { failures.push({ url, error: "http_" + response.status }); continue; }
    const text = normalize(await response.text());
    if (text.length < 300) { failures.push({ url, error: "page_too_short" }); continue; }
    for (const { entry, row } of rows) {
      if (!text.includes(normalize(row.heading))) failures.push({ url, label: entry.label, heading: row.heading, error: "verified_heading_not_found" });
    }
  }
});
await Promise.all(workers);
assert.deepEqual(failures, []);

// End-to-end: the production resolver must ground every Phase 22 override.
const endpointFailures = [];
for (const entry of phase22) {
  const result = await endpoint.resolveOfficialSchoolbookSource(entry.subjectId, entry.label);
  const chars = String(result.body?.text || "").length;
  if (!result.ok || result.body?.grounded !== true || result.body?.mappingStatus !== "official-gel-manual-verified-html" || chars < 500) {
    endpointFailures.push(entry.subjectId + " / " + entry.label + " -> " + result.status + " chars=" + chars);
  }
}
assert.deepEqual(endpointFailures, []);

console.log("PHASE22_GEL_CSV_REVIEW=" + JSON.stringify({ activated: phase22.length, uniqueOfficialPages: pageMap.size, bySubject }, null, 2));
