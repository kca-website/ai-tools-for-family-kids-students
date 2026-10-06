import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// Ιστορία Α΄ ΓΕΛ: every AI Study topic (official 2026–27 scope) is linked to official book
// page(s), listed as verified so the subject is shown, and scoped/fail-closed at runtime.
const require = createRequire(import.meta.url);
const H = require("../history-a-lyceum-sections-2026-2027.js");
const availability = require("../secondary-grounding-availability-2026-2027.js");

// Topics shown in AI Study come from gel-2026-2027-update.js (istoria-a-lykeiou block).
const update = fs.readFileSync(new URL("../gel-2026-2027-update.js", import.meta.url), "utf8");
const start = update.indexOf('"id": "istoria-a-lykeiou"');
const block = update.slice(start, update.indexOf('"quizId": "istoria-a-lykeiou"', start));
const studyTopics = [...block.matchAll(/\[\s*"([^"]+)",\s*"[^"]*"\s*\]/g)].map((m) => m[1]);
assert.equal(studyTopics.length, 26, "expected the 26 official 2026–27 topics");
assert.deepEqual([...H.labels].sort(), [...studyTopics].sort(), "every AI Study topic must have an official section, and only those");

for (const label of studyTopics) {
  assert.ok(availability.has("istoria-a-lykeiou", label), `listed as verified: ${label}`);
  const urls = H.urlsFor(label);
  assert.ok(urls.length >= 1);
  for (const u of urls) assert.match(u, /^https:\/\/lb1\.ebooks\.edu\.gr\/ebooks\/v\/html\/8547\/2696\/Istoria_A-Lykeiou_html-empl\/index[IVX]+\d_\d\.html$/);
}
assert.equal(H.urlsFor("Οι πολιτισμοί της Εγγύς Ανατολής").length, 0, "labels outside the official scope stay unmapped");

// Scoping: keep only the topic's subsection, drop menus, fail closed when a heading is missing.
const html = '<div class="menu"><a class="speech_menu_1">Οι Φοίνικες</a></div><div id="eclass_ebook_body">' +
  "<p>Εισαγωγή</p><p><strong>Η εποχή του Περικλή. </strong>Κείμενο Περικλή.</p>" +
  "<p><strong>Ο Πελοποννησιακος πόλεμος (431-404 π.Χ.). </strong>Κείμενο πολέμου.</p></div>";
const pericles = H.get("Περικλής και αθηναϊκή δημοκρατία").pages[0];
const scoped = H.scopePageHtml(html, pericles);
assert.match(scoped, /Κείμενο Περικλή/);
assert.doesNotMatch(scoped, /Κείμενο πολέμου|Εισαγωγή|Φοίνικες/);
assert.equal(H.scopePageHtml(html.replace("Η εποχή του Περικλή.", "Άλλος τίτλος."), pericles), "");
assert.doesNotMatch(H.scopePageHtml(html, { file: "x.html", start: "", end: "" }), /Φοίνικες/);

// The endpoint resolves History A through this table (no hard-coded single topic).
const api = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
assert.match(api, /return HISTORY_A_LYCEUM\.urlsFor\(topic\)/);
assert.match(api, /verified_section_heading_not_resolved/);

console.log(`History A Lyceum grounding smoke passed: ${studyTopics.length} topics mapped, listed and scoped.`);
