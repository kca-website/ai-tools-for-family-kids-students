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

module.exports = Object.freeze({
  ...base,
  extractVerifiedPdfPage: async (args) => {
    await ensurePdfWorker();
    return base.extractVerifiedPdfPage(args);
  }
});
