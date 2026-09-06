/**
 * Adds a richer action menu to Special Education AI Help subjects.
 * Event-driven and tutor-only: no homepage/global payload and no polling.
 */
(function(){
  "use strict";

  const EVENT="aitools4kids:tutor-rendered";
  const VERSION=1;
  const SPECIAL_TRACKS=new Set(["special-gymnasium","special-lyceum","eneegyl"]);
  let appliedCatalog=null;

  function isSpecialSubject(subject){
    return !!subject?.specialEducation && SPECIAL_TRACKS.has(subject.schoolType||subject.schoolTrack||"");
  }

  function scopeText(subject){
    return subject?.curriculum?.scopeNoteEl || "Δούλεψε μόνο με το πραγματικό κεφάλαιο, κείμενο ή άσκηση που έχει ο μαθητής μπροστά του. Μην εφευρίσκεις ύλη.";
  }

  function scopeTextEn(subject){
    return subject?.curriculum?.scopeNoteEn || "Work only with the real chapter, text or exercise the learner has. Do not invent curriculum.";
  }

  function actionTopics(subject){
    const id=subject.id;
    const schoolType=subject.schoolType||subject.schoolTrack||"special-education";
    const exactEl=schoolType==="eneegyl"
      ? "Το πραγματικό κεφάλαιο / κείμενο / άσκηση που δουλεύω τώρα"
      : "Το συγκεκριμένο θέμα ή η άσκηση που έχω τώρα";
    const exactEn="My real chapter, text or exercise right now";
    const boundaryEl=scopeText(subject);
    const boundaryEn=scopeTextEn(subject);
    const make=(suffix,labelEl,labelEn,explainEl,explainEn)=>({
      id:`${id}.action-${suffix}`,
      labelEl,labelEn,explainEl,explainEn,
      specialEducation:true,schoolType,
      specialSupportAction:true,actionMode:suffix
    });

    return [
      make("current-work",exactEl,exactEn,
        `${boundaryEl} Ζήτησε από τον μαθητή να γράψει ή να επικολλήσει το ακριβές σημείο που δουλεύει και ξεκίνα από εκεί.`,
        `${boundaryEn} Ask the learner to type or paste the exact part they are working on and start there.`),
      make("explain-simply","Εξήγησέ μου το απλά","Explain it simply",
        `${boundaryEl} Εξήγησε με πολύ απλές, σύντομες προτάσεις, μία βασική ιδέα τη φορά και έλεγξε αν έγινε κατανοητή πριν συνεχίσεις.`,
        `${boundaryEn} Explain with very simple short sentences, one main idea at a time, and check understanding before continuing.`),
      make("step-by-step","Δείξε μου βήμα-βήμα","Show me step by step",
        `${boundaryEl} Χώρισε τη διαδικασία σε μικρά αριθμημένα βήματα. Δώσε ένα βήμα κάθε φορά και περίμενε απάντηση πριν προχωρήσεις.`,
        `${boundaryEn} Break the process into small numbered steps. Give one step at a time and wait for a response before continuing.`),
      make("exercise-help","Βοήθησέ με σε άσκηση χωρίς έτοιμη λύση","Help me with an exercise without giving the answer",
        `${boundaryEl} Ζήτησε την πραγματική άσκηση και τι έχει δοκιμάσει ο μαθητής. Δώσε μόνο την επόμενη μικρή υπόδειξη, όχι την τελική λύση.`,
        `${boundaryEn} Ask for the real exercise and what the learner has tried. Give only the next small hint, not the final solution.`),
      make("simple-example","Δώσε μου ένα απλό παράδειγμα","Give me a simple example",
        `${boundaryEl} Δώσε ένα σύντομο ανάλογο παράδειγμα με απλά δεδομένα. Μετά γύρισε στο πραγματικό θέμα του μαθητή.`,
        `${boundaryEn} Give one short analogous example with simple data, then return to the learner's real topic.`),
      make("practice","Κάνε μαζί μου 3 μικρές ασκήσεις","Practice 3 short exercises with me",
        `${boundaryEl} Δώσε έως 3 πολύ σύντομες ασκήσεις, μία-μία. Περίμενε απάντηση κάθε φορά και δώσε μικρή ανατροφοδότηση.`,
        `${boundaryEn} Give up to 3 very short exercises, one at a time. Wait for each answer and give brief feedback.`),
      make("mini-quiz","Έλεγξε αν το κατάλαβα με 3 απλές ερωτήσεις","Check my understanding with 3 simple questions",
        `${boundaryEl} Κάνε ακριβώς 3 σύντομες ερωτήσεις, μία τη φορά, με 2 καθαρές επιλογές και χωρίς παγίδες ή διπλές αρνήσεις.`,
        `${boundaryEn} Ask exactly 3 short questions, one at a time, with 2 clear choices and no tricks or double negatives.`)
    ];
  }

  function mergeTopics(subject){
    const existing=Array.isArray(subject.topics)?subject.topics:[];
    const specific=existing.filter((topic)=>{
      if(topic?.specialSupportAction) return false;
      const id=String(topic?.id||"");
      return !id.endsWith(".topic-current-work") && !id.endsWith(".topic-general");
    });
    return specific.concat(actionTopics(subject));
  }

  function enrichCatalog(){
    const current=window.AITOOLSKIDS_TUTOR_CATALOG;
    if(!current?.zones || current===appliedCatalog) return false;
    if(!window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG) return false;

    let changed=false;
    const zones={};
    Object.entries(current.zones).forEach(([zoneId,grades])=>{
      const nextGrades={};
      Object.entries(grades||{}).forEach(([gradeId,subjects])=>{
        nextGrades[gradeId]=(subjects||[]).map((subject)=>{
          if(!isSpecialSubject(subject)) return subject;
          const merged=mergeTopics(subject);
          const oldIds=(subject.topics||[]).map((x)=>x?.id).join("|");
          const newIds=merged.map((x)=>x?.id).join("|");
          if(oldIds===newIds) return subject;
          changed=true;
          return Object.assign({},subject,{topics:merged,specialActionMenu:true});
        });
      });
      zones[zoneId]=nextGrades;
    });

    if(!changed){ appliedCatalog=current; return false; }
    const getSubjects=(zoneId,gradeId)=>zones?.[zoneId]?.[gradeId]||[];
    const getSubject=(zoneId,gradeId,subjectId)=>getSubjects(zoneId,gradeId).find((x)=>x.id===subjectId||x.quizId===subjectId)||null;
    const next=Object.freeze({
      meta:Object.freeze(Object.assign({},current.meta||{},{specialActionMenuVersion:VERSION})),
      zones:Object.freeze(zones),
      getSubjects,getSubject
    });
    window.AITOOLSKIDS_TUTOR_CATALOG=next;
    appliedCatalog=next;
    return true;
  }

  function refreshVisibleTopicMenu(){
    const track=document.getElementById("tutorSchoolTrack")?.value||"";
    const subject=document.getElementById("tutorSubject");
    if(!SPECIAL_TRACKS.has(track)||!subject?.value) return;
    subject.dispatchEvent(new Event("change",{bubbles:true}));
  }

  function applyAndRefresh(){
    if(enrichCatalog()) refreshVisibleTopicMenu();
  }

  document.addEventListener(EVENT,applyAndRefresh);
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",applyAndRefresh,{once:true});
  else applyAndRefresh();

  window.AITOOLSKIDS_SPECIAL_TUTOR_ACTIONS=Object.freeze({version:VERSION,apply:applyAndRefresh});
})();
