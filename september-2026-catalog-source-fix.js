/** Correct source URLs for the September 2026 tutor catalog. */
(function () {
  "use strict";
  const current = window.AITOOLSKIDS_TUTOR_CATALOG;
  if (!current?.zones) return;

  const SOURCES = {
    primary: "https://www.minedu.gov.gr/protovathmia/dimotiko?catid=2100%3Amenoy-protovathmia-defterovathmia&id=70765%3Adimotiko-analytika-programmata-odigies-didaskalias&view=article",
    middle: current.meta?.middleIndex || "https://dide.ira.sch.gr/ekpedevtika-themata/ekp260828/",
    high: "https://www.iep.edu.gr/yli-odigies-tropos-axiologisis/"
  };

  const zones = {};
  Object.entries(current.zones).forEach(([zoneId, grades]) => {
    zones[zoneId] = {};
    Object.entries(grades || {}).forEach(([gradeId, subjects]) => {
      zones[zoneId][gradeId] = (subjects || []).map((subject) => {
        if (!subject?.curriculum) return subject;
        return Object.assign({}, subject, {
          curriculum: Object.assign({}, subject.curriculum, {
            annualInstructionsUrl: SOURCES[zoneId] || subject.curriculum.annualInstructionsUrl || null,
            catalogUrl: SOURCES[zoneId] || subject.curriculum.catalogUrl || null,
            verificationDate: "2026-09-05"
          })
        });
      });
    });
  });

  // The app's real sixth-grade id is "st", while the September content layer used
  // the temporary key "f". Normalize it here so ΣΤ' Δημοτικού gets the new topics.
  if (zones.primary?.f) {
    const quizByType = {
      glossa: "glossa-st-dimotikou",
      math: "math-st-dimotikou",
      science: "science-st-dimotikou",
      history: "istoria-st-dimotikou"
    };
    zones.primary.st = zones.primary.f.map((subject) => {
      const type = subject.id.startsWith("glossa-") ? "glossa"
        : subject.id.startsWith("math-") ? "math"
        : subject.id.startsWith("science-") ? "science"
        : subject.id.startsWith("history-") ? "history"
        : null;
      return Object.assign({}, subject, {
        id: subject.id.replace("-f-", "-st-"),
        quizId: type ? quizByType[type] : subject.quizId,
        grade: "st",
        subjectLabelEl: (subject.subjectLabelEl || "").replace("F' Δημοτικού", "ΣΤ' Δημοτικού"),
        subjectLabelEn: (subject.subjectLabelEn || "").replace("Primary F", "Primary 6th Grade")
      });
    });
    delete zones.primary.f;
  }

  window.AITOOLSKIDS_TUTOR_CATALOG = Object.freeze({
    meta: Object.freeze(Object.assign({}, current.meta || {}, {
      lastVerified: "2026-09-05",
      primaryReference: SOURCES.primary,
      middleReference: SOURCES.middle,
      highReference: SOURCES.high
    })),
    zones: Object.freeze(zones),
    getSubjects(zoneId, gradeId) { return zones?.[zoneId]?.[gradeId] || []; },
    getSubject(zoneId, gradeId, subjectId) {
      return (zones?.[zoneId]?.[gradeId] || []).find((x) => x.id === subjectId || x.quizId === subjectId) || null;
    }
  });

  // site-postfix.js still contains the previous 30 Aug audit label and runs later.
  // Keep the verified 5 Sep date authoritative even if a later handler rewrites it.
  function desiredAuditFooter() {
    const en = !!document.getElementById("langEn")?.classList.contains("active");
    return en
      ? "Tools last checked: 5 September 2026"
      : "Τελευταίος έλεγχος εργαλείων: 5 Σεπτεμβρίου 2026";
  }

  function fixAuditFooter() {
    const el = document.querySelector(".site-footer__last-checked");
    if (!el) return;
    const desired = desiredAuditFooter();
    if (el.textContent.trim() !== desired) el.textContent = desired;
  }

  function watchAuditFooter() {
    const el = document.querySelector(".site-footer__last-checked");
    if (!el || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(() => {
      const desired = desiredAuditFooter();
      if (el.textContent.trim() !== desired) el.textContent = desired;
    });
    observer.observe(el, { childList: true, characterData: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    fixAuditFooter();
    watchAuditFooter();
  });
  window.addEventListener("load", () => setTimeout(fixAuditFooter, 0));
  ["langEl", "langEn"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", () => setTimeout(fixAuditFooter, 0));
  });
})();
