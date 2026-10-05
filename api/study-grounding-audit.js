const CATALOG = require('../general-education-book-sections-2026-2027.js');
const AVAILABILITY = require('../secondary-grounding-availability-2026-2027.js');
const { resolveOfficialSchoolbookSource } = require('./schoolbook-source');

// Only mappings that still fail production source extraction remain hidden.
const RUNTIME_BLOCKED_SECONDARY_SUBJECTS = new Set([]);
const RUNTIME_BLOCKED_SECONDARY_TOPICS = new Map([
  ['english-b-lykeiou', new Set(['Unit 5: Addictions'])],
  ['oikonomia-g-lykeiou', new Set(['Διεθνές εμπόριο και οικονομικές σχέσεις'])]
]);

function rawVisibleSectionsFor(subject) {
  return Array.isArray(AVAILABILITY.subjects?.[subject]) ? AVAILABILITY.subjects[subject] : [];
}

function visibleSectionsFor(subject) {
  const sid = String(subject || '');
  if (RUNTIME_BLOCKED_SECONDARY_SUBJECTS.has(sid)) return [];
  const blocked = RUNTIME_BLOCKED_SECONDARY_TOPICS.get(sid);
  return rawVisibleSectionsFor(sid).filter(label => !blocked?.has(String(label || '').trim()));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store');
  const subject = String(req.query?.subject || '').trim();
  const subjects = String(req.query?.subjects || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 8);
  const live = String(req.query?.live || '') === '1';
  const compact = String(req.query?.compact || '') === '1';

  if (subjects.length) {
    const audits = [];
    for (const id of subjects) audits.push(await auditSubject(id, live, compact));
    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      liveChecked: live,
      subjects: audits,
      totals: {
        totalSections: audits.reduce((n,x)=>n+(x.totalSections||0),0),
        exactCatalogMapped: audits.reduce((n,x)=>n+(x.exactCatalogMapped||0),0),
        visibleVerified: audits.reduce((n,x)=>n+(x.visibleVerified||0),0),
        runtimeGrounded: audits.reduce((n,x)=>n+(x.runtimeGrounded||0),0),
        runtimeFailed: audits.reduce((n,x)=>n+(x.runtimeFailed||0),0),
      }
    });
  }

  if (subject) {
    const audit = await auditSubject(subject, live, compact);
    if (audit.error === 'subject_not_found') return res.status(404).json(audit);
    return res.status(200).json(audit);
  }

  const rows = catalogRows();
  const summary = ['primary','middle','high','other'].reduce((acc, level) => {
    const subset = rows.filter(x => x.level === level);
    acc[level] = {
      subjects: subset.length,
      totalSections: subset.reduce((n,x)=>n+x.totalSections,0),
      exactCatalogMapped: subset.reduce((n,x)=>n+x.exactCatalogMapped,0),
      structureOnly: subset.reduce((n,x)=>n+x.structureOnlyCount,0),
    };
    return acc;
  }, {});

  const secondaryVisibleSubjects = Object.keys(AVAILABILITY.subjects || {})
    .filter(id => visibleSectionsFor(id).length > 0);
  const secondaryVisibleTopics = secondaryVisibleSubjects.reduce((n,id)=>n+visibleSectionsFor(id).length,0);

  return res.status(200).json({
    generatedAt: new Date().toISOString(),
    schoolYear: CATALOG.schoolYear || AVAILABILITY.schoolYear || '2026-2027',
    note: 'Catalog exact mappings describe the general-book catalog only. secondaryVisibleVerified is the effective learner-facing allow-list for Gymnasium/GEL after runtime safety blocks: only runtime-consumable official-source topics are exposed in AI Study. Primary structure-only rows may use AI-only mode with mandatory second-pass review.',
    summary,
    secondaryVisibleVerified: {
      subjects: secondaryVisibleSubjects.length,
      topics: secondaryVisibleTopics,
      runtimeBlockedSubjects: [...RUNTIME_BLOCKED_SECONDARY_SUBJECTS],
      runtimeBlockedTopics: Object.fromEntries([...RUNTIME_BLOCKED_SECONDARY_TOPICS].map(([id,labels])=>[id,[...labels]])),
      policy: 'official-source-only-fail-closed'
    },
    subjects: rows,
  });
};

