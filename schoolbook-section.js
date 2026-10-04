// The complete-source contract used by audio. Legacy excerpts remain unchanged.
const cheerio = require('cheerio');
const { correctOfficialHtml } = require('./schoolbook-source-corrections');
const VERSION = 'complete-section-v4';
const norm = value => String(value || '').normalize('NFKD').replace(/\p{M}/gu, '').replace(/\s+/g, ' ').trim().toLowerCase();
const reviewHeading = value => /^(?:ερωτησεις(?:\s.*)?|ασκησεις(?:\s.*)?|ερωτησεις\s*[-–]\s*ασκησεις|σταση για εμπεδωση|δραστηριοτητες|προτασεις για δραστηριοτητες|παιχνιδι αυτοαξιολογησης|αξιολογω τι εμαθα|questions|review questions|exercises)$/i.test(norm(value).replace(/^\d+\s*/, ''));

function extractCompletePage(html, { topic = '', sourceUrl = '' } = {}) {
  const $ = cheerio.load(correctOfficialHtml(html, sourceUrl));
  $('script,style,noscript,svg,nav,header,footer,select,form,iframe,[role="navigation"],#eclass_ebook_header,.navigation,.toc,#toc,#table-of-contents,.table-of-contents').remove();
  let root = $('#eclass_ebook_body').first();
  const mappedBody = root.length > 0;
  if (!root.length) root = $('main,article').first();
  if (!root.length) root = $('body');
  root.find('[hidden],[aria-hidden="true"],.qs,.ref,.hbox,.hlet,.page-number').remove();
  root.find('[style]').each((_, el) => { if (/display\s*:\s*none/i.test($(el).attr('style') || '')) $(el).remove(); });
  // Remove TOC containers before looking for a section heading. A menu match is
  // never a candidate for the actual body, even if its number/title is identical.
  root.find('a').each((_, el) => {
    const a = $(el), href = a.attr('href') || '';
    if (/photodentro|extras\//i.test(href) && !a.text().trim()) a.remove();
  });
  root.find('sup').each((_, el) => $(el).replaceWith('^' + $(el).text()));
  root.find('sub').each((_, el) => $(el).replaceWith('_' + $(el).text()));
  root.find('a').each((_,el) => { if(/extras\//.test($(el).find('img').attr('src') || '')) $(el).remove(); });
  root.find('img').each((_, el) => {
    const alt = String($(el).attr('data-official-transcription') ?? '').trim();
    // Generic image labels are not transcriptions. Never invent image formulas.
    $(el).replaceWith(alt && !/^(?:img\d*|εικονα|image|photo|key)$/i.test(norm(alt)) ? ' ' + alt + ' ' : ' ');
  });
  // Read a data table by rows, retaining the association between a name, its
  // symbols and values. Layout tables must continue to be walked normally.
  root.find('table').each((_, el) => {
    const table = $(el);
    if (table.find('table').length || !table.hasClass('small') || table.hasClass('red')) return;
    const rows = table.find('tr').toArray().map(tr => $(tr).children('td,th').toArray()
      .map(cell => $(cell).text().replace(/\s+/g, ' ').trim()).filter(Boolean));
    if (rows.length < 2 || !rows.some(row => row.length > 1)) return;
    const replacement = $('<div></div>');
    for (const cells of rows) if (cells.length) replacement.append($('<p></p>').text(cells.join(' · ')));
    table.replaceWith(replacement);
  });
  const blocks = [];
  let buffer = '';
  const flush = (heading = false) => {
    const text = buffer.replace(/\s+/g, ' ').trim(); buffer = '';
    if (text) blocks.push({ text, heading });
  };
  const tags = new Set(['p','div','li','tr','td','th','h1','h2','h3','h4','h5','h6','section','blockquote']);
  function walk(node) {
    if (node.type === 'text') { buffer += node.data; return; }
    if (node.type !== 'tag') return;
    const tag = node.name;
    if (tag === 'br') { buffer += ' '; return; }
    const block = tags.has(tag);
    if (block) flush();
    for (const child of node.children || []) walk(child);
    if (block) flush(/^h[1-6]$/.test(tag) || /(?:^|\s)(?:unit|title|subtitle_black)(?:\s|$)/.test($(node).attr('class') || ''));
  }
  for (const child of root[0]?.children || []) walk(child);
  flush();
  const requestedTitle = String(topic).split(/\s[—–]\s/).at(-1);
  const hasCode = /\b\d+(?:\.\d+)+\b/.test(topic);
  if (!hasCode && /\s[—–]\s/.test(topic) && norm(requestedTitle).length > 12 && !blocks.some(b=>b.heading && norm(b.text).includes(norm(requestedTitle)))) {
    throw new Error('selected_section_title_not_in_source');
  }
  const result = scopeBlocks(blocks, topic, { mappedBody });
  if (!result.length) throw new Error('section_body_not_resolved');
  return { text: result.map(b => b.text).join('\n\n'), sourceUrl, parserVersion: VERSION, complete: true };
}

function scopeBlocks(blocks, topic, { mappedBody = false } = {}) {
  let rows = blocks.filter(b => !/^(?:περιεχομενα|contents|ευρετηριο|index|αρχικη|επομενο|προηγουμενο)$/i.test(norm(b.text)));
  const code = String(topic).match(/\b\d+(?:\.\d+)+\b/)?.[0];
  const title = norm(String(topic).split(/\s[—–]\s/).pop()).replace(/^\d+(?:\.\d+)*[.)]?\s*/, '');
  const headings = rows.map((b,i) => ({ ...b, i, code: b.text.match(/^\s*(\d+(?:\.\d+)*)(?=\s|[.)])/ )?.[1] })).filter(b => b.heading);
  const matches = headings.filter(b => code ? b.code === code : (title.length > 8 && norm(b.text).includes(title)));
  if (matches.length) {
    // Prefer the body occurrence followed by prose over dense TOC headings.
    const candidates = matches.map(b => {
      const end = headings.find(h => h.i > b.i && h.code && b.code && h.code !== b.code && h.code.split('.').length <= b.code.split('.').length)?.i ?? rows.length;
      const body = rows.slice(b.i, end);
      return { start: b.i, end, score: body.filter(x => !x.heading).reduce((n,x) => n + x.text.length, 0) };
    }).sort((a,b) => b.score - a.score);
    const c = candidates[0];
    // A mapped single-section page may put its introductory sidebar before the
    // title. Keep it; only chapter pages with sibling sections need slicing.
    if (!mappedBody || c.end < rows.length || headings.some(h => h.code && code && !h.code.startsWith(code + '.') && h.code !== code)) rows = rows.slice(c.start, c.end);
  } else if (!mappedBody && headings.some(h => h.code) && code) {
    throw new Error('section_heading_not_resolved');
  }
  // Chapter-wide review is not the body of a subsection. Worked examples remain.
  const end = rows.findIndex(b => reviewHeading(b.text));
  if (end >= 0) rows = rows.slice(0, end);
  return rows.filter((b,i) => !/^(?:\[Official (?:page|section).*\]|ΦΥΣΙΚΗ Β' ΓΥΜΝΑΣΙΟΥ|ΚΕΦΑΛΑΙΟ \d+\s.*)$/i.test(b.text) && (i === 0 || b.text !== rows[i-1].text));
}

function completeText(text, topic) {
  const blocks = String(text || '').split(/\n+/).map(text => ({ text: text.trim(), heading: /^\d+(?:\.\d+)+\s/.test(text.trim()) })).filter(b => b.text);
  return scopeBlocks(blocks, topic, { mappedBody: true }).map(b => b.text).join('\n\n');
}
function scopeOfficialHtmlPage(html, topic) {
  const $ = cheerio.load(String(html || ''));
  $('nav,header,footer,select,script,style,#eclass_ebook_header,.toc,#toc').remove();
  const root = $('#eclass_ebook_body').first().length ? $('#eclass_ebook_body').first() : $('main,article,body').first();
  const raw = root.html() || '';
  const headingPattern = /<(h[1-6]|p)\b([^>]*)>[\s\S]*?<\/\1>/gi;
  const headings = [];
  for (const m of raw.matchAll(headingPattern)) {
    if (m[1].toLowerCase() === 'p' && !/class=["'][^"']*\b(?:unit|title|subtitle_black)\b/.test(m[2])) continue;
    const text = cheerio.load(m[0]).text().replace(/\s+/g,' ').trim();
    headings.push({ offset:m.index, text, code:text.match(/^(\d+(?:\.\d+)*)(?=\s|[.)])/)?.[1] });
  }
  const code = String(topic || '').match(/\b\d+(?:\.\d+)+\b/)?.[0];
  const title = norm(String(topic || '').split(/\s[—–]\s/).at(-1)).replace(/^\d+[.)]?\s*/,'');
  const candidates = headings.filter(h => code ? h.code === code : title.length > 8 && norm(h.text).includes(title));
  for (const selected of candidates) {
    const next = headings.find(h => h.offset > selected.offset && h.code && selected.code && h.code !== selected.code && h.code.split('.').length <= selected.code.split('.').length);
    if (next) return '<div id="eclass_ebook_body">' + raw.slice(selected.offset,next.offset) + '</div>';
  }
  return '<div id="eclass_ebook_body">' + raw + '</div>';
}
module.exports = { VERSION, extractCompletePage, scopeBlocks, completeText, scopeOfficialHtmlPage };
