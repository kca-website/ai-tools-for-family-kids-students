import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const gel = require('../gel-schoolbook-source-map-2026-2027.js');
const overrides = require('../gel-schoolbook-manual-overrides-2026-2027.js');
const phase25 = require('../gel-schoolbook-manual-overrides-phase25-2026-2027.js');
const primary = require('../general-education-book-sections-2026-2027.js');

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
  const rows = Object.values(primary.all ? primary.all() : {})
    .filter((row) => /dimotikou/i.test(String(row?.sourceUrl || '')));

  let grounded = 0;
  let total = 0;
  const subjects = [];
  const missing = [];

  rows.forEach((row, index) => {
    const subjectId = row.id || row.subjectId || `primary-catalog-row-${index + 1}`;
    const sections = Array.isArray(row.sections) ? row.sections : [];
    const groundedSections = row.groundedSections || {};
    let subjectGrounded = 0;
    const subjectMissing = [];

    for (const label of sections) {
      total++;
      const source = groundedSections[label];
      const isOfficialHtml = source && /^https:\/\/[^/]*ebooks\.edu\.gr\/ebooks\/v\/html\//i.test(String(source));
      if (isOfficialHtml) {
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
  });

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

const report = {
  generatedAt: new Date().toISOString(),
  schoolYear: '2026-2027',
  primary: primaryReport(),
  gel: gelReport()
};

console.log(JSON.stringify(report, null, 2));
