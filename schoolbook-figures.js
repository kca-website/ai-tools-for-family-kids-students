// Preserve image-only formulas/tables as part of the official source. This is
// optical transcription, never an invitation to calculate or add explanations.
const cheerio = require('cheerio');
const { generateChat } = require('./ai-provider-router');
const { getStudyCache, setStudyCache } = require('./study-runtime-cache');
const { createHash } = require('node:crypto');
const parse = text => { try { return JSON.parse(String(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'')); } catch { return null; } };

async function transcribeOfficialFigures(html, pageUrl) {
  const $ = cheerio.load(html);
  const root = $('#eclass_ebook_body').length ? $('#eclass_ebook_body') : $('main,article,body').first();
  const figures = [];
  root.find('img').each((_,el) => {
    const src = $(el).attr('src') || '';
    if (!src || /(?:extras|ebooks_player_files)\//.test(src) || $(el).closest('[style*="display: none"],.qs').length) return;
    const url = new URL(src,pageUrl);
    if (url.origin !== new URL(pageUrl).origin || !url.pathname.startsWith(new URL('.',pageUrl).pathname)) throw new Error('non_official_figure');
    figures.push({id:'f'+(figures.length+1),url:url.href,el});
  });
  if (!figures.length) return html;
  const key = {kind:'official-figure-transcription-v1',pageUrl,htmlHash:createHash('sha256').update(html).digest('hex')};
  let texts = await getStudyCache(key);
  if (!texts) {
    texts = {};
    // Sequential batches avoid adding a burst of paid requests for book images.
    for (let i=0;i<figures.length;i+=6) {
      const group = figures.slice(i,i+6);
      const content = [{type:'text',text:'Transcribe ONLY visible formulas, numeric tables, labels and explanatory text in these official schoolbook images. For photos, illustrations without text, icons, page numbers and logos return an empty text. Do NOT describe the photo, infer, solve, compute, correct printed values, or add facts. Preserve superscripts, fractions and symbols in readable text. Return JSON {"figures":[{"id":"f1","text":"exact optical transcription or empty string"}]}, one entry for EVERY supplied image id.'}];
      for (const figure of group) {
        const response = await fetch(figure.url,{signal:AbortSignal.timeout(15000)});
        if (!response.ok) throw new Error('official_figure_fetch_failed');
        const mimeType = response.headers.get('content-type')?.split(';')[0];
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!/^image\/(?:png|jpeg|webp|gif)$/.test(mimeType || '') || bytes.length > 5000000) throw new Error('official_figure_format_not_supported');
        content.push({type:'text',text:figure.id},{type:'image',mimeType,data:bytes.toString('base64')});
      }
      const valid = text => {
        const rows = parse(text)?.figures;
        return Array.isArray(rows) && rows.length === group.length && group.every(f=>rows.filter(r=>r.id===f.id&&typeof r.text==='string').length===1);
      };
      const result = await generateChat({messages:[{role:'user',content}],providerOrder:['gemini'],maxTokens:6000,temperature:0,responseFormat:{type:'json_object'},validateText:valid,timeoutMs:30000});
      if (!result.ok || !valid(result.text)) throw new Error('official_figure_transcription_unavailable');
      const proposals = parse(result.text).figures;
      const verification = await generateChat({messages:[{role:'user',content:[{type:'text',text:'Check these optical transcriptions against the SAME images. Reject invented text, incorrect symbols or numbers. Empty text is acceptable only for a photo, icon or image without educational text. Return ONLY JSON {"checks":[{"id":"f1","supported":true}]}, every supplied image id. Transcriptions: '+JSON.stringify(proposals)},...content.slice(1)]}],providerOrder:['gemini'],maxTokens:1200,temperature:0,responseFormat:{type:'json_object'},timeoutMs:30000,validateText:text=>{const c=parse(text)?.checks;return Array.isArray(c)&&c.length===group.length&&group.every(f=>c.filter(r=>r.id===f.id&&r.supported===true).length===1);}});
      if (!verification.ok) throw new Error('official_figure_transcription_not_verified');
      for (const row of proposals) texts[row.id] = row.text;
    }
    await setStudyCache(key,texts,86400);
  }
  for (const figure of figures) $(figure.el).attr('data-official-transcription',texts[figure.id] || '');
  return $.html();
}
module.exports = { transcribeOfficialFigures };
