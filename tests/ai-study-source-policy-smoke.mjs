import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const routerPath = require.resolve('../ai-provider-router.js');
const cachePath = require.resolve('../study-runtime-cache.js');
const sourcePath = require.resolve('../api/schoolbook-source.js');
const handlerPath = require.resolve('../api/tutor-assistant.js');
const saved = [routerPath, cachePath, sourcePath, handlerPath].map(path => require.cache[path]);
const generatedMessages = [];

require.cache[routerPath] = { exports: {
  getAiStatus: () => ({ configured: true, model: 'policy-test-model', providers: [] }),
  generateChat: async ({ messages }) => {
    generatedMessages.push(messages);
    return { ok: true, text: 'Το νερό είναι μέρος της ενότητας.', model: 'policy-test-model', provider: 'test', usage: {} };
  },
} };
require.cache[cachePath] = { exports: {
  getStudyCache: async () => null,
  setStudyCache: async () => {},
} };
require.cache[sourcePath] = { exports: {
  resolveOfficialSchoolbookSource: async (subjectId) => subjectId === 'missing-source' ? ({
    ok: false,
    status: 404,
    body: { error: 'section_not_resolved' },
  }) : ({
    ok: true,
    status: 200,
    body: {
      grounded: true,
      text: 'Το νερό είναι μέρος της ενότητας.',
      bookTitle: 'Επίσημο σχολικό βιβλίο δοκιμής',
      sourceUrl: 'https://ebooks.edu.gr/test',
    },
  }),
} };
delete require.cache[handlerPath];

function requestBody(zoneId, overrides = {}) {
  return {
    context: 'Age-appropriate study action.',
    prompt: 'Εξήγησε το επιλεγμένο θέμα.',
    audience: 'study_user',
    task: 'conversation',
    mode: 'understand',
    activity: 'explain',
    grade: zoneId === 'primary' ? 'Ε΄ Δημοτικού' : (zoneId === 'middle' ? 'Β΄ Γυμνασίου' : 'Α΄ Λυκείου'),
    subject: 'Δοκιμαστικό μάθημα',
    subjectId: 'test-subject',
    topic: 'Η επιλεγμένη ενότητα',
    studyContext: { zoneId, lang: 'el', sourcePolicy: zoneId === 'primary' ? 'official_if_available' : 'official_required' },
    documentText: '',
    documentKind: '',
    ...overrides,
  };
}

async function call(body) {
  let code = 0;
  let json = null;
  const res = {
    setHeader() {},
    status(value) { code = value; return this; },
    json(value) { json = value; return value; },
  };
  const handler = require('../api/tutor-assistant.js');
  await handler({ method: 'POST', headers: { 'content-type': 'application/json' }, body }, res);
  return { code, body: json };
}

try {
  // A. Primary + verified official source.
  const primaryOfficial = await call(requestBody('primary', { documentKind: 'official_schoolbook' }));
  assert.equal(primaryOfficial.code, 200);
  assert.equal(primaryOfficial.body.sourceMode, 'official_schoolbook');
  assert.equal(primaryOfficial.body.groundingValidated, true);

  // B. Primary + no official source: generate with scoped AI fallback, never block.
  const primaryFallback = await call(requestBody('primary'));
  assert.equal(primaryFallback.code, 200);
  assert.equal(primaryFallback.body.sourceMode, 'ai_fallback');
  assert.match(primaryFallback.body.sourceLabel, /AI βοήθεια προσαρμοσμένη/);
  assert.match(generatedMessages.at(-1)[0].content, /PRIMARY AI FALLBACK POLICY/);
  assert.match(generatedMessages.at(-1)[0].content, /Never say or imply “according to the schoolbook”/);

  const primaryStaleOfficial = await call(requestBody('primary', { subjectId: 'missing-source', documentKind: 'official_schoolbook', documentText: 'UNTRUSTED CLIENT SOURCE' }));
  assert.equal(primaryStaleOfficial.code, 200);
  assert.equal(primaryStaleOfficial.body.sourceMode, 'ai_fallback');
  assert.doesNotMatch(generatedMessages.at(-1)[1].content, /UNTRUSTED CLIENT SOURCE/);

  // C. Gymnasium + verified official source.
  const middleOfficial = await call(requestBody('middle', { documentKind: 'official_schoolbook' }));
  assert.equal(middleOfficial.code, 200);
  assert.equal(middleOfficial.body.sourceMode, 'official_schoolbook');

  // D/E. Gymnasium and Lyceum remain fail-closed with the friendly shared message.
  for (const zoneId of ['middle', 'high']) {
    const blocked = await call(requestBody(zoneId));
    assert.equal(blocked.code, 422);
    assert.equal(blocked.body.error, 'official_source_required');
    assert.match(blocked.body.message, /δεν έχει συνδεθεί ακόμη/);
    assert.doesNotMatch(blocked.body.message, /γενική γνώση ως υποκατάστατο/);
  }

  // F. Three distinct AI Study actions all pass through the same server policy.
  for (const row of [
    { task: 'conversation', activity: 'explain' },
    { task: 'guided_task', activity: 'audio' },
    { task: 'quiz', activity: 'quiz', mode: 'challenge' },
  ]) {
    const result = await call(requestBody('primary', row));
    assert.equal(result.code, 200, row.activity);
    assert.equal(result.body.sourceMode, 'ai_fallback', row.activity);
  }
} finally {
  [routerPath, cachePath, sourcePath, handlerPath].forEach((path, index) => {
    if (saved[index]) require.cache[path] = saved[index];
    else delete require.cache[path];
  });
}

console.log('AI Study central source policy: primary official/fallback, secondary fail-closed, and 3 actions passed.');
