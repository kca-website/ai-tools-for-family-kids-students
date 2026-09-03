/* Replace the public GitHub issue link with the internal report form. */
(function(){
  "use strict";

  const ISSUE_PART="github.com/kca-website/ai-tools-for-family-kids-students/issues/new";

  function patchReportLinks(){
    document.querySelectorAll(`a[href*="${ISSUE_PART}"]`).forEach((link)=>{
      const source=encodeURIComponent(location.href);
      link.href=`/report-error.html?source=${source}`;
      link.removeAttribute("target");
      link.removeAttribute("rel");
    });
  }

  patchReportLinks();
  document.addEventListener("DOMContentLoaded",patchReportLinks,{once:true});

  const observer=new MutationObserver(patchReportLinks);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),15000);
})();
