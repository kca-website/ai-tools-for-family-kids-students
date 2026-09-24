const { getAllPreschoolSubunits } = require('./preschool-curriculum-data');

const SUBUNITS = getAllPreschoolSubunits();

const FOCUS_FILTERS = {
  auto: () => true,
  language: item => item.unitId === 'language',
  math: item => item.unitId === 'mathematics',
  science: item => item.unitId === 'natural-sciences',
  social: item => item.fieldId === 'self-society',
  arts: item => item.unitId === 'arts',
  movement: item => item.unitId === 'physical-education',
  technology: item => item.unitId === 'construction-technology' || item.unitId === 'ict'
};

const DEFAULT_BY_FOCUS = {
  language: 'oral-communication',
  math: 'numbers-operations-algebra',
  science: 'matter-phenomena',
  social: 'interpersonal-relationships',
  arts: 'visual-arts',
  movement: 'body-movement',
  technology: 'programming-digital-play'
};

function contextualDefaultForFocus(focus, normalizedIdea) {
  if (focus === 'math') {
    if (/σχημα|κυκλ|τριγων|τετραγων|μεγεθ|μηκοσ|χωρο/.test(normalizedIdea)) return 'geometry-measurement';
    if (/χρωμα|ταξινομ|ομαδοποι|πινακ|γραφημ|πιθανο|προβλεψ/.test(normalizedIdea)) return 'stochastic-mathematics';
    return 'numbers-operations-algebra';
  }
  if (focus === 'movement') {
    if (/μουσικ|ρυθμ|χορο|παραδοσιακ|κινητικο παιχνιδ/.test(normalizedIdea)) return 'sport-culture-creative-movement';
    if (/περπατ|τρεξ|εξω|δραστηρι/.test(normalizedIdea)) return 'physically-active-life';
    return 'body-movement';
  }
  if (focus === 'technology') {
    if (/χτιζ|κατασκευ|γεφυρ|πυργ|τουβλακ|υλικ|σχεδιαζ/.test(normalizedIdea)) return 'construction-everyday-life';
    if (/εργαλ|συσκευ|μηχαν|γραναζ|εξοπλισ/.test(normalizedIdea)) return 'tools-equipment-devices';
    return 'programming-digital-play';
  }
  return DEFAULT_BY_FOCUS[focus];
}

function normalizeGreek(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[ς]/g, 'σ')
    .replace(/[^a-z0-9α-ω\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreSubunit(item, normalizedIdea) {
  let score = 0;
  for (const keyword of item.keywords || []) {
    const k = normalizeGreek(keyword);
    if (!k) continue;
    if (normalizedIdea === k) score += 8;
    else if (normalizedIdea.includes(k)) score += k.includes(' ') ? 6 : 4;
  }

  const title = normalizeGreek(item.title);
  if (title && normalizedIdea.includes(title)) score += 10;

  return score;
}

function toAlignment(item, reason, score = 0) {
  return {
    field: item.field,
    unit: item.unit,
    subunit: item.title,
    activityGoal: item.activityGoal,
    source: item.source,
    mappingReason: reason,
    score
  };
}

function resolvePreschoolCurriculum({ idea = '', mode = 'story', focus = 'auto', limit = 3 } = {}) {
  const normalizedIdea = normalizeGreek(idea);
  const safeFocus = FOCUS_FILTERS[focus] ? focus : 'auto';
  const focusFilter = FOCUS_FILTERS[safeFocus];

  const rank = items => items
    .map(item => ({ item, score: scoreSubunit(item, normalizedIdea) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'el'));

  const ranked = rank(SUBUNITS.filter(focusFilter));
  const rankedAll = rank(SUBUNITS);

  const selected = [];
  const seen = new Set();

  const push = (item, reason, score = 0) => {
    if (!item || seen.has(item.id) || selected.length >= Math.max(1, Math.min(3, limit))) return;
    seen.add(item.id);
    selected.push(toAlignment(item, reason, score));
  };

  if (ranked.length) {
    push(ranked[0].item, safeFocus === 'auto' ? 'topic-keyword' : 'selected-focus+topic-keyword', ranked[0].score);
  } else if (safeFocus !== 'auto') {
    const contextualDefault = contextualDefaultForFocus(safeFocus, normalizedIdea);
    push(SUBUNITS.find(item => item.id === contextualDefault), 'selected-focus-contextual-default');
  }

  if (!selected.length) {
    push(SUBUNITS.find(item => item.id === 'oral-communication'), 'general-preschool-default');
  }

  // A preschool activity can legitimately be cross-curricular.
  if (mode === 'story') {
    push(SUBUNITS.find(item => item.id === 'oral-communication'), 'story-mode');
  }
  if (mode === 'offline') {
    push(SUBUNITS.find(item => item.id === 'body-movement'), 'offline-mode');
  }

  // Add strong secondary topic matches, including cross-curricular matches outside a chosen focus.
  const secondaryPool = safeFocus === 'auto' ? ranked.slice(1) : rankedAll;
  for (const candidate of secondaryPool) {
    if (selected.length >= Math.max(1, Math.min(3, limit))) break;
    if (!selected.some(x => x.unit === candidate.item.unit && x.subunit === candidate.item.title)) {
      push(candidate.item, 'secondary-topic-keyword', candidate.score);
    }
  }

  return selected;
}

module.exports = {
  resolvePreschoolCurriculum,
  normalizeGreek,
  scoreSubunit
};
