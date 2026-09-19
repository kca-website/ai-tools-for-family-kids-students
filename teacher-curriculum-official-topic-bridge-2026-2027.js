(function(){
  "use strict";
  const catalog=window.AITOOLSKIDS_EPAL_OFFICIAL_GUIDANCE_TOPICS_2026_2027;
  if(!catalog?.get)return;
  const clean=values=>[...new Set((values||[]).map(value=>String(value||"").replace(/\s+/g," ").trim()).filter(Boolean))];
  const topicsFor=label=>{
    const record=catalog.get(label);
    if(!record)return [];
    const topics=clean(record.topics);
    if(topics.length)return topics;
    if(/ολόκληρ|ως έχει το βιβλίο|όλο το βιβλίο/i.test(record.scope||""))return ["Ολόκληρο το σχολικό βιβλίο, σύμφωνα με την επίσημη οδηγία 2026–27"];
    return [];
  };
  const enrich=row=>{
    const topics=topicsFor(row?.label||row?.subject);
    return topics.length?{...row,topics:clean([...(row.topics||[]),...topics]),officialGuidance:true}:row;
  };
  const install=()=>{
    if(typeof window.epalSubjects==="function"&&!window.epalSubjects.__officialTopics){
      const previous=window.epalSubjects;
      const wrapped=function(){return (previous.apply(this,arguments)||[]).map(enrich);};
      wrapped.__officialTopics=true;
      window.epalSubjects=wrapped;
    }
    const entries=window.SPECIAL_EDUCATION_CURRICULUM?.entries;
    if(entries)Object.values(entries).forEach(entry=>{
      if(!["eneegyl","special-gymnasium","special-lyceum"].includes(entry.schoolType))return;
      const topics=topicsFor(entry.subject);
      if(!topics.length)return;
      entry.officialAnchors=clean([...(entry.officialAnchors||[]),...topics]);
      entry.officialGuidanceTopics=true;
    });
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
  window.AITOOLSKIDS_OFFICIAL_TOPIC_BRIDGE_2026_2027=Object.freeze({version:"1.0.0",topicsFor});
})();
