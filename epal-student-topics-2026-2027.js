(function(){
  "use strict";

  /* Never infer curriculum from the course title. A selectable unit is exposed
     only when verified curriculum data supplies it in currentTopics. */
  function cleanGuidanceTopics(values=[]){
    return (values||[]).map(value=>String(value||"").trim()).filter(value=>{
      if(!value) return false;
      const plain=value.toLowerCase().replace(/[–—:.;,]/g," ").replace(/\s+/g," ").trim();
      return !/^(?:κεφαλαια?\s+ενοτητες?|κεφαλαιο|κεφ|ενοτητα)$/.test(plain);
    });
  }
  function scopeUnits(scope){
    const text=String(scope||"").trim();
    if(!text) return [];
    const pieces=text.split(/[•]/).map(x=>x.replace(/^[-–—\s]+/,"").trim()).filter(Boolean);
    const specific=pieces.filter(x=>/(?:κεφάλαι(?:ο|α)|κεφ\.|ενότητα|σελ\.?\s*\d|σελίδ|ολόκληρ|όλο\s+το\s+βιβλίο|ως\s+έχει\s+το\s+βιβλίο)/i.test(x));
    if(specific.length>=2) return specific.map(x=>`Επίσημη έκταση — ${x}`);
    const usable=/(?:όλα|όλες|όλο\s+το\s+βιβλίο|ολόκληρ|ως\s+έχει\s+το\s+βιβλίο|σελ\.?\s*\d|σελίδ(?:α|ες)?\s*\d|κεφάλαι(?:ο|α)\s*\d|κεφ\.\s*\d|ενότητες?\s*\d)/i.test(text);
    return usable?[`Επίσημη έκταση ύλης — ${text}`]:[];
  }
  function resolve(label,currentTopics=[]){
    const officialExamTopics=window.AITOOLSKIDS_EPAL_PANHELLENIC_2027?.getTopics?.(label)||[];
    const guidanceRecord=window.AITOOLSKIDS_EPAL_OFFICIAL_GUIDANCE_TOPICS_2026_2027?.get?.(label)||null;
    const officialGuidanceTopics=cleanGuidanceTopics(guidanceRecord?.topics||[]);
    const hasCurrent=Array.isArray(currentTopics)&&currentTopics.length>0;
    const fromExamSyllabus=!hasCurrent&&officialExamTopics.length>0;
    const scope=String(guidanceRecord?.scope||"").trim();
    const scopeTopics=!officialGuidanceTopics.length?scopeUnits(scope):[];
    const fromOfficialGuidance=!hasCurrent&&!fromExamSyllabus&&(officialGuidanceTopics.length>0||scopeTopics.length>0);
    const sourceTopics=hasCurrent?currentTopics:(fromExamSyllabus?officialExamTopics:(officialGuidanceTopics.length?officialGuidanceTopics:scopeTopics));
    const sourceUrls=window.EPAL_2026_2027_TEACHER_STRUCTURE?.sourceUrls||{};
    const officialSourceUrl=fromExamSyllabus
      ?window.AITOOLSKIDS_EPAL_PANHELLENIC_2027.sourceUrl
      :(fromOfficialGuidance?sourceUrls[guidanceRecord.sourceKey]||sourceUrls.epalHub||"":"");
    const verified=(Array.isArray(sourceTopics)?sourceTopics:[])
      .map(value=>String(value||"").trim())
      .filter(Boolean)
      .map(label=>({
        label,
        officialExact:true,
        sourceUrl:officialSourceUrl,
        sourceKind:fromExamSyllabus?"panhellenic-2027":"annual-guidance"
      }));

    if(verified.length) return verified;

    return [{
      label:"Γράψε τον ακριβή τίτλο κεφαλαίου ή ενότητας από το βιβλίο/την εγκύκλιο",
      officialExact:false,
      customTitle:true
    }];
  }

  window.AITOOLSKIDS_EPAL_STUDENT_TOPICS_2026_2027=Object.freeze({
    version:"2.2.0",
    verified:"2026-09-19",
    resolve,
    exactCount:(window.AITOOLSKIDS_EPAL_PANHELLENIC_2027?.mappedSubjects?.length||0)+(window.AITOOLSKIDS_EPAL_OFFICIAL_GUIDANCE_TOPICS_2026_2027?.recordCount||0),
    note:"No inferred or keyword-generated curriculum is exposed. Only verified encoded units are selectable; otherwise the learner supplies the exact official title."
  });
})();
