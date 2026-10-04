// Exact HTML transcription corrections, checked against the corresponding
// official PDF. Never repair a source using model knowledge or computation.
const corrections = [{
  htmlUrl: 'https://ebooks.edu.gr/ebooks/v/html/8547/2204/Fysiki_B-Gymnasiou_html-empl/index1_3.html',
  referenceUrl: 'https://ebooks.edu.gr/ebooks/v/pdf/8547/820/21-0100-02_Fysiki_B-Gymnasiou_Vivlio-Mathiti/',
  replacements: [
    {before:'10.000 κ\\π', after:'10.000 km', pdfPage:15},
    {before:'Το 1 πι ορίστηκε', after:'Το 1 m ορίστηκε', pdfPage:15},
    {before:'11299792458 δευτερόλεπτα', after:'1/299792458 δευτερόλεπτα', pdfPage:15},
    {before:'φιδιούχο λευκόχρυσο', after:'ιριδιούχο λευκόχρυσο', pdfPage:17},
    {before:'1/10000000=10', after:'1/1000000=10', pdfPage:19},
    {before:'10000000=10', after:'1000000=10', pdfPage:19},
  ]
}];
function correctOfficialHtml(html, sourceUrl) {
  const mapping = corrections.find(row => row.htmlUrl === sourceUrl);
  if (!mapping) return String(html || '');
  let result = String(html || '');
  for (const {before, after} of mapping.replacements) result = result.split(before).join(after);
  return result;
}
module.exports = {correctOfficialHtml, corrections};
