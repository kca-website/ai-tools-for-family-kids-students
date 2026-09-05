/* AI Tools 4 Kids: PWA wrapper + lightweight data patches */
(function(){
  "use strict";

  // Data-only audit. No DOM scanning, timers or MutationObserver.
  const audit=document.createElement("script");
  audit.src="/september-2026-tool-audit.js";
  audit.async=false;
  document.head.appendChild(audit);

  // Primary 2026-27 Tutor catalog only. Data-only; no quiz/UI mutations.
  const primaryTutor=document.createElement("script");
  primaryTutor.src="/september-2026-primary-tutor.js";
  primaryTutor.async=false;
  document.head.appendChild(primaryTutor);

  const core=document.createElement("script");
  core.src="/pwa-core.js";
  core.async=false;
  document.head.appendChild(core);

  const report=document.createElement("script");
  report.src="/report-link.js";
  report.async=false;
  document.head.appendChild(report);
})();
