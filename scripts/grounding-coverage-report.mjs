import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const gel = require('../gel-schoolbook-source-map-2026-2027.js');
const overrides = require('../gel-schoolbook-manual-overrides-2026-2027.js');
const phase25 = require('../gel-schoolbook-manual-overrides-phase25-2026-2027.js');
const primary = require('../general-education-book-sections-2026-2027.js');
const primaryComplete = require('../primary-schoolbook-complete-sources-2026-2027.js');
const epal = require('../epal-schoolbook-catalog-2026-2027.js');
const gymnasium = require('../gymnasium-book-sections-2026-2027.js');
const availability = require('../secondary-grounding-availability-2026-2027.js');
const gelEnglish = require('../gel-english-official-pdf-units-2026-2027.js');
const special = require('../special-education-book-sections-2026-2027.js');

// ΕΠΑΛ: dedicated EPAL_BOOK_CATALOG (see scripts/epal/validate-epal-schoolbook-catalog.mjs for the
// full AI Study ↔ catalog validation).
function epalReport() {
  const units = { mapped: 0, unmapped: 0 };
  const unmappedByReason = {};
  for (const group of epal.groups) {
    units.mapped += Object.keys(group.units).length;
    for (const reason of Object.values(group.unmapped)) {
      if (/^(?:free-text-input|not-a-unit)/.test(reason)) continue;
      units.unmapped += 1;
      unmappedByReason[reason] = (unmappedByReason[reason] || 0) + 1;
    }
  }
  return {
    generatedAt: epal.generatedAt,
    subjects: epal.groups.length,
    books: Object.keys(epal.books).length,
    total: units.mapped + units.unmapped,
    grounded: units.mapped,
    pending: units.unmapped,
    unmappedByReason
  };
}

function gelReport() {
  const overridden = new Set(
    [...(overrides.entries || []), ...(phase25.entries || [])].map((entry) => `${entry.subjectId}\n${entry.label}`)
  );

  const rows = [];
  let total = 0;
  let grounded = 0;
  let noSafe = 0;

  for (const subject of Object.values(gel.all())) {
    const pending = [];
    let subjectGrounded = 0;
    let subjectTotal = 0;

    for (const topic of subject.topicMappings || []) {
      total++;
      subjectTotal++;
      const key = `${subject.subjectId}\n${topic.label}`;
      const isGrounded =
        (topic.status === 'exact-html' && topic.confidence === 'high') ||
        topic.status === 'exact-pdf' ||
        overridden.has(key);

      if (isGrounded) {
        grounded++;
        subjectGrounded++;
        continue;
      }

      if (topic.status === 'no-safe-mapping') noSafe++;
      pending.push({
        label: topic.label,
        status: topic.status,
        reason: topic.reason || '',
        candidates: Array.isArray(topic.candidates)
          ? topic.candidates.map((candidate) => ({
              heading: candidate.heading || '',
              url: candidate.url || '',
              score: candidate.score ?? null
            }))
          : []
      });
    }

    if (pending.length) {
      rows.push({
        subjectId: subject.subjectId,
        subject: subject.labelEl || subject.subjectId,
        grounded: subjectGrounded,
        total: subjectTotal,
        pending
      });
    }
  }

  return {
    grounded,
    total,
    pending: total - grounded,
    noSafe,
    safeBacklog: total - grounded - noSafe,
    subjectsWithPending: rows
  };
}

function primaryReport() {
  const ids = Array.isArray(primary.ids)
    ? primary.ids.filter((subjectId) => /-dimotikou$/.test(subjectId))
    : [];

  let grounded = 0;
  let total = 0;
  const subjects = [];
  const missing = [];

  for (const subjectId of ids) {
    const row = primary.get(subjectId);
    if (!row) continue;
    const sections = Array.isArray(row.sections) ? row.sections : [];
    const groundedSections = row.groundedSections || {};
    let subjectGrounded = 0;
    const subjectMissing = [];

    for (const label of sections) {
      total++;
      const source = groundedSections[label];
      const isOfficialHtml = source && /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i.test(String(source));
      const completeBundle = primaryComplete.get(subjectId, label);
      const isCompleteBundle = !!completeBundle?.urls?.length && completeBundle.urls.every((url) =>
        /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i.test(String(url))
      );
      if (isOfficialHtml || isCompleteBundle) {
        grounded++;
        subjectGrounded++;
      } else {
        const gap = {
          subjectId,
          label,
          reason: source ? 'grounded-source-is-not-official-ebooks-html' : 'section-has-no-exact-grounded-source',
          bookSource: row.sourceUrl || null,
          annualScopeVerified: row.annualScopeVerified === true
        };
        subjectMissing.push(gap);
        missing.push(gap);
      }
    }

    subjects.push({
      subjectId,
      grounded: subjectGrounded,
      total: sections.length,
      pending: sections.length - subjectGrounded,
      annualScopeVerified: row.annualScopeVerified === true,
      mappingStatus: row.mappingStatus || row.groundingStatus || null,
      missing: subjectMissing
    });
  }

  return {
    grounded,
    total,
    pending: total - grounded,
    subjects: subjects.length,
    fullyGroundedSubjects: subjects.filter((row) => row.total > 0 && row.pending === 0).length,
    subjectsWithPending: subjects.filter((row) => row.pending > 0),
    missing
  };
}

