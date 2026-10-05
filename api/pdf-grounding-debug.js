const PDF = require('./official-pdf-text.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({error:'method_not_allowed'});
  res.setHeader('Cache-Control','no-store');
  const sourceUrl = String(req.query?.sourceUrl || '').trim();
  const page = Math.max(1, Number(req.query?.page || 1));
  const heading = String(req.query?.heading || '').trim();
  if (!PDF.officialPdfSourceAllowed(sourceUrl)) return res.status(400).json({error:'bad_source'});
  try {
    const result = await PDF.extractVerifiedPdfPage({
      sourceUrl,
      pdfPage: page,
      verifiedHeading: heading || '2 A refugee\'s "dreamland"'
    });
    return res.status(200).json({sourceUrl,page,heading:heading || null,result});
  } catch (err) {
    return res.status(200).json({sourceUrl,page,error:String(err?.stack || err?.message || err)});
  }
};
