"use strict";

const MAX_PDF_BYTES = 35 * 1024 * 1024;
const MAX_DISCOVERY_LINKS = 8;
const MIN_GROUNDED_PAGE_CHARS = 250;

function officialPdfSourceAllowed(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" &&
      /(^|\.)ebooks\.edu\.gr$/i.test(url.hostname) &&
      (/\/ebooks\/v\/pdf\//i.test(url.pathname) || /\/ebooks\/d\//i.test(url.pathname));
  } catch (_) {
    return false;
  }
}

function stripFragment(value) {
  const url = new URL(String(value || ""));
  url.hash = "";
  return url.toString();
}

function normalizePdfText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9α-ω]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function directDownloadCandidate(sourceUrl) {
  try {
    const url = new URL(stripFragment(sourceUrl));
    const match = url.pathname.match(/\/ebooks\/v\/pdf\/(\d+)\/(\d+)\/([^/]+)\/?$/i);
    if (!match) return "";
    const [, collection, manifestation, name] = match;
    return `${url.origin}/ebooks/d/${collection}/${manifestation}/${name}.pdf`;
  } catch (_) {
    return "";
  }
}

function conventionalPdfCandidates(sourceUrl) {
  if (!officialPdfSourceAllowed(sourceUrl)) return [];
  const url = new URL(stripFragment(sourceUrl));
  const out = [];
  const direct = directDownloadCandidate(url.toString());
  if (direct) out.push(direct);
  const cleanPath = url.pathname.replace(/\/+$/, "");
  const baseName = cleanPath.split("/").filter(Boolean).pop() || "";
  if (baseName && !/\.pdf$/i.test(baseName)) {
    const sibling = new URL(url.toString());
    sibling.pathname = cleanPath + ".pdf";
    out.push(sibling.toString());
    const inside = new URL(url.toString());
    inside.pathname = cleanPath + "/" + baseName + ".pdf";
    out.push(inside.toString());
  }
  out.push(url.toString());
  return [...new Set(out.filter(officialPdfSourceAllowed))];
}

