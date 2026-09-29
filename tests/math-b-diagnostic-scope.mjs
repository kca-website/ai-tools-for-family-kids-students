import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const quizSandbox = {};
const quizCode = fs.readFileSync(new URL("../quiz-data.js", import.meta.url), "utf8") + "\n;globalThis.__QUIZZES = QUIZZES;";
vm.runInNewContext(quizCode, quizSandbox);
const quiz = quizSandbox.__QUIZZES?.middle?.["mathimatika-b-gymnasiou"];

assert.ok(quiz, "Math B quiz must exist");
assert.equal(quiz.questions.length, 4);

const text = JSON.stringify(quiz);
assert.ok(!text.includes("μονώνυμα"), "Grade C monomials must not remain in Math B diagnostic");
assert.ok(!text.includes("(x+3)²"), "Grade C notable-identity question must not remain in Math B diagnostic");
assert.ok(!text.includes("math-b-gym.monomial-like-terms"));
assert.ok(!text.includes("math-b-gym.identity-square-sum"));

const tags = new Set();
for (const q of quiz.questions) for (const o of q.options || []) if (o.gapTag) tags.add(o.gapTag);
assert.deepEqual([...tags].sort(), [
  "math-b-gym.direct-proportion",
  "math-b-gym.linear-equation-basic",
  "math-b-gym.pythagorean-application",
  "math-b-gym.sqrt-positive"
].sort());

const learningSandbox = {};
const learningCode = fs.readFileSync(new URL("../learning-paths-data.js", import.meta.url), "utf8") + "\n;globalThis.__LEARNING_PATHS = LEARNING_PATHS;";
vm.runInNewContext(learningCode, learningSandbox);
const paths = learningSandbox.__LEARNING_PATHS;
for (const tag of tags) {
  assert.ok(paths?.[tag], `learning path missing for ${tag}`);
  assert.equal(paths[tag].length, 3, `learning path must have 3 steps: ${tag}`);
}

console.log("Math B diagnostic scope: verified 2026-27 topics only, learning paths intact");
