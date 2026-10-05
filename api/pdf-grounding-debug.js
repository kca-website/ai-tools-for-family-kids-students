const PDF = require('./official-pdf-text.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({error:'method_not_allowed'});
  res.setHeader('Cache-Control','no-store');
  const sourceUrl = String(req.query?.sourceUrl || '').trim();
  const page = Math.max(1, Number(req.query?.page || 1));
  if (!PDF.officialPdfSourceAllowed(sourceUrl)) return res.status(400).json({error:'bad_source'});
  const out = { sourceUrl, page };
  try {
    out.resolvedUrl = await PDF.resolveOfficialPdfUrl(sourceUrl);
  } catch (err) {
    out.resolveError = String(err?.stack || err?.message || err);
    return res.status(200).json(out);
  }
  try {
    const fetched = await PDF.fetchOfficialPdfBytes(sourceUrl);
    out.bytes = fetched.bytes?.byteLength || 0;
    out.fetchResolvedUrl = fetched.resolvedUrl;
    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const task = pdfjs.getDocument({data:fetched.bytes,disableWorker:true,isEvalSupported:false,useSystemFonts:true});
      const doc = await task.promise;
      out.numPages = doc.numPages;
      const p = await doc.getPage(page);
      const content = await p.getTextContent();
      out.items = content?.items?.length || 0;
      out.sample = (content?.items || []).map(x=>x?.str||'').join(' ').slice(0,500);
      await doc.destroy();
      return res.status(200).json(out);
    } catch (err) {
      out.pdfjsError = String(err?.stack || err?.message || err);
      return res.status(200).json(out);
    }
  } catch (err) {
    out.fetchError = String(err?.stack || err?.message || err);
    return res.status(200).json(out);
  }
};
