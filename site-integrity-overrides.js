/**
 * site-integrity-overrides.js: refinement v3.1 (2026-08-29)
 * Loaded after all static data files and before tutor.js/app.js.
 * Purpose: keep access rules explicit, add safe browser-based learning alternatives,
 * make AI Help a universal recommendation, and add Environment Studies diagnostics.
 */
(function () {
  "use strict";

  const TODAY = "2026-08-29";

  function ensurePathTool(zone, role, entry, first = false) {
    const arr = PATHS?.[zone]?.[role]?.tools;
    if (!Array.isArray(arr)) return;
    const idx = arr.findIndex((x) => x.toolId === entry.toolId);
    if (idx >= 0) arr[idx] = Object.assign({}, arr[idx], entry);
    else if (first) arr.unshift(entry);
    else arr.push(entry);
  }
  function unique(arr) { return [...new Set((arr || []).filter(Boolean))]; }


  // Canonical PhET / Google Arts & Culture / Gemini for Education PATHS live in data.js.
  // Supplemental curriculum mappings are canonical in curriculum-data.js.

  // Environment Studies diagnostics moved to environment-studies-data.js.

  // v4: verified access-policy sync for dynamic cards (2026-08-29).
  if (typeof TOOLS !== "undefined" && TOOLS.chatgpt) {
    TOOLS.chatgpt.minAge = 13;
    TOOLS.chatgpt.minAgeNote = "13+ ή το υψηλότερο ελάχιστο όριο που απαιτείται στη χώρα. Κάτω των 18 απαιτείται άδεια γονέα/νόμιμου κηδεμόνα. Σε επιλέξιμους εφηβικούς λογαριασμούς ενεργοποιείται σταδιακά το ChatGPT for Teens· για σχολική μελέτη προτίμησε Study Mode.";
  }
  if (typeof TOOLS !== "undefined" && TOOLS.gemini) {
    TOOLS.gemini.minAge = 15;
    TOOLS.gemini.minAgeNote = "Προσωπικός Google Account στην Ελλάδα: 15+. Οι εποπτευόμενοι Family Link λογαριασμοί δεν έχουν πρόσβαση στις Gemini Apps στον ΕΟΧ. Τα Google AI plans στον ΕΟΧ απαιτούν 18+. Ξεχωριστά, το Gemini μέσω Google Workspace for Education μπορεί να διατίθεται σε όλες τις ηλικίες όταν το ενεργοποιεί το σχολείο.";
  }
  if (typeof TOOLS !== "undefined" && TOOLS.copilot) {
    TOOLS.copilot.minAge = 13;
    TOOLS.copilot.minAgeNote = "Study and Learn: 13+ μέσω Microsoft 365 Education (A1/A3/A5), με Copilot Chat και age-gating ενεργοποιημένα από το σχολείο. Για προσωπική χρήση ισχύουν οι τρέχοντες όροι/περιφερειακοί κανόνες της Microsoft.";
  }
  if (typeof TOOLS !== "undefined" && TOOLS.notebooklm) {
    TOOLS.notebooklm.name = "Gemini Notebook (πρώην NotebookLM)";
    TOOLS.notebooklm.url = "https://notebook.google.com/";
    TOOLS.notebooklm.minAge = 15;
    TOOLS.notebooklm.minAgeNote = "Προσωπική χρήση στην Ελλάδα: 15+ (όριο διαχείρισης Google Account). Μέσω Google Workspace for Education μπορεί να είναι διαθέσιμο σε μαθητές όλων των ηλικιών όταν το ενεργοποιεί το σχολείο. Ορισμένες προηγμένες λειτουργίες/πλάνα μπορεί να έχουν υψηλότερο όριο.";
  }
  if (typeof TOOLS !== "undefined" && TOOLS.perplexity) {
    TOOLS.perplexity.minAge = 13;
    TOOLS.perplexity.minAgeNote = "13+. Για ανήλικο 13–17 ετών, ο γονέας ή κηδεμόνας πρέπει να αποδεχθεί τους Όρους εκ μέρους του ανηλίκου πριν από τη χρήση. Κάτω των 13 η χρήση απαγορεύεται.";
  }
  // Keep mobile-only Erla out of the main web recommendations; retain its informational page only.
  Object.values(PATHS || {}).forEach((roles) => Object.values(roles || {}).forEach((p) => { if (Array.isArray(p?.tools)) p.tools = p.tools.filter((x) => x.toolId !== "erla"); }));
  Object.values(CURRICULUM || {}).forEach((subjects) => Object.values(subjects || {}).forEach((s) => { if (Array.isArray(s?.toolIds)) s.toolIds = s.toolIds.filter((id) => id !== "erla"); }));

  // Expose a small audit snapshot for console/debugging without sending data anywhere.
  window.AITOOLSKIDS_INTEGRITY = Object.freeze({ version:"4.0.0", updated:TODAY, environmentQuizzes:4, newGapTags:20, addedTools:["ai-help","phet","google-arts-culture","gemini-education"] });
})();
