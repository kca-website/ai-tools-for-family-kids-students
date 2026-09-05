/** September 2026 Greek Language tutor topics — data only, no DOM observers. */
(function(){
  "use strict";
  const current = window.AITOOLSKIDS_TUTOR_CATALOG;
  if (!current) return;
  const DATE = "2026-09-05";

  const ROWS = {
    middle: {
      a: [["Κύρια ιδέα και βασικές πληροφορίες","Main idea and key information"],["Συνδετικές λέξεις και συνοχή","Connectives and cohesion"],["Σκοπός, αποδέκτης και ύφος","Purpose, audience and register"],["Λεξιλόγιο μέσα στα συμφραζόμενα","Vocabulary in context"],["Περίληψη χωρίς αντιγραφή","Summary without copying"]],
      b: [["Ισχυρισμός, παράδειγμα και τεκμήριο","Claim, example and evidence"],["Τρόποι ανάπτυξης παραγράφου","Paragraph development"],["Αναφορικές λέξεις και συνοχή","Reference words and cohesion"],["Πύκνωση και παράφραση","Condensing and paraphrasing"],["Προσαρμογή ύφους στον αποδέκτη","Adapting register"]],
      c: [["Θέση, επιχείρημα και τεκμήριο","Position, argument and evidence"],["Αντίλογος και αξιολόγηση επιχειρήματος","Counterargument and argument evaluation"],["Συνοχή και συνεκτικότητα","Cohesion and coherence"],["Περίληψη και ιεράρχηση πληροφοριών","Summary and prioritising information"],["Ρητό και υπονοούμενο νόημα","Explicit and implied meaning"]]
    },
    high: {
      a: [["Επικοινωνιακή περίσταση και ύφος","Communication context and register"],["Τρόποι ανάπτυξης παραγράφου","Paragraph development"],["Περίληψη και ουσιώδεις πληροφορίες","Summary and essential information"],["Ισχυρισμός και τεκμηρίωση","Claim and evidence"],["Γλωσσικές επιλογές και ύφος","Language choices and register"]],
      b: [["Δομή επιχειρηματολογικού κειμένου","Argumentative text structure"],["Εγκυρότητα επιχειρήματος και τεκμήριο","Argument validity and evidence"],["Δείκτες συνοχής και λογικές σχέσεις","Cohesion markers and logical relations"],["Παράφραση και ενσωμάτωση πηγής","Paraphrasing and source integration"],["Τροπικότητα και στάση συντάκτη","Modality and author stance"]],
      c: [["Περίληψη με ακρίβεια και οικονομία","Accurate concise summary"],["Θέση, επιχείρημα, τεκμήριο και αντίλογος","Position, argument, evidence and counterargument"],["Συνοχή και συνεκτικότητα μη λογοτεχνικού κειμένου","Cohesion and coherence in non-literary text"],["Μετασχηματισμός ύφους","Register transformation"],["Κριτική ανάγνωση πηγής","Critical source reading"]]
    }
  };

  function isGreekLanguage(subject){
    const s = `${subject?.subjectLabelEl || ""} ${subject?.id || ""}`.toLowerCase();
    return /νεοελλην|γλώσσα/.test(s) && !/αγγλ|english|ξέν/.test(s);
  }
  function findQuizId(zone,grade){
    if (typeof QUIZZES === "undefined") return null;
    const list = Object.values(QUIZZES[zone] || {});
    const q = list.find(item => (item.grades || []).includes(grade) && isGreekLanguage(item));
    return q?.id || null;
  }
  function topic(subjectId,row,i){
    return {id:`${subjectId}.topic-${i+1}`,labelEl:row[0],labelEn:row[1],explainEl:row[0],explainEn:row[1]};
  }

  const zones = Object.assign({}, current.zones || {});
  let updated = 0;
  ["middle","high"].forEach(zone=>{
    const zoneGrades = Object.assign({}, zones[zone] || {});
    ["a","b","c"].forEach(grade=>{
      const existing = current.getSubjects?.(zone,grade) || zoneGrades[grade] || [];
      const rows = ROWS[zone][grade] || [];
      if (!rows.length) return;
      let found = false;
      const next = existing.map(subject=>{
        if (!isGreekLanguage(subject)) return subject;
        found = true;
        const id = subject.id || `glossa-${grade}-${zone}`;
        return Object.assign({}, subject, {
          id,
          quizId: subject.quizId || findQuizId(zone,grade),
          topics: rows.map((row,i)=>topic(id,row,i)),
          curriculum: Object.assign({}, subject.curriculum || {}, {
            schoolYear:"2026-2027",
            verificationDate:DATE,
            coverageStatus:"annual-instructions-verified",
            coverageLabelEl:"Επαληθευμένες οδηγίες διδασκαλίας 2026–27",
            coverageLabelEn:"Verified 2026–27 teaching guidance",
            scopeNoteEl:"Θεματικές δεξιότητες για διάλογο και εξάσκηση βάσει της επίσημης κατεύθυνσης 2026–27 — όχι τεστ αποστήθισης γραμματικών όρων.",
            scopeNoteEn:"Skill-based dialogue and practice aligned with official 2026–27 guidance — not a grammar-term memorisation drill."
          })
        });
      });
      if (!found) {
        const id = `glossa-${grade}-${zone}`;
        next.push({
          id,
          quizId:findQuizId(zone,grade),
          grade,
          subjectLabelEl:`Νεοελληνική Γλώσσα, ${grade.toUpperCase()}' ${zone === "middle" ? "Γυμνασίου" : "Λυκείου"}`,
          subjectLabelEn:`Modern Greek Language, ${zone === "middle" ? "Middle" : "High"} ${grade.toUpperCase()}`,
          topics:rows.map((row,i)=>topic(id,row,i)),
          curriculum:{schoolYear:"2026-2027",verificationDate:DATE,coverageStatus:"annual-instructions-verified",coverageLabelEl:"Επαληθευμένες οδηγίες διδασκαλίας 2026–27",coverageLabelEn:"Verified 2026–27 teaching guidance"}
        });
      }
      zoneGrades[grade] = next;
      updated++;
    });
    zones[zone] = zoneGrades;
  });

  window.AITOOLSKIDS_TUTOR_CATALOG = Object.freeze({
    meta:Object.freeze(Object.assign({}, current.meta || {}, {schoolYear:"2026-2027",lastVerified:DATE})),
    zones:Object.freeze(zones),
    getSubjects(zoneId,gradeId){ return zones?.[zoneId]?.[gradeId] || []; },
    getSubject(zoneId,gradeId,subjectId){ return (zones?.[zoneId]?.[gradeId] || []).find(x=>x.id===subjectId || x.quizId===subjectId) || null; }
  });
  window.AITOOLSKIDS_LANGUAGE_TUTOR_REFRESH = Object.freeze({updated:DATE,gradeSets:updated,mode:"data-only"});
})();
