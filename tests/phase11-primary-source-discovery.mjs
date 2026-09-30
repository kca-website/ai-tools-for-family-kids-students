import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { resolveLinkedSectionUrlsFromHtml } = require("../api/schoolbook-source.js")._test;

const source = fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const data = sandbox.window.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027;

const ids = [
  "glossa-a-dimotikou",
  "glossa-b-dimotikou",
  "glossa-c-dimotikou",
  "glossa-d-dimotikou",
  "glossa-e-dimotikou",
  "science-st-dimotikou",
  "istoria-d-dimotikou",
  "english-st-dimotikou"
];

const report = {};
for (const id of ids) {
  const row = data.get(id);
  assert.ok(row?.sourceUrl, id + " missing sourceUrl");
  const base = row.sourceUrl.endsWith("index.html")
    ? row.sourceUrl.replace(/index\.html(?:[?#].*)?$/i, "")
    : row.sourceUrl;
  if (!/\/html\//i.test(base)) {
    report[id] = { sourceUrl: row.sourceUrl, matched: {}, missing: row.sections, status: "non-html-source" };
    continue;
  }
  const response = await fetch(base, { headers: { "User-Agent": "aitools4kids-phase11-audit/1.0" } });
  assert.equal(response.ok, true, id + " official index fetch failed: " + response.status);
  const html = await response.text();
  const matched = {};
  const missing = [];
  for (const section of row.sections) {
    const urls = resolveLinkedSectionUrlsFromHtml({ base }, section, html);
    if (urls.length === 1) matched[section] = urls[0];
    else missing.push(section);
  }
  report[id] = { sourceUrl: row.sourceUrl, matched, missing, matchedCount: Object.keys(matched).length, total: row.sections.length };
}

console.log("PHASE11_PRIMARY_SOURCE_DISCOVERY=" + JSON.stringify(report, null, 2));
