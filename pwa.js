/* AI Tools 4 Kids — PWA wrapper + report-link patch */
(function(){
  "use strict";
  const core=document.createElement("script");
  core.src="/pwa-core.js";
  core.async=false;
  document.head.appendChild(core);

  const report=document.createElement("script");
  report.src="/report-link.js";
  report.async=false;
  document.head.appendChild(report);
})();
