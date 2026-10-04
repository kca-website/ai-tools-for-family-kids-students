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

  function installPrimaryStudyReview(){
    if(!isStudyPage() || window.__AITOOLSKIDS_PRIMARY_REVIEW__) return;
    window.__AITOOLSKIDS_PRIMARY_REVIEW__=true;
    const nativeFetch=window.fetch.bind(window);
    window.fetch=async function(input,init){
      const url=typeof input==="string"?input:String(input?.url||"");
      const isTutor=url==="/api/tutor-assistant"||url.endsWith("/api/tutor-assistant");
      if(!isTutor || !init || typeof init.body!=="string") return nativeFetch(input,init);
      let payload=null;
      try{ payload=JSON.parse(init.body); }catch(_){ return nativeFetch(input,init); }
      const primary=payload?.audience==="study_user" && /-dimotikou$/i.test(String(payload?.subjectId||""));
      const aiOnly=primary && payload?.documentKind!=="official_schoolbook" && payload?.documentKind!=="user_upload";
      if(!aiOnly) return nativeFetch(input,init);
      const safetyRule=(document.documentElement.lang||"el").startsWith("en")
        ? "PRIMARY AI-ONLY MODE: this topic is not tied to an exact textbook excerpt. Keep only stable primary-school facts, avoid uncertain dates/numbers/names, do not invent examples that could be mistaken for textbook facts, and prefer simple wording. The answer will be independently reviewed before display."
        : "ΛΕΙΤΟΥΡΓΙΑ ΔΗΜΟΤΙΚΟΥ ΜΕ ΕΛΕΓΧΟ AI: το θέμα δεν είναι δεμένο με ακριβές απόσπασμα σχολικού βιβλίου. Χρησιμοποίησε μόνο σταθερές γνώσεις επιπέδου Δημοτικού, απόφυγε αβέβαιες ημερομηνίες/αριθμούς/ονόματα, μην επινοείς παραδείγματα που μπορεί να εκληφθούν ως γεγονότα του βιβλίου και γράψε απλά. Η απάντηση θα περάσει από ανεξάρτητο δεύτερο έλεγχο πριν εμφανιστεί.";
      payload.context=String(payload.context||"").trim()+"\n\n"+safetyRule;
      const first=await nativeFetch(input,{...init,body:JSON.stringify(payload)});
      if(!first.ok) return first;
      const body=await first.clone().json().catch(()=>null);
      if(!body?.text) return first;
      const review=await nativeFetch("/api/primary-ai-review",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subjectId:payload.subjectId,subject:payload.subject,grade:payload.grade,topic:payload.topic,activity:payload.activity,language:(document.documentElement.lang||"el").startsWith("en")?"en":"el",text:body.text})});
      const checked=await review.json().catch(()=>null);
      if(!review.ok||!checked?.text){
        return new Response(JSON.stringify({error:"primary_ai_review_failed",message:(document.documentElement.lang||"el").startsWith("en")?"The primary-school answer did not pass the second AI check. Please try again.":"Η απάντηση Δημοτικού δεν πέρασε τον δεύτερο έλεγχο AI. Δοκίμασε ξανά."}),{status:422,headers:{"Content-Type":"application/json"}});
      }
      return new Response(JSON.stringify({...body,text:checked.text,aiReviewed:true,reviewMode:checked.reviewMode||"primary-ai-second-pass"}),{status:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
    };
  }
  installPrimaryStudyReview();

  window.AITOOLSKIDS_STUDY_GROUNDING_POLICY=Object.freeze({
    version:"2026-10-04",
    classify({zone,subjectId,topic}={}){
      const z=String(zone||"");
      const sid=String(subjectId||"");
      const row=window.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027?.get?.(sid)||null;
      if(row?.groundedSections && Object.prototype.hasOwnProperty.call(row.groundedSections,String(topic||""))) return "official-exact";
      if(z==="primary" || /-dimotikou$/i.test(sid)) return "primary-ai-reviewed";
      return "official-runtime-required";
    }
  });
})();
