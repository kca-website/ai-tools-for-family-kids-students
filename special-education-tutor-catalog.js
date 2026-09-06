/**
 * Special Education -> AI Tutor catalog adapter.
 * Data-only: no DOM changes, no render wrapping.
 * Detailed learning units are source-bounded. Special Gymnasium also exposes
 * verified grade/subject shells from the 2026-27 timetable without inventing
 * a separate E.A.E. chapter syllabus.
 */
(function(){
  "use strict";

  const current=window.AITOOLSKIDS_TUTOR_CATALOG;
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const SG=window.SPECIAL_GYMNASIUM_2026_2027;
  if(!current || !C?.entries || !L) return;

  const GRADE_KEY={A:"a",B:"b",C:"c",D:"d"};
  const zones={};
  Object.entries(current.zones || {}).forEach(([zoneId,grades])=>{
    const nextGrades={};
    Object.entries(grades || {}).forEach(([gradeId,subjects])=>{
      nextGrades[gradeId]=Array.isArray(subjects)?[...subjects]:[];
    });
    zones[zoneId]=nextGrades;
  });
  zones.middle=zones.middle || {};
  zones.high=zones.high || {};

  function shortTopic(text,max=92){
    const clean=String(text || "").trim();
    return clean.length<=max?clean:`${clean.slice(0,max-1).trimEnd()}…`;
  }

  function coverageLabel(entry){
    if(entry.schoolType==="special-gymnasium"){
      return {
        el:"Ειδικό Γυμνάσιο · επίσημη δομή 2026–27 + επίσημο υλικό προσαρμογών Ε.Α.Ε.",
        en:"Special Gymnasium · official 2026–27 structure + official E.A.E. adaptation material"
      };
    }
    if(entry.verificationBasis==="current-exam-syllabus"){
      return {
        el:"ΕΝ.Ε.Ε.ΓΥ.-Λ. · επαληθευμένη μερική κάλυψη από την εξεταστέα ύλη 2026–27",
        en:"EN.E.E.GY.-L. · verified partial coverage from the 2026–27 examinable syllabus"
      };
    }
    return {
      el:"ΕΝ.Ε.Ε.ΓΥ.-Λ. · επαληθευμένες οδηγίες 2026–27",
      en:"EN.E.E.GY.-L. · verified 2026–27 teaching guidance"
    };
  }

  function makeSubject(entry,learning){
    const label=coverageLabel(entry);
    const keyPoints=learning?.learnSimply?.keyPoints || [];
    const topics=keyPoints.map((text,index)=>({
      id:`${entry.id}.topic-${index+1}`,
      labelEl:shortTopic(text),
      labelEn:shortTopic(text),
      explainEl:text,
      explainEn:text,
      specialEducation:true,
      schoolType:entry.schoolType
    }));
    if(!topics.length){
      topics.push({
        id:`${entry.id}.topic-general`,
        labelEl:"Βασική κατανόηση της ενότητας",
        labelEn:"Core understanding of this unit",
        explainEl:"Δούλεψε μόνο μέσα στα επαληθευμένα σημεία της συγκεκριμένης ενότητας.",
        explainEn:"Work only within the verified scope of this unit.",
        specialEducation:true,
        schoolType:entry.schoolType
      });
    }

    const scopeBoundary=entry.verificationNote || "Η ενότητα χρησιμοποιεί μόνο τα επαληθευμένα σημεία αναφοράς που εμφανίζονται στη σελίδα Ειδικής Εκπαίδευσης.";
    const schoolName=entry.schoolType==="eneegyl"?"ΕΝ.Ε.Ε.ΓΥ.-Λ.":"Ειδικό Γυμνάσιο";
    const examVerified=entry.currentExamSyllabusStatus==="verified";
    const supportSkill=entry.coverageStatus==="support-skill";
    const curriculum={
      schoolYear:C.schoolYear || "2026-2027",
      verificationDate:entry.verificationDate || C.verificationDate || "",
      verificationBasis:entry.verificationBasis || "",
      coverageStatus:examVerified?"current-exam-syllabus-verified-partial":supportSkill?"official-structure-plus-adaptation-support":"annual-instructions-verified",
      coverageLabelEl:label.el,
      coverageLabelEn:label.en,
      officialSectionsEl:[...(entry.officialAnchors || [])],
      officialSectionsEn:[],
      scopeNoteEl:`${schoolName}: ξεχωριστό σχολικό πλαίσιο. ${scopeBoundary}`,
      scopeNoteEn:`${schoolName}: separate school context. Stay inside the verified source boundary and do not invent an E.A.E. chapter syllabus.`,
      annualInstructionsStatus:examVerified?"current-exam-syllabus-verified":(entry.annualInstructionsStatus==="verified"?"2026-27-verified":(entry.annualInstructionsStatus || "unknown")),
      annualInstructionsUrl:examVerified?(entry.sourceUrl || ""):(entry.instructionSourceUrl || entry.sourceUrl || ""),
      teachingInstructionsStatus:entry.annualInstructionsStatus || "unknown",
      teachingInstructionsUrl:entry.instructionSourceUrl || "",
      currentExamSyllabusStatus:examVerified?"2026-27-verified":(entry.currentExamSyllabusStatus || "unknown"),
      currentExamSyllabusUrl:examVerified?(entry.sourceUrl || ""):"",
      officialTimetableStatus:entry.officialTimetableStatus || "unknown",
      adaptationResourceStatus:entry.adaptationResourceStatus || "unknown",
      adaptationSourceUrl:entry.adaptationSourceUrl || "",
      catalogUrl:entry.sourceUrl || "",
      sourceLabelEl:entry.sourceTitle || "Επίσημη πηγή 2026–27",
      sourceLabelEn:"Official 2026–27 source",
      specialEducation:true,
      schoolType:entry.schoolType,
      sector:entry.sector || ""
    };
    if(entry.textbookUrl){
      curriculum.officialBook={titleEl:entry.subject,titleEn:entry.subject,url:entry.textbookUrl};
    }

    const prefix=entry.schoolType==="eneegyl"?"ΕΝ.Ε.Ε.ΓΥ.-Λ.":"Ειδικό Γυμνάσιο";
    return {
      id:entry.id,
      quizId:null,
      grade:GRADE_KEY[entry.grade] || String(entry.grade || "").toLowerCase(),
      subjectLabelEl:`${prefix} · ${entry.subject}`,
      subjectLabelEn:`${prefix} · ${entry.subject}`,
      topics,
      curriculum,
      specialEducation:true,
      schoolType:entry.schoolType,
      schoolTrack:entry.schoolType,
      sector:entry.sector || "",
      sourceCurriculumId:entry.id
    };
  }

  const exposed=[];
  function registerSubject(zoneId,gradeId,subject,meta={}){
    if(!zoneId || !gradeId || !subject?.id) return;
    const list=[...(zones[zoneId][gradeId] || [])].filter((x)=>x?.id!==subject.id);
    list.push(subject);
    zones[zoneId][gradeId]=list;
    exposed.push(Object.assign({id:subject.id,zoneId,gradeId,schoolType:subject.schoolType},meta));
  }

  Object.values(C.entries).forEach((entry)=>{
    const learning=L[entry.id];
    if(entry?.status!=="verified" || !learning || learning.status!=="ready") return;
    const zoneId=entry.schoolType==="eneegyl"?"high":entry.schoolType==="special-gymnasium"?"middle":null;
    const gradeId=GRADE_KEY[entry.grade] || String(entry.grade || "").toLowerCase();
    if(!zoneId || !gradeId) return;
    const subject=makeSubject(entry,learning);
    registerSubject(zoneId,gradeId,subject,{gradeLabel:entry.gradeLabel || gradeId.toUpperCase(),detailedLearning:true});
  });

  if(SG?.status==="verified-structure" && SG.grades){
    const pilotByKey={
      "a|language":"special-gym-a-language-comprehension",
      "a|math":"special-gym-a-math-problem-reading"
    };
    Object.entries(SG.grades).forEach(([gradeId,grade])=>{
      (grade.subjects || []).forEach((row)=>{
        const pilotId=pilotByKey[`${gradeId}|${row.id}`];
        if(pilotId && exposed.some((x)=>x.id===pilotId)) return;
        const id=`special-gym-${gradeId}-${row.id}`;
        const topicEl=SG.tutorPolicy?.genericTopicEl || "Δούλεψε πάνω στο συγκεκριμένο θέμα ή την άσκηση που έχεις μπροστά σου";
        const topicEn=SG.tutorPolicy?.genericTopicEn || "Work on the exact topic or exercise you have";
        registerSubject("middle",gradeId,{
          id,
          quizId:null,
          grade:gradeId,
          subjectLabelEl:`Ειδικό Γυμνάσιο · ${row.label}`,
          subjectLabelEn:`Special Gymnasium · ${row.label}`,
          topics:[{
            id:`${id}.topic-current-work`,
            labelEl:topicEl,
            labelEn:topicEn,
            explainEl:SG.tutorPolicy?.warningEl || topicEl,
            explainEn:SG.tutorPolicy?.warningEn || topicEn,
            specialEducation:true,
            schoolType:"special-gymnasium"
          }],
          curriculum:{
            schoolYear:SG.schoolYear,
            verificationDate:SG.verificationDate,
            verificationBasis:"official-timetable-structure",
            coverageStatus:"official-timetable-verified-structure",
            coverageLabelEl:"Επαληθευμένο μάθημα/τάξη 2026–27 · χωρίς δήλωση συγκεκριμένων κεφαλαίων",
            coverageLabelEn:"Verified 2026–27 grade/subject · no chapter-scope claim",
            officialSectionsEl:[`${grade.label}: ${row.label} · ${row.hours} ${row.hours===1?"ώρα":"ώρες"} την εβδομάδα`],
            officialSectionsEn:[],
            scopeNoteEl:SG.tutorPolicy?.warningEl || "Δεν έχει χαρτογραφηθεί ξεχωριστή φετινή ύλη Ε.Α.Ε. για αυτό το μάθημα.",
            scopeNoteEn:SG.tutorPolicy?.warningEn || "No separate current E.A.E. chapter scope is claimed.",
            annualInstructionsStatus:"not-claimed",
            annualInstructionsUrl:SG.timetableSourceUrl,
            teachingInstructionsStatus:"not-claimed",
            officialTimetableStatus:"2026-27-verified",
            adaptationResourceStatus:"available",
            adaptationSourceUrl:SG.adaptationResources?.hub || "",
            catalogUrl:SG.timetableSourceUrl,
            sourceLabelEl:"Ωρολόγιο πρόγραμμα Γυμνασίου Ε.Α.Ε. 2026–27",
            sourceLabelEn:"Special Gymnasium 2026–27 timetable",
            specialEducation:true,
            schoolType:"special-gymnasium",
            structureOnly:true
          },
          specialEducation:true,
          schoolType:"special-gymnasium",
          schoolTrack:"special-gymnasium",
          structureOnly:true
        },{gradeLabel:grade.label,detailedLearning:false,structureOnly:true,subjectKey:row.id});
      });
    });
  }

  function getSubjects(zoneId,gradeId){ return zones?.[zoneId]?.[gradeId] || []; }
  function getSubject(zoneId,gradeId,subjectId){
    return getSubjects(zoneId,gradeId).find((x)=>x.id===subjectId || x.quizId===subjectId) || null;
  }

  window.AITOOLSKIDS_TUTOR_CATALOG=Object.freeze({
    meta:Object.freeze(Object.assign({},current.meta || {},{
      schoolYear:"2026-2027",
      specialEducationVerifiedOn:C.verificationDate || "2026-09-06",
      specialEducationUnits:exposed.length
    })),
    zones:Object.freeze(zones),
    getSubjects,
    getSubject
  });

  window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG=Object.freeze({
    version:2,
    schoolYear:C.schoolYear || "2026-2027",
    exposed:Object.freeze(exposed),
    hasVerifiedSpecialGymnasium:exposed.some((x)=>x.schoolType==="special-gymnasium"),
    hasVerifiedEneegyl:exposed.some((x)=>x.schoolType==="eneegyl")
  });
})();