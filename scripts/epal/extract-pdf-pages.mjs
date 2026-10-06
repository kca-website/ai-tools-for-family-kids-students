// Downloads official ebooks.edu.gr PDFs and caches their per-page text (same text
// function as api/official-pdf-text-v2.js) plus line/heading-size hints for the
// chapter locator. Cache dir: EPAL_PDF_CACHE (default: .cache/epal-pdf, git-ignored).
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { ROOT } from "./lib.mjs";

export const CACHE = process.env.EPAL_PDF_CACHE || path.join(ROOT, ".cache/epal-pdf");

export function cachePath(downloadUrl) {
  return path.join(CACHE, path.basename(new URL(downloadUrl).pathname).replace(/\.pdf$/i, "") + ".json.gz");
}

export function readPages(downloadUrl) {
  const p = cachePath(downloadUrl);
  return fs.existsSync(p) ? JSON.parse(zlib.gunzipSync(fs.readFileSync(p)).toString("utf8")) : null;
}

async function extract(downloadUrl) {
  const out = cachePath(downloadUrl);
  if (fs.existsSync(out)) return "cached";
  const res = await fetch(downloadUrl, { headers: { Accept: "application/pdf" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = new Uint8Array(await res.arrayBuffer());
  if (!(data[0] === 37 && data[1] === 80 && data[2] === 68 && data[3] === 70)) throw new Error("not a pdf");
  const byteLength = data.length;
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false, useSystemFonts: true, verbosity: 0 }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    const items = (content.items || []).filter((x) => typeof x?.str === "string");
    const t = items.map((x) => x.str).join(" ").replace(/\s+/g, " ").trim();
    const lines = [];
    let cur = "", y = null, h = 0;
    for (const it of items) {
      const iy = Math.round(it.transform[5]);
      const ih = Math.round(Math.abs(it.transform[3]));
      if (y !== null && Math.abs(iy - y) > 2) { if (cur.trim()) lines.push([h, cur.replace(/\s+/g, " ").trim()]); cur = ""; h = 0; }
      cur += it.str + " "; y = iy; h = Math.max(h, ih);
    }
    if (cur.trim()) lines.push([h, cur.replace(/\s+/g, " ").trim()]);
    pages.push({ t, lines: lines.slice(0, 40) });
    page.cleanup();
  }
  const numPages = doc.numPages;
  await doc.destroy();
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(out, zlib.gzipSync(JSON.stringify({ downloadUrl, bytes: byteLength, numPages, pages })));
  return `ok ${numPages}p ${(byteLength / 1e6).toFixed(1)}MB`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const urls = fs.readFileSync(process.argv[2], "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
  const concurrency = Number(process.env.CONCURRENCY || 4);
  let i = 0, done = 0;
  async function worker() {
    while (i < urls.length) {
      const url = urls[i++];
      for (let attempt = 1; attempt <= 3; attempt++) {
        try { const r = await extract(url); console.log(`[${++done}/${urls.length}] ${r} ${path.basename(url)}`); break; }
        catch (e) { if (attempt === 3) console.log(`[${++done}/${urls.length}] FAIL ${e.message} ${path.basename(url)}`); else await new Promise((r) => setTimeout(r, 2000 * attempt)); }
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
}
