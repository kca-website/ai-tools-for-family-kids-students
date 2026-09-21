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

  // Special Gymnasium: prefer exact annual 2026-27 mappings; generic fallback only where no exact map exists.
  function annualSpecialGymEntry(gradeId,subjectId){
    const entries=Object.values(C.entries||{}).filter((entry)=>
      entry?.schoolType==="special-gymnasium" &&
      String(entry?.grade||"").toLowerCase()===String(gradeId||"").toLowerCase() &&
      entry?.subjectId===subjectId &&
      Array.isArray(entry?.officialAnchors) && entry.officialAnchors.length>0
    );
    return entries.find((entry)=>entry?.annualInstructionsStatus==="2026-27-verified") ||
      entries.find((entry)=>entry?.annualInstructionsStatus==="2026-27-framework-verified") ||
      null;
  }

  function makeAnnualSpecialGymSubject(entry,row,gradeId){
    const id=`special-gym-${gradeId}-${row.id}`;
    const frameworkOnly=entry?.frameworkOnly===true||entry?.annualInstructionsStatus==="2026-27-framework-verified";
    const topics=(entry.officialAnchors||[]).map((label,index)=>({
      id:`${id}.topic-${index+1}`,
      labelEl:String(label),labelEn:String(label),
      explainEl:String(label),explainEn:String(label),
      specialEducation:true,schoolType:"special-gymnasium",annualInstructionsStatus:frameworkOnly?"2026-27-framework-verified":"2026-27-verified",frameworkOnly
    }));
    return {
      id,quizId:null,grade:gradeId,
      subjectLabelEl:`Ειδικό Γυμνάσιο · ${row.label}`,
      subjectLabelEn:`Special Gymnasium · ${row.label}`,
      topics,
      curriculum:{
        schoolYear:SG.schoolYear,verificationDate:entry.verificationDate||SG.verificationDate,
        verificationBasis:entry.verificationBasis||"annual-eae-instructions-2026-27",
        coverageStatus:frameworkOnly?"annual-framework-verified":"annual-instructions-verified",
        coverageLabelEl:frameworkOnly?"Ειδικό Γυμνάσιο · επίσημο πλαίσιο 2026–27":"Ειδικό Γυμνάσιο · επίσημη χαρτογράφηση ύλης 2026–27",
        coverageLabelEn:frameworkOnly?"Special Gymnasium · verified 2026–27 framework":"Special Gymnasium · verified 2026–27 annual mapping",
        officialSectionsEl:[...(entry.officialAnchors||[])],officialSectionsEn:[],
        scopeNoteEl:entry.verificationNote||"Χρησιμοποίησε μόνο τις επαληθευμένες φετινές ενότητες.",
        scopeNoteEn:frameworkOnly?"Use these as verified framework choices, not as a claim of complete section-level annual syllabus.":"Use only the verified 2026-27 E.A.E. sections.",
        annualInstructionsStatus:frameworkOnly?"2026-27-framework-verified":"2026-27-verified",
        annualInstructionsUrl:entry.sourceUrl||entry.instructionSourceUrl||"",
        teachingInstructionsStatus:frameworkOnly?"2026-27-framework-verified":"2026-27-verified",
        teachingInstructionsUrl:entry.instructionSourceUrl||entry.sourceUrl||"",
        officialTimetableStatus:"2026-27-verified",adaptationResourceStatus:"available",
        adaptationSourceUrl:SG.adaptationResources?.hub||"",catalogUrl:entry.sourceUrl||SG.timetableSourceUrl,
        sourceLabelEl:entry.sourceTitle||"Επίσημες οδηγίες Γυμνασίου Ε.Α.Ε. 2026–27",
        sourceLabelEn:"Official E.A.E. 2026–27 guidance",
        specialEducation:true,schoolType:"special-gymnasium",structureOnly:false,frameworkOnly
      },
      specialEducation:true,schoolType:"special-gymnasium",schoolTrack:"special-gymnasium",
      structureOnly:false,annualMapped:!frameworkOnly,frameworkMapped:frameworkOnly,sourceCurriculumId:entry.id
    };
  }

  if(SG?.status==="verified-structure"&&SG.grades){
    const pilotByKey={
      "a|language":"special-gym-a-language-comprehension","a|math":"special-gym-a-math-problem-reading",
      "b|language":"special-gym-b-language-comprehension","b|math":"special-gym-b-math-problem-reading",
      "c|language":"special-gym-c-language-comprehension","c|math":"special-gym-c-math-problem-reading"
    };
    Object.entries(SG.grades).forEach(([gradeId,grade])=>{
      (grade.subjects||[]).forEach((row)=>{
        const pilotId=pilotByKey[`${gradeId}|${row.id}`];
        if(pilotId&&exposed.some((x)=>x.id===pilotId)) return;

        const annualEntry=annualSpecialGymEntry(gradeId,row.id);
        if(annualEntry){
          registerSubject("middle",gradeId,makeAnnualSpecialGymSubject(annualEntry,row,gradeId),{
            gradeLabel:grade.label,detailedLearning:false,structureOnly:false,annualMapped:annualEntry?.frameworkOnly!==true,
            frameworkMapped:annualEntry?.frameworkOnly===true,subjectKey:row.id,sourceCurriculumId:annualEntry.id
          });
          return;
        }

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

  function specialLyceumGuideFor(gradeId,base){
    const id=String(base?.id||"").toLowerCase();
    const label=String(base?.subjectLabelEl||base?.subjectLabelEn||base?.id||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return (SL?.annualGuidanceIndex||[]).find((g)=>{
      if(!(g.grades||[]).includes(gradeId)) return false;
      const key=String(g.key||"");
      if(key==="language-literature") return /language|literature|greek|νεοελλην/.test(`${id} ${label}`);
      if(key==="biology") return /biology|βιολογ/.test(`${id} ${label}`);
      if(key==="economics") return /econom|οικονομ/.test(`${id} ${label}`);
      if(key==="ancient") return /ancient|αρχαι/.test(`${id} ${label}`);
      if(key==="history") return /history|ιστορι/.test(`${id} ${label}`);
      if(key==="informatics") return /informat|computer|πληροφορ|επιστημη.*η.*υ/.test(`${id} ${label}`);
      if(key==="english") return /english|αγγλικ/.test(`${id} ${label}`);
      if(key==="second-foreign-language") return /foreign|french|german|γαλλ|γερμαν|2η.*ξεν/.test(`${id} ${label}`);
      if(key==="latin") return /latin|λατιν/.test(`${id} ${label}`);
      if(key==="ethics") return /ethics|religion|ηθικ|θρησκευ/.test(`${id} ${label}`);
      return false;
    })||null;
  }

  // Special Lyceum:  // Special Lyceum: one unified AI Help menu. We mirror the already available
  // Lyceum subject catalog for navigation only; this is NOT a claim that every
  // mirrored subject has a separately verified E.A.E. syllabus mapping.
  if(SL?.status==="verified-structure"&&SL.grades){
    Object.entries(SL.grades).forEach(([gradeId,grade])=>{
      (baseHigh[gradeId]||[]).forEach((base,index)=>{
        if(!base?.id||base.specialEducation) return;
        const id=`special-lyceum-${gradeId}-${base.id}`;
        const annualEntry=Object.values(window.AITOOLSKIDS_SPECIAL_LYCEUM_ANNUAL_2026_2027?.entries||{}).find(entry=>entry.gradeId===gradeId&&(entry.sourceSubjectIds||[entry.subjectId]).includes(base.id))||null;
        const frameworkOnly=annualEntry?.frameworkOnly===true||annualEntry?.coverageStatus==="framework";
        const sourceTopics=annualEntry?.officialAnchors?.length?annualEntry.officialAnchors.map(labelEl=>({labelEl,labelEn:labelEl})):(base.topics||[]);
        const topics=sourceTopics.map((topic,i)=>({
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
        const publishedGuide=specialLyceumGuideFor(gradeId,base);
        registerSubject("high",gradeId,{
          id,quizId:null,grade:gradeId,
          subjectLabelEl:`Ειδικό Λύκειο · ${rawEl}`,
          subjectLabelEn:`Special Lyceum · ${rawEn}`,
          topics,
          curriculum:{
            schoolYear:SL.schoolYear,verificationDate:SL.verificationDate,
            verificationBasis:annualEntry?.verificationBasis||(publishedGuide?"official-special-lyceum-guidance-source-indexed":"official-school-type-support-menu"),
            coverageStatus:annualEntry?(frameworkOnly?"annual-framework-verified":"annual-instructions-verified"):(publishedGuide?"special-lyceum-guidance-source-indexed-support":"special-lyceum-support-menu"),
            coverageLabelEl:annualEntry?(frameworkOnly?"Ειδικό Λύκειο · επίσημο πλαίσιο 2026–27":"Ειδικό Λύκειο · Ύλη 2026–27"):(publishedGuide?"Ειδικό Λύκειο · ειδική οδηγία 2026–27 εντοπίστηκε · section mapping σε εξέλιξη":"Ειδικό Λύκειο · υποστηρικτικό μενού μαθημάτων"),
            coverageLabelEn:annualEntry?(frameworkOnly?"Special Lyceum · verified 2026–27 framework":"Special Lyceum · 2026–27 curriculum"):(publishedGuide?"Special Lyceum · official 2026–27 guidance found · section mapping in progress":"Special Lyceum · tutoring subject menu"),
            officialSectionsEl:annualEntry?[...annualEntry.officialAnchors]:[`${grade.labelEl}: υποστηρικτική επιλογή ${rawEl}`],officialSectionsEn:[],
            scopeNoteEl:annualEntry?.verificationNote||SL.scopeNoteEl,scopeNoteEn:frameworkOnly?"Verified framework choices; not a claim of fixed chapter-by-chapter annual syllabus.":SL.scopeNoteEn,
            annualInstructionsStatus:annualEntry?(frameworkOnly?"2026-27-framework-verified":"2026-27-verified"):(publishedGuide?(publishedGuide.status||"published-2026-27"):(SL.annualGuidanceStatus||"official-2026-27-guidance-published")),
            annualInstructionsUrl:annualEntry?.sourceUrl||publishedGuide?.sourceUrlsByGrade?.[gradeId]||publishedGuide?.sourceUrl||SL.sourceUrl,teachingInstructionsStatus:frameworkOnly?"2026-27-framework-verified":"official-guidance-published",
            officialTimetableStatus:"school-type-verified",catalogUrl:SL.sourceUrl,
            sourceLabelEl:annualEntry?.sourceTitle||(publishedGuide?`ΙΕΠ — ειδική οδηγία 2026–27: ${publishedGuide.labelEl}`:SL.sourceLabelEl),
            sourceLabelEn:annualEntry?.sourceTitle||(publishedGuide?`IEP — Special Lyceum 2026–27 guidance: ${publishedGuide.labelEl}`:SL.sourceLabelEn),
            specialEducation:true,schoolType:"special-lyceum",structureOnly:!annualEntry,frameworkOnly,sourceIndexed:!!publishedGuide,publishedGuidanceKey:publishedGuide?.key||""
          },
          specialEducation:true,schoolType:"special-lyceum",schoolTrack:"special-lyceum",structureOnly:!annualEntry,frameworkOnly,sourceIndexed:!!publishedGuide,
          sourceBaseSubjectId:base.id
        },{gradeLabel:grade.labelEl,detailedLearning:false,structureOnly:!annualEntry,annualMapped:!!annualEntry&&!frameworkOnly,frameworkMapped:frameworkOnly,mirroredSupportMenu:!annualEntry,order:index});
      });
    });
  }

  function makeAnnualEneegylSubject(entry){
    const gradeId=eneegylGradeId(entry);
    const partial=entry.coverageStatus==="partial"||entry.coverageStatus==="support-skill"||entry.coverageStatus==="current-exam-syllabus-verified-partial";
    const topics=(entry.officialAnchors||[]).map((label,index)=>({
      id:`${entry.id}.topic-${index+1}`,
      labelEl:String(label),labelEn:String(label),
      explainEl:String(label),explainEn:String(label),
      specialEducation:true,schoolType:"eneegyl"
    }));
    return {
      id:entry.id,quizId:null,grade:gradeId,
      subjectLabelEl:`ΕΝ.Ε.Ε.ΓΥ.-Λ. · ${entry.subject}`,
      subjectLabelEn:`EN.E.E.GY.-L. · ${entry.subject}`,
      topics,
      curriculum:{
        schoolYear:C.schoolYear||"2026-2027",
        verificationDate:entry.verificationDate||C.verificationDate||"",
        verificationBasis:entry.verificationBasis||"annual-instructions-2026-27",
        coverageStatus:partial?"annual-instructions-verified-partial":"annual-instructions-verified",
        coverageLabelEl:partial?"ΕΝ.Ε.Ε.ΓΥ.-Λ. · Μερική χαρτογράφηση 2026–27":"ΕΝ.Ε.Ε.ΓΥ.-Λ. · Ύλη 2026–27",
        coverageLabelEn:partial?"EN.E.E.GY.-L. · verified partial 2026–27 mapping":"EN.E.E.GY.-L. · verified 2026–27 curriculum",
        officialSectionsEl:[...(entry.officialAnchors||[])],officialSectionsEn:[],
        scopeNoteEl:entry.verificationNote||"Χρησιμοποίησε μόνο τις ρητά επαληθευμένες ενότητες της πηγής.",
        scopeNoteEn:partial?"Use only the verified partial source scope.":"Use only the verified 2026-27 source scope.",
        annualInstructionsStatus:entry.annualInstructionsStatus==="verified"?"2026-27-verified":(entry.annualInstructionsStatus||"2026-27-verified"),
        annualInstructionsUrl:entry.sourceUrl||entry.instructionSourceUrl||"",
        teachingInstructionsStatus:entry.annualInstructionsStatus||"verified",
        teachingInstructionsUrl:entry.instructionSourceUrl||entry.sourceUrl||"",
        currentExamSyllabusStatus:entry.currentExamSyllabusStatus||"unknown",
        currentExamSyllabusUrl:entry.currentExamSyllabusStatus==="verified"?(entry.sourceUrl||""):"",
        catalogUrl:entry.sourceUrl||"",
        sourceLabelEl:entry.sourceTitle||"Επίσημη πηγή ΕΝ.Ε.Ε.ΓΥ.-Λ. 2026–27",
        sourceLabelEn:"Official EN.E.E.GY.-L. 2026–27 source",
        specialEducation:true,schoolType:"eneegyl",structureOnly:false,partialMapping:partial,sector:entry.sector||""
      },
      specialEducation:true,schoolType:"eneegyl",schoolTrack:"eneegyl",structureOnly:false,
      partialMapping:partial,sector:entry.sector||"",sourceCurriculumId:entry.id
    };
  }

  // Register verified annual EN.E.E.GY.-L. mappings even when a separate
  // learning-content card has not been authored yet. This keeps the Tutor's
  // chapter selector source-bounded without inventing content.
  Object.values(C.entries||{}).forEach((entry)=>{
    if(entry?.schoolType!=="eneegyl"||entry?.status!=="verified") return;
    if(!Array.isArray(entry.officialAnchors)||!entry.officialAnchors.length) return;
    if(exposed.some((x)=>x.id===entry.id)) return;
    const gradeId=eneegylGradeId(entry);
    registerSubject("high",gradeId,makeAnnualEneegylSubject(entry),{
      gradeLabel:EN?.grades?.[gradeId]?.label||entry.gradeLabel||gradeId,
      detailedLearning:false,structureOnly:false,
      annualMapped:true,partialMapping:entry.coverageStatus==="partial",
      sector:entry.sector||"",sourceCurriculumId:entry.id
    });
  });

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
            annualInstructionsUrl:grade.level==="lyceum"?(row.annualSourceUrl||EN.sourceUrls?.annualInstructions||""):"",
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
