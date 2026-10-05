"use strict";

const base = require("./official-pdf-text-v2.js");
let workerReady;

async function ensurePdfWorker() {
  if (globalThis.pdfjsWorker?.WorkerMessageHandler) return;
  if (!workerReady) {
    workerReady = import("pdfjs-dist/legacy/build/pdf.worker.mjs").then((worker) => {
      globalThis.pdfjsWorker = worker;
    });
  }
  await workerReady;
}

async function extractVerifiedPdfPage(args = {}) {
  await ensurePdfWorker();
  const first = await base.extractVerifiedPdfPage(args);
  if (first?.ok || first?.error !== "official_pdf_page_text_too_short") return first;

  const start = Number(args.pdfPage);
  const requestedEnd = Number(args.pdfPageEnd ?? args.pdfPage);
  if (!Number.isInteger(start) || !Number.isInteger(requestedEnd) || requestedEnd < start) return first;

  // A verified unit can start on a sparse title/activity page. If the heading
  // is verified but the page is just too short for safe grounding, extend by
  // exactly one adjacent official page instead of weakening the minimum text
  // threshold. The v2 extractor still enforces heading and range checks.
  const retry = await base.extractVerifiedPdfPage({ ...args, pdfPageEnd: requestedEnd + 1 });
  return retry?.ok ? { ...retry, autoExtendedForGrounding: true } : first;
}

module.exports = Object.freeze({
  ...base,
  extractVerifiedPdfPage
});
