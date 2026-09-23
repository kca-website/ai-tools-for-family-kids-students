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
    return window.AITOOLSKIDS_TUTOR_CATALOG?.getSubjects?.(zoneId,gradeId) || [];
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
    if(catalog){
      const status=catalogTopicStatus(catalog);
      const c=catalog.curriculum||{};
      (catalog.topics||[]).forEach((t)=>rows.push(Object.assign({},t,{
        id:t.id || (catalog.id+".topic."+rows.length),
        status:t.status||status,
        sourceType:"catalog",
        sourceUrl:t.sourceUrl||c.annualInstructionsUrl||c.examSyllabusUrl||c.catalogUrl||"",
        sourceLabelEl:c.sourceLabelEl||c.coverageLabelEl||"",
        sourceLabelEn:c.sourceLabelEn||c.coverageLabelEn||""
      })));
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

    return [...byName.values()].map((row)=>{
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
    }).sort((a,b)=>String(a.subjectLabelEl||"").localeCompare(String(b.subjectLabelEl||""),"el"));
  }
  function getSubject(zoneId,gradeId,subjectId){
    const wanted=String(subjectId||"");
    return getSubjects(zoneId,gradeId).find((s)=>s.id===wanted || s.quizId===wanted || (s.aliases||[]).includes(wanted)) || null;
  }
  function getTopics(zoneId,gradeId,subjectId){
    return getSubject(zoneId,gradeId,subjectId)?.topics || [];
  }

  window.AITOOLSKIDS_CURRICULUM_RESOLVER=Object.freeze({norm,cleanSubject,getSubjects,getSubject,getTopics});
})();