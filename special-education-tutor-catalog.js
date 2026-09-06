/**
 * Special Education -> AI Tutor catalog adapter.
 * Data only: no DOM changes and no render wrapping.
 */
(function(){
  "use strict";

  const current=window.AITOOLSKIDS_TUTOR_CATALOG;
  const C=window.SPECIAL_EDUCATION_CURRICULUM;
  const L=window.SPECIAL_EDUCATION_LEARNING;
  const SG=window.SPECIAL_GYMNASIUM_2026_2027;
  const SL=window.SPECIAL_LYCEUM_2026_2027;
  const EN=window.ENEEGYL_2026_2027_STRUCTURE;
  if(!current || !C?.entries || !L) return;

  const GRADE_KEY={A:"a",B:"b",C:"c",D:"d"};
  const zones={};
  Object.entries(current.zones||{}).forEach(([zoneId,grades])=>{
    const next={};
    Object.entries(grades||{}).forEach(([gradeId,subjects])=>{ next[gradeId]=Array.isArray(subjects)?[...subjects]:[]; });
    zones[zoneId]=next;
  });
  zones.middle=zones.middle||{};
  zones.high=zones.high||{};

  // Snapshot the normal Lyceum menu before special-school entries are appended.
  const baseHigh={};
  ["a","b","c"].forEach((gradeId)=>{
    baseHigh[gradeId]=[...(current.getSubjects?.("high",gradeId)||zones.high[gradeId]||[])];
  });

  const exposed=[];

  function shortTopic(text,max=92){
    const clean=String(text||"").trim();
    return clean.length<=max?clean:`${clean.slice(0,max-1).trimEnd()}…`;
  }

  function eneegylGradeId(entry){
    const base=GRADE_KEY[entry?.grade]||String(entry?.grade||"").toLowerCase();
    return entry?.schoolType==="eneegyl"?`lyc-${base}`:base;
  }

  function coverageLabel(entry){
    if(entry.schoolType==="special-gymnasium") return {
      el:"Ειδικό Γυμνάσιο · επίσημη δομή 2026–27 + υλικό προσαρμογών Ε.Α.Ε.",
      en:"Special Gymnasium · official 2026–27 structure + E.A.E. adaptation material"
    };
    if(entry.verificationBasis==="current-exam-syllabus") return {
      el:"ΕΝ.Ε.Ε.ΓΥ.-Λ. · επαληθευμένη μερική κάλυψη από την εξεταστέα ύλη 2026–27",
      en:"EN.E.E.GY.-L. · verified partial coverage from the 2026–27 examinable syllabus"
    };
    return {
      el:"ΕΝ.Ε.Ε.ΓΥ.-Λ. · επαληθευμένη επίσημη βάση 2026–27",
      en:"EN.E.E.GY.-L. · verified official 2026–27 basis"
    };
  }

  function makeDetailedSubject(entry,learning){
    const label=coverageLabel(entry);
    const keyPoints=learning?.learnSimply?.keyPoints||[];
    const topics=keyPoints.map((text,index)=>({
      id:`${entry.id}.topic-${index+1}`,
      labelEl:shortTopic(text),labelEn:shortTopic(text),
      explainEl:text,explainEn:text,
      specialEducation:true,schoolType:entry.schoolType
    }));
    if(!topics.length) topics.push({
      id:`${entry.id}.topic-general`,
      labelEl:"Βασική κατανόηση της ενότητας",labelEn:"Core understanding of this unit",
      explainEl:"Δούλεψε μόνο μέσα στα επαληθευμένα σημεία της συγκεκριμένης ενότητας.",
      explainEn:"Work only within the verified scope of this unit.",
      specialEducation:true,schoolType:entry.schoolType
    });

    const examVerified=entry.currentExamSyllabusStatus==="verified";
    const supportSkill=entry.coverageStatus==="support-skill";
    const schoolName=entry.schoolType==="eneegyl"?"ΕΝ.Ε.Ε.ΓΥ.-Λ.":"Ειδικό Γυμνάσιο";
    const scopeBoundary=entry.verificationNote||"Χρησιμοποίησε μόνο τα επαληθευμένα σημεία της ενότητας.";
    const curriculum={
      schoolYear:C.schoolYear||"2026-2027",
      verificationDate:entry.verificationDate||C.verificationDate||"",
      verificationBasis:entry.verificationBasis||"",
      coverageStatus:examVerified?"current-exam-syllabus-verified-partial":supportSkill?"official-structure-plus-adaptation-support":"annual-instructions-verified",
      coverageLabelEl:label.el,coverageLabelEn:label.en,
      officialSectionsEl:[...(entry.officialAnchors||[])],officialSectionsEn:[],
      scopeNoteEl:`${schoolName}: ${scopeBoundary}`,
      scopeNoteEn:`${schoolName}: stay inside the verified source boundary and do not invent a separate special-school syllabus.`,
      annualInstructionsStatus:examVerified?"current-exam-syllabus-verified":(entry.annualInstructionsStatus==="verified"?"2026-27-verified":(entry.annualInstructionsStatus||"unknown")),
      annualInstructionsUrl:examVerified?(entry.sourceUrl||""):(entry.instructionSourceUrl||entry.sourceUrl||""),
      teachingInstructionsStatus:entry.annualInstructionsStatus||"unknown",
      teachingInstructionsUrl:entry.instructionSourceUrl||"",
      currentExamSyllabusStatus:examVerified?"2026-27-verified":(entry.currentExamSyllabusStatus||"unknown"),
      currentExamSyllabusUrl:examVerified?(entry.sourceUrl||""):"",
      officialTimetableStatus:entry.officialTimetableStatus||"unknown",
      adaptationResourceStatus:entry.adaptationResourceStatus||"unknown",
      adaptationSourceUrl:entry.adaptationSourceUrl||"",
      catalogUrl:entry.sourceUrl||"",
      sourceLabelEl:entry.sourceTitle||"Επίσημη πηγή 2026–27",
      sourceLabelEn:"Official 2026–27 source",
      specialEducation:true,schoolType:entry.schoolType,sector:entry.sector||""
    };
    if(entry.textbookUrl) curriculum.officialBook={titleEl:entry.subject,titleEn:entry.subject,url:entry.textbookUrl};

    const prefix=entry.schoolType==="eneegyl"?"ΕΝ.Ε.Ε.ΓΥ.-Λ.":"Ειδικό Γυμνάσιο";
    return {
      id:entry.id,quizId:null,
      grade:eneegylGradeId(entry),
      subjectLabelEl:`${prefix} · ${entry.subject}`,
      subjectLabelEn:`${prefix} · ${entry.subject}`,
      topics,curriculum,
      specialEducation:true,schoolType:entry.schoolType,schoolTrack:entry.schoolType,
      sector:entry.sector||"",sourceCurriculumId:entry.id
    };
  }

  function registerSubject(zoneId,gradeId,subject,meta={}){
    if(!zoneId||!gradeId||!subject?.id) return;
    const list=[...(zones[zoneId][gradeId]||[])].filter((x)=>x?.id!==subject.id);
    list.push(subject);
    zones[zoneId][gradeId]=list;
    exposed.push(Object.assign({id:subject.id,zoneId,gradeId,schoolType:subject.schoolType},meta));
  }

  // Detailed, source-bounded learning units.
  Object.values(C.entries).forEach((entry)=>{
    const learning=L[entry.id];
    if(entry?.status!=="verified"||!learning||learning.status!=="ready") return;
    const zoneId=entry.schoolType==="eneegyl"?"high":entry.schoolType==="special-gymnasium"?"middle":null;
    const gradeId=eneegylGradeId(entry);
    if(!zoneId||!gradeId) return;
    registerSubject(zoneId,gradeId,makeDetailedSubject(entry,learning),{
      gradeLabel:entry.schoolType==="eneegyl"?(EN?.grades?.[gradeId]?.label||entry.gradeLabel||gradeId.toUpperCase()):(entry.gradeLabel||gradeId.toUpperCase()),
      detailedLearning:true
    });
  });

  // Special Gymnasium: official grade/subject structure plus two detailed A routes.
  if(SG?.status==="verified-structure"&&SG.grades){
    const pilotByKey={"a|language":"special-gym-a-language-comprehension","a|math":"special-gym-a-math-problem-reading"};
    Object.entries(SG.grades).forEach(([gradeId,grade])=>{
      (grade.subjects||[]).forEach((row)=>{
        const pilotId=pilotByKey[`${gradeId}|${row.id}`];
        if(pilotId&&exposed.some((x)=>x.id===pilotId)) return;
        const id=`special-gym-${gradeId}-${row.id}`;
        const topicEl=SG.tutorPolicy?.genericTopicEl||"Δούλεψε πάνω στο συγκεκριμένο θέμα ή την άσκηση που έχεις μπροστά σου";
        const topicEn=SG.tutorPolicy?.genericTopicEn||"Work on the exact topic or exercise you have";
        registerSubject("middle",gradeId,{
          id,quizId:null,grade:gradeId,
          subjectLabelEl:`Ειδικό Γυμνάσιο · ${row.label}`,
          subjectLabelEn:`Special Gymnasium · ${row.label}`,
          topics:[{id:`${id}.topic-current-work`,labelEl:topicEl,labelEn:topicEn,explainEl:SG.tutorPolicy?.warningEl||topicEl,explainEn:SG.tutorPolicy?.warningEn||topicEn,specialEducation:true,schoolType:"special-gymnasium"}],
          curriculum:{
            schoolYear:SG.schoolYear,verificationDate:SG.verificationDate,
            verificationBasis:"official-timetable-structure",coverageStatus:"official-timetable-verified-structure",
            coverageLabelEl:"Ειδικό Γυμνάσιο · επίσημη δομή 2026–27",coverageLabelEn:"Special Gymnasium · official 2026–27 structure",
            officialSectionsEl:[`${grade.label}: ${row.label}`],officialSectionsEn:[],
            scopeNoteEl:SG.tutorPolicy?.warningEl||"Δεν έχει χαρτογραφηθεί ξεχωριστή φετινή ύλη Ε.Α.Ε. για αυτό το μάθημα.",
            scopeNoteEn:SG.tutorPolicy?.warningEn||"No separate current E.A.E. chapter scope is claimed.",
            officialTimetableStatus:"2026-27-verified",adaptationResourceStatus:"available",
            adaptationSourceUrl:SG.adaptationResources?.hub||"",catalogUrl:SG.timetableSourceUrl,
            sourceLabelEl:"Ωρολόγιο πρόγραμμα Γυμνασίου Ε.Α.Ε. 2026–27",sourceLabelEn:"Special Gymnasium 2026–27 timetable",
            specialEducation:true,schoolType:"special-gymnasium",structureOnly:true
          },
          specialEducation:true,schoolType:"special-gymnasium",schoolTrack:"special-gymnasium",structureOnly:true
        },{gradeLabel:grade.label,detailedLearning:false,structureOnly:true,subjectKey:row.id});
      });
    });
  }

  // Special Lyceum: one unified AI Help menu. We mirror the already available
  // Lyceum subject catalog for navigation only; this is NOT a claim that every
  // mirrored subject has a separately verified E.A.E. syllabus mapping.
  if(SL?.status==="verified-structure"&&SL.grades){
    Object.entries(SL.grades).forEach(([gradeId,grade])=>{
      (baseHigh[gradeId]||[]).forEach((base,index)=>{
        if(!base?.id||base.specialEducation) return;
        const id=`special-lyceum-${gradeId}-${base.id}`;
        const topics=(base.topics||[]).map((topic,i)=>({
          id:`${id}.topic-${i+1}`,
          labelEl:topic.labelEl||topic.labelEn||`Θέμα ${i+1}`,
          labelEn:topic.labelEn||topic.labelEl||`Topic ${i+1}`,
          explainEl:topic.explainEl||topic.labelEl||SL.tutorPolicy.warningEl,
          explainEn:topic.explainEn||topic.labelEn||SL.tutorPolicy.warningEn,
          specialEducation:true,schoolType:"special-lyceum"
        }));
        if(!topics.length) topics.push({
          id:`${id}.topic-current-work`,
          labelEl:"Το συγκεκριμένο θέμα ή η άσκησή μου",labelEn:"My exact topic or exercise",
          explainEl:SL.tutorPolicy.warningEl,explainEn:SL.tutorPolicy.warningEn,
          specialEducation:true,schoolType:"special-lyceum"
        });
        const rawEl=String(base.subjectLabelEl||base.id).replace(/^.*?·\s*/,"");
        const rawEn=String(base.subjectLabelEn||base.subjectLabelEl||base.id).replace(/^.*?·\s*/,"");
        registerSubject("high",gradeId,{
          id,quizId:null,grade:gradeId,
          subjectLabelEl:`Ειδικό Λύκειο · ${rawEl}`,
          subjectLabelEn:`Special Lyceum · ${rawEn}`,
          topics,
          curriculum:{
            schoolYear:SL.schoolYear,verificationDate:SL.verificationDate,
            verificationBasis:"official-school-type-support-menu",coverageStatus:"special-lyceum-support-menu",
            coverageLabelEl:"Ειδικό Λύκειο · υποστηρικτικό μενού μαθημάτων",coverageLabelEn:"Special Lyceum · tutoring subject menu",
            officialSectionsEl:[`${grade.labelEl}: υποστηρικτική επιλογή ${rawEl}`],officialSectionsEn:[],
            scopeNoteEl:SL.scopeNoteEl,scopeNoteEn:SL.scopeNoteEn,
            annualInstructionsStatus:"not-claimed",teachingInstructionsStatus:"not-claimed",
            officialTimetableStatus:"school-type-verified",catalogUrl:SL.sourceUrl,
            sourceLabelEl:SL.sourceLabelEl,sourceLabelEn:SL.sourceLabelEn,
            specialEducation:true,schoolType:"special-lyceum",structureOnly:true
          },
          specialEducation:true,schoolType:"special-lyceum",schoolTrack:"special-lyceum",structureOnly:true,
          sourceBaseSubjectId:base.id
        },{gradeLabel:grade.labelEl,detailedLearning:false,structureOnly:true,mirroredSupportMenu:true,order:index});
      });
    });
  }

  // EN.E.E.GY.-L. has eight grades. Expose the official school structure even
  // when a grade/subject does not yet have a detailed mapped learning unit.
  // All eight grade IDs live under the single ENEEGYL track in the unified tutor.
  if(EN?.totalGrades===8&&EN.grades){
    const detailedA={"lyc-a|creative-zone":"eneegyl-a-zdd"};
    (EN.gradeOrder||Object.keys(EN.grades)).forEach((gradeId)=>{
      const grade=EN.grades[gradeId];
      (grade?.subjects||[]).forEach((row,index)=>{
        const mapped=detailedA[`${gradeId}|${row.id}`];
        if(mapped&&exposed.some((x)=>x.id===mapped)) return;
        const id=`eneegyl-${gradeId}-${row.id}`;
        const exact=row.requiresExactLesson;
        const topicEl=exact
          ? "Γράψε τον ακριβή τομέα/ειδικότητα, μάθημα και κεφάλαιο ή βάλε την άσκηση που έχεις μπροστά σου"
          : "Γράψε το ακριβές κεφάλαιο, κείμενο ή άσκηση που δουλεύεις τώρα";
        registerSubject("high",gradeId,{
          id,quizId:null,grade:gradeId,
          subjectLabelEl:`ΕΝ.Ε.Ε.ΓΥ.-Λ. · ${row.label}`,
          subjectLabelEn:`EN.E.E.GY.-L. · ${row.label}`,
          topics:[{
            id:`${id}.topic-current-work`,
            labelEl:topicEl,labelEn:topicEl,
            explainEl:"Η AI Βοήθεια προσαρμόζει τη γλώσσα και τα βήματα, αλλά δεν εφευρίσκει ύλη που δεν έχει δοθεί από το σχολείο.",
            explainEn:"AI Help adapts language and steps, but does not invent curriculum that has not been provided.",
            specialEducation:true,schoolType:"eneegyl"
          }],
          curriculum:{
            schoolYear:EN.schoolYear,verificationDate:EN.verificationDate,
            verificationBasis:"official-2026-timetable-structure",coverageStatus:"official-structure-only",
            coverageLabelEl:"ΕΝ.Ε.Ε.ΓΥ.-Λ. · επίσημη δομή 8 τάξεων 2026–27",coverageLabelEn:"EN.E.E.GY.-L. · official 8-grade 2026–27 structure",
            officialSectionsEl:[`${grade.label}: ${row.label}`],officialSectionsEn:[],
            scopeNoteEl:"Το μάθημα υπάρχει στο επίσημο σχολικό πλαίσιο, αλλά η αναλυτική ύλη του δεν δηλώνεται ως πλήρως χαρτογραφημένη εδώ. Δώσε το πραγματικό κεφάλαιο/άσκηση.",
            scopeNoteEn:"The subject is part of the official school structure, but detailed syllabus coverage is not claimed here. Provide the real chapter/exercise.",
            annualInstructionsStatus:grade.level==="lyceum"?"2026-27-hub-available":"not-claimed",
            annualInstructionsUrl:grade.level==="lyceum"?(EN.sourceUrls?.annualInstructions||""):"",
            officialTimetableStatus:"2026-27-verified",
            catalogUrl:grade.sourceUrl||"",
            sourceLabelEl:grade.level==="gymnasium"?"Ωρολόγιο πρόγραμμα Γυμνασίου ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27":"Ωρολόγιο πρόγραμμα Λυκείου ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27",
            sourceLabelEn:"EN.E.E.GY.-L. official 2026–27 timetable",
            specialEducation:true,schoolType:"eneegyl",structureOnly:true,
            eneegylLevel:grade.level
          },
          specialEducation:true,schoolType:"eneegyl",schoolTrack:"eneegyl",structureOnly:true,
          eneegylLevel:grade.level,subjectType:row.type||"general",sector:row.sector||""
        },{
          gradeLabel:grade.label,detailedLearning:false,structureOnly:true,
          eneegylLevel:grade.level,subjectType:row.type||"general",order:index
        });
      });
    });
  }

  function getSubjects(zoneId,gradeId){ return zones?.[zoneId]?.[gradeId]||[]; }
  function getSubject(zoneId,gradeId,subjectId){ return getSubjects(zoneId,gradeId).find((x)=>x.id===subjectId||x.quizId===subjectId)||null; }

  window.AITOOLSKIDS_TUTOR_CATALOG=Object.freeze({
    meta:Object.freeze(Object.assign({},current.meta||{}, {
      schoolYear:"2026-2027",specialEducationVerifiedOn:C.verificationDate||"2026-09-06",specialEducationUnits:exposed.length
    })),
    zones:Object.freeze(zones),getSubjects,getSubject
  });

  window.AITOOLSKIDS_SPECIAL_EDUCATION_TUTOR_CATALOG=Object.freeze({
    version:4,schoolYear:C.schoolYear||"2026-2027",exposed:Object.freeze(exposed),
    eneegylGradeCount:EN?.totalGrades||0,
    hasVerifiedSpecialGymnasium:exposed.some((x)=>x.schoolType==="special-gymnasium"),
    hasSpecialLyceum:exposed.some((x)=>x.schoolType==="special-lyceum"),
    hasVerifiedEneegyl:exposed.some((x)=>x.schoolType==="eneegyl")
  });
})();