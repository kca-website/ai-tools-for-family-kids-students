/**
 * Mobile copy refinement for AI Help lesson selectors.
 * Makes it clear that the control changes the selected grade/subject/topic;
 * it does not edit content. Desktop is untouched.
 *
 * Consolidation note: this file no longer reassigns window.AITutor.render.
 */
(function () {
  "use strict";

  const RENDER_EVENT = "aitools4kids:tutor-rendered";

  function isEnglish() {
    return !!document.getElementById("langEn")?.classList.contains("active") ||
      (document.documentElement.lang || "").toLowerCase().startsWith("en");
  }

  function applyLabel() {
    if (!window.matchMedia?.("(max-width: 700px)").matches) return;
    const settings = document.querySelector("#tutorMount .tutor-settings");
    const action = settings?.querySelector(".tutor-mobile-settings-action");
    if (!settings || !action) return;

    const open = settings.classList.contains("mobile-settings-open");
    action.textContent = open
      ? (isEnglish() ? "Close" : "Κλείσιμο")
      : (isEnglish() ? "Change selections" : "Αλλαγή επιλογών");
  }

  function schedule() {
    setTimeout(applyLabel, 0);
  }

  document.addEventListener(RENDER_EVENT, schedule);

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(".tutor-mobile-settings-toggle, #langEl, #langEn, .view-tab, .role-tab")) schedule();
  });

  document.addEventListener("change", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.matches("#tutorGrade, #tutorSubject, #tutorTopic, #tutorAge, #tutorConsent")) schedule();
  });

  applyLabel();
})();