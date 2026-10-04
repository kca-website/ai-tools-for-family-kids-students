/** September 2026 Greek Language tutor topics — data only, no DOM observers. */
(function(){
  "use strict";
  const current = window.AITOOLSKIDS_TUTOR_CATALOG;
  if (!current) return;
  const DATE = "2026-09-21";
  const SOURCE = {
    middle:"https://dide.ira.sch.gr/ekpedevtika-themata/ekp260828/",
    high:"https://dide.ira.sch.gr/ekpedevtika-themata/ekp260810/"
  };
  const SOURCE_LABEL = {
    middle:"Επίσημες οδηγίες Νεοελληνικής Γλώσσας και Γραμματείας Γυμνασίου 2026–27",
    high:"Επίσημες οδηγίες Νεοελληνικής Γλώσσας και Λογοτεχνίας ΓΕΛ 2026–27"
  };

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

  // AI Study is fail-closed on an exact official schoolbook source. The skill-based
  // annual-guidance labels above are useful for tutoring, but B Gymnasium Greek's
  // server resolver is deliberately unit-based (1η–9η ενότητα). On /study, expose
  // the exact official textbook units instead of offering a skill label that the
  // source resolver cannot safely map to one textbook excerpt.
  const STUDY_B_GYM_BOOK_UNITS = [
    ["1η ενότητα — Από τον τόπο μου σ' όλη την Ελλάδα","Unit 1 — From my local area across Greece"],
    ["2η ενότητα — Ζούμε με την οικογένεια","Unit 2 — Living with the family"],
    ["3η ενότητα — Φίλοι για πάντα","Unit 3 — Friends forever"],
    ["4η ενότητα — Το σχολείο στο χρόνο...","Unit 4 — School through time..."],
    ["5η ενότητα — Συζητώντας για την εργασία και το επάγγελμα","Unit 5 — Discussing work and professions"],
    ["6η ενότητα — Παρακολουθώ, ενημερώνομαι και ψυχαγωγούμαι από διάφορες πηγές (ΜΜΕ, Διαδίκτυο κτλ.)","Unit 6 — Information and entertainment from media and the internet"],
    ["7η ενότητα — Βιώνοντας προβλήματα της καθημερινής ζωής","Unit 7 — Experiencing everyday-life problems"],
    ["8η ενότητα — Συζητώντας για σύγχρονα κοινωνικά θέματα","Unit 8 — Discussing modern social issues"],
    ["9η ενότητα — Ταξίδι στο μαγικό κόσμο του διαστήματος","Unit 9 — A journey into the magical world of space"]
  ];

  function isStudyPage(){
    try { return location.pathname === "/study.html" || location.pathname === "/study"; }
    catch (_) { return false; }
  }
  function rowsForContext(subjectId, rows){
    return isStudyPage() && subjectId === "glossa-b-gymnasiou" ? STUDY_B_GYM_BOOK_UNITS : rows;
  }

  function isGreekLanguage(subject){
    // accent-insensitive; Ancient Greek and Latin are separate courses, not Modern Greek language
    const s = `${subject?.subjectLabelEl || ""} ${subject?.id || ""}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return /νεοελλην|γλωσσα/.test(s) && !/αγγλ|english|ξεν|αρχαι|λατιν/.test(s);
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
        const effectiveRows = rowsForContext(id, rows);
        return Object.assign({}, subject, {
          id,
          quizId: subject.quizId || findQuizId(zone,grade),
          topics: effectiveRows.map((row,i)=>topic(id,row,i)),
          curriculum: Object.assign({}, subject.curriculum || {}, {
            schoolYear:"2026-2027",
            verificationDate:DATE,
            coverageStatus:"annual-guidance-detailed-map",
            annualInstructionsStatus:"2026-27-guidance-published",
            coverageLabelEl:"Θεματικός χάρτης βάσει επίσημων οδηγιών 2026–27",
            coverageLabelEn:"Topic map based on official 2026–27 guidance",
            annualInstructionsUrl:SOURCE[zone],
            catalogUrl:SOURCE[zone],
            sourceLabelEl:SOURCE_LABEL[zone],
            sourceLabelEn:zone==="middle"?"Official 2026–27 Middle School Modern Greek guidance":"Official 2026–27 GEL Modern Greek guidance",
            scopeNoteEl:"Θεματικές δεξιότητες για διάλογο και εξάσκηση βάσει της επίσημης κατεύθυνσης 2026–27 — όχι τεστ αποστήθισης γραμματικών όρων.",
            scopeNoteEn:"Skill-based dialogue and practice aligned with official 2026–27 guidance — not a grammar-term memorisation drill."
          })
        });
      });
      if (!found) {
        const id = `glossa-${grade}-${zone}`;
        const effectiveRows = rowsForContext(id, rows);
        next.push({
          id,
          quizId:findQuizId(zone,grade),
          grade,
          subjectLabelEl:`Νεοελληνική Γλώσσα, ${grade.toUpperCase()}' ${zone === "middle" ? "Γυμνασίου" : "Λυκείου"}`,
          subjectLabelEn:`Modern Greek Language, ${zone === "middle" ? "Middle" : "High"} ${grade.toUpperCase()}`,
          topics:effectiveRows.map((row,i)=>topic(id,row,i)),
          curriculum:{schoolYear:"2026-2027",verificationDate:DATE,coverageStatus:"annual-guidance-detailed-map",annualInstructionsStatus:"2026-27-guidance-published",coverageLabelEl:"Θεματικός χάρτης βάσει επίσημων οδηγιών 2026–27",coverageLabelEn:"Topic map based on official 2026–27 guidance",annualInstructionsUrl:SOURCE[zone],catalogUrl:SOURCE[zone],sourceLabelEl:SOURCE_LABEL[zone],sourceLabelEn:zone==="middle"?"Official 2026–27 Middle School Modern Greek guidance":"Official 2026–27 GEL Modern Greek guidance",scopeNoteEl:"Θεματικές δεξιότητες για διάλογο και εξάσκηση βάσει της επίσημης κατεύθυνσης 2026–27 — όχι τεστ αποστήθισης γραμματικών όρων.",scopeNoteEn:"Skill-based dialogue and practice aligned with official 2026–27 guidance — not a grammar-term memorisation drill."}
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
