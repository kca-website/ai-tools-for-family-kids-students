import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";

const BASE = "http://127.0.0.1:4173";
const endpointSource = fs.readFileSync(new URL("../api/schoolbook-source.js", import.meta.url), "utf8");
const booksBlock = endpointSource.slice(endpointSource.indexOf("const BOOKS = {"), endpointSource.indexOf("const ALIASES = {"));
const schoolbookIds = [...booksBlock.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map((m) => m[1]);
const aliasesBlock = endpointSource.slice(endpointSource.indexOf("const ALIASES = {"), endpointSource.indexOf("const RELIGION_B_OFFICIAL_SOURCE_MATERIAL"));
const aliases = Object.fromEntries([...aliasesBlock.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
const schoolbookSet = new Set([...schoolbookIds, ...Object.keys(aliases)]);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => !!window.AITOOLSKIDS_CURRICULUM_RESOLVER?.getSubjects, { timeout: 30000 });

  const matrix = await page.evaluate(() => {
    const resolver = window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    const config = {
      primary: ["a","b","c","d","e","st"],
      middle: ["a","b","c"],
      high: ["a","b","c"],
    };
    const out = {};
    for (const [zone, grades] of Object.entries(config)) {
      out[zone] = {};
      for (const grade of grades) {
        const subjects = resolver.getSubjects(zone, grade);
        out[zone][grade] = subjects.map((s) => ({
          id: s.id || "",
          quizId: s.quizId || "",
          label: s.subjectLabelEl || s.id || "",
          topicMode: s.topicMode || "unmapped",
          topics: (s.topics || []).map((t) => ({
            id: t.id || "",
            label: t.labelEl || t.titleEl || t.id || "",
            status: t.status || "",
            sourceUrl: t.sourceUrl || "",
          })),
        }));
      }
    }
    return out;
  });

  const rows = [];
  const verifiedWithoutSource = [];
  const duplicates = [];
  for (const [zone, grades] of Object.entries(matrix)) {
    for (const [grade, subjects] of Object.entries(grades)) {
      const ids = subjects.map((s) => s.quizId || s.id).filter(Boolean);
      const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
      if (repeated.length) duplicates.push({ zone, grade, ids: [...new Set(repeated)] });
      for (const s of subjects) {
        const verifiedTopics = s.topics.filter((t) => /verified|exact-section|related-section|official-book-section|annual-instructions|annual-exam|panhellenic/i.test(t.status));
        for (const t of verifiedTopics) {
          if (!/^https:\/\//.test(t.sourceUrl)) verifiedWithoutSource.push({ zone, grade, subject: s.label, topic: t.label, status: t.status });
        }
        rows.push({
          zone,
          grade,
          subject: s.label,
          subjectId: s.quizId || s.id,
          topicMode: s.topicMode,
          topics: s.topics.length,
          verifiedTopics: verifiedTopics.length,
          sourceBackedVerifiedTopics: verifiedTopics.filter((t) => /^https:\/\//.test(t.sourceUrl)).length,
        });
      }
    }
  }

  assert.deepEqual(duplicates, [], "Resolver must not expose duplicate course identities within a grade.");
  assert.deepEqual(verifiedWithoutSource, [], "Every verified topic must carry an explicit official source URL.");

  for (const row of rows) {
    row.schoolbookSourceMapping = schoolbookSet.has(row.subjectId) || schoolbookSet.has(aliases[row.subjectId]);
  }

  const summary = {};
  for (const zone of ["primary","middle","high"]) {
    const z = rows.filter((r) => r.zone === zone);
    summary[zone] = {
      subjects: z.length,
      mappedSubjects: z.filter((r) => r.topics > 0).length,
      verifiedTopics: z.reduce((n, r) => n + r.verifiedTopics, 0),
      sourceBackedVerifiedTopics: z.reduce((n, r) => n + r.sourceBackedVerifiedTopics, 0),
      schoolbookMappedSubjects: z.filter((r) => r.schoolbookSourceMapping).length,
      unmappedSubjects: z.filter((r) => r.topics === 0).map((r) => ({ grade: r.grade, subject: r.subject })),
    };
  }

  console.log("PHASE11_COVERAGE_AUDIT=" + JSON.stringify({ summary, rows }, null, 2));
} finally {
  await browser.close();
}
