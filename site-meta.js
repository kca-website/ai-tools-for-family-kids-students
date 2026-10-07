/** Canonical public maintenance metadata. Do not use deploy dates as tool-review dates. */
window.AITOOLSKIDS_SITE_META = Object.freeze({
  version: 2,
  toolCatalogAuditDate: "2026-09-28",
  toolCatalogAuditLabelEl: "Τελευταίος πλήρης έλεγχος καταλόγου εργαλείων: 28 Σεπτεμβρίου 2026",
  toolCatalogAuditLabelEn: "Last full tool-catalog review: 28 September 2026",
  signLanguageConceptCount: 167,
  canonicalToolCount: 43,
  publicAgeRange: "4–18"
});

/** Homepage cleanup: keep the full tools catalogue only inside "Discover more". */
(function(){
  if(location.pathname !== "/" && location.pathname !== "") return;

  function removeDuplicateAllToolsCta(){
    document.querySelectorAll('a').forEach(function(link){
      if(link.closest("#homeV9More")) return;
      var text=(link.textContent || "").replace(/\s+/g," ").trim();
      var isDuplicate = text.indexOf("Δες όλα τα AI εργαλεία") !== -1 ||
        text.indexOf("Άνοιξε τον πλήρη κατάλογο με αναζήτηση και φίλτρα") !== -1 ||
        text.indexOf("See all AI tools") !== -1 ||
        text.indexOf("Open the full catalogue with search and filters") !== -1 ||
        text.indexOf("Open the full catalog with search and filters") !== -1;
      if(isDuplicate) link.remove();
    });
  }

  function start(){
    removeDuplicateAllToolsCta();
    if(!("MutationObserver" in window)) return;
    new MutationObserver(removeDuplicateAllToolsCta).observe(document.documentElement,{childList:true,subtree:true});
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();

/** Load the small Play & Learn bridge without changing the core app/navigation. */
(function(){
  var s=document.createElement("script");
  s.src="/play-integration.js";
  s.async=false;
  document.head.appendChild(s);
})();

/** Local-only debug snapshot; no analytics or network transmission. */
window.AITOOLSKIDS_INTEGRITY = Object.freeze({
  version: "4.1.0",
  updated: "2026-09-20",
  environmentQuizzes: 4,
  environmentGapTags: 20,
  canonicalSupplementalTools: ["ai-help","phet","google-arts-culture","gemini-education"]
});