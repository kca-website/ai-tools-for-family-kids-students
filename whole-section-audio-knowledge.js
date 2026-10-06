const { createHash } = require('node:crypto');
const { generateChat, getAiStatus } = require('./ai-provider-router');
const { sourceUnits, sourceSentences } = require('./whole-section-audio');

const VERSION = 'whole-section-knowledge-v1';

function parseJson(text) {
  try { return JSON.parse(String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')); }
  catch { return null; }
}

function clean(value, max = 1600) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function knownSentenceIds(units) {
  const map = new Map();
  for (const unit of units) {
    for (const row of sourceSentences(unit)) map.set(row.id, row.text);
  }
  return map;
}

function validIdeas(text, units) {
  const parsed = parseJson(text);
  if (!Array.isArray(parsed?.ideas)) return false;
  const known = knownSentenceIds(units);
  const allowedTypes = new Set(['definition','relationship','cause','process','event','formula','principle','fact']);
  const allowedImportance = new Set(['core','supporting']);
  return parsed.ideas.every((idea, index) => {
    if (!clean(idea?.id, 80) || !clean(idea?.idea, 900)) return false;
    if (!allowedTypes.has(idea?.type) || !allowedImportance.has(idea?.importance)) return false;
    if (!Array.isArray(idea?.evidenceIds) || !idea.evidenceIds.length) return false;
    if (new Set(idea.evidenceIds).size !== idea.evidenceIds.length) return false;
    if (!idea.evidenceIds.every(id => known.has(id))) return false;
    return index < 200;
  });
}

function validPriority(text, ideas) {
  const parsed = parseJson(text);
  const ids = new Set((ideas || []).map(x => x.id));
  if (!Array.isArray(parsed?.coreIdeaIds) || !parsed.coreIdeaIds.length) return false;
  if (new Set(parsed.coreIdeaIds).size !== parsed.coreIdeaIds.length) return false;
  return parsed.coreIdeaIds.every(id => ids.has(id));
}

function validDraft(text, coreIdeas) {
  const parsed = parseJson(text);
  const coreIds = new Set(coreIdeas.map(x => x.id));
  if (!Array.isArray(parsed?.sentences) || !parsed.sentences.length) return false;
  return parsed.sentences.every(row => {
    if (!clean(row?.text, 1000)) return false;
    if (!Array.isArray(row?.ideaIds) || !row.ideaIds.length) return false;
    return row.ideaIds.every(id => coreIds.has(id));
  });
}

function validReview(text, sentenceCount, coreIdeas) {
  const parsed = parseJson(text);
  if (!Array.isArray(parsed?.sentences) || parsed.sentences.length !== sentenceCount) return false;
  if (!Array.isArray(parsed?.coreIdeas)) return false;
  const required = new Set(coreIdeas.map(x => x.id));
  if (parsed.coreIdeas.length !== required.size) return false;
  const covered = new Set();
  for (const row of parsed.sentences) {
    if (typeof row?.supported !== 'boolean' || typeof row?.concise !== 'boolean') return false;
  }
  for (const row of parsed.coreIdeas) {
    if (!required.has(row?.id) || typeof row?.covered !== 'boolean') return false;
    if (row.covered) covered.add(row.id);
  }
  return covered.size <= required.size;
}

function batchUnits(units, budget = 5200) {
  const batches = [];
  let current = [], size = 0;
  for (const unit of units) {
    if (current.length && size + unit.text.length > budget) {
      batches.push(current); current = []; size = 0;
    }
    current.push(unit); size += unit.text.length;
  }
  if (current.length) batches.push(current);
  return batches;
}

// Runs async tasks with a small concurrency limit, keeping result order.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() { while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); } }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

// deadlineAt: epoch ms after which no new model call is started (the caller then falls back).
async function createKnowledgeMapLesson({ source, topic, language = 'el', generate: rawGenerate = generateChat, deadlineAt = 0, concurrency = 4 }) {
  const generate = (args) => {
    if (deadlineAt && Date.now() > deadlineAt) throw new Error('audio_deadline_exceeded');
    return rawGenerate(args);
  };
  const units = sourceUnits(source);
  if (!units.length) throw new Error('empty_section');
  const batches = batchUnits(units);
  const unavailable = new Set();
  const configuredOrder = getAiStatus().providers.map(p => p.name);
  const providerOrder = () => configuredOrder.length ? configuredOrder.filter(p => !unavailable.has(p)) : undefined;
  const attempts = [];
  const usage = { promptTokens:0, completionTokens:0, totalTokens:0, cachedTokens:0 };
  const providers = [];
  const started = Date.now();

  function record(result) {
    if (!result) return;
    attempts.push(...(result.attempts || []));
    for (const attempt of result.attempts || []) if ([401,403,429].includes(attempt.status)) unavailable.add(attempt.provider);
    if (result.ok) providers.push({ provider:result.provider, model:result.model });
    for (const key of Object.keys(usage)) usage[key] += Number(result.usage?.[key] || 0);
  }

  const ideas = [];
  let ideaCounter = 0;
  // Batches are independent: extract them in parallel (the slowest step of the lesson).
  const extractedRows = await mapLimit(batches, concurrency, async (batch) => {
    const catalog = batch.flatMap(unit => sourceSentences(unit));
    if (!catalog.length) return [];
    const extracted = await generate({
      messages:[
        { role:'system', content:`You are building a source-grounded knowledge map for a school lesson in ${language === 'en' ? 'English' : 'Greek'}. Read ALL supplied sentences. Extract the knowledge a learner must understand, not sentences to quote. Return ONLY JSON {"ideas":[{"id":"k1","idea":"clear normalized meaning","type":"definition|relationship|cause|process|event|formula|principle|fact","importance":"core|supporting","evidenceIds":["u1s2"]}]}. Each idea must be supported ONLY by the supplied sentence IDs. Combine nearby sentences when they express one idea. Do not copy textbook objectives, exercise instructions, rhetorical questions, decorative captions, isolated diagram labels, bibliography or repeated examples as learning ideas. Preserve conditions, negations, dates when historically essential, formulas, causal direction and scientific relationships exactly. Mark only indispensable ideas as core; examples and elaborations are supporting. Do not add outside knowledge.` },
        { role:'user', content:JSON.stringify({ topic, sentences:catalog }) }
      ],
      providerOrder:providerOrder(), maxTokens:2200, temperature:0, reasoningEffort:'low', modelProfile:'balanced', responseFormat:{type:'json_object'},
      validateText:text => validIdeas(text, batch),
    });
    record(extracted);
    if (!extracted?.ok || !validIdeas(extracted.text, batch)) throw new Error('knowledge_extraction_failed');
    return parseJson(extracted.text).ideas;
  });
  for (const rows of extractedRows) for (const row of rows) ideas.push({ ...row, id:'k' + (++ideaCounter) });
  if (!ideas.length) throw new Error('no_knowledge_ideas');

  const priority = await generate({
    messages:[
      { role:'system', content:`You are selecting the minimum sufficient set of ideas for a concise spoken lesson in ${language === 'en' ? 'English' : 'Greek'}. You see the knowledge map for the ENTIRE textbook section. Return ONLY JSON {"coreIdeaIds":["k1","k3"]}. Select every idea that is essential to understand the selected topic, but remove repetitions, secondary examples, enrichment details and nonessential measurements. Prefer conceptual completeness over a target percentage. Definitions, necessary relationships, causes/results, main process stages, major historical events and required formulas are usually essential. A short dense section may keep many ideas; a verbose section should shrink strongly. Do not select an idea merely because it is new.` },
      { role:'user', content:JSON.stringify({ topic, ideas }) }
    ],
    providerOrder:providerOrder(), maxTokens:1200, temperature:0, reasoningEffort:'low', modelProfile:'balanced', responseFormat:{type:'json_object'},
    validateText:text => validPriority(text, ideas),
  });
  record(priority);
  if (!priority?.ok || !validPriority(priority.text, ideas)) throw new Error('knowledge_priority_failed');
  const chosen = new Set(parseJson(priority.text).coreIdeaIds);
  const coreIdeas = ideas.filter(x => chosen.has(x.id));
  if (!coreIdeas.length) throw new Error('no_core_ideas');

  const evidenceCatalog = knownSentenceIds(units);
  const evidence = Object.fromEntries([...new Set(coreIdeas.flatMap(x => x.evidenceIds))].map(id => [id, evidenceCatalog.get(id)]).filter(([,text]) => text));

  let draft = await generate({
    messages:[
      { role:'system', content:`Write a natural, concise spoken school lesson in ${language === 'en' ? 'English' : 'Greek'} using ONLY the supplied core ideas and their official textbook evidence. This is synthesis, not extractive copying. Return ONLY JSON {"sentences":[{"text":"one learner-friendly sentence","ideaIds":["k1"]}]}. Cover every core idea, merge compatible ideas, remove repetition and textbook-style filler. Preserve exact meaning: never strengthen or weaken claims, reverse relations, invent causes, expand examples into rules, or add facts from general knowledge. Keep necessary terminology and formulas from the source, but explain smoothly enough to be heard aloud. No greeting, no objectives, no quiz, no closing filler.` },
      { role:'user', content:JSON.stringify({ topic, coreIdeas, evidence }) }
    ],
    providerOrder:providerOrder(), maxTokens:2200, temperature:0, reasoningEffort:'low', modelProfile:'balanced', responseFormat:{type:'json_object'},
    validateText:text => validDraft(text, coreIdeas),
  });
  record(draft);
  if (!draft?.ok || !validDraft(draft.text, coreIdeas)) throw new Error('knowledge_synthesis_failed');

  let draftRows = parseJson(draft.text).sentences.map(row => ({ text:clean(row.text, 1000), ideaIds:row.ideaIds }));

  for (let revision = 0; revision < 2; revision++) {
    const review = await generate({
      messages:[
        { role:'system', content:`Independently verify a synthesized spoken lesson against ONLY the official evidence. Return ONLY JSON {"sentences":[{"index":0,"supported":true,"concise":true,"reason":""}],"coreIdeas":[{"id":"k1","covered":true}]}. supported=true only if the sentence is fully entailed by the cited core ideas and evidence with no added fact, changed relationship, lost condition, missing antecedent or date/event distortion. concise=false if it adds repetition or unnecessary examples. Every core idea must be evaluated for coverage. Do not demand verbatim wording; accurate paraphrase is allowed.` },
        { role:'user', content:JSON.stringify({ topic, coreIdeas, evidence, draft: draftRows }) }
      ],
      providerOrder:providerOrder(), maxTokens:1800, temperature:0, reasoningEffort:'low', modelProfile:'balanced', responseFormat:{type:'json_object'},
      validateText:text => validReview(text, draftRows.length, coreIdeas),
    });
    record(review);
    if (!review?.ok || !validReview(review.text, draftRows.length, coreIdeas)) throw new Error('knowledge_verification_failed');
    const checked = parseJson(review.text);
    const badSentences = checked.sentences.filter(x => !x.supported || !x.concise);
    const missingIdeas = checked.coreIdeas.filter(x => !x.covered).map(x => x.id);
    if (!badSentences.length && !missingIdeas.length) break;
    if (revision === 1) throw new Error('knowledge_verification_failed');
    const repair = await generate({
      messages:[
        { role:'system', content:`Repair the spoken lesson using ONLY the supplied core ideas and official evidence. Return ONLY JSON {"sentences":[{"text":"sentence","ideaIds":["k1"]}]}. Fix every verifier failure, cover all missing core ideas, delete unsupported or repetitive material, and keep the result concise and natural. Do not add outside knowledge.` },
        { role:'user', content:JSON.stringify({ topic, coreIdeas, evidence, previousDraft:draftRows, badSentences, missingIdeas }) }
      ],
      providerOrder:providerOrder(), maxTokens:2200, temperature:0, reasoningEffort:'low', modelProfile:'balanced', responseFormat:{type:'json_object'},
      validateText:text => validDraft(text, coreIdeas),
    });
    record(repair);
    if (!repair?.ok || !validDraft(repair.text, coreIdeas)) throw new Error('knowledge_repair_failed');
    draftRows = parseJson(repair.text).sentences.map(row => ({ text:clean(row.text, 1000), ideaIds:row.ideaIds }));
  }

  const narration = draftRows.map(x => x.text).join(' ').trim();
  if (!narration) throw new Error('empty_narration');
  const result = {
    text:(language === 'en' ? 'Audio lesson — ' : 'Ακουστικό μάθημα — ') + topic + '\n\n' + narration,
    verified:true,
    wholeChapter:true,
    mode:'verified-knowledge-synthesis',
    verification:{
      version:VERSION,
      sourceHash:createHash('sha256').update(source).digest('hex'),
      sourceChars:source.length,
      summaryChars:narration.length,
      compressionRatio:Number((narration.length/source.length).toFixed(3)),
      units:units.length,
      ideasExtracted:ideas.length,
      coreIdeas:coreIdeas.length,
      coverageRatio:1,
      evidenceIds:[...new Set(coreIdeas.flatMap(x => x.evidenceIds))],
      coreIdeaMap:coreIdeas,
    },
    provider:providers.at(-1)?.provider || null,
    model:providers.at(-1)?.model || null,
    usage,
    attempts,
    latencyMs:Date.now()-started,
  };
  console.info('AI_METRIC ' + JSON.stringify({event:'ai_request',task:'whole_chapter_audio_knowledge',status:200,mode:result.mode,units:units.length,ideas:ideas.length,coreIdeas:coreIdeas.length,sourceChars:source.length,summaryChars:narration.length,latencyMs:result.latencyMs,provider:result.provider,model:result.model,...usage}));
  return result;
}

module.exports = { VERSION, createKnowledgeMapLesson, mapLimit, validIdeas, validPriority, validDraft, validReview };