function catalogRows() {
  return (CATALOG.ids || []).map(id => {
    const row = CATALOG.get?.(id) || {};
    const sections = Array.isArray(row.sections) ? row.sections : [];
    const exact = row.groundedSections || {};
    const exactCount = sections.filter(x => Object.prototype.hasOwnProperty.call(exact, x)).length;
    const level = /-dimotikou$/i.test(id) ? 'primary' : /-gymnasiou$/i.test(id) ? 'middle' : /-lykeiou$/i.test(id) ? 'high' : 'other';
    const visibleVerified = visibleSectionsFor(id).length;
    return {
      subject: id,
      level,
      totalSections: sections.length,
      exactCatalogMapped: exactCount,
      structureOnlyCount: Math.max(0, sections.length - exactCount),
      visibleVerified,
      runtimeBlocked: RUNTIME_BLOCKED_SECONDARY_SUBJECTS.has(id),
      runtimeBlockedTopics: Math.max(0, rawVisibleSectionsFor(id).length-visibleVerified),
      policy: level === 'primary'
        ? (exactCount === sections.length && sections.length ? 'official-exact' : 'primary-ai-reviewed-allowed')
        : 'official-runtime-required'
    };
  });
}

function sectionsForSubject(subject) {
  const row = CATALOG.get?.(subject);
  const catalogSections = Array.isArray(row?.sections) ? row.sections : [];
  const visibleSections = visibleSectionsFor(subject);
  const rawVisibleSections = rawVisibleSectionsFor(subject);
  if (catalogSections.length) return { row, sections: catalogSections, source: 'general-book-catalog', visibleSections, rawVisibleSections };
  if (rawVisibleSections.length) return { row: null, sections: rawVisibleSections, source: 'secondary-visible-verified', visibleSections, rawVisibleSections };
  return null;
}

async function auditSubject(subject, live, compact) {
  const resolvedSubject = sectionsForSubject(subject);
  if (!resolvedSubject) return { subject, error: 'subject_not_found' };
  const { row, sections, source, visibleSections, rawVisibleSections } = resolvedSubject;
  const exact = row?.groundedSections || {};
  const exactCatalogSections = row ? sections.filter(x => Object.prototype.hasOwnProperty.call(exact, x)) : [];
  const runtimeBlocked = RUNTIME_BLOCKED_SECONDARY_SUBJECTS.has(subject);
  const blockedVerifiedMappings = Math.max(0, rawVisibleSections.length-visibleSections.length);
  const base = {
    subject,
    schoolYear: CATALOG.schoolYear || AVAILABILITY.schoolYear || '2026-2027',
    auditSource: source,
    totalSections: sections.length,
    exactCatalogMapped: exactCatalogSections.length,
    visibleVerified: visibleSections.length,
    runtimeBlocked,
    blockedVerifiedMappings,
    structureOnly: compact || !row ? undefined : sections.filter(x => !Object.prototype.hasOwnProperty.call(exact, x)),
    exactCatalogSections: compact || !row ? undefined : exactCatalogSections,
    visibleVerifiedSections: compact ? undefined : visibleSections,
  };
  if (!live || runtimeBlocked || !visibleSections.length) return clean({ ...base, liveChecked: live, runtimeChecked: 0, runtimeGrounded: 0, runtimeFailed: 0, failures: [] });

  const topicsToCheck = visibleSections;
  const results = [];
  for (const topic of topicsToCheck) {
    try {
      const resolved = await resolveOfficialSchoolbookSource(subject, topic, { purpose: '' });
      results.push({
        topic,
        ok: !!(resolved?.ok && resolved?.body?.grounded && resolved?.body?.text),
        status: Number(resolved?.status || 0),
        error: resolved?.body?.error || null,
        sourceUrl: resolved?.body?.sourceUrl || null,
        textChars: String(resolved?.body?.text || '').length,
      });
    } catch (err) {
      results.push({ topic, ok: false, status: 500, error: String(err?.message || err) });
    }
  }
  const failed = results.filter(x => !x.ok);
  return clean({
    ...base,
    liveChecked: true,
    runtimeChecked: results.length,
    runtimeGrounded: results.length - failed.length,
    runtimeFailed: failed.length,
    failures: failed,
    results: compact ? undefined : results,
  });
}

function clean(value) {
  return Object.fromEntries(Object.entries(value).filter(([,v]) => v !== undefined));
}