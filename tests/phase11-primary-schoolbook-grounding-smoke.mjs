import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const sourceApi = require("../api/schoolbook-source.js");
const { topicLabelCandidates, resolveLinkedSectionUrlsFromHtml } = sourceApi._test;

const supported = [
  "glossa-a-dimotikou",
  "glossa-b-dimotikou",
  "glossa-c-dimotikou",
  "glossa-d-dimotikou",
  "glossa-e-dimotikou",
  "science-st-dimotikou",
  "istoria-d-dimotikou",
  "english-st-dimotikou",
];

const apiSource = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
const sectionSource = fs.readFileSync(new URL("../general-education-book-sections-2026-2027.js", import.meta.url), "utf8");
for (const id of supported) {
  assert.match(apiSource, new RegExp('"' + id + '"\\s*:\\s*\\{[\\s\\S]{0,900}?mode:\\s*"linkedSection"'));
  const start = sectionSource.indexOf('"' + id + '":{');
  assert.ok(start >= 0, "Missing official book-section entry for " + id);
  assert.match(sectionSource.slice(start, start + 1000), /groundingStatus:"schoolbook-source-exact"/);
}

assert.deepEqual(topicLabelCandidates("1η Ενότητα — Πού είναι ο Άρης;").includes("που ειναι ο αρης"), true);
const fixtureBook = { base: "https://ebooks.edu.gr/ebooks/v/html/8547/1993/Glossa_A-Dimotikou_html-empl/" };
const fixture = '<a href="indexb_00.html"><span>Πού είναι ο Άρης;</span></a><a href="indexc_00.html">Η παρέα</a>';
assert.deepEqual(
  resolveLinkedSectionUrlsFromHtml(fixtureBook, "1η Ενότητα — Πού είναι ο Άρης;", fixture),
  ["https://ebooks.edu.gr/ebooks/v/html/8547/1993/Glossa_A-Dimotikou_html-empl/indexb_00.html"]
);
assert.deepEqual(resolveLinkedSectionUrlsFromHtml(fixtureBook, "Άγνωστη ενότητα", fixture), []);
assert.deepEqual(
  resolveLinkedSectionUrlsFromHtml(fixtureBook, "Η παρέα", fixture + '<a href="duplicate.html">Η παρέα</a>'),
  [],
  "Ambiguous exact matches must fail closed"
);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => {
    const resolver = window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    const books = window.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027;
    return !!resolver?.getSubject &&
      books?.get?.("glossa-a-dimotikou")?.groundingStatus === "schoolbook-source-exact" &&
      books?.get?.("science-st-dimotikou")?.groundingStatus === "schoolbook-source-exact";
  }, { timeout: 30000 });

  const checks = await page.evaluate((rows) => rows.map(({zone,grade,id}) => {
    const subject = window.AITOOLSKIDS_CURRICULUM_RESOLVER.getSubject(zone, grade, id);
    return {
      id,
      topicMode: subject?.topicMode || "",
      topics: (subject?.topics || []).map((t) => ({status:t.status||"", sourceType:t.sourceType||"", sourceUrl:t.sourceUrl||""}))
    };
  }), [
    {zone:"primary",grade:"a",id:"glossa-a-dimotikou"},
    {zone:"primary",grade:"b",id:"glossa-b-dimotikou"},
    {zone:"primary",grade:"c",id:"glossa-c-dimotikou"},
    {zone:"primary",grade:"d",id:"glossa-d-dimotikou"},
    {zone:"primary",grade:"e",id:"glossa-e-dimotikou"},
    {zone:"primary",grade:"st",id:"science-st-dimotikou"},
    {zone:"primary",grade:"d",id:"istoria-d-dimotikou"},
    {zone:"primary",grade:"st",id:"english-st-dimotikou"},
  ]);

  for (const row of checks) {
    assert.equal(row.topicMode, "verified-official-sections", row.id + " should expose exact official book sections");
    assert.ok(row.topics.length > 0, row.id + " should expose at least one section");
    const officialBookTopics = row.topics.filter((t) => t.status === "official-book-section-verified" && t.sourceType === "official-book-section");
    assert.ok(officialBookTopics.length > 0, row.id + " must expose exact official book sections");
    assert.ok(officialBookTopics.every((t) => /^https:\/\//.test(t.sourceUrl)), row.id + " official book sections require a source URL");
  }
} finally {
  await browser.close();
}

console.log("Phase 11A Primary exact-schoolbook grounding contract passed.");
