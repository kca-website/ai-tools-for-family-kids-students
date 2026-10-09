// One source extraction for every Physics G study activity. Formulas are optical
// transcriptions of the official images, bound to their bytes; no model guesses.
const cheerio = require('cheerio');
const { createHash } = require('node:crypto');
const { extractCompletePage } = require('./schoolbook-section');
const manifest = require('./physics-g-verified-formulas.json');
const VERSION = 'physics-g-complete-v1';
const verifiedImages = new Map();

async function verifiedFormula(url, entry) {
  if (!verifiedImages.has(url)) {
    const pending = (async () => {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('official_formula_fetch_failed');
      const bytes = Buffer.from(await response.arrayBuffer());
      if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) {
        throw new Error('official_formula_changed');
      }
      return entry.text;
    })();
    verifiedImages.set(url, pending);
    pending.catch(() => verifiedImages.delete(url));
  }
  return verifiedImages.get(url);
}

async function extractPhysicsGPage(html, sourceUrl) {
  const url = new URL(sourceUrl);
  const base = new URL(manifest.sourceBase);
  if (url.origin !== base.origin || !/^index[1-8]\.html$/.test(url.pathname.slice(base.pathname.length)) || !url.pathname.startsWith(base.pathname)) {
    throw new Error('selected_section_not_physics_g');
  }
  const $ = cheerio.load(String(html || ''));
  const root = $('#eclass_ebook_body').first();
  if (!root.length) throw new Error('section_body_not_resolved');
  // The publisher's HTML example 5.2 has conflicting speeds (1.533/1.530)
  // and a factor-of-ten error in its printed wavelength. Do not silently repair
  // or teach it. All surrounding wave/sound theory remains in the source.
  if (url.pathname.endsWith('/index5.html')) {
    root.find('.div-explbox2').each((_, el) => {
      if (/^Παράδειγμα\s+5\.2\b/.test($(el).text().trim())) $(el).remove();
    });
  }
  // Accessible labels are publisher-supplied evidence for diagrams, not generated
  // descriptions. Generic image labels supply no evidence and are discarded.
  const images = root.find('img').toArray();
  for (let i = 0; i < images.length; i += 8) {
    await Promise.all(images.slice(i, i + 8).map(async el => {
      const img = $(el), src = img.attr('src') || '';
      const imageUrl = new URL(src, sourceUrl);
      if (imageUrl.origin !== base.origin || !imageUrl.pathname.startsWith(base.pathname + 'images/')) return;
      const entry = manifest.figures[imageUrl.pathname.split('/').pop()];
      const alt = String(img.attr('alt') || '').trim();
      if (entry) img.attr('data-official-transcription', await verifiedFormula(imageUrl.href, entry));
      else if (alt && !/^(?:εικόνα|image|img\d*|photo|key)$/i.test(alt)) img.attr('data-official-transcription', alt);
      else if (Number(img.attr('height')) > 0 && Number(img.attr('height')) <= 100 && Number(img.attr('width')) > 0 && !/img0[-_]/.test(src)) {
        img.attr('data-official-transcription', '[Unverified official formula: ' + imageUrl.href + ']');
      }
    }));
  }
  return extractCompletePage($.html(), { sourceUrl }).text;
}

module.exports = { VERSION, extractPhysicsGPage, manifest };
