import fs from "node:fs";
import assert from "node:assert/strict";

const map = fs.readFileSync("xartis-ylis.html", "utf8");
const home = fs.readFileSync("index.html", "utf8");
const tutor = fs.readFileSync("tutor.js", "utf8");
const app = fs.readFileSync("app.js", "utf8");

for (const page of [map, home]) {
  assert.match(page, /september-2026-primary-tutor\.js/);
  assert.match(page, /september-2026-language-tutor\.js/);
}

assert.match(map, /function routeWithContext/);
assert.match(map, /function practiceUrl/);
assert.match(map, /middle:'\/middle\/guardian\/tutor'/);
assert.match(map, /p\.set\('topicText'/);
assert.match(map, /p\.set\('gap',t\.id\)|new URLSearchParams\(\{gap:t\.id/);

assert.match(tutor, /urlTopicOverride/);
assert.match(tutor, /requestedTopicText/);
assert.match(app, /function applyQuizDeepLink/);
assert.match(app, /openLearningPathModal\(gapId\)/);

console.log("curriculum-map-deeplink-smoke: ok");