function discoverPdfLinks(html, baseUrl) {
  const source = String(html || "");
  if (!source) return [];
  const found = [];
  const add = (candidate) => {
    if (!candidate || found.length >= MAX_DISCOVERY_LINKS) return;
    try {
      const absolute = new URL(String(candidate).trim(), baseUrl).toString();
      if (!officialPdfSourceAllowed(absolute)) return;
      if (!/\.pdf(?:$|[?#])/i.test(absolute)) return;
      const clean = stripFragment(absolute);
      if (!found.includes(clean)) found.push(clean);
    } catch (_) {}
  };
  const attrRe = /\b(?:href|src|data)\s*=\s*["']([^"']+\.pdf(?:[?#][^"']*)?)["']/gi;
  let match;
  while ((match = attrRe.exec(source))) add(match[1]);
  const plainRe = /https:\/\/[^\s"'<>]+\.pdf(?:[?#][^\s"'<>]*)?/gi;
  while ((match = plainRe.exec(source))) add(match[0]);
  return found;
}

async function readResponseBytesLimited(response, maxBytes = MAX_PDF_BYTES) {
  const length = Number(response.headers?.get?.("content-length") || 0);
  if (Number.isFinite(length) && length > maxBytes) throw new Error("official_pdf_too_large");
  if (!response.body?.getReader) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new Error("official_pdf_too_large");
    return bytes;
  }
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.byteLength) continue;
      total += value.byteLength;
      if (total > maxBytes) throw new Error("official_pdf_too_large");
      chunks.push(value);
    }
  } finally {
    try { reader.releaseLock(); } catch (_) {}
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function isPdfBytes(bytes) {
  return bytes instanceof Uint8Array && bytes.byteLength >= 5 &&
    bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
}

async function probePdfCandidate(candidate, fetchImpl) {
  try {
    const response = await fetchImpl(candidate, {
      headers: {
        "User-Agent": "aitools4kids.gr educational source grounding",
        "Accept": "application/pdf,*/*;q=0.1",
        "Range": "bytes=0-4095"
      },
      redirect: "follow"
    });
    if (!response?.ok) return null;
    const finalUrl = response.url && officialPdfSourceAllowed(response.url) ? stripFragment(response.url) : candidate;
    if (!officialPdfSourceAllowed(finalUrl)) return null;
    let bytes = new Uint8Array();
    if (response.body?.getReader) {
      const reader = response.body.getReader();
      try {
        const first = await reader.read();
        if (first?.value) bytes = first.value instanceof Uint8Array ? first.value : new Uint8Array(first.value);
        try { await reader.cancel(); } catch (_) {}
      } finally {
        try { reader.releaseLock(); } catch (_) {}
      }
    } else {
      bytes = new Uint8Array(await response.arrayBuffer()).slice(0, 4096);
    }
    return isPdfBytes(bytes) ? finalUrl : null;
  } catch (_) {
    return null;
  }
}

async function resolveOfficialPdfUrl(sourceUrl, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") throw new Error("fetch_unavailable");
  if (!officialPdfSourceAllowed(sourceUrl)) throw new Error("official_pdf_url_not_allowed");
  const candidates = conventionalPdfCandidates(sourceUrl);
  for (const candidate of candidates) {
    if (!/\.pdf$/i.test(new URL(candidate).pathname)) continue;
    const probed = await probePdfCandidate(candidate, fetchImpl);
    if (probed) return probed;
  }
  for (const candidate of candidates) {
    if (/\.pdf$/i.test(new URL(candidate).pathname)) continue;
    try {
      const response = await fetchImpl(candidate, {
        headers: {"User-Agent":"aitools4kids.gr educational source grounding","Accept":"text/html,application/xhtml+xml;q=0.9,*/*;q=0.1"},
        redirect: "follow"
      });
      if (!response?.ok) continue;
      const type = String(response.headers?.get?.("content-type") || "").toLowerCase();
      if (!type.includes("text/html") && !type.includes("application/xhtml")) continue;
      const html = await response.text();
      for (const discovered of discoverPdfLinks(html.slice(0, 1024 * 1024), response.url || candidate)) {
        const probed = await probePdfCandidate(discovered, fetchImpl);
        if (probed) return probed;
      }
    } catch (_) {}
  }
  throw new Error("official_pdf_binary_not_resolved");
}

async function fetchOfficialPdfBytes(sourceUrl, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") throw new Error("fetch_unavailable");
  const resolvedUrl = await resolveOfficialPdfUrl(sourceUrl, { fetchImpl });
  const response = await fetchImpl(resolvedUrl, {
    headers: {"User-Agent":"aitools4kids.gr educational source grounding","Accept":"application/pdf,*/*;q=0.1"},
    redirect: "follow"
  });
  if (!response?.ok) throw new Error("official_pdf_binary_not_resolved");
  const bytes = await readResponseBytesLimited(response, options.maxBytes || MAX_PDF_BYTES);
  if (!isPdfBytes(bytes)) throw new Error("official_pdf_binary_not_resolved");
  return { bytes, resolvedUrl: response.url && officialPdfSourceAllowed(response.url) ? stripFragment(response.url) : resolvedUrl, contentType: response.headers?.get?.("content-type") || "application/pdf" };
}

async function loadPdfJs() {
  return import("pdfjs-dist/legacy/build/pdf.mjs");
}

function textContentToString(content) {
  const parts = [];
  for (const item of content?.items || []) {
    if (typeof item?.str !== "string") continue;
    const value = item.str.replace(/\s+/g, " ").trim();
    if (value) parts.push(value + (item.hasEOL ? "\n" : " "));
  }
  return parts.join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function scopeVerifiedPdfText(pageTexts, verifiedHeading, excludedHeading, minChars = MIN_GROUNDED_PAGE_CHARS) {
  const heading = normalizePdfText(verifiedHeading);
  if (!heading || !normalizePdfText(pageTexts[0] || "").includes(heading)) return {ok:false,error:"official_pdf_verified_heading_not_found"};
  let text = pageTexts.join("\n\n");
  let exclusionApplied = false;
  if (excludedHeading === "Πρόσθετο Υλικό") {
    const boundary = text.search(/(?:^|\s)Πρ[οό]σθετο\s+Υλικ[οό](?=\s|$)/mi);
    if (boundary >= 0) { text = text.slice(0, boundary).trim(); exclusionApplied = true; }
    else return {ok:false,error:"official_pdf_exclusion_heading_not_found"};
  } else if (excludedHeading) return {ok:false,error:"official_pdf_exclusion_not_supported"};
  if (text.length < minChars) return {ok:false,error:"official_pdf_page_text_too_short",extractedChars:text.length};
  return {ok:true,text,exclusionApplied,extractedChars:text.length};
}

async function extractVerifiedPdfPage({sourceUrl,pdfPage,pdfPageEnd,excludedHeading,verifiedHeading,fetchImpl,minChars = MIN_GROUNDED_PAGE_CHARS}) {
  if (!officialPdfSourceAllowed(sourceUrl)) return {ok:false,error:"official_pdf_url_not_allowed"};
  const pageNumber = Number(pdfPage);
  const endPageNumber = Number(pdfPageEnd ?? pdfPage);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) return {ok:false,error:"official_pdf_page_invalid"};
  if (!Number.isInteger(endPageNumber) || endPageNumber < pageNumber || endPageNumber - pageNumber >= 20) return {ok:false,error:"official_pdf_page_range_invalid"};
  const heading = String(verifiedHeading || "").trim();
  if (!heading) return {ok:false,error:"official_pdf_heading_missing"};
  let resolvedPdfUrl = stripFragment(sourceUrl);
  let loadingTask;
  let document;
  try {
    resolvedPdfUrl = await resolveOfficialPdfUrl(sourceUrl, { fetchImpl });
    const pdfjs = await loadPdfJs();
    loadingTask = pdfjs.getDocument({
      url: resolvedPdfUrl,
      disableWorker: true,
      disableRange: false,
      disableStream: true,
      disableAutoFetch: true,
      isEvalSupported: false,
      useSystemFonts: true,
      rangeChunkSize: 128 * 1024
    });
    document = await loadingTask.promise;
    if (endPageNumber > document.numPages) return {ok:false,error:"official_pdf_page_out_of_range",totalPages:document.numPages,resolvedPdfUrl};
    const pageTexts = [];
    for (let n = pageNumber; n <= endPageNumber; n++) {
      const page = await document.getPage(n);
      pageTexts.push(textContentToString(await page.getTextContent()));
      page.cleanup();
    }
    const scoped = scopeVerifiedPdfText(pageTexts, heading, excludedHeading, minChars);
    if (!scoped.ok) return {...scoped,totalPages:document.numPages,resolvedPdfUrl};
    return {ok:true,text:scoped.text,page:pageNumber,endPage:endPageNumber,exclusionApplied:scoped.exclusionApplied,totalPages:document.numPages,resolvedPdfUrl,extractedChars:scoped.text.length};
  } catch (err) {
    return {ok:false,error:err?.message === "official_pdf_binary_not_resolved" ? "official_pdf_binary_not_resolved" : "official_pdf_text_extraction_failed",resolvedPdfUrl};
  } finally {
    try { await document?.destroy?.(); } catch (_) {}
    try { await loadingTask?.destroy?.(); } catch (_) {}
  }
}

module.exports = Object.freeze({
  MAX_PDF_BYTES,
  MIN_GROUNDED_PAGE_CHARS,
  officialPdfSourceAllowed,
  normalizePdfText,
  directDownloadCandidate,
  conventionalPdfCandidates,
  discoverPdfLinks,
  isPdfBytes,
  probePdfCandidate,
  resolveOfficialPdfUrl,
  fetchOfficialPdfBytes,
  extractVerifiedPdfPage,
  scopeVerifiedPdfText,
  textContentToString
});