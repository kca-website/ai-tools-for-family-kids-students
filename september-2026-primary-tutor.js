/** September 2026 Primary curriculum topics — data only, no DOM observers. */
(function(){
  "use strict";
  const current = window.AITOOLSKIDS_TUTOR_CATALOG;
  if (!current) return;

  const DATE = "2026-09-05";
  const SOURCE = "https://www.minedu.gov.gr/protovathmia/dimotiko?catid=2100%3Amenoy-protovathmia-defterovathmia&id=70765%3Adimotiko-analytika-programmata-odigies-didaskalias&view=article";
  const GRADE_EL = {a:"Α'",b:"Β'",c:"Γ'",d:"Δ'",e:"Ε'",st:"ΣΤ'"};
  const GRADE_EN = {a:"1st Grade",b:"2nd Grade",c:"3rd Grade",d:"4th Grade",e:"5th Grade",st:"6th Grade"};

  const LANGUAGE = {
    a:[["Κατανόηση μικρού κειμένου και σειρά γεγονότων","Understanding a short text and event order"],["Λεξιλόγιο μέσα από τα συμφραζόμενα","Vocabulary from context"],["Από την πρόταση στο μικρό κείμενο","From sentence to short text"],["Μικρά μηνύματα, περιγραφές και οδηγίες","Short messages, descriptions and instructions"]],
    b:[["Κύρια πληροφορία σε μικρό κείμενο","Main information in a short text"],["Σειρά και σύνδεση προτάσεων","Ordering and connecting sentences"],["Λεξιλόγιο μέσα στο κείμενο","Vocabulary in context"],["Σύντομη αφήγηση ή περιγραφή","Short narrative or description"]],
    c:[["Κύρια ιδέα και βασικές λεπτομέρειες","Main idea and key details"],["Οργάνωση παραγράφου","Paragraph organization"],["Συνδετικές λέξεις και συνοχή","Connectives and cohesion"],["Σκοπός ενός κειμένου","Text purpose"]],
    d:[["Κύρια ιδέα, λεπτομέρειες και τίτλος","Main idea, details and title"],["Συνοχή ανάμεσα στις προτάσεις","Sentence cohesion"],["Σημασία από τα συμφραζόμενα","Meaning from context"],["Περίληψη με δικά μου λόγια","Summarising in my own words"]],
    e:[["Δομή και οργάνωση κειμένου","Text structure and organization"],["Συνοχή και συνεκτικότητα","Cohesion and coherence"],["Σκοπός, αποδέκτης και ύφος","Purpose, audience and register"],["Περίληψη και παράφραση","Summary and paraphrase"],["Ισχυρισμός και τεκμήριο","Claim and evidence"]],
    st:[["Δομή, συνοχή και συνεκτικότητα","Structure, cohesion and coherence"],["Επικοινωνιακός σκοπός και ύφος","Communicative purpose and register"],["Περίληψη και πύκνωση πληροφοριών","Summary and information compression"],["Επιχείρημα, τεκμήριο και αντίλογος","Argument, evidence and counterargument"],["Πολυτροπικά κείμενα: πίνακες και εικόνες","Multimodal texts: tables and images"]]
  };
  const MATH = {
    a:[["Αριθμοί και σύγκριση ποσοτήτων","Numbers and comparing quantities"],["Πρόσθεση και αφαίρεση σε προβλήματα","Addition and subtraction in problems"],["Μοτίβα και απλή λογική","Patterns and simple reasoning"],["Σχήματα και βασικές μετρήσεις","Shapes and basic measurement"]],
    b:[["Θεσιακή αξία και σύγκριση αριθμών","Place value and number comparison"],["Πρόσθεση και αφαίρεση με στρατηγικές","Addition and subtraction strategies"],["Πρώτες σχέσεις πολλαπλασιασμού και διαίρεσης","Early multiplication and division"],["Μετρήσεις και απλά δεδομένα","Measurement and simple data"]],
    c:[["Πολλαπλασιασμός και διαίρεση","Multiplication and division"],["Κλάσμα ως μέρος του όλου","Fractions as part of a whole"],["Προβλήματα πολλών βημάτων","Multi-step problems"],["Γεωμετρία, μέτρηση και δεδομένα","Geometry, measurement and data"]],
    d:[["Πράξεις και εκτίμηση","Operations and estimation"],["Κλάσματα και δεκαδικοί σε καταστάσεις","Fractions and decimals in context"],["Μοντελοποίηση προβλήματος","Problem modelling"],["Περίμετρος, εμβαδόν και δεδομένα","Perimeter, area and data"]],
    e:[["Κλάσματα και δεκαδικοί","Fractions and decimals"],["Αναλογικές σχέσεις σε προβλήματα","Proportional relationships"],["Μετρήσεις και γεωμετρικός συλλογισμός","Measurement and geometric reasoning"],["Πίνακες, γραφήματα και δεδομένα","Tables, graphs and data"]],
    st:[["Κλάσματα, δεκαδικοί και ποσοστά","Fractions, decimals and percentages"],["Λόγοι, αναλογίες και προβλήματα πολλών βημάτων","Ratios, proportions and multi-step problems"],["Γεωμετρία και μετρήσεις με αιτιολόγηση","Geometry and measurement with reasoning"],["Δεδομένα και πιθανότητες","Data and probability"]]
  };
  const HISTORY = {
    c:[["Μύθος, ιστορική πληροφορία και πηγή","Myth, historical information and source"],["Χρονολογική σειρά","Chronological order"],["Τι μας δείχνει μια ιστορική πηγή;","What can a historical source show us?"]],
    d:[["Αρχαίος ελληνικός κόσμος και χρόνος","Ancient Greek world and chronology"],["Αιτία και αποτέλεσμα","Cause and effect"],["Σύγκριση δύο ιστορικών πηγών","Comparing two historical sources"]],
    e:[["Βυζαντινή περίοδος: συνέχεια και αλλαγή","Byzantine period: continuity and change"],["Χρονογραμμή και διαδοχή γεγονότων","Timeline and sequence"],["Όρια ενός ιστορικού τεκμηρίου","Limits of historical evidence"]],
    st:[["Νεότερη ελληνική ιστορία: αιτίες και συνέπειες","Modern Greek history: causes and consequences"],["Πολλαπλές οπτικές","Multiple perspectives"],["Τεκμηριωμένο συμπέρασμα από πηγή","Evidence-based conclusion from a source"]]
  };
  const SCIENCE = {
    a:[["Ζωντανό και μη ζωντανό","Living and non-living"],["Ανάγκες ζωντανών οργανισμών","Needs of living things"],["Παρατήρηση, καιρός και εποχές","Observation, weather and seasons"]],
    b:[["Φυσικό και ανθρωπογενές περιβάλλον","Natural and human-made environment"],["Φυτά, ζώα και τόπος ζωής","Plants, animals and habitats"],["Υπεύθυνη χρήση πόρων","Responsible use of resources"]],
    c:[["Σώμα, τροφή και ενέργεια","Body, food and energy"],["Παρατήρηση και διερεύνηση","Observation and investigation"],["Περιβάλλον και ανθρώπινες επιλογές","Environment and human choices"]],
    d:[["Οικοσύστημα και αλληλεπιδράσεις","Ecosystems and interactions"],["Φυσικοί πόροι","Natural resources"],["Χάρτης, τόπος και φυσικά χαρακτηριστικά","Map, place and natural features"]],
    e:[["Υλικά και ιδιότητες","Materials and properties"],["Ενέργεια, θερμότητα και μεταβολές","Energy, heat and change"],["Ζωντανοί οργανισμοί και συστήματα","Living organisms and systems"],["Πρόβλεψη, παρατήρηση, συμπέρασμα","Prediction, observation, conclusion"]],
    st:[["Δυνάμεις, κίνηση και ενέργεια","Forces, motion and energy"],["Ηλεκτρισμός και ασφάλεια","Electricity and safety"],["Οργανισμοί και οικοσυστήματα","Organisms and ecosystems"],["Διερεύνηση με δεδομένα","Evidence-based investigation"]]
  };

  function topics(subjectId, rows){
    return (rows || []).map((row,i)=>({id:`${subjectId}.topic-${i+1}`,labelEl:row[0],labelEn:row[1],explainEl:row[0],explainEn:row[1]}));
  }
  function subject(grade, type, labelEl, labelEn, rows, quizId){
    const id = `${type}-${grade}-dimotikou`;
    const list = topics(id, rows);
    return {
      id, quizId:quizId || null, grade,
      subjectLabelEl:`${labelEl}, ${GRADE_EL[grade]} Δημοτικού`,
      subjectLabelEn:`${labelEn}, ${GRADE_EN[grade]}`,
      topics:list,
      curriculum:{
        schoolYear:"2026-2027",
        coverageStatus:"annual-instructions-verified",
        coverageLabelEl:"Επαληθευμένες οδηγίες διδασκαλίας 2026–27",
        coverageLabelEn:"Verified 2026–27 teaching guidance",
        officialSectionsEl:list.map(x=>x.labelEl),
        officialSectionsEn:list.map(x=>x.labelEn),
        scopeNoteEl:"Θεματικές άγκυρες για διάλογο και εξάσκηση βάσει της επίσημης κατεύθυνσης 2026–27 — όχι αυτούσιοι τίτλοι κεφαλαίων ούτε πλήρης εξεταστέα ύλη.",
        scopeNoteEn:"Topic anchors for dialogue and practice based on the official 2026–27 guidance — not verbatim chapter titles or a complete examinable syllabus.",
        annualInstructionsStatus:"2026-27-verified",
        annualInstructionsUrl:SOURCE,
        catalogUrl:SOURCE,
        verificationDate:DATE
      }
    };
  }

  const primary = {};
  ["a","b","c","d","e","st"].forEach((grade)=>{
    const list = [
      subject(grade,"glossa","Νεοελληνική Γλώσσα","Modern Greek Language",LANGUAGE[grade],`glossa-${grade}-dimotikou`),
      subject(grade,"math","Μαθηματικά","Mathematics",MATH[grade],`math-${grade}-dimotikou`),
      subject(grade,"science",["a","b","c","d"].includes(grade)?"Μελέτη Περιβάλλοντος":"Φυσικές Επιστήμες","Science / Environment Studies",SCIENCE[grade],["e","st"].includes(grade)?`science-${grade}-dimotikou`:null)
    ];
    if (HISTORY[grade]) list.push(subject(grade,"history","Ιστορία","History",HISTORY[grade],`istoria-${grade}-dimotikou`));
    primary[grade] = list;
  });

  const oldZones = current.zones || {};
  const zones = Object.assign({}, oldZones, {primary});
  window.AITOOLSKIDS_TUTOR_CATALOG = Object.freeze({
    meta:Object.freeze(Object.assign({}, current.meta || {}, {schoolYear:"2026-2027",lastVerified:DATE,primaryReference:SOURCE})),
    zones:Object.freeze(zones),
    getSubjects(zoneId, gradeId){ return zones?.[zoneId]?.[gradeId] || []; },
    getSubject(zoneId, gradeId, subjectId){ return (zones?.[zoneId]?.[gradeId] || []).find(x=>x.id===subjectId || x.quizId===subjectId) || null; }
  });
  window.AITOOLSKIDS_PRIMARY_TUTOR_REFRESH = Object.freeze({updated:DATE,grades:Object.keys(primary),mode:"data-only"});
})();
