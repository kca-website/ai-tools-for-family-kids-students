// Replaces the topic list of one subject in gel-2026-2027-update.js with a reviewed list that follows the book chapters.
//   node scripts/phase22/replace-subject-topics.mjs subjectId topics.json
// topics.json = [[el, en], ...]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const [subjectId, file] = process.argv.slice(2);
const topics = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
const FILE = path.join(ROOT, "gel-2026-2027-update.js");
const src = fs.readFileSync(FILE, "utf8");
// The block is located by its quizId (stable key used everywhere else); the nearest preceding "topics" array is replaced.
const qMark = `"quizId": "${subjectId}"`;
const q = src.indexOf(qMark);
if (q < 0 || src.indexOf(qMark, q + 1) >= 0) throw new Error("quizId block not found/ambiguous");
const tStart = src.lastIndexOf('"topics": [', q);
const tEnd = src.indexOf('\n      ],\n      "source"', tStart);
if (tStart < 0 || tEnd < 0 || tEnd > q) throw new Error("topics block not located");
const body = topics.map(([el, en]) => `        [\n          ${JSON.stringify(el)},\n          ${JSON.stringify(en)}\n        ]`).join(",\n");
fs.writeFileSync(FILE, src.slice(0, tStart) + '"topics": [\n' + body + src.slice(tEnd));
console.log(subjectId, "topics ->", topics.length);
