// Phase 10 landing pages: shared data loading + HTML rendering.
// Everything factual (tool names, availability per age zone, Prompt Generator
// prompts, schoolbook-grounded books, curriculum verification dates) is read
// from the same data files the site runs on, so a landing page can never claim
// a tool, prompt or book the site does not actually have.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const ORIGIN = 'https://www.aitools4kids.gr';
export const SITE_NAME = 'AI Tools for Family, Kids & Students';
export const MODIFIED = '2026-09-30';
export const OG_IMAGE = `${ORIGIN}/assets/og-image.png`;

const read = (p) => fs.readFileSync(path.join(REPO, p), 'utf8');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function loadData() {
  const ctx = { console };
  vm.createContext(ctx);
  for (const f of ['data.js', 'curriculum-data.js']) vm.runInContext(read(f), ctx, { filename: f });
  vm.runInContext('globalThis.__d={TOOLS,PATHS,PROMPTS,NEED_TOOL_MAP,CURRICULUM,LEARNING_NEEDS,ZONES}', ctx);
  const d = ctx.__d;

  // Official curriculum layer attaches itself to window; give it a stub.
  const win = { };
  const c2 = { window: win, console, globalThis: win };
  vm.createContext(c2);
  vm.runInContext(read('official-curriculum-data.js'), c2, { filename: 'official-curriculum-data.js' });
  const layer = Object.values(win).find((v) => v && v.meta && v.meta.lastVerified);
  d.curriculumMeta = layer ? layer.meta : null;

  // Schoolbook grounding coverage = the BOOKS table of the schoolbook endpoint.
  const src = read('api/schoolbook-source.js');
  // EPAL student catalog (sectors, specialties, courses) loaded exactly as the site loads it.
  const win2 = {};
  const doc = { readyState: 'complete', addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null };
  const c3 = { window: win2, document: doc, console: { log() {}, warn() {}, error() {} }, globalThis: win2, setTimeout, clearTimeout };
  vm.createContext(c3);
  for (const f of ['teacher-curriculum-epal-2026-2027.js', 'teacher-curriculum-epal-c-specialties-2026-2027.js', 'teacher-curriculum-epal-c-final-sectors-2026-2027.js', 'teacher-curriculum-epal-panhellenic-2027.js', 'epal-official-guidance-topics-2026-2027.js', 'epal-student-topics-2026-2027.js', 'epal-student-tutor-2026-2027.js']) vm.runInContext(read(f), c3, { filename: f });
  const cat = win2.AITOOLSKIDS_EPAL_STUDENT_CATALOG;
  if (!cat) throw new Error('EPAL student catalog did not load');
  const strip = (label, sector) => label.replace(`${sector} · `, '');
  d.epal = {
    meta: cat.meta,
    commonA: cat.getSubjects('a', '', '').map((x) => x.subjectLabelEl),
    sectors: cat.getSectors().map((sec) => {
      const all = cat.getSubjects('b', sec.id, '').map((x) => x.subjectLabelEl);
      return {
        label: sec.label,
        courses: all.filter((l) => l.startsWith(`${sec.id} · `)).map((l) => strip(l, sec.id)),
        specialties: cat.getSpecialties(sec.id).map((x) => x.specialty),
      };
    }),
    specialtyCount: cat.getSpecialties().length,
  };
  d.books = [...src.matchAll(/^  "([a-z0-9-]+)": \{\n    title: "([^"]+)"/gm)].map((m) => ({ id: m[1], title: m[2] }));
  return d;
}

export const toolPageExists = (id) => fs.existsSync(path.join(REPO, 'tools', `${id}.html`));

const ZONE_LABEL = { primary: 'Δημοτικό', middle: 'Γυμνάσιο', high: 'Λύκειο' };

/** Where a tool is offered, derived from PATHS (student list vs guardian-only list). */
export function availability(d, id) {
  const out = [];
  for (const z of ['primary', 'middle', 'high']) {
    const st = d.PATHS[z].student.tools.some((t) => t.toolId === id);
    const gd = d.PATHS[z].guardian.tools.some((t) => t.toolId === id);
    if (st) out.push(ZONE_LABEL[z]);
    else if (gd) out.push(`${ZONE_LABEL[z]} (μέσω γονιού/εκπαιδευτικού)`);
  }
  return out;
}

export const route = (zone, role, view, params) => {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  return `/${zone}/${role}/${view}${q}`;
};
export const tutor = (zone, role, grade, subject, extra = {}) => route(zone, role, 'tutor', { ...(zone === 'high' ? { schoolType: 'gel' } : {}), grade, subject, ...extra });

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
}

