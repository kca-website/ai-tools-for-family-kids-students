// Regenerates scripts/phase14/gel-site-topics-snapshot.json from the live curriculum resolver.
//
//   python3 -m http.server 4173   # (or the QA static server) in the repo root, then:
//   node scripts/phase14/extract-site-topics.mjs [http://127.0.0.1:4173]
//
// Requires Playwright (same setup as tests/phase11-coverage-audit.mjs).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || "http://127.0.0.1:4173";
const { chromium } = await import("playwright");
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => !!window.AITOOLSKIDS_CURRICULUM_RESOLVER?.getSubjects, { timeout: 30000 });
  const subjects = await page.evaluate(() => {
    const r = window.AITOOLSKIDS_CURRICULUM_RESOLVER;
    const out = [];
    for (const g of ["a", "b", "c"]) {
      for (const s of r.getSubjects("high", g)) {
        out.push({
          subjectId: s.quizId || s.id, grade: g, label: s.subjectLabelEl, topicMode: s.topicMode,
          topics: (s.topics || []).map((t) => ({ id: t.id, label: t.labelEl || t.titleEl || t.id, status: t.status }))
        });
      }
    }
    return out;
  });
  const snapshot = {
    schema: "aitools4kids.gel-site-topics-snapshot/1",
    source: 'window.AITOOLSKIDS_CURRICULUM_RESOLVER.getSubjects("high", grade)',
    subjects
  };
  fs.writeFileSync(path.join(HERE, "gel-site-topics-snapshot.json"), JSON.stringify(snapshot, null, 1) + "\n");
  console.log("subjects:", subjects.length, "topics:", subjects.reduce((n, s) => n + s.topics.length, 0));
} finally {
  await browser.close();
}
