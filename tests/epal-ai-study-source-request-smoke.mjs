import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { chromium } from "playwright";

// AI Study → ΕΠΑΛ unit → /api/schoolbook-source request carries schoolType/grade/sector/specialty;
// grounded EPAL sources are shown as official, unmapped EPAL units fail closed, and ΓΕΛ requests
// keep their previous shape (no EPAL parameters).
const require = createRequire(import.meta.url);
const EPAL = require("../epal-schoolbook-catalog-2026-2027.js");
const BASE = "http://127.0.0.1:4173";

const sourceRequests = [];
const tutorRequests = [];
let nextSource = null;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route("**/api/schoolbook-source**", async (route) => {
    const url = new URL(route.request().url());
    sourceRequests.push(Object.fromEntries(url.searchParams));
    const body = nextSource || { grounded: true, schoolType: "epal", bookTitle: "ΦΥΣΙΚΗ", sourceUrl: "https://ebooks.edu.gr/ebooks/v/pdf/8547/4586/x/", text: "ΚΕΦΑΛΑΙΟ 2ο ΔΥΝΑΜΗ ΚΑΙ ΙΣΟΡΡΟΠΙΑ ".repeat(40) };
    await route.fulfill({ status: body.grounded ? 200 : 404, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.route("**/api/source-summary", async (route) => {
    tutorRequests.push({ ...JSON.parse(route.request().postData() || "{}"), via: "source-summary" });
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: "Επαληθευμένη σύνοψη από το επίσημο βιβλίο.", groundingValidated: true, sourceMode: "official_schoolbook" }) });
  });
  await page.route("**/api/tutor-assistant", async (route) => {
    if (route.request().method() !== "POST") return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    tutorRequests.push(JSON.parse(route.request().postData() || "{}"));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: "Εξήγηση από το επίσημο βιβλίο.", groundingValidated: true, sourceMode: "official_schoolbook" }) });
  });

  await page.goto(BASE + "/study.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !!window.AITOOLSKIDS_EPAL_STUDENT_CATALOG?.getSubjects);

  async function choose({ zone = "high", schoolType = "epal", grade, sector = "", specialty = "", subject, topic }) {
    await page.selectOption("#zone", zone);
    if (zone === "high") await page.selectOption("#schoolType", schoolType);
    await page.selectOption("#grade", grade);
    if (sector) await page.selectOption("#epalSector", sector);
    if (specialty) await page.selectOption("#epalSpecialty", specialty);
    await page.selectOption("#subject", subject);
    const value = await page.$eval("#topicPick", (el, label) => [...el.options].find((o) => o.dataset.label === label)?.value || "", topic);
    assert.ok(value, `topic option not found: ${topic}`);
    await page.selectOption("#topicPick", value);
  }
  async function explain() {
    await page.click('[data-action="explain"]');
    await page.waitForTimeout(1200);
  }

  // Α΄ ΕΠΑΛ — general subject.
  const physics = EPAL.getGroup("epal-a-physics");
  const physicsTopic = Object.keys(physics.units)[0];
  await choose({ grade: "a", subject: "epal-a-physics", topic: physicsTopic });
  await explain();
  let req = sourceRequests.at(-1);
  assert.equal(req.schoolType, "epal");
  assert.equal(req.grade, "a");
  assert.equal(req.subject, "epal-a-physics");
  assert.equal(req.topic, physicsTopic);
  assert.ok(!req.sector && !req.specialty);
  // The AI step receives only the EPAL unit identity; the server re-resolves the official text.
  assert.equal(tutorRequests.at(-1).via, "source-summary");
  assert.equal(tutorRequests.at(-1).subjectId, "epal-a-physics");
  assert.equal(tutorRequests.at(-1).topic, physicsTopic);
  assert.match(await page.textContent("#sourceEvidence"), /επίσημο σχολικό βιβλίο|επίσημη σχολική πηγή/);

  // Β΄ ΕΠΑΛ — sector subject.
  const bGroup = EPAL.groups.find((g) => g.grade === "b" && g.sectorIds.length === 1 && g.subjectIds.length === 1 && Object.keys(g.units).length);
  await choose({ grade: "b", sector: bGroup.sectorIds[0], subject: bGroup.subjectIds[0], topic: Object.keys(bGroup.units)[0] });
  await explain();
  req = sourceRequests.at(-1);
  assert.equal(req.grade, "b");
  assert.equal(req.sector, bGroup.sectorIds[0]);
  assert.equal(req.subject, bGroup.subjectIds[0]);

  // Γ΄ ΕΠΑΛ — specialty subject.
  const cGroup = EPAL.groups.find((g) => g.grade === "c" && g.specialtyIds.length === 1 && g.subjectIds.length === 1 && Object.keys(g.units).length);
  await choose({ grade: "c", specialty: cGroup.specialtyIds[0], subject: cGroup.subjectIds[0], topic: Object.keys(cGroup.units)[0] });
  await explain();
  req = sourceRequests.at(-1);
  assert.equal(req.grade, "c");
  assert.equal(req.specialty, cGroup.specialtyIds[0]);

  // Unmapped EPAL unit: fail closed, no AI call, no "official" label.
  const unmappedGroup = EPAL.groups.find((g) => g.grade === "a" && Object.values(g.unmapped).some((r) => !/^(?:free-text|not-a-unit)/.test(r)) && g.subjectIds.length === 1)
    || EPAL.groups.find((g) => Object.values(g.unmapped).some((r) => !/^(?:free-text|not-a-unit)/.test(r)) && g.subjectIds.length === 1 && !g.sectorIds.length && !g.specialtyIds.length);
  if (unmappedGroup) {
    const topic = Object.entries(unmappedGroup.unmapped).find(([, r]) => !/^(?:free-text|not-a-unit)/.test(r))[0];
    nextSource = { grounded: false, error: "epal_source_not_mapped" };
    const before = tutorRequests.length;
    await choose({ grade: unmappedGroup.grade, subject: unmappedGroup.subjectIds[0], topic });
    await explain();
    assert.equal(tutorRequests.length, before, "unmapped EPAL unit must not reach the AI");
    assert.doesNotMatch(await page.textContent("#sourceEvidence"), /Βασισμένο στο επίσημο/);
    assert.match(await page.textContent("#result"), /δεν έχει συνδεθεί ακόμη με την επίσημη σχολική πηγή/);
    nextSource = null;
  }

  // ΓΕΛ request keeps its previous shape.
  await page.selectOption("#zone", "high");
  await page.selectOption("#schoolType", "gel");
  await page.selectOption("#grade", "a");
  const gelSubject = await page.$eval("#subject", (el) => el.options[0]?.value || "");
  const gelTopic = await page.$eval("#topicPick", (el) => el.options[1]?.dataset.label || "");
  if (gelSubject && gelTopic) {
    await page.selectOption("#topicPick", { index: 1 });
    await explain();
    req = sourceRequests.at(-1);
    assert.equal(req.subject, gelSubject);
    assert.ok(!("schoolType" in req) && !("grade" in req), "ΓΕΛ source requests must not carry EPAL parameters");
  }

  console.log("EPAL AI Study source request smoke passed: A/B/C EPAL params, fail-closed unmapped unit, unchanged ΓΕΛ request.");
} finally {
  await browser.close();
}