/** Tool card list for one group; validates every id against the real dataset. */
function renderToolGroup(d, spec, group) {
  // Strict validation: when a group names a learning need, every tool must be
  // mapped to that need for this subject in curriculum-data.js (NEED_TOOL_MAP).
  const strict = spec.toolSubject && group.need ? new Set(d.NEED_TOOL_MAP[spec.toolSubject]?.[group.need] || []) : null;
  if (spec.toolSubject && group.need && !strict.size) throw new Error(`${spec.slug}: no NEED_TOOL_MAP entry for ${spec.toolSubject}/${group.need}`);
  const items = group.items.map(([id, why]) => {
    if (!d.TOOLS[id]) throw new Error(`${spec.slug}: unknown tool ${id}`);
    if (strict && !strict.has(id)) throw new Error(`${spec.slug}: tool ${id} is not mapped to ${spec.toolSubject}/${group.need} in the dataset`);
    const t = d.TOOLS[id];
    const av = availability(d, id);
    const linked = toolPageExists(id);
    const name = linked ? `<a href="/tools/${id}.html">${esc(t.name)}</a>` : esc(t.name);
    return `<li class="tool-card"><h4>${name}</h4><p>${why}</p>${av.length ? `<p class="avail">Στον οδηγό: ${esc(av.join(' · '))}</p>` : ''}${t.schoolOnly ? '<p class="note">Μέσω σχολικού λογαριασμού/σχολείου.</p>' : ''}</li>`;
  });
  return `<div class="tool-group"><h3>${group.h3}</h3>${group.intro ? `<p>${group.intro}</p>` : ''}<ul class="tool-cards">${items.join('')}</ul></div>`;
}

function renderZoneNotes(d, subject) {
  const toolLink = (id) => (d.TOOLS[id] ? (toolPageExists(id) ? `<a href="/tools/${id}.html">${esc(d.TOOLS[id].name)}</a>` : esc(d.TOOLS[id].name)) : null);
  return ['primary', 'middle', 'high'].map((z) => {
    const c = d.CURRICULUM[z]?.[subject];
    if (!c) return '';
    const names = c.toolIds.map(toolLink).filter(Boolean).join(' · ');
    return `<h3>${ZONE_LABEL[z]}${z === 'primary' ? ' (μέσω γονιού ή εκπαιδευτικού)' : ''}</h3><p>${esc(c.noteEl)}</p><p class="small">Εργαλεία στη λίστα της βαθμίδας: ${names}.</p>`;
  }).join('');
}

function renderDeep(deep) {
  return deep.map((row) => `<p class="deep-label">${row.label}</p><ul class="deeplinks">${row.links.map(([t, href]) => `<li><a href="${esc(href)}">${esc(t)}</a></li>`).join('')}</ul>`).join('');
}

