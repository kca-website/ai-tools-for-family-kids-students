const CATALOG = require('../general-education-book-sections-2026-2027.js');
const { resolveOfficialSchoolbookSource } = require('./schoolbook-source');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store');
  const subject = String(req.query?.subject || '').trim();
  const live = String(req.query?.live || '') === '1';

  if (subject) {
    const row = CATALOG.get?.(subject);
    if (!row) return res.status(404).json({ error: 'subject_not_found' });
    const sections = Array.isArray(row.sections) ? row.sections : [];
    const exact = row.groundedSections || {};
    const base = {
      subject,
      schoolYear: CATALOG.schoolYear || '2026-2027',
      totalSections: sections.length,
      exactCatalogMapped: sections.filter(x => Object.prototype.hasOwnProperty.call(exact, x)).length,
      structureOnly: sections.filter(x => !Object.prototype.hasOwnProperty.call(exact, x)),
      exactCatalogSections: sections.filter(x => Object.prototype.hasOwnProperty.call(exact, x)),
    };
    if (!live) return res.status(200).json(base);

    const results = [];
    for (const topic of sections) {
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
    return res.status(200).json({
      ...base,
      liveChecked: true,
      runtimeGrounded: results.filter(x => x.ok).length,
      runtimeFailed: results.filter(x => !x.ok).length,
      results,
    });
  }

  const rows = (CATALOG.ids || []).map(id => {
    const row = CATALOG.get?.(id) || {};
    const sections = Array.isArray(row.sections) ? row.sections : [];
    const exact = row.groundedSections || {};
    const exactCount = sections.filter(x => Object.prototype.hasOwnProperty.call(exact, x)).length;
    const level = /-dimotikou$/i.test(id) ? 'primary' : /-gymnasiou$/i.test(id) ? 'middle' : /-lykeiou$/i.test(id) ? 'high' : 'other';
    return {
      subject: id,
      level,
      totalSections: sections.length,
      exactCatalogMapped: exactCount,
      structureOnlyCount: Math.max(0, sections.length - exactCount),
      policy: level === 'primary'
        ? (exactCount === sections.length && sections.length ? 'official-exact' : 'primary-ai-reviewed-allowed')
        : 'official-runtime-required'
    };
  });

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

  return res.status(200).json({
    generatedAt: new Date().toISOString(),
    schoolYear: CATALOG.schoolYear || '2026-2027',
    note: 'Catalog exact mappings are stronger evidence. Middle/high structure-only rows still require live runtime resolution and fail closed if grounding cannot be established. Primary structure-only rows may use AI-only mode with mandatory second-pass review.',
    summary,
    subjects: rows,
  });
};
