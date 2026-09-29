import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const quizSandbox = {};
const quizCode = fs.readFileSync(new URL("../quiz-data.js", import.meta.url), "utf8") + "\n;globalThis.__QUIZZES = QUIZZES; globalThis.__GAPS = GAP_TAGS;";
vm.runInNewContext(quizCode, quizSandbox);
const quiz = quizSandbox.__QUIZZES?.middle?.["geologia-geografia-b-gymnasiou"];
assert.ok(quiz);
assert.equal(quiz.questions.length, 4);
assert.ok(quiz.introEl.includes("2026–27"));

const tags = [...new Set(quiz.questions.flatMap(q => q.options || []).map(o => o.gapTag).filter(Boolean))].sort();
const expected = [
  "geo-b-gym.mediterranean-suez",
  "geo-b-gym.plate-boundary-seismicity",
  "geo-b-gym.production-sectors",
  "geo-b-gym.relative-vs-geographic-position"
].sort();
assert.deepEqual(tags, expected);
for (const tag of tags) assert.ok(quizSandbox.__GAPS[tag], tag);

const learningSandbox = {};
const learningCode = fs.readFileSync(new URL("../learning-paths-data.js", import.meta.url), "utf8") + "\n;globalThis.__LEARNING_PATHS = LEARNING_PATHS;";
vm.runInNewContext(learningCode, learningSandbox);
for (const tag of tags) {
  assert.ok(learningSandbox.__LEARNING_PATHS[tag], tag);
  assert.equal(learningSandbox.__LEARNING_PATHS[tag].length, 3, tag);
}
console.log("Geography B diagnostic: 4 verified-scope gaps, 4 learning paths OK");
