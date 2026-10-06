"use strict";

const MAX_PDF_BYTES = 80 * 1024 * 1024;
const MIN_GROUNDED_PAGE_CHARS = 250;

function allowed(value) {
  try {
    const u = new URL(String(value || ""));
    return u.protocol === "https:" && /(^|\.)ebooks\.edu\.gr$/i.test(u.hostname) &&
      (/\/ebooks\/v\/pdf\//i.test(u.pathname) || /\/ebooks\/d\//i.test(u.pathname));
  } catch (_) { return false; }
}

function stripHash(value) {
  const u = new URL(String(value || ""));
  u.hash = "";
  return u.toString();
}

function normalize(value) {
  return String(value || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ").trim();
}

function directDownload(sourceUrl) {
  try {
    const u = new URL(stripHash(sourceUrl));
    if (/\/ebooks\/d\/.*\.pdf$/i.test(u.pathname)) return u.toString();
    const m = u.pathname.match(/\/ebooks\/v\/pdf\/(\d+)\/(\d+)\/([^/]+)\/?$/i);
    if (!m) return "";
    return `${u.origin}/ebooks/d/${m[1]}/${m[2]}/${m[3]}.pdf`;
  } catch (_) { return ""; }
}

function candidates(sourceUrl) {
  if (!allowed(sourceUrl)) return [];
  const out = [];
  const direct = directDownload(sourceUrl);
  if (direct) out.push(direct);
  const u = new URL(stripHash(sourceUrl));
  const clean = u.pathname.replace(/\/+$/, "");
  const name = clean.split("/").filter(Boolean).pop() || "";
  if (name && !/\.pdf$/i.test(name)) {
    const sibling = new URL(u); sibling.pathname = clean + ".pdf"; out.push(sibling.toString());
    const inside = new URL(u); inside.pathname = clean + "/" + name + ".pdf"; out.push(inside.toString());
  }
  out.push(u.toString());
  return [...new Set(out.filter(allowed))];
}

function isPdf(bytes) {
  return bytes instanceof Uint8Array && bytes.length >= 5 && bytes[0]===37 && bytes[1]===80 && bytes[2]===68 && bytes[3]===70 && bytes[4]===45;
}

async function resolveUrl(sourceUrl, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== "function") throw new Error("fetch_unavailable");
  for (const url of candidates(sourceUrl)) {
    if (!/\.pdf$/i.test(new URL(url).pathname)) continue;
    try {
      const r = await fetchImpl(url,{headers:{Range:"bytes=0-4095",Accept:"application/pdf,*/*;q=0.1"},redirect:"follow"});
      if (!r?.ok) continue;
      const bytes = new Uint8Array(await r.arrayBuffer()).slice(0,4096);
      const finalUrl = r.url && allowed(r.url) ? stripHash(r.url) : url;
      if (isPdf(bytes) && allowed(finalUrl)) return finalUrl;
    } catch (_) {}
  }
  throw new Error("official_pdf_binary_not_resolved");
}

async function fetchBytes(sourceUrl, fetchImpl = globalThis.fetch, maxBytes = MAX_PDF_BYTES) {
  const resolvedUrl = await resolveUrl(sourceUrl, fetchImpl);
  const r = await fetchImpl(resolvedUrl,{headers:{Accept:"application/pdf,*/*;q=0.1"},redirect:"follow"});
  if (!r?.ok) throw new Error("official_pdf_binary_not_resolved");
  const len = Number(r.headers?.get?.("content-length") || 0);
  if (len && len > maxBytes) throw new Error("official_pdf_too_large");
  const bytes = new Uint8Array(await r.arrayBuffer());
  if (bytes.length > maxBytes) throw new Error("official_pdf_too_large");
  if (!isPdf(bytes)) throw new Error("official_pdf_binary_not_resolved");
  return {bytes,resolvedUrl:r.url && allowed(r.url) ? stripHash(r.url) : resolvedUrl};
}

function textFrom(content) {
  return (content?.items || []).map(x=>typeof x?.str === "string" ? x.str : "").join(" ").replace(/\s+/g," ").trim();
}

function scope(pageTexts, heading, excludedHeading, minChars = MIN_GROUNDED_PAGE_CHARS) {
  const needle = normalize(heading);
  if (!needle || !normalize(pageTexts[0] || "").includes(needle)) return {ok:false,error:"official_pdf_verified_heading_not_found"};
  let text = pageTexts.join("\n\n");
  if (excludedHeading === "Πρόσθετο Υλικό") {
    const i = text.search(/Πρ[οό]σθετο\s+Υλικ[οό]/i);
    if (i < 0) return {ok:false,error:"official_pdf_exclusion_heading_not_found"};
    text = text.slice(0,i).trim();
  } else if (excludedHeading) return {ok:false,error:"official_pdf_exclusion_not_supported"};
  if (text.length < minChars) return {ok:false,error:"official_pdf_page_text_too_short",extractedChars:text.length};
  return {ok:true,text,extractedChars:text.length,exclusionApplied:!!excludedHeading};
}

// maxSpan: GEL sections stay ≤20 pages (default); EPAL chapter sections may pass up to 41.
async function extractVerifiedPdfPage({sourceUrl,pdfPage,pdfPageEnd,excludedHeading,verifiedHeading,fetchImpl,maxBytes=MAX_PDF_BYTES,minChars=MIN_GROUNDED_PAGE_CHARS,maxSpan=20}) {
  if (!allowed(sourceUrl)) return {ok:false,error:"official_pdf_url_not_allowed"};
  const start = Number(pdfPage), end = Number(pdfPageEnd ?? pdfPage);
  const span = Math.min(41, Math.max(1, Number(maxSpan) || 20));
  if (!Number.isInteger(start) || start < 1) return {ok:false,error:"official_pdf_page_invalid"};
  if (!Number.isInteger(end) || end < start || end-start >= span) return {ok:false,error:"official_pdf_page_range_invalid"};
  if (!String(verifiedHeading || "").trim()) return {ok:false,error:"official_pdf_heading_missing"};
  let doc, task, resolvedPdfUrl = stripHash(sourceUrl);
  try {
    const fetched = await fetchBytes(sourceUrl,fetchImpl || globalThis.fetch,maxBytes);
    resolvedPdfUrl = fetched.resolvedUrl;
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    task = pdfjs.getDocument({data:fetched.bytes,disableWorker:true,isEvalSupported:false,useSystemFonts:true});
    doc = await task.promise;
    if (end > doc.numPages) return {ok:false,error:"official_pdf_page_out_of_range",totalPages:doc.numPages,resolvedPdfUrl};
    const pages=[];
    for(let n=start;n<=end;n++){const p=await doc.getPage(n);pages.push(textFrom(await p.getTextContent()));p.cleanup();}
    const scoped=scope(pages,verifiedHeading,excludedHeading,minChars);
    if(!scoped.ok)return {...scoped,totalPages:doc.numPages,resolvedPdfUrl};
    return {ok:true,text:scoped.text,page:start,endPage:end,totalPages:doc.numPages,resolvedPdfUrl,extractedChars:scoped.text.length,exclusionApplied:scoped.exclusionApplied};
  } catch(err) {
    const e=String(err?.message||"");
    return {ok:false,error:["official_pdf_binary_not_resolved","official_pdf_too_large"].includes(e)?e:"official_pdf_text_extraction_failed",resolvedPdfUrl};
  } finally { try{await doc?.destroy?.();}catch(_){} try{await task?.destroy?.();}catch(_){} }
}

module.exports=Object.freeze({
  MAX_PDF_BYTES,MIN_GROUNDED_PAGE_CHARS,
  officialPdfSourceAllowed:allowed,
  normalizePdfText:normalize,
  directDownloadCandidate:directDownload,
  conventionalPdfCandidates:candidates,
  discoverPdfLinks:()=>[],
  isPdfBytes:isPdf,
  probePdfCandidate:async (u,f)=>{try{return await resolveUrl(u,f||globalThis.fetch)}catch(_){return null}},
  resolveOfficialPdfUrl:(u,o={})=>resolveUrl(u,o.fetchImpl||globalThis.fetch),
  fetchOfficialPdfBytes:async (u,o={})=>{const x=await fetchBytes(u,o.fetchImpl||globalThis.fetch,o.maxBytes||MAX_PDF_BYTES);return {...x,contentType:"application/pdf"}},
  extractVerifiedPdfPage,
  scopeVerifiedPdfText:scope,
  textContentToString:textFrom
});