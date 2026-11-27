// Preserve parentheses that belong to source URLs (e.g. Wikimedia file names),
// while dropping the unmatched closing parenthesis of a Markdown/prose wrapper.
export function extractHttpUrls(text) {
  const matches=String(text).matchAll(/https?:\/\/[^\s"'`<>\\\]}]+/g);
  return [...matches].map(m=>{
    let url=m[0].replace(/[.,;:!?]+$/, '');
    let opens=(url.match(/\(/g)||[]).length, closes=(url.match(/\)/g)||[]).length;
    while(closes>opens && url.endsWith(')')) { url=url.slice(0,-1); closes--; }
    return url.replace(/[.,;:!?]+$/, '').replace(/&amp;/g, '&');
  });
}
