// Approved open textbook listed in the official AUEB course 3125 bibliography.
const SOURCE = Object.freeze({
  id: 'composing-programs-1-2',
  name: 'John DeNero · Composing Programs · 1.2 Elements of Programming',
  url: 'https://composingprograms.com/pages/12-elements-of-programming.html',
  syllabusUrl: 'https://www.dept.aueb.gr/el/cs/courses/3125',
  license: 'CC BY-SA 3.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
});
let cached;
function extractChapter(html) {
  const start = html.search(/<(?:div|section)[^>]*id=["']elements-of-programming["']/i);
  if (start < 0) throw new Error('chapter_marker_missing');
  const text = html.slice(start).split(/<div[^>]*class=["'][^"']*footer/i)[0]
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(?:p|li|pre|h[1-6]|div|section)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\n\s*\n/g, '\n\n').trim();
  if (text.length < 1000 || text.length > 48000) throw new Error('unexpected_chapter_size');
  return text;
}
async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'method_not_allowed' }); }
  if (req.query?.id !== SOURCE.id) return res.status(404).json({ error: 'unknown_book_section' });
  try {
    if (!cached || cached.expires < Date.now()) {
      const response = await fetch(SOURCE.url, { redirect: 'error', signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error('source_unavailable');
      const html = await response.text();
      if (html.length > 1000000) throw new Error('source_too_large');
      cached = { text: extractChapter(html), expires: Date.now() + 3600000 };
    }
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json({ ...SOURCE, text: cached.text });
  } catch (_) {
    return res.status(502).json({ error: 'book_source_unavailable', message: 'Δεν ήταν διαθέσιμο το κείμενο του ανοικτού συγγράμματος. Πρόσθεσε PDF ή απόσπασμα για να συνεχίσεις.' });
  }
}
module.exports = handler;
module.exports.extractChapter = extractChapter;
