const MAP = require('../gel-schoolbook-source-map-2026-2027.js');
const { resolveOfficialSchoolbookSource } = require('./schoolbook-source');

module.exports = async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'method_not_allowed'});
  res.setHeader('Cache-Control','no-store');
  const subject=String(req.query?.subject||'').trim();
  const row=MAP.get?.(subject);
  if(!row) return res.status(404).json({subject,error:'subject_not_found'});
  const topics=(row.topicMappings||[]).filter(x=>x?.status==='exact-pdf').map(x=>x.label);
  const results=[];
  for(const topic of topics){
    try{
      const r=await resolveOfficialSchoolbookSource(subject,topic,{purpose:''});
      results.push({topic,ok:!!(r?.ok&&r?.body?.grounded&&r?.body?.text),status:Number(r?.status||0),error:r?.body?.error||null,textChars:String(r?.body?.text||'').length,sourceUrl:r?.body?.sourceUrl||null});
    }catch(err){results.push({topic,ok:false,status:500,error:String(err?.message||err)});}
  }
  const failed=results.filter(x=>!x.ok);
  return res.status(200).json({subject,total:results.length,grounded:results.length-failed.length,failed:failed.length,failures:failed});
};
