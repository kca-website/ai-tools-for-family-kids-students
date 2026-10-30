// Phase 27 GEL AI Study evidence: static registry, real book text, AI Study and complete audio are independent gates.
// Does not activate unverified topics, change curricula or deploy content.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const inventory = require('../gel-schoolbook-source-map-2026-2027.js');
const manual = require('../gel-schoolbook-manual-overrides-2026-2027.js');
const phase25 = require('../gel-schoolbook-manual-overrides-phase25-2026-2027.js');
const availability = require('../secondary-grounding-availability-2026-2027.js');
const endpoint = require('../api/schoolbook-source.js');
const idx = (s, l) => s + '\n' + l;
const overrides = new Map([...manual.entries, ...phase25.entries].map(e => [idx(e.subjectId, e.label), e]));
const verdict = (state, reason = null, extra = {}) => ({ state, reason, ...extra });
const official = url => {
  try {
    const u = new URL(String(url || ''));
    return u.protocol === 'https:' && (u.hostname === 'ebooks.edu.gr' || u.hostname.endsWith('.ebooks.edu.gr')) &&
      u.pathname.startsWith('/ebooks/');
  } catch { return false; }
};
export function rowsFromCurrentCatalog() {
  const rows = [];
  for (const subject of Object.values(inventory.all())) {
    for (const topic of subject.topicMappings || []) {
      const override = overrides.get(idx(subject.subjectId, topic.label));
      const expected = (topic.status === 'exact-html' && topic.confidence === 'high') ||
        topic.status === 'exact-pdf' || !!override;
      const url = override?.url || override?.sources?.[0]?.url || topic.url || null;
      const actual = endpoint._test.resolveGelInventoryTopic(subject.subjectId, topic.label);
      const visible = availability.has(subject.subjectId, topic.label);
      const valid = expected && official(url) && visible && actual?.runtimeEligible === true;
      rows.push({
        subjectId: subject.subjectId, topicId: topic.topicId || null, topic: topic.label,
        sourceType: topic.status, sourceUrl: url,
        curriculum: verdict('unverified', 'topic-level IEP 2026-27 scope not independently rechecked'),
        mapping: expected
          ? verdict(valid ? 'passed' : 'failed', valid ? null : 'declared-mapping-disagrees-with-runtime-or-source')
          : verdict('unverified', topic.reason || 'requires exact official source'),
        retrieval: verdict('unverified', 'live source request not performed'),
        study: verdict('unverified', 'live AI Study request not performed'),
        audio: verdict('unverified', 'whole-section audio not checked'),
        checkedAt: null
      });
    }
  }
  return rows;
}
export function verifyRetrieval(httpStatus, body) {
  const text = String(body?.text || '').trim();
  const url = body?.sourceUrl || '';
  return httpStatus === 200 && body?.grounded === true && text.length >= 250 && official(url)
    ? verdict('passed', null, { httpStatus, textChars: text.length, sourceUrl: url })
    : verdict('failed', 'official-source-text-unavailable-or-invalid', {
      httpStatus, textChars: text.length, sourceUrl: url, error: body?.error || null });
}
export function verifyStudy(httpStatus, body) {
  const text = String(body?.text || '').trim();
  return httpStatus === 200 && body?.groundingValidated === true &&
    body?.sourceKind === 'official_schoolbook' && official(body?.sourceUrl) && text.length >= 20
    ? verdict('passed', null, { httpStatus, textChars: text.length })
    : verdict('failed', 'grounding-not-validated-in-ai-study', {
      httpStatus, textChars: text.length, error: body?.error || null });
}
export function verifyAudio(httpStatus, body) {
  const text = String(body?.text || '').trim();
  const v = body?.verification || {};
  // Source units parsed and selected core ideas actually reviewed are
  // separate concepts: a concise lesson should NOT repeat all textbook units.
  const complete = v.coverageBasis === 'selected-core-ideas' && v.coverageRatio === 1 &&
    Number.isInteger(v.units) && v.units > 0 &&
    v.sourceUnitsParsed === v.units &&
    Number.isInteger(v.unitsWithCoreEvidence) && v.unitsWithCoreEvidence >= 1 &&
    v.unitsWithCoreEvidence <= v.units &&
    Number.isInteger(v.ideasExtracted) && v.ideasExtracted >= 1 &&
    Number.isInteger(v.coreIdeas) && v.coreIdeas > 0 && v.coreIdeas <= v.ideasExtracted &&
    v.coreIdeasCovered === v.coreIdeas &&
    typeof v.sourceHash === 'string' && /^[a-f0-9]{64}$/.test(v.sourceHash);
  return httpStatus === 200 && body?.verified === true &&
    body?.wholeChapter === true && body?.mode === 'verified-knowledge-synthesis' &&
    complete && text.length >= 180
    ? verdict('passed', null, { httpStatus, textChars: text.length, coverageRatio: 1 })
    : verdict('failed', 'complete-verified-audio-summary-not-demonstrated', {
      httpStatus, textChars: text.length, coverageRatio: v.coverageRatio ?? null,
      error: body?.error || null });
}
export function summarize(rows) {
  const gates = {};
  for (const gate of ['curriculum','mapping','retrieval','study','audio']) {
    gates[gate] = { passed: 0, failed: 0, unverified: 0 };
    for (const row of rows) gates[gate][row[gate].state]++;
  }
  return {
    year: '2026-2027', scope: 'GEL inventory, 35 subjects',
    total: rows.length, gates,
    completeFivePointUat: rows.filter(r =>
      ['curriculum','mapping','retrieval','study','audio'].every(g => r[g].state === 'passed')).length
  };
}
async function request(url, opts = {}) {
  try {
    const response = await fetch(url, { ...opts, signal: AbortSignal.timeout(45000),
      headers: { Accept: 'application/json', ...(opts.headers || {}) } });
    const body = await response.json().catch(() => ({}));
    return { httpStatus: response.status, body };
  } catch (error) {
    return { httpStatus: 0, body: { error: String(error?.message || error) } };
  }
}
export async function runAudit(options = {}) {
  const rows = rowsFromCurrentCatalog();
  const base = String(options.base || 'https://www.aitools4kids.gr').replace(/\/+$/, '');
  if (options.subject && !rows.some(r => r.subjectId === options.subject))
    throw new Error('Unknown subject: ' + options.subject);
  const selected = rows.filter(r => r.mapping.state === 'passed' && (!options.subject || r.subjectId === options.subject));
  const limit = options.limit === 'all' ? selected.length : Math.max(0, Number(options.limit ?? 3));
  const targets = selected.slice(0, limit);
  if (options.live) {
    for (const row of targets) {
      row.checkedAt = new Date().toISOString();
      const retrieved = await request(base + '/api/schoolbook-source?subject=' +
        encodeURIComponent(row.subjectId) + '&topic=' + encodeURIComponent(row.topic), {
        headers: { 'Cache-Control': 'no-cache' } });
      row.retrieval = verifyRetrieval(retrieved.httpStatus, retrieved.body);
      if (row.retrieval.state !== 'passed') continue;
      if (options.study) {
        const result = await request(base + '/api/tutor-assistant', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: 'AI Study per-unit validation with exact official schoolbook.',
            prompt: 'Εξήγησε την ενότητα μόνο από το επίσημο βιβλίο.',
            audience: 'study_user', task: 'conversation', mode: 'understand', activity: 'explain',
            cacheEligible: false, subjectId: row.subjectId, topic: row.topic,
            studyContext: { sourcePolicy: 'official_required', studyAction: 'explain' },
            documentKind: 'official_schoolbook',
            documentName: retrieved.body.bookTitle || '',
            documentSourceUrl: retrieved.body.sourceUrl || ''
          })
        });
        row.study = verifyStudy(result.httpStatus, result.body);
      }
      if (options.audio) {
        const result = await request(base + '/api/source-summary', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subjectId: row.subjectId, topic: row.topic,
            language: 'el', activity: 'audio' })
        });
        row.audio = verifyAudio(result.httpStatus, result.body);
      }
    }
  }
  const report = {
    timestamp: new Date().toISOString(), currentMainBaseline: '296f7aad531f7ababd183facae737be2e40261d2',
    requested: { live: !!options.live, study: !!options.study, audio: !!options.audio,
      subject: options.subject || null, checked: options.live ? targets.length : 0 },
    summary: summarize(rows), rows
  };
  return report;
}
function cli(raw) {
  const options = { live:false, study:false, audio:false, limit:3 };
  for (const arg of raw) {
    if (arg === '--live') options.live = true;
    else if (arg === '--study') { options.live = true; options.study = true; }
    else if (arg === '--audio') { options.live = true; options.audio = true; }
    else if (arg.startsWith('--subject=')) options.subject = arg.slice(10);
    else if (arg.startsWith('--base=')) options.base = arg.slice(7);
    else if (arg.startsWith('--output=')) options.output = arg.slice(9);
    else if (arg.startsWith('--limit=')) {
      const value = arg.slice(8);
      if (value !== 'all' && !/^\d+$/.test(value)) throw new Error('Invalid --limit');
      options.limit = value === 'all' ? 'all' : Number(value);
    } else throw new Error('Unknown argument: ' + arg);
  }
  return options;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = cli(process.argv.slice(2));
    const report = await runAudit(options);
    if (options.output) {
      const path = resolve(options.output);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, JSON.stringify(report, null, 2) + '\n');
    }
    console.log(JSON.stringify({ requested: report.requested, summary: report.summary,
      pending: Object.fromEntries([...new Set(report.rows.map(r => r.subjectId))]
        .map(s => [s, report.rows.filter(r => r.subjectId === s &&
          r.mapping.state === 'unverified').map(r => r.topic)])
        .filter(([,t]) => t.length)) }, null, 2));
  } catch (error) { console.error(error); process.exitCode = 1; }
}
