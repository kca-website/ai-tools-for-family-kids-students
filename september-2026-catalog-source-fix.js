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
})();
