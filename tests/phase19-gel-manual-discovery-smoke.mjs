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

const discovered = overrides.entries.filter((entry) =>
  entry.sourceOrigin === "manual-official-discovery" && entry.discoveryPhase !== 20 && entry.discoveryPhase !== 21 && entry.discoveryPhase !== 22
);

assert.equal(discovered.length, 18);

const uniquePages = new Map();
for (const entry of discovered) {
  const subject = inventory.get(entry.subjectId);
  assert.ok(subject, "unknown subject " + entry.subjectId);

  const topic = (subject.topicMappings || []).find((row) => row.label === entry.label);
  assert.ok(topic, "unknown topic " + entry.subjectId + " / " + entry.label);
  assert.equal(topic.status, "needs-manual-review");
  assert.equal(topic.topicId, entry.sourceTopicId);

  const book = (subject.books || []).find((row) =>
    row.role === "primary" && row.work === entry.work && row.html?.url
  );
  assert.ok(book, "verified primary HTML book missing for " + entry.subjectId + " / " + entry.label);

  for (const source of sources(entry)) {
    assert.equal(
      endpoint._test.sameOfficialHtmlManifestation(source.url, book.html.url),
      true,
      "source must match verified book manifestation: " + entry.subjectId + " / " + entry.label
    );
    assert.ok(String(source.heading || "").trim().length >= 2);

    const clean = new URL(source.url);
    clean.hash = "";
    const key = clean.toString();
    if (!uniquePages.has(key)) uniquePages.set(key, []);
    uniquePages.get(key).push({ entry, source });
  }

  const resolved = endpoint._test.resolveGelInventoryTopic(entry.subjectId, entry.label);
  assert.equal(resolved?.runtimeMode, "manual-html");
  assert.equal(resolved?.manualOverride?.sourceOrigin, "manual-official-discovery");
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

const pageQueue = [...uniquePages.entries()];
const pageFailures = [];
const workers = Array.from({ length: Math.min(5, pageQueue.length) }, async () => {
  while (pageQueue.length) {
    const [url, rows] = pageQueue.shift();
    let response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "aitools4kids.gr Phase 19 official discovery audit",
          "Accept": "text/html,application/xhtml+xml"
        },
        redirect: "follow"
      });
    } catch (error) {
      pageFailures.push({ url, error: "fetch_failed:" + String(error?.message || error) });
      continue;
    }
    if (!response.ok) {
      pageFailures.push({ url, error: "http_" + response.status });
      continue;
    }
    const text = normalize(await response.text());
    if (text.length < 300) {
      pageFailures.push({ url, error: "page_too_short" });
      continue;
    }
    for (const { entry, source } of rows) {
      if (!text.includes(normalize(source.heading))) {
        pageFailures.push({
          url,
          subjectId: entry.subjectId,
          label: entry.label,
          heading: source.heading,
          error: "verified_heading_not_found"
        });
      }
    }
  }
});
await Promise.all(workers);
assert.deepEqual(pageFailures, []);

const endpointResults = [];
for (const entry of discovered) {
  const result = await endpoint.resolveOfficialSchoolbookSource(entry.subjectId, entry.label);
  endpointResults.push({
    subjectId: entry.subjectId,
    label: entry.label,
    ok: result.ok,
    sourceCount: result.body?.sourceUrls?.length || 0,
    chars: String(result.body?.text || "").length
  });
  assert.equal(result.ok, true, entry.subjectId + " / " + entry.label + " => " + JSON.stringify(result.body));
  assert.equal(result.body?.grounded, true);
  assert.equal(result.body?.mappingStatus, "official-gel-manual-verified-html");
  assert.equal(result.body?.mappingConfidence, "manual-verified");
  assert.equal(result.body?.sourceUrls?.length, sources(entry).length);
  assert.ok(String(result.body?.text || "").length >= 500);
}

console.log("PHASE19_GEL_MANUAL_DISCOVERY=" + JSON.stringify({
  discovered: discovered.length,
  uniqueOfficialPages: uniquePages.size,
  endpointResults
}, null, 2));
