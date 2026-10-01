import assert from "node:assert/strict";

// Production gate: all learner-facing actions must return a usable grounded result.
const BASE = process.env.AITOOLSKIDS_PROD_BASE || "https://www.aitools4kids.gr";
const subjectId = "istoria-b-gymnasiou";
const topic = "Κεφάλαιο 1 · Ι · 1 — Από τη Ρώμη στη Νέα Ρώμη";

async function getJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let body = {};
  try { body = JSON.parse(text); } catch (_) {}
  return { res, body, text };
}

const source = await getJson(
  BASE + "/api/schoolbook-source?subject=" + encodeURIComponent(subjectId) + "&topic=" + encodeURIComponent(topic),
  { headers: { "Accept": "application/json", "Cache-Control": "no-cache" } }
);
assert.equal(source.res.status, 200, "official source endpoint must return 200");
assert.equal(source.body?.grounded, true, "official source must be grounded");
assert.ok(String(source.body?.text || "").length > 1000, "official source text must be substantial");

const cases = [
  { action:"audio", task:"guided_task", mode:"understand", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"flashcards", task:"flashcards", mode:"review", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"quiz", task:"conversation", mode:"challenge", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"truefalse", task:"conversation", mode:"challenge", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"explain", task:"conversation", mode:"understand", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"quickreview", task:"guided_task", mode:"review", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"oral", task:"conversation", mode:"challenge", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"written", task:"conversation", mode:"challenge", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"weakspots", task:"conversation", mode:"challenge", prompt:"Ξεκίνα τώρα αυτή τη δραστηριότητα μελέτης." },
  { action:"plan", task:"study_plan", mode:"organize", prompt:"Φτιάξε συγκεκριμένο πλάνο μελέτης για 20 λεπτά." }
];

const results = [];
const failures = [];
for (const c of cases) {
  let last = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    last = await getJson(BASE + "/api/tutor-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        context: "Production smoke test. Return a normal learner-facing result for the requested activity.",
        prompt: c.prompt,
        audience: "study_user",
        task: c.task,
        mode: c.mode,
        activity: c.action,
        cacheEligible: false,
        grade: "Β΄",
        subject: "Ιστορία",
        subjectId,
        topic,
        studyContext: { sourcePolicy: "official_required", studyAction: c.action },
        documentKind: "official_schoolbook",
        documentName: source.body.bookTitle || "",
        documentSourceUrl: source.body.sourceUrl || ""
      })
    });
    if (last.res.ok) break;
    if (attempt === 0 && [429, 502, 503, 504].includes(last.res.status)) {
      await new Promise(r => setTimeout(r, 1500));
      continue;
    }
    break;
  }

  try {
    assert.ok(last, c.action + ": no response");
    assert.equal(last.res.status, 200, c.action + ": expected 200, got " + last.res.status + " " + (last.body?.error || "") + " " + (last.body?.message || ""));
    assert.ok(String(last.body?.text || "").trim().length >= 20, c.action + ": empty/too short output");
    assert.equal(last.body?.groundingValidated, true, c.action + ": grounding must be validated");

    if (c.action === "flashcards") {
      const parsed = JSON.parse(String(last.body.text).replace(/^\`\`\`(?:json)?\s*/i,"").replace(/\s*\`\`\`$/,""));
      assert.equal(parsed.cards?.length, 8, "flashcards: expected exactly 8 cards");
    }
    if (c.action === "plan") {
      const parsed = JSON.parse(String(last.body.text).replace(/^\`\`\`(?:json)?\s*/i,"").replace(/\s*\`\`\`$/,""));
      assert.ok(Array.isArray(parsed.steps) && parsed.steps.length >= 3, "plan: expected at least 3 steps");
    }
  } catch (err) {
    failures.push(c.action + ": " + err.message);
  }

  results.push({
    action: c.action,
    status: last?.res?.status || 0,
    error: last?.body?.error || "",
    provider: last?.body?.provider || "",
    model: last?.body?.model || "",
    chars: String(last?.body?.text || "").length,
    groundingValidated: last?.body?.groundingValidated === true
  });
}

console.table(results);
if (failures.length) {
  console.error("\nAI Study production E2E failures:");
  failures.forEach(x => console.error("- " + x));
  process.exitCode = 1;
} else {
  console.log("AI Study production E2E passed for all 10 learner actions.");
}