export function renderPage(d, spec) {
  const url = `${ORIGIN}/${spec.slug}.html`;
  const sections = spec.sections.map((s) => {
    const parts = [`<h2>${s.h2}</h2>`];
    for (const b of s.body) {
      if (typeof b === 'string') parts.push(b);
      else if (b.tools) parts.push(b.tools.map((g) => renderToolGroup(d, spec, g)).join(''));
      else if (b.zoneNotes) parts.push(renderZoneNotes(d, b.zoneNotes));
      else if (b.deep) parts.push(renderDeep(b.deep));
      else if (b.routes) parts.push(`<ul class="routes">${b.routes.map((r) => `<li><strong>${r.h}</strong><p>${r.p}</p><a href="${esc(r.href)}">${r.cta} →</a></li>`).join('')}</ul>`);
      else if (b.promptId) {
        const hit = Object.entries(d.PROMPTS).flatMap(([z, list]) => list.map((p) => ({ z, p }))).find((x) => x.p.id === b.promptId);
        if (!hit) throw new Error(`${spec.slug}: unknown prompt ${b.promptId}`);
        parts.push(`<div class="prompt-box"><p class="label">${b.label || `Από το Prompt Generator (${esc(hit.p.subjectEl)} · ${esc(hit.p.taskTypeEl)})`}</p><blockquote>${esc(hit.p.promptTextEl)}</blockquote></div>`);
      }
    }
    return `<section${s.id ? ` id="${s.id}"` : ''}>${parts.join('')}</section>`;
  }).join('');

  const faqHtml = spec.faq?.length
    ? `<section class="faq"><h2>Συχνές ερωτήσεις</h2>${spec.faq.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</section>`
    : '';

  const crumbs = [['Αρχική', '/'], ...(spec.crumbMid || []), [spec.crumb, null]];
  const crumbHtml = `<nav class="crumb" aria-label="Διαδρομή πλοήγησης"><ol>${crumbs.map(([t, h]) => (h ? `<li><a href="${h}">${esc(t)}</a></li>` : `<li><span aria-current="page">${esc(t)}</span></li>`)).join('')}</ol></nav>`;

  const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
  const graph = [
    {
      '@type': 'WebPage', '@id': `${url}#webpage`, url, name: spec.title, description: spec.description, inLanguage: 'el',
      isAccessibleForFree: true, dateModified: MODIFIED,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: `${ORIGIN}/` },
      audience: { '@type': 'EducationalAudience', educationalRole: spec.audienceRole },
      breadcrumb: { '@id': `${url}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map(([t, h], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: h ? `${ORIGIN}${h}` : url })),
    },
  ];
  if (spec.faq?.length) {
    graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: spec.faq.map((f) => ({ '@type': 'Question', name: stripTags(f.q), acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) } })) });
  }

  const related = spec.related.map(([t, h]) => `<a href="${esc(h)}">${esc(t)}</a>`).join('');
  const cta = `<section class="cta"><h2>${spec.cta.h2}</h2><p>${spec.cta.p}</p><div class="buttons">${spec.cta.buttons.map(([t, h, sec]) => `<a class="btn${sec ? ' secondary' : ''}" href="${esc(h)}">${t}</a>`).join('')}</div></section>`;

  return `<!DOCTYPE html>
<html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(spec.title)}</title>
<meta name="description" content="${esc(spec.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(SITE_NAME)}"><meta property="og:locale" content="el_GR">
<meta property="og:title" content="${esc(spec.ogTitle || spec.title)}"><meta property="og:description" content="${esc(spec.ogDescription || spec.description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(SITE_NAME)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(spec.ogTitle || spec.title)}"><meta name="twitter:description" content="${esc(spec.ogDescription || spec.description)}"><meta name="twitter:image" content="${OG_IMAGE}">
<link rel="stylesheet" href="/seo-guide.css"><link rel="stylesheet" href="/seo-landing.css">
${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}
<link rel="stylesheet" href="/site-chrome.css"><script defer src="/site-chrome.js"></script>
</head><body><header class="top"><div class="top__in"><a class="brand" href="/">🤖 ${esc(SITE_NAME)}</a><a class="home" href="/">Αρχική</a></div></header>
<main class="wrap" id="main">${crumbHtml}
<section class="hero"><div class="kicker">${esc(spec.kicker)}</div><h1>${esc(spec.h1)}</h1><p class="lead">${spec.lead}</p><ul class="chips" aria-label="Βασικά στοιχεία" style="list-style:none;padding:0">${spec.chips.map((c) => `<li class="chip">${esc(c)}</li>`).join('')}</ul></section>
<article><div class="toc"><strong>${spec.quick.title}</strong><ul>${spec.quick.bullets.map((b) => `<li>${b}</li>`).join('')}</ul><div class="buttons"><a class="btn" href="${esc(spec.quick.cta[1])}">${spec.quick.cta[0]}</a></div></div>
${sections}${faqHtml}${cta}<section class="related"><h2>Σχετικές σελίδες</h2><div class="related-grid">${related}</div></section>
<p class="meta-line">Τελευταία ενημέρωση: ${MODIFIED.split('-').reverse().join('/')}. ${spec.metaNote || 'Ανεξάρτητο, δωρεάν εκπαιδευτικό έργο· δεν αποτελεί επίσημο προϊόν κανενός παρόχου AI.'}</p></article></main>
<footer class="page-foot wrap"><div class="footer-links"><a href="/">Αρχική</a><a href="/methodology.html">Μεθοδολογία</a><a href="/ai-transparency.html">Διαφάνεια AI</a><a href="/accessibility.html">Προσβασιμότητα</a><a href="/privacy-policy.html">Πολιτική Απορρήτου</a></div></footer>
<script type="module">import{inject}from'https://cdn.jsdelivr.net/npm/@vercel/analytics@1/+esm';inject();</script></body></html>
`;
}
