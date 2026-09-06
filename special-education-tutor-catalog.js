/**
 * Special Education -> AI Tutor catalog adapter.
 * Data-only: no DOM changes, no render wrapping.
 * Only verified curriculum entries with learning content are exposed.
 */
(function(){
  "use strict";

  const current=window.AITOOLSKIDS_TUTOR_CATALOG;
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
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
    const curriculum={
      schoolYear:C.schoolYear || "2026-2027",
      verificationDate:entry.verificationDate || C.verificationDate || "",
      verificationBasis:entry.verificationBasis || "",
      coverageStatus:entry.verificationBasis==="current-exam-syllabus"?"current-exam-syllabus-verified-partial":"annual-instructions-verified",
      coverageLabelEl:label.el,
      coverageLabelEn:label.en,
      officialSectionsEl:[...(entry.officialAnchors || [])],
      officialSectionsEn:[],
      scopeNoteEl:`${schoolName}: ξεχωριστό σχολικό πλαίσιο. ${scopeBoundary} Η παρουσίαση είναι βήμα-βήμα και δεν μετατρέπει την ενότητα σε ύλη ΓΕΛ/γενικού σχολείου.`,
      scopeNoteEn:`${schoolName}: separate school context. This unit is deliberately limited to its verified source boundary and must not be treated as General Lyceum curriculum.`,
      annualInstructionsStatus:entry.annualInstructionsStatus==="verified"?"2026-27-verified":(entry.annualInstructionsStatus || "unknown"),
      annualInstructionsUrl:entry.instructionSourceUrl || entry.sourceUrl || "",
      currentExamSyllabusStatus:entry.currentExamSyllabusStatus==="verified"?"2026-27-verified":(entry.currentExamSyllabusStatus || "unknown"),
      currentExamSyllabusUrl:entry.currentExamSyllabusStatus==="verified"?(entry.sourceUrl || ""):"",
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
  Object.values(C.entries).forEach((entry)=>{
    const learning=L[entry.id];
    if(entry?.status!=="verified" || !learning || learning.status!=="ready") return;
    const zoneId=entry.schoolType==="eneegyl"?"high":entry.schoolType==="special-gymnasium"?"middle":null;
    const gradeId=GRADE_KEY[entry.grade] || String(entry.grade || "").toLowerCase();
    if(!zoneId || !gradeId) return;
    const subject=makeSubject(entry,learning);
    const list=[...(zones[zoneId][gradeId] || [])].filter((x)=>x?.id!==subject.id);
    list.push(subject);
    zones[zoneId][gradeId]=list;
    exposed.push({id:entry.id,zoneId,gradeId,schoolType:entry.schoolType});
  });

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
    version:1,
    schoolYear:C.schoolYear || "2026-2027",
    exposed:Object.freeze(exposed),
    hasVerifiedSpecialGymnasium:exposed.some((x)=>x.schoolType==="special-gymnasium"),
    hasVerifiedEneegyl:exposed.some((x)=>x.schoolType==="eneegyl")
  });
})();