// Static integrity is only a prerequisite for runtime grounding. The live endpoint
// /api/study-grounding-audit?subject=...&live=1 confirms that official content
// actually extracts successfully. Never count a catalog label as a retrieved text.
function secondaryIntegrityReport() {
  const overrideKeys = new Set(
    [...(overrides.entries || []), ...(phase25.entries || [])]
      .map(row => `${row.subjectId}\n${row.label}`)
  );
  const declaredMismatch = [];
  const duplicateLabels = [];
  let gelExpected = 0;
  for (const subject of Object.values(gel.all())) {
    const seen = new Set();
    for (const topic of subject.topicMappings || []) {
      const key = `${subject.subjectId}\n${topic.label}`;
      if (seen.has(topic.label)) duplicateLabels.push({ subjectId:subject.subjectId, label:topic.label });
      seen.add(topic.label);
      const expected = (topic.status === 'exact-html' && topic.confidence === 'high') ||
        topic.status === 'exact-pdf' || overrideKeys.has(key);
      if (expected) gelExpected++;
      const visible = availability.has(subject.subjectId,topic.label);
      if (expected !== visible) declaredMismatch.push({ subjectId:subject.subjectId, label:topic.label, expected, visible });
    }
  }
  const bySchoolLevel = {
    gymnasium: { subjects:0, advertisedTopics:0 },
    gel: { subjects:0, advertisedTopics:0 }
  };
  for (const [id,labels] of Object.entries(availability.subjects || {})) {
    const level = /-gymnasiou$/i.test(id) ? 'gymnasium' : 'gel';
    bySchoolLevel[level].subjects++;
    bySchoolLevel[level].advertisedTopics += labels.length;
  }
  const gymnasiumTableMissing = [];
  for (const id of Object.keys(gymnasium.subjects || {})) {
    for (const topic of gymnasium.labels(id)) {
      if (!availability.has(id,topic)) gymnasiumTableMissing.push({ subjectId:id, topic });
    }
  }
  for (const id of Object.keys(gymnasium.pdfSubjects || {})) {
    for (const topic of gymnasium.labels(id)) {
      if (!availability.has(id,topic)) gymnasiumTableMissing.push({ subjectId:id, topic });
    }
  }
  const catalogGymnasium = {
    subjects:0, totalSections:0, advertisedSections:0, notAdvertised:[]
  };
  for (const id of primary.ids || []) {
    if (!/-gymnasiou$/i.test(id)) continue;
    const row=primary.get(id);
    const sections=row?.sections || [];
    catalogGymnasium.subjects++;
    catalogGymnasium.totalSections += sections.length;
    for (const label of sections) {
      if (availability.has(id,label)) catalogGymnasium.advertisedSections++;
      else catalogGymnasium.notAdvertised.push({ subjectId:id, label });
    }
  }
  return {
    policy: 'official-source-required; runtime extraction must be verified separately',
    bySchoolLevel,
    gelInventoryExactOrManuallyReviewed:gelExpected,
    gelInventoryVsLearnerManifest:declaredMismatch,
    duplicateGelLabels:duplicateLabels,
    gymnasiumExplicitTableNotAdvertised:gymnasiumTableMissing,
    gymnasiumGeneralCatalog:catalogGymnasium,
    requiresLiveValidation:true
  };
}

function additionalCoverage(){
 const english=[],specialMissing=[];
 for(const id of Object.keys(gelEnglish.subjects))for(const label of gelEnglish.labels(id)){
  const a=gelEnglish.pdfFor(id,label);
  if(!a||!Number.isInteger(a.pdfPage)||!Number.isInteger(a.pdfPageEnd)||
    a.pdfPageEnd<a.pdfPage||a.pdfPageEnd-a.pdfPage>40||!availability.has(id,label))english.push({id,label});
 }
 for(const [id,row] of Object.entries(special.subjects))for(const [label,pages] of (row.units||[])){
  if(!Array.isArray(pages)||!pages.length||!special.get(id,label))specialMissing.push({id,label});
 }
 return {english:{subjects:Object.keys(gelEnglish.subjects).length,units:Object.values(gelEnglish.subjects).reduce((n,x)=>n+x.units.length,0),invalid:english},
 special:{subjects:Object.keys(special.subjects).length,units:Object.values(special.subjects).reduce((n,x)=>n+x.units.length,0),invalid:specialMissing}};
}
const report = {
  generatedAt: new Date().toISOString(),
  schoolYear: '2026-2027',
  primary: primaryReport(),
  gel: gelReport(),
  epal: epalReport(),
  secondary: secondaryIntegrityReport(),
  otherSchoolbooks: additionalCoverage()
};

console.log(JSON.stringify(report, null, 2));
if (process.argv.includes('--strict')) {
  const secondary = report.secondary;
  if (secondary.gelInventoryVsLearnerManifest.length ||
      secondary.duplicateGelLabels.length ||
      secondary.gymnasiumExplicitTableNotAdvertised.length ||
      report.otherSchoolbooks.english.invalid.length ||
      report.otherSchoolbooks.special.invalid.length) process.exitCode = 1;
}
