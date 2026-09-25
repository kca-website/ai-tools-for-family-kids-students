/**
 * curriculum-resolver.js
 * Shared runtime resolver for school subjects and mapped topics.
 *
 * Goal: one read model for Tutor, Curriculum Map and Teacher Assistant.
 * It does not invent curriculum. It only merges source-backed data already
 * present in the loaded catalog, quiz and official-curriculum layers.
 */
(function(){
  "use strict";

  function norm(value){
    return String(value||"")
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .toLowerCase()
      .replace(/[΄’'·.,:;()\/\\-]/g," ")
      .replace(/\s+/g," ").trim();
  }
  function cleanSubject(value){ return String(value||"").split(",")[0].trim(); }
  function uniq(values){ return [...new Set((values||[]).filter(Boolean))]; }
  function topicRank(status){
    status=String(status||"");
    if(/exact-section|annual-instructions-verified|annual-exam-syllabus-verified|panhellenic-2027-verified/.test(status)) return 5;
    if(/official-book-section|related-section-verified/.test(status)) return 4;
    if(/detailed-map|navigation-map/.test(status)) return 3;
    if(/topic-anchor|official-course/.test(status)) return 2;
    return 1;
  }
  function catalogTopicStatus(subject){
    const c=subject?.curriculum||{};
    if(c.annualInstructionsStatus==="2026-27-verified" || c.coverageStatus==="annual-instructions-verified" || c.coverageStatus==="annual-exam-syllabus-verified" || c.coverageStatus==="panhellenic-2027-verified") return "annual-instructions-verified";
    if(c.coverageStatus==="annual-guidance-detailed-map" || c.coverageStatus==="panhellenic-2027-detailed-map") return "navigation-map";
    return "catalog-topic-anchor";
  }
  function labelForTopic(topic){
    return topic?.labelEl || topic?.titleEl || topic?.topicAnchorEl || topic?.officialSectionEl || topic?.id || "";
  }
  function mergeTopics(rows){
    const map=new Map();
    (rows||[]).forEach((row)=>{
      if(!row) return;
      const key=norm(labelForTopic(row));
      if(!key) return;
      const current=map.get(key);
      if(!current || topicRank(row.status)>topicRank(current.status)) map.set(key,row);
      else if(current && !current.sourceUrl && row.sourceUrl) current.sourceUrl=row.sourceUrl;
    });
    return [...map.values()];
  }
  function quizRows(zoneId,gradeId){
    if(typeof QUIZZES==="undefined" || !QUIZZES[zoneId]) return [];
    return Object.values(QUIZZES[zoneId]).filter((q)=>(q.grades||[]).includes(gradeId));
  }
  function catalogRows(zoneId,gradeId){
    return (window.AITOOLSKIDS_TUTOR_CATALOG?.getSubjects?.(zoneId,gradeId) || [])
      .filter((s)=>!s?.specialEducation && !s?.curriculum?.specialEducation && !s?.schoolType);
  }
  function specialCatalogRows(schoolType,zoneId,gradeId){
    return (window.AITOOLSKIDS_TUTOR_CATALOG?.getSubjects?.(zoneId,gradeId) || [])
      .filter((s)=>s?.schoolType===schoolType || s?.curriculum?.schoolType===schoolType);
  }
  function specialGradeMatches(entry,gradeId){
    const raw=String(entry?.gradeId||entry?.grade||"").toLowerCase().replace(/[΄’']/g,"").trim();
    const gid=String(gradeId||"").toLowerCase().trim();
    if(!raw||!gid) return false;
    if(raw===gid) return true;
    const simple=gid.replace(/^(gym|lyc)-/,"");
    const greek={a:"α",b:"β",c:"γ",d:"δ"}[simple]||simple;
    return raw===simple||raw===greek;
  }
  function specialEntryMatchesSubject(entry,s){
    if(!entry||!s) return false;
    if(s.sourceCurriculumId&&entry.id===s.sourceCurriculumId) return true;
    if(entry.id===s.id) return true;
    const refs=[...(entry.sourceSubjectIds||[]),entry.subjectId].filter(Boolean).map(String);
    if(s.sourceBaseSubjectId&&refs.includes(String(s.sourceBaseSubjectId))) return true;
    if(s.quizId&&refs.includes(String(s.quizId))) return true;
    const subjectNorm=norm(entry.subject||"");
    const labelNorm=norm(String(s.subjectLabelEl||"").replace(/^.*?·\s*/,""));
    if(subjectNorm&&labelNorm&&(subjectNorm.includes(labelNorm)||labelNorm.includes(subjectNorm))) return true;
    return refs.some((id)=>norm(s.id||"").includes(norm(id)));
  }
  function liveSpecialEntries(schoolType,gradeId,s){
    const entries=Object.values(window.SPECIAL_EDUCATION_CURRICULUM?.entries||{});
    return entries.filter((entry)=>{
      if(entry?.schoolType!==schoolType) return false;
      if(!specialGradeMatches(entry,gradeId)) return false;
      if(!Array.isArray(entry.officialAnchors)||!entry.officialAnchors.length) return false;
      const status=String(entry.status||"");
      const annual=String(entry.annualInstructionsStatus||"");
      const coverage=String(entry.coverageStatus||"");
      const verified=status==="verified"||status==="verified-framework"||annual==="verified"||annual==="2026-27-verified"||annual==="2026-27-framework-verified"||annual==="framework-verified"||/verified|framework|exact|partial/.test(coverage);
      return verified&&specialEntryMatchesSubject(entry,s);
    });
  }
  function getSpecialSubjects(schoolType,zoneId,gradeId){
    const rows=specialCatalogRows(schoolType,zoneId,gradeId);
    if(schoolType==="eneegyl"){
      const alternate=zoneId==="middle"?"high":"middle";
      rows.push(...specialCatalogRows(schoolType,alternate,gradeId));
    }
    const byId=new Map();
    rows.forEach((s)=>{ if(s?.id&&!byId.has(s.id)) byId.set(s.id,s); });
    return [...byId.values()].map((s)=>{
      const baseCurriculum=s.curriculum||{};
      const live=liveSpecialEntries(schoolType,gradeId,s);
      const preferred=live.find(e=>e.frameworkOnly!==true&&e.coverageStatus!=="framework")||live[0]||null;
      const liveTopics=preferred?(preferred.officialAnchors||[]).map((label,index)=>({
        id:`${preferred.id}.resolved-${index+1}`,
        labelEl:label,labelEn:label,
        status:preferred.frameworkOnly||preferred.coverageStatus==="framework"||preferred.status==="verified-framework"?"verified-framework":
          preferred.coverageStatus==="panhellenic-verified"?"panhellenic-2027-verified":
          preferred.coverageStatus==="exam-verified"?"annual-exam-syllabus-verified":
          "annual-instructions-verified",
        sourceType:"special-current-entry",
        sourceUrl:preferred.sourceUrl||preferred.instructionSourceUrl||"",
        sourceLabelEl:preferred.sourceTitle||"Επίσημη πηγή 2026–27",
        sourceLabelEn:preferred.sourceTitle||"Official 2026–27 source"
      })):[];
      const structureOnly=!!(s.structureOnly||baseCurriculum.structureOnly) && !liveTopics.length;
      const rawTopics=(s.topics||[]).filter((t)=>!t?.specialSupportAction);
      const baseTopics=structureOnly?[]:rawTopics.map((t)=>Object.assign({},t,{
        status:t.status||(
          baseCurriculum.annualInstructionsStatus==="2026-27-verified"?"annual-instructions-verified":
          baseCurriculum.annualInstructionsStatus==="2026-27-framework-verified"?"verified-framework":
          baseCurriculum.coverageStatus==="panhellenic-2027-verified"?"panhellenic-2027-verified":
          baseCurriculum.coverageStatus==="annual-exam-syllabus-verified"?"annual-exam-syllabus-verified":
          "mapped-navigation"
        ),
        sourceUrl:t.sourceUrl||baseCurriculum.annualInstructionsUrl||baseCurriculum.examSyllabusUrl||baseCurriculum.catalogUrl||""
      }));
      const topics=mergeTopics([...liveTopics,...baseTopics]);
      const curriculum=preferred?Object.assign({},baseCurriculum,{
        schoolYear:preferred.schoolYear||baseCurriculum.schoolYear||"2026-2027",
        verificationDate:preferred.verificationDate||baseCurriculum.verificationDate||"",
        coverageStatus:preferred.frameworkOnly||preferred.coverageStatus==="framework"?"annual-framework-verified":
          preferred.coverageStatus==="panhellenic-verified"?"panhellenic-2027-verified":
          preferred.coverageStatus==="exam-verified"?"annual-exam-syllabus-verified":
          "annual-instructions-verified",
        annualInstructionsStatus:preferred.frameworkOnly||preferred.coverageStatus==="framework"||preferred.status==="verified-framework"?"2026-27-framework-verified":"2026-27-verified",
        annualInstructionsUrl:preferred.sourceUrl||preferred.instructionSourceUrl||baseCurriculum.annualInstructionsUrl||"",
        sourceLabelEl:preferred.sourceTitle||baseCurriculum.sourceLabelEl||"",
        specialEducation:true,schoolType,
        structureOnly:false,frameworkOnly:!!(preferred.frameworkOnly||preferred.coverageStatus==="framework"||preferred.status==="verified-framework")
      }):baseCurriculum;
      return Object.assign({},s,{topics,curriculum,structureOnly,hasMappedTopics:topics.length>0,resolvedSpecialEntryId:preferred?.id||""});
    });
  }
  function officialForQuiz(quizId){
    const layer=window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    return layer?.getByQuizId?.(quizId) || layer?.byQuiz?.[quizId] || null;
  }
  function matchingGapRows(ids){
    const layer=window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    if(!layer) return [];
    const wanted=new Set((ids||[]).filter(Boolean));
    return Object.entries(layer.gapAlignment||{}).filter(([gapId,a])=>{
      const refs=[a?.sourceQuizId,a?.quizId,a?.parentQuizId,a?.courseId].filter(Boolean);
      return refs.some((id)=>wanted.has(id));
    });
  }
  function topicsForResolvedSubject(subject){
    const rows=[];
    const catalog=subject.catalogSubject;
    const quiz=subject.quiz;
    const official=subject.officialCurriculum;
    let preferCurrentCatalogTopics=false;
    if(catalog){
      const status=catalogTopicStatus(catalog);
      const c=catalog.curriculum||{};
      const currentMapped = c.schoolYear==="2026-2027" && (
        c.annualInstructionsStatus==="2026-27-verified" ||
        c.coverageStatus==="annual-instructions-verified" ||
        c.coverageStatus==="annual-exam-syllabus-verified" ||
        c.coverageStatus==="panhellenic-2027-verified" ||
        c.coverageStatus==="annual-guidance-detailed-map" ||
        c.coverageStatus==="panhellenic-2027-detailed-map"
      );
      preferCurrentCatalogTopics = currentMapped && (catalog.topics||[]).some((t)=>!t?.specialSupportAction);
      const visibleCatalogTopics=(catalog.topics||[]).filter((t)=>currentMapped || t?.specialSupportAction);
      visibleCatalogTopics.forEach((t)=>rows.push(Object.assign({},t,{
        id:t.id || (catalog.id+".topic."+rows.length),
        status:t.status||status,
        sourceType:"catalog",
        sourceUrl:t.sourceUrl||c.annualInstructionsUrl||c.examSyllabusUrl||c.catalogUrl||"",
        sourceLabelEl:c.sourceLabelEl||c.coverageLabelEl||"",
        sourceLabelEn:c.sourceLabelEn||c.coverageLabelEn||""
      })));
    }
    const bookSections=window.AITOOLSKIDS_GENERAL_ED_BOOK_SECTIONS_2026_2027?.get?.(subject.quizId||subject.id)||null;
    if(bookSections?.sections?.length && !preferCurrentCatalogTopics){
      bookSections.sections.forEach((label,i)=>rows.push({
        id:(subject.quizId||subject.id)+".verified-book-section-"+(i+1),
        labelEl:label,labelEn:label,
        status:"official-book-section-verified",
        sourceType:"official-book-section",
        sourceUrl:bookSections.sourceUrl||"",
        sourceLabelEl:"Διαδραστικά Σχολικά Βιβλία · επίσημα περιεχόμενα",
        sourceLabelEn:"Interactive School Textbooks · official contents"
      }));
    }
    if(official){
      const en=official.officialSectionsEn||[];
      (official.officialSectionsEl||[]).forEach((label,i)=>rows.push({
        id:(subject.quizId||subject.id)+".official-section-"+(i+1),
        labelEl:label,labelEn:en[i]||label,
        status:"official-book-section-verified",
        sourceType:"official-section",
        sourceUrl:official.annualInstructionsUrl||official.officialBook?.url||official.catalogUrl||"",
        sourceLabelEl:official.sourceLabelEl||official.coverageLabelEl||"",
        sourceLabelEn:official.sourceLabelEn||official.coverageLabelEn||""
      }));
      if(String(official.coverageStatus||"").includes("detailed-map")){
        const men=official.mappedTopicsEn||[];
        (official.mappedTopicsEl||[]).forEach((label,i)=>rows.push({
          id:(subject.quizId||subject.id)+".mapped-topic-"+(i+1),
          labelEl:label,labelEn:men[i]||label,status:"navigation-map",sourceType:"official-map",
          sourceUrl:official.annualInstructionsUrl||official.catalogUrl||"",
          sourceLabelEl:official.sourceLabelEl||official.coverageLabelEl||"",
          sourceLabelEn:official.sourceLabelEn||official.coverageLabelEn||""
        }));
      }
    }
    const ids=uniq([subject.id,subject.quizId,catalog?.id,catalog?.quizId,quiz?.id,...(subject.aliases||[])]);
    matchingGapRows(ids).forEach(([gapId,a])=>{
      const gap=typeof GAP_TAGS!=="undefined"?GAP_TAGS[gapId]:null;
      const exact=a?.status==="exact-section-verified" || a?.status==="related-section-verified";
      rows.push({
        id:gapId,
        labelEl:(exact?a?.officialSectionEl:null)||a?.topicAnchorEl||gap?.labelEl||gapId,
        labelEn:(exact?a?.officialSectionEn:null)||a?.topicAnchorEn||gap?.labelEn||gap?.labelEl||gapId,
        status:a?.status||"official-course-topic-anchor",
        sourceType:"gap-alignment",
        sourceUrl:a?.sourceUrl||"",
        sourceLabelEl:a?.statusLabelEl||"",
        sourceLabelEn:a?.statusLabelEn||""
      });
    });
    return mergeTopics(rows);
  }

  function getSubjects(zoneId,gradeId){
    const byName=new Map();
    function ensure(label,seed){
      const key=norm(cleanSubject(label));
      if(!key) return null;
      if(!byName.has(key)) byName.set(key,Object.assign({
        id:seed?.id||"",quizId:seed?.quizId||"",subjectLabelEl:label,subjectLabelEn:seed?.subjectLabelEn||label,
        aliases:[],catalogSubject:null,quiz:null,officialCurriculum:null,curriculum:null
      },seed||{}));
      return byName.get(key);
    }

    catalogRows(zoneId,gradeId).forEach((s)=>{
      const row=ensure(s.subjectLabelEl||s.id,{id:s.id,quizId:s.quizId||"",subjectLabelEl:s.subjectLabelEl||s.id,subjectLabelEn:s.subjectLabelEn||s.subjectLabelEl||s.id,catalogSubject:s,curriculum:s.curriculum||null});
      if(row){ row.aliases=uniq([...(row.aliases||[]),s.id,s.quizId]); }
    });
    quizRows(zoneId,gradeId).forEach((q)=>{
      const row=ensure(q.subjectLabelEl||q.id,{id:q.id,quizId:q.id,subjectLabelEl:q.subjectLabelEl||q.id,subjectLabelEn:q.subjectLabelEn||q.subjectLabelEl||q.id});
      if(!row) return;
      row.quiz=q; row.quizId=q.id;
      if(!row.id) row.id=q.id;
      row.aliases=uniq([...(row.aliases||[]),q.id]);
    });

    const layer=window.AITOOLSKIDS_OFFICIAL_CURRICULUM;
    Object.entries(layer?.byQuiz||{}).forEach(([qid,o])=>{
      if(o?.zone && o.zone!==zoneId) return;
      const q=(typeof QUIZZES!=="undefined" && QUIZZES[zoneId])?QUIZZES[zoneId][qid]:null;
      if(q && !(q.grades||[]).includes(gradeId)) return;
      let row=q?byName.get(norm(cleanSubject(q.subjectLabelEl||qid))):null;
      if(!row){
        const title=o?.quizTitleEl||"";
        const gradeToken=norm(title);
        const gradeHints={a:[" α "," a ","1"],b:[" β "," b ","2"],c:[" γ "," c ","3"],d:[" δ "," d ","4"],e:[" ε "," e ","5"],st:[" στ "," st ","6"]};
        if(!title || !(gradeHints[gradeId]||[]).some((x)=>(" "+gradeToken+" ").includes(x))) return;
        row=ensure(title,{id:qid,quizId:qid,subjectLabelEl:title,subjectLabelEn:o?.quizTitleEn||title});
      }
      if(row){ row.officialCurriculum=o; row.quizId=row.quizId||qid; row.aliases=uniq([...(row.aliases||[]),qid]); }
    });

    const resolved=[...byName.values()].map((row)=>{
      if(!row.officialCurriculum && row.quizId) row.officialCurriculum=officialForQuiz(row.quizId);
      const topics=topicsForResolvedSubject(row);
      const statuses=topics.map((t)=>t.status||"");
      const annual=statuses.some((s)=>/annual-instructions-verified|annual-exam-syllabus-verified|panhellenic-2027-verified|exact-section/.test(s));
      const officialSections=statuses.some((s)=>/official-book-section|related-section/.test(s));
      const mode=annual?"verified-annual":officialSections?"verified-official-sections":topics.length?"mapped-navigation":"unmapped";
      return Object.assign({},row.catalogSubject||row.quiz||{},row,{
        id:row.catalogSubject?.id||row.id||row.quizId,
        quizId:row.quizId||row.quiz?.id||row.catalogSubject?.quizId||"",
        subjectLabelEl:row.catalogSubject?.subjectLabelEl||row.quiz?.subjectLabelEl||row.subjectLabelEl,
        subjectLabelEn:row.catalogSubject?.subjectLabelEn||row.quiz?.subjectLabelEn||row.subjectLabelEn,
        curriculum:row.catalogSubject?.curriculum||row.officialCurriculum||row.curriculum||null,
        topics,topicMode:mode,hasMappedTopics:topics.length>0
      });
    });
    const modeRank={unmapped:0,"mapped-navigation":1,"verified-official-sections":2,"verified-annual":3};
    const dedup=new Map();
    resolved.forEach((s)=>{
      const key=s.quizId?("quiz:"+s.quizId):("id:"+(s.id||norm(cleanSubject(s.subjectLabelEl))));
      const current=dedup.get(key);
      if(!current){ dedup.set(key,s); return; }
      const currentScore=(modeRank[current.topicMode]||0)*100+(current.topics||[]).length;
      const nextScore=(modeRank[s.topicMode]||0)*100+(s.topics||[]).length;
      const preferred=nextScore>currentScore?s:current;
      const other=preferred===s?current:s;
      preferred.topics=mergeTopics([...(preferred.topics||[]),...(other.topics||[])]);
      preferred.aliases=uniq([...(preferred.aliases||[]),...(other.aliases||[]),other.id,other.quizId]);
      if(!preferred.officialCurriculum && other.officialCurriculum) preferred.officialCurriculum=other.officialCurriculum;
      dedup.set(key,preferred);
    });
    return [...dedup.values()].sort((a,b)=>String(a.subjectLabelEl||"").localeCompare(String(b.subjectLabelEl||""),"el"));
  }
  function getSubject(zoneId,gradeId,subjectId){
    const wanted=String(subjectId||"");
    return getSubjects(zoneId,gradeId).find((s)=>s.id===wanted || s.quizId===wanted || (s.aliases||[]).includes(wanted)) || null;
  }
  function getTopics(zoneId,gradeId,subjectId){
    return getSubject(zoneId,gradeId,subjectId)?.topics || [];
  }

  window.AITOOLSKIDS_CURRICULUM_RESOLVER=Object.freeze({norm,cleanSubject,getSubjects,getSubject,getTopics,getSpecialSubjects});
})();