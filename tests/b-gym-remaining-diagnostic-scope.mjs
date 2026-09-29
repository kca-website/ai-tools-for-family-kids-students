import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const quizSandbox = {};
vm.runInNewContext(
  fs.readFileSync(new URL("../quiz-data.js", import.meta.url), "utf8") +
    "\n;globalThis.__QUIZZES = QUIZZES; globalThis.__GAPS = GAP_TAGS;",
  quizSandbox
);
const learningSandbox = {};
vm.runInNewContext(
  fs.readFileSync(new URL("../learning-paths-data.js", import.meta.url), "utf8") +
    "\n;globalThis.__PATHS = LEARNING_PATHS;",
  learningSandbox
);
const officialWindow = {};
vm.runInNewContext(
  fs.readFileSync(new URL("../official-curriculum-data.js", import.meta.url), "utf8"),
  { window: officialWindow }
);
const official = officialWindow.AITOOLSKIDS_OFFICIAL_CURRICULUM;

const expectedTags = {
  "physics-gymnasiou": [
    "physics.density-mass-confusion",
    "physics.force-motion-confusion",
    "physics.pressure-force-area",
    "physics.speed-definition"
  ],
  "biologia-b-gymnasiou": [
    "biologia-b-gym.defense-mechanisms",
    "biologia-b-gym.homeostasis",
    "biologia-b-gym.musculoskeletal-system",
    "biologia-b-gym.plant-reproduction"
  ],
  "glossa-b-gymnasiou": [
    "glossa-b-gym.argument-vs-evidence",
    "glossa-b-gym.essay-intro-function",
    "glossa-b-gym.summary-vs-opinion",
    "glossa-b-gym.text-types-purpose"
  ],
  "english-b-gymnasiou": [
    "efl-b-gym.modals-obligation",
    "efl-b-gym.passive-voice-intro",
    "efl-b-gym.present-perfect-intro",
    "efl-b-gym.relative-clauses"
  ]
};

for (const [id, expected] of Object.entries(expectedTags)) {
  const quiz = quizSandbox.__QUIZZES?.middle?.[id];
  assert.ok(quiz, id);
  assert.equal(quiz.questions.length, 4, id);
  const tags = [...new Set(
    quiz.questions.flatMap(q => q.options || []).map(o => o.gapTag).filter(Boolean)
  )].sort();
  assert.deepEqual(tags, [...expected].sort(), id);

  for (const tag of tags) {
    assert.ok(quizSandbox.__GAPS[tag], `missing gap definition: ${tag}`);
    assert.ok(official.gapAlignment[tag], `missing provenance: ${tag}`);
    assert.equal(learningSandbox.__PATHS?.[tag]?.length, 3, `learning path: ${tag}`);
  }
}

for (const oldTag of [
  "biologia-b-gym.gas-exchange-organ",
  "biologia-b-gym.heart-role",
  "biologia-b-gym.blood-function",
  "biologia-b-gym.producer-definition",
  "biologia-b-gym.nervous-system-role"
]) {
  assert.ok(!quizSandbox.__GAPS[oldTag], `out-of-scope Biology B gap remains: ${oldTag}`);
  assert.ok(!official.gapAlignment[oldTag], `out-of-scope provenance remains: ${oldTag}`);
  assert.ok(!learningSandbox.__PATHS?.[oldTag], `out-of-scope learning path remains: ${oldTag}`);
}

const expectedRecords = {
  "physics-gymnasiou": ["annual-guidance-detailed-map", 26],
  "biologia-b-gymnasiou": ["annual-guidance-detailed-map", 13],
  "glossa-b-gymnasiou": ["annual-guidance-target-based-selection", 9],
  "archaia-glossa-b-gymnasiou": ["annual-guidance-detailed-map", 12],
  "iliada-b-gymnasiou": ["annual-guidance-detailed-map", 10],
  "english-b-gymnasiou": ["annual-guidance-package-selection", 18]
};
for (const [id, [status, count]] of Object.entries(expectedRecords)) {
  const record = official.getByQuizId(id);
  assert.ok(record, id);
  assert.equal(record.coverageStatus, status, id);
  assert.equal(record.officialSectionsEl.length, count, id);
}

const actualQuizCount = Object.values(quizSandbox.__QUIZZES)
  .reduce((n, zone) => n + Object.keys(zone || {}).length, 0);
const actualGapCount = Object.keys(quizSandbox.__GAPS).length;
assert.equal(official.meta.coverageSummary.allQuizEntries, actualQuizCount);
assert.equal(official.meta.coverageSummary.allGapEntries, actualGapCount);
assert.equal(Object.keys(official.gapAlignment).length, actualGapCount);

console.log("Remaining B Gym diagnostics/provenance: verified 2026-27 scope and learning-path parity passed.");
