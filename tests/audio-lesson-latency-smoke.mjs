import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

// «Άκουσέ το» must not hang: knowledge extraction runs in parallel, the full lesson has a time
// budget with a fast verified fallback, and every AI Study request has a client deadline.
const require = createRequire(import.meta.url);
const { createKnowledgeMapLesson, mapLimit } = require("../whole-section-audio-knowledge.js");

// A long official section (≈ many extraction batches).
const paragraph = (i) => `Η ενότητα ${i} εξηγεί ότι η ηλεκτρική τάση προκαλεί ροή φορτίων στον αγωγό. ` +
  `Η ένταση του ρεύματος μετριέται σε αμπέρ και εξαρτάται από την αντίσταση του κυκλώματος. ` +
  `Ο νόμος του Ωμ συνδέει την τάση, την ένταση και την αντίσταση με απλή σχέση.`.repeat(4);
const source = Array.from({ length: 30 }, (_, i) => paragraph(i + 1)).join("\n\n");

let inFlight = 0, maxInFlight = 0, calls = 0;
const fake = async ({ messages }) => {
  calls++; inFlight++; maxInFlight = Math.max(maxInFlight, inFlight);
  await new Promise((r) => setTimeout(r, 120));
  inFlight--;
  const system = messages[0].content;
  const input = JSON.parse(messages[1].content);
  let out;
  if (/building a source-grounded knowledge map/.test(system)) out = { ideas: [{ id: "x", idea: "Ο νόμος του Ωμ συνδέει τάση, ένταση και αντίσταση.", type: "relationship", importance: "core", evidenceIds: [input.sentences[0].id] }] };
  else if (/minimum sufficient set/.test(system)) out = { coreIdeaIds: input.ideas.slice(0, 3).map((x) => x.id) };
  else if (/Independently verify/.test(system)) out = { sentences: input.draft.map((_, index) => ({ index, supported: true, concise: true, reason: "" })), coreIdeas: input.coreIdeas.map((x) => ({ id: x.id, covered: true })) };
  else out = { sentences: input.coreIdeas.map((x) => ({ text: x.idea, ideaIds: [x.id] })) };
  return { ok: true, text: JSON.stringify(out), provider: "fake", model: "fake", usage: {}, attempts: [] };
};

const started = Date.now();
const lesson = await createKnowledgeMapLesson({ source, topic: "Νόμος του Ωμ", language: "el", generate: fake });
const elapsed = Date.now() - started;
assert.ok(lesson.text.startsWith("Ακουστικό μάθημα"));
assert.ok(lesson.verification.units > 8, "test section must span several extraction batches");
assert.ok(maxInFlight > 1 && maxInFlight <= 4, `extraction must run in parallel (max 4), got ${maxInFlight}`);
assert.ok(elapsed < calls * 120, `parallel extraction should beat sequential time (${elapsed}ms for ${calls} calls)`);

// Past the deadline no new model call is started.
await assert.rejects(
  createKnowledgeMapLesson({ source, topic: "x", language: "el", generate: fake, deadlineAt: Date.now() - 1 }),
  /audio_deadline_exceeded/
);

// mapLimit keeps order.
assert.deepEqual(await mapLimit([3, 1, 2], 2, async (x) => { await new Promise((r) => setTimeout(r, x * 5)); return x * 10; }), [30, 10, 20]);

// Server: time budget + fast verified fallback for audio.
const summary = fs.readFileSync(new URL("../api/source-summary.js", import.meta.url), "utf8");
assert.match(summary, /AUDIO_LESSON_BUDGET_MS = \d+/);
assert.match(summary, /audio_deadline_exceeded/);
assert.match(summary, /explanation: false, audio: true/);

// Client: every AI Study request has a deadline and visible progress.
const html = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
assert.match(html, /async function timedFetch\(/);
assert.doesNotMatch(html.replace(/return await fetch\(url,\{\.\.\.opts,signal:ctl\.signal\}\)/, ""), /await fetch\('\/api\//, "AI Study requests must go through timedFetch");
assert.match(html, /clearInterval\(ticker\)/);
assert.match(html, /watchdog=setTimeout/, "speech playback must not hang when the browser drops onend");

console.log(`Audio lesson latency smoke passed: ${calls} calls, max ${maxInFlight} in flight, ${elapsed}ms; deadline + fallback + client timeouts present.`);
