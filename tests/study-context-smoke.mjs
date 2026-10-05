import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const StudyContext = require("../study-context.js");

assert.equal(StudyContext.VERSION, 2);
assert.ok(StudyContext.SOURCE_POLICIES.includes("attachment_override"));
assert.ok(StudyContext.SOURCE_POLICIES.includes("official_required"));

const normalized = StudyContext.normalize({
  zoneId: "middle",
  roleId: "student",
  lang: "el",
  grade: "c",
  subject: "fysiki-g-gymnasiou",
  topic: "Νόμος του Ωμ",
  gapId: "physics-g-gym.ohms-law",
  learningMode: "understand",
  sourcePolicy: "official_required",
  documentContext: {
    kind: "user_upload",
    name: "notes.pdf",
    pagesRead: 3,
    totalPages: 5,
    truncated: false,
    text: "THIS MUST NEVER BE SERIALIZED"
  }
});

assert.equal(normalized.subject, "fysiki-g-gymnasiou");
assert.equal(normalized.sourcePolicy, "official_required");
assert.equal(normalized.documentContext.name, "notes.pdf");
assert.equal(Object.prototype.hasOwnProperty.call(normalized.documentContext, "text"), false);

assert.equal(StudyContext.resolveSourcePolicy({ hasAttachment: true, requiresOfficial: true }), "attachment_override");
assert.equal(StudyContext.resolveSourcePolicy({ requiresOfficial: true }), "official_required");
assert.equal(StudyContext.resolveSourcePolicy({ schoolLevel: "primary", requiresOfficial: true, hasCurriculumSelection: true }), "official_if_available");
assert.equal(StudyContext.resolveSourcePolicy({ schoolLevel: "middle", hasCurriculumSelection: true }), "official_required");
assert.equal(StudyContext.resolveSourcePolicy({ schoolLevel: "high", hasCurriculumSelection: true }), "official_required");
assert.equal(StudyContext.resolveSourcePolicy({ hasCurriculumSelection: true }), "official_if_available");
assert.equal(StudyContext.resolveSourcePolicy({}), "general_unverified");
assert.equal(StudyContext.resolveSourceMode({ policy: "official_if_available" }), "ai_fallback");
assert.equal(StudyContext.resolveSourceMode({ policy: "official_required" }), "unmapped_blocked");
assert.match(StudyContext.sourceModeLabel("ai_fallback", "el"), /AI βοήθεια προσαρμοσμένη/);

const fromQuery = StudyContext.fromSearchParams(
  "?zone=middle&role=guardian&grade=c&subject=biologia-g-gymnasiou&topic=biologia-g-gym.inheritance-both-parents&topicText=%CE%9A%CE%BB%CE%B7%CF%81%CE%BF%CE%BD%CE%BF%CE%BC%CE%B9%CE%BA%CF%8C%CF%84%CE%B7%CF%84%CE%B1&mode=review",
  { sourcePolicy: "official_if_available" }
);
assert.equal(fromQuery.zoneId, "middle");
assert.equal(fromQuery.roleId, "guardian");
assert.equal(fromQuery.grade, "c");
assert.equal(fromQuery.subject, "biologia-g-gymnasiou");
assert.equal(fromQuery.gapId, "biologia-g-gym.inheritance-both-parents");
assert.equal(fromQuery.topic, "Κληρονομικότητα");
assert.equal(fromQuery.learningMode, "review");

const params = StudyContext.toSearchParams(fromQuery);
assert.equal(params.get("subject"), "biologia-g-gymnasiou");
assert.equal(params.get("topic"), "biologia-g-gym.inheritance-both-parents");
assert.equal(params.get("mode"), "review");

const index = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const study = fs.readFileSync(new URL("../study.html", import.meta.url), "utf8");
const tutor = fs.readFileSync(new URL("../tutor.js", import.meta.url), "utf8");

assert.ok(index.indexOf('/study-context.js') >= 0);
assert.ok(index.indexOf('/study-context.js') < index.indexOf('/tutor.js'));
assert.match(study, /<script src="\/study-context\.js"><\/script>/);
assert.match(study, /studyContext:sharedStudyContext\('plan'\)/);
assert.match(study, /studyContext:sharedStudyContext\(action\)/);
assert.match(study, /'fysiki-g-gymnasiou'/);
assert.match(study, /'chimeia-g-gymnasiou'/);

assert.match(tutor, /function getSharedStudyContext\(\)/);
assert.match(tutor, /getStudyContext:\s*getSharedStudyContext/);
assert.match(tutor, /publishStudyContext:\s*publishSharedStudyContext/);
assert.match(tutor, /const sharedStudyContext = getSharedStudyContext\(\)/);
assert.match(tutor, /studyContext:\s*sharedStudyContext/);
assert.match(tutor, /documentKind:\s*attachedDocument\?\.text\s*\?\s*"user_upload"\s*:\s*\(groundedSource\?\.grounded\s*\?\s*"official_schoolbook"/);
assert.match(tutor, /documentSourceUrl:\s*groundedSource\?\.sourceUrl/);

console.log("Shared StudyContext contract checks passed.");
